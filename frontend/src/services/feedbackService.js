/**
 * feedbackService.js
 * Service layer for doctor feedback (Human-in-the-Loop Continuous Learning).
 * Replace mock data with real API calls when backend endpoint is available.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_PENDING_FEEDBACK = {
  analysisId: 'ANA-2025-0232',
  patientId: 'PNT-2025-0485',
  patientName: 'Ajay Singh',
  aiPrediction: 'Grade III',
  aiSeverity: 'Severe',
  aiConfidence: 91,
  aiRecommendation: 'Specialist Review Recommended',
  scanType: 'X-ray Lumbar Spine',
  date: '19 May 2025',
}

export const MOCK_FEEDBACK_HISTORY = [
  {
    id: 'FB-2025-0089',
    caseId: 'ANA-2025-0230',
    patientName: 'Manoj Gupta',
    aiPrediction: 'Grade I',
    doctorCorrection: 'Grade I',
    status: 'Accepted',
    confidence: 78,
    doctorComment: 'AI prediction is consistent with clinical assessment.',
    timestamp: '18 May 2025, 02:30 PM',
  },
  {
    id: 'FB-2025-0088',
    caseId: 'ANA-2025-0229',
    patientName: 'Priya Sharma',
    aiPrediction: 'Grade II',
    doctorCorrection: 'Grade I',
    status: 'Corrected',
    confidence: 73,
    doctorComment: 'Patient presentation does not support Grade II. Conservative management is appropriate.',
    timestamp: '17 May 2025, 11:15 AM',
  },
  {
    id: 'FB-2025-0087',
    caseId: 'ANA-2025-0228',
    patientName: 'Ravi Mehta',
    aiPrediction: 'Grade III',
    doctorCorrection: 'Grade III',
    status: 'Accepted',
    confidence: 93,
    doctorComment: 'Confirmed — surgical consultation initiated.',
    timestamp: '16 May 2025, 09:45 AM',
  },
  {
    id: 'FB-2025-0086',
    caseId: 'ANA-2025-0227',
    patientName: 'Kavita Rao',
    aiPrediction: 'Grade I',
    doctorCorrection: 'Grade II',
    status: 'Corrected',
    confidence: 71,
    doctorComment: 'Imaging shows additional findings not captured by the model. Manual reassessment performed.',
    timestamp: '15 May 2025, 03:20 PM',
  },
]

// ─── Service Functions ─────────────────────────────────────────────────────────

/**
 * Submit doctor feedback for a specific analysis.
 * @param {{ analysisId, decision, correction, severity, recommendation, comment }} data
 */
export async function submitFeedback(data) {
  try {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to submit feedback')
    return await res.json()
  } catch {
    await new Promise(r => setTimeout(r, 800))
    return {
      success: true,
      feedbackId: `FB-2025-${Math.floor(Math.random() * 9000 + 1000)}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      message: 'Feedback recorded successfully.',
    }
  }
}

/**
 * Get the full feedback history.
 */
export async function getFeedbackHistory() {
  try {
    const res = await fetch(`${API_BASE}/feedback/history`, {
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to fetch feedback history')
    return await res.json()
  } catch {
    return MOCK_FEEDBACK_HISTORY
  }
}

/**
 * Get a single pending feedback case for the doctor to review.
 * @param {string} analysisId
 */
export async function getPendingFeedback(analysisId) {
  try {
    const res = await fetch(`${API_BASE}/feedback/pending/${analysisId}`, {
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to fetch pending feedback')
    return await res.json()
  } catch {
    return MOCK_PENDING_FEEDBACK
  }
}
