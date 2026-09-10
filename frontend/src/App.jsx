import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProtectedRoute from './components/ProtectedRoute'
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
import AIAnalysisResultPage from './pages/dashboard/AIAnalysisResultPage'
import AIGeneratedReportPage from './pages/dashboard/AIGeneratedReportPage'
import PatientLongitudinalViewPage from './pages/dashboard/PatientLongitudinalViewPage'
import DoctorFeedbackLearningMemoryPage from './pages/dashboard/DoctorFeedbackLearningMemoryPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="image-analysis" element={<ImageAnalysisPage />} />
          <Route path="ai-analysis-result" element={<AIAnalysisResultPage />} />
          <Route path="ai-generated-report" element={<AIGeneratedReportPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="patient-history" element={<PatientHistoryPage />} />
          <Route path="patient-longitudinal" element={<PatientLongitudinalViewPage />} />
          <Route path="doctor-feedback" element={<DoctorFeedbackPage />} />
          <Route path="doctor-feedback-learning" element={<DoctorFeedbackLearningMemoryPage />} />
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
