import { useState, useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'
import { api } from '../api/endpoints'
import { BASE } from '../api/client'

export default function useShipmentsStream() {
  const [shipments,   setShipments]   = useState([])
  const [events,      setEvents]      = useState([])
  const [connected,   setConnected]   = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const socketRef = useRef(null)
  const pollRef   = useRef(null)

  const updateShipments = useCallback(data => {
    if (Array.isArray(data)) {
      setShipments(data)
      setLastUpdated(new Date())
      setLoading(false)
      setError(null)
    }
  }, [])

  const addEvent = useCallback(ev => {
    setEvents(prev => [ev, ...prev].slice(0, 60))
  }, [])

  useEffect(() => {
    const socket = io(BASE, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      timeout: 6000,
    })
    socketRef.current = socket

    function startPolling() {
      if (pollRef.current) return
      console.warn('Socket.IO unavailable — switching to polling fallback')
      pollRef.current = setInterval(async () => {
        try {
          const res = await api.getTick()
          if (res.data?.shipments) updateShipments(res.data.shipments)
        } catch (e) {
          setError('Connection lost — retrying...')
        }
      }, 2000)
    }

    socket.on('connect', () => {
      setConnected(true)
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
    })
    socket.on('disconnect',    () => { setConnected(false); startPolling() })
    socket.on('connect_error', () => { setConnected(false); startPolling() })
    socket.on('shipments:update', updateShipments)
    socket.on('events:init',  evs => setEvents((evs || []).slice(0, 60)))
    socket.on('events:new',   addEvent)

    // Initial HTTP fetch
    api.getShipments()
      .then(res => updateShipments(res.data))
      .catch(() => { setError('Failed to load shipments'); setLoading(false) })

    return () => {
      socket.disconnect()
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [updateShipments, addEvent])

  return { shipments, events, connected, lastUpdated, loading, error }
}
