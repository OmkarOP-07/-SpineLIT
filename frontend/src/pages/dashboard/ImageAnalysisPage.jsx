import { useState, useRef } from 'react'
import { Upload, CheckCircle2, Brain, ArrowRight, User, Activity, Footprints, Dumbbell, ClipboardList } from 'lucide-react'

const recentScans = [
  { id: 'ANA-2025-0234', patient: 'Rohit Kumar', type: 'X-ray Lumbar Spine', date: '20 May 2025', severity: 'Grade II', confidence: 87, status: 'Completed' },
  { id: 'ANA-2025-0233', patient: 'Sunita Verma', type: 'MRI Lumbar Spine', date: '19 May 2025', severity: 'Grade I', confidence: 94, status: 'Completed' },
  { id: 'ANA-2025-0232', patient: 'Ajay Singh', type: 'X-ray Lumbar Spine', date: '19 May 2025', severity: 'Grade III', confidence: 91, status: 'Completed' },
  { id: 'ANA-2025-0231', patient: 'Manoj Gupta', type: 'X-ray Lumbar Spine', date: '18 May 2025', severity: 'Grade I', confidence: 78, status: 'In Progress' },
]
const sevStyle = {
  'Grade I': { background: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0' },
  'Grade II': { background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' },
  'Grade III': { background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' },
}
const pill = (style, text) => (
  <span style={{ ...style, display: 'inline-flex', alignItems: 'center', borderRadius: '999px', padding: '4px 14px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>{text}</span>
)

/* ── Shared form styles ─────────────────────────────────────────── */
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px' }
const inputStyle = { width: '100%', padding: '10px 14px', fontSize: '14px', fontFamily: 'inherit', border: '1.5px solid rgba(139, 92, 246, 0.15)', borderRadius: '12px', background: 'var(--bg-warm)', outline: 'none', lineHeight: '1.5', boxSizing: 'border-box' }
const selectStyle = { ...inputStyle, cursor: 'pointer' }
const toggleBtnStyle = (active) => ({
  padding: '8px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
  border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
  background: active ? 'var(--primary)' : 'rgba(139, 92, 246, 0.15)',
  color: active ? 'white' : '#948979',
  boxShadow: active ? '0 4px 12px rgba(79,70,229,0.3)' : 'none'
})
const sectionTitleStyle = (Icon, title) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={16} color="var(--primary)" />
    </div>
    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>{title}</h4>
  </div>
)

export default function ImageAnalysisPage() {
  const [dragging, setDragging] = useState(false)
  const [scanType, setScanType] = useState('X-ray')
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) setSelectedFile(file)
  }
  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) setSelectedFile(file)
  }

  /* ── Patient clinical inputs ── */
  const [patient, setPatient] = useState({
    age: 55,
    gender: 'Female',
    back_pain: 'Yes',
    pain_severity: 8,
    pain_duration_months: 18,
    sciatica: 'Yes',
    numbness_tingling: 'Yes',
    muscle_weakness: 'No',
    difficulty_walking: 'Yes',
    difficulty_standing: 'Yes',
    sitting_hours: 8,
    heavy_lifting: 'No',
    previous_back_injury: 'Yes',
    previous_spine_surgery: 'No',
  })
  const set = (key, val) => setPatient(p => ({ ...p, [key]: val }))

  /* helper: yes/no toggle pair */
  const yesNo = (key) => (
    <div style={{ display: 'flex', gap: '8px' }}>
      {['Yes', 'No'].map(v => (
        <button key={v} type="button" onClick={() => set(key, v)} style={toggleBtnStyle(patient[key] === v)}>{v}</button>
      ))}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1300px' }} className="animate-fadeIn">
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark)' }}>Image Analysis</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '6px' }}>Upload spine scans for AI-powered analysis and severity grading</p>
      </div>

      {/* Upload + Patient Info + Settings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Drop Zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2.5px dashed ${dragging ? 'var(--primary)' : 'rgba(139, 92, 246, 0.25)'}`,
            borderRadius: '20px', padding: '60px 32px', textAlign: 'center',
            background: dragging ? '#151520' : '#0a0a0f', cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".dcm,.dicom,.jpg,.jpeg,.png" style={{ display: 'none' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {selectedFile ? <CheckCircle2 size={36} color="#22c55e" /> : <Upload size={36} color="#a78bfa" />}
            </div>
            <div>
              {selectedFile ? (
                <>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#22c55e' }}>File Selected</p>
                  <p style={{ fontSize: '14px', color: '#e2e0ec', marginTop: '6px', wordBreak: 'break-all' }}>{selectedFile.name}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: '20px', fontWeight: 700, color: '#e2e0ec' }}>Drop your scan here</p>
                  <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', marginTop: '6px' }}>or <span style={{ color: '#a78bfa', fontWeight: 600 }}>browse files</span></p>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginTop: '8px' }}>Supports: DICOM, JPEG, PNG · Max size: 50MB</p>
                </>
              )}
            </div>
            <button className="btn btn-primary btn-lg" onClick={e => { e.stopPropagation(); fileInputRef.current?.click() }}>
              {selectedFile ? 'Change File' : 'Select File'}
            </button>
          </div>
        </div>

        {/* ── Patient Clinical Information ── */}
        <div style={{ background: 'var(--bg-card)', border: '1.5px solid rgba(139, 92, 246, 0.15)', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '6px' }}>Patient Clinical Information</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Provide clinical context to improve AI analysis accuracy</p>

          {/* ── Demographics ── */}
          {sectionTitleStyle(User, 'Demographics')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '28px' }}>
            <div>
              <label style={labelStyle}>Age</label>
              <input type="number" min={1} max={120} value={patient.age} onChange={e => set('age', +e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Gender</label>
              <select value={patient.gender} onChange={e => set('gender', e.target.value)} style={selectStyle}>
                {['Male', 'Female', 'Other'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Scan Type</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['X-ray', 'MRI', 'CT Scan'].map(t => (
                  <button key={t} type="button" onClick={() => setScanType(t)} style={toggleBtnStyle(scanType === t)}>{t}</button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(139, 92, 246, 0.1)', margin: '0 0 24px' }} />

          {/* ── Pain & Symptoms ── */}
          {sectionTitleStyle(Activity, 'Pain & Symptoms')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Back Pain</label>
              {yesNo('back_pain')}
            </div>
            <div>
              <label style={labelStyle}>Sciatica</label>
              {yesNo('sciatica')}
            </div>
            <div>
              <label style={labelStyle}>Numbness / Tingling</label>
              {yesNo('numbness_tingling')}
            </div>
            <div>
              <label style={labelStyle}>Muscle Weakness</label>
              {yesNo('muscle_weakness')}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
            <div>
              <label style={labelStyle}>Pain Severity (1–10)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input type="range" min={1} max={10} value={patient.pain_severity} onChange={e => set('pain_severity', +e.target.value)}
                  style={{ flex: 1, accentColor: 'var(--primary)' }} />
                <span style={{ fontSize: '20px', fontWeight: 800, color: patient.pain_severity >= 7 ? '#ef4444' : patient.pain_severity >= 4 ? '#f59e0b' : '#22c55e', minWidth: '28px', textAlign: 'center' }}>
                  {patient.pain_severity}
                </span>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Pain Duration (months)</label>
              <input type="number" min={0} value={patient.pain_duration_months} onChange={e => set('pain_duration_months', +e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(139, 92, 246, 0.1)', margin: '0 0 24px' }} />

          {/* ── Functional Impact ── */}
          {sectionTitleStyle(Footprints, 'Functional Impact')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
            <div>
              <label style={labelStyle}>Difficulty Walking</label>
              {yesNo('difficulty_walking')}
            </div>
            <div>
              <label style={labelStyle}>Difficulty Standing</label>
              {yesNo('difficulty_standing')}
            </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(139, 92, 246, 0.1)', margin: '0 0 24px' }} />

          {/* ── Lifestyle ── */}
          {sectionTitleStyle(Dumbbell, 'Lifestyle')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
            <div>
              <label style={labelStyle}>Daily Sitting Hours</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input type="range" min={0} max={16} value={patient.sitting_hours} onChange={e => set('sitting_hours', +e.target.value)}
                  style={{ flex: 1, accentColor: 'var(--primary)' }} />
                <span style={{ fontSize: '20px', fontWeight: 800, color: patient.sitting_hours >= 8 ? '#ef4444' : patient.sitting_hours >= 5 ? '#f59e0b' : '#22c55e', minWidth: '36px', textAlign: 'center' }}>
                  {patient.sitting_hours}h
                </span>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Heavy Lifting</label>
              {yesNo('heavy_lifting')}
            </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(139, 92, 246, 0.1)', margin: '0 0 24px' }} />

          {/* ── Medical History ── */}
          {sectionTitleStyle(ClipboardList, 'Medical History')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
            <div>
              <label style={labelStyle}>Previous Back Injury</label>
              {yesNo('previous_back_injury')}
            </div>
            <div>
              <label style={labelStyle}>Previous Spine Surgery</label>
              {yesNo('previous_spine_surgery')}
            </div>
          </div>

          {/* ── Analysis Region + Priority ── */}
          <div style={{ height: '1px', background: 'rgba(139, 92, 246, 0.1)', margin: '0 0 24px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Analysis Region', options: ['Lumbar Spine', 'Cervical Spine', 'Thoracic Spine', 'Full Spine'] },
              { label: 'Priority', options: ['Normal', 'Urgent', 'Emergency'] },
            ].map(({ label, options }) => (
              <div key={label}>
                <label style={labelStyle}>{label}</label>
                <select style={selectStyle}>
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
      x``
      {/* Recent Analyses */}
      <div style={{ background: 'var(--bg-card)', border: '1.5px solid rgba(139, 92, 246, 0.15)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(139, 92, 246, 0.15)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)' }}>Recent Analyses</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-warm)', borderBottom: '1px solid rgba(139, 92, 246, 0.15)' }}>
                {['Analysis ID', 'Patient', 'Scan Type', 'Date', 'Severity', 'AI Confidence', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentScans.map(row => (
                <tr key={row.id} style={{ borderBottom: '1px solid #F5F0E8' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-warm)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px 20px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-muted)' }}>{row.id}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>{row.patient}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--text-dark)' }}>{row.type}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--text-muted)' }}>{row.date}</td>
                  <td style={{ padding: '16px 20px' }}>{pill(sevStyle[row.severity], row.severity)}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '80px', height: '8px', background: 'rgba(139, 92, 246, 0.15)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'var(--primary-dark)', borderRadius: '999px', width: `${row.confidence}%` }} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)' }}>{row.confidence}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>{pill(row.status === 'Completed' ? { background: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0' } : { background: '#DBEAFE', color: '#1E40AF', border: '1px solid #BFDBFE' }, row.status)}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <button style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
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
