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

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_PENDING_FEEDBACK = {
  analysisId: 'ANA-2025-0234',
  patientId: 'PNT-2025-0487',
  patientName: 'Rohit Kumar',
  aiPrediction: 'Grade II',
  aiSeverity: 'Moderate',
  aiConfidence: 87,
  aiRecommendation: 'Further Evaluation Recommended (MRI)',
  findings: 'Disc height reduction at L4-L5. Mild canal narrowing.',
  scanType: 'X-ray Lumbar Spine (Lateral)',
  scanImage: '/sample_lateral_xray.jpg',
  date: '20 May 2025',
}

export const MOCK_FEEDBACK_HISTORY = [
  {
    id: 'FB-2025-0089',
    caseId: 'ANA-2025-0230',
    patientName: 'Manoj Gupta',
    patientId: 'PNT-2025-0483',
    scanType: 'X-ray Lumbar Spine',
    scanImage: '/sample_lateral_xray.jpg',
    aiPrediction: 'Grade I',
    doctorCorrection: 'Grade I',
    status: 'Accepted',
    confidence: 78,
    doctorComment: 'AI prediction is consistent with clinical assessment.',
    timestamp: '18 May 2025, 02:30 PM',
    isTemporaryScanInMemory: false,
  },
  {
    id: 'FB-2025-0088',
    caseId: 'ANA-2025-0229',
    patientName: 'Priya Sharma',
    patientId: 'PNT-2025-0481',
    scanType: 'Lateral X-Ray (Sagittal)',
    scanImage: '/sample_lateral_xray.jpg',
    aiPrediction: 'Grade II',
    doctorCorrection: 'Grade I',
    status: 'Corrected',
    confidence: 73,
    doctorComment: 'Patient presentation does not support Grade II. Conservative management is appropriate.',
    timestamp: '17 May 2025, 11:15 AM',
    isTemporaryScanInMemory: false,
  },
  {
    id: 'FB-2025-0087',
    caseId: 'ANA-2025-0228',
    patientName: 'Ravi Mehta',
    patientId: 'PNT-2025-0479',
    scanType: 'Sagittal MRI',
    scanImage: '/sample_sagittal_mri.jpg',
    aiPrediction: 'Grade III',
    doctorCorrection: 'Grade III',
    status: 'Accepted',
    confidence: 93,
    doctorComment: 'Confirmed — surgical consultation initiated.',
    timestamp: '16 May 2025, 09:45 AM',
    isTemporaryScanInMemory: false,
  },
  {
    id: 'FB-2025-0086',
    caseId: 'ANA-2025-0227',
    patientName: 'Kavita Rao',
    patientId: 'PNT-2025-0475',
    scanType: 'Lumbar L5-S1 Scan',
    scanImage: '/sample_lumbar_l5s1.jpg',
    aiPrediction: 'Grade I',
    doctorCorrection: 'Grade II',
    status: 'Corrected',
    confidence: 71,
    doctorComment: 'Imaging shows additional findings not captured by the model. Manual reassessment performed.',
    timestamp: '15 May 2025, 03:20 PM',
    isTemporaryScanInMemory: false,
  },
]

const FEEDBACK_STORAGE_KEY = 'spinelit_feedback_history'
const TEMP_LEARNING_SCAN_KEY = 'spinelit_temporary_learning_memory'

// ─── Service Functions ─────────────────────────────────────────────────────────

/**
 * Submit doctor feedback for a specific analysis and store temporarily in learning memory.
 * @param {{ analysisId, caseId, patientName, patientId, scanType, scanImage, decision, doctorCorrection, severity, recommendation, comment, findings, confidence }} data
 */
