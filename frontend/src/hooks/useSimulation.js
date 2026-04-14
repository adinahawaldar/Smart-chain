import { useState } from 'react'
import { api } from '../api/endpoints'
import toast from 'react-hot-toast'

export default function useSimulation() {
  const [loading,    setLoading]    = useState(false)
  const [lastResult, setLastResult] = useState(null)

  async function runSimulation(disruption) {
    setLoading(true)
    try {
      const res = await api.simulate({ disruption })
      setLastResult(res.data)
      toast.success(
        `${disruption.toUpperCase()} simulation applied — ${res.data.affectedCount} shipments affected`,
        { duration: 4000 }
      )
      return res.data
    } catch {
      toast.error('Simulation failed — check backend connection')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { runSimulation, loading, lastResult }
}
