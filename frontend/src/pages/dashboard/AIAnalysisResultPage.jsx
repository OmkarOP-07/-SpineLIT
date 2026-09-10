import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Brain, AlertTriangle, FileText, Eye, TrendingUp,
  Clock, Activity, Zap, Download, ChevronRight, ChevronDown,
  CheckCircle2, Info, Shield, MessageSquare
} from 'lucide-react'
import spineMri from '../../assets/spine_mri.png'
import spineXray from '../../assets/spine_xray.png'

const RESULT = {
  id: 'ANA-2025-0234',
  patient: 'Rohit Kumar',
  patientId: 'PNT-2025-0487',
  scanType: 'X-ray Lumbar Spine',
  date: '20 May 2025',
  time: '10:35 AM',
  aiConfidence: 87,
  severityGrade: 'Grade II',
  progression: 'Changed',
  progressionColor: '#D97706',
  analysisTime: '14.2s',
  findings: [
    { feature: 'Disc height reduction', confidence: 92, region: 'L4-L5', severity: 'Moderate' },
    { feature: 'Spinal canal narrowing', confidence: 78, region: 'L3-L4', severity: 'Mild' },
    { feature: 'Degenerative vertebral changes', confidence: 71, region: 'L5-S1', severity: 'Mild' },
  ],
  ragContext: [
    { type: 'Similar Cases', content: 'Similar cases show disc height reduction at L4-L5 is commonly associated with age-related degenerative changes (n=1,247 cases).', source: 'Case Database' },
    { type: 'Clinical Guidelines', content: 'Grade II degeneration: monitor every 6 months. Consider MRI if neurological symptoms worsen.', source: 'Spine Guidelines, 2023' },
    { type: 'Relevant Knowledge', content: 'L4-L5 is the most commonly affected level in patients aged 50–65. Conservative management is first-line.', source: 'Clinical Knowledge Base' },
  ],
  recommendations: [
    { priority: 'high',   text: 'Consider MRI for detailed soft-tissue evaluation' },
    { priority: 'medium', text: 'Schedule follow-up in 3 months' },
    { priority: 'low',    text: 'Physical therapy evaluation recommended' },
  ],
  previous: { date: 'Nov 2024', severity: 'Grade I', confidence: 91 },
}

