import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload, Brain, User, CheckCircle2, AlertTriangle, X, ImagePlus, Briefcase,
  HeartPulse, FolderOpen, Info
} from 'lucide-react'


const symptomsOptions = [
  'Lower back pain', 'Neck pain', 'Numbness / tingling',
  'Leg weakness', 'Walking difficulty', 'Radiating pain',
  'Muscle spasms', 'Loss of bladder control',
]

// ── Sample patient (pre-filled for demo) ──────────────────────────────────
const SAMPLE = {
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
}

// Map sitting_hours → select option
function sittingLabel(h) {
  if (h < 2) return 'Less than 2 hours'
  if (h <= 4) return '2-4 hours'
  if (h <= 6) return '4-6 hours'
  if (h <= 8) return '6-8 hours'
  return 'More than 8 hours'
}

// Map pain_duration_months → select option
function durationLabel(m) {
  if (m < 1) return 'Less than 1 week'
  if (m <= 1) return '1-4 weeks'
  if (m <= 3) return '1-3 months'
  if (m <= 6) return '3-6 months'
  return 'More than 6 months'
}

// Map pain_severity (1-10) → select option
function severityLabel(s) {
  if (s <= 3) return 'Mild (1-3)'
  if (s <= 6) return 'Moderate (4-6)'
  return 'Severe (7-10)'
}

// Derive initial symptoms from SAMPLE flags
function derivedSymptoms() {
  const list = []
  if (SAMPLE.back_pain === 'Yes') list.push('Lower back pain')
  if (SAMPLE.sciatica === 'Yes') list.push('Radiating pain')
  if (SAMPLE.numbness_tingling === 'Yes') list.push('Numbness / tingling')
  if (SAMPLE.muscle_weakness === 'Yes') list.push('Leg weakness')
  if (SAMPLE.difficulty_walking === 'Yes') list.push('Walking difficulty')
  return list
}

