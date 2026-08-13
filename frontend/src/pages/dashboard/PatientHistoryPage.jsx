import { Calendar, ScanLine, FileText, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react'

const patients = [
  {
    name: 'Rohit Kumar', pid: 'PNT-2025-0487', age: 54,
    history: [
      { date: '20 May 2025', type: 'X-ray Lumbar Spine', severity: 'Grade II', sevStyle: { background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }, note: 'Slight progression from Grade I. Disc space narrowing at L4-L5. Recommend physical therapy.', trend: 'up' },
      { date: '12 Mar 2025', type: 'MRI Lumbar Spine',   severity: 'Grade I',  sevStyle: { background: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0' }, note: 'Mild disc bulge at L4-L5. No neural compression. Conservative management advised.', trend: 'stable' },
      { date: '05 Jan 2025', type: 'X-ray Lumbar Spine', severity: 'Grade I',  sevStyle: { background: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0' }, note: 'Initial scan. Mild degenerative changes. Monitor and follow-up in 3 months.', trend: 'stable' },
    ]
  },
  {
    name: 'Ajay Singh', pid: 'PNT-2025-0485', age: 62,
    history: [
      { date: '19 May 2025', type: 'X-ray Lumbar Spine', severity: 'Grade III', sevStyle: { background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' }, note: 'Significant progression. Osteophyte formation. Surgical consultation recommended.', trend: 'up' },
      { date: '28 Feb 2025', type: 'MRI Lumbar Spine',   severity: 'Grade II',  sevStyle: { background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }, note: 'Moderate disc herniation at L3-L4. Neural foraminal narrowing observed.', trend: 'up' },
    ]
  },
]

const TrendIcon = ({ trend }) => {
  if (trend === 'up')     return <TrendingUp   size={16} color="#EF4444" />
  if (trend === 'down')   return <TrendingDown size={16} color="#10B981" />
  return                         <Minus        size={16} color="#94A3B8" />
}

const pill = (style, text) => (
  <span style={{ ...style, display: 'inline-flex', alignItems: 'center', borderRadius: '999px', padding: '4px 14px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>{text}</span>
)

export default function PatientHistoryPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1100px' }} className="animate-fadeIn">
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>Patient History</h1>
        <p style={{ fontSize: '15px', color: '#64748B', marginTop: '6px' }}>Longitudinal scan history and progression tracking</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '18px' }}>
        {[
          { label: 'Total Records', value: '87', color: '#4F46E5' },
          { label: 'Improving',     value: '28', color: '#059669' },
          { label: 'Stable',        value: '41', color: '#475569' },
          { label: 'Progressing',   value: '18', color: '#DC2626' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '18px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center' }}>
            <p style={{ fontSize: '36px', fontWeight: 900, color, lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#64748B', marginTop: '8px' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Timelines */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {patients.map(patient => (
          <div key={patient.pid} style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>

            {/* Patient header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', borderBottom: '1px solid #F1F5F9', background: '#F8FAFC' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg,#4F46E5,#6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: 700 }}>
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{patient.name}</p>
                  <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>{patient.pid} · Age {patient.age}</p>
                </div>
              </div>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: '#4F46E5', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                Full History <ChevronRight size={14} />
              </button>
            </div>

            {/* Timeline */}
            <div style={{ padding: '28px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '40px', top: '28px', bottom: '28px', width: '2px', background: '#F1F5F9' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {patient.history.map((entry, i) => (
                  <div key={i} style={{ position: 'relative', display: 'flex', gap: '24px', paddingLeft: '48px' }}>
                    {/* Dot */}
                    <div style={{ position: 'absolute', left: '28px', top: '18px', width: '14px', height: '14px', borderRadius: '999px', background: 'white', border: '2.5px solid #6366F1', boxShadow: '0 0 0 3px #EEF2FF' }} />

                    <div style={{ flex: 1, background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '16px', padding: '18px 22px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={14} color="#94A3B8" />
                            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>{entry.date}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <ScanLine size={14} color="#94A3B8" />
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>{entry.type}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <TrendIcon trend={entry.trend} />
                          {pill(entry.sevStyle, entry.severity)}
                        </div>
                      </div>
                      <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6', marginBottom: '10px' }}>{entry.note}</p>
                      <button style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#4F46E5', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                        <FileText size={13} /> View Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
