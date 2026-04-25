import client from './client'
export const api = {
  getShipments: ()         => client.get('/shipments'),
  getTick:      ()         => client.get('/shipments/tick'),
  getTelemetry: ()         => client.get('/telemetry/summary'),
  simulate:     (data)     => client.post('/simulate', data),
  chat:         (data)     => client.post('/chat', data),
  reroute:      (id, data) => client.post(`/shipments/${id}/reroute`, data),
  getRerouteRecommendation: (id) => client.get(`/shipments/${id}/recommendation`),
  ingestCSV:    (data)     => client.post('/shipments/ingest-csv', data),
  health:       ()         => client.get('/health'),
}
