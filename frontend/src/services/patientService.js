/**
 * patientService.js
 * Service layer for patient management operations.
 * Replace mock data with real API calls when backend endpoint is available.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_PATIENTS = [
  {
    id: 'PNT-2025-0487', name: 'Rohit Kumar',  age: 54, sex: 'Male',
    lastVisit: '20 May 2025', condition: 'Under Observation', riskLevel: 'Moderate',
    totalAnalyses: 3, phone: '+91 98765 43210',
  },
  {
    id: 'PNT-2025-0486', name: 'Sunita Verma', age: 47, sex: 'Female',
    lastVisit: '19 May 2025', condition: 'Stable',            riskLevel: 'Low',
    totalAnalyses: 2, phone: '+91 87654 32109',
  },
  {
    id: 'PNT-2025-0485', name: 'Ajay Singh',   age: 62, sex: 'Male',
    lastVisit: '19 May 2025', condition: 'Worsening',         riskLevel: 'High',
    totalAnalyses: 4, phone: '+91 76543 21098',
  },
  {
    id: 'PNT-2025-0484', name: 'Neha Patil',   age: 39, sex: 'Female',
    lastVisit: '18 May 2025', condition: 'Under Observation', riskLevel: 'Moderate',
    totalAnalyses: 1, phone: '+91 65432 10987',
  },
  {
    id: 'PNT-2025-0483', name: 'Manoj Gupta',  age: 58, sex: 'Male',
    lastVisit: '18 May 2025', condition: 'Stable',            riskLevel: 'Low',
    totalAnalyses: 5, phone: '+91 54321 09876',
  },
]

export const MOCK_LONGITUDINAL = {
  patientId: 'PNT-2025-0487',
  patientName: 'Rohit Kumar',
  records: [
    {
      date: 'Nov 2024',
      scanType: 'X-ray Lumbar Spine',
      severity: 'Grade I',
      confidence: 91,
      notes: 'Initial assessment — mild degenerative changes observed at L4-L5.',
    },
    {
      date: 'Feb 2025',
      scanType: 'MRI Lumbar Spine',
      severity: 'Grade I',
      confidence: 89,
      notes: 'Stable — no significant progression from previous imaging.',
    },
    {
      date: 'May 2025',
      scanType: 'X-ray Lumbar Spine',
      severity: 'Grade II',
      confidence: 87,
      notes: 'Progression detected — disc height reduction increased at L4-L5. Closer monitoring recommended.',
    },
  ],
  trend: 'Progressing',
  trendNote: 'Severity grade progressed from Grade I to Grade II over 6 months.',
}

// ─── Service Functions ─────────────────────────────────────────────────────────

export async function getPatients() {
  try {
    const res = await fetch(`${API_BASE}/patients`, {
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to fetch patients')
    return await res.json()
  } catch {
    return MOCK_PATIENTS
  }
}

export async function getPatient(id) {
  try {
    const res = await fetch(`${API_BASE}/patients/${id}`, {
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to fetch patient')
    return await res.json()
  } catch {
    return MOCK_PATIENTS.find(p => p.id === id) || MOCK_PATIENTS[0]
  }
}

export async function getLongitudinalData(patientId) {
  try {
    const res = await fetch(`${API_BASE}/patients/${patientId}/longitudinal`, {
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to fetch longitudinal data')
    return await res.json()
  } catch {
    return MOCK_LONGITUDINAL
  }
}
