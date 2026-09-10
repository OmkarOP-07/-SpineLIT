import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  Users, BarChart2, FileText, AlertTriangle, Eye,
  Upload, UserPlus, TrendingUp, ArrowRight, Activity, Clock, Mars
} from 'lucide-react'

const statCards = [
  { value: '42', label: 'Total Patients',      sub: '↑ 6 this month', icon: Users,         iconBg: 'rgba(133, 57, 83, 0.15)', iconColor: 'var(--primary)', subColor: 'var(--primary)' },
  { value: '18', label: 'Analyses This Month', sub: '↑ 3 this week',  icon: BarChart2,      iconBg: '#D1FAE5', iconColor: '#065F46', subColor: '#065F46' },
  { value: '12', label: 'Reports Generated',   sub: '↑ 4 this week',  icon: FileText,       iconBg: 'rgba(133, 57, 83, 0.15)', iconColor: 'var(--primary)', subColor: 'var(--primary)' },
  { value: '5',  label: 'High Risk Alerts',    sub: 'View all alerts', icon: AlertTriangle, iconBg: '#FEF3C7', iconColor: '#92400E', subColor: '#92400E' },
]

const recentAnalyses = [
  { id: 'PNT-2025-0487', name: 'Rohit Kumar',  date: '20 May 2025', time: '10:35 AM', type: 'X-ray Lumbar Spine', severity: 'Grade II',  sevClass: 'severity-2', status: 'Completed',   statusClass: 'badge-completed' },
  { id: 'PNT-2025-0486', name: 'Sunita Verma', date: '19 May 2025', time: '04:20 PM', type: 'MRI Lumbar Spine',   severity: 'Grade I',   sevClass: 'severity-1', status: 'Completed',   statusClass: 'badge-completed' },
  { id: 'PNT-2025-0485', name: 'Ajay Singh',   date: '19 May 2025', time: '11:15 AM', type: 'X-ray Lumbar Spine', severity: 'Grade III', sevClass: 'severity-3', status: 'Completed',   statusClass: 'badge-completed' },
  { id: 'PNT-2025-0484', name: 'Neha Patil',   date: '18 May 2025', time: '05:40 PM', type: 'MRI Lumbar Spine',   severity: 'Grade II',  sevClass: 'severity-2', status: 'Completed',   statusClass: 'badge-completed' },
  { id: 'PNT-2025-0483', name: 'Manoj Gupta',  date: '18 May 2025', time: '10:10 AM', type: 'X-ray Lumbar Spine', severity: 'Grade I',   sevClass: 'severity-1', status: 'In Progress', statusClass: 'badge-progress'  },
]

const todayActivity = [
  { letter: 'A', bg: 'var(--primary)',  title: 'New analysis completed', patient: 'Rohit Kumar (PNT-2025-0487)',  time: '10:35 AM' },
  { letter: 'B', bg: '#948979',  title: 'Report generated',        patient: 'Sunita Verma (PNT-2025-0486)', time: '04:25 PM' },
  { letter: 'C', bg: '#10B981', title: 'Feedback received',        patient: 'Ajay Singh (PNT-2025-0485)',   time: '01:15 PM' },
  { letter: 'D', bg: '#EF4444', title: 'High risk alert',          patient: 'Neha Patil (PNT-2025-0484)',   time: '11:20 AM' },
]

const pendingFeedback = [
  { name: 'Ajay Singh',  pid: 'PNT-2025-0485', type: 'MRI Lumbar Spine',   severity: 'Grade III', sevClass: 'severity-3' },
  { name: 'Neha Patil',  pid: 'PNT-2025-0484', type: 'X-ray Lumbar Spine', severity: 'Grade II',  sevClass: 'severity-2' },
  { name: 'Manoj Gupta', pid: 'PNT-2025-0483', type: 'MRI Lumbar Spine',   severity: 'Grade I',   sevClass: 'severity-1' },
]

