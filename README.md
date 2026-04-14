#  SmartChain — AI Supply Chain Control Tower

A hackathon-ready, enterprise-grade logistics command center built with a **MERN + Python FastAPI hybrid architecture**.

---

## Why MERN + Python?

| Concern | Technology | Why |
|---|---|---|
| Real-time API, CRUD, streaming | Node.js + Express | Fast I/O, Socket.IO native, npm ecosystem |
| Persistence | MongoDB + Mongoose | Flexible schema for evolving shipment models |
| Real-time push | Socket.IO | Sub-second delivery to all connected clients |
| AI/ML logic | Python FastAPI | Best ecosystem for ML, future model plug-in |
| Frontend | React + Vite + Tailwind | Modern DX, fast HMR, utility-first CSS |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER (React + Vite)                   │
│  LandingPage → Dashboard → [Map, Table, Telemetry, Feed]    │
│  Socket.IO client  │  Axios HTTP  │  PapaParse CSV          │
└────────────┬───────────────────────────┬────────────────────┘
             │ WS (Socket.IO)            │ HTTP REST
             ▼                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Node.js + Express  (port 5000)                  │
│  ┌─────────────────┐  ┌─────────────────────────────────┐  │
│  │  Movement Engine │  │  Routes                         │  │
│  │  (tick every 1s) │  │  GET  /shipments                │  │
│  │  Route-based     │  │  GET  /shipments/tick           │  │
│  │  interpolation   │  │  POST /shipments/:id/reroute    │  │
│  │  Heading calc    │  │  POST /shipments/ingest-csv     │  │
│  │  ETA decay       │  │  POST /simulate                 │  │
│  └────────┬────────┘  │  POST /chat                     │  │
│           │ emit       │  GET  /telemetry/summary        │  │
│           ▼            │  GET  /health                   │  │
│  Socket.IO Server      └──────────────┬──────────────────┘  │
│  (shipments:update)                   │ Axios forward        │
│  (events:new)                         ▼                      │
│  ┌──────────────────┐   ┌───────────────────────────────┐  │
│  │  Runtime State   │   │  Python FastAPI  (port 8001)  │  │
│  │  (in-memory)     │   │  POST /simulate-risk          │  │
│  │  shipments[]     │   │  POST /chat-response          │  │
│  │  events[]        │   │  GET  /health                 │  │
│  │  tickHistory[]   │   │  Rule-based NLP engine        │  │
│  └──────────────────┘   └───────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            MongoDB  (port 27017)                      │  │
│  │  collections: shipments, events                       │  │
│  │  Seeded on startup if empty                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
smartchain/
├── README.md
├── sample-import.csv          ← test CSV for import feature
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── api/
│       │   ├── client.js          ← Axios base client
│       │   └── endpoints.js       ← All API calls
│       ├── hooks/
│       │   ├── useShipmentsStream.js  ← Socket.IO + polling fallback
│       │   └── useSimulation.js
│       ├── utils/
│       │   ├── geo.js             ← Haversine, bearing
│       │   ├── format.js          ← ETA, speed, temp formatters
│       │   └── risk.js            ← Risk band, severity styles
│       └── components/
│           ├── LandingPage.jsx
│           ├── Dashboard.jsx
│           ├── GlassCard.jsx
│           ├── KpiCards.jsx
│           ├── LiveMap.jsx
│           ├── ShipmentTable.jsx
│           ├── TelemetryPanel.jsx
│           ├── EventFeed.jsx
│           ├── AIInsightsPanel.jsx
│           ├── SimulationPanel.jsx
│           ├── ReroutingModal.jsx
│           ├── Chatbot.jsx
│           └── LoadingSkeleton.jsx
├── backend/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── index.js               ← Express app + Socket.IO + tick loop
│       ├── config/
│       │   └── db.js              ← MongoDB connection (graceful fallback)
│       ├── models/
│       │   ├── Shipment.js        ← Mongoose schema
│       │   └── Event.js
│       ├── seed/
│       │   └── seedData.js        ← 5 shipments seeded on startup
│       ├── services/
│       │   ├── aiClient.js        ← Axios calls to Python FastAPI
│       │   ├── movementEngine.js  ← Route interpolation tick logic
│       │   ├── riskEngine.js      ← Risk bands, disruption, on-time %
│       │   └── eventEngine.js     ← Event factory + geofence checks
│       ├── state/
│       │   └── runtimeState.js    ← In-memory live state
│       ├── routes/
│       │   ├── shipments.js
│       │   ├── simulate.js
│       │   ├── chat.js
│       │   └── telemetry.js
│       └── controllers/
│           ├── shipmentsController.js
│           ├── simulateController.js
│           ├── chatController.js
│           └── telemetryController.js
└── ai-service/
    ├── requirements.txt
    └── main.py                    ← FastAPI AI service
