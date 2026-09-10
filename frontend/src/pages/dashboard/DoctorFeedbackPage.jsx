import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Brain, User, CheckCircle2, AlertTriangle, FileText, Activity, 
  MessageSquare, History, ChevronRight, XCircle, Check, Send
} from 'lucide-react'

const PENDING_CASE = {
  id: 'ANA-2025-0234',
  patient: 'Rohit Kumar (PNT-2025-0487)',
  scanType: 'X-ray Lumbar Spine',
  date: '20 May 2025',
  aiPrediction: 'Grade II',
  aiConfidence: '87%',
  aiRecommendation: 'Further Evaluation Recommended (MRI)',
  findings: 'Disc height reduction at L4-L5. Mild canal narrowing.',
}

export default function DoctorFeedbackPage() {
  const [feedbackState, setFeedbackState] = useState(null) // 'accept' | 'correct' | 'submitted'
  const [formData, setFormData] = useState({
    severity: PENDING_CASE.aiPrediction,
    recommendation: PENDING_CASE.aiRecommendation,
    comment: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
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
      <div className="animate-fadeIn" style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '4px solid #A7F3D0' }}>
          <CheckCircle2 size={40} color="#059669" />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '12px' }}>Feedback Recorded Successfully</h2>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '32px' }}>
          Thank you. Your feedback has been securely stored in the continuous learning memory and will be used to improve future AI predictions.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/dashboard" className="btn btn-outline">Back to Dashboard</Link>
          <Link to="/dashboard/doctor-feedback-learning" className="btn btn-primary">View Learning Memory</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px' }} className="animate-fadeIn">
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark)' }}>Doctor Feedback Review</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '6px' }}>
          Review and validate AI outputs to finalize the report and contribute to continuous learning.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Left: AI Prediction Summary */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid rgba(133,57,83,0.1)', paddingBottom: '16px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Brain size={20} color="var(--primary)" /> AI Prediction
            </h3>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Case: {PENDING_CASE.id}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Patient</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>{PENDING_CASE.patient}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Scan Type</span>
              <span style={{ fontSize: '14px', color: 'var(--text-dark)' }}>{PENDING_CASE.scanType}</span>
            </div>
            
            <div style={{ padding: '16px', background: 'var(--bg-warm)', borderRadius: '12px', border: '1px solid rgba(133,57,83,0.1)' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '8px' }}>Predicted Severity</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px', fontWeight: 800, color: '#D97706' }}>{PENDING_CASE.aiPrediction}</span>
                <span style={{ fontSize: '12px', padding: '4px 10px', background: '#D1FAE5', color: '#065F46', borderRadius: '999px', fontWeight: 600 }}>Confidence: {PENDING_CASE.aiConfidence}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Key Findings</span>
              <span style={{ fontSize: '13px', color: 'var(--text-dark)', lineHeight: '1.5' }}>{PENDING_CASE.findings}</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Recommendation</span>
              <span style={{ fontSize: '13px', color: 'var(--text-dark)', fontWeight: 600 }}>{PENDING_CASE.aiRecommendation}</span>
            </div>
          </div>
        </div>

        {/* Right: Doctor Review */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid rgba(133,57,83,0.1)', paddingBottom: '16px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={20} color="var(--primary)" /> Doctor Review
            </h3>
          </div>

          {!feedbackState && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', justifyContent: 'center', minHeight: '240px' }}>
              <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px' }}>Do you agree with the AI prediction?</p>
              <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                <button 
                  onClick={() => setFeedbackState('accept')}
                  style={{ flex: 1, padding: '16px', borderRadius: '16px', border: '1.5px solid #10B981', background: '#ECFDF5', color: '#065F46', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
                >
                  <CheckCircle2 size={28} /> Accept Prediction
                </button>
                <button 
                  onClick={() => setFeedbackState('correct')}
                  style={{ flex: 1, padding: '16px', borderRadius: '16px', border: '1.5px solid #F59E0B', background: '#FFFBEB', color: '#92400E', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
                >
                  <AlertTriangle size={28} /> Correct Prediction
                </button>
              </div>
            </div>
          )}

          {feedbackState === 'accept' && (
            <form onSubmit={handleSubmit} className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ padding: '12px 16px', background: '#D1FAE5', borderRadius: '12px', border: '1px solid #34D399', color: '#065F46', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={18} /> You are accepting the AI prediction.
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px' }}>Doctor Comments (Optional)</label>
                <textarea 
                  className="form-input" rows={4} 
                  placeholder="Add any clinical notes to append to the final report..."
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setFeedbackState(null)} className="btn btn-outline" style={{ flex: 1 }}>Back</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Send size={16} /> Submit & Finalize Report
                </button>
              </div>
            </form>
          )}

          {feedbackState === 'correct' && (
            <form onSubmit={handleSubmit} className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ padding: '12px 16px', background: '#FFFBEB', borderRadius: '12px', border: '1px solid #FCD34D', color: '#92400E', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} /> Please provide the corrected assessment.
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px' }}>Corrected Severity Grade</label>
                <select className="form-input" value={formData.severity} onChange={(e) => setFormData({...formData, severity: e.target.value})}>
                  <option>Normal</option>
                  <option>Grade I</option>
                  <option>Grade II</option>
                  <option>Grade III</option>
                  <option>Grade IV</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px' }}>Corrected Recommendation</label>
                <input type="text" className="form-input" value={formData.recommendation} onChange={(e) => setFormData({...formData, recommendation: e.target.value})} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px' }}>Reasoning / Comments *</label>
                <textarea 
                  required
                  className="form-input" rows={3} 
                  placeholder="Explain why the AI prediction was corrected. This helps improve future model predictions."
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setFeedbackState(null)} className="btn btn-outline" style={{ flex: 1 }}>Back</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Send size={16} /> Submit Correction
                </button>
              </div>
            </form>
          )}
        </div>

      </div>

    </div>
  )
}