const quickActions = [
  { icon: Upload,     label: 'Upload New Scan',     sub: 'Start new analysis', color: 'var(--text-dark)', bg: 'rgba(133, 57, 83, 0.15)', to: '/dashboard/image-analysis' },
  { icon: UserPlus,   label: 'Add New Patient',      sub: 'Register patient',   color: '#065F46', bg: '#D1FAE5', to: '/dashboard/patients'       },
  { icon: FileText,   label: 'Generate Report',      sub: 'Create report',      color: 'var(--text-dark)', bg: 'rgba(133, 57, 83, 0.15)', to: '/dashboard/reports'        },
  { icon: TrendingUp, label: 'Analytics Dashboard',  sub: 'View insights',      color: '#92400E', bg: '#FEF3C7', to: '/dashboard/analytics'      },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'User')
  const isDoctor = user?.role === 'doctor'
  const greetingName = isDoctor && !displayName.toLowerCase().startsWith('dr.')
    ? `Dr. ${displayName}`
    : displayName

  return (
    <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1400px' }}>

      {/* Welcome */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '6px' }}>
          Welcome, {greetingName}
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
          {isDoctor ? "Here's what's happening with your patients today." : "Here's an overview of your spine health insights and scans."}
        </p>
      </div>

      {/* ── Featured Patient Card ── */}
      <div style={{
        background: 'var(--bg-card)', border: '1.5px solid rgba(133, 57, 83, 0.15)', borderRadius: '20px',
        padding: '28px 32px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '28px',
        boxShadow: '0 2px 12px rgba(34,40,49,0.05)'
      }}>
        {/* Avatar */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '20px', flexShrink: 0,
          background: 'linear-gradient(135deg,rgba(139, 92, 246, 0.15),#F5F0E8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Users size={34} color="var(--text-dark)" />
        </div>

        {/* Info */}
        <div style={{ minWidth: '180px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-dark)' }}>Rohit Kumar</span>
            <Mars size={18} color="var(--text-dark)" />
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.7' }}>PID: PNT-2025-0487</p>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Age: 54 Years &nbsp;|&nbsp; Gender: Male</p>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Phone: +91 98765 43210</p>
        </div>

        <div style={{ width: '1px', height: '64px', background: 'rgba(133, 57, 83, 0.15)', flexShrink: 0 }} />

        {/* Meta */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '36px', flex: 1 }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Last Visit</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="var(--text-muted)" />
              <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-dark)' }}>20 May 2025</span>
            </div>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Last Analysis</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} color="var(--text-muted)" />
              <div>
                <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-dark)', lineHeight: '1.3' }}>20 May 2025</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>10:35 AM</p>
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Condition</p>
            <span style={{
              display: 'inline-flex', padding: '6px 16px', borderRadius: '999px',
              fontSize: '13px', fontWeight: 600, background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A'
            }}>Under Observation</span>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Progression Risk: <span style={{ color: '#F97316', fontWeight: 700 }}>Moderate</span>
            </p>
          </div>
        </div>

        {/* CTA */}
        <Link to="/dashboard/patients" className="btn btn-primary" style={{ flexShrink: 0, fontSize: '14px', padding: '12px 24px' }}>
          View Full Profile <ArrowRight size={16} />
        </Link>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {statCards.map(({ value, label, sub, icon: Icon, iconBg, iconColor, subColor }) => (
          <div key={label} style={{
            background: 'var(--bg-card)', border: '1.5px solid rgba(133, 57, 83, 0.15)', borderRadius: '20px',
            padding: '28px', boxShadow: '0 2px 8px rgba(34,40,49,0.04)',
            transition: 'box-shadow 0.2s ease'
          }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: iconBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px'
            }}>
              <Icon size={24} color={iconColor} />
            </div>
            <p style={{ fontSize: '40px', fontWeight: 900, color: 'var(--text-dark)', lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)', marginTop: '8px' }}>{label}</p>
            <p style={{ fontSize: '13px', fontWeight: 600, marginTop: '6px', color: subColor }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* ── 2-col Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>

        {/* Analyses Table */}
        <div style={{ background: 'var(--bg-card)', border: '1.5px solid rgba(133, 57, 83, 0.15)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(34,40,49,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 28px', borderBottom: '1px solid rgba(133, 57, 83, 0.15)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)' }}>Recent Analyses</h2>
            <Link to="/dashboard/image-analysis" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>View All</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-warm)', borderBottom: '1px solid rgba(133, 57, 83, 0.15)' }}>
                  {['Patient ID', 'Patient Name', 'Date', 'Analysis Type', 'Severity', 'Status', 'Action'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '14px 20px', fontSize: '11px', fontWeight: 700,
                      color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentAnalyses.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #F5F0E8' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-warm)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '16px 20px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-muted)' }}>{row.id}</td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)', whiteSpace: 'nowrap' }}>{row.name}</td>
                    <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                      <p style={{ fontSize: '14px', color: 'var(--text-dark)' }}>{row.date}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{row.time}</p>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--text-dark)', whiteSpace: 'nowrap' }}>{row.type}</td>
                    <td style={{ padding: '16px 20px' }}><span className={row.sevClass}>{row.severity}</span></td>
                    <td style={{ padding: '16px 20px' }}><span className={row.statusClass}>{row.status}</span></td>
                    <td style={{ padding: '16px 20px' }}>
                      <button style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        border: '1.5px solid rgba(133, 57, 83, 0.15)', background: 'var(--bg-card)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(133, 57, 83, 0.15)'; e.currentTarget.style.borderColor = '#A85A75'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'rgba(133, 57, 83, 0.15)'; }}
                      >
                        <Eye size={15} color="var(--text-dark)" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Today's Activity */}
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid rgba(133, 57, 83, 0.15)', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 8px rgba(34,40,49,0.04)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '20px' }}>Today's Activity</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {todayActivity.map(({ letter, bg, title, patient, time }) => (
                <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: 700, flexShrink: 0, background: bg }}>
                    {letter}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)', lineHeight: '1.3' }}>{title}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{patient}</p>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0 }}>{time}</p>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid rgba(133, 57, 83, 0.15)', marginTop: '20px', paddingTop: '16px', textAlign: 'center' }}>
              <Link to="/dashboard/patient-history" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>View All Activity</Link>
            </div>
          </div>

          {/* Pending Feedback */}
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid rgba(133, 57, 83, 0.15)', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 8px rgba(34,40,49,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)' }}>Pending Doctor Feedback</h2>
              <span style={{ width: '26px', height: '26px', borderRadius: '999px', background: '#EF4444', color: 'white', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingFeedback.map(({ name, pid, type, severity, sevClass }) => (
                <div key={pid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '14px 16px', borderRadius: '14px', background: 'var(--bg-warm)', border: '1px solid rgba(133, 57, 83, 0.15)' }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {name} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '12px' }}>({pid})</span>
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>{type}</p>
                  </div>
                  <span className={sevClass}>{severity}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid rgba(133, 57, 83, 0.15)', marginTop: '20px', paddingTop: '16px', textAlign: 'center' }}>
              <Link to="/dashboard/doctor-feedback" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>Go to Feedback Panel</Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '16px' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {quickActions.map(({ icon: Icon, label, sub, color, bg, to }) => (
            <Link key={label} to={to} style={{
              background: 'var(--bg-card)', border: '1.5px solid rgba(133, 57, 83, 0.15)', borderRadius: '20px',
              padding: '28px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center',
              textAlign: 'center', gap: '16px', textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(34,40,49,0.04)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(34,40,49,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(34,40,49,0.04)'; }}
            >
              <div style={{ width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg }}>
                <Icon size={28} color={color} />
              </div>
              <div>
                <p style={{ fontSize: '15px', fontWeight: 700, color: color }}>{label}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
