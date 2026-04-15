const BASE     = import.meta.env.VITE_API_URL || 'https://uet-erp-backend-ready.onrender.com/api'
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false' // Default to true for Static Demo

if (USE_MOCK) console.log('%c ERP STATIC DEMO MODE ', 'background: #004d40; color: #fff; font-size: 14px; padding: 4px; border-radius: 4px;');

import * as mockData from './mockData'

// ── Token Helpers ─────────────────────────────────────────────────────────────
export const getToken  = () => localStorage.getItem('erp_token')
export const setToken  = t  => localStorage.setItem('erp_token', t)
export const getUser   = () => { try { return JSON.parse(localStorage.getItem('erp_user')) } catch { return null } }
export const setUser   = u  => localStorage.setItem('erp_user', JSON.stringify(u))
export const clearAuth = () => { localStorage.removeItem('erp_token'); localStorage.removeItem('erp_user') }

// ── Core fetch ─────────────────────────────────────────────────────────────────
async function api(path, opts = {}) {
  if (USE_MOCK) {
    console.log(`[Mock API] Call to: ${path}`)
    // Simple mock routing logic
    if (path.includes('/auth/login'))   return { success: true, token: 'mock-token', user: { name: 'Demo Admin', email: 'admin@uetmardan.edu.pk', role: 'admin', department: 'IT Department' } }
    if (path.includes('/auth/me'))      return { success: true, user: { name: 'Demo Admin', email: 'admin@uetmardan.edu.pk', role: 'admin', department: 'IT Department' } }
    if (path.includes('/auth/users'))   return { success: true, data: [ { id: 1, name: 'Admin', role: 'admin' } ] }
    if (path.includes('/stats'))        return { success: true, data: mockData.MOCK_STATS }
    if (path.includes('/summary'))      return { success: true, data: mockData.MOCK_STATS } // Catch all summary stats
    if (path.includes('/employees'))    return { success: true, data: mockData.MOCK_EMPLOYEES }
    if (path.includes('/vouchers'))     return { success: true, data: mockData.MOCK_VOUCHERS }
    if (path.includes('/budget'))       return { success: true, data: mockData.MOCK_BUDGET }
    if (path.includes('/leave'))        return { success: true, data: mockData.MOCK_LEAVES }
    if (path.includes('/payroll'))      return { success: true, data: mockData.MOCK_PAYROLL }
    if (path.includes('/procurement'))  return { success: true, data: [] }
    if (path.includes('/audit'))        return { success: true, data: mockData.MOCK_AUDIT }
    
    return { success: true, data: [], message: 'Mock response' }
  }

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
