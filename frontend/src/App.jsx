import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import WorkspacePage from './pages/WorkspacePage'
import HistoryPage from './pages/HistoryPage'
import ReviewPage from './pages/ReviewPage'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/auth" replace />
  return children
}

function App() {
  const location = useLocation()

  const showNavbar = !['/', '/auth'].includes(location.pathname)

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        
        <Route path="/workspace" element={
          <ProtectedRoute>
            <WorkspacePage />
          </ProtectedRoute>
        } />
        
        <Route path="/history" element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        } />
        
        <Route path="/review/:submissionId" element={
          <ProtectedRoute>
            <ReviewPage />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App
