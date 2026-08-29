import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import {
  LayoutDashboard, Users, ScanLine, FileText, History,
  MessageSquare, BookOpen, BarChart3, Settings, User,
  LogOut, Shield, Zap
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/patients', label: 'Patients', icon: Users },
  { to: '/dashboard/image-analysis', label: 'Spine Analysis', icon: ScanLine },
  { to: '/dashboard/reports', label: 'Reports', icon: FileText },
  { to: '/dashboard/patient-history', label: 'Patient History', icon: History },
  { to: '/dashboard/doctor-feedback', label: 'Doctor Feedback', icon: MessageSquare },
  { to: '/dashboard/knowledge-base', label: 'Knowledge Base', icon: BookOpen },
  { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
]

export default function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, height: '100vh', width: '240px',
      background: 'var(--bg-card)', display: 'flex', flexDirection: 'column',
      zIndex: 30, boxShadow: '4px 0 24px rgba(0,0,0,0.18)', borderRight: '1px solid rgba(139, 92, 246, 0.15)'
    }}>
      {/* Logo */}
      <div style={{
        height: '68px',
        background: 'var(--bg-warm)',
        borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        boxSizing: 'border-box'
      }}>
        <NavLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="SpineLIT Logo" style={{ height: '60px', width: 'auto', objectFit: 'contain', filter: 'invert(1) hue-rotate(210deg) brightness(1.5)', mixBlendMode: 'screen' }} />
        </NavLink>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav-scroll" style={{ flex: 1, padding: '16px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            style={{ textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: '14px', cursor: 'pointer',
                fontSize: '14px', fontWeight: isActive ? 600 : 500,
                color: isActive ? 'white' : 'var(--text-muted)',
                background: isActive
                  ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))'
                  : 'transparent',
                boxShadow: isActive ? '0 4px 16px rgba(124,58,237,0.2)' : 'none',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(124,58,237,0.1)'; e.currentTarget.style.color = 'white'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; } }}
              >
                <Icon size={18} color={isActive ? 'white' : 'var(--text-muted)'} style={{ flexShrink: 0 }} />
                <span>{label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <style>{`
        .sidebar-nav-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(124, 58, 237, 0.2) transparent;
        }
        .sidebar-nav-scroll::-webkit-scrollbar {
          width: 2px;
        }
        .sidebar-nav-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-nav-scroll::-webkit-scrollbar-thumb {
          background: rgba(124, 58, 237, 0.2);
          border-radius: 999px;
        }
        .sidebar-nav-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(124, 58, 237, 0.5);
        }
      `}</style>

      {/* Footer */}
      <div style={{ padding: '12px 12px 24px', borderTop: '1px solid rgba(139, 92, 246, 0.15)' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px', borderRadius: '14px', background: 'transparent',
            fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)', cursor: 'pointer',
            transition: 'all 0.2s', border: 'none'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.1)'; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <LogOut size={18} color="var(--text-muted)" />
          <span>Logout</span>
        </button>

        <div style={{
          marginTop: '12px', padding: '14px 16px', borderRadius: '14px',
          background: 'rgba(124, 58, 237, 0.08)', border: '1px solid rgba(139, 92, 246, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={16} color="#10B981" />
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'white', lineHeight: 1 }}>Secure & HIPAA</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Compliant</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
