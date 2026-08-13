import { Link } from 'react-router-dom'
import {
  Users, BarChart2, FileText, AlertTriangle, Eye,
  Upload, UserPlus, TrendingUp, ArrowRight, Activity, Clock, Mars
} from 'lucide-react'

const statCards = [
  { value: '42', label: 'Total Patients',      sub: '↑ 6 this month', icon: Users,         iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', subColor: 'text-indigo-500' },
  { value: '18', label: 'Analyses This Month', sub: '↑ 3 this week',  icon: BarChart2,      iconBg: 'bg-emerald-100',iconColor: 'text-emerald-600',subColor: 'text-emerald-500'},
  { value: '12', label: 'Reports Generated',   sub: '↑ 4 this week',  icon: FileText,       iconBg: 'bg-violet-100', iconColor: 'text-violet-600', subColor: 'text-violet-500' },
  { value: '5',  label: 'High Risk Alerts',    sub: 'View all alerts', icon: AlertTriangle,  iconBg: 'bg-amber-100',  iconColor: 'text-amber-600',  subColor: 'text-amber-500'  },
]

const recentAnalyses = [
  { id: 'PNT-2025-0487', name: 'Rohit Kumar',  date: '20 May 2025', time: '10:35 AM', type: 'X-ray Lumbar Spine', severity: 'Grade II',  sevClass: 'severity-2', status: 'Completed',   statusClass: 'badge-completed' },
  { id: 'PNT-2025-0486', name: 'Sunita Verma', date: '19 May 2025', time: '04:20 PM', type: 'MRI Lumbar Spine',   severity: 'Grade I',   sevClass: 'severity-1', status: 'Completed',   statusClass: 'badge-completed' },
  { id: 'PNT-2025-0485', name: 'Ajay Singh',   date: '19 May 2025', time: '11:15 AM', type: 'X-ray Lumbar Spine', severity: 'Grade III', sevClass: 'severity-3', status: 'Completed',   statusClass: 'badge-completed' },
  { id: 'PNT-2025-0484', name: 'Neha Patil',   date: '18 May 2025', time: '05:40 PM', type: 'MRI Lumbar Spine',   severity: 'Grade II',  sevClass: 'severity-2', status: 'Completed',   statusClass: 'badge-completed' },
  { id: 'PNT-2025-0483', name: 'Manoj Gupta',  date: '18 May 2025', time: '10:10 AM', type: 'X-ray Lumbar Spine', severity: 'Grade I',   sevClass: 'severity-1', status: 'In Progress', statusClass: 'badge-progress'  },
]

const todayActivity = [
  { letter: 'A', bg: 'bg-indigo-500',  title: 'New analysis completed', patient: 'Rohit Kumar (PNT-2025-0487)',  time: '10:35 AM' },
  { letter: 'B', bg: 'bg-violet-500',  title: 'Report generated',        patient: 'Sunita Verma (PNT-2025-0486)', time: '04:25 PM' },
  { letter: 'C', bg: 'bg-emerald-500', title: 'Feedback received',        patient: 'Ajay Singh (PNT-2025-0485)',   time: '01:15 PM' },
  { letter: 'D', bg: 'bg-red-500',     title: 'High risk alert',          patient: 'Neha Patil (PNT-2025-0484)',   time: '11:20 AM' },
]

const pendingFeedback = [
  { name: 'Ajay Singh',  pid: 'PNT-2025-0485', type: 'MRI Lumbar Spine',   severity: 'Grade III', sevClass: 'severity-3' },
  { name: 'Neha Patil',  pid: 'PNT-2025-0484', type: 'X-ray Lumbar Spine', severity: 'Grade II',  sevClass: 'severity-2' },
  { name: 'Manoj Gupta', pid: 'PNT-2025-0483', type: 'MRI Lumbar Spine',   severity: 'Grade I',   sevClass: 'severity-1' },
]

const quickActions = [
  { icon: Upload,     label: 'Upload New Scan',     sub: 'Start new analysis', color: 'text-indigo-600',  bg: 'bg-indigo-50',  to: '/dashboard/image-analysis' },
  { icon: UserPlus,   label: 'Add New Patient',      sub: 'Register patient',   color: 'text-cyan-600',    bg: 'bg-cyan-50',    to: '/dashboard/patients'       },
  { icon: FileText,   label: 'Generate Report',      sub: 'Create report',      color: 'text-emerald-600', bg: 'bg-emerald-50', to: '/dashboard/reports'        },
  { icon: TrendingUp, label: 'Analytics Dashboard',  sub: 'View insights',      color: 'text-amber-600',   bg: 'bg-amber-50',   to: '/dashboard/analytics'      },
]

export default function DashboardPage() {
  return (
    <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1400px' }}>

      {/* Welcome */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
          Welcome, Dr. Arjun Sharma
        </h1>
        <p style={{ fontSize: '15px', color: '#64748B' }}>
          Here's what's happening with your patients today.
        </p>
      </div>

      {/* ── Featured Patient Card ── */}
      <div style={{
        background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '20px',
        padding: '28px 32px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '28px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
      }}>
        {/* Avatar */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '20px', flexShrink: 0,
          background: 'linear-gradient(135deg,#EEF2FF,#E0E7FF)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Users size={34} color="#818CF8" />
        </div>

        {/* Info */}
        <div style={{ minWidth: '180px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>Rohit Kumar</span>
            <Mars size={18} color="#60A5FA" />
          </div>
          <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.7' }}>PID: PNT-2025-0487</p>
          <p style={{ fontSize: '14px', color: '#64748B' }}>Age: 54 Years &nbsp;|&nbsp; Gender: Male</p>
          <p style={{ fontSize: '14px', color: '#64748B' }}>Phone: +91 98765 43210</p>
        </div>

        <div style={{ width: '1px', height: '64px', background: '#E2E8F0', flexShrink: 0 }} />

        {/* Meta */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '36px', flex: 1 }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Last Visit</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="#94A3B8" />
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#1E293B' }}>20 May 2025</span>
            </div>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Last Analysis</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} color="#94A3B8" />
              <div>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#1E293B', lineHeight: '1.3' }}>20 May 2025</p>
                <p style={{ fontSize: '12px', color: '#94A3B8' }}>10:35 AM</p>
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Condition</p>
            <span style={{
              display: 'inline-flex', padding: '6px 16px', borderRadius: '999px',
              fontSize: '13px', fontWeight: 600, background: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A'
            }}>Under Observation</span>
            <p style={{ fontSize: '13px', color: '#64748B', marginTop: '8px' }}>
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
            background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '20px',
            padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            transition: 'box-shadow 0.2s ease'
          }}>
            <div className={`${iconBg}`} style={{
              width: '52px', height: '52px', borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px'
            }}>
              <Icon size={24} className={iconColor} />
            </div>
            <p style={{ fontSize: '40px', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#475569', marginTop: '8px' }}>{label}</p>
            <p className={subColor} style={{ fontSize: '13px', fontWeight: 600, marginTop: '6px' }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* ── 3-col Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>

        {/* Analyses Table */}
        <div style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 28px', borderBottom: '1px solid #F1F5F9' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>Recent Analyses</h2>
            <Link to="/dashboard/image-analysis" style={{ fontSize: '14px', fontWeight: 600, color: '#4F46E5' }}>View All</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                  {['Patient ID', 'Patient Name', 'Date', 'Analysis Type', 'Severity', 'Status', 'Action'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '14px 20px', fontSize: '11px', fontWeight: 700,
                      color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentAnalyses.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #F8FAFC' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '16px 20px', fontFamily: 'monospace', fontSize: '12px', color: '#94A3B8' }}>{row.id}</td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 600, color: '#1E293B', whiteSpace: 'nowrap' }}>{row.name}</td>
                    <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                      <p style={{ fontSize: '14px', color: '#475569' }}>{row.date}</p>
                      <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>{row.time}</p>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', color: '#475569', whiteSpace: 'nowrap' }}>{row.type}</td>
                    <td style={{ padding: '16px 20px' }}><span className={row.sevClass}>{row.severity}</span></td>
                    <td style={{ padding: '16px 20px' }}><span className={row.statusClass}>{row.status}</span></td>
                    <td style={{ padding: '16px 20px' }}>
                      <button style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        border: '1.5px solid #E2E8F0', background: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.borderColor = '#818CF8'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
                      >
                        <Eye size={15} color="#64748B" />
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
          <div style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '20px' }}>Today's Activity</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {todayActivity.map(({ letter, bg, title, patient, time }) => (
                <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div className={bg} style={{ width: '34px', height: '34px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>
                    {letter}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B', lineHeight: '1.3' }}>{title}</p>
                    <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{patient}</p>
                  </div>
                  <p style={{ fontSize: '12px', color: '#94A3B8', flexShrink: 0 }}>{time}</p>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #F1F5F9', marginTop: '20px', paddingTop: '16px', textAlign: 'center' }}>
              <Link to="/dashboard/patient-history" style={{ fontSize: '14px', fontWeight: 600, color: '#4F46E5' }}>View All Activity</Link>
            </div>
          </div>

          {/* Pending Feedback */}
          <div style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>Pending Doctor Feedback</h2>
              <span style={{ width: '26px', height: '26px', borderRadius: '999px', background: '#EF4444', color: 'white', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingFeedback.map(({ name, pid, type, severity, sevClass }) => (
                <div key={pid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '14px 16px', borderRadius: '14px', background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {name} <span style={{ color: '#94A3B8', fontWeight: 400, fontSize: '12px' }}>({pid})</span>
                    </p>
                    <p style={{ fontSize: '12px', color: '#64748B', marginTop: '3px' }}>{type}</p>
                  </div>
                  <span className={sevClass}>{severity}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #F1F5F9', marginTop: '20px', paddingTop: '16px', textAlign: 'center' }}>
              <Link to="/dashboard/doctor-feedback" style={{ fontSize: '14px', fontWeight: 600, color: '#4F46E5' }}>Go to Feedback Panel</Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {quickActions.map(({ icon: Icon, label, sub, color, bg, to }) => (
            <Link key={label} to={to} style={{
              background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '20px',
              padding: '28px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center',
              textAlign: 'center', gap: '16px', textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(79,70,229,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
            >
              <div className={bg} style={{ width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={28} className={color} />
              </div>
              <div>
                <p className={color} style={{ fontSize: '15px', fontWeight: 700 }}>{label}</p>
                <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>{sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
