import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import spineMri from '../../assets/spine_mri.png'
import { useAuth } from '../../context/AuthContext'
import {
  getPatientLocation,
  getNearbyDoctorsForPatient
} from '../../services/nearbyDoctorsService'
import {
  Upload, ScanLine, Brain, FileText, Download, ShieldCheck,
  Calendar, CheckCircle2, AlertTriangle, Eye, ArrowRight,
  Sparkles, RefreshCw, LogOut, ChevronRight, ChevronLeft, Search, Activity,
  Clock, Share2, Layers, AlertCircle, FileCheck, PanelLeftClose, PanelLeftOpen,
  X, Star, MapPin, Phone, ExternalLink, Send, Check, Stethoscope, Navigation,
  LocateFixed, Compass
} from 'lucide-react'

/* ─── Google SVG Icon ─────────────────────────────── */
function GoogleIcon() {
  return (
    <svg style={{ width: '18px', height: '18px', flexShrink: 0 }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

const sampleReports = [
  {
    id: 'RPT-2025-0892',
    date: '24 Aug 2025',
    time: '11:30 AM',
    type: 'MRI Lumbar Spine',
    severity: 'Grade II',
    severityScore: 6.8,
    status: 'Reviewed by Doctor',
    doctor: 'Dr. Arjun Sharma',
    hospital: 'Apollo Hospitals',
    findings: [
      'Disc height reduction of 18% observed at L4-L5.',
      'Mild posterior disc bulge with minor thecal sac indentation.',
      'No significant neural foraminal stenosis at L1-L3.'
    ],
    recommendation: 'Physical therapy recommended. Follow-up MRI in 6 months.',
    aiConfidence: 94,
  },
  {
    id: 'RPT-2025-0741',
    date: '12 May 2025',
    time: '03:15 PM',
    type: 'X-Ray Lumbar Spine',
    severity: 'Grade I',
    severityScore: 3.2,
    status: 'Completed',
    doctor: 'Dr. Priya Mehta',
    hospital: 'Fortis Hospital',
    findings: [
      'Normal lumbar lordosis maintained.',
      'Minimal early degenerative osteophytes at L5-S1.',
      'Vertebral body heights well preserved.'
    ],
    recommendation: 'Postural correction exercises and regular ergonomic monitoring.',
    aiConfidence: 96,
  },
  {
    id: 'RPT-2025-0518',
    date: '18 Jan 2025',
    time: '09:45 AM',
    type: 'MRI Cervical Spine',
    severity: 'Grade I',
    severityScore: 2.9,
    status: 'Completed',
    doctor: 'Dr. Rajesh Kulkarni',
    hospital: 'Max Super Speciality Hospital',
    findings: [
      'Cervical spinal cord signals normal.',
      'No disc herniation or nerve root compression detected.',
      'Mild muscle spasm indicators noted in paraspinal region.'
    ],
    recommendation: 'Ergonomic neck support and stretching routine.',
    aiConfidence: 98,
  },
]

const sevColors = {
  'Grade I':   { bg: '#D1FAE5', color: '#065F46', border: '#A7F3D0', dot: '#10B981' },
  'Grade II':  { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A', dot: '#F59E0B' },
  'Grade III': { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA', dot: '#EF4444' },
}

const DEFAULT_REPORTS_WIDTH = 360
const MIN_REPORTS_WIDTH = 80

export default function PatientPortalPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [selectedReport, setSelectedReport] = useState(sampleReports[0])
  const [search, setSearch] = useState('')
  const [dragging, setDragging] = useState(false)
  const [uploadedScan, setUploadedScan] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [showHeatmap, setShowHeatmap] = useState(true)
  const fileInputRef = useRef(null)

  // Location & Nearby Doctors State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [doctorSearch, setDoctorSearch] = useState('')
  const [doctorFilter, setDoctorFilter] = useState('All')
  const [patientLocation, setPatientLocation] = useState(null)
  const [isLocating, setIsLocating] = useState(false)
  const [nearbyDoctors, setNearbyDoctors] = useState([])
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false)
  const [sendingDoctorId, setSendingDoctorId] = useState(null)
  const [sentDoctorIds, setSentDoctorIds] = useState({})
  const [shareSuccessToast, setShareSuccessToast] = useState(null)

  // Resizable sidebar state
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('patient_reports_width')
    return saved !== null ? Number(saved) : DEFAULT_REPORTS_WIDTH
  })
  const [isResizing, setIsResizing] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('patient_reports_collapsed') === 'true'
  })

  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'Patient')
  const photoUrl = user?.photo_url || user?.photo

  const filteredReports = sampleReports.filter(r =>
    r.type.toLowerCase().includes(search.toLowerCase()) ||
    r.id.toLowerCase().includes(search.toLowerCase()) ||
    r.doctor.toLowerCase().includes(search.toLowerCase())
  )

  // Fetch Location and Nearby Doctors on open (with user's stored backend location fallback)
  const detectLocationAndFetchDoctors = useCallback(async () => {
    setIsLocating(true)
    setIsLoadingDoctors(true)
    try {
      const loc = await getPatientLocation(user)
      setPatientLocation(loc)
      const docs = await getNearbyDoctorsForPatient(loc.coords)
      setNearbyDoctors(docs)
    } catch (err) {
      console.warn('Error detecting location:', err)
    } finally {
      setIsLocating(false)
      setIsLoadingDoctors(false)
    }
  }, [user])

  useEffect(() => {
    if (isShareModalOpen && nearbyDoctors.length === 0) {
      detectLocationAndFetchDoctors()
    }
  }, [isShareModalOpen, nearbyDoctors.length, detectLocationAndFetchDoctors])

  // Filter Doctors
  const filteredDoctors = nearbyDoctors.filter(doc => {
    const matchesSearch =
      doc.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      (doc.city && doc.city.toLowerCase().includes(doctorSearch.toLowerCase())) ||
      doc.title.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      doc.specialties.some(s => s.toLowerCase().includes(doctorSearch.toLowerCase()))

    if (doctorFilter === 'All') return matchesSearch
    if (doctorFilter === 'Available Today') return matchesSearch && doc.availability === 'Available Today'
    if (doctorFilter === 'Under 10 km') return matchesSearch && doc.distNumber <= 10
    if (doctorFilter === 'Rating 4.9+') return matchesSearch && doc.rating >= 4.9
    if (doctorFilter === 'Apollo') return matchesSearch && doc.hospital.includes('Apollo')
    if (doctorFilter === 'Fortis') return matchesSearch && doc.hospital.includes('Fortis')
    return matchesSearch
  })

  // Handle Share with a Doctor
  const handleSendReportToDoctor = (doctor) => {
    setSendingDoctorId(doctor.id)
    setTimeout(() => {
      setSendingDoctorId(null)
      setSentDoctorIds(prev => ({ ...prev, [doctor.id]: true }))
      setShareSuccessToast(`Report ${selectedReport?.id} shared with ${doctor.name} at ${doctor.hospital}!`)
      setTimeout(() => setShareSuccessToast(null), 4000)
    }, 800)
  }

  // Drag handler for resizing the reports sidebar
  const handleStartDrag = useCallback((e) => {
    e.preventDefault()
    setIsResizing(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    const onPointerMove = (moveEvent) => {
      const maxWidth = window.innerWidth * 0.70 // up to 70% screen width
      const clientX = moveEvent.clientX

      if (clientX < MIN_REPORTS_WIDTH) {
        setSidebarWidth(0)
        setIsCollapsed(true)
      } else {
        const clampedWidth = Math.min(Math.max(clientX, 200), maxWidth)
        setSidebarWidth(clampedWidth)
        setIsCollapsed(false)
      }
    }

    const onPointerUp = () => {
      setIsResizing(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }, [])

  // Toggle collapse/expand
  const handleToggleCollapse = useCallback(() => {
    if (isCollapsed || sidebarWidth === 0) {
      setSidebarWidth(DEFAULT_REPORTS_WIDTH)
      setIsCollapsed(false)
      localStorage.setItem('patient_reports_width', String(DEFAULT_REPORTS_WIDTH))
      localStorage.setItem('patient_reports_collapsed', 'false')
    } else {
      setSidebarWidth(0)
      setIsCollapsed(true)
      localStorage.setItem('patient_reports_collapsed', 'true')
    }
  }, [isCollapsed, sidebarWidth])

  // Save width when drag completes
  useEffect(() => {
    if (!isResizing && sidebarWidth > 0) {
      localStorage.setItem('patient_reports_width', String(sidebarWidth))
      localStorage.setItem('patient_reports_collapsed', 'false')
    }
  }, [isResizing, sidebarWidth])

  // Resize listener to clamp if browser window shrinks
  useEffect(() => {
    const handleResize = () => {
      const maxWidth = window.innerWidth * 0.70
      setSidebarWidth(current => (current > maxWidth ? maxWidth : current))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleFileSelect = (file) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setUploadedScan(url)
    setAnalyzing(true)

    // Simulate real AI analysis latency
    setTimeout(() => {
      setAnalyzing(false)
    }, 2000)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const effectiveWidth = isCollapsed ? 0 : sidebarWidth

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-warm)', color: 'var(--text-dark)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Toast Notification ── */}
      {shareSuccessToast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 110,
          background: '#065F46', border: '1.5px solid #10B981', color: 'white',
          padding: '14px 20px', borderRadius: '14px', boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13.5px', fontWeight: 600,
          animation: 'fadeInUp 0.3s ease'
        }}>
          <CheckCircle2 size={18} color="#34D399" />
          <span>{shareSuccessToast}</span>
        </div>
      )}

      {/* ── Patient Portal Header ── */}
      <header style={{
        height: '70px', background: 'var(--bg-card)',
        borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        {/* Logo & Portal title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={logo}
              alt="SpineLIT"
              style={{ height: '42px', filter: 'invert(1) hue-rotate(210deg) brightness(1.5)', mixBlendMode: 'screen' }}
            />
          </Link>
          <div style={{ height: '24px', width: '1px', background: 'rgba(139, 92, 246, 0.25)' }} />

          <button
            onClick={handleToggleCollapse}
            title={effectiveWidth === 0 ? "Show Reports History" : "Hide Reports History"}
            style={{
              padding: '6px 12px', borderRadius: '8px',
              background: effectiveWidth === 0 ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              color: effectiveWidth === 0 ? 'var(--primary-light)' : 'var(--text-muted)',
              fontSize: '12px', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            {effectiveWidth === 0 ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
            <span>{effectiveWidth === 0 ? 'Show Reports' : 'Hide Reports'}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
              color: 'white', fontSize: '11px', fontWeight: 800, padding: '4px 10px',
              borderRadius: '8px', letterSpacing: '0.5px', textTransform: 'uppercase'
            }}>
              Patient Portal
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#10B981', fontWeight: 600 }}>
              <ShieldCheck size={14} /> HIPAA Secure
            </span>
          </div>
        </div>

        {/* User profile & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={displayName}
                referrerPolicy="no-referrer"
                style={{
                  width: '38px', height: '38px', borderRadius: '12px',
                  objectFit: 'cover', border: '1.5px solid rgba(167, 139, 250, 0.5)',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
                }}
              />
            ) : (
              <div style={{
                width: '38px', height: '38px', borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 800, fontSize: '14px'
              }}>
                {displayName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '14px', fontWeight: 700, color: 'white', lineHeight: 1 }}>{displayName}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>Patient Account</p>
            </div>
          </div>

          <div style={{ height: '28px', width: '1px', background: 'rgba(139, 92, 246, 0.2)' }} />

          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#f87171', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </header>

      {/* ── Main Portal Body (Left Reports Sidebar + Splitter + Right Analysis Workspace) ── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 'calc(100vh - 70px)', position: 'relative' }}>

        {/* ── LEFT COLUMN: Previous Generated Reports & History ── */}
        <aside style={{
          width: `${effectiveWidth}px`,
          background: 'var(--bg-card)', borderRight: effectiveWidth > 0 ? '1px solid rgba(139, 92, 246, 0.15)' : 'none',
          display: effectiveWidth > 0 ? 'flex' : 'none', flexDirection: 'column', height: 'calc(100vh - 70px)',
          position: 'sticky', top: '70px', overflow: 'hidden', flexShrink: 0,
          transition: isResizing ? 'none' : 'width 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
          userSelect: isResizing ? 'none' : 'auto'
        }}>
          {/* Section Header */}
          <div style={{ padding: '20px 20px 14px', borderBottom: '1px solid rgba(139, 92, 246, 0.12)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="var(--primary-light)" />
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-dark)', margin: 0, whiteSpace: 'nowrap' }}>
                  Past Reports
                </h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  background: 'rgba(124, 58, 237, 0.15)', color: 'var(--primary-light)',
                  padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap'
                }}>
                  {sampleReports.length} Scans
                </span>
                <button
                  onClick={handleToggleCollapse}
                  title="Hide Reports"
                  style={{
                    padding: '4px', borderRadius: '6px', background: 'transparent',
                    border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
              </div>
            </div>

            {/* Search filter */}
            <div style={{ position: 'relative' }}>
              <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search scans or doctors..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px 8px 34px', fontSize: '12.5px',
                  background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '10px', color: 'var(--text-dark)', outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Reports List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredReports.map((report) => {
                const isSelected = selectedReport?.id === report.id
                const sev = sevColors[report.severity] || sevColors['Grade I']

                return (
                  <div
                    key={report.id}
                    onClick={() => { setSelectedReport(report); setUploadedScan(null) }}
                    style={{
                      padding: '14px 16px', borderRadius: '14px', cursor: 'pointer',
                      background: isSelected ? 'rgba(124, 58, 237, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1.5px solid ${isSelected ? 'var(--primary)' : 'rgba(139, 92, 246, 0.12)'}`,
                      boxShadow: isSelected ? '0 4px 16px rgba(124, 58, 237, 0.2)' : 'none',
                      transition: 'all 0.2s ease',
                      display: 'flex', flexDirection: 'column', gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-light)', fontFamily: 'monospace' }}>
                        {report.id}
                      </span>
                      <span style={{
                        background: sev.bg, color: sev.color, border: `1px solid ${sev.border}`,
                        fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px'
                      }}>
                        {report.severity}
                      </span>
                    </div>

                    <div>
                      <p style={{ fontSize: '13.5px', fontWeight: 700, color: 'white', margin: '0 0 2px' }}>
                        {report.type}
                      </p>
                      <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={11} /> {report.date} · {report.time}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid rgba(139, 92, 246, 0.08)' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                        {report.doctor}
                      </span>
                      <span style={{ fontSize: '11px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <CheckCircle2 size={11} /> {report.status}
                      </span>
                    </div>
                  </div>
                )
              })}

              {filteredReports.length === 0 && (
                <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No reports matching "{search}"
                </div>
              )}
            </div>
          </div>

          {/* Quick Upload CTA at bottom of list */}
          <div style={{ padding: '14px', borderTop: '1px solid rgba(139, 92, 246, 0.15)', background: 'rgba(10, 11, 30, 0.5)', flexShrink: 0 }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100%', padding: '10px 16px', borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                color: 'white', fontSize: '13px', fontWeight: 700, border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)', whiteSpace: 'nowrap'
              }}
            >
              <Upload size={15} /> Upload New Scan
            </button>
          </div>
        </aside>

        {/* ── DRAG HANDLE SPLITTER (Between Left & Right Panels) ── */}
        {effectiveWidth > 0 && (
          <div
            onPointerDown={handleStartDrag}
            title="Drag to resize (Up to 70% screen) or double click to collapse"
            onDoubleClick={handleToggleCollapse}
            style={{
              width: '8px', cursor: 'col-resize', zIndex: 40,
              background: isResizing ? 'var(--primary-light)' : 'transparent',
              transition: 'background 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', flexShrink: 0, marginLeft: '-4px'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(167, 139, 250, 0.5)'}
            onMouseLeave={e => { if (!isResizing) e.currentTarget.style.background = 'transparent' }}
          >
            <div style={{
              width: '2px', height: '36px', borderRadius: '999px',
              background: isResizing ? 'white' : 'rgba(167, 139, 250, 0.4)',
              pointerEvents: 'none'
            }} />
          </div>
        )}

        {/* ── RIGHT AREA: Spine Analysis Workspace ── */}
        <main style={{
          flex: 1, padding: '32px 40px', overflowY: 'auto', display: 'flex', flexDirection: 'column',
          gap: '28px', minWidth: 0
        }}>

          {/* Top Banner / Upload Zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            style={{
              background: dragging ? 'rgba(124, 58, 237, 0.12)' : 'var(--bg-card)',
              border: `2px dashed ${dragging ? 'var(--primary-light)' : 'rgba(139, 92, 246, 0.25)'}`,
              borderRadius: '20px', padding: '28px 32px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)', transition: 'all 0.2s ease', gap: '24px'
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={e => e.target.files && handleFileSelect(e.target.files[0])}
              accept=".dcm,image/png,image/jpeg"
              style={{ display: 'none' }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(76, 29, 149, 0.2))',
                border: '1.5px solid rgba(139, 92, 246, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <ScanLine size={28} color="var(--primary-light)" />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'white', margin: '0 0 4px' }}>
                  AI Spine Analysis Workspace
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0 }}>
                  Upload a new MRI or X-ray scan (DICOM, JPEG, PNG) to analyze severity and generate an AI report.
                </p>
              </div>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '12px 24px', borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                color: 'white', fontSize: '14px', fontWeight: 700, border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                whiteSpace: 'nowrap', boxShadow: '0 4px 18px rgba(124, 58, 237, 0.35)'
              }}
            >
              <Upload size={16} /> Choose Scan File
            </button>
          </div>

          {/* Analysis View: Show uploaded scan OR selected report */}
          {analyzing ? (
            <div style={{
              background: 'var(--bg-card)', borderRadius: '20px', padding: '60px 32px',
              border: '1.5px solid rgba(139, 92, 246, 0.2)', textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px'
            }}>
              <div style={{
                width: '70px', height: '70px', borderRadius: '20px',
                background: 'rgba(124, 58, 237, 0.15)', border: '1.5px solid var(--primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Brain size={36} color="var(--primary-light)" className="animate-pulse" />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'white', margin: '0 0 6px' }}>
                  AI Spine Analysis in Progress...
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
                  Deep learning models are detecting disc heights, canal alignment, and grading spinal severity.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-light)', fontSize: '13px', fontWeight: 600 }}>
                <RefreshCw size={14} className="spin" /> Processing DICOM scan slices...
              </div>
            </div>
          ) : selectedReport ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Report Header Bar */}
              <div style={{
                background: 'var(--bg-card)', borderRadius: '18px', padding: '20px 24px',
                border: '1.5px solid rgba(139, 92, 246, 0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'white', margin: 0 }}>
                      {selectedReport.type} Report
                    </h2>
                    <span style={{
                      background: sevColors[selectedReport.severity]?.bg,
                      color: sevColors[selectedReport.severity]?.color,
                      border: `1px solid ${sevColors[selectedReport.severity]?.border}`,
                      fontSize: '12px', fontWeight: 800, padding: '3px 12px', borderRadius: '999px'
                    }}>
                      {selectedReport.severity}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                    Report ID: <strong style={{ color: 'var(--primary-light)' }}>{selectedReport.id}</strong> · Performed on {selectedReport.date} by {selectedReport.doctor} ({selectedReport.hospital})
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => alert(`Downloading full PDF report for ${selectedReport.id}...`)}
                    style={{
                      padding: '9px 18px', borderRadius: '10px',
                      background: 'rgba(124, 58, 237, 0.15)', border: '1.5px solid rgba(139, 92, 246, 0.3)',
                      color: 'var(--primary-light)', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                  >
                    <Download size={15} /> Download PDF
                  </button>

                  {/* ── SHARE WITH DOCTOR TRIGGER BUTTON ── */}
                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    style={{
                      padding: '9px 18px', borderRadius: '10px',
                      background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                      color: 'white', fontSize: '13px', fontWeight: 700, border: 'none',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                      boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)', transition: 'transform 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <GoogleIcon />
                    <span>Share with Doctor</span>
                  </button>
                </div>
              </div>

              {/* Scan Visualization + AI Insights Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '24px', alignItems: 'start' }}>

                {/* Left: Scan Image & Heatmap Box */}
                <div style={{
                  background: 'var(--bg-card)', borderRadius: '20px', padding: '20px',
                  border: '1.5px solid rgba(139, 92, 246, 0.15)', display: 'flex', flexDirection: 'column', gap: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Eye size={15} color="var(--primary-light)" /> Spine Scan Visualizer
                    </span>
                    <button
                      onClick={() => setShowHeatmap(h => !h)}
                      style={{
                        padding: '4px 10px', borderRadius: '8px',
                        background: showHeatmap ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        color: showHeatmap ? 'var(--primary-light)' : 'var(--text-muted)',
                        fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      <Layers size={12} /> {showHeatmap ? 'Heatmap ON' : 'Heatmap OFF'}
                    </button>
                  </div>

                  {/* Scan image with heatmap overlay simulation */}
                  <div style={{
                    position: 'relative', borderRadius: '14px', overflow: 'hidden',
                    background: '#000', border: '1px solid rgba(139, 92, 246, 0.2)',
                    height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <img
                      src={uploadedScan || spineMri}
                      alt="Spine Scan"
                      style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                    />

                    {/* AI Bounding box & heatmap highlight */}
                    {showHeatmap && (
                      <div style={{
                        position: 'absolute', top: '48%', left: '35%', width: '110px', height: '55px',
                        border: '2px solid #EF4444', borderRadius: '8px',
                        background: 'radial-gradient(circle, rgba(239, 68, 68, 0.35) 0%, transparent 80%)',
                        boxShadow: '0 0 16px rgba(239, 68, 68, 0.4)',
                        display: 'flex', alignItems: 'flex-start', padding: '4px 6px'
                      }}>
                        <span style={{ background: '#EF4444', color: 'white', fontSize: '9px', fontWeight: 800, padding: '1px 5px', borderRadius: '4px' }}>
                          L4-L5 Bulge
                        </span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-muted)', padding: '0 4px' }}>
                    <span>Model: Spine-Net V3</span>
                    <span>Confidence: <strong style={{ color: '#10B981' }}>{selectedReport.aiConfidence}%</strong></span>
                  </div>
                </div>

                {/* Right: AI Score, Findings & Doctor Recommendation */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                  {/* Severity Score Card */}
                  <div style={{
                    background: 'var(--bg-card)', borderRadius: '20px', padding: '24px',
                    border: '1.5px solid rgba(139, 92, 246, 0.15)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'
                  }}>
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        AI Severity Score
                      </span>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                        <span style={{ fontSize: '36px', fontWeight: 900, color: 'white' }}>
                          {selectedReport.severityScore}
                        </span>
                        <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>/ 10</span>
                      </div>
                      <div style={{
                        marginTop: '8px', height: '6px', width: '100%', background: 'rgba(255,255,255,0.08)',
                        borderRadius: '999px', overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%', width: `${selectedReport.severityScore * 10}%`,
                          background: selectedReport.severityScore > 6 ? '#F59E0B' : '#10B981',
                          borderRadius: '999px'
                        }} />
                      </div>
                    </div>

                    <div style={{ borderLeft: '1px solid rgba(139, 92, 246, 0.15)', paddingLeft: '20px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Diagnosis Status
                      </span>
                      <p style={{ fontSize: '18px', fontWeight: 800, color: 'white', margin: '6px 0 2px' }}>
                        {selectedReport.severity === 'Grade I' ? 'Mild Alignment Issue' : 'Moderate Disc Bulge'}
                      </p>
                      <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={13} /> Clinically validated
                      </span>
                    </div>
                  </div>

                  {/* Key AI Findings */}
                  <div style={{
                    background: 'var(--bg-card)', borderRadius: '20px', padding: '24px',
                    border: '1.5px solid rgba(139, 92, 246, 0.15)'
                  }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'white', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Brain size={16} color="var(--primary-light)" /> Key AI Findings
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {selectedReport.findings.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13.5px', color: 'var(--text-dark)' }}>
                          <span style={{
                            width: '20px', height: '20px', borderRadius: '6px',
                            background: 'rgba(124, 58, 237, 0.15)', color: 'var(--primary-light)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px',
                            fontWeight: 800, flexShrink: 0, marginTop: '1px'
                          }}>
                            {i + 1}
                          </span>
                          <span style={{ lineHeight: 1.5 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Doctor Recommendation & Next Steps */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(76, 29, 149, 0.08))',
                    borderRadius: '20px', padding: '24px', border: '1.5px solid rgba(139, 92, 246, 0.25)'
                  }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'white', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileCheck size={16} color="#10B981" /> Doctor's Recommendation
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-dark)', lineHeight: 1.6, margin: '0 0 14px' }}>
                      {selectedReport.recommendation}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <span>Attending: <strong style={{ color: 'white' }}>{selectedReport.doctor}</strong></span>
                        <span>·</span>
                        <span>Hospital: <strong style={{ color: 'white' }}>{selectedReport.hospital}</strong></span>
                      </div>
                      <button
                        onClick={() => setIsShareModalOpen(true)}
                        style={{
                          background: 'none', border: 'none', color: 'var(--primary-light)',
                          fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                        }}
                      >
                        Find 2nd Opinion on Google <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          ) : null}

        </main>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          GOOGLE DOCTORS DIRECTORY MODAL (Live Online Nearby Specialists)
      ══════════════════════════════════════════════════════════════════ */}
      {isShareModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(5, 6, 18, 0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px'
        }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsShareModalOpen(false) }}
        >
          <div style={{
            background: '#11122a', border: '1.5px solid rgba(139, 92, 246, 0.25)',
            borderRadius: '24px', width: '100%', maxWidth: '840px', maxHeight: '90vh',
            display: 'flex', flexDirection: 'column', boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
            overflow: 'hidden', animation: 'fadeInUp 0.25s ease'
          }}>

            {/* Modal Top Header */}
            <div style={{
              padding: '22px 28px 16px', borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
              background: 'linear-gradient(180deg, rgba(124, 58, 237, 0.08) 0%, transparent 100%)',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <GoogleIcon />
                  <h2 style={{ fontSize: '19px', fontWeight: 800, color: 'white', margin: 0 }}>
                    Nearby Spine Specialists (Live Google & Geolocation)
                  </h2>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                  Select an available specialist near you to share report <strong style={{ color: 'var(--primary-light)' }}>{selectedReport?.id}</strong> ({selectedReport?.type}).
                </p>
              </div>

              <button
                onClick={() => setIsShareModalOpen(false)}
                style={{
                  width: '34px', height: '34px', borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(139, 92, 246, 0.2)',
                  color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; e.currentTarget.style.color = '#f87171'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <X size={18} />
              </button>
            </div>

            {/* ── Patient Geolocation & Search Bar ── */}
            <div style={{ padding: '14px 28px', borderBottom: '1px solid rgba(139, 92, 246, 0.12)', background: 'rgba(10, 11, 30, 0.4)' }}>

              {/* Location Badge + GPS Refresh */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <MapPin size={14} color="#10B981" />
                  </div>
                  <span style={{ fontSize: '13px', color: 'white', fontWeight: 600 }}>
                    Patient Location: <strong style={{ color: '#34D399' }}>{patientLocation ? `${patientLocation.area}, ${patientLocation.city}` : 'Detecting your location...'}</strong>
                  </span>
                </div>

                <button
                  disabled={isLocating}
                  onClick={detectLocationAndFetchDoctors}
                  style={{
                    padding: '5px 12px', borderRadius: '8px',
                    background: 'rgba(124, 58, 237, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)',
                    color: 'var(--primary-light)', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.15s'
                  }}
                >
                  <LocateFixed size={13} className={isLocating ? 'spin' : ''} />
                  <span>{isLocating ? 'Locating...' : 'Update My Location'}</span>
                </button>
              </div>

              {/* Search input */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search by city (e.g. Mumbai, Pune, Delhi, Bengaluru), hospital or doctor..."
                    value={doctorSearch}
                    onChange={e => setDoctorSearch(e.target.value)}
                    style={{
                      width: '100%', padding: '9px 14px 9px 36px', fontSize: '13px',
                      background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(139, 92, 246, 0.25)',
                      borderRadius: '12px', color: 'white', outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Filter Chips */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
                {['All', 'Under 10 km', 'Available Today', 'Rating 4.9+', 'Apollo', 'Fortis'].map(chip => (
                  <button
                    key={chip}
                    onClick={() => setDoctorFilter(chip)}
                    style={{
                      padding: '5px 12px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 600,
                      background: doctorFilter === chip ? 'var(--primary)' : 'rgba(255, 255, 255, 0.04)',
                      color: doctorFilter === chip ? 'white' : 'var(--text-muted)',
                      border: `1px solid ${doctorFilter === chip ? 'var(--primary)' : 'rgba(139, 92, 246, 0.18)'}`,
                      cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s'
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Doctors List Scroll Container */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '18px 28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {isLoadingDoctors ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <RefreshCw size={24} color="var(--primary-light)" className="spin" />
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
                    Scanning nearby spine specialists & hospitals around your location...
                  </p>
                </div>
              ) : filteredDoctors.map(doctor => {
                const isSent = Boolean(sentDoctorIds[doctor.id])
                const isSending = sendingDoctorId === doctor.id

                return (
                  <div
                    key={doctor.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: `1.5px solid ${isSent ? '#10B981' : 'rgba(139, 92, 246, 0.18)'}`,
                      borderRadius: '16px', padding: '16px 20px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      gap: '20px', transition: 'all 0.2s ease',
                      boxShadow: isSent ? '0 4px 18px rgba(16, 185, 129, 0.15)' : 'none'
                    }}
                  >
                    {/* Left: Doctor Photo + Details */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <img
                          src={doctor.avatar}
                          alt={doctor.name}
                          onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex' }}
                          style={{
                            width: '54px', height: '54px', borderRadius: '16px',
                            objectFit: 'cover', border: '1.5px solid rgba(167, 139, 250, 0.4)'
                          }}
                        />
                        <div style={{
                          display: 'none', width: '54px', height: '54px', borderRadius: '16px',
                          background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                          alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '18px'
                        }}>
                          {doctor.initials}
                        </div>
                        <div style={{
                          position: 'absolute', bottom: '-4px', right: '-4px',
                          background: '#10B981', width: '18px', height: '18px', borderRadius: '999px',
                          border: '2px solid #11122a', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }} title="Google Verified Specialist">
                          <Check size={11} color="white" />
                        </div>
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <h4 style={{ fontSize: '15.5px', fontWeight: 800, color: 'white', margin: 0 }}>
                            {doctor.name}
                          </h4>
                          <span style={{
                            background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24',
                            padding: '1px 6px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                            display: 'flex', alignItems: 'center', gap: '3px'
                          }}>
                            <Star size={10} fill="#FBBF24" color="#FBBF24" /> {doctor.rating} ({doctor.reviewsCount})
                          </span>
                          <span style={{
                            background: 'rgba(16, 185, 129, 0.12)', color: '#34D399',
                            padding: '1px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                            display: 'flex', alignItems: 'center', gap: '3px'
                          }}>
                            <Navigation size={10} /> {doctor.distance}
                          </span>
                        </div>

                        <p style={{ fontSize: '12.5px', color: 'var(--primary-light)', fontWeight: 600, margin: '2px 0 4px' }}>
                          {doctor.title} · <span style={{ color: 'var(--text-muted)' }}>{doctor.experience}</span>
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} color="var(--primary-light)" /> {doctor.hospital}
                          </span>
                          <span>·</span>
                          <span style={{ color: doctor.availability.includes('Today') ? '#34D399' : '#A78BFA', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={11} /> {doctor.availableSlot}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                          {doctor.specialties.map(spec => (
                            <span key={spec} style={{
                              background: 'rgba(255, 255, 255, 0.04)', color: 'var(--text-light)',
                              padding: '2px 8px', borderRadius: '6px', fontSize: '10.5px', fontWeight: 500
                            }}>
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', flexShrink: 0 }}>
                      <button
                        disabled={isSent || isSending}
                        onClick={() => handleSendReportToDoctor(doctor)}
                        style={{
                          padding: '9px 18px', borderRadius: '10px',
                          background: isSent
                            ? '#065F46'
                            : 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                          color: isSent ? '#34D399' : 'white',
                          border: isSent ? '1px solid #10B981' : 'none',
                          fontSize: '13px', fontWeight: 700, cursor: isSent ? 'default' : 'pointer',
                          display: 'flex', alignItems: 'center', gap: '6px',
                          boxShadow: isSent ? 'none' : '0 3px 14px rgba(124, 58, 237, 0.35)',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {isSending ? (
                          <><RefreshCw size={14} className="spin" /> Sharing...</>
                        ) : isSent ? (
                          <><CheckCircle2 size={14} /> Report Sent</>
                        ) : (
                          <><Send size={14} /> Send Report</>
                        )}
                      </button>

                      <a
                        href={doctor.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex',
                          alignItems: 'center', gap: '4px', textDecoration: 'none'
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-light)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                      >
                        <ExternalLink size={11} /> Google Directions
                      </a>
                    </div>
                  </div>
                )
              })}

              {!isLoadingDoctors && filteredDoctors.length === 0 && (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 4px' }}>No spine specialists found</p>
                  <p style={{ fontSize: '12px', margin: 0 }}>Try searching another city or clearing your filter.</p>
                </div>
              )}
            </div>

            {/* Modal Bottom Footer */}
            <div style={{
              padding: '16px 28px', borderTop: '1px solid rgba(139, 92, 246, 0.15)',
              background: 'rgba(10, 11, 30, 0.5)', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} color="#10B981" /> Encrypted HIPAA-compliant sharing
              </span>
              <button
                onClick={() => setIsShareModalOpen(false)}
                style={{
                  padding: '6px 16px', borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(139, 92, 246, 0.2)',
                  color: 'white', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
