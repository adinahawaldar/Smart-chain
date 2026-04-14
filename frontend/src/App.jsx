import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'

export default function App() {
  const [view, setView] = useState('landing')
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#1e1b4b',
            color: '#e0e7ff',
            fontSize: '14px',
          },
        }}
      />
      {view === 'landing'
        ? <LandingPage onEnter={() => setView('dashboard')} />
        : <Dashboard onBack={() => setView('landing')} />
      }
    </>
  )
}
