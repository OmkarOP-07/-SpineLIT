/**
 * analysisService.js
 * Service layer for AI analysis operations.
 * Replace mock data with real API calls when the backend endpoint is available.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_ANALYSIS_RESULT = {
  id: 'ANA-2025-0234',
  patientId: 'PNT-2025-0487',
  patientName: 'Rohit Kumar',
  patientAge: 54,
  patientSex: 'Male',
  analysisDate: '20 May 2025',
  analysisTime: '10:35 AM',
  scanType: 'X-ray Lumbar Spine',
  status: 'Completed',
  aiConfidence: 87,
  severityGrade: 'Grade II',
  progression: 'Changed',
  progressionNote: 'Severity increased from Grade I to Grade II',
  analysisTimeSeconds: 14.2,
  keyFindings: [
    { feature: 'Disc height reduction', confidence: 92, region: 'L4-L5', severity: 'Moderate' },
    { feature: 'Spinal canal narrowing', confidence: 78, region: 'L3-L4', severity: 'Mild' },
    { feature: 'Degenerative vertebral changes', confidence: 71, region: 'L5-S1', severity: 'Mild' },
  ],
  modelReasoning: 'The AI model identified disc height reduction at L4-L5 as the primary indicator of degenerative changes. Vertebral alignment analysis shows minor deviation within normal range. Feature attribution scores indicate that disc morphology contributes 42% to the overall severity assessment, followed by bone density patterns at 28%.',
  ragContext: [
    {
      type: 'Similar Cases',
      content: 'Similar cases in the database show that disc height reduction at L4-L5 is commonly associated with age-related degenerative changes (n=1,247 cases).',
      source: 'Case Database',
    },
    {
      type: 'Clinical Guidelines',
      content: 'Clinical guidelines suggest monitoring progression over 6–12 month intervals for Grade II degeneration. Consider MRI for detailed soft-tissue evaluation if symptoms worsen.',
      source: 'Spine Degeneration Guidelines, 2023',
    },
    {
      type: 'Relevant Knowledge',
      content: 'Lumbar disc degeneration at L4-L5 is the most common level affected in patients aged 50–65. Conservative management is recommended as first-line treatment.',
      source: 'Clinical Knowledge Base',
    },
  ],
  recommendations: [
    { priority: 'high', text: 'Consider MRI for detailed soft-tissue evaluation' },
    { priority: 'medium', text: 'Schedule follow-up in 3 months' },
    { priority: 'low', text: 'Physical therapy evaluation recommended' },
  ],
  clinicalDecision: 'Further Evaluation Recommended',
  previousRecord: {
    date: 'Nov 2024',
    severity: 'Grade I',
    confidence: 91,
  },
}

export const MOCK_HISTORY = [
  { id: 'ANA-2025-0234', patientId: 'PNT-2025-0487', patientName: 'Rohit Kumar',  date: '20 May 2025', scanType: 'X-ray Lumbar Spine', severity: 'Grade II',  confidence: 87, status: 'Completed',   reviewStatus: 'Reviewed'   },
  { id: 'ANA-2025-0233', patientId: 'PNT-2025-0486', patientName: 'Sunita Verma', date: '19 May 2025', scanType: 'MRI Lumbar Spine',   severity: 'Grade I',   confidence: 94, status: 'Completed',   reviewStatus: 'Reviewed'   },
  { id: 'ANA-2025-0232', patientId: 'PNT-2025-0485', patientName: 'Ajay Singh',   date: '19 May 2025', scanType: 'X-ray Lumbar Spine', severity: 'Grade III', confidence: 91, status: 'Completed',   reviewStatus: 'Pending'    },
  { id: 'ANA-2025-0231', patientId: 'PNT-2025-0484', patientName: 'Neha Patil',   date: '18 May 2025', scanType: 'MRI Lumbar Spine',   severity: 'Grade II',  confidence: 83, status: 'Completed',   reviewStatus: 'Pending'    },
  { id: 'ANA-2025-0230', patientId: 'PNT-2025-0483', patientName: 'Manoj Gupta',  date: '18 May 2025', scanType: 'X-ray Lumbar Spine', severity: 'Grade I',   confidence: 78, status: 'In Progress', reviewStatus: 'Not Started' },
]

// ─── Service Functions ─────────────────────────────────────────────────────────

/**
 * Start a new AI analysis with patient data and uploaded image.
 * @param {FormData} formData
 */
export async function startAnalysis(formData) {
  try {
    const res = await fetch(`${API_BASE}/analysis/start`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    })
    if (!res.ok) throw new Error('Analysis request failed')
    return await res.json()
  } catch {
    // Mock: simulate a processing delay and return demo result
    await new Promise(r => setTimeout(r, 2000))
    return { success: true, analysisId: MOCK_ANALYSIS_RESULT.id }
  }
}

/**
 * Get full analysis result by ID.
 * @param {string} id
 */
export async function getAnalysisResult(id) {
  try {
    const res = await fetch(`${API_BASE}/analysis/${id}`, {
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to fetch analysis')
    return await res.json()
  } catch {
    return MOCK_ANALYSIS_RESULT
  }
}

/**
 * Get the full analysis history list.
 */
export async function getAnalysisHistory() {
  try {
    const res = await fetch(`${API_BASE}/analysis/history`, {
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to fetch history')
    return await res.json()
  } catch {
    return MOCK_HISTORY
  }
}