export default function ImageAnalysisPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  // ── Patient Info state ────────────────────────────────────────────────
  const [patientName, setPatientName] = useState('')
  const [age, setAge] = useState(String(SAMPLE.age))
  const [gender, setGender] = useState(SAMPLE.gender)

  // ── Symptoms state ────────────────────────────────────────────────    
  const [selectedSymptoms, setSelectedSymptoms] = useState(derivedSymptoms())
  const [symptomDuration, setSymptomDuration] = useState(durationLabel(SAMPLE.pain_duration_months))
  const [severity, setSeverity] = useState(severityLabel(SAMPLE.pain_severity))
  const [notes, setNotes] = useState(
    [
      SAMPLE.sciatica === 'Yes' ? 'Sciatica present.' : '',
      SAMPLE.difficulty_standing === 'Yes' ? 'Difficulty standing.' : '',
      SAMPLE.heavy_lifting === 'No' ? 'No heavy lifting activity.' : '',
      SAMPLE.previous_back_injury === 'Yes' ? 'Previous back injury reported.' : '',
      SAMPLE.previous_spine_surgery === 'Yes' ? 'Previous spine surgery.' : '',
    ].filter(Boolean).join(' ')
  )

  // ── Lifestyle state ───────────────────────────────────────────────────
  const [sittingDuration, setSittingDuration] = useState(sittingLabel(SAMPLE.sitting_hours))
  const [activityLevel, setActivityLevel] = useState('Sedentary')
  const [workType, setWorkType] = useState('Desk-based / Sedentary')
  const [mobilityLimit, setMobilityLimit] = useState(
    SAMPLE.difficulty_walking === 'Yes' ? 'Moderate restriction' : 'None'
  )

  // ── Upload / scan state ───────────────────────────────────────────────
  const [dragging, setDragging] = useState(false)
  const [scanType, setScanType] = useState('X-ray')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploadedPreview, setUploadedPreview] = useState(null)
  const [previousRecord, setPreviousRecord] = useState(
    SAMPLE.previous_back_injury === 'Yes' ? 'report' : 'none'
  )

  // ── Analysis state ────────────────────────────────────────────────────
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
      { p: 15, delay: 500 },
      { p: 32, delay: 900 },
      { p: 55, delay: 1300 },
      { p: 73, delay: 1700 },
      { p: 90, delay: 2200 },
      { p: 100, delay: 2700 },
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
    { label: 'Image Enhancement', active: analysisProgress >= 15 },
    { label: 'Image Parsing', active: analysisProgress >= 32 },
    { label: 'RAG & Vector Matching', active: analysisProgress >= 55 },
    { label: 'Prediction Agent', active: analysisProgress >= 73 },
    { label: 'Report Generation', active: analysisProgress >= 90 },
    { label: 'Finalizing Results', active: analysisProgress >= 100 },
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

  // Sample-badge style
  const sampleBadge = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em',
    padding: '3px 10px', borderRadius: '999px',
    background: 'rgba(133,57,83,0.12)', color: 'var(--primary)',
    marginLeft: '10px', verticalAlign: 'middle',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1300px' }} className="animate-fadeIn">

      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark)' }}>
          New Patient Analysis
          <span style={sampleBadge}>Sample Patient</span>
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '6px' }}>
          Enter clinical information and upload available imaging for AI-assisted analysis.
          Fields are pre-filled with the sample patient data.
        </p>
      </div>

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
                {analysisDone ? 'Analysis Complete!' : 'AI Analysis Running...'}
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                {analysisDone ? 'Redirecting to results...' : 'Specialized agents are processing your data.'}
              </p>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>Progress</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>{analysisProgress}%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(133,57,83,0.15)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${analysisProgress}%`,
                  background: 'linear-gradient(90deg, var(--primary-light), var(--primary-dark))',
                  borderRadius: '999px', transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
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
                  }}>Agent {i + 1} -- {step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Section 5: Image Upload */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ImagePlus size={20} color="var(--primary)" /> Upload Medical Image
          </h3>
          {uploadedPreview ? (
            <div>
              <div style={{
                position: 'relative', borderRadius: '16px', overflow: 'hidden',
                border: '1.5px solid rgba(133,57,83,0.2)', background: 'var(--bg-warm)', marginBottom: '16px',
              }}>
                <img src={uploadedPreview} alt="Uploaded scan" style={{ width: '100%', maxHeight: '360px', objectFit: 'contain', display: 'block' }} />
                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => { setUploadedFile(null); setUploadedPreview(null) }}
                    style={{
                      padding: '8px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                      background: 'rgba(239,68,68,0.9)', color: 'white', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(4px)', fontFamily: 'inherit',
                    }}
                  >
                    <X size={14} /> Remove
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      padding: '8px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                      background: 'rgba(255,255,255,0.9)', color: 'var(--text-dark)', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(4px)', fontFamily: 'inherit',
                    }}
                  >
                    <ImagePlus size={14} /> Replace
                  </button>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Done: {uploadedFile?.name || 'Scan uploaded'} -- Ready for analysis
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
                    {dragging ? 'Drop to upload' : 'Drag and drop your image here'}
                  </p>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '6px' }}>
                    or <span style={{ color: 'var(--primary)', fontWeight: 600 }}>browse files</span>
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Supports: X-ray, MRI, DICOM, JPEG, PNG -- Max 50 MB
                  </p>
                </div>
              </div>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*,.dcm" style={{ display: 'none' }} onChange={e => handleFileDrop(e.target.files[0])} />
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
                    background: scanType === t ? 'var(--primary)' : 'rgba(133, 57, 83, 0.12)',
                    color: scanType === t ? 'white' : 'var(--text-muted)',
                    boxShadow: scanType === t ? '0 4px 12px rgba(133,57,83,0.3)' : 'none',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
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
              <input
                type="text"
                placeholder="Full name"
                className="form-input"
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Age *</label>
              <input
                type="number"
                placeholder="Years"
                className="form-input"
                min="1" max="120"
                value={age}
                onChange={e => setAge(e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Sex *</label>
              <select
                className="form-input"
                value={gender}
                onChange={e => setGender(e.target.value)}
              >
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
                  background: selectedSymptoms.includes(s) ? 'rgba(133,57,83,0.12)' : 'var(--bg-warm)',
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
              <select
                className="form-input"
                value={symptomDuration}
                onChange={e => setSymptomDuration(e.target.value)}
              >
                <option>Select duration</option>
                <option>Less than 1 week</option>
                <option>1-4 weeks</option>
                <option>1-3 months</option>
                <option>3-6 months</option>
                <option>More than 6 months</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Severity / Intensity (0-10)</label>
              <select
                className="form-input"
                value={severity}
                onChange={e => setSeverity(e.target.value)}
              >
                <option>Select severity</option>
                <option>Mild (1-3)</option>
                <option>Moderate (4-6)</option>
                <option>Severe (7-10)</option>
              </select>
            </div>
          </div>

          {/* Pain severity numeric display */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '12px 16px', borderRadius: '12px',
            background: 'rgba(133,57,83,0.06)', border: '1px solid rgba(133,57,83,0.18)',
            marginBottom: '20px',
          }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', minWidth: '120px' }}>
              Pain Score (NRS)
            </span>
            <div style={{ flex: 1, display: 'flex', gap: '6px' }}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                <div
                  key={n}
                  style={{
                    flex: 1, height: '28px', borderRadius: '6px',
                    background: n <= SAMPLE.pain_severity
                      ? (n <= 3 ? '#059669' : n <= 6 ? '#D97706' : 'var(--primary)')
                      : 'rgba(133,57,83,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', fontWeight: 700,
                    color: n <= SAMPLE.pain_severity ? 'white' : 'var(--text-muted)',
                    transition: 'background 0.2s',
                  }}
                >
                  {n}
                </div>
              ))}
            </div>
            <span style={{ fontSize: '20px', fontWeight: 900, color: 'var(--primary)', minWidth: '32px', textAlign: 'right' }}>
              {SAMPLE.pain_severity}
            </span>
          </div>

          <div>
            <label style={labelStyle}>Additional Clinical Notes</label>
            <textarea
              placeholder="Any additional clinical observations, medication history, or relevant notes..."
              className="form-input"
              rows={3}
              style={{ resize: 'vertical' }}
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Section 3: Lifestyle */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Briefcase size={20} color="var(--primary)" /> Lifestyle and Functional Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Daily Sitting Duration</label>
              <select
                className="form-input"
                value={sittingDuration}
                onChange={e => setSittingDuration(e.target.value)}
              >
                <option>Select duration</option>
                <option>Less than 2 hours</option>
                <option>2-4 hours</option>
                <option>4-6 hours</option>
                <option>6-8 hours</option>
                <option>More than 8 hours</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Physical Activity Level</label>
              <select
                className="form-input"
                value={activityLevel}
                onChange={e => setActivityLevel(e.target.value)}
              >
                <option>Select level</option>
                <option>Sedentary</option>
                <option>Lightly active</option>
                <option>Moderately active</option>
                <option>Very active</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Work / Activity Type</label>
              <select
                className="form-input"
                value={workType}
                onChange={e => setWorkType(e.target.value)}
              >
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
              <select
                className="form-input"
                value={mobilityLimit}
                onChange={e => setMobilityLimit(e.target.value)}
              >
                <option>Select option</option>
                <option>None</option>
                <option>Slight restriction</option>
                <option>Moderate restriction</option>
                <option>Significant restriction</option>
                <option>Unable to walk unaided</option>
              </select>
            </div>
          </div>

          {/* Quick flags row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '20px' }}>
            {[
              { label: 'Heavy Lifting', value: SAMPLE.heavy_lifting },
              { label: 'Prev. Back Injury', value: SAMPLE.previous_back_injury },
              { label: 'Prev. Spine Surgery', value: SAMPLE.previous_spine_surgery },
              { label: 'Difficulty Standing', value: SAMPLE.difficulty_standing },
            ].map(({ label, value }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
                background: value === 'Yes' ? 'rgba(133,57,83,0.10)' : 'rgba(5,150,105,0.08)',
                border: `1px solid ${value === 'Yes' ? 'rgba(133,57,83,0.25)' : 'rgba(5,150,105,0.25)'}`,
                color: value === 'Yes' ? 'var(--primary)' : '#059669',
              }}>
                {value === 'Yes'
                  ? <AlertTriangle size={11} />
                  : <CheckCircle2 size={11} />}
                {label}: {value}
              </div>
            ))}
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
              { val: 'report', label: 'Previous Report Available' },
              { val: 'none', label: 'No Previous Record' },
            ].map(opt => (
              <button
                key={opt.val}
                onClick={() => setPreviousRecord(opt.val)}
                style={{
                  flex: 1, padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600,
                  border: previousRecord === opt.val ? '1.5px solid var(--primary)' : '1.5px solid rgba(133,57,83,0.2)',
                  background: previousRecord === opt.val ? 'rgba(133,57,83,0.1)' : 'var(--bg-warm)',
                  color: previousRecord === opt.val ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                }}
              >
                {previousRecord === opt.val && '+ '}{opt.label}
              </button>
            ))}
          </div>
          {(previousRecord === 'imaging' || previousRecord === 'report') ? (
            <div style={{
              padding: '16px', borderRadius: '14px', background: 'rgba(133,57,83,0.06)',
              border: '1px solid rgba(133,57,83,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="var(--primary)" />
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>
                  Previous {previousRecord === 'imaging' ? 'imaging' : 'report'} will be included in longitudinal comparison.
                </span>
              </div>
              <button className="btn btn-outline btn-sm" style={{ whiteSpace: 'nowrap' }}>View Previous Records</button>
            </div>
          ) : (
            <div style={{
              padding: '14px 16px', borderRadius: '12px', background: 'var(--bg-warm)',
              border: '1px solid rgba(133,57,83,0.15)', display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <Info size={16} color="var(--text-muted)" />
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                No previous imaging available -- analysis will proceed without longitudinal comparison.
              </span>
            </div>
          )}
        </div>

       
        {/* START ANALYSIS BUTTON */}
        <button
          className="btn btn-primary"
          onClick={handleStartAnalysis}
          disabled={isAnalyzing}
          style={{ width: '100%', justifyContent: 'center', padding: '18px', fontSize: '16px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(133,57,83,0.3)' }}
        >
          <Brain size={22} />
          {isAnalyzing ? 'Analysis Running...' : 'Start Analysis'}
        </button>
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '-8px' }}>
          SpineLIT decision support - final decisions remain with the clinician.
        </p>
      </div>
    </div>
  )
}
