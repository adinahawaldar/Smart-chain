// import { useState } from 'react'
// import { Toaster } from 'react-hot-toast'
// import LandingPage from './components/LandingPage'
// import Dashboard from './components/Dashboard'

// export default function App() {
//   const [view, setView] = useState('landing')
//   return (
//     <>
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           style: {
//             borderRadius: '12px',
//             background: '#1e1b4b',
//             color: '#e0e7ff',
//             fontSize: '14px',
//           },
//         }}
//       />
//       {view === 'landing'
//         ? <LandingPage onEnter={() => setView('dashboard')} />
//         : <Dashboard onBack={() => setView('landing')} />
//       }
//     </>
//   )


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
// import Dashboard from './components/Dashboard';
import SmartChainDemo from '../src/pages/SmartChainDemo'
import DashboardPage from '../src/pages/DashboardPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboardpage" element={<DashboardPage />} />
                <Route path="/demo" element={<SmartChainDemo />} />

      </Routes>
    </Router>
  );
}

export default App;
