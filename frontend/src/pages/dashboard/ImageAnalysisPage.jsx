import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload, Brain, User, CheckCircle2, AlertTriangle, X, ImagePlus, Briefcase,
  HeartPulse, FolderOpen, Info, Layers, Download, Sparkles
} from 'lucide-react'
import SpineVisualizer from '../../components/SpineVisualizer'
import { SPINE_PROFILES, detectScanProfile } from '../../data/spineScanProfiles'


const symptomsOptions = [
  'Lower back pain', 'Bilateral buttock ache', 'Numbness / tingling',
  'Leg weakness / Sciatica', 'Walking difficulty / Claudication', 'Radiating pain (L4-S1)',
  'Lumbar stiffness / Spasms', 'Standing / Extension pain',
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

function sittingLabel(h) {
  if (h < 2) return 'Less than 2 hours'
  if (h <= 4) return '2-4 hours'
  if (h <= 6) return '4-6 hours'
  if (h <= 8) return '6-8 hours'
  return 'More than 8 hours'
}

function durationLabel(m) {
  if (m < 1) return 'Less than 1 week'
  if (m <= 1) return '1-4 weeks'
  if (m <= 3) return '1-3 months'
  if (m <= 6) return '3-6 months'
  return 'More than 6 months'
}

function severityLabel(s) {
  if (s <= 3) return 'Mild (1-3)'
  if (s <= 6) return 'Moderate (4-6)'
  return 'Severe (7-10)'
}

function derivedSymptoms() {
  const list = []
  if (SAMPLE.back_pain === 'Yes') list.push('Lower back pain')
  if (SAMPLE.sciatica === 'Yes') list.push('Radiating pain')
  if (SAMPLE.numbness_tingling === 'Yes') list.push('Numbness / tingling')
  if (SAMPLE.muscle_weakness === 'Yes') list.push('Leg weakness')
  if (SAMPLE.difficulty_walking === 'Yes') list.push('Walking difficulty')
  return list
}

// ── Spine node/disc data ──────────────────────────────────────────────────
const SPINE_NODES = [
  { id: 'L1',   type: 'vertebra', label: 'L1',    confidence: 0.98, color: '#00BFFF' },
  { id: 'L1L2', type: 'disc',     label: 'L1/L2', confidence: 0.98, color: '#00E5FF' },
  { id: 'L2',   type: 'vertebra', label: 'L2',    confidence: 0.98, color: '#00FF7F' },
  { id: 'L2L3', type: 'disc',     label: 'L2/L3', confidence: 0.97, color: '#ADFF2F' },
  { id: 'L3',   type: 'vertebra', label: 'L3',    confidence: 0.98, color: '#FFD700' },
  { id: 'L3L4', type: 'disc',     label: 'L3/L4', confidence: 0.98, color: '#FFA500' },
  { id: 'L4',   type: 'vertebra', label: 'L4',    confidence: 0.98, color: '#FF69B4' },
  { id: 'L4L5', type: 'disc',     label: 'L4/L5', confidence: 0.99, color: '#FF4500', highlight: true },
  { id: 'L5',   type: 'vertebra', label: 'L5',    confidence: 0.98, color: '#FF6347' },
  { id: 'L5S1', type: 'disc',     label: 'L5/S1', confidence: 0.99, color: '#DA70D6' },
]

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}



