import { useState, useRef } from 'react'
<<<<<<< HEAD
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
=======
import { useNavigate } from 'react-router-dom'
import {
  Upload, Brain, FileText, ArrowRight, User, Activity, Zap,
  CheckCircle2, AlertTriangle, Clock, X, ImagePlus, Briefcase,
  HeartPulse, ChevronDown, FolderOpen, Info
} from 'lucide-react'

const symptomsOptions = [
  'Lower back pain', 'Neck pain', 'Numbness / tingling',
  'Leg weakness', 'Walking difficulty', 'Radiating pain',
  'Muscle spasms', 'Loss of bladder control',
]
>>>>>>> ba55163186ba86b46c4027b1426de257cd471f53

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
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [dragging, setDragging] = useState(false)
  const [scanType, setScanType] = useState('X-ray')
<<<<<<< HEAD
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
=======
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploadedPreview, setUploadedPreview] = useState(null)
  const [previousRecord, setPreviousRecord] = useState('none')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisDone, setAnalysisDone] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const toggleSymptom = (s) =>
    setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  const handleFileDrop = (file) => {
    if (!file) return
    setUploadedFile(file)
    const reader = new FileReader()
    reader.onload = e => setUploadedPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    const steps = [
      { p: 15, delay: 500  },
      { p: 32, delay: 900  },
      { p: 55, delay: 1300 },
      { p: 73, delay: 1700 },
      { p: 90, delay: 2200 },
      { p: 100,delay: 2700 },
    ]
    for (const step of steps) {
      await new Promise(r => setTimeout(r, step.delay))
      setAnalysisProgress(step.p)
    }
    setAnalysisDone(true)
    await new Promise(r => setTimeout(r, 800))
    navigate('/dashboard/ai-analysis-result')
  }

  const agentSteps = [
    { label: 'Image Enhancement',            active: analysisProgress >= 15  },
    { label: 'Image Parsing',                active: analysisProgress >= 32  },
    { label: 'RAG & Vector Matching',        active: analysisProgress >= 55  },
    { label: 'Prediction Agent',             active: analysisProgress >= 73  },
    { label: 'Report Generation',            active: analysisProgress >= 90  },
    { label: 'Finalizing Results',           active: analysisProgress >= 100 },
  ]

  const cardStyle = {
    background: 'var(--bg-card)',
    border: '1.5px solid rgba(133, 57, 83, 0.15)',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-dark)',
    marginBottom: '8px',
  }
>>>>>>> ba55163186ba86b46c4027b1426de257cd471f53

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1300px' }} className="animate-fadeIn">

      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark)' }}>New Patient Analysis</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '6px' }}>
          Enter clinical information and upload available imaging for AI-assisted analysis.
        </p>
      </div>

