import { Bell, ChevronDown } from 'lucide-react'

export default function TopBar() {
  return (
    <header style={{
      height: '68px', background: 'white', borderBottom: '1px solid #E2E8F0',
      display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
      padding: '0 36px', position: 'sticky', top: 0, zIndex: 20,
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)', gap: '12px'
    }}>

      {/* Notification Bell */}
      <div style={{ position: 'relative' }}>
        <button style={{
          width: '42px', height: '42px', borderRadius: '12px', border: 'none',
          background: '#F8FAFC', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s'
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#EEF2FF'}
          onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'}
        >
          <Bell size={20} color="#475569" />
        </button>
        <span style={{
          position: 'absolute', top: '6px', right: '6px',
          width: '18px', height: '18px', borderRadius: '999px',
          background: '#EF4444', color: 'white', fontSize: '10px', fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid white'
        }}>3</span>
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '32px', background: '#E2E8F0' }} />

      {/* Doctor */}
      <button style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '8px 14px', borderRadius: '14px', border: 'none',
        background: 'transparent', cursor: 'pointer',
        transition: 'background 0.15s'
      }}
        onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{
          width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
          background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: '14px', fontWeight: 700,
          boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
        }}>DS</div>
        <div style={{ textAlign: 'left' }}>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', lineHeight: 1 }}>Dr. Arjun Sharma</p>
          <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Spine Specialist</p>
        </div>
        <ChevronDown size={16} color="#94A3B8" />
      </button>
    </header>
  )
}
