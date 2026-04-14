import { useState, useCallback, useRef } from 'react'
import { GoogleMap, useJsApiLoader, Polyline, Marker, InfoWindow, OverlayView } from '@react-google-maps/api'
import { getRiskPolylineColor, getRiskBand } from '../utils/risk'
import { fmtEta, fmtSpeed, fmtProgress, fmtTemp } from '../utils/format'

const MAP_CENTER  = { lat: 20.5937, lng: 78.9629 }
const MAP_OPTIONS = {
  disableDefaultUI: true,
  zoomControl: true,
  fullscreenControl: true,
  gestureHandling: 'cooperative',
  styles: [
    { elementType: 'geometry',                        stylers: [{ color: '#f1f5f9' }] },
    { elementType: 'labels.text.fill',                stylers: [{ color: '#64748b' }] },
    { elementType: 'labels.text.stroke',              stylers: [{ color: '#f8fafc' }] },
    { featureType: 'water',   elementType: 'geometry',stylers: [{ color: '#bfdbfe' }] },
    { featureType: 'water',   elementType: 'labels.text.fill', stylers: [{ color: '#3b82f6' }] },
    { featureType: 'road',    elementType: 'geometry',stylers: [{ color: '#ffffff' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#e2e8f0' }] },
    { featureType: 'poi',     elementType: 'labels',  stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', elementType: 'labels',  stylers: [{ visibility: 'off' }] },
    { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#cbd5e1' }] },
    { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f8fafc' }] },
  ],
}

function TruckOverlay({ shipment, isSelected, onClick }) {
  const band    = getRiskBand(shipment.riskScore)
  const isHigh  = shipment.riskScore >= 75

  return (
    <OverlayView
      position={shipment.currentPosition}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div
        style={{ transform: 'translate(-50%, -50%)', cursor: 'pointer', position: 'relative', width: 40, height: 40 }}
        onClick={onClick}
      >
        {/* Pulse ring for high-risk */}
        {isHigh && (
          <span
            className="pulse-ring"
            style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              width: 36, height: 36, borderRadius: '50%',
              border: '2px solid #EF4444', opacity: 0.7,
              pointerEvents: 'none',
            }}
          />
        )}
        {/* Truck arrow */}
        <div
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: `translate(-50%,-50%) rotate(${shipment.headingDeg}deg)`,
            width: 30, height: 30, borderRadius: '50%',
            background: isSelected ? '#1e1b4b' : band.color,
            border: '2.5px solid white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}
        >
          <svg viewBox="0 0 20 20" fill="white" width="13" height="13">
            <path d="M10 2 L16 17 L10 12.5 L4 17 Z" />
          </svg>
        </div>
        {/* ID label */}
        <div
          style={{
            position: 'absolute', top: '100%', left: '50%',
            transform: 'translateX(-50%) translateY(2px)',
            background: 'rgba(255,255,255,0.92)', borderRadius: 4,
            padding: '1px 5px', fontSize: 10, fontWeight: 700,
            color: '#1e293b', whiteSpace: 'nowrap',
            boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
            pointerEvents: 'none',
          }}
        >
          {shipment.id}
        </div>
      </div>
    </OverlayView>
  )
}

function MapFallback({ shipments }) {
  const active = shipments.filter(s => s.active)
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-indigo-50">
      <div className="text-5xl mb-4">🗺️</div>
      <p className="text-slate-700 font-semibold text-lg">Google Maps API Key Required</p>
      <p className="text-slate-400 text-sm mt-1 text-center max-w-xs">
        Add <code className="bg-white px-1.5 py-0.5 rounded text-indigo-600 font-mono text-xs">VITE_GOOGLE_MAPS_API_KEY</code> to{' '}
        <code className="bg-white px-1.5 py-0.5 rounded font-mono text-xs">frontend/.env</code>
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3 text-xs text-slate-500 px-6 w-full max-w-md">
        {active.map(s => {
          const band = getRiskBand(s.riskScore)
          return (
            <div key={s.id} className="bg-white/80 rounded-xl p-3 border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-700">{s.id}</span>
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${band.bg} ${band.text}`}>
                  {s.riskScore}
                </span>
              </div>
              <div className="text-slate-500">{s.source} → {s.destination}</div>
              <div className="mt-1.5 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="h-full rounded-full bg-indigo-400" style={{ width: `${Math.round(s.progressPct)}%` }} />
              </div>
              <div className="flex justify-between mt-1 text-[11px]">
                <span className="text-indigo-600 font-medium">{Math.round(s.progressPct)}%</span>
                <span className="text-slate-400">ETA {fmtEta(s.etaMinutes)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function LiveMap({ shipments }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const [selected, setSelected] = useState(null)
  const mapRef = useRef(null)

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || '',
    id: 'smartchain-map',
  })

  const onLoad = useCallback(map => { mapRef.current = map }, [])

  if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
    return <MapFallback shipments={shipments} />
  }

  if (loadError) return (
    <div className="w-full h-full flex items-center justify-center bg-red-50">
      <p className="text-red-500 text-sm">Map failed to load. Check your API key and domain restrictions.</p>
    </div>
  )

  if (!isLoaded) return (
    <div className="w-full h-full flex items-center justify-center bg-slate-50 animate-pulse">
      <p className="text-slate-400 text-sm">Loading map...</p>
    </div>
  )

  const routable = shipments.filter(s => s.currentPosition && s.route?.length >= 2)

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={MAP_CENTER}
      zoom={5}
      options={MAP_OPTIONS}
      onLoad={onLoad}
    >
      {/* Route polylines */}
      {routable.map(s => (
        <Polyline
          key={`route-${s.id}`}
          path={s.route}
          options={{
            strokeColor:   getRiskPolylineColor(s.riskScore),
            strokeOpacity: 0.5,
            strokeWeight:  3.5,
            geodesic:      true,
          }}
        />
      ))}

      {/* Origin markers */}
      {routable.map(s => (
        <Marker
          key={`orig-${s.id}`}
          position={s.route[0]}
          title={`${s.source} (origin)`}
          icon={{
            path:         window.google.maps.SymbolPath.CIRCLE,
            fillColor:    '#6366F1',
            fillOpacity:  0.9,
            strokeColor:  '#fff',
            strokeWeight: 2,
            scale:        5,
          }}
        />
      ))}

      {/* Destination markers */}
      {routable.map(s => (
        <Marker
          key={`dest-${s.id}`}
          position={s.route[s.route.length - 1]}
          title={`${s.destination} (destination)`}
          icon={{
            path:         window.google.maps.SymbolPath.CIRCLE,
            fillColor:    '#10B981',
            fillOpacity:  0.9,
            strokeColor:  '#fff',
            strokeWeight: 2,
            scale:        5,
          }}
        />
      ))}

      {/* Moving truck overlays */}
      {routable.filter(s => s.active).map(s => (
        <TruckOverlay
          key={`truck-${s.id}`}
          shipment={s}
          isSelected={selected?.id === s.id}
          onClick={() => setSelected(prev => prev?.id === s.id ? null : s)}
        />
      ))}

      {/* Info window */}
      {selected && selected.currentPosition && (
        <InfoWindow
          position={selected.currentPosition}
          onCloseClick={() => setSelected(null)}
          options={{ pixelOffset: new window.google.maps.Size(0, -40) }}
        >
          <div style={{ minWidth: 200, padding: 4 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: '#1e293b' }}>
              {selected.id}
            </div>
            <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
              <tbody>
                {[
                  ['Route',    `${selected.source} → ${selected.destination}`],
                  ['Status',   selected.status],
                  ['Risk',     `${selected.riskScore}/100`],
                  ['ETA',      fmtEta(selected.etaMinutes)],
                  ['Progress', fmtProgress(selected.progressPct)],
                  ['Speed',    fmtSpeed(selected.speedKmph * (selected.speedFactor || 1))],
                  ['Cargo',    selected.cargoType],
                  ['Temp',     fmtTemp(selected.temperatureC)],
                  ['Vehicle',  selected.vehicleId],
                ].map(([k, v]) => (
                  <tr key={k} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '4px 8px 4px 0', color: '#94a3b8', fontWeight: 500 }}>{k}</td>
                    <td style={{ padding: '4px 0', color: '#334155', textAlign: 'right' }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}
