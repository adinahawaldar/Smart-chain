/**
 * eventEngine.js
 * Factory for creating operational event objects.
 */

function createEvent(type, shipmentId, message, severity = 'info', metadata = {}) {
  return {
    type,
    shipmentId: shipmentId || null,
    message,
    severity,
    metadata,
    timestamp: new Date().toISOString(),
  };
}

const GEOFENCE_ZONES = [
  { name: 'Mumbai Port', lat: 18.93, lng: 72.84, radiusKm: 30 },
  { name: 'Delhi NCR Hub', lat: 28.5, lng: 77.1, radiusKm: 40 },
  { name: 'Bangalore Logistics Park', lat: 13.1, lng: 77.6, radiusKm: 25 },
  { name: 'Hyderabad Gateway', lat: 17.4, lng: 78.45, radiusKm: 30 },
  { name: 'Chennai Port', lat: 13.1, lng: 80.28, radiusKm: 25 },
  { name: 'Kolkata Dock', lat: 22.55, lng: 88.35, radiusKm: 30 },
  { name: 'Ahmedabad Depot', lat: 23.05, lng: 72.58, radiusKm: 25 },
  { name: 'Jaipur Warehouse', lat: 26.9, lng: 75.79, radiusKm: 20 },
];

function haversineDistance(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function checkGeofenceEntry(shipment) {
  if (!shipment.currentPosition || !shipment.active) return null;
  for (const zone of GEOFENCE_ZONES) {
    const dist = haversineDistance(shipment.currentPosition, zone);
    const wasInside = shipment._geofences && shipment._geofences[zone.name];
    const isInside = dist <= zone.radiusKm;

    if (!shipment._geofences) shipment._geofences = {};
    if (isInside && !wasInside) {
      shipment._geofences[zone.name] = true;
      return createEvent(
        'geofence',
        shipment.id,
        `${shipment.id} entered ${zone.name}`,
        'info',
        { zone: zone.name }
      );
    } else if (!isInside && wasInside) {
      shipment._geofences[zone.name] = false;
      return createEvent(
        'geofence',
        shipment.id,
        `${shipment.id} exited ${zone.name}`,
        'info',
        { zone: zone.name }
      );
    }
  }
  return null;
}

module.exports = { createEvent, checkGeofenceEntry, GEOFENCE_ZONES };
