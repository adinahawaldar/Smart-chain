require('dotenv').config()

const express    = require('express')
const http       = require('http')
const { Server } = require('socket.io')
const cors       = require('cors')

const connectDB          = require('./config/db')
const { seedIfEmpty }    = require('./seed/seedData')
const state              = require('./state/runtimeState')
const { tick }           = require('./services/movementEngine')

const app    = express()
const server = http.createServer(app)

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

const io = new Server(server, {
  cors: {
    origin:  CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
})
state.io = io

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }))
app.use(express.json({ limit: '10mb' }))

// ── Routes ───────────────────────────────────────────────────────────────────
app.get('/health', (req, res) =>
  res.json({ status: 'ok', service: 'smartchain-backend', uptime: Math.round(process.uptime()) })
)

app.use('/shipments', require('./routes/shipments'))
app.use('/simulate',  require('./routes/simulate'))
app.use('/chat',      require('./routes/chat'))
app.use('/telemetry', require('./routes/telemetry'))

// ── Socket.IO ────────────────────────────────────────────────────────────────
io.on('connection', socket => {
  console.log(`🔌 Client connected:    ${socket.id}`)

  // Push current state immediately on connect
  socket.emit('shipments:update', state.shipments)
  socket.emit('events:init', state.events.slice(0, 30))

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`)
  })
})

// ── Startup ──────────────────────────────────────────────────────────────────
const PORT    = parseInt(process.env.PORT)    || 5000
const TICK_MS = parseInt(process.env.TICK_MS) || 1000

;(async () => {
  await connectDB()
  await seedIfEmpty()

  server.listen(PORT, () => {
    console.log(`\n🚀 SmartChain backend  → http://localhost:${PORT}`)
    console.log(`📡 Socket.IO ready     → ws://localhost:${PORT}`)
    console.log(`⏱  Tick interval       → ${TICK_MS}ms`)
    console.log(`🌐 CORS origin         → ${CLIENT_ORIGIN}\n`)
  })

  // ── Movement tick loop ────────────────────────────────────────────────────
  setInterval(() => {
    const newEvents = tick()

    // Push shipment positions to all clients
    io.emit('shipments:update', state.shipments)

    // Push any new events
    for (const ev of newEvents) {
      state.events.unshift(ev)
      io.emit('events:new', ev)
    }

    // Cap event history
    if (state.events.length > 100) {
      state.events = state.events.slice(0, 100)
    }

    // Record telemetry snapshot
    const active   = state.shipments.filter(s => s.active)
    const avgRisk  = state.shipments.length
      ? Math.round(state.shipments.reduce((a, s) => a + s.riskScore, 0) / state.shipments.length)
      : 0
    const avgSpeed = active.length
      ? Math.round(active.reduce((a, s) => a + s.speedKmph * (s.speedFactor || 1), 0) / active.length)
      : 0

    state.tickHistory.push({ timestamp: new Date().toISOString(), avgRisk, avgSpeed })
    if (state.tickHistory.length > 30) state.tickHistory.shift()

  }, TICK_MS)
})()
