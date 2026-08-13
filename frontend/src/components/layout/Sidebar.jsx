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
      background: '#0F172A', display: 'flex', flexDirection: 'column',
      zIndex: 30, boxShadow: '4px 0 24px rgba(0,0,0,0.18)'
    }}>
      {/* Logo */}
      <div style={{
        height: '68px',
        background: 'white',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        boxSizing: 'border-box'
      }}>
        <NavLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="SpineLIT Logo" style={{ height: '60px', width: 'auto', objectFit: 'contain' }} />
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
                color: isActive ? 'white' : '#94A3B8',
                background: isActive
                  ? 'linear-gradient(135deg,#4F46E5,#6366F1)'
                  : 'transparent',
                boxShadow: isActive ? '0 4px 16px rgba(79,70,229,0.4)' : 'none',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon size={18} color={isActive ? 'white' : '#64748B'} style={{ flexShrink: 0 }} />
                <span>{label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <style>{`
        .sidebar-nav-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
        .sidebar-nav-scroll::-webkit-scrollbar {
          width: 2px;
        }
        .sidebar-nav-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-nav-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 999px;
        }
        .sidebar-nav-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>

      {/* Footer */}
      <div style={{ padding: '12px 12px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px', borderRadius: '14px', background: 'transparent',
            fontSize: '14px', fontWeight: 500, color: '#94A3B8', cursor: 'pointer',
            transition: 'all 0.2s', border: 'none'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={18} color="#64748B" />
          <span>Logout</span>
        </button>

        <div style={{
          marginTop: '12px', padding: '14px 16px', borderRadius: '14px',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={16} color="#34D399" />
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'white', lineHeight: 1 }}>Secure & HIPAA</p>
              <p style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>Compliant</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