```

---

## Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.10
- **MongoDB** ≥ 6 (optional — app runs without it using in-memory data)
- **Google Maps API Key** (optional — a clean fallback UI is shown without it)

---

## Local Setup

### 1. Clone & root setup
```bash
git clone <repo-url>
cd smartchain
```

### 2. Python AI Service
```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
# → http://localhost:8001/health
```

### 3. Node Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env:
#   MONGODB_URI=mongodb://127.0.0.1:27017/smartchain
#   AI_SERVICE_URL=http://localhost:8001
npm run dev
# → http://localhost:5000/health
```

### 4. React Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env:
#   VITE_BACKEND_URL=http://localhost:5000
#   VITE_GOOGLE_MAPS_API_KEY=<your_key>
npm run dev
# → http://localhost:5173
```

---

## Environment Variables

### `backend/.env`
| Variable | Default | Description |
|---|---|---|
| `PORT` | 5000 | Express server port |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/smartchain` | MongoDB connection string |
| `AI_SERVICE_URL` | `http://localhost:8001` | Python FastAPI base URL |
| `TICK_MS` | 1000 | Movement engine tick interval (ms) |
| `CLIENT_ORIGIN` | `http://localhost:5173` | CORS allowed origin |

### `frontend/.env`
| Variable | Default | Description |
|---|---|---|
| `VITE_BACKEND_URL` | `http://localhost:5000` | Node backend base URL |
| `VITE_GOOGLE_MAPS_API_KEY` | *(empty)* | Google Maps JS API key |

---

## Real-Time Movement Engine

Every `TICK_MS` (default 1000ms), the movement engine:

1. **Computes distance per tick**: `effectiveSpeed (km/h) × (TICK_S / 3600)` = km per tick
2. **Advances `legProgress`**: distance per tick ÷ leg distance
3. **Handles multi-leg advancement**: if `legProgress ≥ 1`, moves to next waypoint and carries over remainder
4. **Interpolates `currentPosition`**: linear lerp between `route[legIndex]` and `route[legIndex+1]`
5. **Computes bearing**: `atan2` formula → `headingDeg` rotates truck marker
6. **Updates progress %**: covered distance ÷ total route distance
7. **Decays ETA**: remaining distance ÷ effective speed
8. **Status transitions**:
   - `progressPct ≥ 85` → `Near Destination`
   - `riskScore ≥ 75 AND effectiveSpeed < 25` → `Delayed`
   - `progressPct = 100` → `Delivered`, `active = false`
9. **Checks geofences**: 7 regional zones — entry/exit events emitted
10. **Emits via Socket.IO**: `shipments:update` + any `events:new`

---

## Simulation Flow

```
User clicks "Run Simulation" (frontend)
  → POST /simulate { disruption: "storm" }    (Node backend)
    → POST /simulate-risk { disruption, shipments } (Python FastAPI)
      ← { shipments: [...], insight: "...", speedFactor: 0.45 }
    ← Apply risk+speed updates to runtimeState
    ← Emit shipments:update via Socket.IO
    ← Return { success, speedFactor, insight, events }
  → Frontend shows toast + updates AIInsightsPanel
```

**Fallback**: If Python AI service is down, Node's local `riskEngine.js` handles the simulation with the same logic.

---

## API Reference

### Node Backend (port 5000)

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Service health check |
| `GET` | `/shipments` | All shipments (from runtime state) |
| `GET` | `/shipments/tick` | Polling fallback — returns current state |
| `POST` | `/shipments/:id/reroute` | Approve reroute `{ routeChoice: "A"|"B" }` |
| `POST` | `/shipments/ingest-csv` | Bulk import `{ rows: [...] }` |
| `POST` | `/simulate` | Run disruption `{ disruption: "storm"|"traffic"|"strike" }` |
| `POST` | `/chat` | AI chat `{ query: "..." }` |
| `GET` | `/telemetry/summary` | Avg risk, speed, on-time %, tick history |

