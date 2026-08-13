import { useState } from 'react'
import { Save, Shield, Eye, EyeOff, Palette, Globe, Bell, Lock } from 'lucide-react'

const sections = ['Account', 'Notifications', 'Security', 'Appearance', 'Privacy']

const Toggle = ({ on, onChange }) => (
  <button
    onClick={() => onChange(!on)}
    style={{
      position: 'relative', width: '48px', height: '26px', borderRadius: '999px',
      background: on ? '#4F46E5' : '#E2E8F0', border: 'none', cursor: 'pointer',
      transition: 'background 0.2s', flexShrink: 0
    }}
  >
    <span style={{
      position: 'absolute', top: '3px',
      left: on ? '25px' : '3px',
      width: '20px', height: '20px', borderRadius: '999px',
      background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      transition: 'left 0.2s'
    }} />
  </button>
)

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('Account')
  const [showPass, setShowPass] = useState(false)
  const [notifs, setNotifs] = useState({ email: true, sms: false, push: true, alerts: true })

  const inputStyle = {
    width: '100%', padding: '12px 16px', fontSize: '14px', fontFamily: 'inherit',
    border: '1.5px solid #E2E8F0', borderRadius: '12px', background: '#F8FAFC',
    outline: 'none', lineHeight: '1.5', color: '#1E293B'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px' }} className="animate-fadeIn">
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>Settings</h1>
        <p style={{ fontSize: '15px', color: '#64748B', marginTop: '6px' }}>Manage your account preferences and configurations</p>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Tab Nav */}
        <div style={{ width: '200px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {sections.map(s => (
            <button key={s} onClick={() => setActiveSection(s)} style={{
              width: '100%', textAlign: 'left', padding: '12px 18px',
              borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
              background: activeSection === s ? 'linear-gradient(135deg,#4F46E5,#6366F1)' : 'transparent',
              color: activeSection === s ? 'white' : '#64748B',
              boxShadow: activeSection === s ? '0 4px 14px rgba(79,70,229,0.3)' : 'none',
              transition: 'all 0.2s', fontFamily: 'inherit'
            }}
              onMouseEnter={e => { if (activeSection !== s) e.currentTarget.style.background = '#F1F5F9' }}
              onMouseLeave={e => { if (activeSection !== s) e.currentTarget.style.background = 'transparent' }}
            >{s}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>

          {activeSection === 'Account' && (
            <div style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '20px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '28px' }}>Account Information</h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '22px', fontWeight: 800, boxShadow: '0 6px 20px rgba(99,102,241,0.3)' }}>DS</div>
                <div>
                  <button className="btn btn-outline btn-sm" style={{ marginBottom: '8px' }}>Change Photo</button>
                  <p style={{ fontSize: '12px', color: '#94A3B8' }}>JPG, PNG up to 2MB</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
                {[
                  { label: 'First Name', value: 'Arjun' },
                  { label: 'Last Name', value: 'Sharma' },
                  { label: 'Email', value: 'arjun.sharma@hospital.com' },
                  { label: 'Specialty', value: 'Spine Specialist' },
                  { label: 'Hospital', value: 'Apollo Hospitals, Mumbai' },
                  { label: 'Medical ID', value: 'MCI-2025-45678' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>{label}</label>
                    <input defaultValue={value} style={inputStyle} />
                  </div>
                ))}
              </div>

              <button className="btn btn-primary"><Save size={16} /> Save Changes</button>
            </div>
          )}

          {activeSection === 'Notifications' && (
            <div style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '20px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '28px' }}>Notification Preferences</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
                {[
                  { key: 'email',  label: 'Email Notifications', desc: 'Receive analysis results and reports via email' },
                  { key: 'sms',    label: 'SMS Notifications',   desc: 'Get urgent alerts via SMS' },
                  { key: 'push',   label: 'Push Notifications',  desc: 'Browser push for real-time updates' },
                  { key: 'alerts', label: 'High Risk Alerts',    desc: 'Immediate notification for critical cases' },
                ].map(({ key, label, desc }) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderRadius: '14px', background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                    <div>
                      <p style={{ fontSize: '15px', fontWeight: 600, color: '#1E293B' }}>{label}</p>
                      <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>{desc}</p>
                    </div>
                    <Toggle on={notifs[key]} onChange={v => setNotifs({ ...notifs, [key]: v })} />
                  </div>
                ))}
              </div>
              <button className="btn btn-primary"><Save size={16} /> Save Preferences</button>
            </div>
          )}

          {activeSection === 'Security' && (
            <div style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '20px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '28px' }}>Security Settings</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                {['Current Password', 'New Password', 'Confirm New Password'].map((label, i) => (
                  <div key={label}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>{label}</label>
                    <div style={{ position: 'relative' }}>
                      <input type={showPass && i === 0 ? 'text' : 'password'} placeholder="••••••••" style={{ ...inputStyle, paddingRight: i === 0 ? '46px' : '16px' }} />
                      {i === 0 && (
                        <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                          {showPass ? <EyeOff size={17} color="#94A3B8" /> : <Eye size={17} color="#94A3B8" />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div style={{ padding: '18px 20px', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <Shield size={20} color="#059669" />
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: '#065F46' }}>HIPAA Compliant Security</p>
                    <p style={{ fontSize: '13px', color: '#059669', marginTop: '4px' }}>All data encrypted with AES-256 at rest and in transit.</p>
                  </div>
                </div>
              </div>
              <button className="btn btn-primary"><Lock size={16} /> Update Password</button>
            </div>
          )}

          {(activeSection === 'Appearance' || activeSection === 'Privacy') && (
            <div style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '20px', padding: '64px 32px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                {activeSection === 'Appearance' ? <Palette size={28} color="#94A3B8" /> : <Globe size={28} color="#94A3B8" />}
              </div>
              <p style={{ fontSize: '18px', fontWeight: 700, color: '#1E293B' }}>{activeSection} Settings</p>
              <p style={{ fontSize: '15px', color: '#94A3B8', marginTop: '8px' }}>Coming soon — this section is being built.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
