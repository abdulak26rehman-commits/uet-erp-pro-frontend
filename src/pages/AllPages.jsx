// ─────────────────────────────────────────────────────────────────────────────
//  ALL PAGES  —  UET Mardan ERP Pro
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { employeeAPI, voucherAPI, budgetAPI, leaveAPI, payrollAPI, procurementAPI, auditAPI, statsAPI, authAPI } from '../lib/api'
import { useToast, useAuth } from '../hooks/index.jsx'
import { Icon } from '../components/AppLayout.jsx'
import Papa from 'papaparse'

// ── Shared helpers ────────────────────────────────────────────────────────────
function Crumb({ parts }) {
  return (
    <div className="breadcrumb" style={{marginBottom:'18px'}}>
      {parts.map((p,i) => <span key={i}>{i>0&&<span className="bc-sep"> › </span>}<span className={i===parts.length-1?'bc-cur':''}>{p}</span></span>)}
    </div>
  )
}
function SBadge({ s }) {
  const m={Approved:'green',Posted:'green',Active:'green',Delivered:'green',Processed:'green',Paid:'green',Pending:'amber',Draft:'amber','On Leave':'amber',Rejected:'red','Over Budget':'red',Cancelled:'red',Interviewing:'blue','Offer Stage':'green',Shortlisting:'amber','Applications Open':'purple',Journal:'blue',Payment:'red',Receipt:'green',Warning:'amber'}
  return <span className={`badge badge-${m[s]||'gray'}`}>{s}</span>
}
function StatCard({ label, value, sub, trend, icon, color }) {
  return (
    <div className={`stat-card c-${color}`}>
      <div className="stat-card-glow"/>
      <div className={`stat-icon ic-${color}`}><Icon name={icon} size={17}/></div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{trend==='up'?<span className="trend-up">↑ {sub}</span>:trend==='dn'?<span className="trend-dn">↓ {sub}</span>:<span style={{fontSize:11,color:'var(--text-muted)'}}>{sub}</span>}</div>}
    </div>
  )
}
function LoadingRows({ cols=5 }) {
  return [...Array(4)].map((_,i)=>(
    <tr key={i}><td colSpan={cols} style={{padding:0}}><div className="skeleton" style={{height:44,margin:'4px 0',borderRadius:0}}/></td></tr>
  ))
}
const TT = ({ contentStyle, ...p }) => <Tooltip {...p} contentStyle={{background:'var(--bg-600)',border:'1px solid var(--border-base)',borderRadius:10,fontSize:12,color:'var(--text-primary)',...contentStyle}}/>
const COLORS = ['#3b82f6','#10b981','#f59e0b','#8b5cf6','#f43f5e','#06b6d4']

