import { useState } from 'react'
import { Link } from 'react-router-dom'
import { History, Search, Filter, Eye, FileText, Download, Calendar } from 'lucide-react'
import { MOCK_HISTORY } from '../../services/analysisService'

export default function PatientHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filteredHistory = MOCK_HISTORY.filter(h => {
    const matchesSearch = h.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || h.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || h.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px' }} className="animate-fadeIn">
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark)' }}>Analysis History</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '6px' }}>View and manage past patient analyses and reports.</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '16px', background: 'var(--bg-card)', padding: '16px 24px', borderRadius: '16px', border: '1.5px solid rgba(133,57,83,0.15)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search by patient name or ID..." 
            className="form-input" 
            style={{ paddingLeft: '44px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ width: '200px' }}>
          <select className="form-input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
          </select>
        </div>
        <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={16} /> Date Range
        </button>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg-card)', border: '1.5px solid rgba(133, 57, 83, 0.15)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-warm)', borderBottom: '1px solid rgba(133, 57, 83, 0.15)' }}>
                {['Date', 'Analysis ID', 'Patient', 'Type', 'Severity', 'Status', 'Review', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map(row => (
                <tr key={row.id} style={{ borderBottom: '1px solid #F5F0E8', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-warm)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-dark)', whiteSpace: 'nowrap' }}>{row.date}</td>
                  <td style={{ padding: '16px 24px', fontFamily: 'monospace', fontSize: '13px', color: 'var(--text-muted)' }}>{row.id}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>{row.patientName}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{row.patientId}</p>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-dark)' }}>{row.scanType}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, background: row.severity.includes('III') ? '#FEE2E2' : row.severity.includes('II') ? '#FEF3C7' : '#D1FAE5', color: row.severity.includes('III') ? '#991B1B' : row.severity.includes('II') ? '#92400E' : '#065F46' }}>
                      {row.severity}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, background: row.status === 'Completed' ? '#D1FAE5' : '#DBEAFE', color: row.status === 'Completed' ? '#065F46' : '#1E40AF' }}>
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: row.reviewStatus === 'Pending' ? '#D97706' : 'var(--text-muted)' }}>
                    {row.reviewStatus}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to="/dashboard/ai-analysis-result" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dark)', transition: 'all 0.2s' }}>
                        <Eye size={16} />
                      </Link>
                      <Link to="/dashboard/ai-generated-report" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', transition: 'all 0.2s' }}>
                        <FileText size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No analysis history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