### Socket.IO Events (port 5000)

| Event | Direction | Payload |
|---|---|---|
| `shipments:update` | Server → Client | `Shipment[]` |
| `events:new` | Server → Client | `Event` |
| `events:init` | Server → Client | `Event[]` (on connect) |

### Python AI Service (port 8001)

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Service health |
| `POST` | `/simulate-risk` | `{ disruption, shipments }` → `{ shipments, insight, speedFactor }` |
| `POST` | `/chat-response` | `{ query, context }` → `{ response, confidence }` |

---

## Demo Walkthrough (Presenter Script)

1. **Landing page** — Show the hero, features, and tech stack section. Point out MERN + Python architecture.

2. **Enter dashboard** — 4 trucks already moving across India in real-time. Explain the Socket.IO connection indicator (top right).

3. **Live map** — Click a truck marker. Show the info window: ID, risk, ETA, speed, temperature.

4. **KPI cards** — Point to High Risk count (S104 starts at 82). Explain risk bands.

5. **Shipment table** — Sort by Risk descending. S104 shows red Reroute button.

6. **Click Reroute on S104** — Modal shows Route A vs B with cost/time trade-offs. Approve Route B. Show toast + event feed entry + risk drops.

7. **Simulation** — Select Storm. Click Run Simulation. Show: toast appears, risk scores jump, speed decreases on telemetry chart, AI insights update, event feed logs the simulation event.

8. **AI Chatbot** — Open (🤖 button). Ask "Which shipment is highest risk?". Then "Should I reroute any shipments?". Show shipment-aware responses.

9. **CSV Import** — Click Import CSV button. Upload `sample-import.csv`. Show toast "4 imported". Scroll table to see new At Hub shipments.

10. **Telemetry panel** — Point to rolling chart. Show on-time probability degradation after storm simulation.

---

## Troubleshooting

### Google Maps shows blank / error
- Ensure `VITE_GOOGLE_MAPS_API_KEY` is set in `frontend/.env`
- Enable **Maps JavaScript API** in Google Cloud Console
- Add `http://localhost:5173` to API key's allowed referrers
- **Without a key**: the app shows a clean fallback card grid — all other features work normally

### CORS errors
- Ensure `CLIENT_ORIGIN=http://localhost:5173` in `backend/.env`
- Ensure Vite is running on port 5173 (default)

### MongoDB connection failed
- The app continues with **in-memory seed data** — no features are lost for prototyping
- Start MongoDB: `mongod --dbpath ~/data/db` or use MongoDB Atlas

### Socket.IO not connecting
- Check the backend is running on port 5000
- The frontend automatically falls back to HTTP polling every 2 seconds
- The connection indicator in the header shows "Live" (green) or "Polling" (amber)

### Python AI service unavailable
- Both `/simulate` and `/chat` fall back to local Node.js logic automatically
- No user-facing error — the app degrades gracefully

### Trucks not moving
- Confirm `TICK_MS=1000` in `backend/.env`
- Check browser console for Socket.IO connection errors
- Verify `/shipments` returns `active: true` shipments with valid `route` arrays

---

## 🤖 Gemini Copilot Setup

The AI chatbot is powered by **Google Gemini 1.5 Flash**. Here's how to activate it:

### Step 1 — Get a free Gemini API key
1. Go to [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Click **Create API Key** → copy it

### Step 2 — Add to ai-service environment
```bash
cd ai-service
cp .env.example .env
# Edit .env:
GEMINI_API_KEY=your_actual_key_here
```

### Step 3 — Restart ai-service
```bash
uvicorn main:app --reload --port 8001
# You should see: ✅ Gemini 1.5 Flash copilot ENABLED
```

### What changes with Gemini enabled:
| Feature | Without Gemini | With Gemini |
|---|---|---|
| Chat responses | Rule-based keyword matching | Real AI — context-aware, natural language |
| Simulation insights | Preset paragraphs | Gemini generates fresh insight each time |
| Source badge in chat | ⚙ Rule-based | ✦ Gemini 1.5 Flash |

### Fallback behaviour:
If Gemini is down, quota hit, or key missing — the app **automatically falls back** to rule-based responses. Zero downtime, zero user-facing errors.

### /health endpoint shows Gemini status:
```json
{
  "gemini_enabled": true,
  "model": "gemini-1.5-flash"
}
```
