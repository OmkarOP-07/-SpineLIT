import { useState, useEffect, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import PatientPortalPage from '../../pages/dashboard/PatientPortalPage'

const DEFAULT_DOCTOR_SIDEBAR_WIDTH = 240
const MIN_SIDEBAR_WIDTH = 70

export default function DashboardLayout() {
  const { user } = useAuth()

  // Draggable sidebar state
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('doctor_sidebar_width')
    return saved !== null ? Number(saved) : DEFAULT_DOCTOR_SIDEBAR_WIDTH
  })
  const [isDragging, setIsDragging] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('doctor_sidebar_collapsed') === 'true'
  })

  // Start dragging handler
  const handleStartDrag = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    const onPointerMove = (moveEvent) => {
      const maxWidth = window.innerWidth * 0.70 // up to 70% screen width
      const clientX = moveEvent.clientX

      if (clientX < MIN_SIDEBAR_WIDTH) {
        // Snap to collapsed/0
        setSidebarWidth(0)
        setIsCollapsed(true)
      } else {
        const clampedWidth = Math.min(Math.max(clientX, 160), maxWidth)
        setSidebarWidth(clampedWidth)
        setIsCollapsed(false)
      }
    }

    const onPointerUp = () => {
      setIsDragging(false)
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
      setSidebarWidth(DEFAULT_DOCTOR_SIDEBAR_WIDTH)
      setIsCollapsed(false)
      localStorage.setItem('doctor_sidebar_width', String(DEFAULT_DOCTOR_SIDEBAR_WIDTH))
      localStorage.setItem('doctor_sidebar_collapsed', 'false')
    } else {
      setSidebarWidth(0)
      setIsCollapsed(true)
      localStorage.setItem('doctor_sidebar_collapsed', 'true')
    }
  }, [isCollapsed, sidebarWidth])

  // Save width when dragging ends
  useEffect(() => {
    if (!isDragging && sidebarWidth > 0) {
      localStorage.setItem('doctor_sidebar_width', String(sidebarWidth))
      localStorage.setItem('doctor_sidebar_collapsed', 'false')
    }
  }, [isDragging, sidebarWidth])

  // Window resize handler: clamp width if user resizes browser window
  useEffect(() => {
    const handleResize = () => {
      const maxWidth = window.innerWidth * 0.70
      setSidebarWidth(current => (current > maxWidth ? maxWidth : current))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // For Patient login: Clean single page with Left Reports & Right Spine Analysis Workspace
  if (user?.role === 'patient') {
    return <PatientPortalPage />
  }

  const effectiveWidth = isCollapsed ? 0 : sidebarWidth

  // For Doctor login: Full dashboard with all sidebar items and draggable resize
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-warm)' }}>
      <Sidebar
        width={effectiveWidth}
        isDragging={isDragging}
        onStartDrag={handleStartDrag}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      <div
        className="flex-1 flex flex-col min-w-0"
        style={{
          marginLeft: `${effectiveWidth}px`,
          transition: isDragging ? 'none' : 'margin-left 0.18s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <TopBar />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
