import axios from 'axios'
const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
const client = axios.create({ baseURL: BASE, timeout: 10000, headers: { 'Content-Type': 'application/json' } })
client.interceptors.response.use(
  res => res,
  err => { console.error('API error:', err.response?.data || err.message); return Promise.reject(err) }
)
export default client
export { BASE }
