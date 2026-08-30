// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { signOutFirebase } from '../services/firebase'
import { logoutApi, getMe, refreshAccessToken } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // ── Restore session from localStorage on first load ─────────────
  useEffect(() => {
    const stored = localStorage.getItem('user')
    const token  = localStorage.getItem('access_token')

    if (stored && token) {
      setUser(JSON.parse(stored))
      // Silently re-verify the token in the background
      getMe()
        .then(fresh => {
          setUser(fresh)
          localStorage.setItem('user', JSON.stringify(fresh))
        })
        .catch(async () => {
          // Access token expired — try to refresh using the httpOnly cookie
          try {
            const { access_token } = await refreshAccessToken()
            localStorage.setItem('access_token', access_token)
            const fresh = await getMe()
            setUser(fresh)
            localStorage.setItem('user', JSON.stringify(fresh))
          } catch {
            // Refresh also failed — clear session
            _clearSession()
          }
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  function _clearSession() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    setUser(null)
  }

  /**
   * Call this after a successful backend login response.
   * { access_token, user }
   */
  function loginWithCredentials({ access_token, user: userData }) {
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = useCallback(async () => {
    try {
      await Promise.all([logoutApi(), signOutFirebase()])
    } catch { /* ignore */ }
    _clearSession()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, loginWithCredentials, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
