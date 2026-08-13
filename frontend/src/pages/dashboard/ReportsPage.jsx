import { useState } from 'react'
import { Search, Plus, Filter, Eye, Download, Calendar, FileText } from 'lucide-react'

const reports = [
  { id: 'RPT-2025-0156', patient: 'Rohit Kumar',  pid: 'PNT-2025-0487', type: 'Comprehensive Analysis', date: '20 May 2025', pages: 8,  severity: 'Grade II',  status: 'Final'          },
  { id: 'RPT-2025-0155', patient: 'Sunita Verma', pid: 'PNT-2025-0486', type: 'Follow-up Report',       date: '19 May 2025', pages: 5,  severity: 'Grade I',   status: 'Final'          },
  { id: 'RPT-2025-0154', patient: 'Ajay Singh',   pid: 'PNT-2025-0485', type: 'Comprehensive Analysis', date: '19 May 2025', pages: 10, severity: 'Grade III', status: 'Final'          },
  { id: 'RPT-2025-0153', patient: 'Neha Patil',   pid: 'PNT-2025-0484', type: 'Initial Assessment',     date: '18 May 2025', pages: 6,  severity: 'Grade II',  status: 'Draft'          },
  { id: 'RPT-2025-0152', patient: 'Manoj Gupta',  pid: 'PNT-2025-0483', type: 'Progress Report',        date: '18 May 2025', pages: 4,  severity: 'Grade I',   status: 'Pending Review' },
  { id: 'RPT-2025-0151', patient: 'Priya Sharma', pid: 'PNT-2025-0482', type: 'Comprehensive Analysis', date: '17 May 2025', pages: 9,  severity: 'Grade III', status: 'Final'          },
]

const statusStyle = {
  Final:          { background: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0' },
  Draft:          { background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' },
  'Pending Review':{ background: '#DBEAFE', color: '#1E40AF', border: '1px solid #BFDBFE' },
}
const sevStyle = {
  'Grade I':   { background: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0' },
  'Grade II':  { background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' },
  'Grade III': { background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' },
}

const pill = (style, text) => (
  <span style={{ ...style, display: 'inline-flex', alignItems: 'center', borderRadius: '999px', padding: '4px 14px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>{text}</span>
)

export default function ReportsPage() {
  const [search, setSearch] = useState('')
  const filtered = reports.filter(r =>
    r.patient.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1400px' }} className="animate-fadeIn">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>Reports</h1>
          <p style={{ fontSize: '15px', color: '#64748B', marginTop: '6px' }}>View and manage all clinical reports</p>
        </div>
        <button className="btn btn-primary"><Plus size={18} /> Generate Report</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '18px' }}>
        {[
          { label: 'Total Reports',   value: '12', color: '#4F46E5', icon: FileText },
          { label: 'Final Reports',   value: '9',  color: '#059669', icon: FileText },
          { label: 'Pending Review',  value: '2',  color: '#D97706', icon: FileText },
          { label: 'Drafts',          value: '1',  color: '#64748B', icon: FileText },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '18px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={22} color={color} />
            </div>
            <div>
              <p style={{ fontSize: '32px', fontWeight: 900, color, lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginTop: '6px' }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '420px' }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reports..."
            style={{ width: '100%', paddingLeft: '46px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', fontSize: '14px', border: '1.5px solid #E2E8F0', borderRadius: '12px', background: 'white', outline: 'none', fontFamily: 'inherit' }} />
        </div>
        <button className="btn btn-outline" style={{ padding: '11px 20px' }}><Filter size={16} /> Filter</button>
      </div>

      {/* Table */}
      <div style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '20px 28px', borderBottom: '1px solid #F1F5F9' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>All Reports <span style={{ color: '#94A3B8', fontWeight: 400 }}>({filtered.length})</span></span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                {['Report ID', 'Patient', 'Report Type', 'Date', 'Pages', 'Severity', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid #F8FAFC' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px 20px', fontFamily: 'monospace', fontSize: '12px', color: '#94A3B8' }}>{r.id}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B' }}>{r.patient}</p>
                    <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>{r.pid}</p>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#475569' }}>{r.type}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#64748B', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={13} color="#CBD5E1" />{r.date}</div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 600, color: '#475569' }}>{r.pages} pages</td>
                  <td style={{ padding: '16px 20px' }}>{pill(sevStyle[r.severity], r.severity)}</td>
                  <td style={{ padding: '16px 20px' }}>{pill(statusStyle[r.status], r.status)}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[Eye, Download].map((Icon, i) => (
                        <button key={i} style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1.5px solid #E2E8F0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#EEF2FF'}
                          onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                          <Icon size={15} color="#64748B" />
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
