import { useState } from 'react'
import { Search, Plus, Filter, Eye, Edit2, Phone, Calendar, Activity } from 'lucide-react'

const patients = [
  { id: 'PNT-2025-0487', name: 'Rohit Kumar',  age: 54, gender: 'Male',   phone: '+91 98765 43210', lastVisit: '20 May 2025', risk: 'Moderate', status: 'Active',      analyses: 8  },
  { id: 'PNT-2025-0486', name: 'Sunita Verma', age: 47, gender: 'Female', phone: '+91 87654 32109', lastVisit: '19 May 2025', risk: 'Low',      status: 'Active',      analyses: 5  },
  { id: 'PNT-2025-0485', name: 'Ajay Singh',   age: 62, gender: 'Male',   phone: '+91 76543 21098', lastVisit: '19 May 2025', risk: 'High',     status: 'Active',      analyses: 12 },
  { id: 'PNT-2025-0484', name: 'Neha Patil',   age: 38, gender: 'Female', phone: '+91 65432 10987', lastVisit: '18 May 2025', risk: 'Moderate', status: 'Active',      analyses: 3  },
  { id: 'PNT-2025-0483', name: 'Manoj Gupta',  age: 55, gender: 'Male',   phone: '+91 54321 09876', lastVisit: '18 May 2025', risk: 'Low',      status: 'In Progress', analyses: 6  },
  { id: 'PNT-2025-0482', name: 'Priya Sharma', age: 41, gender: 'Female', phone: '+91 43210 98765', lastVisit: '17 May 2025', risk: 'High',     status: 'Active',      analyses: 9  },
  { id: 'PNT-2025-0481', name: 'Vikram Joshi', age: 68, gender: 'Male',   phone: '+91 32109 87654', lastVisit: '16 May 2025', risk: 'Critical', status: 'Active',      analyses: 15 },
  { id: 'PNT-2025-0480', name: 'Kavita Rao',   age: 45, gender: 'Female', phone: '+91 21098 76543', lastVisit: '15 May 2025', risk: 'Low',      status: 'Discharged',  analyses: 4  },
]

const riskStyle = {
  Low:      { background: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0' },
  Moderate: { background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' },
  High:     { background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' },
  Critical: { background: '#FECACA', color: '#7F1D1D', border: '1px solid #F87171' },
}
const statusStyle = {
  Active:       { background: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0' },
  'In Progress':{ background: '#DBEAFE', color: '#1E40AF', border: '1px solid #BFDBFE' },
  Discharged:   { background: 'rgba(139, 92, 246, 0.15)', color: 'var(--text-muted)', border: '1px solid rgba(139, 92, 246, 0.15)' },
}

const pill = (style, text) => (
  <span style={{
    ...style, display: 'inline-flex', alignItems: 'center',
    borderRadius: '999px', padding: '4px 14px',
    fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap'
  }}>{text}</span>
)

export default function PatientsPage() {
  const [search, setSearch] = useState('')
  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1400px' }} className="animate-fadeIn">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark)' }}>Patients</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '6px' }}>Manage and view all registered patients</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} /> Add Patient
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '18px' }}>
        {[
          { label: 'Total Patients', value: '42', color: 'var(--text-dark)', bg: 'var(--bg-warm)' },
          { label: 'High Risk',      value: '5',  color: '#DC2626', bg: '#FEF2F2' },
          { label: 'Active',         value: '35', color: '#059669', bg: '#ECFDF5' },
          { label: 'New This Month', value: '6',  color: '#0891B2', bg: '#ECFEFF' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} style={{ background: 'var(--bg-card)', border: '1.5px solid rgba(139, 92, 246, 0.15)', borderRadius: '18px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center' }}>
            <p style={{ fontSize: '36px', fontWeight: 900, color, lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)', marginTop: '8px' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '420px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or patient ID..."
            style={{
              width: '100%', paddingLeft: '46px', paddingRight: '16px',
              paddingTop: '12px', paddingBottom: '12px',
              fontSize: '14px', border: '1.5px solid rgba(139, 92, 246, 0.15)', borderRadius: '12px',
              background: 'var(--bg-card)', outline: 'none', fontFamily: 'inherit', lineHeight: '1.5'
            }}
          />
        </div>
        <button className="btn btn-outline" style={{ gap: '8px', padding: '11px 20px' }}>
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg-card)', border: '1.5px solid rgba(139, 92, 246, 0.15)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(139, 92, 246, 0.15)' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-dark)' }}>
            All Patients <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({filtered.length})</span>
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-warm)', borderBottom: '1px solid rgba(139, 92, 246, 0.15)' }}>
                {['Patient ID', 'Name', 'Age', 'Gender', 'Phone', 'Last Visit', 'Risk Level', 'Status', 'Analyses', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}
                  style={{ borderBottom: '1px solid #F5F0E8', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-warm)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '16px 20px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-muted)' }}>{p.id}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)', whiteSpace: 'nowrap' }}>{p.name}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--text-dark)' }}>{p.age}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--text-dark)' }}>{p.gender}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={13} color="rgba(139, 92, 246, 0.15)" />{p.phone}</div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={13} color="rgba(139, 92, 246, 0.15)" />{p.lastVisit}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>{pill(riskStyle[p.risk], p.risk)}</td>
                  <td style={{ padding: '16px 20px' }}>{pill(statusStyle[p.status], p.status)}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={14} color="var(--text-muted)" />{p.analyses}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[Eye, Edit2].map((Icon, i) => (
                        <button key={i} style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1.5px solid rgba(139, 92, 246, 0.15)', background: 'var(--bg-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-warm)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'white'}
                        >
                          <Icon size={15} color="var(--text-muted)" />
                        </button>
                      ))}
                    </div>
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
