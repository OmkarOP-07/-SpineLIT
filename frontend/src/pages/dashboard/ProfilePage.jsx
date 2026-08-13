import { Award, MapPin, Phone, Mail, Calendar, Edit2, Star, TrendingUp, Users, FileText, Clock } from 'lucide-react'

const stats = [
  { label: 'Total Patients',    value: '42',    icon: Users,       color: '#4F46E5', bg: '#EEF2FF' },
  { label: 'Analyses Done',     value: '199',   icon: TrendingUp,  color: '#059669', bg: '#ECFDF5' },
  { label: 'Reports Generated', value: '87',    icon: FileText,    color: '#7C3AED', bg: '#F5F3FF' },
  { label: 'Avg. Response',     value: '11.8s', icon: Clock,       color: '#0891B2', bg: '#ECFEFF' },
]

const expertise = ['Lumbar Disc Herniation', 'Cervical Radiculopathy', 'Spondylolisthesis', 'Spinal Stenosis', 'Scoliosis', 'Degenerative Disc Disease']

const recentActivity = [
  { action: 'Completed analysis for Rohit Kumar',     time: '10:35 AM today',     color: '#4F46E5' },
  { action: 'Generated report for Sunita Verma',      time: '04:25 PM yesterday', color: '#7C3AED' },
  { action: 'Provided feedback on Ajay Singh scan',   time: '01:15 PM yesterday', color: '#059669' },
  { action: 'Added new patient: Priya Sharma',        time: '09:00 AM yesterday', color: '#0891B2' },
]

const metrics = [
  { label: 'AI Agreement Rate',       value: 91, color: '#4F46E5' },
  { label: 'Report Completion Rate',  value: 96, color: '#059669' },
  { label: 'Patient Follow-up Rate',  value: 83, color: '#7C3AED' },
  { label: 'Feedback Timeliness',     value: 78, color: '#0891B2' },
]

export default function ProfilePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px' }} className="animate-fadeIn">

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>Profile</h1>
          <p style={{ fontSize: '15px', color: '#64748B', marginTop: '6px' }}>Your professional profile and activity</p>
        </div>
        <button className="btn btn-outline"><Edit2 size={16} /> Edit Profile</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* Left card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Profile info */}
          <div style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '20px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
              <div style={{ width: '90px', height: '90px', borderRadius: '24px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '28px', fontWeight: 800, boxShadow: '0 8px 24px rgba(99,102,241,0.35)', margin: '0 auto' }}>DS</div>
              <div style={{ position: 'absolute', bottom: '-6px', right: '-6px', width: '30px', height: '30px', borderRadius: '10px', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(16,185,129,0.4)' }}>
                <Star size={15} color="white" fill="white" />
              </div>
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>Dr. Arjun Sharma</h2>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#4F46E5', marginTop: '4px' }}>Spine Specialist</p>

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
              {[
                { icon: MapPin, text: 'Apollo Hospitals, Mumbai' },
                { icon: Phone,  text: '+91 98765 43210' },
                { icon: Mail,   text: 'arjun.sharma@hospital.com' },
                { icon: Calendar,text:'Member since Jan 2024' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={15} color="#CBD5E1" />
                  <span style={{ fontSize: '14px', color: '#64748B' }}>{text}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #F1F5F9' }}>
              {[
                { label: 'Medical ID',  value: 'MCI-2025-45678' },
                { label: 'License',     value: 'MH-45678-2019' },
                { label: 'Experience',  value: '15 years' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', color: '#94A3B8' }}>{label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expertise */}
          <div style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Award size={18} color="#4F46E5" />
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>Areas of Expertise</h3>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {expertise.map(e => (
                <span key={e} style={{ padding: '6px 14px', background: '#EEF2FF', color: '#4338CA', border: '1px solid #C7D2FE', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>{e}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {stats.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '18px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={24} color={color} />
                </div>
                <div>
                  <p style={{ fontSize: '28px', fontWeight: 900, color, lineHeight: 1 }}>{value}</p>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', marginTop: '6px' }}>{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Activity */}
          <div style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '20px' }}>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentActivity.map(({ action, time, color }) => (
                <div key={action} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '16px 18px', borderRadius: '14px', background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '999px', background: color, flexShrink: 0, marginTop: '5px' }} />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B' }}>{action}</p>
                    <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance */}
          <div style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '20px' }}>Performance Metrics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {metrics.map(({ label, value, color }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>{label}</span>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B' }}>{value}%</span>
                  </div>
                  <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
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
