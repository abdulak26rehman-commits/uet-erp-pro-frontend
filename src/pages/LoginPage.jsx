import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../lib/api'
import { useToast } from '../hooks/index.jsx'

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()
  const toast    = useToast()

  async function handleLogin(e) {
    e.preventDefault()
    if (!email || !password) { toast('Please enter email and password', 'error'); return }
    setLoading(true)
    const res = await authAPI.login(email, password)
    setLoading(false)
    if (res.success) { toast('Welcome back!', 'success'); navigate('/dashboard') }
    else toast(res.message || 'Login failed', 'error')
  }

  return (
    <div style={{
      minHeight:'100vh', background:'var(--bg-900)',
      display:'flex', alignItems:'center', justifyContent:'center',
      position:'relative', overflow:'hidden', padding:'20px'
    }}>
      {/* BG Orbs */}
      <div style={{position:'absolute',top:'-20%',left:'-10%',width:'600px',height:'600px',borderRadius:'50%',background:'radial-gradient(circle,rgba(59,130,246,0.08) 0%,transparent 70%)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',bottom:'-20%',right:'-10%',width:'500px',height:'500px',borderRadius:'50%',background:'radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)',pointerEvents:'none'}}/>

      {/* Grid pattern */}
      <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)',backgroundSize:'50px 50px',pointerEvents:'none'}}/>

      <div style={{width:'420px',maxWidth:'100%',position:'relative',zIndex:1}}>
        {/* Top badge */}
        <div style={{textAlign:'center',marginBottom:'28px'}}>
          <span style={{display:'inline-flex',alignItems:'center',gap:'7px',background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:'20px',padding:'5px 14px',fontSize:'11px',fontWeight:'600',color:'var(--blue-g)',letterSpacing:'0.05em',textTransform:'uppercase'}}>
            <span style={{width:'6px',height:'6px',background:'var(--blue-g)',borderRadius:'50%',boxShadow:'0 0 8px var(--blue)'}}/>
            Secure Portal · UET Mardan
          </span>
        </div>

        {/* Card */}
        <div style={{background:'var(--bg-700)',border:'1px solid var(--border-base)',borderRadius:'var(--r20)',padding:'36px',boxShadow:'0 24px 64px rgba(0,0,0,0.5)'}}>
          {/* Logo */}
          <div style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'28px'}}>
            <div style={{width:'48px',height:'48px',borderRadius:'14px',background:'linear-gradient(135deg,#3b82f6,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-display)',fontSize:'15px',fontWeight:'700',color:'#fff',boxShadow:'0 6px 20px rgba(59,130,246,0.4)',flexShrink:0}}>
              ERP
            </div>
            <div>
              <div style={{fontFamily:'var(--font-display)',fontSize:'19px',fontWeight:'700',color:'var(--text-primary)',lineHeight:1.2}}>UET Mardan ERP</div>
              <div style={{fontSize:'12px',color:'var(--text-muted)',marginTop:'2px'}}>Enterprise Resource Planning</div>
            </div>
          </div>

          <div style={{fontSize:'15px',fontWeight:'600',color:'var(--text-primary)',marginBottom:'4px',fontFamily:'var(--font-display)'}}>Sign in to your account</div>
          <div style={{fontSize:'12px',color:'var(--text-muted)',marginBottom:'24px'}}>Enter your credentials to access the dashboard</div>

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{marginBottom:'14px'}}>
              <label className="form-label">Email Address</label>
              <div style={{position:'relative'}}>
                <input
                  className="form-input"
                  type="email"
                  placeholder="admin@uetmardan.edu.pk"
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                  style={{paddingLeft:'40px'}}
                />
                <svg style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)',pointerEvents:'none'}} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
            </div>

            <div className="form-group" style={{marginBottom:'22px'}}>
              <label className="form-label">Password</label>
              <div style={{position:'relative'}}>
                <input
                  className="form-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••••"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  style={{paddingLeft:'40px',paddingRight:'40px'}}
                />
                <svg style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)',pointerEvents:'none'}} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <button type="button" onClick={()=>setShowPass(v=>!v)} style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',padding:0,display:'flex'}}>
                  {showPass
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{width:'100%',justifyContent:'center',padding:'12px',fontSize:'14px'}}>
              {loading
                ? <><div className="spinner" style={{width:16,height:16}}/> Signing in...</>
                : <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                    Sign In to ERP
                  </>
              }
            </button>
          </form>

          <div style={{marginTop:'20px',padding:'12px 14px',background:'rgba(59,130,246,0.06)',border:'1px solid rgba(59,130,246,0.12)',borderRadius:'var(--r10)',fontSize:'12px',color:'var(--text-muted)'}}>
            <span style={{color:'var(--blue-g)',fontWeight:'500'}}>Default credentials:</span> admin@uetmardan.edu.pk / Admin@123456
          </div>
        </div>

        <div style={{textAlign:'center',marginTop:'20px',fontSize:'11px',color:'var(--text-muted)'}}>
          University of Engineering & Technology, Mardan · IT Department · v2.0
        </div>
      </div>
    </div>
  )
}
