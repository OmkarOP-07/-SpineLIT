import { TrendingUp, Activity, Brain, CheckCircle } from 'lucide-react'
import { MOCK_FEEDBACK_HISTORY } from '../../services/feedbackService'

export default function DoctorFeedbackLearningMemoryPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px' }} className="animate-fadeIn">
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark)' }}>Learning Memory & Feedback</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '6px' }}>View historical doctor corrections used for continuous model improvement.</p>
      </div>

      {/* HITL Panel */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', borderRadius: '20px', padding: '32px', color: 'white', display: 'flex', alignItems: 'center', gap: '32px', boxShadow: '0 8px 32px rgba(133,57,83,0.2)' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Brain size={40} color="white" />
        </div>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Human-in-the-Loop Continuous Learning</h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', maxWidth: '800px' }}>
            Doctor feedback is stored securely as verified feedback memory. This verified data is retrieved as contextual information for similar future cases, and provides a validated dataset for periodic model evaluation and improvement. It ensures the AI system adapts to clinical reality while keeping the clinician in control.
          </p>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg-card)', border: '1.5px solid rgba(133, 57, 83, 0.15)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(133, 57, 83, 0.15)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)' }}>Recent Verified Feedback</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-warm)', borderBottom: '1px solid rgba(133, 57, 83, 0.15)' }}>
                {['Date', 'Feedback ID', 'Patient', 'AI Prediction', 'Doctor Correction', 'Status', 'Doctor Note'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_FEEDBACK_HISTORY.map(row => (
                <tr key={row.id} style={{ borderBottom: '1px solid #F5F0E8', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-warm)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-dark)', whiteSpace: 'nowrap' }}>{row.timestamp.split(',')[0]}</td>
                  <td style={{ padding: '16px 24px', fontFamily: 'monospace', fontSize: '13px', color: 'var(--text-muted)' }}>{row.id}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)', whiteSpace: 'nowrap' }}>{row.patientName}</td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>{row.aiPrediction}</td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>{row.doctorCorrection}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, background: row.status === 'Accepted' ? '#D1FAE5' : '#FFFBEB', color: row.status === 'Accepted' ? '#065F46' : '#92400E' }}>
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {row.doctorComment}
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
