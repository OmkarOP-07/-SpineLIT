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
      height: '68px',
      background: '#f2f2f2ff',
      borderBottom: '1px solid #D9E3E3',
      display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
      padding: '0 32px', position: 'sticky', top: 0, zIndex: 20,
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)', gap: '12px'
    }}>

      {/* Notification Bell */}
      <div style={{ position: 'relative' }}>
        <button style={{
          width: '40px', height: '40px', borderRadius: '10px',
          border: '1px solid #D9E3E3',
          background: '#F7F9F9', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s'
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#F3E8EE'; e.currentTarget.style.borderColor = '#853953'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#F7F9F9'; e.currentTarget.style.borderColor = '#D9E3E3'; }}
        >
          <Bell size={18} color="#667085" />
        </button>
        <span style={{
          position: 'absolute', top: '6px', right: '6px',
          width: '16px', height: '16px', borderRadius: '999px',
          background: '#C94B4B', color: 'white', fontSize: '9px', fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid #FFFFFF'
        }}>3</span>
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '28px', background: '#D9E3E3' }} />

      {/* User Profile */}
      <button
        onClick={() => navigate('/dashboard/profile')}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '6px 10px', borderRadius: '12px', border: 'none',
          background: 'transparent', cursor: 'pointer',
          transition: 'background 0.15s'
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#F3E8EE'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={displayName}
            referrerPolicy="no-referrer"
            style={{
              width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
              objectFit: 'cover', border: '1.5px solid #D9E3E3',
            }}
          />
        ) : (
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
            background: '#853953',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '13px', fontWeight: 700,
          }}>
            {getInitials(displayName)}
          </div>
        )}

        <div style={{ textAlign: 'left' }}>
          <p style={{ fontSize: '13.5px', fontWeight: 700, color: '#2C2C2C', lineHeight: 1 }}>{formattedName}</p>
          <p style={{ fontSize: '11.5px', color: '#667085', marginTop: '3px' }}>{roleSubtitle}</p>
        </div>
        <ChevronDown size={15} color="#667085" />
      </button>
    </header>
  )
}
