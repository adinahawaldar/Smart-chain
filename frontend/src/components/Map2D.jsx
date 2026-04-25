import React, { useState, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import { fmtEta, fmtSpeed } from '../utils/format';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 20,
  lng: 70
};

// SVG Icons for vehicles
const getIconUrl = (type) => {
  // Use SVG data URIs for Google Maps markers
  let svg = '';
  if (type === 'ship') {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#60a5fa" stroke="white" stroke-width="2"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 10v4"/><path d="M12 2v3"/></svg>`;
  } else if (type === 'plane') {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#a78bfa" stroke="white" stroke-width="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.5l-1.3 1.5c-.3.3-.3.8 0 1.1L7 13l-4 4-2.5-.5c-.3 0-.6.2-.8.5L0 19l6 1 1 6c.3-.2.5-.5.5-.8l-.5-2.5 4-4 3.7 4.6c.3.3.8.3 1.1 0l1.5-1.3c.3-.2.6-.6.5-1.1z"/></svg>`;
  } else {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#34d399" stroke="white" stroke-width="2"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`;
  }
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export default function Map2D({ shipments }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [map, setMap] = useState(null);
  const [selected, setSelected] = useState(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const routable = useMemo(() => 
    shipments.filter(s => s.currentPosition && s.source && s.destination),
    [shipments]
  );

  const markers = useMemo(() => routable.map(s => {
    let type = 'truck';
    if (s.cargoType === 'Electronics' || s.source === 'Mumbai') type = 'ship';
    if (s.cargoType === 'Pharmaceuticals' || s.destination === 'New York') type = 'plane';

    return {
      id: s.id,
      position: s.currentPosition,
      type,
      shipment: s,
      route: s.route || [s.currentPosition, s.currentPosition]
    };
  }), [routable]);

  if (!isLoaded) return <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest text-sm">Loading 2D Map...</div>;

  return (
    <div className="w-full h-full relative rounded-3xl overflow-hidden border border-gray-200">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={3}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: [
            { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
            { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
            { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
            { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
            { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
            { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
            { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
            { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
            { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
            { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
            { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
            { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
            { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
            { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] }
          ],
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {/* Draw Routes */}
        {markers.map(m => (
          <Polyline
            key={`route-${m.id}`}
            path={m.route}
            options={{
              strokeColor: m.shipment.riskScore > 70 ? '#f87171' : '#60a5fa',
              strokeOpacity: 0.5,
              strokeWeight: 2,
            }}
          />
        ))}

        {/* Draw Markers */}
        {markers.map(m => (
          <Marker
            key={m.id}
            position={m.position}
            icon={{
              url: getIconUrl(m.type),
              scaledSize: new window.google.maps.Size(32, 32),
              anchor: new window.google.maps.Point(16, 16)
            }}
            onClick={() => {
              setSelected(m.shipment);
              if (map) map.panTo(m.position);
            }}
          />
        ))}

        {/* Selected InfoWindow */}
        {selected && (
          <InfoWindow
            position={selected.currentPosition}
            onCloseClick={() => setSelected(null)}
            options={{ pixelOffset: new window.google.maps.Size(0, -16) }}
          >
            <div className="p-2 min-w-[200px] text-gray-800">
              <h4 className="text-lg font-black">{selected.id}</h4>
              <p className="text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-3">{selected.vehicleId}</p>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                  <span className="text-gray-400 font-bold uppercase text-[9px]">Status</span>
                  <span className="font-black flex items-center gap-1.5 text-gray-700">
                    <span className={`w-1.5 h-1.5 rounded-full ${selected.active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                    {selected.status}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                  <span className="text-gray-400 font-bold uppercase text-[9px]">Route</span>
                  <span className="font-black truncate max-w-[120px] text-right" title={`${selected.source} → ${selected.destination}`}>
                    {selected.source} → {selected.destination}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                  <span className="text-gray-400 font-bold uppercase text-[9px]">Speed</span>
                  <span className="font-black">{fmtSpeed(selected.speedKmph)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                  <span className="text-gray-400 font-bold uppercase text-[9px]">ETA</span>
                  <span className="font-black text-indigo-600">{fmtEta(selected.etaMinutes)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-bold uppercase text-[9px]">Risk Score</span>
                  <span className={`font-black ${selected.riskScore > 70 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {selected.riskScore}/100
                  </span>
                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
