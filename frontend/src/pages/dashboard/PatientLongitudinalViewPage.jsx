import { TrendingUp, Clock, FileText, Image as ImageIcon } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import spineMri from '../../assets/spine_mri.png'
import spineXray from '../../assets/spine_xray.png'

const MOCK_TIMELINE = [
  { date: 'Nov 2024', type: 'MRI Lumbar', severity: 'Grade I', gradeVal: 1, image: spineMri, note: 'Mild degenerative changes at L4-L5. Recommended conservative management.' },
  { date: 'Feb 2025', type: 'X-Ray Lumbar', severity: 'Grade I', gradeVal: 1, image: spineXray, note: 'Stable condition. Pain levels reported slightly lower.' },
  { date: 'May 2025', type: 'X-Ray Lumbar', severity: 'Grade II', gradeVal: 2, image: spineXray, note: 'Current: Progression noted at L4-L5. Disc height reduced further.' },
]

export default function PatientLongitudinalViewPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px' }} className="animate-fadeIn">
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark)' }}>Patient Longitudinal View</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '6px' }}>Rohit Kumar (PNT-2025-0487) • Tracking spine health over time.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px', alignItems: 'start' }}>
        
        {/* Left: Timeline & Images */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Visual Comparison */}
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid rgba(133,57,83,0.15)', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ImageIcon size={18} color="var(--primary)" /> Imaging Comparison
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textAlign: 'center' }}>Baseline (Nov 2024)</p>
                <div style={{ background: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(133,57,83,0.2)' }}>
                  <img src={spineMri} alt="Baseline" style={{ width: '100%', height: '240px', objectFit: 'contain' }} />
                </div>
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)', marginBottom: '8px', textAlign: 'center' }}>Current (May 2025)</p>
                <div style={{ background: '#000', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--primary)' }}>
                  <img src={spineXray} alt="Current" style={{ width: '100%', height: '240px', objectFit: 'contain' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Timeline List */}
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid rgba(133,57,83,0.15)', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="var(--primary)" /> Clinical Timeline
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {MOCK_TIMELINE.slice().reverse().map((record, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', paddingBottom: i === MOCK_TIMELINE.length - 1 ? 0 : '24px', position: 'relative' }}>
                  {i !== MOCK_TIMELINE.length - 1 && (
                    <div style={{ position: 'absolute', left: '7px', top: '24px', bottom: 0, width: '2px', background: 'rgba(133,57,83,0.15)' }} />
                  )}
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: i === 0 ? 'var(--primary)' : 'var(--bg-warm)', border: `3px solid ${i === 0 ? '#fff' : 'rgba(133,57,83,0.3)'}`, boxShadow: i === 0 ? '0 0 0 2px var(--primary)' : 'none', flexShrink: 0, marginTop: '4px', position: 'relative', zIndex: 1 }} />
                  <div style={{ flex: 1, background: i === 0 ? 'rgba(133,57,83,0.06)' : 'var(--bg-warm)', padding: '16px', borderRadius: '12px', border: `1px solid ${i === 0 ? 'rgba(133,57,83,0.2)' : 'rgba(133,57,83,0.1)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)' }}>{record.date}</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', background: record.severity === 'Grade II' ? '#FEF3C7' : '#D1FAE5', color: record.severity === 'Grade II' ? '#92400E' : '#065F46' }}>{record.severity}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>{record.type}</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-dark)', lineHeight: '1.5' }}>{record.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Trend Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: '24px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid rgba(133,57,83,0.15)', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="var(--primary)" /> Severity Trend
            </h3>
            <div style={{ height: '200px', width: '100%', marginBottom: '16px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_TIMELINE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B6B6B' }} dy={10} />
                  <YAxis ticks={[1, 2, 3, 4]} domain={[0, 4]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B6B6B' }} tickFormatter={(val) => `Gr ${val}`} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="gradeVal" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ padding: '12px', background: '#FFFBEB', borderRadius: '10px', border: '1px solid #FDE68A' }}>
              <p style={{ fontSize: '13px', color: '#92400E', fontWeight: 600 }}>Trend Analysis:</p>
              <p style={{ fontSize: '13px', color: '#92400E', marginTop: '4px' }}>Condition was stable for 3 months, followed by progression to Grade II in the last 3 months.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
