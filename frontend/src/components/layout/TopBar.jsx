import { Bell, ChevronDown } from 'lucide-react'

export default function TopBar() {
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

      {/* Doctor */}
      <button style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '8px 14px', borderRadius: '14px', border: 'none',
        background: 'transparent', cursor: 'pointer',
        transition: 'background 0.15s'
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(124, 58, 237, 0.1)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{
          width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: '14px', fontWeight: 700,
          boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
        }}>DS</div>
        <div style={{ textAlign: 'left' }}>
          <p style={{ fontSize: '14px', fontWeight: 700, color: 'white', lineHeight: 1 }}>Dr. Arjun Sharma</p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Spine Specialist</p>
        </div>
        <ChevronDown size={16} color="var(--text-muted)" />
      </button>
    </header>
  )
}
