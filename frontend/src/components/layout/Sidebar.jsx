import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Users, ScanLine, FileText, History,
  MessageSquare, BookOpen, BarChart3, Settings, User,
  LogOut, Shield, ChevronLeft, ChevronRight, GripVertical,
  Brain, TrendingUp, Activity
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/patients', label: 'Patients', icon: Users },
  { to: '/dashboard/image-analysis', label: 'New Analysis', icon: ScanLine },
  { to: '/dashboard/ai-analysis-result', label: 'AI Result', icon: Brain },
  { to: '/dashboard/ai-generated-report', label: 'AI Report', icon: FileText },
  { to: '/dashboard/patient-history', label: 'Analysis History', icon: History },
  { to: '/dashboard/patient-longitudinal', label: 'Longitudinal View', icon: TrendingUp },
  { to: '/dashboard/doctor-feedback', label: 'Doctor Feedback', icon: MessageSquare },
  { to: '/dashboard/doctor-feedback-learning', label: 'Learning Memory', icon: Activity },
  { to: '/dashboard/knowledge-base', label: 'Knowledge Base', icon: BookOpen },
  { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
]

export default function Sidebar({
  width = 240,
  isDragging = false,
  onStartDrag,
  isCollapsed = false,
  onToggleCollapse
}) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  // If collapsed, only render the subtle expand trigger button
  if (isCollapsed || width === 0) {
    return (
      <button
        onClick={onToggleCollapse}
        title="Expand Sidebar"
        style={{
          position: 'fixed', left: '12px', top: '14px', zIndex: 60,
          width: '38px', height: '38px', borderRadius: '12px',
          background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
          color: 'white', border: '1px solid rgba(168, 90, 117, 0.4)',
          boxShadow: '0 4px 16px rgba(133, 57, 83, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <ChevronRight size={20} />
      </button>
    )
  }

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, height: '100vh',
      width: `${width}px`,
      background: '#2C2C2C', display: 'flex', flexDirection: 'column',
      zIndex: 40, boxShadow: '4px 0 24px rgba(0,0,0,0.25)',
      borderRight: '1px solid rgba(133, 57, 83, 0.15)',
      transition: isDragging ? 'none' : 'width 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
      userSelect: isDragging ? 'none' : 'auto',
      overflow: 'hidden'
    }}>

      {/* ── Drag Handle (Right Border) ── */}
      <div
        onPointerDown={onStartDrag}
        title="Drag to resize (Up to 70% screen) or double click to collapse"
        onDoubleClick={onToggleCollapse}
        style={{
          position: 'absolute', right: 0, top: 0, bottom: 0,
          width: '7px', cursor: 'col-resize', zIndex: 50,
          background: isDragging ? 'var(--primary-light)' : 'transparent',
          transition: 'background 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(168, 90, 117, 0.5)'}
        onMouseLeave={e => { if (!isDragging) e.currentTarget.style.background = 'transparent' }}
      >
        <div style={{
          width: '2px', height: '32px', borderRadius: '999px',
          background: isDragging ? 'white' : 'rgba(168, 90, 117, 0.4)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Logo & Collapse Button Header */}
      <div style={{
        height: '68px',
        background: '#2C2C2C',
        borderBottom: '1px solid rgba(133, 57, 83, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px 0 20px',
        boxSizing: 'border-box'
      }}>
        <NavLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', minWidth: 0 }}>
          <img src={logo} alt="SpineLCI Logo" style={{ height: '52px', width: 'auto', objectFit: 'contain' }} />
        </NavLink>

        <button
          onClick={onToggleCollapse}
          title="Hide Sidebar"
          style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(133, 57, 83, 0.2)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(133, 57, 83, 0.15)'; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="sidebar-nav-scroll" style={{
        flex: 1, padding: '16px 12px', overflowY: 'auto', overflowX: 'hidden',
        display: 'flex', flexDirection: 'column', gap: '4px'
      }}>
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
                padding: '11px 14px', borderRadius: '12px', cursor: 'pointer',
                fontSize: '14px', fontWeight: isActive ? 600 : 500,
                color: isActive ? 'white' : 'white',
                background: isActive
                  ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))'
                  : 'transparent',
                boxShadow: isActive ? '0 4px 16px rgba(133,57,83,0.2)' : 'none',
                transition: 'all 0.18s ease',
                whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'
              }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(133,57,83,0.1)'; e.currentTarget.style.color = 'white'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'white'; } }}
              >
                <Icon size={18} color={isActive ? 'white' : 'white'} style={{ flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 12px 20px', borderTop: '1px solid rgba(133, 57, 83, 0.15)', flexShrink: 0 }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
            padding: '11px 14px', borderRadius: '12px', background: 'transparent',
            fontSize: '14px', fontWeight: 500, color: 'white', cursor: 'pointer',
            transition: 'all 0.18s', border: 'none', whiteSpace: 'nowrap'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#f87171'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'white'; }}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          <span>Logout</span>
        </button>

        {width >= 200 && (
          <div style={{
            marginTop: '10px', padding: '12px 14px', borderRadius: '12px',
            background: 'rgba(133, 57, 83, 0.08)', border: '1px solid rgba(133, 57, 83, 0.15)',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={16} color="#10B981" style={{ flexShrink: 0 }} />
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'white', lineHeight: 1, margin: 0, whiteSpace: 'nowrap' }}>Secure & HIPAA</p>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', margin: '3px 0 0', whiteSpace: 'nowrap' }}>Compliant</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