// ── Spine Detection Visualization ─────────────────────────────────────────
function SpineDetectionMap({ visible }) {
  const [revealed, setRevealed] = useState([])

  useEffect(() => {
    if (!visible) { setRevealed([]); return }
    SPINE_NODES.forEach((node, i) => {
      setTimeout(() => {
        setRevealed(prev => [...prev, node.id])
      }, 200 + i * 180)
    })
  }, [visible])

  const isRevealed = (id) => revealed.includes(id)

  return (
    <div style={{
      background: 'linear-gradient(180deg, #0a0a0f 0%, #0d0d18 60%, #0a0a0f 100%)',
      borderRadius: '20px',
      padding: '28px 24px',
      border: '1.5px solid rgba(0, 191, 255, 0.15)',
      boxShadow: '0 0 40px rgba(0,191,255,0.05)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'linear-gradient(rgba(0,191,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,191,255,1) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', position: 'relative' }}>
        <div style={{
          width: '34px', height: '34px', borderRadius: '10px',
          background: 'rgba(0,191,255,0.15)', border: '1px solid rgba(0,191,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Layers size={16} color="#00BFFF" />
        </div>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#00BFFF', letterSpacing: '0.05em' }}>SPINE DETECTION MAP</p>
          <p style={{ fontSize: '10px', color: 'rgba(0,191,255,0.5)', marginTop: '1px' }}>Lumbar Region · AI Segmentation</p>
        </div>
        <div style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px',
          padding: '4px 10px', borderRadius: '999px',
          background: 'rgba(0,229,77,0.1)', border: '1px solid rgba(0,229,77,0.3)',
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00E54D', animation: 'spPulse 1.5s ease-in-out infinite' }} />
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#00E54D' }}>LIVE</span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '18px', marginBottom: '20px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div style={{ width: '11px', height: '11px', borderRadius: '50%', border: '2px solid #00BFFF' }} />
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Vertebra</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div style={{ width: '9px', height: '9px', border: '2px solid #00BFFF', transform: 'rotate(45deg)' }} />
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Disc</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div style={{ width: '18px', height: '1.5px', background: 'rgba(0,191,255,0.5)' }} />
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Vertebra outline (thin lines)</span>
        </div>
      </div>

      {/* Spine chain */}
      <div style={{ position: 'relative', paddingLeft: '90px' }}>
        {/* Central axis line */}
        <div style={{
          position: 'absolute', left: '118px', top: '14px',
          width: '2px',
          height: `${SPINE_NODES.length * 52 - 28}px`,
          background: 'linear-gradient(180deg, rgba(0,191,255,0.4) 0%, rgba(0,191,255,0.15) 100%)',
          borderRadius: '1px',
        }} />

        {SPINE_NODES.map((node) => {
          const isVert = node.type === 'vertebra'
          const show = isRevealed(node.id)
          const rgb = hexToRgb(node.color)

          return (
            <div
              key={node.id}
              style={{
                display: 'flex', alignItems: 'center', height: '52px',
                opacity: show ? 1 : 0,
                transform: show ? 'translateX(0)' : 'translateX(-16px)',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                position: 'relative',
              }}
            >
              {/* Horizontal connector */}
              <div style={{
                position: 'absolute',
                left: '28px',
                width: isVert ? '62px' : '90px',
                top: '50%', transform: 'translateY(-50%)',
                height: '1.5px',
                background: `rgba(${rgb}, 0.45)`,
              }} />

              {/* Left label (disc only) */}
              <div style={{ width: '82px', textAlign: 'right', paddingRight: '10px', position: 'relative', zIndex: 1 }}>
                {!isVert && (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '3px 8px', borderRadius: '6px',
                    background: `rgba(${rgb}, 0.12)`,
                    border: `1px solid rgba(${rgb}, 0.35)`,
                  }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: node.color }}>{node.label}</span>
                    <span style={{ fontSize: '9px', fontWeight: 600, color: `rgba(${rgb}, 0.8)` }}>{node.confidence.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Node shape */}
              <div style={{ position: 'relative', zIndex: 2, flexShrink: 0 }}>
                {isVert ? (
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    border: `2.5px solid ${node.color}`,
                    background: `rgba(${rgb}, 0.15)`,
                    boxShadow: `0 0 10px rgba(${rgb}, 0.4)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: node.color }} />
                  </div>
                ) : (
                  <div style={{
                    width: '14px', height: '14px',
                    border: `2.5px solid ${node.color}`,
                    background: `rgba(${rgb}, 0.15)`,
                    transform: 'rotate(45deg)',
                    boxShadow: node.highlight
                      ? `0 0 18px rgba(${rgb}, 0.8), 0 0 4px rgba(${rgb}, 1)`
                      : `0 0 10px rgba(${rgb}, 0.4)`,
                  }} />
                )}
              </div>

              {/* Right label (vertebra only) */}
              <div style={{ paddingLeft: '12px', position: 'relative', zIndex: 1 }}>
                {isVert && (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '4px 12px', borderRadius: '8px',
                    background: `rgba(${rgb}, 0.1)`,
                    border: `1px solid rgba(${rgb}, 0.3)`,
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: node.color }}>{node.label}</span>
                    <span style={{ fontSize: '10px', color: `rgba(${rgb}, 0.7)`, fontWeight: 600 }}>{node.confidence.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer stats */}
      <div style={{
        marginTop: '20px', display: 'flex', gap: '10px',
        padding: '12px 14px', borderRadius: '12px',
        background: 'rgba(0,191,255,0.05)', border: '1px solid rgba(0,191,255,0.15)',
        position: 'relative',
      }}>
        {[
          { label: 'Vertebrae', value: '5', color: '#00BFFF' },
          { label: 'Discs', value: '5', color: '#DA70D6' },
          { label: 'Avg Conf.', value: '98.2%', color: '#00E54D' },
          { label: 'Region', value: 'Lumbar', color: '#FFD700' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ flex: 1, textAlign: 'center' }}>
            <p style={{ fontSize: '15px', fontWeight: 800, color, marginBottom: '2px' }}>{value}</p>
            <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Anomaly callout */}
      <div style={{
        marginTop: '10px', padding: '10px 14px', borderRadius: '10px',
        background: 'rgba(255,69,0,0.08)', border: '1px solid rgba(255,69,0,0.3)',
        display: 'flex', alignItems: 'center', gap: '10px', position: 'relative',
      }}>
        <AlertTriangle size={15} color="#FF4500" style={{ flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#FF6347', marginBottom: '2px' }}>
            Anomaly Detected — L4/L5 Disc Space
          </p>
          <p style={{ fontSize: '10px', color: 'rgba(255,99,71,0.7)' }}>
            Disc height reduction detected. Confidence: 99% · Severity: Moderate
          </p>
        </div>
      </div>
    </div>
  )
}



// ── Main Page ─────────────────────────────────────────────────────────────
export default function ImageAnalysisPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [patientName, setPatientName] = useState('')
  const [age, setAge] = useState(String(SAMPLE.age))
  const [gender, setGender] = useState(SAMPLE.gender)
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
  const [sittingDuration, setSittingDuration] = useState(sittingLabel(SAMPLE.sitting_hours))
  const [activityLevel, setActivityLevel] = useState('Sedentary')
  const [workType, setWorkType] = useState('Desk-based / Sedentary')
  const [mobilityLimit, setMobilityLimit] = useState(SAMPLE.difficulty_walking === 'Yes' ? 'Moderate restriction' : 'None')
  const [dragging, setDragging] = useState(false)
  const [scanType, setScanType] = useState('X-ray')
  const [activeProfileId, setActiveProfileId] = useState(() => {
    return sessionStorage.getItem('spinelit_active_profile') || 'lumbar_lateral'
  })
  const activeProfile = SPINE_PROFILES[activeProfileId] || SPINE_PROFILES.lumbar_lateral

  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploadedPreview, setUploadedPreview] = useState(null)
  const [previousRecord, setPreviousRecord] = useState(SAMPLE.previous_back_injury === 'Yes' ? 'report' : 'none')
  const [detectionRunning, setDetectionRunning] = useState(false)
  const [detectionDone, setDetectionDone] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisDone, setAnalysisDone] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const toggleSymptom = (s) =>
    setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  const handleFileDrop = (file) => {
    if (!file) return
    setUploadedFile(file)
    const detected = detectScanProfile(file.name, activeProfileId)
    setActiveProfileId(detected.id)
    sessionStorage.setItem('spinelit_active_profile', detected.id)
    setDetectionDone(false)
    setDetectionRunning(true)
    const reader = new FileReader()
    reader.onload = e => {
      const dataUrl = e.target.result
      setUploadedPreview(dataUrl)
      try {
        sessionStorage.setItem('spinelit_uploaded_image', dataUrl)
        sessionStorage.setItem('spinelit_uploaded_filename', file.name)
      } catch (err) {
        console.warn('Image storage warning', err)
      }
      setTimeout(() => {
        setDetectionRunning(false)
        setDetectionDone(true)
      }, 1500)
    }
    reader.readAsDataURL(file)
  }

  const handleSelectProfile = (profileId) => {
    const prof = SPINE_PROFILES[profileId] || SPINE_PROFILES.lumbar_lateral
    setActiveProfileId(prof.id)
    sessionStorage.setItem('spinelit_active_profile', prof.id)
    setUploadedFile({ name: prof.fileName, size: 500000 })
    setUploadedPreview(prof.image)
    try {
      sessionStorage.setItem('spinelit_uploaded_image', prof.image)
      sessionStorage.setItem('spinelit_uploaded_filename', prof.fileName)
    } catch (e) {
      console.warn(e)
    }
    setDetectionDone(false)
    setDetectionRunning(true)
    setTimeout(() => {
      setDetectionRunning(false)
      setDetectionDone(true)
    }, 1400)
  }

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Save patient inputs and active profile for the results and report pages
    sessionStorage.setItem('spinelit_active_profile', activeProfileId)
    sessionStorage.setItem('spinelit_patient_data', JSON.stringify({
      patientName: patientName || activeProfile.patient.name,
      age: age || String(activeProfile.patient.age),
      gender: gender || activeProfile.patient.gender,
      selectedSymptoms,
      symptomDuration,
      severity,
      notes,
      sittingDuration,
      activityLevel,
      workType,
      mobilityLimit,
      scanType,
    }))

    if (uploadedPreview) {
      try {
        sessionStorage.setItem('spinelit_uploaded_image', uploadedPreview)
        if (uploadedFile) sessionStorage.setItem('spinelit_uploaded_filename', uploadedFile.name)
      } catch (e) {
        console.warn(e)
      }
    }

    const steps = [
      { p: 15, delay: 500 }, { p: 32, delay: 900 }, { p: 55, delay: 1300 },
      { p: 73, delay: 1700 }, { p: 90, delay: 2200 }, { p: 100, delay: 2700 },
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
    borderRadius: '20px', padding: '28px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  }

  const labelStyle = {
    display: 'block', fontSize: '13px', fontWeight: 600,
    color: 'var(--text-dark)', marginBottom: '8px',
  }

  const sampleBadge = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em',
    padding: '3px 10px', borderRadius: '999px',
    background: 'rgba(133,57,83,0.12)', color: 'var(--primary)',
    marginLeft: '10px', verticalAlign: 'middle',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1300px' }} className="animate-fadeIn">

      {/* Keyframes */}
      <style>{`
        @keyframes spScanBar {
          0% { width: 0%; margin-left: 0; }
          50% { width: 70%; margin-left: 15%; }
          100% { width: 0%; margin-left: 100%; }
        }
        @keyframes spPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.8); }
        }
      `}</style>

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
                margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(133,57,83,0.3)',
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
                    fontSize: '13px', fontWeight: step.active ? 600 : 500,
                    color: step.active ? 'var(--text-dark)' : 'var(--text-muted)',
                  }}>Agent {i + 1} -- {step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* ── Image Upload ──────────────────────────────────────────────────── */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ImagePlus size={20} color="var(--primary)" /> Upload Medical Image
          </h3>

          {uploadedPreview ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Header bar with scan details, condition badges, and case switcher */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px', background: 'var(--bg-warm)', borderRadius: '14px',
                border: '1.5px solid rgba(133,57,83,0.18)', flexWrap: 'wrap', gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    background: 'rgba(0,191,255,0.15)', border: '1px solid rgba(0,191,255,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Layers size={18} color="#00BFFF" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)' }}>
                        {activeProfile.title}
                      </p>
                      <span style={{
                        fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px',
                        background: 'rgba(133,57,83,0.12)', color: 'var(--primary)', border: '1px solid rgba(133,57,83,0.25)'
                      }}>
                        {activeProfile.badge}
                      </span>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Condition: <strong style={{ color: 'var(--text-dark)' }}>{activeProfile.condition}</strong> · File: {uploadedFile?.name || activeProfile.fileName}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {/* Case switch selector pills */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-card)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(133,57,83,0.15)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, padding: '0 6px' }}>Switch:</span>
                    {Object.values(SPINE_PROFILES).map(prof => (
                      <button
                        key={prof.id}
                        type="button"
                        onClick={() => handleSelectProfile(prof.id)}
                        style={{
                          padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
                          border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                          background: activeProfileId === prof.id ? 'var(--primary)' : 'transparent',
                          color: activeProfileId === prof.id ? '#FFFFFF' : 'var(--text-muted)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {prof.id === 'lumbar_lateral' ? 'L4/L5 Spondylo (User)' :
                         prof.id === 'lumbar_ap' ? 'L4/L5 DDD (AP)' :
                         prof.id === 'sagittal_mri' ? 'DDD & Extrusion (MRI)' : 'L5/S1 Spondylo & DDD'}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      padding: '6px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
                      background: 'var(--bg-card)', border: '1px solid rgba(133,57,83,0.2)',
                      color: 'var(--text-dark)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                      fontFamily: 'inherit'
                    }}
                  >
                    <ImagePlus size={13} /> Replace Image
                  </button>
                  <button
                    onClick={() => { setUploadedFile(null); setUploadedPreview(null); setDetectionDone(false) }}
                    style={{
                      padding: '6px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                      color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                      fontFamily: 'inherit'
                    }}
                  >
                    <X size={13} /> Remove
                  </button>
                </div>
              </div>

              {/* Plotted Spine Visualizer directly on top of the image */}
              <div style={{ position: 'relative' }}>
                {detectionRunning ? (
                  <div style={{
                    position: 'relative', borderRadius: '16px', overflow: 'hidden',
                    background: '#030712', border: '1.5px solid rgba(0, 191, 255, 0.3)',
                    maxHeight: '540px', display: 'flex', justifyContent: 'center', alignItems: 'center'
                  }}>
                    <img
                      src={uploadedPreview}
                      alt="Spine Radiograph"
                      style={{ width: '100%', maxHeight: '540px', objectFit: 'contain', filter: 'brightness(0.7)' }}
                    />
                    {/* Active Laser Scanning Beam */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'radial-gradient(circle at center, transparent 30%, rgba(3,7,18,0.75) 100%)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px'
                    }}>
                      <div style={{
                        width: '60px', height: '60px', borderRadius: '18px',
                        background: 'rgba(0,191,255,0.18)', border: '1.5px solid rgba(0,191,255,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 30px rgba(0,191,255,0.3)',
                        animation: 'spPulse 1.4s ease-in-out infinite'
                      }}>
                        <Brain size={28} color="#00D2FF" />
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '15px', fontWeight: 700, color: '#00D2FF', letterSpacing: '0.02em', marginBottom: '8px' }}>
                          Detecting Lumbar Anatomy & Calibrating Landmarks...
                        </p>
                        <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '14px' }}>
                          Target: {activeProfile.condition} · Segmenting L1–S1
                        </p>
                        <div style={{ width: '220px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden', margin: '0 auto' }}>
                          <div style={{
                            height: '100%', borderRadius: '999px',
                            background: 'linear-gradient(90deg, #00D2FF, #84CC16, #F43F5E)',
                            animation: 'spScanBar 1.2s ease-in-out infinite'
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <SpineVisualizer
                    imageUrl={uploadedPreview}
                    profile={activeProfile}
                    showControls={true}
                    interactive={true}
                    maxHeight="540px"
                  />
                )}
              </div>

              {/* Landmark Summary Table / Metrics */}
              {detectionDone && (
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px',
                  padding: '16px', background: 'var(--bg-warm)', borderRadius: '14px',
                  border: '1px solid rgba(133,57,83,0.12)'
                }}>
                  <div style={{ textAlign: 'center', borderRight: '1px solid rgba(133,57,83,0.1)' }}>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Lumbar Vertebrae</p>
                    <p style={{ fontSize: '18px', fontWeight: 800, color: '#0284C7', marginTop: '2px' }}>{activeProfile.metrics.vertebraCount} Levels</p>
                    <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>L1, L2, L3, L4, L5</p>
                  </div>
                  <div style={{ textAlign: 'center', borderRight: '1px solid rgba(133,57,83,0.1)' }}>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Lumbar Discs</p>
                    <p style={{ fontSize: '18px', fontWeight: 800, color: '#16A34A', marginTop: '2px' }}>{activeProfile.metrics.discCount} Spaces</p>
                    <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>L1/L2 to L5/S1</p>
                  </div>
                  <div style={{ textAlign: 'center', borderRight: '1px solid rgba(133,57,83,0.1)' }}>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Mean Confidence</p>
                    <p style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>{activeProfile.metrics.meanConfidence}</p>
                    <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>High reliability</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Target Pathology</p>
                    <p style={{ fontSize: '17px', fontWeight: 800, color: '#E11D48', marginTop: '2px' }}>{activeProfile.metrics.targetAnomaly}</p>
                    <p style={{ fontSize: '10px', color: '#E11D48', fontWeight: 600 }}>{activeProfile.metrics.targetAnomalySub}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Dropzone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); handleFileDrop(e.dataTransfer.files[0]) }}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2.5px dashed ${dragging ? 'var(--primary)' : 'rgba(133, 57, 83, 0.25)'}`,
                  borderRadius: '16px', padding: '44px 32px', textAlign: 'center',
                  background: dragging ? 'rgba(133,57,83,0.06)' : 'var(--bg-warm)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(133, 57, 83, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Upload size={28} color="var(--primary)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-dark)' }}>
                      {dragging ? 'Drop spine image here' : 'Drag and drop your spine image here'}
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      or <span style={{ color: 'var(--primary)', fontWeight: 600 }}>browse files</span> (Supports: Lumbar X-ray, MRI, DICOM, JPEG, PNG)
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                      Calibrated for: <b>Degenerative Disc Disease (DDD)</b> & <b>Spondylolisthesis</b>
                    </p>
                  </div>
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
                  type="button"
                  onClick={() => {
                    setScanType(t)
                    if (t === 'MRI' && (activeProfileId === 'lumbar_ap' || activeProfileId === 'lumbar_lateral')) {
                      setActiveProfileId('sagittal_mri')
                      sessionStorage.setItem('spinelit_active_profile', 'sagittal_mri')
                    }
                  }}
                  style={{
                    padding: '10px 22px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                    border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                    background: scanType === t ? 'var(--primary)' : 'rgba(133, 57, 83, 0.12)',
                    color: scanType === t ? 'white' : 'var(--text-muted)',
                    boxShadow: scanType === t ? '0 4px 12px rgba(133,57,83,0.3)' : 'none',
                  }}
                >{t}</button>
              ))}
            </div>
          </div>

          {/* Condition Selector */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ ...labelStyle, margin: 0 }}>Target Pathology / Diagnosis Focus *</label>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Toggle to adjust AI landmark segmentation & conclusions
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                type="button"
                onClick={() => {
                  const targetId = scanType === 'MRI' ? 'sagittal_mri' : 'lumbar_ap'
                  setActiveProfileId(targetId)
                  sessionStorage.setItem('spinelit_active_profile', targetId)
                }}
                style={{
                  padding: '14px 16px', borderRadius: '12px', textAlign: 'left',
                  border: (activeProfileId === 'lumbar_ap' || activeProfileId === 'sagittal_mri')
                    ? '2px solid var(--primary)'
                    : '1px solid rgba(133,57,83,0.18)',
                  background: (activeProfileId === 'lumbar_ap' || activeProfileId === 'sagittal_mri')
                    ? 'rgba(133,57,83,0.08)'
                    : 'var(--bg-warm)',
                  cursor: 'pointer', transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-dark)' }}>
                    Degenerative Disc Disease (DDD)
                  </span>
                  {(activeProfileId === 'lumbar_ap' || activeProfileId === 'sagittal_mri') && (
                    <span style={{ fontSize: '10px', fontWeight: 800, background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '999px' }}>ACTIVE</span>
                  )}
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                  Disc space narrowing (6.1mm loss), reactive endplate sclerosis, L4-L5 disc desiccation
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  const targetId = 'lumbar_lateral'
                  setActiveProfileId(targetId)
                  sessionStorage.setItem('spinelit_active_profile', targetId)
                }}
                style={{
                  padding: '14px 16px', borderRadius: '12px', textAlign: 'left',
                  border: (activeProfileId === 'lumbar_lateral' || activeProfileId === 'lumbar_l5s1')
                    ? '2px solid var(--primary)'
                    : '1px solid rgba(133,57,83,0.18)',
                  background: (activeProfileId === 'lumbar_lateral' || activeProfileId === 'lumbar_l5s1')
                    ? 'rgba(133,57,83,0.08)'
                    : 'var(--bg-warm)',
                  cursor: 'pointer', transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-dark)' }}>
                    Spondylolisthesis
                  </span>
                  {(activeProfileId === 'lumbar_lateral' || activeProfileId === 'lumbar_l5s1') && (
                    <span style={{ fontSize: '10px', fontWeight: 800, background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '999px' }}>ACTIVE</span>
                  )}
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                  Meyerding Grade II slip, 8.4mm anterolisthesis step-off, pars interarticularis lysis
                </p>
              </button>
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <label style={labelStyle}>Analysis Region *</label>
            <select className="form-input" defaultValue="Lumbar Spine">
              <option>Select region</option>
              <option>Lumbar Spine</option>
              <option>Cervical Spine</option>
              <option>Thoracic Spine</option>
              <option>Full Spine</option>
            </select>
          </div>
        </div>

        {/* ── Patient Information ─────────────────────────────────────────── */}
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
              <input type="text" placeholder="Full name" className="form-input" value={patientName} onChange={e => setPatientName(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Age *</label>
              <input type="number" placeholder="Years" className="form-input" min="1" max="120" value={age} onChange={e => setAge(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Sex *</label>
              <select className="form-input" value={gender} onChange={e => setGender(e.target.value)}>
                <option value="">Select sex</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other / Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Clinical Symptoms ───────────────────────────────────────────── */}
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
                  border: selectedSymptoms.includes(s) ? '1.5px solid var(--primary)' : '1.5px solid rgba(133,57,83,0.25)',
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
              <select className="form-input" value={symptomDuration} onChange={e => setSymptomDuration(e.target.value)}>
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
              <select className="form-input" value={severity} onChange={e => setSeverity(e.target.value)}>
                <option>Select severity</option>
                <option>Mild (1-3)</option>
                <option>Moderate (4-6)</option>
                <option>Severe (7-10)</option>
              </select>
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '12px 16px', borderRadius: '12px',
            background: 'rgba(133,57,83,0.06)', border: '1px solid rgba(133,57,83,0.18)',
            marginBottom: '20px',
          }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', minWidth: '120px' }}>Pain Score (NRS)</span>
            <div style={{ flex: 1, display: 'flex', gap: '6px' }}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                <div key={n} style={{
                  flex: 1, height: '28px', borderRadius: '6px',
                  background: n <= SAMPLE.pain_severity
                    ? (n <= 3 ? '#059669' : n <= 6 ? '#D97706' : 'var(--primary)')
                    : 'rgba(133,57,83,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: 700,
                  color: n <= SAMPLE.pain_severity ? 'white' : 'var(--text-muted)',
                }}>
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
              className="form-input" rows={3} style={{ resize: 'vertical' }}
              value={notes} onChange={e => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* ── Lifestyle ───────────────────────────────────────────────────── */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Briefcase size={20} color="var(--primary)" /> Lifestyle and Functional Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Daily Sitting Duration</label>
              <select className="form-input" value={sittingDuration} onChange={e => setSittingDuration(e.target.value)}>
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
              <select className="form-input" value={activityLevel} onChange={e => setActivityLevel(e.target.value)}>
                <option>Select level</option>
                <option>Sedentary</option>
                <option>Lightly active</option>
                <option>Moderately active</option>
                <option>Very active</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Work / Activity Type</label>
              <select className="form-input" value={workType} onChange={e => setWorkType(e.target.value)}>
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
              <select className="form-input" value={mobilityLimit} onChange={e => setMobilityLimit(e.target.value)}>
                <option>Select option</option>
                <option>None</option>
                <option>Slight restriction</option>
                <option>Moderate restriction</option>
                <option>Significant restriction</option>
                <option>Unable to walk unaided</option>
              </select>
            </div>
          </div>
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
                {value === 'Yes' ? <AlertTriangle size={11} /> : <CheckCircle2 size={11} />}
                {label}: {value}
              </div>
            ))}
          </div>
        </div>

        {/* ── Previous Medical Data ───────────────────────────────────────── */}
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
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
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
