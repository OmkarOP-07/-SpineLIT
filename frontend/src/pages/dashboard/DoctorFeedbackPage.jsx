import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Brain, User, CheckCircle2, AlertTriangle, FileText, Activity, 
  MessageSquare, History, ChevronRight, XCircle, Check, Send, Eye,
  Maximize2, X, Shield, Sparkles, Layers
} from 'lucide-react'
import { submitFeedback } from '../../services/feedbackService'
import { SPINE_PROFILES } from '../../data/spineScanProfiles'

const DEFAULT_PENDING_CASE = {
  id: 'ANA-2025-0234',
  patient: 'Rohit Kumar (PNT-2025-0487)',
  patientName: 'Rohit Kumar',
  patientId: 'PNT-2025-0487',
  scanType: 'X-ray Lumbar Spine (Lateral View)',
  scanImage: '/sample_lateral_xray.jpg',
  date: '20 May 2025',
  aiPrediction: 'Grade II',
  aiConfidence: '87%',
  aiRecommendation: 'Further Evaluation Recommended (MRI)',
  findings: 'Disc height reduction at L4-L5. Mild canal narrowing.',
}

export default function DoctorFeedbackPage() {
  const [feedbackState, setFeedbackState] = useState(null) // 'accept' | 'correct' | 'submitted'
  const [submittedEntry, setSubmittedEntry] = useState(null)
  const [showScanModal, setShowScanModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Resolve case from session if available, else use default case
  const activeCase = useMemo(() => {
    try {
      const sessionPatient = JSON.parse(sessionStorage.getItem('spinelit_patient_data') || '{}')
      const sessionProfileId = sessionStorage.getItem('spinelit_active_profile')
      const sessionUploadedImage = sessionStorage.getItem('spinelit_uploaded_image')
      const profile = SPINE_PROFILES[sessionProfileId]

      if (sessionPatient.patientName || sessionUploadedImage) {
        return {
          id: 'ANA-2025-0235',
          patient: `${sessionPatient.patientName || 'Rohit Kumar'} (${sessionPatient.patientId || 'PNT-2025-0487'})`,
          patientName: sessionPatient.patientName || 'Rohit Kumar',
          patientId: sessionPatient.patientId || 'PNT-2025-0487',
          scanType: profile ? `${profile.modality || 'X-Ray'} ${profile.view || 'Lateral'}` : 'X-ray Lumbar Spine',
          scanImage: sessionUploadedImage || profile?.image || '/sample_lateral_xray.jpg',
          date: 'Today, ' + new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          aiPrediction: profile?.metrics?.severityGrade?.includes('Grade I') ? 'Grade I' : 'Grade II',
          aiConfidence: `${profile?.metrics?.aiConfidence || 87}%`,
          aiRecommendation: 'Further Evaluation Recommended (MRI & Physical Therapy)',
          findings: profile?.metrics?.targetAnomalySub || 'Disc height reduction at L4-L5. Mild canal narrowing.',
        }
      }
    } catch (e) {
      console.warn('Error reading session data:', e)
    }
    return DEFAULT_PENDING_CASE
  }, [])

  const [formData, setFormData] = useState({
    severity: activeCase.aiPrediction,
    recommendation: activeCase.aiRecommendation,
    comment: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const decision = feedbackState

    const result = await submitFeedback({
      caseId: activeCase.id,
      patientName: activeCase.patientName,
      patientId: activeCase.patientId,
      scanType: activeCase.scanType,
      scanImage: activeCase.scanImage,
      aiPrediction: activeCase.aiPrediction,
      confidence: parseInt(activeCase.aiConfidence) || 87,
      decision,
      status: decision === 'accept' ? 'Accepted' : 'Corrected',
      doctorCorrection: decision === 'accept' ? activeCase.aiPrediction : formData.severity,
      recommendation: decision === 'accept' ? activeCase.aiRecommendation : formData.recommendation,
      comment: formData.comment || (decision === 'accept' ? 'Clinical evaluation validated by physician.' : 'Diagnostic severity corrected by clinician.'),
      findings: activeCase.findings,
    })

    setIsSubmitting(false)
    setSubmittedEntry(result.item || result)
    setFeedbackState('submitted')
  }

  const cardStyle = {
    background: 'var(--bg-card)',
    border: '1.5px solid rgba(133, 57, 83, 0.15)',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  }

  if (feedbackState === 'submitted') {
    return (
      <div className="animate-fadeIn" style={{ maxWidth: '720px', margin: '40px auto', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '4px solid #A7F3D0' }}>
          <CheckCircle2 size={40} color="#059669" />
        </div>
        <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '10px' }}>
          Doctor Feedback Recorded
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
          Your verified clinical evaluation has been recorded into the continuous learning system.
        </p>

        {/* Temporary Learning Memory Callout Card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1.5px solid #10B981',
          borderRadius: '18px',
          padding: '20px 24px',
          marginBottom: '28px',
          textAlign: 'left',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.12)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Temporary In-Memory Buffer Active
              </span>
            </div>
            <span style={{ fontSize: '12px', background: '#D1FAE5', color: '#065F46', padding: '3px 10px', borderRadius: '999px', fontWeight: 600 }}>
              Auto-purges in 24 hours
            </span>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div 
              onClick={() => setShowScanModal(true)}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1.5px solid rgba(133,57,83,0.2)',
                background: '#030712',
                cursor: 'pointer',
                position: 'relative',
                flexShrink: 0,
              }}
              title="Click to expand scan"
            >
              <img 
                src={activeCase.scanImage} 
                alt="Patient Scan" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'rgba(0,0,0,0.6)', padding: '2px', textAlign: 'center',
                fontSize: '10px', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px'
              }}>
                <Eye size={10} /> Scan
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-dark)' }}>{activeCase.patient}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{submittedEntry?.id || 'FB-2025'}</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                {activeCase.scanType} · AI: <strong style={{ color: 'var(--primary)' }}>{activeCase.aiPrediction}</strong> → Doctor: <strong style={{ color: '#059669' }}>{submittedEntry?.doctorCorrection || formData.severity}</strong> ({submittedEntry?.status || 'Verified'})
              </p>
              <p style={{ fontSize: '12px', color: '#065F46', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={14} /> The patient scan is now temporarily visible in Learning Memory for model weight calibration.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/dashboard" className="btn btn-outline">Back to Dashboard</Link>
          <Link 
            to="/dashboard/doctor-feedback-learning" 
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Sparkles size={16} /> View Patient Scan in Learning Memory <ChevronRight size={16} />
          </Link>
        </div>

        {/* Scan Modal */}
        {showScanModal && (
          <div 
            onClick={() => setShowScanModal(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 9999, padding: '20px',
            }}
          >
            <div 
              onClick={e => e.stopPropagation()}
              style={{
                background: '#090D16', borderRadius: '20px', maxWidth: '640px',
                width: '100%', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
              }}
            >
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: '15px' }}>{activeCase.patient} — {activeCase.scanType}</span>
                <button onClick={() => setShowScanModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
              <div style={{ padding: '16px', background: '#000', display: 'flex', justifyContent: 'center' }}>
                <img src={activeCase.scanImage} alt="Patient Scan" style={{ maxHeight: '480px', maxWidth: '100%', objectFit: 'contain' }} />
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px' }} className="animate-fadeIn">
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark)' }}>Doctor Feedback Review</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '6px' }}>
            Review radiological scan findings, validate AI diagnostic outputs, and update Continuous Learning Memory.
          </p>
        </div>
        <Link 
          to="/dashboard/doctor-feedback-learning" 
          className="btn btn-outline"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}
        >
          <History size={16} /> View Learning Memory
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Left: AI Prediction Summary & Patient Scan Preview */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(133,57,83,0.1)', paddingBottom: '16px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Brain size={20} color="var(--primary)" /> AI Prediction & Patient Scan
            </h3>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Case: {activeCase.id}</span>
          </div>

          {/* Patient Scan Image Card */}
          <div style={{
            background: '#090D16',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(133, 57, 83, 0.2)',
            marginBottom: '20px',
            position: 'relative',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                {activeCase.scanType}
              </span>
              <button 
                type="button"
                onClick={() => setShowScanModal(true)}
                style={{
                  background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '6px',
                  color: 'white', padding: '4px 8px', fontSize: '11px', display: 'flex',
                  alignItems: 'center', gap: '4px', cursor: 'pointer'
                }}
              >
                <Maximize2 size={12} /> Fullscreen Scan
              </button>
            </div>

            <div 
              style={{
                height: '220px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#000',
                cursor: 'pointer',
                position: 'relative',
              }}
              onClick={() => setShowScanModal(true)}
            >
              <img 
                src={activeCase.scanImage} 
                alt="Patient Scan" 
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              />
              <div style={{
                position: 'absolute', bottom: '8px', right: '8px',
                background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
                padding: '4px 10px', borderRadius: '8px', fontSize: '11px', color: 'white',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                Patient: {activeCase.patientName}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Patient</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>{activeCase.patient}</span>
            </div>
            
            <div style={{ padding: '16px', background: 'var(--bg-warm)', borderRadius: '14px', border: '1px solid rgba(133,57,83,0.1)' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em' }}>
                Predicted Severity
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px', fontWeight: 800, color: '#D97706' }}>{activeCase.aiPrediction}</span>
                <span style={{ fontSize: '12px', padding: '4px 10px', background: '#D1FAE5', color: '#065F46', borderRadius: '999px', fontWeight: 600 }}>
                  Confidence: {activeCase.aiConfidence}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Key Findings</span>
              <span style={{ fontSize: '13px', color: 'var(--text-dark)', lineHeight: '1.5' }}>{activeCase.findings}</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Recommendation</span>
              <span style={{ fontSize: '13px', color: 'var(--text-dark)', fontWeight: 600 }}>{activeCase.aiRecommendation}</span>
            </div>
          </div>
        </div>

        {/* Right: Doctor Review */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid rgba(133,57,83,0.1)', paddingBottom: '16px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={20} color="var(--primary)" /> Doctor Clinical Review
            </h3>
            <span style={{ fontSize: '12px', background: 'rgba(133,57,83,0.1)', color: 'var(--primary)', padding: '4px 8px', borderRadius: '6px', fontWeight: 600 }}>
              Human-in-the-Loop
            </span>
          </div>

          {!feedbackState && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center', minHeight: '320px' }}>
              <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '8px' }}>
                  Do you agree with the AI diagnostic prediction?
                </p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  Submitting your feedback will temporarily cache the patient scan in Learning Memory for model training alignment and validation.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                <button 
                  onClick={() => setFeedbackState('accept')}
                  style={{
                    flex: 1, padding: '20px', borderRadius: '16px', border: '1.5px solid #10B981',
                    background: '#ECFDF5', color: '#065F46', fontSize: '15px', fontWeight: 700,
                    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: '10px', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(16,185,129,0.1)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <CheckCircle2 size={32} color="#059669" />
                  <span>Accept Prediction</span>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#047857' }}>Confirm AI Severity</span>
                </button>

                <button 
                  onClick={() => setFeedbackState('correct')}
                  style={{
                    flex: 1, padding: '20px', borderRadius: '16px', border: '1.5px solid #F59E0B',
                    background: '#FFFBEB', color: '#92400E', fontSize: '15px', fontWeight: 700,
                    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: '10px', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(245,158,11,0.1)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <AlertTriangle size={32} color="#D97706" />
                  <span>Correct Prediction</span>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#B45309' }}>Adjust Diagnosis Grade</span>
                </button>
              </div>
            </div>
          )}

          {feedbackState === 'accept' && (
            <form onSubmit={handleSubmit} className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ padding: '14px 18px', background: '#D1FAE5', borderRadius: '14px', border: '1px solid #34D399', color: '#065F46', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={20} /> You are accepting the AI prediction: {activeCase.aiPrediction}.
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px' }}>
                  Doctor Comments / Clinical Impression (Optional)
                </label>
                <textarea 
                  className="form-input" rows={5} 
                  placeholder="Add any anatomical or clinical impressions. The scan will be temporarily stored in Learning Memory as verified ground truth..."
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setFeedbackState(null)} className="btn btn-outline" style={{ flex: 1 }}>Back</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn btn-primary" 
                  style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Send size={16} /> {isSubmitting ? 'Submitting...' : 'Submit & Store in Learning Memory'}
                </button>
              </div>
            </form>
          )}

          {feedbackState === 'correct' && (
            <form onSubmit={handleSubmit} className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ padding: '14px 18px', background: '#FFFBEB', borderRadius: '14px', border: '1px solid #FCD34D', color: '#92400E', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={20} /> Please provide the corrected clinical diagnostic assessment.
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px' }}>
                  Corrected Severity Grade *
                </label>
                <select className="form-input" value={formData.severity} onChange={(e) => setFormData({...formData, severity: e.target.value})}>
                  <option value="Normal">Normal — No Pathological Displacement</option>
                  <option value="Grade I">Grade I — Mild Slip (&lt;25%)</option>
                  <option value="Grade II">Grade II — Moderate Slip (25-50%)</option>
                  <option value="Grade III">Grade III — Severe Slip (50-75%)</option>
                  <option value="Grade IV">Grade IV — Very Severe Slip (&gt;75%)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px' }}>
                  Corrected Recommendation
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.recommendation} 
                  onChange={(e) => setFormData({...formData, recommendation: e.target.value})} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px' }}>
                  Clinical Rationale / Reasoning *
                </label>
                <textarea 
                  required
                  className="form-input" rows={4} 
                  placeholder="Explain why the AI prediction was corrected (e.g. slip percentage measured, disc morphology). This fine-tunes future model predictions."
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setFeedbackState(null)} className="btn btn-outline" style={{ flex: 1 }}>Back</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn btn-primary" 
                  style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Send size={16} /> {isSubmitting ? 'Saving...' : 'Submit Correction to Learning Memory'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>

      {/* Fullscreen Scan Modal */}
      {showScanModal && (
        <div 
          onClick={() => setShowScanModal(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: '24px',
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              background: '#090D16', borderRadius: '24px', maxWidth: '780px',
              width: '100%', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <h4 style={{ color: 'white', fontWeight: 700, fontSize: '16px', margin: 0 }}>{activeCase.patient}</h4>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: '4px 0 0 0' }}>{activeCase.scanType} · Case: {activeCase.id}</p>
              </div>
              <button 
                onClick={() => setShowScanModal(false)} 
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '24px', background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img src={activeCase.scanImage} alt="Patient Scan" style={{ maxHeight: '560px', maxWidth: '100%', objectFit: 'contain' }} />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

