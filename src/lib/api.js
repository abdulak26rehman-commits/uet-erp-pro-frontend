// ── API Base URL ─────────────────────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_URL || 'https://uet-erp-backend-ready.onrender.com'

// ── Token Helpers ─────────────────────────────────────────────────────────────
export const getToken  = () => localStorage.getItem('erp_token')
export const setToken  = t  => localStorage.setItem('erp_token', t)
export const getUser   = () => { try { return JSON.parse(localStorage.getItem('erp_user')) } catch { return null } }
export const setUser   = u  => localStorage.setItem('erp_user', JSON.stringify(u))
export const clearAuth = () => { localStorage.removeItem('erp_token'); localStorage.removeItem('erp_user') }

// ── Core fetch ─────────────────────────────────────────────────────────────────
async function api(path, opts = {}) {
  const token = getToken()
  const cfg = {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...opts.headers },
    ...opts,
  }
  if (cfg.body && typeof cfg.body === 'object') cfg.body = JSON.stringify(cfg.body)
  try {
    const res  = await fetch(`${BASE}${path}`, cfg)
    const data = await res.json()
    if (res.status === 401) { clearAuth(); window.location.href = '/login'; return { success: false } }
    return data
  } catch {
    return { success: false, message: 'Cannot connect to server' }
  }
}

// ── Auth ───────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: async (email, password) => {
    const d = await api('/auth/login', { method: 'POST', body: { email, password } })
    if (d.success) { setToken(d.token); setUser(d.user) }
    return d
  },
  logout:    () => { clearAuth(); window.location.href = '/login' },
  me:        () => api('/auth/me'),
  users:     () => api('/auth/users'),
  register:  b  => api('/auth/register', { method: 'POST', body: b }),
  isLoggedIn:() => !!getToken(),
}

// ── Employees ──────────────────────────────────────────────────────────────────
export const employeeAPI = {
  getAll:   p => api('/employees?' + new URLSearchParams(p || {})),
  getStats: () => api('/employees/stats/summary'),
  create:   b => api('/employees', { method: 'POST', body: b }),
  update:   (id, b) => api(`/employees/${id}`, { method: 'PUT', body: b }),
  delete:   id => api(`/employees/${id}`, { method: 'DELETE' }),
}

// ── Finance ────────────────────────────────────────────────────────────────────
export const voucherAPI = {
  getAll:       p => api('/vouchers?' + new URLSearchParams(p || {})),
  getStats:     () => api('/vouchers/stats/summary'),
  create:       b => api('/vouchers', { method: 'POST', body: b }),
  updateStatus: (id, status) => api(`/vouchers/${id}/status`, { method: 'PUT', body: { status } }),
  delete:       id => api(`/vouchers/${id}`, { method: 'DELETE' }),
}
export const budgetAPI = {
  getAll:  () => api('/budget'),
  create:  b  => api('/budget', { method: 'POST', body: b }),
  update:  (id, b) => api(`/budget/${id}`, { method: 'PUT', body: b }),
}

// ── HR ─────────────────────────────────────────────────────────────────────────
export const leaveAPI = {
  getAll:       p => api('/leave?' + new URLSearchParams(p || {})),
  create:       b => api('/leave', { method: 'POST', body: b }),
  updateStatus: (id, status) => api(`/leave/${id}/status`, { method: 'PUT', body: { status } }),
}
export const payrollAPI = {
  getAll:  p => api('/payroll?' + new URLSearchParams(p || {})),
  process: b => api('/payroll/process', { method: 'POST', body: b }),
}
export const procurementAPI = {
  getAll:       () => api('/procurement'),
  create:       b  => api('/procurement', { method: 'POST', body: b }),
  updateStatus: (id, status) => api(`/procurement/${id}/status`, { method: 'PUT', body: { status } }),
}

// ── Stats & Audit ──────────────────────────────────────────────────────────────
export const statsAPI = { getDashboard: () => api('/stats') }
export const auditAPI = { getAll: p => api('/audit?' + new URLSearchParams(p || {})) }