export default function AIAnalysisResultPage() {
  const [imageTab, setImageTab]     = useState('original')
  const [activeTab, setActiveTab]   = useState('findings')
  const [ragOpen, setRagOpen]       = useState(false)

  const cardStyle = {
    background: 'var(--bg-card)',
    border: '1.5px solid rgba(133, 57, 83, 0.15)',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  }

  const tabBtn = (id, label) => (
    <button
      key={id}
      onClick={() => setImageTab(id)}
      style={{
        padding: '8px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
        border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
        background: imageTab === id ? 'var(--primary)' : 'rgba(133,57,83,0.12)',
        color: imageTab === id ? 'white' : 'var(--text-muted)',
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px' }} className="animate-fadeIn">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            to="/dashboard/image-analysis"
            style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'var(--bg-card)', border: '1.5px solid rgba(133,57,83,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', color: 'var(--text-dark)',
            }}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark)' }}>AI Analysis Result</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '3px' }}>
              {RESULT.id} · {RESULT.patient} · {RESULT.date}, {RESULT.time}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{
            padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 600,
            background: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0',
          }}>
            ✓ Analysis Completed
          </span>
          <Link to="/dashboard/ai-generated-report" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> View Report
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {[
          {
            label: 'AI Assessment',
            value: `${RESULT.aiConfidence}%`,
            sub: 'Confidence Score',
            icon: Brain,
            color: 'var(--primary)',
            bg: 'rgba(133,57,83,0.1)',
            note: 'AI-assisted — not a final diagnosis',
          },
          {
            label: 'Severity Assessment',
            value: RESULT.severityGrade,
            sub: 'Degenerative Classification',
            icon: AlertTriangle,
            color: '#D97706',
            bg: '#FFFBEB',
            note: 'Based on imaging features detected',
          },
          {
            label: 'Progression',
            value: RESULT.progression,
            sub: 'Grade I → Grade II over 6 months',
            icon: TrendingUp,
            color: RESULT.progressionColor,
            bg: '#FFF8EC',
            note: 'Compared to previous imaging',
          },
        ].map(({ label, value, sub, icon: Icon, color, bg, note }) => (
          <div key={label} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={24} color={color} />
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{label}</p>
                <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>{sub}</p>
              </div>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '8px 12px', background: 'var(--bg-warm)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={12} /> {note}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' }}>

        {/* Left: Image + Explainability + Longitudinal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Medical Image Section */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Eye size={20} color="var(--primary)" /> Medical Image
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {tabBtn('original', 'Original')}
                {tabBtn('heatmap', 'Heatmap')}
                {tabBtn('overlay', 'Overlay')}
              </div>
            </div>

            <div style={{
              background: '#1A1A1A', borderRadius: '16px', overflow: 'hidden',
              border: '1px solid rgba(133,57,83,0.2)', position: 'relative', minHeight: '380px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {imageTab === 'original' && (
                <img src={spineXray} alt="X-ray Lumbar Spine" style={{ maxHeight: '380px', maxWidth: '100%', objectFit: 'contain' }} />
              )}
              {imageTab === 'heatmap' && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={spineXray} alt="Heatmap" style={{ maxHeight: '340px', objectFit: 'contain', filter: 'grayscale(40%)' }} />
                    <div style={{
                      position: 'absolute', inset: 0, borderRadius: '8px',
                      background: 'linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(245,158,11,0.15) 40%, transparent 80%)',
                    }} />
                  </div>
                </div>
              )}
              {imageTab === 'overlay' && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={spineXray} alt="Overlay" style={{ maxHeight: '340px', objectFit: 'contain' }} />
                    <div style={{
                      position: 'absolute', top: '30%', left: '35%', width: '30%', height: '25%',
                      border: '2px solid rgba(133,57,83,0.7)', borderRadius: '4px',
                      boxShadow: '0 0 16px rgba(133,57,83,0.4)',
                    }} />
                  </div>
                </div>
              )}
            </div>

            {imageTab !== 'original' && (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={12} />
                Highlighted regions indicate areas that contributed to the model prediction.
                This heatmap does not imply clinical causation.
              </p>
            )}
          </div>

          {/* AI Explanation */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Brain size={20} color="var(--primary)" /> AI Explanation
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Image Findings',       text: 'Disc height reduction at L4-L5 (92% confidence). Mild canal narrowing at L3-L4. Degenerative endplate changes at L5-S1.' },
                { label: 'Clinical Information', text: 'Patient age (54), prolonged sitting, moderate pain (5/10) for 3–6 months. Radiating pain reported.' },
                { label: 'Historical Context',   text: 'Previous imaging (Nov 2024) showed Grade I changes. Progression to Grade II over 6 months.' },
                { label: 'Prediction Reasoning', text: 'Disc morphology contributes 42%, bone density 28%, alignment 18%, clinical correlation 12% to the final severity score.' },
                { label: 'Confidence',           text: '87% overall confidence. Uncertainty is highest for canal narrowing assessment (78%).' },
              ].map(({ label, text }) => (
                <div key={label} style={{ padding: '14px 16px', background: 'var(--bg-warm)', borderRadius: '12px', border: '1px solid rgba(133,57,83,0.12)' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{label}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-dark)', lineHeight: '1.6' }}>{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={20} color="var(--primary)" /> Key Image Features
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {RESULT.findings.map(({ feature, confidence, region, severity }) => (
                <div key={feature} style={{ padding: '14px', background: 'var(--bg-warm)', borderRadius: '12px', border: '1px solid rgba(133,57,83,0.12)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)' }}>{feature}</span>
                      <span style={{
                        padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                        background: severity === 'Moderate' ? '#FEF3C7' : '#D1FAE5',
                        color: severity === 'Moderate' ? '#92400E' : '#065F46',
                        border: `1px solid ${severity === 'Moderate' ? '#FDE68A' : '#A7F3D0'}`,
                      }}>{severity}</span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>{confidence}%</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ flex: 1, height: '6px', background: 'rgba(133,57,83,0.15)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: 'var(--primary)', borderRadius: '999px', width: `${confidence}%` }} />
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0 }}>{region}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Longitudinal Comparison */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TrendingUp size={20} color="var(--primary)" /> Longitudinal Comparison
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '10px' }}>
                  Previous Record — {RESULT.previous.date}
                </p>
                <div style={{ background: 'var(--bg-warm)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(133,57,83,0.15)' }}>
                  <img src={spineMri} alt="Previous scan" style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block', opacity: 0.85 }} />
                  <div style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Severity</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#059669' }}>{RESULT.previous.severity}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Confidence</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>{RESULT.previous.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '10px' }}>
                  Current Record — {RESULT.date}
                </p>
                <div style={{ background: 'var(--bg-warm)', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid rgba(133,57,83,0.3)' }}>
                  <img src={spineXray} alt="Current scan" style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />
                  <div style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Severity</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#D97706' }}>{RESULT.severityGrade}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Confidence</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>{RESULT.aiConfidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trend */}
            <div style={{ padding: '14px 16px', background: 'rgba(217,119,6,0.08)', borderRadius: '12px', border: '1px solid rgba(217,119,6,0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <AlertTriangle size={16} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#92400E', marginBottom: '3px' }}>
                    Progression Detected
                  </p>
                  <p style={{ fontSize: '13px', color: '#92400E' }}>
                    Severity increased from Grade I to Grade II over 6 months. Recommend closer monitoring every 3 months.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RAG Context (Collapsible) */}
          <div style={cardStyle}>
            <button
              onClick={() => setRagOpen(o => !o)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit',
              }}
            >
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={20} color="var(--primary)" /> Retrieved Clinical Context
              </h3>
              <ChevronDown size={20} color="var(--text-muted)" style={{ transform: ragOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {ragOpen && (
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '10px 14px', background: 'var(--bg-warm)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Info size={13} />
                  Retrieved information is provided as supporting clinical context, not as an independent diagnosis.
                </p>
                {RESULT.ragContext.map(({ type, content, source }) => (
                  <div key={type} style={{ padding: '14px 16px', background: 'var(--bg-warm)', borderRadius: '12px', border: '1px solid rgba(133,57,83,0.12)' }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{type}</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-dark)', lineHeight: '1.6', marginBottom: '6px' }}>{content}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Source: {source}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Tab Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Tab Switcher */}
          <div style={{ display: 'flex', gap: '6px', padding: '5px', background: 'var(--bg-warm)', borderRadius: '12px' }}>
            {[
              { id: 'findings',        label: 'Findings' },
              { id: 'rag',             label: 'Context' },
              { id: 'recommendations', label: 'Decision' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                  background: activeTab === id ? 'var(--primary)' : 'transparent',
                  color: activeTab === id ? 'white' : 'var(--text-muted)',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ ...cardStyle, minHeight: '420px' }}>
            {activeTab === 'findings' && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '16px' }}>Detailed Findings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {RESULT.findings.map(({ feature, confidence, severity }) => (
                    <div key={feature} style={{ padding: '14px', background: 'var(--bg-warm)', borderRadius: '12px', border: '1px solid rgba(133,57,83,0.12)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                          background: severity === 'Moderate' ? '#FEF3C7' : '#D1FAE5',
                          color: severity === 'Moderate' ? '#92400E' : '#065F46',
                        }}>{severity}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{confidence}% confidence</span>
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--text-dark)', fontWeight: 600 }}>{feature}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '16px', padding: '12px 14px', background: 'var(--bg-warm)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={14} color="var(--text-muted)" />
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Analysis time: {RESULT.analysisTime}</span>
                </div>
              </div>
            )}

            {activeTab === 'rag' && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '16px' }}>Clinical Intelligence (RAG)</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {RESULT.ragContext.map(({ type, content, source }) => (
                    <div key={type} style={{ padding: '14px', background: 'var(--bg-warm)', borderRadius: '12px', border: '1px solid rgba(133,57,83,0.12)' }}>
                      <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{type}</p>
                      <p style={{ fontSize: '13px', color: 'var(--text-dark)', lineHeight: '1.6', marginBottom: '6px' }}>{content}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>📚 {source}</p>
                    </div>
                  ))}
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '10px', background: 'var(--bg-warm)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Info size={12} />
                    Retrieved context is supporting information only, not clinical guidance.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '16px' }}>Clinical Decision Support</h3>
                <div style={{ marginBottom: '16px', padding: '14px 16px', background: 'rgba(133,57,83,0.08)', borderRadius: '14px', border: '1px solid rgba(133,57,83,0.2)' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>AI Recommendation</p>
                  <p style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-dark)' }}>Further Evaluation Recommended</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {RESULT.recommendations.map(({ priority, text }) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 14px', background: 'var(--bg-warm)', borderRadius: '12px', border: '1px solid rgba(133,57,83,0.12)' }}>
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, marginTop: '5px',
                        background: priority === 'high' ? '#EF4444' : priority === 'medium' ? '#F59E0B' : '#10B981',
                      }} />
                      <p style={{ fontSize: '13px', color: 'var(--text-dark)' }}>{text}</p>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '12px 14px', background: 'rgba(16,185,129,0.08)', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.2)', marginBottom: '16px' }}>
                  <p style={{ fontSize: '12px', color: '#065F46', display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: '1.5' }}>
                    <Shield size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                    AI-assisted recommendation — final clinical decision remains with the qualified healthcare professional.
                  </p>
                </div>
                <Link to="/dashboard/ai-generated-report" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '10px' }}>
                  <FileText size={16} /> Generate Full Report
                </Link>
                <Link to="/dashboard/doctor-feedback" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                  <MessageSquare size={16} /> Provide Feedback
                </Link>
              </div>
            )}
          </div>

          {/* Doctor Review CTA */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            borderRadius: '20px', padding: '24px', color: 'white',
          }}>
            <Zap size={24} color="rgba(255,255,255,0.4)" style={{ marginBottom: '12px' }} />
            <p style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>Doctor Review Required</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '16px', lineHeight: '1.5' }}>
              This AI result requires clinical validation before generating the final report.
            </p>
            <Link
              to="/dashboard/doctor-feedback"
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '12px', background: 'white', color: 'var(--primary)',
                borderRadius: '12px', fontSize: '14px', fontWeight: 700,
                textDecoration: 'none', transition: 'all 0.2s',
              }}
            >
              Proceed to Feedback <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
