// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Wraps a route and redirects unauthenticated users to /login.
 * Optionally restricts access to a specific role ('doctor' | 'patient').
 *
 * Usage:
 *   <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
 *   <Route path="/admin"     element={<ProtectedRoute role="doctor"><AdminPage /></ProtectedRoute>} />
 */
export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#0a0b1e', color: '#a78bfa',
        fontFamily: "'League Spartan', sans-serif", fontSize: 16, gap: 12,
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ animation: 'spin 0.8s linear infinite' }}>
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        Loading…
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (!user) {
    // Preserve intended destination so we can redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }

  return children
}
