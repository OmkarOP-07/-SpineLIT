import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DashboardLayout from './components/layout/DashboardLayout'
import DashboardPage from './pages/dashboard/DashboardPage'
import PatientsPage from './pages/dashboard/PatientsPage'
import ImageAnalysisPage from './pages/dashboard/ImageAnalysisPage'
import ReportsPage from './pages/dashboard/ReportsPage'
import PatientHistoryPage from './pages/dashboard/PatientHistoryPage'
import DoctorFeedbackPage from './pages/dashboard/DoctorFeedbackPage'
import KnowledgeBasePage from './pages/dashboard/KnowledgeBasePage'
import AnalyticsPage from './pages/dashboard/AnalyticsPage'
import SettingsPage from './pages/dashboard/SettingsPage'
import ProfilePage from './pages/dashboard/ProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="image-analysis" element={<ImageAnalysisPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="patient-history" element={<PatientHistoryPage />} />
          <Route path="doctor-feedback" element={<DoctorFeedbackPage />} />
          <Route path="knowledge-base" element={<KnowledgeBasePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
