import { useState } from 'react'
import { Upload, ScanLine, Zap, CheckCircle2, AlertTriangle, Brain, FileText, ArrowRight } from 'lucide-react'

const recentScans = [
  { id: 'ANA-2025-0234', patient: 'Rohit Kumar',  type: 'X-ray Lumbar Spine', date: '20 May 2025', severity: 'Grade II',  confidence: 87, status: 'Completed'  },
  { id: 'ANA-2025-0233', patient: 'Sunita Verma', type: 'MRI Lumbar Spine',   date: '19 May 2025', severity: 'Grade I',   confidence: 94, status: 'Completed'  },
  { id: 'ANA-2025-0232', patient: 'Ajay Singh',   type: 'X-ray Lumbar Spine', date: '19 May 2025', severity: 'Grade III', confidence: 91, status: 'Completed'  },
  { id: 'ANA-2025-0231', patient: 'Manoj Gupta',  type: 'X-ray Lumbar Spine', date: '18 May 2025', severity: 'Grade I',   confidence: 78, status: 'In Progress' },
]
const sevStyle = {
  'Grade I':   { background: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0' },
  'Grade II':  { background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' },
  'Grade III': { background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' },
}
const pill = (style, text) => (
  <span style={{ ...style, display: 'inline-flex', alignItems: 'center', borderRadius: '999px', padding: '4px 14px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>{text}</span>
)

export default function ImageAnalysisPage() {
  const [dragging, setDragging] = useState(false)
  const [scanType, setScanType] = useState('X-ray')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1300px' }} className="animate-fadeIn">
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>Image Analysis</h1>
        <p style={{ fontSize: '15px', color: '#64748B', marginTop: '6px' }}>Upload spine scans for AI-powered analysis and severity grading</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>

        {/* Left: Upload + Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Drop Zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false) }}
            style={{
              border: `2.5px dashed ${dragging ? '#6366F1' : '#CBD5E1'}`,
              borderRadius: '20px', padding: '60px 32px', textAlign: 'center',
              background: dragging ? '#EEF2FF' : 'white', cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Upload size={36} color="#6366F1" />
              </div>
              <div>
                <p style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>Drop your scan here</p>
                <p style={{ fontSize: '15px', color: '#64748B', marginTop: '6px' }}>or <span style={{ color: '#4F46E5', fontWeight: 600 }}>browse files</span></p>
                <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '8px' }}>Supports: DICOM, JPEG, PNG · Max size: 50MB</p>
              </div>
              <button className="btn btn-primary btn-lg">Select File</button>
            </div>
          </div>

          {/* Settings */}
          <div style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', marginBottom: '24px' }}>Analysis Settings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '10px' }}>Scan Type</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['X-ray', 'MRI', 'CT Scan'].map(t => (
                    <button key={t} onClick={() => setScanType(t)} style={{
                      padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                      border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                      background: scanType === t ? '#4F46E5' : '#F1F5F9',
                      color: scanType === t ? 'white' : '#64748B',
                      boxShadow: scanType === t ? '0 4px 12px rgba(79,70,229,0.3)' : 'none'
                    }}>{t}</button>
                  ))}
                </div>
              </div>

              {[
                { label: 'Patient', options: ['Select patient...', 'Rohit Kumar — PNT-2025-0487', 'Sunita Verma — PNT-2025-0486', 'Ajay Singh — PNT-2025-0485'] },
                { label: 'Analysis Region', options: ['Lumbar Spine', 'Cervical Spine', 'Thoracic Spine', 'Full Spine'] },
                { label: 'Priority', options: ['Normal', 'Urgent', 'Emergency'] },
              ].map(({ label, options }) => (
                <div key={label}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '10px' }}>{label}</label>
                  <select style={{ width: '100%', padding: '11px 14px', fontSize: '14px', fontFamily: 'inherit', border: '1.5px solid #E2E8F0', borderRadius: '12px', background: '#F8FAFC', outline: 'none', cursor: 'pointer', lineHeight: '1.5' }}>
                    {options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px' }}>
              <Brain size={20} /> Run AI Analysis
            </button>
          </div>
        </div>

        {/* Right: Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '18px' }}>Analysis Capabilities</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { icon: CheckCircle2, label: 'Severity Grading (Grade I–IV)', color: '#059669', bg: '#ECFDF5' },
                { icon: Brain,        label: 'AI Confidence Scoring',         color: '#4F46E5', bg: '#EEF2FF' },
                { icon: AlertTriangle,label: 'Anomaly Detection',              color: '#D97706', bg: '#FFFBEB' },
                { icon: FileText,     label: 'Automated Report Generation',    color: '#7C3AED', bg: '#F5F3FF' },
                { icon: ScanLine,     label: 'Explainability Heatmaps',        color: '#0891B2', bg: '#ECFEFF' },
              ].map(({ icon: Icon, label, color, bg }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color={color} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg,#4F46E5,#6366F1)', borderRadius: '20px', padding: '28px', color: 'white' }}>
            <Zap size={28} color="rgba(255,255,255,0.5)" style={{ marginBottom: '12px' }} />
            <p style={{ fontSize: '16px', fontWeight: 700 }}>Avg. Analysis Time</p>
            <p style={{ fontSize: '52px', fontWeight: 900, lineHeight: 1, marginTop: '8px' }}>~12s</p>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>With 95%+ accuracy rate</p>
          </div>
        </div>
      </div>

      {/* Recent Analyses */}
      <div style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '20px 28px', borderBottom: '1px solid #F1F5F9' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>Recent Analyses</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                {['Analysis ID', 'Patient', 'Scan Type', 'Date', 'Severity', 'AI Confidence', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentScans.map(row => (
                <tr key={row.id} style={{ borderBottom: '1px solid #F8FAFC' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px 20px', fontFamily: 'monospace', fontSize: '12px', color: '#94A3B8' }}>{row.id}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 600, color: '#1E293B' }}>{row.patient}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#475569' }}>{row.type}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#64748B' }}>{row.date}</td>
                  <td style={{ padding: '16px 20px' }}>{pill(sevStyle[row.severity], row.severity)}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '80px', height: '8px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: '#6366F1', borderRadius: '999px', width: `${row.confidence}%` }} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>{row.confidence}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>{pill(row.status === 'Completed' ? { background: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0' } : { background: '#DBEAFE', color: '#1E40AF', border: '1px solid #BFDBFE' }, row.status)}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <button style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: '#4F46E5', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                      View <ArrowRight size={14} />
                    </button>
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
