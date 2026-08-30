import { Bell, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function getInitials(name = '') {
  if (!name) return 'U'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

export default function TopBar() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'User')
  const isDoctor = user?.role === 'doctor'
  const formattedName = isDoctor && !displayName.toLowerCase().startsWith('dr.')
    ? `Dr. ${displayName}`
    : displayName
  const roleSubtitle = isDoctor ? 'Spine Specialist' : 'Patient'
  const photoUrl = user?.photo_url || user?.photo

  return (
    <header style={{
      height: '68px', background: 'var(--bg-warm)', borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
      display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
      padding: '0 36px', position: 'sticky', top: 0, zIndex: 20,
      boxShadow: '0 1px 8px rgba(0,0,0,0.15)', gap: '12px'
    }}>

      {/* Notification Bell */}
      <div style={{ position: 'relative' }}>
        <button style={{
          width: '42px', height: '42px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.15)',
          background: 'var(--bg-card)', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s'
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(124, 58, 237, 0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}
        >
          <Bell size={20} color="var(--text-muted)" />
        </button>
        <span style={{
          position: 'absolute', top: '6px', right: '6px',
          width: '18px', height: '18px', borderRadius: '999px',
          background: 'var(--danger)', color: 'white', fontSize: '10px', fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid var(--bg-warm)'
        }}>3</span>
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '32px', background: 'rgba(139, 92, 246, 0.15)' }} />

      {/* User Profile */}
      <button
        onClick={() => navigate('/dashboard/profile')}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '6px 12px', borderRadius: '14px', border: 'none',
          background: 'transparent', cursor: 'pointer',
          transition: 'background 0.15s'
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(124, 58, 237, 0.1)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={displayName}
            referrerPolicy="no-referrer"
            style={{
              width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
              objectFit: 'cover', border: '1.5px solid rgba(167, 139, 250, 0.4)',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)'
            }}
          />
        ) : (
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '14px', fontWeight: 700,
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
          }}>
            {getInitials(displayName)}
          </div>
        )}

        <div style={{ textAlign: 'left' }}>
          <p style={{ fontSize: '14px', fontWeight: 700, color: 'white', lineHeight: 1 }}>{formattedName}</p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{roleSubtitle}</p>
        </div>
        <ChevronDown size={16} color="var(--text-muted)" />
      </button>
    </header>
  )
}