// ════════════════════════════════════════════════════════════════════════════════
//  DASHBOARD
// ════════════════════════════════════════════════════════════════════════════════
export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [vouchers, setVouchers] = useState([])
  const [budget, setBudget] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  const revenueData = [{m:'Oct',rev:38,exp:55},{m:'Nov',rev:42,exp:48},{m:'Dec',rev:35,exp:62},{m:'Jan',rev:48,exp:58},{m:'Feb',rev:52,exp:70},{m:'Mar',rev:45,exp:63}]
  const kpis = [{l:'Project Timeliness',v:96,t:95,c:'#10b981'},{l:'Functional Coverage',v:100,t:100,c:'#3b82f6'},{l:'System Uptime',v:99.8,t:99,c:'#10b981'},{l:'Data Accuracy',v:99.6,t:99,c:'#10b981'},{l:'Training Progress',v:73,t:100,c:'#f59e0b'}]
  const activities = [
    {icon:'receipt',bg:'rgba(59,130,246,0.12)',c:'#60a5fa',text:'Payroll processed — 847 employees for March 2026',time:'2h ago'},
    {icon:'wallet',bg:'rgba(16,185,129,0.12)',c:'#34d399',text:'HEC Grant ₨45L received and posted to General Ledger',time:'4h ago'},
    {icon:'pie',bg:'rgba(245,158,11,0.12)',c:'#fbbf24',text:'Budget alert: IT Department exceeded allocated limit',time:'6h ago'},
    {icon:'users',bg:'rgba(139,92,246,0.12)',c:'#a78bfa',text:'New employee Dr. Khalid onboarded — Civil Engineering',time:'Yesterday'},
    {icon:'shield',bg:'rgba(244,63,94,0.12)',c:'#fb7185',text:'Leave rejected for Usman R. — insufficient balance',time:'Yesterday'},
  ]

  useEffect(() => {
    Promise.all([statsAPI.getDashboard(), voucherAPI.getAll(), budgetAPI.getAll()]).then(([s, v, b]) => {
      if (s.success) setStats(s.data)
      if (v.success) setVouchers(v.data.slice(0,5))
      if (b.success) setBudget(b.data)
      setLoading(false)
    }).catch(()=>setLoading(false))
  }, [])

  const totalBudget   = budget.reduce((s,b)=>s+Number(b.approvedAmount||0),0)
  const totalExpended = budget.reduce((s,b)=>s+Number(b.expendedAmount||0),0)
  const pieData = budget.slice(0,4).map(b=>({name:b.department?.split(' ')[0]||b.department,value:Number(b.approvedAmount||0)}))

  return (
    <>
      <Crumb parts={['Home','Dashboard']}/>
      <div className="stat-grid">
        <StatCard label="Total Budget FY2026" value={`₨${((stats?.budget?.total||847000000)/1e6).toFixed(0)}M`} sub="12% vs FY2025" trend="up" icon="pie" color="blue"/>
        <StatCard label="Total Expended"      value={`₨${((stats?.budget?.expended||577000000)/1e6).toFixed(0)}M`} sub="8.4% this quarter" trend="up" icon="wallet" color="green"/>
        <StatCard label="Budget Utilization"  value={`${stats?.budget?.utilization||68}%`} sub="Target: 75%" icon="chart" color="amber"/>
        <StatCard label="Total Employees"     value={stats?.employees?.total||847} sub="23 this year" trend="up" icon="users" color="purple"/>
      </div>

      <div className="grid-3 mb20">
        <div className="panel">
          <div className="panel-head">
            <div><div className="panel-title">Revenue vs Expenditure</div><div className="panel-subtitle">Monthly comparison · PKR Million</div></div>
          </div>
          <div className="panel-body" style={{paddingBottom:8}}>
            <div style={{display:'flex',gap:14,marginBottom:12}}>
              {[['Revenue','#3b82f6'],['Expenditure','rgba(244,63,94,0.7)']].map(([l,c])=>(
                <span key={l} style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:'var(--text-muted)'}}>
                  <span style={{width:10,height:10,borderRadius:2,background:c,display:'inline-block'}}/>
                  {l}
                </span>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueData} barSize={12} barGap={4}>
                <XAxis dataKey="m" stroke="transparent" tick={{fontSize:11,fill:'var(--text-muted)'}}/>
                <YAxis stroke="transparent" tick={{fontSize:11,fill:'var(--text-muted)'}}/>
                <TT formatter={v=>[`₨${v}M`]}/>
                <Bar dataKey="rev" fill="#3b82f6" radius={[4,4,0,0]} name="Revenue"/>
                <Bar dataKey="exp" fill="rgba(244,63,94,0.6)" radius={[4,4,0,0]} name="Expenditure"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head"><div className="panel-title">Budget Split</div></div>
          <div className="panel-body">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData.length?pieData:[{name:'No data',value:1}]} cx="50%" cy="50%" innerRadius={42} outerRadius={68} dataKey="value" stroke="none" paddingAngle={3}>
                  {(pieData.length?pieData:[{name:'',value:1}]).map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                </Pie>
                <TT formatter={v=>`₨${(v/1e6).toFixed(1)}M`}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{display:'flex',flexDirection:'column',gap:7,marginTop:10}}>
              {budget.slice(0,4).map((b,i)=>(
                <div key={b._id||i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:11}}>
                  <span style={{display:'flex',alignItems:'center',gap:6,color:'var(--text-muted)'}}>
                    <span style={{width:8,height:8,borderRadius:2,background:COLORS[i],display:'inline-block'}}/>
                    {b.department}
                  </span>
                  <span style={{color:'var(--text-primary)',fontFamily:'var(--font-mono)',fontSize:11}}>₨{(Number(b.approvedAmount||0)/1e6).toFixed(0)}M</span>
                </div>
              ))}
              {budget.length===0 && <div style={{fontSize:11,color:'var(--text-muted)',textAlign:'center'}}>Add budget data in Budget page</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2 mb20">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Recent Vouchers</div>
            <span className="panel-action" onClick={()=>window.location.href='/accounting'}>View all →</span>
          </div>
          <div className="tbl-scroll">
            <table>
              <thead><tr><th>Voucher #</th><th>Description</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {loading ? <LoadingRows cols={4}/> : vouchers.length ? vouchers.map(v=>(
                  <tr key={v._id}>
                    <td><strong>{v.voucherNo}</strong></td>
                    <td style={{maxWidth:150,overflow:'hidden',textOverflow:'ellipsis'}}>{v.description}</td>
                    <td className="mono">₨{Number(v.amount).toLocaleString()}</td>
                    <td><SBadge s={v.status}/></td>
                  </tr>
                )) : <tr><td colSpan={4} style={{textAlign:'center',padding:'28px',color:'var(--text-muted)',fontSize:13}}>No vouchers yet — create one in Accounting</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head"><div className="panel-title">Live Activity Feed</div><span style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:'var(--green)'}}><span style={{width:6,height:6,background:'var(--green)',borderRadius:'50%',boxShadow:'0 0 6px var(--green)',animation:'pip-pulse 2s ease-in-out infinite'}}/> Live</span></div>
          <div className="panel-body" style={{paddingTop:8}}>
            {activities.map((a,i)=>(
              <div key={i} className="activity-item">
                <div className="activity-ring" style={{background:a.bg,color:a.c,flexShrink:0}}><Icon name={a.icon} size={14}/></div>
                <div>
                  <div className="activity-text">{a.text}</div>
                  <div className="activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head"><div className="panel-title">KPI Status — ERP Implementation</div></div>
          <div className="panel-body">
            {kpis.map(k=>(
              <div key={k.l} style={{marginBottom:15}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                  <span style={{fontSize:12,color:'var(--text-secondary)'}}>{k.l}</span>
                  <span style={{fontSize:12,fontWeight:600,color:k.v>=k.t?'var(--green)':'var(--amber)',fontFamily:'var(--font-mono)'}}>
                    {k.v}% <span style={{color:'var(--text-muted)',fontWeight:400,fontFamily:'var(--font-body)'}}>/ {k.t}%</span>
                  </span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{width:`${Math.min(k.v,100)}%`,background:k.c}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Pending Approvals</div>
            <span className="badge badge-amber">{(stats?.pendingVouchers||0)+(stats?.pendingLeaves||0)} pending</span>
          </div>
          <div className="panel-body">
            {[
              ['Payment Voucher','Finance Dept','₨45,000'],
              ['Leave Request','Ahmad Bilal — 3 days','Annual Leave'],
              ['Purchase Order','Procurement','₨1.2M'],
            ].map(([t,by,val],i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid var(--border-dim)'}}>
                <div>
                  <div style={{fontSize:13,fontWeight:500,color:'var(--text-primary)'}}>{t}</div>
                  <div style={{fontSize:11,color:'var(--text-muted)',marginTop:2}}>{by} · {val}</div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={()=>toast('Navigating to approval page','info')}>Review</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
//  ANALYTICS
// ════════════════════════════════════════════════════════════════════════════════
export function AnalyticsPage() {
  const trendData = [{m:'Oct',exp:55,bgt:65},{m:'Nov',exp:48,bgt:65},{m:'Dec',exp:62,bgt:65},{m:'Jan',exp:58,bgt:65},{m:'Feb',exp:70,bgt:65},{m:'Mar',exp:63,bgt:65}]
  const hrData = [{name:'Faculty',value:312},{name:'Admin Staff',value:185},{name:'Lab Staff',value:224},{name:'Support',value:126}]
  const depts = [{n:'Finance',v:94,c:'#3b82f6'},{n:'HR',v:87,c:'#8b5cf6'},{n:'IT',v:79,c:'#10b981'},{n:'Procurement',v:91,c:'#f59e0b'},{n:'Academic',v:96,c:'#06b6d4'}]
  return (
    <>
      <Crumb parts={['Home','Analytics']}/>
      <div className="stat-grid">
        <StatCard label="System Uptime" value="99.8%" sub="SLA Target: 99%" trend="up" icon="shield" color="green"/>
        <StatCard label="Data Accuracy" value="99.6%" sub="Target: 99%" trend="up" icon="chart" color="blue"/>
        <StatCard label="UAT Progress"  value="87%"   sub="Target: 100%" icon="star" color="amber"/>
        <StatCard label="Training Done" value="73%"   sub="Target: 100%" icon="users" color="purple"/>
      </div>
      <div className="panel mb20">
        <div className="panel-head"><div className="panel-title">Monthly Expenditure Trend</div><div className="panel-subtitle">vs. Budget line · PKR Million</div></div>
        <div className="panel-body">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="m" stroke="transparent" tick={{fontSize:11,fill:'var(--text-muted)'}}/>
              <YAxis stroke="transparent" tick={{fontSize:11,fill:'var(--text-muted)'}}/>
              <TT formatter={v=>`₨${v}M`}/>
              <Area type="monotone" dataKey="exp" stroke="#3b82f6" strokeWidth={2.5} fill="url(#expGrad)" name="Expenditure"/>
              <Line type="monotone" dataKey="bgt" stroke="rgba(245,158,11,0.6)" strokeWidth={1.5} strokeDasharray="6 4" dot={false} name="Budget"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid-2">
        <div className="panel">
          <div className="panel-head"><div className="panel-title">Department Performance</div></div>
          <div className="panel-body">
            {depts.map(d=>(
              <div key={d.n} style={{marginBottom:16}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                  <span style={{fontSize:13,color:'var(--text-secondary)'}}>{d.n}</span>
                  <span style={{fontSize:13,fontWeight:600,color:'var(--text-primary)',fontFamily:'var(--font-mono)'}}>{d.v}%</span>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{width:`${d.v}%`,background:d.c}}/></div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><div className="panel-title">HR Staff Distribution</div></div>
          <div className="panel-body">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart><Pie data={hrData} cx="50%" cy="50%" outerRadius={75} dataKey="value" stroke="none" paddingAngle={3}>
                {hrData.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}
              </Pie><TT/></PieChart>
            </ResponsiveContainer>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:12}}>
              {hrData.map((h,i)=>(
                <div key={h.name} style={{display:'flex',alignItems:'center',gap:6,fontSize:11}}>
                  <span style={{width:8,height:8,borderRadius:2,background:COLORS[i],display:'inline-block',flexShrink:0}}/>
                  <span style={{color:'var(--text-muted)'}}>{h.name}</span>
                  <span style={{marginLeft:'auto',color:'var(--text-primary)',fontFamily:'var(--font-mono)',fontWeight:600}}>{h.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
//  EMPLOYEES
// ════════════════════════════════════════════════════════════════════════════════
const DEPTS = ['Computer Science','Electrical Eng.','Civil Eng.','Mechanical Eng.','Finance','HR','IT Dept','Administration','Research']
export function EmployeesPage() {
  const [emps, setEmps]       = useState([])
  const [filtered, setFilt]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [deptF, setDeptF]     = useState('')
  const [modal, setModal]     = useState(null)
  const [saving, setSaving]   = useState(false)
  const [form, setForm]       = useState({})
  const toast = useToast()

  async function load() {
    const { data, success } = await employeeAPI.getAll()
    if (success) { setEmps(data); setFilt(data) }
    setLoading(false)
  }
  useEffect(() => { load() }, [])
  useEffect(() => {
    let list = emps
    if (search) list = list.filter(e=>`${e.fullName}${e.empId}${e.department}`.toLowerCase().includes(search.toLowerCase()))
    if (deptF)  list = list.filter(e=>e.department===deptF)
    setFilt(list)
  }, [emps, search, deptF])

  const openAdd = () => { setForm({empId:`EMP-${String(emps.length+1).padStart(3,'0')}`,fullName:'',designation:'',department:'',basicSalary:'',joiningDate:new Date().toISOString().split('T')[0],status:'Active'}); setModal('add') }
  const openEdit = e => { setForm({...e,basicSalary:String(e.basicSalary||'')}); setModal(e) }

  async function save() {
    if (!form.fullName) { toast('Full name required','error'); return }
    setSaving(true)
    const res = modal==='add' ? await employeeAPI.create({...form,basicSalary:Number(form.basicSalary)||0}) : await employeeAPI.update(modal._id,{...form,basicSalary:Number(form.basicSalary)||0})
    setSaving(false)
    if (res.success) { toast(modal==='add'?`${form.fullName} added`:'Employee updated','success'); setModal(null); load() }
    else toast(res.message,'error')
  }

  async function del(emp) {
    if (!confirm(`Delete ${emp.fullName}?`)) return
    const res = await employeeAPI.delete(emp._id)
    if (res.success) { toast(`${emp.fullName} deleted`,'success'); load() }
    else toast(res.message,'error')
  }

  function exportCSV() {
    const csv = Papa.unparse(filtered.map(e=>({'ID':e.empId,'Name':e.fullName,'Designation':e.designation,'Department':e.department,'Salary':e.basicSalary,'Join Date':e.joiningDate,'Status':e.status})))
    const a = document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download=`employees-${Date.now()}.csv`; a.click()
    toast('CSV exported','success')
  }

  const f = k => e => setForm(p=>({...p,[k]:e.target.value}))
  return (
    <>
      <Crumb parts={['HR','Employees']}/>
      <div className="stat-grid">
        <StatCard label="Total Employees" value={emps.length||0} sub={`${emps.filter(e=>e.status==='Active').length} active`} icon="users" color="blue"/>
        <StatCard label="Active" value={emps.filter(e=>e.status==='Active').length} sub="Currently working" icon="users" color="green"/>
        <StatCard label="On Leave" value={emps.filter(e=>e.status==='On Leave').length} sub="Right now" icon="calendar" color="amber"/>
        <StatCard label="Departments" value={[...new Set(emps.map(e=>e.department))].length} sub="Across university" icon="grid" color="purple"/>
      </div>
      <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap',alignItems:'center'}}>
        <div style={{position:'relative',flex:'0 0 220px'}}>
          <Icon name="search" size={13} style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)'}}/>
          <input className="form-input" placeholder="Search name, ID, dept..." style={{paddingLeft:34}} value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select className="form-input" style={{width:180}} value={deptF} onChange={e=>setDeptF(e.target.value)}>
          <option value="">All Departments</option>
          {DEPTS.map(d=><option key={d}>{d}</option>)}
        </select>
        <button className="btn btn-primary" onClick={openAdd}><Icon name="users" size={14}/>Add Employee</button>
        <button className="btn btn-ghost"   onClick={exportCSV}><Icon name="receipt" size={14}/>Export CSV</button>
        <span style={{marginLeft:'auto',fontSize:12,color:'var(--text-muted)',fontFamily:'var(--font-mono)'}}>{filtered.length} records</span>
      </div>
      <div className="panel">
        <div className="tbl-scroll">
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Designation</th><th>Department</th><th>Basic Salary</th><th>Join Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <LoadingRows cols={8}/> : filtered.length ? filtered.map(e=>(
                <tr key={e._id}>
                  <td className="mono" style={{fontSize:11}}>{e.empId}</td>
                  <td><strong>{e.fullName}</strong></td>
                  <td>{e.designation}</td>
                  <td>{e.department}</td>
                  <td className="mono">₨{Number(e.basicSalary||0).toLocaleString()}</td>
                  <td style={{fontSize:11,color:'var(--text-muted)'}}>{e.joiningDate}</td>
                  <td><SBadge s={e.status}/></td>
                  <td><div style={{display:'flex',gap:6}}><button className="btn btn-ghost btn-sm" onClick={()=>openEdit(e)}>Edit</button><button className="btn btn-danger btn-sm" onClick={()=>del(e)}>Del</button></div></td>
                </tr>
              )) : (
                <tr><td colSpan={8} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>{search||deptF?'No results found':'No employees yet — click Add Employee'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {modal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="modal">
            <div className="modal-title">{modal==='add'?'Add New Employee':`Edit: ${modal.fullName}`}</div>
            <div className="form-row"><div className="form-group"><label className="form-label">Employee ID</label><input className="form-input" value={form.empId||''} onChange={f('empId')}/></div><div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" value={form.fullName||''} onChange={f('fullName')} placeholder="Dr. Muhammad Ali"/></div></div>
            <div className="form-row"><div className="form-group"><label className="form-label">Designation</label><input className="form-input" value={form.designation||''} onChange={f('designation')} placeholder="Assistant Professor"/></div><div className="form-group"><label className="form-label">Department</label><select className="form-input" value={form.department||''} onChange={f('department')}><option value="">— Select —</option>{DEPTS.map(d=><option key={d}>{d}</option>)}</select></div></div>
            <div className="form-row"><div className="form-group"><label className="form-label">Basic Salary (₨)</label><input className="form-input" type="number" value={form.basicSalary||''} onChange={f('basicSalary')}/></div><div className="form-group"><label className="form-label">Joining Date</label><input className="form-input" type="date" value={form.joiningDate||''} onChange={f('joiningDate')}/></div></div>
            <div className="form-group" style={{marginBottom:22}}><label className="form-label">Status</label><select className="form-input" value={form.status||'Active'} onChange={f('status')}><option>Active</option><option>On Leave</option><option>Resigned</option><option>Retired</option></select></div>
            <div style={{display:'flex',gap:10}}><button className="btn btn-primary" onClick={save} disabled={saving}>{saving?<><div className="spinner" style={{width:14,height:14}}/> Saving...</>:(modal==='add'?'Add Employee':'Save Changes')}</button><button className="btn btn-ghost" onClick={()=>setModal(null)}>Cancel</button></div>
          </div>
        </div>
      )}
    </>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
//  ACCOUNTING
// ════════════════════════════════════════════════════════════════════════════════
const ACCOUNTS = ['1001 - Cash & Bank','2001 - Salaries Payable','3001 - HEC Grants','4001 - Fixed Assets','5001 - Student Fee Revenue','6001 - Operating Expenses']
export function AccountingPage() {
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading]   = useState(true)
  const [tab, setTab]           = useState('vouchers')
  const [search, setSearch]     = useState('')
  const [typeF, setTypeF]       = useState('')
  const [modal, setModal]       = useState(false)
  const [saving, setSaving]     = useState(false)
  const [form, setForm]         = useState({voucherNo:'',voucherType:'Payment',description:'',amount:'',debitAccount:'',creditAccount:''})
  const toast = useToast()

  async function load() {
    const { data, success } = await voucherAPI.getAll()
    if (success) setVouchers(data)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const filtered = vouchers.filter(v => {
    const q = `${v.voucherNo}${v.description}`.toLowerCase().includes(search.toLowerCase())
    const t = typeF ? v.voucherType===typeF : true
    return q && t
  })

  async function createVoucher() {
    if (!form.voucherNo||!form.amount) { toast('Voucher number and amount required','error'); return }
    setSaving(true)
    const res = await voucherAPI.create({...form,amount:Number(form.amount)})
    setSaving(false)
    if (res.success) { toast(`${form.voucherNo} created`,'success'); setModal(false); load() }
    else toast(res.message,'error')
  }
  async function approve(id, no) {
    const res = await voucherAPI.updateStatus(id,'Approved')
    if (res.success) { toast(`${no} approved`,'success'); load() }
    else toast(res.message,'error')
  }
  function exportCSV() {
    const csv = Papa.unparse(filtered.map(v=>({'No':v.voucherNo,'Type':v.voucherType,'Desc':v.description,'Amount':v.amount,'Status':v.status,'Date':new Date(v.createdAt).toLocaleDateString()})))
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download=`vouchers-${Date.now()}.csv`;a.click()
    toast('Exported','success')
  }
  const totalDebit  = vouchers.filter(v=>v.voucherType!=='Receipt').reduce((s,v)=>s+Number(v.amount||0),0)
  const totalCredit = vouchers.filter(v=>v.voucherType==='Receipt').reduce((s,v)=>s+Number(v.amount||0),0)
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}))
  return (
    <>
      <Crumb parts={['Finance','Accounting']}/>
      <div className="stat-grid">
        <StatCard label="Total Vouchers" value={vouchers.length} sub="All time" icon="receipt" color="blue"/>
        <StatCard label="Total Credits"  value={`₨${(totalCredit/1e6).toFixed(1)}M`} sub="Receipts" icon="wallet" color="green"/>
        <StatCard label="Total Debits"   value={`₨${(totalDebit/1e6).toFixed(1)}M`}  sub="Payments" icon="wallet" color="red"/>
        <StatCard label="Pending"        value={vouchers.filter(v=>v.status==='Pending').length} sub="Awaiting approval" icon="shield" color="amber"/>
      </div>
      <div className="tab-bar">
        {['vouchers','ledger','reconciliation'].map(t=><div key={t} className={`tab${tab===t?' active':''}`} onClick={()=>setTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</div>)}
      </div>
      {tab==='vouchers' && <>
        <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
          <input className="form-input" placeholder="Search vouchers..." style={{width:220}} value={search} onChange={e=>setSearch(e.target.value)}/>
          <select className="form-input" style={{width:150}} value={typeF} onChange={e=>setTypeF(e.target.value)}>
            <option value="">All Types</option><option>Payment</option><option>Receipt</option><option>Journal</option>
          </select>
          <button className="btn btn-primary" onClick={()=>{setForm({voucherNo:`VCH-${Date.now().toString().slice(-5)}`,voucherType:'Payment',description:'',amount:'',debitAccount:'',creditAccount:''});setModal(true)}}>+ New Voucher</button>
          <button className="btn btn-ghost" onClick={exportCSV}>↓ Export</button>
        </div>
        <div className="panel">
          <div className="tbl-scroll">
            <table>
              <thead><tr><th>Voucher #</th><th>Date</th><th>Type</th><th>Description</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {loading ? <LoadingRows cols={7}/> : filtered.length ? filtered.map(v=>(
                  <tr key={v._id}>
                    <td><strong>{v.voucherNo}</strong></td>
                    <td style={{fontSize:11,color:'var(--text-muted)'}}>{new Date(v.createdAt).toLocaleDateString('en-PK')}</td>
                    <td><SBadge s={v.voucherType}/></td>
                    <td style={{maxWidth:180,overflow:'hidden',textOverflow:'ellipsis'}}>{v.description}</td>
                    <td className="mono">₨{Number(v.amount).toLocaleString()}</td>
                    <td><SBadge s={v.status}/></td>
                    <td>{v.status==='Pending'?<button className="btn btn-success btn-sm" onClick={()=>approve(v._id,v.voucherNo)}>Approve</button>:<span style={{fontSize:11,color:'var(--text-muted)'}}>—</span>}</td>
                  </tr>
                )) : <tr><td colSpan={7} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>No vouchers found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </>}
      {tab==='ledger' && (
        <div className="panel">
          <div className="panel-head"><div className="panel-title">General Ledger — FY 2025–26</div><button className="btn btn-ghost btn-sm" onClick={exportCSV}>Export</button></div>
          <div className="tbl-scroll"><table>
            <thead><tr><th>Account Code</th><th>Account Name</th><th>Opening Balance</th><th>Total Debit</th><th>Total Credit</th><th>Closing Balance</th></tr></thead>
            <tbody>
              {[{c:'1001',n:'Cash & Bank',op:48320000,dr:12400000,cr:8900000},{c:'2001',n:'Salaries Payable',op:0,dr:12400000,cr:12400000},{c:'3001',n:'HEC Grants',op:22000000,dr:0,cr:4500000},{c:'4001',n:'Fixed Assets',op:185000000,dr:1245000,cr:0},{c:'5001',n:'Student Fee Revenue',op:0,dr:0,cr:8500000}].map(l=>(
                <tr key={l.c}>
                  <td><strong>{l.c}</strong></td><td>{l.n}</td>
                  <td className="mono">₨{l.op.toLocaleString()}</td>
                  <td className="mono" style={{color:'var(--red)'}}>₨{l.dr.toLocaleString()}</td>
                  <td className="mono" style={{color:'var(--green)'}}>₨{l.cr.toLocaleString()}</td>
                  <td className="mono" style={{fontWeight:600}}>₨{(l.op+l.cr-l.dr).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}
      {tab==='reconciliation' && (
        <div className="stat-grid">
          <StatCard label="Bank Balance"   value="₨48.3M" icon="wallet" color="green"/>
          <StatCard label="Book Balance"   value="₨47.9M" icon="wallet" color="blue"/>
          <StatCard label="Difference"     value="₨0.4M"  icon="chart" color="amber"/>
          <StatCard label="Transactions"   value="1,284"  icon="receipt" color="purple"/>
        </div>
      )}
      {modal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="modal">
            <div className="modal-title">Create New Voucher</div>
            <div className="form-row"><div className="form-group"><label className="form-label">Voucher No *</label><input className="form-input" value={form.voucherNo} onChange={f('voucherNo')}/></div><div className="form-group"><label className="form-label">Type</label><select className="form-input" value={form.voucherType} onChange={f('voucherType')}><option>Payment</option><option>Receipt</option><option>Journal</option></select></div></div>
            <div className="form-row"><div className="form-group"><label className="form-label">Description</label><input className="form-input" value={form.description} onChange={f('description')}/></div><div className="form-group"><label className="form-label">Amount (₨) *</label><input className="form-input" type="number" value={form.amount} onChange={f('amount')}/></div></div>
            <div className="form-row"><div className="form-group"><label className="form-label">Debit Account</label><select className="form-input" value={form.debitAccount} onChange={f('debitAccount')}><option value="">— Select —</option>{ACCOUNTS.map(a=><option key={a}>{a}</option>)}</select></div><div className="form-group"><label className="form-label">Credit Account</label><select className="form-input" value={form.creditAccount} onChange={f('creditAccount')}><option value="">— Select —</option>{ACCOUNTS.map(a=><option key={a}>{a}</option>)}</select></div></div>
            <div style={{display:'flex',gap:10,marginTop:8}}><button className="btn btn-primary" onClick={createVoucher} disabled={saving}>{saving?'Creating...':'Create Voucher'}</button><button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button></div>
          </div>
        </div>
      )}
    </>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
//  BUDGET, PAYROLL, PROCUREMENT, LEAVE, AUDIT, SETTINGS, RECRUITMENT
// ════════════════════════════════════════════════════════════════════════════════
export function BudgetPage() {
  const [budget, setBudget] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({department:'',fiscalYear:'2025-26',approvedAmount:'',expendedAmount:'0'})
  const toast = useToast()
  useEffect(()=>{ budgetAPI.getAll().then(r=>{ if(r.success) setBudget(r.data); setLoading(false) }) },[])
  async function save() {
    const res = await budgetAPI.create({...form,approvedAmount:Number(form.approvedAmount),expendedAmount:Number(form.expendedAmount)})
    if(res.success){toast('Budget entry added','success');setModal(false);budgetAPI.getAll().then(r=>{if(r.success)setBudget(r.data)})}
    else toast(res.message,'error')
  }
  const total=budget.reduce((s,b)=>s+Number(b.approvedAmount||0),0)
  const expended=budget.reduce((s,b)=>s+Number(b.expendedAmount||0),0)
  const f=k=>e=>setForm(p=>({...p,[k]:e.target.value}))
  return (
    <>
      <Crumb parts={['Finance','Budget & Control']}/>
      <div className="stat-grid">
        <StatCard label="Total Approved" value={`₨${(total/1e6).toFixed(0)}M`} icon="pie" color="blue"/>
        <StatCard label="Total Expended" value={`₨${(expended/1e6).toFixed(0)}M`} icon="wallet" color="green"/>
        <StatCard label="Remaining"      value={`₨${((total-expended)/1e6).toFixed(0)}M`} icon="chart" color="amber"/>
        <StatCard label="Over-Budget"    value={budget.filter(b=>Number(b.expendedAmount)>Number(b.approvedAmount)).length} icon="shield" color="red"/>
      </div>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:14}}><button className="btn btn-primary" onClick={()=>setModal(true)}>+ Add Budget Entry</button></div>
      <div className="panel">
        <div className="tbl-scroll"><table>
          <thead><tr><th>Department</th><th>Approved</th><th>Expended</th><th>Remaining</th><th>Utilization</th><th>Status</th></tr></thead>
          <tbody>
            {loading ? <LoadingRows cols={6}/> : budget.length ? budget.map(b=>{
              const app=Number(b.approvedAmount||0),exp=Number(b.expendedAmount||0),pct=app?Math.round((exp/app)*100):0
              return (
                <tr key={b._id}>
                  <td><strong>{b.department}</strong></td>
                  <td className="mono">₨{app.toLocaleString()}</td>
                  <td className="mono">₨{exp.toLocaleString()}</td>
                  <td className="mono" style={{color:(app-exp)<0?'var(--red)':'inherit'}}>₨{(app-exp).toLocaleString()}</td>
                  <td><div style={{display:'flex',alignItems:'center',gap:8}}><div className="progress-track" style={{width:80}}><div className="progress-fill" style={{width:`${Math.min(pct,100)}%`,background:pct>100?'var(--red)':pct>85?'var(--amber)':'var(--green)'}}/></div><span style={{fontSize:11,fontFamily:'var(--font-mono)'}}>{pct}%</span></div></td>
                  <td>{pct>100?<SBadge s="Over Budget"/>:pct>85?<SBadge s="Warning"/>:<SBadge s="Active"/>}</td>
                </tr>
              )
            }) : <tr><td colSpan={6} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>No budget data — click Add Budget Entry</td></tr>}
          </tbody>
        </table></div>
      </div>
      {modal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="modal">
            <div className="modal-title">Add Budget Entry</div>
            <div className="form-group" style={{marginBottom:14}}><label className="form-label">Department</label><select className="form-input" value={form.department} onChange={f('department')}><option value="">— Select —</option>{DEPTS.map(d=><option key={d}>{d}</option>)}</select></div>
            <div className="form-row"><div className="form-group"><label className="form-label">Approved Amount (₨)</label><input className="form-input" type="number" value={form.approvedAmount} onChange={f('approvedAmount')}/></div><div className="form-group"><label className="form-label">Already Expended (₨)</label><input className="form-input" type="number" value={form.expendedAmount} onChange={f('expendedAmount')}/></div></div>
            <div style={{display:'flex',gap:10,marginTop:8}}><button className="btn btn-primary" onClick={save}>Add Entry</button><button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button></div>
          </div>
        </div>
      )}
    </>
  )
}

export function PayrollPage() {
  const [month,setMonth]=useState('March')
  const [year,setYear]=useState('2026')
  const [processing,setProcessing]=useState(false)
  const toast=useToast()
  const staff=[{id:'EMP-001',name:'Dr. Imran Khan',desig:'Assoc. Professor',basic:85000,allow:32000,gpf:6800,tax:4250},{id:'EMP-002',name:'Eng. Sara Ahmed',desig:'Lab Engineer',basic:55000,allow:18000,gpf:4400,tax:2750},{id:'EMP-003',name:'Mr. Bilal Yousuf',desig:'Finance Officer',basic:60000,allow:22000,gpf:4800,tax:3000},{id:'EMP-004',name:'Ms. Ayesha Noor',desig:'HR Coordinator',basic:58000,allow:20000,gpf:4640,tax:2900}]
  async function processPayroll(){
    setProcessing(true)
    const res=await payrollAPI.process({month,year:Number(year)})
    setProcessing(false)
    if(res.success) toast(`Payroll processed for ${res.count||staff.length} employees`,'success')
    else toast('Payroll processed (demo mode)','success')
  }
  const gross=staff.reduce((s,e)=>s+e.basic+e.allow,0)
  const deductions=staff.reduce((s,e)=>s+e.gpf+e.tax,0)
  return (
    <>
      <Crumb parts={['Finance','Payroll']}/>
      <div className="stat-grid">
        <StatCard label="Gross Payroll" value={`₨${(gross/1e6).toFixed(2)}M`} icon="receipt" color="blue"/>
        <StatCard label="Net Payable"   value={`₨${((gross-deductions)/1e6).toFixed(2)}M`} icon="wallet" color="green"/>
        <StatCard label="Deductions"    value={`₨${(deductions/1000).toFixed(0)}K`} icon="pie" color="amber"/>
        <StatCard label="Employees"     value={staff.length} icon="users" color="purple"/>
      </div>
      <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap',alignItems:'center'}}>
        <select className="form-input" style={{width:140}} value={month} onChange={e=>setMonth(e.target.value)}>{['January','February','March','April','May','June','July','August','September','October','November','December'].map(m=><option key={m}>{m}</option>)}</select>
        <select className="form-input" style={{width:100}} value={year} onChange={e=>setYear(e.target.value)}><option>2026</option><option>2025</option></select>
        <button className="btn btn-primary" onClick={processPayroll} disabled={processing}>{processing?<><div className="spinner" style={{width:14,height:14}}/> Processing...</>:'▶ Process Payroll'}</button>
        <button className="btn btn-ghost" onClick={()=>toast('Payslips exported','success')}>↓ Export Payslips</button>
      </div>
      <div className="panel">
        <div className="tbl-scroll"><table>
          <thead><tr><th>Emp ID</th><th>Name</th><th>Designation</th><th>Basic</th><th>Allowances</th><th>GPF</th><th>Tax</th><th>Net Pay</th><th>Payslip</th></tr></thead>
          <tbody>{staff.map(e=>(
            <tr key={e.id}>
              <td className="mono" style={{fontSize:11}}>{e.id}</td><td><strong>{e.name}</strong></td><td>{e.desig}</td>
              <td className="mono">₨{e.basic.toLocaleString()}</td>
              <td className="mono" style={{color:'var(--green)'}}>₨{e.allow.toLocaleString()}</td>
              <td className="mono" style={{color:'var(--red)'}}>₨{e.gpf.toLocaleString()}</td>
              <td className="mono" style={{color:'var(--red)'}}>₨{e.tax.toLocaleString()}</td>
              <td className="mono" style={{fontWeight:600,color:'var(--text-primary)'}}>₨{(e.basic+e.allow-e.gpf-e.tax).toLocaleString()}</td>
              <td><button className="btn btn-ghost btn-sm" onClick={()=>toast(`Payslip for ${e.name} ready`,'success')}>↓ PDF</button></td>
            </tr>
          ))}</tbody>
        </table></div>
      </div>
    </>
  )
}

export function LeavePage() {
  const [leaves, setLeaves]   = useState([])
  const [emps, setEmps]       = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all')
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState({employee:'',leaveType:'Annual Leave',fromDate:'',toDate:'',reason:''})
  const [saving, setSaving]   = useState(false)
  const toast = useToast()
  async function load(){
    const [l,e]=await Promise.all([leaveAPI.getAll(),employeeAPI.getAll()])
    if(l.success)setLeaves(l.data)
    if(e.success)setEmps(e.data)
    setLoading(false)
  }
  useEffect(()=>{load()},[])
  const days=(f,t)=>f&&t?Math.max(1,Math.round((new Date(t)-new Date(f))/86400000)+1):1
  async function submit(){
    if(!form.employee||!form.fromDate||!form.toDate){toast('All fields required','error');return}
    setSaving(true)
    const res=await leaveAPI.create({...form,daysCount:days(form.fromDate,form.toDate)})
    setSaving(false)
    if(res.success){toast('Leave request submitted','success');setModal(false);load()}
    else toast(res.message,'error')
  }
  async function changeStatus(id,status,name){
    const res=await leaveAPI.updateStatus(id,status)
    if(res.success){toast(`Leave ${status.toLowerCase()} for ${name}`,'success');load()}
    else toast(res.message,'error')
  }
  const displayed=filter==='all'?leaves:leaves.filter(l=>l.status===filter)
  const f=k=>e=>setForm(p=>({...p,[k]:e.target.value}))
  return (
    <>
      <Crumb parts={['HR','Leave Management']}/>
      <div className="stat-grid">
        <StatCard label="Pending"   value={leaves.filter(l=>l.status==='Pending').length}  icon="calendar" color="red"/>
        <StatCard label="Approved"  value={leaves.filter(l=>l.status==='Approved').length} icon="calendar" color="green"/>
        <StatCard label="Rejected"  value={leaves.filter(l=>l.status==='Rejected').length} icon="calendar" color="amber"/>
        <StatCard label="Total"     value={leaves.length}                                  icon="calendar" color="blue"/>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,flexWrap:'wrap',gap:10}}>
        <div className="tab-bar" style={{marginBottom:0}}>
          {['all','Pending','Approved','Rejected'].map(s=><div key={s} className={`tab${filter===s?' active':''}`} onClick={()=>setFilter(s)}>{s==='all'?'All':s}</div>)}
        </div>
        <button className="btn btn-primary" onClick={()=>{setForm({employee:'',leaveType:'Annual Leave',fromDate:'',toDate:'',reason:''});setModal(true)}}>+ New Request</button>
      </div>
      <div className="panel">
        <div className="tbl-scroll"><table>
          <thead><tr><th>Employee</th><th>Department</th><th>Leave Type</th><th>From</th><th>To</th><th>Days</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {loading?<LoadingRows cols={8}/>:displayed.length?displayed.map(l=>(
              <tr key={l._id}>
                <td><strong>{l.employee?.fullName||'—'}</strong></td>
                <td>{l.employee?.department||'—'}</td>
                <td>{l.leaveType}</td>
                <td style={{fontSize:11,color:'var(--text-muted)'}}>{l.fromDate}</td>
                <td style={{fontSize:11,color:'var(--text-muted)'}}>{l.toDate}</td>
                <td><span className="badge badge-blue">{l.daysCount}d</span></td>
                <td><SBadge s={l.status}/></td>
                <td>{l.status==='Pending'?<div style={{display:'flex',gap:6}}><button className="btn btn-success btn-sm" onClick={()=>changeStatus(l._id,'Approved',l.employee?.fullName)}>✓</button><button className="btn btn-danger btn-sm" onClick={()=>changeStatus(l._id,'Rejected',l.employee?.fullName)}>✕</button></div>:<span style={{fontSize:11,color:'var(--text-muted)'}}>—</span>}</td>
              </tr>
            )):<tr><td colSpan={8} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>No leave requests</td></tr>}
          </tbody>
        </table></div>
      </div>
      {modal&&(<div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}><div className="modal">
        <div className="modal-title">New Leave Request</div>
        <div className="form-group" style={{marginBottom:14}}><label className="form-label">Employee *</label><select className="form-input" value={form.employee} onChange={f('employee')}><option value="">— Select Employee —</option>{emps.map(e=><option key={e._id} value={e._id}>{e.fullName} ({e.department})</option>)}</select></div>
        <div className="form-group" style={{marginBottom:14}}><label className="form-label">Leave Type</label><select className="form-input" value={form.leaveType} onChange={f('leaveType')}>{['Annual Leave','Sick Leave','Casual Leave','Medical Leave','Maternity Leave','Study Leave'].map(t=><option key={t}>{t}</option>)}</select></div>
        <div className="form-row"><div className="form-group"><label className="form-label">From *</label><input className="form-input" type="date" value={form.fromDate} onChange={f('fromDate')}/></div><div className="form-group"><label className="form-label">To *</label><input className="form-input" type="date" value={form.toDate} onChange={f('toDate')}/></div></div>
        {form.fromDate&&form.toDate&&<div style={{background:'rgba(59,130,246,0.08)',border:'1px solid rgba(59,130,246,0.15)',borderRadius:'var(--r10)',padding:'10px 14px',marginBottom:14,fontSize:12,color:'var(--text-secondary)'}}>Total days: <strong style={{color:'var(--blue-g)'}}>{days(form.fromDate,form.toDate)}</strong></div>}
        <div style={{display:'flex',gap:10,marginTop:8}}><button className="btn btn-primary" onClick={submit} disabled={saving}>{saving?'Submitting...':'Submit Request'}</button><button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button></div>
      </div></div>)}
    </>
  )
}

export function ProcurementPage() {
  const [modal,setModal]=useState(false)
  const [saving,setSaving]=useState(false)
  const [form,setForm]=useState({vendor:'',itemDesc:'',quantity:1,unitPrice:'',requiredBy:''})
  const toast=useToast()
  const pos=[{po:'PO-2026-087',vendor:'Techno Solutions',item:'HP Servers x5',amt:2850000,date:'2026-04-08',status:'Pending'},{po:'PO-2026-086',vendor:'National Stationery',item:'Office Supplies Q2',amt:185000,date:'2026-04-05',status:'Approved'},{po:'PO-2026-085',vendor:'Pak Chemicals Ltd.',item:'Lab Chemicals',amt:420000,date:'2026-04-02',status:'Delivered'},{po:'PO-2026-084',vendor:'ZRK Printers',item:'Printing Services',amt:95000,date:'2026-03-28',status:'Delivered'}]
  async function createPO(){
    if(!form.vendor||!form.itemDesc||!form.unitPrice){toast('Vendor, item and price required','error');return}
    setSaving(true)
    const res=await procurementAPI.create({...form,unitPrice:Number(form.unitPrice),totalAmount:Number(form.unitPrice)*Number(form.quantity||1)})
    setSaving(false)
    if(res.success){toast(`PO ${res.data?.poNumber} created`,'success');setModal(false)}
    else toast('PO created (demo mode)','success'),setModal(false)
  }
  const f=k=>e=>setForm(p=>({...p,[k]:e.target.value}))
  return (
    <>
      <Crumb parts={['Finance','Procurement']}/>
      <div className="stat-grid">
        <StatCard label="Active POs"   value={pos.filter(p=>p.status!=='Delivered').length} icon="cart" color="blue"/>
        <StatCard label="Pending"      value={pos.filter(p=>p.status==='Pending').length}   icon="cart" color="amber"/>
        <StatCard label="Delivered"    value={pos.filter(p=>p.status==='Delivered').length}  icon="cart" color="green"/>
        <StatCard label="Total Value"  value={`₨${(pos.reduce((s,p)=>s+p.amt,0)/1e6).toFixed(1)}M`} icon="wallet" color="purple"/>
      </div>
      <div style={{display:'flex',gap:10,marginBottom:16}}><button className="btn btn-primary" onClick={()=>setModal(true)}>+ New Purchase Order</button><button className="btn btn-ghost" onClick={()=>toast('Requisition submitted','info')}>+ Requisition</button></div>
      <div className="panel">
        <div className="tbl-scroll"><table>
          <thead><tr><th>PO #</th><th>Vendor</th><th>Item</th><th>Amount</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>{pos.map(p=>(
            <tr key={p.po}><td><strong>{p.po}</strong></td><td>{p.vendor}</td><td>{p.item}</td>
            <td className="mono">₨{p.amt.toLocaleString()}</td>
            <td style={{fontSize:11,color:'var(--text-muted)'}}>{p.date}</td>
            <td><SBadge s={p.status}/></td>
            <td><button className="btn btn-ghost btn-sm" onClick={()=>toast('PO details opened','info')}>View</button></td>
            </tr>
          ))}</tbody>
        </table></div>
      </div>
      {modal&&(<div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}><div className="modal">
        <div className="modal-title">Create Purchase Order</div>
        <div className="form-row"><div className="form-group"><label className="form-label">Vendor Name *</label><input className="form-input" value={form.vendor} onChange={f('vendor')} placeholder="Vendor Co. Ltd."/></div><div className="form-group"><label className="form-label">Item Description *</label><input className="form-input" value={form.itemDesc} onChange={f('itemDesc')} placeholder="Computers x10"/></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Unit Price (₨) *</label><input className="form-input" type="number" value={form.unitPrice} onChange={f('unitPrice')}/></div><div className="form-group"><label className="form-label">Quantity</label><input className="form-input" type="number" value={form.quantity} onChange={f('quantity')} min={1}/></div></div>
        <div className="form-group" style={{marginBottom:20}}><label className="form-label">Required By</label><input className="form-input" type="date" value={form.requiredBy} onChange={f('requiredBy')}/></div>
        <div style={{display:'flex',gap:10}}><button className="btn btn-primary" onClick={createPO} disabled={saving}>{saving?'Creating...':'Create PO'}</button><button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button></div>
      </div></div>)}
    </>
  )
}

export function RecruitmentPage() {
  const jobs=[{title:'Assistant Professor CS',dept:'Computer Science',apps:84,short:12,status:'Interviewing'},{title:'Lab Engineer',dept:'Electrical Eng.',apps:42,short:8,status:'Shortlisting'},{title:'Finance Officer',dept:'Finance',apps:67,short:14,status:'Offer Stage'},{title:'IT Support Officer',dept:'IT Dept',apps:91,short:13,status:'Interviewing'},{title:'Admin Officer',dept:'Administration',apps:55,short:9,status:'Applications Open'}]
  return (
    <>
      <Crumb parts={['HR','Recruitment']}/>
      <div className="stat-grid">
        <StatCard label="Open Positions"   value={jobs.length} icon="star" color="blue"/>
        <StatCard label="Total Applications" value={jobs.reduce((s,j)=>s+j.apps,0)} icon="users" color="amber"/>
        <StatCard label="Shortlisted"      value={jobs.reduce((s,j)=>s+j.short,0)} icon="users" color="green"/>
        <StatCard label="Hired YTD"        value="23" icon="users" color="purple"/>
      </div>
      <div className="panel"><div className="tbl-scroll"><table>
        <thead><tr><th>Position</th><th>Department</th><th>Applications</th><th>Shortlisted</th><th>Stage</th></tr></thead>
        <tbody>{jobs.map(j=><tr key={j.title}><td><strong>{j.title}</strong></td><td>{j.dept}</td><td>{j.apps}</td><td>{j.short}</td><td><SBadge s={j.status}/></td></tr>)}</tbody>
      </table></div></div>
    </>
  )
}

export function AuditPage() {
  const [logs,setLogs]=useState([])
  const [loading,setLoading]=useState(true)
  const toast=useToast()
  useEffect(()=>{ auditAPI.getAll().then(r=>{if(r.success)setLogs(r.data);setLoading(false)}) },[])
  return (
    <>
      <Crumb parts={['System','Audit Logs']}/>
      <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
        <input className="form-input" placeholder="Search logs..." style={{width:220}}/>
        <select className="form-input" style={{width:150}}><option>All Modules</option><option>Finance</option><option>HR</option><option>System</option></select>
        <input className="form-input" type="date" style={{width:160}} defaultValue={new Date().toISOString().split('T')[0]}/>
        <button className="btn btn-ghost" onClick={()=>toast('Audit log exported','success')}>↓ Export</button>
      </div>
      <div className="panel"><div className="tbl-scroll"><table>
        <thead><tr><th>Timestamp</th><th>User</th><th>Module</th><th>Action</th><th>Record</th></tr></thead>
        <tbody>
          {loading?<LoadingRows cols={5}/>:logs.length?logs.map(l=>(
            <tr key={l._id}>
              <td className="mono" style={{fontSize:11,color:'var(--text-muted)'}}>{new Date(l.createdAt).toLocaleString('en-PK')}</td>
              <td><strong>{l.userEmail||l.user?.email||'System'}</strong></td>
              <td><span className="badge badge-blue">{l.module}</span></td>
              <td>{l.action}</td>
              <td style={{color:'var(--text-muted)',fontSize:11}}>{l.recordRef}</td>
            </tr>
          )):<tr><td colSpan={5} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>No audit logs yet — they appear as you use the system</td></tr>}
        </tbody>
      </table></div></div>
    </>
  )
}

export function SettingsPage() {
  const {user}=useAuth()
  const toast=useToast()
  return (
    <>
      <Crumb parts={['System','Settings']}/>
      <div className="grid-2">
        <div className="panel">
          <div className="panel-head"><div className="panel-title">System Configuration</div></div>
          <div className="panel-body">
            {[['Two-Factor Authentication','Require 2FA for admin accounts',true],['Email Notifications','Send alerts via email',true],['Audit Trail','Log all user activities',true],['IP Restriction','Limit to university network',false],['Auto Backup','Daily automated backup',true],['Real-Time Sync','Live data sync across users',true]].map(([t,d,on])=>(
              <div key={t} className="toggle-row">
                <div className="toggle-label"><div className="t-title">{t}</div><div className="t-desc">{d}</div></div>
                <label className="toggle-switch"><input type="checkbox" defaultChecked={on} onChange={()=>toast(`${t} updated`,'success')}/><span className="t-slider"/></label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="panel mb20">
            <div className="panel-head"><div className="panel-title">Profile</div></div>
            <div className="panel-body">
              <div className="form-group" style={{marginBottom:14}}><label className="form-label">Email</label><input className="form-input" value={user?.email||''} readOnly style={{opacity:.6}}/></div>
              <div className="form-group" style={{marginBottom:14}}><label className="form-label">Display Name</label><input className="form-input" defaultValue={user?.name||'System Admin'}/></div>
              <div className="form-group" style={{marginBottom:18}}><label className="form-label">New Password</label><input className="form-input" type="password" placeholder="Leave blank to keep current"/></div>
              <button className="btn btn-primary" onClick={()=>toast('Profile saved','success')}>Save Changes</button>
            </div>
          </div>
          <div className="panel">
            <div className="panel-head"><div className="panel-title">System Info</div></div>
            <div className="panel-body">
              {[['Version','UET ERP Pro v2.0'],['Database','MongoDB Atlas'],['Deployment','Cloud + GitHub Pages'],['Last Backup','Today 03:00 AM ✓'],['Uptime','99.8% this month'],['Active Users','4 sessions']].map(([k,v])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:'1px solid var(--border-dim)',fontSize:13}}>
                  <span style={{color:'var(--text-muted)'}}>{k}</span>
                  <span style={{color:'var(--text-primary)',fontWeight:500}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
