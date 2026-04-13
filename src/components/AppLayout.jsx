import { useState } from 'react'
import { useLocation, useNavigate, Outlet } from 'react-router-dom'
import { authAPI } from '../lib/api'
import { useAuth, useToast } from '../hooks/index.jsx'

const NAV = [
  { type:'section', label:'Overview' },
  { path:'/dashboard',   label:'Dashboard',       icon:'grid',   badge:null },
  { path:'/analytics',   label:'Analytics',       icon:'chart',  badge:null },
  { type:'section', label:'Finance' },
  { path:'/accounting',  label:'Accounting',      icon:'wallet', badge:null },
  { path:'/budget',      label:'Budget Control',  icon:'pie',    badge:null },
  { path:'/payroll',     label:'Payroll',         icon:'receipt',badge:null },
  { path:'/procurement', label:'Procurement',     icon:'cart',   badge:{n:3,c:'blue'} },
  { type:'section', label:'Human Resources' },
  { path:'/employees',   label:'Employees',       icon:'users',  badge:null },
  { path:'/leave',       label:'Leave Management',icon:'calendar',badge:{n:5,c:'red'} },
  { path:'/recruitment', label:'Recruitment',     icon:'star',   badge:null },
  { type:'section', label:'System' },
  { path:'/audit',       label:'Audit Logs',      icon:'shield', badge:null },
  { path:'/settings',    label:'Settings',        icon:'cog',    badge:null },
]

function Icon({ name, size=15 }) {
  const s = { width:size,height:size,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round' }
  const icons = {
    grid:     <svg {...s}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    chart:    <svg {...s}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    wallet:   <svg {...s}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 13a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"/></svg>,
    pie:      <svg {...s}><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>,
    receipt:  <svg {...s}><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/></svg>,
    cart:     <svg {...s}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
    users:    <svg {...s}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    calendar: <svg {...s}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    star:     <svg {...s}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    shield:   <svg {...s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    cog:      <svg {...s}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    logout:   <svg {...s}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    bell:     <svg {...s}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    search:   <svg {...s}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    refresh:  <svg {...s}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
    menu:     <svg {...s}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  }
  return icons[name] || null
}
export { Icon }

function Sidebar({ open, onClose }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast    = useToast()

  async function logout() {
    authAPI.logout()
    toast('Logged out successfully', 'info')
  }

  function go(path) { navigate(path); if(onClose) onClose() }

  const initials = user?.name ? user.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() : (user?.email?.slice(0,2).toUpperCase() || 'AD')

  return (
    <aside className={`sidebar${open?' open':''}`}>
      <div className="sidebar-logo">
        <div className="logo-mark">ERP</div>
        <div>
          <div className="logo-text-main">UET Mardan</div>
          <div className="logo-text-sub">Enterprise ERP v2.0</div>
        </div>
      </div>

      <nav className="nav-scroll">
        {NAV.map((item, i) => item.type === 'section'
          ? <div key={i} className="nav-section-label">{item.label}</div>
          : (
            <div key={item.path} className={`nav-item${location.pathname===item.path?' active':''}`} onClick={()=>go(item.path)}>
              <div className="nav-icon-wrap"><Icon name={item.icon} size={14}/></div>
              <span style={{flex:1}}>{item.label}</span>
              {item.badge && <span className={`nav-badge nav-badge-${item.badge.c}`}>{item.badge.n}</span>}
            </div>
          )
        )}
      </nav>

      <div className="sidebar-user">
        <div className="user-btn" onClick={logout} title="Click to logout">
          <div className="user-avatar">{initials}</div>
          <div style={{flex:1,minWidth:0}}>
            <div className="user-name">{user?.name || user?.email || 'Admin'}</div>
            <div className="user-role">{user?.role || 'Administrator'}</div>
          </div>
          <div className="online-dot"/>
        </div>
      </div>
    </aside>
  )
}

const PAGE_TITLES = {
  '/dashboard':'Dashboard','/analytics':'Analytics','/accounting':'Accounting',
  '/budget':'Budget Control','/payroll':'Payroll','/procurement':'Procurement',
  '/employees':'Employees','/leave':'Leave Management','/recruitment':'Recruitment',
  '/audit':'Audit Logs','/settings':'Settings',
}

export default function AppLayout() {
  const [sideOpen,  setSideOpen]  = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] || 'ERP'

  return (
    <div style={{display:'flex',minHeight:'100vh'}}>
      <div className="page-glow"/>
      {sideOpen && <div onClick={()=>setSideOpen(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:99,backdropFilter:'blur(2px)'}}/>}
      <Sidebar open={sideOpen} onClose={()=>setSideOpen(false)}/>

      <div className="main-wrap">
        <header className="topbar">
          <button className="hamburger" onClick={()=>setSideOpen(v=>!v)}><Icon name="menu" size={18}/></button>
          <div className="topbar-left">
            <div className="page-title">{title}</div>
            <span className="page-crumb">/ {location.pathname.replace('/','') || 'overview'}</span>
          </div>

          <div className="search-wrap">
            <Icon name="search" size={13}/>
            <input placeholder="Search anything..."/>
          </div>

          <div style={{display:'flex',gap:8}}>
            <button className="topbar-btn" onClick={()=>setNotifOpen(v=>!v)}>
              <Icon name="bell" size={16}/>
              <div className="notif-pip"/>
            </button>
            <button className="topbar-btn" onClick={()=>window.location.reload()}>
              <Icon name="refresh" size={15}/>
            </button>
          </div>
        </header>

        <div className={`notif-panel${notifOpen?' open':''}`}>
          <div className="notif-head">
            <span style={{fontFamily:'var(--font-display)',fontSize:'14px',fontWeight:'600'}}>Notifications</span>
            <span className="badge badge-red">5 new</span>
          </div>
          {[
            ['Leave Request','Ahmad Bilal submitted 3-day sick leave','2 min ago'],
            ['Budget Alert','IT Dept at 90% of quarterly budget','15 min ago'],
            ['Payroll Done','March 2026 payroll processed successfully','1 hr ago'],
            ['New Vendor','Techno Solutions PKR registered','3 hrs ago'],
            ['Audit Ready','Q1 2026 audit log is ready for export','Yesterday'],
          ].map(([t,d,time],i)=>(
            <div key={i} className="notif-item" onClick={()=>setNotifOpen(false)}>
              <div className="notif-item-title">{t}</div>
              <div className="notif-item-desc">{d} · {time}</div>
            </div>
          ))}
          <div style={{padding:'12px 18px',textAlign:'center',fontSize:'12px',color:'var(--blue-g)',cursor:'pointer',fontWeight:'500'}} onClick={()=>setNotifOpen(false)}>View all notifications</div>
        </div>

        <main className="page-content" style={{position:'relative',zIndex:1}}>
          <Outlet/>
        </main>
      </div>
    </div>
  )
}
