import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { getUser, getToken } from '../lib/api'

// ── Toast ──────────────────────────────────────────────────────────────────────
const ToastCtx = createContext(null)
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const toast = useCallback((msg, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(p => [...p, { id, msg, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000)
  }, [])
  const icons = { success:'✓', error:'✕', info:'i' }
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <div className="toast-icon">{icons[t.type]}</div>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}
export const useToast = () => useContext(ToastCtx)

// ── Auth ───────────────────────────────────────────────────────────────────────
const AuthCtx = createContext(null)
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(getUser)
  const [ready, setReady]     = useState(false)
  useEffect(() => {
    setUser(getUser())
    setReady(true)
  }, [])
  const refresh = () => setUser(getUser())
  return <AuthCtx.Provider value={{ user, ready, refresh }}>{children}</AuthCtx.Provider>
}
export const useAuth = () => useContext(AuthCtx)
