/**
 * reportService.js
 * Service layer for clinical report operations.
 * Replace mock data with real API calls when backend endpoint is available.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_REPORT = {
  reportId: 'RPT-2025-0234',
  analysisId: 'ANA-2025-0234',
  generatedAt: '20 May 2025, 10:52 AM',
  patient: {
    id: 'PNT-2025-0487',
    name: 'Rohit Kumar',
    age: 54,
    sex: 'Male',
    phone: '+91 98765 43210',
  },
  clinical: {
    symptoms: ['Lower back pain', 'Radiating pain to left leg', 'Mild numbness'],
    duration: '3–6 months',
    severity: 'Moderate (5/10)',
    notes: 'Patient reports worsening pain over the past 2 months, especially during prolonged sitting.',
    lifestyle: {
      sittingHours: '8–10 hours/day',
      activityLevel: 'Low',
      workType: 'Desk-based',
      mobility: 'Slightly limited',
    },
  },
  imaging: {
    scanType: 'X-ray Lumbar Spine',
    date: '20 May 2025',
    findings: [
      { region: 'L4-L5', finding: 'Disc height reduction — 28% compared to reference', severity: 'Moderate' },
      { region: 'L3-L4', finding: 'Mild spinal canal narrowing observed', severity: 'Mild' },
      { region: 'L5-S1', finding: 'Degenerative changes in vertebral body endplates', severity: 'Mild' },
    ],
  },
  aiAssessment: {
    confidence: 87,
    severityGrade: 'Grade II',
    progression: 'Changed — Grade I → Grade II',
    reasoning: 'Feature attribution indicates that disc morphology at L4-L5 contributes 42% to the severity assessment. Bone density patterns contribute 28%. Clinical symptoms align with imaging findings.',
  },
  ragContext: [
    { source: 'Case Database (n=1,247)', summary: 'Similar cases show disc height reduction at L4-L5 is commonly associated with age-related degenerative changes in the 50–65 age group.' },
    { source: 'Spine Degeneration Guidelines, 2023', summary: 'Grade II degeneration: monitor every 6 months. Consider MRI for soft-tissue evaluation if neurological symptoms persist.' },
  ],
  clinicalDecision: 'Further Evaluation Recommended',
  disclaimer: 'This report is AI-assisted and intended to support clinical decision-making. Final diagnosis and treatment decisions remain with the qualified healthcare professional reviewing this case.',
  doctorReview: null,
}

// ─── Service Functions ─────────────────────────────────────────────────────────

export async function getReport(analysisId) {
  try {
    const res = await fetch(`${API_BASE}/reports/${analysisId}`, {
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to fetch report')
    return await res.json()
  } catch {
    return MOCK_REPORT
  }
}

export async function downloadReport(analysisId) {
  try {
    const res = await fetch(`${API_BASE}/reports/${analysisId}/download`, {
      headers: { ...getAuthHeader() },
    })
    if (!res.ok) throw new Error('Failed to download report')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `SpineLCI_Report_${analysisId}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  } catch {
    // In development: show a browser print dialog as fallback
    window.print()
  }
}

export async function sendForDoctorReview(analysisId) {
  try {
    const res = await fetch(`${API_BASE}/reports/${analysisId}/send-review`, {
      method: 'POST',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to send for review')
    return await res.json()
  } catch {
    await new Promise(r => setTimeout(r, 800))
    return { success: true, message: 'Report sent for doctor review.' }
  }
}