<<<<<<< HEAD
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
=======
      {/* Analysis Progress Modal */}
      {isAnalyzing && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(44,44,44,0.6)',
          backdropFilter: 'blur(8px)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: 'var(--bg-card)', borderRadius: '24px',
            padding: '40px 48px', width: '480px', maxWidth: '90vw',
            boxShadow: '0 32px 80px rgba(0,0,0,0.2)',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '20px',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 8px 24px rgba(133,57,83,0.3)',
              }}>
                <Brain size={32} color="white" />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '6px' }}>
                {analysisDone ? 'Analysis Complete!' : 'AI Analysis Running…'}
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                {analysisDone
                  ? 'Redirecting to results…'
                  : 'Specialized agents are processing your data.'}
              </p>
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>Progress</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>{analysisProgress}%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(133,57,83,0.15)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${analysisProgress}%`,
                  background: 'linear-gradient(90deg, var(--primary-light), var(--primary-dark))',
                  borderRadius: '999px',
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>

            {/* Agent Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {agentSteps.map((step, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 14px', borderRadius: '10px',
                  background: step.active ? 'rgba(133,57,83,0.08)' : 'var(--bg-warm)',
                  border: step.active ? '1px solid rgba(133,57,83,0.2)' : '1px solid transparent',
                  transition: 'all 0.3s',
                }}>
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                    background: step.active ? 'var(--primary)' : 'rgba(133,57,83,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.3s',
                  }}>
                    {step.active && <CheckCircle2 size={12} color="white" />}
                  </div>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: step.active ? 600 : 500,
                    color: step.active ? 'var(--text-dark)' : 'var(--text-muted)',
                  }}>Agent {i + 1} — {step.label}</span>
                </div>
              ))}
            </div>
>>>>>>> ba55163186ba86b46c4027b1426de257cd471f53
          </div>
        </div>
      )}

<<<<<<< HEAD
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
=======
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>

        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Section 1: Patient Information */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={20} color="var(--primary)" /> Patient Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Patient ID</label>
                <input type="text" placeholder="Auto-generated" className="form-input" readOnly style={{ opacity: 0.6 }} />
              </div>
              <div>
                <label style={labelStyle}>Patient Name *</label>
                <input type="text" placeholder="Full name" className="form-input" />
              </div>
              <div>
                <label style={labelStyle}>Age *</label>
                <input type="number" placeholder="Years" className="form-input" min="1" max="120" />
              </div>
              <div>
                <label style={labelStyle}>Sex *</label>
                <select className="form-input">
                  <option value="">Select sex</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other / Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Symptoms */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <HeartPulse size={20} color="var(--primary)" /> Clinical Symptoms
            </h3>

            {/* Symptom checkboxes */}
            <label style={{ ...labelStyle, marginBottom: '12px' }}>Presenting Symptoms</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
              {symptomsOptions.map(s => (
                <button
                  key={s}
                  onClick={() => toggleSymptom(s)}
                  style={{
                    padding: '8px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 600,
                    border: selectedSymptoms.includes(s)
                      ? '1.5px solid var(--primary)'
                      : '1.5px solid rgba(133,57,83,0.25)',
                    background: selectedSymptoms.includes(s)
                      ? 'rgba(133,57,83,0.12)'
                      : 'var(--bg-warm)',
                    color: selectedSymptoms.includes(s) ? 'var(--primary)' : 'var(--text-muted)',
                    cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                  }}
                >
                  {selectedSymptoms.includes(s) && '✓ '}{s}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Symptom Duration</label>
                <select className="form-input">
                  <option>Select duration</option>
                  <option>Less than 1 week</option>
                  <option>1–4 weeks</option>
                  <option>1–3 months</option>
                  <option>3–6 months</option>
                  <option>More than 6 months</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Severity / Intensity (0–10)</label>
                <select className="form-input">
                  <option>Select severity</option>
                  <option>Mild (1–3)</option>
                  <option>Moderate (4–6)</option>
                  <option>Severe (7–10)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Additional Clinical Notes</label>
              <textarea
                placeholder="Any additional clinical observations, medication history, or relevant notes…"
                className="form-input"
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Section 3: Lifestyle & Functional Information */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Briefcase size={20} color="var(--primary)" /> Lifestyle &amp; Functional Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Daily Sitting Duration</label>
                <select className="form-input">
                  <option>Select duration</option>
                  <option>Less than 2 hours</option>
                  <option>2–4 hours</option>
                  <option>4–6 hours</option>
                  <option>6–8 hours</option>
                  <option>More than 8 hours</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Physical Activity Level</label>
                <select className="form-input">
                  <option>Select level</option>
                  <option>Sedentary</option>
                  <option>Lightly active</option>
                  <option>Moderately active</option>
                  <option>Very active</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Work / Activity Type</label>
                <select className="form-input">
                  <option>Select type</option>
                  <option>Desk-based / Sedentary</option>
                  <option>Standing / Walking</option>
                  <option>Physical / Manual labor</option>
                  <option>Mixed</option>
                  <option>Retired / Not working</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Mobility Limitations</label>
                <select className="form-input">
                  <option>Select option</option>
                  <option>None</option>
                  <option>Slight restriction</option>
                  <option>Moderate restriction</option>
                  <option>Significant restriction</option>
                  <option>Unable to walk unaided</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Previous Medical Data */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FolderOpen size={20} color="var(--primary)" /> Previous Medical Data
            </h3>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              {[
                { val: 'imaging', label: 'Previous Imaging Available' },
                { val: 'report',  label: 'Previous Report Available' },
                { val: 'none',    label: 'No Previous Record' },
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setPreviousRecord(opt.val)}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600,
                    border: previousRecord === opt.val
                      ? '1.5px solid var(--primary)'
                      : '1.5px solid rgba(133,57,83,0.2)',
                    background: previousRecord === opt.val ? 'rgba(133,57,83,0.1)' : 'var(--bg-warm)',
                    color: previousRecord === opt.val ? 'var(--primary)' : 'var(--text-muted)',
                    cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                  }}
                >
                  {previousRecord === opt.val && '✓ '}{opt.label}
                </button>
              ))}
            </div>

            {(previousRecord === 'imaging' || previousRecord === 'report') ? (
              <div style={{
                padding: '16px', borderRadius: '14px',
                background: 'rgba(133,57,83,0.06)',
                border: '1px solid rgba(133,57,83,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--primary)" />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>
                    Previous {previousRecord === 'imaging' ? 'imaging' : 'report'} will be included in longitudinal comparison.
                  </span>
                </div>
                <button className="btn btn-outline btn-sm" style={{ whiteSpace: 'nowrap' }}>
                  View Previous Records
                </button>
              </div>
            ) : (
              <div style={{
                padding: '14px 16px', borderRadius: '12px',
                background: 'var(--bg-warm)',
                border: '1px solid rgba(133,57,83,0.15)',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <Info size={16} color="var(--text-muted)" />
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  No previous imaging available — analysis will proceed without longitudinal comparison.
                </span>
              </div>
            )}
          </div>

          {/* Section 5: Image Upload */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ImagePlus size={20} color="var(--primary)" /> Upload Medical Image
            </h3>

            {uploadedPreview ? (
              <div>
                <div style={{
                  position: 'relative', borderRadius: '16px', overflow: 'hidden',
                  border: '1.5px solid rgba(133,57,83,0.2)',
                  background: 'var(--bg-warm)', marginBottom: '16px',
                }}>
                  <img
                    src={uploadedPreview}
                    alt="Uploaded scan"
                    style={{ width: '100%', maxHeight: '360px', objectFit: 'contain', display: 'block' }}
                  />
                  <div style={{
                    position: 'absolute', top: '12px', right: '12px',
                    display: 'flex', gap: '8px',
                  }}>
                    <button
                      onClick={() => { setUploadedFile(null); setUploadedPreview(null) }}
                      style={{
                        padding: '8px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                        background: 'rgba(239,68,68,0.9)', color: 'white', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(4px)',
                        fontFamily: 'inherit',
                      }}
                    >
                      <X size={14} /> Remove
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        padding: '8px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                        background: 'rgba(255,255,255,0.9)', color: 'var(--text-dark)', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(4px)',
                        fontFamily: 'inherit',
                      }}
                    >
                      <ImagePlus size={14} /> Replace
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  ✓ {uploadedFile?.name || 'Scan uploaded'} &nbsp;·&nbsp; Ready for analysis
                </p>
              </div>
            ) : (
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); handleFileDrop(e.dataTransfer.files[0]) }}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2.5px dashed ${dragging ? 'var(--primary)' : 'rgba(133, 57, 83, 0.25)'}`,
                  borderRadius: '16px', padding: '56px 32px', textAlign: 'center',
                  background: dragging ? 'rgba(133,57,83,0.06)' : 'var(--bg-warm)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(133, 57, 83, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Upload size={30} color="var(--primary)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-dark)' }}>
                      {dragging ? 'Drop to upload' : 'Drag & drop your image here'}
                    </p>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '6px' }}>
                      or <span style={{ color: 'var(--primary)', fontWeight: 600 }}>browse files</span>
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                      Supports: X-ray · MRI · DICOM · JPEG · PNG &nbsp;·&nbsp; Max 50 MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.dcm"
              style={{ display: 'none' }}
              onChange={e => handleFileDrop(e.target.files[0])}
            />

            {/* Scan Type */}
            <div style={{ marginTop: '20px' }}>
              <label style={labelStyle}>Scan Type *</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['X-ray', 'MRI', 'CT'].map(t => (
                  <button
                    key={t}
                    onClick={() => setScanType(t)}
                    style={{
                      padding: '10px 22px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                      border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                      background: scanType === t
                        ? 'var(--primary)'
                        : 'rgba(133, 57, 83, 0.12)',
                      color: scanType === t ? 'white' : 'var(--text-muted)',
                      boxShadow: scanType === t ? '0 4px 12px rgba(133,57,83,0.3)' : 'none',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Analysis Region */}
            <div style={{ marginTop: '20px' }}>
              <label style={labelStyle}>Analysis Region *</label>
              <select className="form-input">
                <option>Select region</option>
                <option>Lumbar Spine</option>
                <option>Cervical Spine</option>
                <option>Thoracic Spine</option>
                <option>Full Spine</option>
              </select>
            </div>
          </div>

          {/* START ANALYSIS BUTTON */}
          <button
            className="btn btn-primary"
            onClick={handleStartAnalysis}
            disabled={isAnalyzing}
            style={{
              width: '100%', justifyContent: 'center',
              padding: '18px', fontSize: '16px', borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(133,57,83,0.3)',
            }}
          >
            <Brain size={22} />
            {isAnalyzing ? 'Analysis Running…' : 'Start AI Analysis'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '-8px' }}>
            AI-assisted clinical decision support — final decisions remain with the clinician.
          </p>
        </div>

        {/* Right Column: Info Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '24px' }}>

          <div style={cardStyle}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '18px' }}>
              AI Analysis Features
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { icon: CheckCircle2, label: 'Explainable AI with heatmaps',        color: '#059669', bg: '#ECFDF5' },
                { icon: Brain,        label: 'Clinical intelligence via RAG',         color: 'var(--primary)', bg: 'rgba(133,57,83,0.1)' },
                { icon: Clock,        label: 'Longitudinal comparison',               color: '#D97706', bg: '#FFFBEB' },
                { icon: FileText,     label: 'Structured clinical report',            color: 'var(--primary-dark)', bg: 'rgba(97,45,83,0.1)' },
                { icon: Activity,     label: 'Severity grading with confidence',      color: '#0891B2', bg: '#ECFEFF' },
              ].map(({ icon: Icon, label, color, bg }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', borderRadius: '12px',
                  background: 'var(--bg-warm)', border: '1px solid rgba(133,57,83,0.12)',
                }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color={color} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            borderRadius: '20px', padding: '28px', color: 'white',
          }}>
            <Zap size={28} color="rgba(255,255,255,0.4)" style={{ marginBottom: '12px' }} />
            <p style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Analysis Time</p>
            <p style={{ fontSize: '56px', fontWeight: 900, lineHeight: 1, margin: '8px 0' }}>~15s</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>
              With explainable visual outputs and clinical report.
            </p>
          </div>

          <div style={{
            ...cardStyle,
            background: 'rgba(133,57,83,0.06)',
            border: '1px solid rgba(133,57,83,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <AlertTriangle size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                <strong style={{ color: 'var(--text-dark)' }}>Clinical Notice:</strong> This is an AI-assisted decision support tool. All findings require review and validation by a qualified clinician before clinical action.
              </p>
            </div>
          </div>
>>>>>>> ba55163186ba86b46c4027b1426de257cd471f53
        </div>
      </div>
    </div>
  )
}
