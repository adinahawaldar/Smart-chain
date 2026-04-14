export function haversineDistance(a, b) {
  const R = 6371, toRad = x => (x * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat), dLon = toRad(b.lng - a.lng)
  const x = Math.sin(dLat/2)**2 + Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLon/2)**2
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x))
}
export function computeBearing(from, to) {
  const toRad = x => (x * Math.PI) / 180
  const lat1 = toRad(from.lat), lat2 = toRad(to.lat), dLon = toRad(to.lng - from.lng)
  const y = Math.sin(dLon) * Math.cos(lat2)
  const x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon)
  return ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360
}
