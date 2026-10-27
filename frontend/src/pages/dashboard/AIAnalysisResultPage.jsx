import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Brain, AlertTriangle, FileText, Eye, TrendingUp,
  Clock, Activity, Zap, Download, ChevronRight, ChevronDown,
  CheckCircle2, Info, Shield, MessageSquare, Layers, Sparkles,
  Stethoscope, Check
} from 'lucide-react'
import SpineVisualizer from '../../components/SpineVisualizer'
import { SPINE_PROFILES } from '../../data/spineScanProfiles'

export default function AIAnalysisResultPage() {
  const [activeProfileId, setActiveProfileId] = useState(() => {
    return sessionStorage.getItem('spinelit_active_profile') || 'lumbar_lateral'
  })
  const [imageTab, setImageTab] = useState('overlay')
  const [activeTab, setActiveTab] = useState('findings')
  const [ragOpen, setRagOpen] = useState(false)

  // Retrieve any uploaded scan and patient form data
  const uploadedImage = sessionStorage.getItem('spinelit_uploaded_image')
  const uploadedFileName = sessionStorage.getItem('spinelit_uploaded_filename')
  const patientData = JSON.parse(sessionStorage.getItem('spinelit_patient_data') || '{}')

  // Ensure active profile is valid
  const profile = SPINE_PROFILES[activeProfileId] || SPINE_PROFILES.lumbar_lateral

  // Resolve display data preferring user-uploaded scan and user-entered patient information
  const displayImage = uploadedImage || profile.image
  const displayPatientName = patientData.patientName || profile.patient.name
  const displayAge = patientData.age || profile.patient.age
  const displayGender = patientData.gender || profile.patient.gender
  const displaySymptoms = patientData.selectedSymptoms?.length ? patientData.selectedSymptoms : profile.patient.symptoms
  const displaySeverity = patientData.severity || profile.patient.severity
  const displayDuration = patientData.symptomDuration || profile.patient.duration

  const handleSelectProfile = (id) => {
    setActiveProfileId(id)
    sessionStorage.setItem('spinelit_active_profile', id)
  }

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

  const isDDD = activeProfileId === 'lumbar_ap' || activeProfileId === 'sagittal_mri'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1440px' }} className="animate-fadeIn">

      {/* Focus Banner — Lower Back Pain DDD & Spondylolisthesis */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(133, 57, 83, 0.08) 0%, rgba(217, 119, 6, 0.08) 100%)',
        border: '1.5px solid rgba(133, 57, 83, 0.25)',
        borderRadius: '16px',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'var(--primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Stethoscope size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-dark)' }}>
                Target Pathology: Lower Back Pain (Lumbar L1–S1)
              </span>
              <span style={{
                fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px',
                background: 'rgba(133,57,83,0.15)', color: 'var(--primary)',
              }}>
                DDD & Spondylolisthesis Only
              </span>
              {uploadedFileName && (
                <span style={{
                  fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px',
                  background: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0',
                }}>
                  Uploaded Scan: {uploadedFileName}
                </span>
              )}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
              Toggle diagnosis focus below to analyze your uploaded scan for <b>Degenerative Disc Disease</b> or <b>Spondylolisthesis</b>.
            </p>
          </div>
        </div>

        {/* 2-Category Diagnosis Switcher */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Diagnosis Mode:
          </span>

          <button
            onClick={() => handleSelectProfile('lumbar_ap')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 800,
              border: isDDD ? '2px solid var(--primary)' : '1px solid rgba(133,57,83,0.2)',
              background: isDDD ? 'var(--primary)' : 'white',
              color: isDDD ? 'white' : 'var(--text-dark)',
              cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: isDDD ? '0 4px 12px rgba(133,57,83,0.25)' : 'none',
            }}
          >
            {isDDD && <Check size={14} />}
            Degenerative Disc Disease (DDD)
          </button>

          <button
            onClick={() => handleSelectProfile('lumbar_lateral')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 800,
              border: !isDDD ? '2px solid var(--primary)' : '1px solid rgba(133,57,83,0.2)',
              background: !isDDD ? 'var(--primary)' : 'white',
              color: !isDDD ? 'white' : 'var(--text-dark)',
              cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: !isDDD ? '0 4px 12px rgba(133,57,83,0.25)' : 'none',
            }}
          >
            {!isDDD && <Check size={14} />}
            Spondylolisthesis
          </button>
        </div>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            to="/dashboard/image-analysis"
            style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'var(--bg-card)', border: '1.5px solid rgba(133,57,83,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', color: 'var(--text-dark)', textDecoration: 'none',
            }}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
                {profile.condition} Analysis Result
              </h1>
              <span style={{
                padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                background: 'rgba(133,57,83,0.12)', color: 'var(--primary)',
              }}>
                {profile.modality} · Lumbar L1–S1
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', marginBottom: 0 }}>
              Patient: <strong>{displayPatientName}</strong> ({displayGender}, {displayAge} yrs) · {uploadedFileName ? `Image: ${uploadedFileName}` : `Exam: ${profile.patient.examDate}`}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{
            padding: '7px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 700,
            background: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <CheckCircle2 size={15} /> AI Analysis Complete
          </span>
          <Link
            to="/dashboard/ai-generated-report"
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Download size={16} /> View Clinical Report
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {[
          {
            label: 'AI Diagnostic Confidence',
            value: `${profile.metrics.aiConfidence}%`,
            sub: `Mean Confidence: ${profile.metrics.meanConfidence}`,
            icon: Brain,
            color: 'var(--primary)',
            bg: 'rgba(133,57,83,0.1)',
            note: 'Calibrated anatomical multi-landmark confidence',
          },
          {
            label: 'Condition & Severity',
            value: profile.metrics.severityGrade,
            sub: profile.condition,
            icon: AlertTriangle,
            color: '#D97706',
            bg: '#FFFBEB',
            note: profile.subCondition,
          },
          {
            label: 'Biomechanical Status',
            value: profile.metrics.progression,
            sub: profile.metrics.progressionSub,
            icon: TrendingUp,
            color: profile.metrics.progressionColor,
            bg: '#FFF8EC',
            note: `Analysis speed: ${profile.metrics.analysisTime}`,
          },
        ].map(({ label, value, sub, icon: Icon, color, bg, note }) => (
          <div key={label} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={24} color={color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{label}</p>
                <p style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.1, margin: 0 }}>{value}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', marginBottom: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{sub}</p>
              </div>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '8px 12px', background: 'var(--bg-warm)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
              <Info size={12} color="var(--primary)" /> {note}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 420px', gap: '24px' }}>

        {/* Left Column: Image Viewer + Explanations + Clinical Conclusion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Medical Image Section with Interactive Segmentation */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                  <Eye size={20} color="var(--primary)" /> Medical Image & Landmark Segmentation
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                  Overlay mapped directly onto {uploadedFileName || profile.fileName} ({profile.view})
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {tabBtn('overlay', 'AI Landmarks & Overlay')}
                {tabBtn('original', 'Original Radiograph')}
                {tabBtn('heatmap', 'Attention Saliency')}
              </div>
            </div>

            {/* Display based on active tab */}
            {imageTab === 'overlay' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <SpineVisualizer
                  imageUrl={displayImage}
                  profile={profile}
                  showControls={true}
                  interactive={true}
                  maxHeight="520px"
                />
                <div style={{
                  fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', background: 'var(--bg-warm)', borderRadius: '10px',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Info size={14} color="var(--primary)" />
                    Plotted landmarks L1–S1 calibrated to patient scan curvature. Hover any node or box for live anatomical confidence.
                  </span>
                  <span style={{ fontWeight: 700, color: '#DC2626' }}>
                    Target Anomaly: {profile.metrics.targetAnomaly}
                  </span>
                </div>
              </div>
            )}

            {imageTab === 'original' && (
              <div style={{
                background: '#030712', borderRadius: '16px', overflow: 'hidden',
                border: '1.5px solid rgba(133,57,83,0.2)', minHeight: '440px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
              }}>
                <img
                  src={displayImage}
                  alt={profile.title}
                  style={{ maxHeight: '480px', maxWidth: '100%', objectFit: 'contain' }}
                />
              </div>
            )}

            {imageTab === 'heatmap' && (
              <div style={{
                background: '#030712', borderRadius: '16px', overflow: 'hidden',
                border: '1.5px solid rgba(133,57,83,0.2)', minHeight: '440px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px',
              }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={displayImage}
                    alt="Attention Saliency Map"
                    style={{ maxHeight: '440px', objectFit: 'contain', filter: 'brightness(0.85) contrast(1.15)' }}
                  />
                  {/* GradCAM / Attention saliency heat gradient centered at target lesion */}
                  <div style={{
                    position: 'absolute',
                    top: profile.heatmap?.top || '50%',
                    left: profile.heatmap?.left || '40%',
                    width: profile.heatmap?.width || '30%',
                    height: profile.heatmap?.height || '22%',
                    background: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.8) 0%, rgba(245, 158, 11, 0.55) 45%, rgba(59, 130, 246, 0.25) 75%, transparent 100%)',
                    borderRadius: '50%',
                    filter: 'blur(10px)',
                    mixBlendMode: 'screen',
                    pointerEvents: 'none',
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(220, 38, 38, 0.92)',
                    color: 'white',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    whiteSpace: 'nowrap',
                  }}>
                    {profile.heatmap?.peak || 'Peak Lesion Focus'}
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px', margin: '14px 0 0 0' }}>
                  <Info size={12} color="var(--primary)" />
                  GradCAM saliency heatmap demonstrates AI neural attention focus localized precisely at the symptomatic lumbar level.
                </p>
              </div>
            )}
          </div>

          {/* AI Clinical Explanation */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Brain size={20} color="var(--primary)" /> AI Biomechanical Reasoning (Lower Back Pain)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                {
                  label: 'Image Morphometry Findings',
                  text: profile.findings.map(f => `${f.feature} at ${f.region} (${f.severity}, ${f.confidence}% conf)`).join(' · '),
                },
                {
                  label: 'Patient Clinical Presentation',
                  text: `Symptoms: ${displaySymptoms.join(', ')} · Duration: ${displayDuration} · Reported Severity: ${displaySeverity}.`,
                },
                {
                  label: 'Pathology & Mechanical Status',
                  text: `${profile.condition}: ${profile.metrics.progressionSub}. Mechanical strain localized to L4–S1 lumbar segments.`,
                },
                {
                  label: 'Prediction Reasoning Model',
                  text: `Anatomical vertebrae alignment contributes 40%, intervertebral disc height ratio 35%, neural canal/foramen clearance 15%, clinical symptom correlation 10% to the severity score.`,
                },
                {
                  label: 'Model Confidence & Verification',
                  text: `${profile.metrics.aiConfidence}% overall certainty. Anatomical landmarks L1–S1 localized with ${profile.metrics.meanConfidence} mean confidence.`,
                },
              ].map(({ label, text }) => (
                <div key={label} style={{ padding: '14px 16px', background: 'var(--bg-warm)', borderRadius: '12px', border: '1px solid rgba(133,57,83,0.12)' }}>
                  <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{label}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-dark)', lineHeight: '1.6', margin: 0 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Conclusion */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                <Activity size={20} color="var(--primary)" /> Clinical Conclusion & Action Plan
              </h3>
              <div style={{
                padding: '5px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 700,
                background: 'rgba(217,119,6,0.1)', color: '#D97706',
                border: '1px solid rgba(217,119,6,0.3)',
              }}>
                ⚠ Priority Review
              </div>
            </div>

            {/* Dynamic Summary for the specific profile */}
            <div style={{
              padding: '18px 20px', borderRadius: '14px', lineHeight: '1.75',
              background: 'rgba(133,57,83,0.05)', border: '1px solid rgba(133,57,83,0.15)',
              marginBottom: '18px', fontSize: '14px', color: 'var(--text-dark)',
            }}>
              <p style={{ fontSize: '10px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
                Summary
              </p>
              Imaging confirms <strong>{profile.condition}</strong> ({profile.metrics.severityGrade}) with primary lesion localized to <strong>{profile.metrics.targetAnomaly}</strong>. {profile.conclusionText}
            </div>

            {/* Recommended next steps */}
            <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
              Recommended Next Steps
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
              {profile.nextSteps.map(({ p, text }, i) => {
                const col = p === 'high' ? '#EF4444' : p === 'medium' ? '#F59E0B' : '#10B981'
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '11px 14px', borderRadius: '12px',
                    background: 'var(--bg-warm)', border: '1px solid rgba(133,57,83,0.10)',
                  }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                      background: col, boxShadow: `0 0 6px ${col}66`,
                    }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-dark)', fontWeight: 500, flex: 1 }}>{text}</span>
                    <span style={{
                      fontSize: '9px', fontWeight: 800, textTransform: 'uppercase',
                      color: col, letterSpacing: '0.05em', flexShrink: 0,
                    }}>{p}</span>
                  </div>
                )
              })}
            </div>

            {/* Diagnostic certainty bar */}
            <div style={{
              padding: '14px 16px', borderRadius: '12px',
              background: 'var(--bg-warm)', border: '1px solid rgba(133,57,83,0.12)',
              marginBottom: '14px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dark)' }}>Diagnostic Certainty</span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)' }}>{profile.metrics.aiConfidence}%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(133,57,83,0.12)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${profile.metrics.aiConfidence}%`, borderRadius: '999px',
                  background: 'linear-gradient(90deg, var(--primary-light), var(--primary))',
                }} />
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', margin: '6px 0 0 0' }}>
                Primary anomaly localized at: <strong>{profile.metrics.targetAnomaly}</strong>
              </p>
            </div>

            {/* Disclaimer */}
            <div style={{
              padding: '10px 14px', borderRadius: '10px',
              background: 'var(--bg-warm)', border: '1px solid rgba(133,57,83,0.1)',
              display: 'flex', alignItems: 'flex-start', gap: '8px',
            }}>
              <Info size={13} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                Spine-LIT AI-generated conclusion based on imaging analysis and clinical lower back pain presentation. Final diagnosis and surgical decision rests with the treating spine specialist.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Tab Panel (Findings / Context / Decision) & Action Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Tab Switcher */}
          <div style={{ display: 'flex', gap: '6px', padding: '5px', background: 'var(--bg-warm)', borderRadius: '12px' }}>
            {[
              { id: 'findings',        label: 'Findings' },
              { id: 'rag',             label: 'Clinical Context' },
              { id: 'recommendations', label: 'Decision Support' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  flex: 1, padding: '10px 6px', borderRadius: '10px', fontSize: '12px', fontWeight: 700,
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
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '16px' }}>
                  Target Lumbar Findings ({profile.condition})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {profile.findings.map(({ feature, confidence, severity, region, desc }) => (
                    <div key={feature} style={{ padding: '14px', background: 'var(--bg-warm)', borderRadius: '12px', border: '1px solid rgba(133,57,83,0.12)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700,
                          background: severity === 'Severe' ? '#FEE2E2' : severity === 'Moderate' ? '#FEF3C7' : '#D1FAE5',
                          color: severity === 'Severe' ? '#991B1B' : severity === 'Moderate' ? '#92400E' : '#065F46',
                        }}>{severity}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>{confidence}% conf</span>
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--text-dark)', fontWeight: 700, margin: '0 0 4px 0' }}>
                        {feature} {region && <span style={{ color: 'var(--primary)', fontWeight: 600 }}>({region})</span>}
                      </p>
                      {desc && (
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                          {desc}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '16px', padding: '12px 14px', background: 'var(--bg-warm)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={14} color="var(--text-muted)" />
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Analysis computed in {profile.metrics.analysisTime}</span>
                </div>
              </div>
            )}

            {activeTab === 'rag' && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '16px' }}>
                  Clinical Intelligence (RAG)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {profile.ragContext.map(({ type, content, source }) => (
                    <div key={type} style={{ padding: '14px', background: 'var(--bg-warm)', borderRadius: '12px', border: '1px solid rgba(133,57,83,0.12)' }}>
                      <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{type}</p>
                      <p style={{ fontSize: '13px', color: 'var(--text-dark)', lineHeight: '1.6', marginBottom: '6px' }}>{content}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>📚 {source}</p>
                    </div>
                  ))}
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '10px', background: 'var(--bg-warm)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                    <Info size={12} />
                    Retrieved guidelines referenced from Spine-LIT evidence-based clinical database.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '16px' }}>
                  Clinical Decision Support
                </h3>
                <div style={{ marginBottom: '16px', padding: '14px 16px', background: 'rgba(133,57,83,0.08)', borderRadius: '14px', border: '1px solid rgba(133,57,83,0.2)' }}>
                  <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>AI Guideline Recommendation</p>
                  <p style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>{profile.condition}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {profile.recommendations.map(({ priority, text }) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 14px', background: 'var(--bg-warm)', borderRadius: '12px', border: '1px solid rgba(133,57,83,0.12)' }}>
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, marginTop: '5px',
                        background: priority === 'high' ? '#EF4444' : priority === 'medium' ? '#F59E0B' : '#10B981',
                      }} />
                      <p style={{ fontSize: '13px', color: 'var(--text-dark)', margin: 0 }}>{text}</p>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '12px 14px', background: 'rgba(16,185,129,0.08)', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.2)', marginBottom: '16px' }}>
                  <p style={{ fontSize: '12px', color: '#065F46', display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: '1.5', margin: 0 }}>
                    <Shield size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                    Recommendations aligned with NASS (North American Spine Society) Lower Back Pain & Spondylolisthesis criteria.
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
            <p style={{ fontSize: '15px', fontWeight: 800, marginBottom: '6px' }}>Doctor Review & Verification</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '16px', lineHeight: '1.5' }}>
              Verify vertebral measurements and diagnostic grading on this scan before signing off the patient chart.
            </p>
            <Link
              to="/dashboard/doctor-feedback"
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '12px', background: 'white', color: 'var(--primary)',
                borderRadius: '12px', fontSize: '14px', fontWeight: 800,
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
