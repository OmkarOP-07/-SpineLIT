import { useState } from 'react'
import { CheckCircle2, Clock, MessageSquare, ThumbsUp, ThumbsDown, AlertCircle, Send } from 'lucide-react'

const pending = [
  { name: 'Ajay Singh',  pid: 'PNT-2025-0485', type: 'X-ray Lumbar Spine', severity: 'Grade III', sevStyle: { background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' }, aiNote: 'Significant osteophyte formation at L3-L4. Neural foraminal narrowing. Recommend surgical consult.', time: '2 hours ago' },
  { name: 'Neha Patil',  pid: 'PNT-2025-0484', type: 'MRI Lumbar Spine',   severity: 'Grade II',  sevStyle: { background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }, aiNote: 'Moderate disc herniation at L4-L5 with mild nerve root impingement. Physical therapy recommended.', time: '5 hours ago' },
  { name: 'Manoj Gupta', pid: 'PNT-2025-0483', type: 'X-ray Lumbar Spine', severity: 'Grade I',   sevStyle: { background: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0' }, aiNote: 'Mild degenerative changes. No significant abnormality. Conservative management with follow-up.', time: '1 day ago' },
]
const completed = [
  { name: 'Rohit Kumar',  pid: 'PNT-2025-0487', type: 'X-ray', feedback: 'Agree with AI assessment. Prescribing NSAIDs and physiotherapy.', date: '20 May 2025', status: 'Agreed' },
  { name: 'Sunita Verma', pid: 'PNT-2025-0486', type: 'MRI',   feedback: 'Slightly different interpretation. Added additional notes.',       date: '19 May 2025', status: 'Modified' },
]

export default function DoctorFeedbackPage() {
  const [text, setText] = useState({})

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1100px' }} className="animate-fadeIn">
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>Doctor Feedback</h1>
        <p style={{ fontSize: '15px', color: '#64748B', marginTop: '6px' }}>Review AI analyses and provide clinical feedback</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '18px' }}>
        {[
          { label: 'Pending Review',    value: '3',    color: '#D97706', bg: '#FFFBEB', icon: Clock          },
          { label: 'Completed Today',   value: '7',    color: '#059669', bg: '#ECFDF5', icon: CheckCircle2   },
          { label: 'Total Feedbacks',   value: '124',  color: '#4F46E5', bg: '#EEF2FF', icon: MessageSquare  },
          { label: 'AI Agreement Rate', value: '91%',  color: '#7C3AED', bg: '#F5F3FF', icon: ThumbsUp       },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '18px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={22} color={color} />
            </div>
            <div>
              <p style={{ fontSize: '28px', fontWeight: 900, color, lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', marginTop: '6px' }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pending */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>Pending Review</h2>
          <span style={{ width: '28px', height: '28px', borderRadius: '999px', background: '#F59E0B', color: 'white', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {pending.map(item => (
            <div key={item.pid} style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'linear-gradient(135deg,#6366F1,#4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: 700, flexShrink: 0 }}>
                    {item.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{item.name}</span>
                      <span style={{ fontSize: '13px', color: '#94A3B8' }}>({item.pid})</span>
                      <span style={{ ...item.sevStyle, display: 'inline-flex', alignItems: 'center', borderRadius: '999px', padding: '3px 12px', fontSize: '12px', fontWeight: 600 }}>{item.severity}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#64748B', marginTop: '5px' }}>{item.type} · {item.time}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', flexShrink: 0 }}>
                  <Clock size={13} color="#D97706" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#92400E' }}>Pending</span>
                </div>
              </div>

              <div style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '14px', padding: '16px 20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertCircle size={15} color="#4F46E5" />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#4338CA' }}>AI Assessment</span>
                </div>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>{item.aiNote}</p>
              </div>

              <textarea
                value={text[item.pid] || ''}
                onChange={e => setText({ ...text, [item.pid]: e.target.value })}
                placeholder="Enter your clinical feedback and notes..."
                style={{ width: '100%', padding: '14px 16px', fontSize: '14px', fontFamily: 'inherit', border: '1.5px solid #E2E8F0', borderRadius: '12px', background: '#F8FAFC', outline: 'none', resize: 'none', height: '88px', lineHeight: '1.6', marginBottom: '14px' }}
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}><ThumbsUp size={16} /> Agree &amp; Submit</button>
                <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}><ThumbsDown size={16} /> Disagree &amp; Modify</button>
                <button style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#10B981', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
                  <Send size={17} color="white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>Recently Completed</h2>
        <div style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                {['Patient', 'Scan Type', 'Feedback Summary', 'Date', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {completed.map(r => (
                <tr key={r.pid} style={{ borderBottom: '1px solid #F8FAFC' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 600, color: '#1E293B' }}>{r.name} <span style={{ color: '#94A3B8', fontWeight: 400, fontSize: '12px' }}>({r.pid})</span></td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#475569' }}>{r.type}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#64748B', maxWidth: '300px' }}>{r.feedback}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#64748B' }}>{r.date}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', borderRadius: '999px', padding: '4px 14px', fontSize: '12px', fontWeight: 600, ...(r.status === 'Agreed' ? { background: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0' } : { background: '#DBEAFE', color: '#1E40AF', border: '1px solid #BFDBFE' }) }}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
