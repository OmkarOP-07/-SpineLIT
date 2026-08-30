import { Award, MapPin, Phone, Mail, Calendar, Edit2, Star, TrendingUp, Users, FileText, Clock, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function getInitials(name = '') {
  if (!name) return 'U'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

const stats = [
  { label: 'Total Patients',    value: '42',    icon: Users,       color: 'var(--text-dark)', bg: 'var(--bg-warm)' },
  { label: 'Analyses Done',     value: '199',   icon: TrendingUp,  color: '#059669', bg: '#ECFDF5' },
  { label: 'Reports Generated', value: '87',    icon: FileText,    color: '#7C3AED', bg: '#F5F3FF' },
  { label: 'Avg. Response',     value: '11.8s', icon: Clock,       color: '#0891B2', bg: '#ECFEFF' },
]

const expertise = ['Lumbar Disc Herniation', 'Cervical Radiculopathy', 'Spondylolisthesis', 'Spinal Stenosis', 'Scoliosis', 'Degenerative Disc Disease']

const recentActivity = [
  { action: 'Completed analysis for Rohit Kumar',     time: '10:35 AM today',     color: 'var(--text-dark)' },
  { action: 'Generated report for Sunita Verma',      time: '04:25 PM yesterday', color: '#7C3AED' },
  { action: 'Provided feedback on Ajay Singh scan',   time: '01:15 PM yesterday', color: '#059669' },
  { action: 'Added new patient: Priya Sharma',        time: '09:00 AM yesterday', color: '#0891B2' },
]

const metrics = [
  { label: 'AI Agreement Rate',       value: 91, color: 'var(--text-dark)' },
  { label: 'Report Completion Rate',  value: 96, color: '#059669' },
  { label: 'Patient Follow-up Rate',  value: 83, color: '#7C3AED' },
  { label: 'Feedback Timeliness',     value: 78, color: '#0891B2' },
]

export default function ProfilePage() {
  const { user } = useAuth()
  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'User')
  const isDoctor = user?.role === 'doctor'
  const formattedName = isDoctor && !displayName.toLowerCase().startsWith('dr.')
    ? `Dr. ${displayName}`
    : displayName
  const roleSubtitle = isDoctor ? 'Spine Specialist' : 'Patient'
  const photoUrl = user?.photo_url || user?.photo
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px' }} className="animate-fadeIn">

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark)' }}>Profile</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '6px' }}>Your professional profile and activity</p>
        </div>
        <button className="btn btn-outline"><Edit2 size={16} /> Edit Profile</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* Left card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Profile info */}
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid rgba(139, 92, 246, 0.15)', borderRadius: '20px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  style={{
                    width: '90px', height: '90px', borderRadius: '24px', objectFit: 'cover',
                    border: '2px solid rgba(167, 139, 250, 0.5)',
                    boxShadow: '0 8px 24px rgba(124, 58, 237, 0.35)', margin: '0 auto'
                  }}
                />
              ) : (
                <div style={{ width: '90px', height: '90px', borderRadius: '24px', background: 'linear-gradient(135deg,var(--primary-dark),var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '28px', fontWeight: 800, boxShadow: '0 8px 24px rgba(99,102,241,0.35)', margin: '0 auto' }}>
                  {getInitials(displayName)}
                </div>
              )}
              <div style={{ position: 'absolute', bottom: '-6px', right: '-6px', width: '30px', height: '30px', borderRadius: '10px', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(16,185,129,0.4)' }}>
                <Star size={15} color="white" fill="white" />
              </div>
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-dark)' }}>{formattedName}</h2>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)', marginTop: '4px' }}>{roleSubtitle}</p>

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
              {[
                { icon: MapPin, text: user?.role === 'doctor' ? 'Apollo Hospitals, Mumbai' : 'Mumbai, India' },
                { icon: Phone,  text: user?.phone || '+91 (Not provided)' },
                { icon: Mail,   text: user?.email || 'No email' },
                { icon: Calendar,text: user?.created_at ? `Member since ${new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : 'Member since 2025' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={15} color="rgba(139, 92, 246, 0.15)" />
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{text}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(139, 92, 246, 0.15)' }}>
              {[
                { label: 'Medical ID',  value: 'MCI-2025-45678' },
                { label: 'License',     value: 'MH-45678-2019' },
                { label: 'Experience',  value: '15 years' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expertise */}
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid rgba(139, 92, 246, 0.15)', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Award size={18} color="var(--text-dark)" />
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-dark)' }}>Areas of Expertise</h3>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {expertise.map(e => (
                <span key={e} style={{ padding: '6px 14px', background: 'var(--bg-warm)', color: '#4338CA', border: '1px solid #C7D2FE', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>{e}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {stats.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} style={{ background: 'var(--bg-card)', border: '1.5px solid rgba(139, 92, 246, 0.15)', borderRadius: '18px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={24} color={color} />
                </div>
                <div>
                  <p style={{ fontSize: '28px', fontWeight: 900, color, lineHeight: 1 }}>{value}</p>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginTop: '6px' }}>{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Activity */}
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid rgba(139, 92, 246, 0.15)', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '20px' }}>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentActivity.map(({ action, time, color }) => (
                <div key={action} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '16px 18px', borderRadius: '14px', background: 'var(--bg-warm)', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '999px', background: color, flexShrink: 0, marginTop: '5px' }} />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>{action}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance */}
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid rgba(139, 92, 246, 0.15)', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '20px' }}>Performance Metrics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {metrics.map(({ label, value, color }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>{label}</span>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-dark)' }}>{value}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(139, 92, 246, 0.15)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: '999px', background: color, width: `${value}%`, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