export async function submitFeedback(data) {
  const feedbackId = `FB-2025-${Math.floor(Math.random() * 9000 + 1000)}`
  const now = new Date()
  const timestampStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + 
    ', ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })

  const newEntry = {
    id: feedbackId,
    caseId: data.caseId || data.analysisId || 'ANA-2025-0234',
    patientName: data.patientName || 'Rohit Kumar',
    patientId: data.patientId || 'PNT-2025-0487',
    scanType: data.scanType || 'X-ray Lumbar Spine',
    scanImage: data.scanImage || '/sample_lateral_xray.jpg',
    aiPrediction: data.aiPrediction || 'Grade II',
    doctorCorrection: data.doctorCorrection || data.severity || 'Grade II',
    status: (data.decision === 'accept' || data.status === 'Accepted') ? 'Accepted' : 'Corrected',
    confidence: data.confidence || 87,
    doctorComment: data.comment || (data.decision === 'accept' ? 'Clinical evaluation validated by physician.' : 'Physician modified diagnostic grade.'),
    recommendation: data.recommendation || 'Standard clinical review',
    findings: data.findings || 'L4-L5 disc height reduction and alignment assessment',
    timestamp: timestampStr,
    isTemporaryScanInMemory: true,
    feedbackGivenAt: Date.now(),
    retentionHours: 24,
    retentionExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
  }

  // Persist into localStorage
  try {
    const existing = getStoredFeedbackList()
    const updated = [newEntry, ...existing]
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updated))
    localStorage.setItem(TEMP_LEARNING_SCAN_KEY, JSON.stringify(newEntry))
  } catch (err) {
    console.warn('Could not persist feedback to localStorage:', err)
  }

  try {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const serverData = await res.json()
      return { success: true, feedbackId, item: newEntry, ...serverData }
    }
  } catch {
    // Graceful offline fallback
  }

  return {
    success: true,
    feedbackId,
    timestamp: timestampStr,
    item: newEntry,
    message: 'Feedback recorded successfully in temporary learning memory.',
  }
}

/**
 * Helper to get list of feedbacks from storage or initial mocks
 */
function getStoredFeedbackList() {
  try {
    const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.error('Error reading feedback storage:', e)
  }
  return MOCK_FEEDBACK_HISTORY
}

/**
 * Get the full feedback history (stored + mocks).
 */
export async function getFeedbackHistory() {
  return getStoredFeedbackList()
}

/**
 * Get the current patient scan temporarily stored in learning memory if feedback was given.
 */
export function getTemporaryLearningMemoryScan() {
  try {
    const raw = localStorage.getItem(TEMP_LEARNING_SCAN_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      // Check expiration if applicable
      if (parsed && (!parsed.retentionExpiresAt || parsed.retentionExpiresAt > Date.now())) {
        return parsed
      }
    }
  } catch (err) {
    console.error('Error getting temporary learning memory scan:', err)
  }
  return null
}

/**
 * Purge / clear the temporary patient scan from learning memory.
 */
export function clearTemporaryLearningMemory() {
  try {
    localStorage.removeItem(TEMP_LEARNING_SCAN_KEY)
    // Also mark item as not temporary in stored history
    const list = getStoredFeedbackList()
    const updated = list.map(item => ({ ...item, isTemporaryScanInMemory: false }))
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('Error clearing temporary learning memory:', err)
  }
}

/**
 * Seed / simulate doctor feedback with a patient scan into temporary learning memory.
 */
export function simulateDoctorFeedback() {
  const simulated = {
    id: `FB-2025-${Math.floor(Math.random() * 9000 + 1000)}`,
    caseId: 'ANA-2025-0234',
    patientName: 'Rohit Kumar',
    patientId: 'PNT-2025-0487',
    scanType: 'X-ray Lumbar Spine (Lateral View)',
    scanImage: '/sample_lateral_xray.jpg',
    aiPrediction: 'Grade II',
    doctorCorrection: 'Grade I',
    status: 'Corrected',
    confidence: 87,
    doctorComment: 'Spondylolisthesis slip is 18% (Meyerding Grade I), canal narrowing is minimal. Corrected from AI Grade II.',
    findings: 'Disc height reduction at L4-L5 with mild anterior slip. Neuroforamina patent.',
    recommendation: 'Conservative physical therapy & 6-month flexion-extension radiograph follow-up.',
    timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + 
      ', ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
    isTemporaryScanInMemory: true,
    feedbackGivenAt: Date.now(),
    retentionHours: 24,
    retentionExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
  }

  try {
    const existing = getStoredFeedbackList()
    // Avoid duplicate id if simulated
    const filtered = existing.filter(x => x.id !== simulated.id)
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify([simulated, ...filtered]))
    localStorage.setItem(TEMP_LEARNING_SCAN_KEY, JSON.stringify(simulated))
  } catch (err) {
    console.error('Error simulating doctor feedback:', err)
  }

  return simulated
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

