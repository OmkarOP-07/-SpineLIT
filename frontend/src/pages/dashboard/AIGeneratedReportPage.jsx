import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, Download, Printer, Send, ShieldCheck, CheckCircle,
  User, Activity, Eye, TrendingUp, AlertTriangle, Brain, ChevronLeft,
  Stethoscope, Check
} from 'lucide-react'
import logo from '../../assets/logo.png'
import { SPINE_PROFILES } from '../../data/spineScanProfiles'

export default function AIGeneratedReportPage() {
  const reportRef = useRef(null)
  const [activeProfileId, setActiveProfileId] = useState(() => {
    return sessionStorage.getItem('spinelit_active_profile') || 'lumbar_lateral'
  })

  const uploadedImage = sessionStorage.getItem('spinelit_uploaded_image')
  const uploadedFileName = sessionStorage.getItem('spinelit_uploaded_filename')
  const patientData = JSON.parse(sessionStorage.getItem('spinelit_patient_data') || '{}')

  const profile = SPINE_PROFILES[activeProfileId] || SPINE_PROFILES.lumbar_lateral

  const displayImage = uploadedImage || profile.image
  const displayPatientName = patientData.patientName || profile.patient.name
  const displayAge = patientData.age || profile.patient.age
  const displayGender = patientData.gender || profile.patient.gender
  const displaySymptoms = patientData.selectedSymptoms?.length ? patientData.selectedSymptoms : profile.patient.symptoms
  const displaySeverity = patientData.severity || profile.patient.severity
  const displayDuration = patientData.symptomDuration || profile.patient.duration

  const handlePrint = () => {
    window.print()
  }

  const SectionTitle = ({ icon: Icon, title }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid var(--primary)', paddingBottom: '8px', marginBottom: '16px', marginTop: '28px' }}>
      <Icon size={18} color="var(--primary)" />
      <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>{title}</h3>
    </div>
  )

  const DataRow = ({ label, value }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '16px', marginBottom: '8px' }}>
      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontSize: '13px', color: 'var(--text-dark)' }}>{value}</span>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto' }} className="animate-fadeIn">

      {/* Actions Header (Not printed) */}
      <div className="no-print" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px',
        background: 'var(--bg-card)', padding: '16px 24px', borderRadius: '16px',
        border: '1px solid rgba(133,57,83,0.15)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/dashboard/ai-analysis-result" style={{ color: 'var(--text-dark)', display: 'flex', alignItems: 'center' }}>
            <ChevronLeft size={22} />
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>Clinical Report</h1>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: 'rgba(133,57,83,0.12)', color: 'var(--primary)' }}>
                Lower Back Pain: DDD & Spondylolisthesis
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
              Patient: {displayPatientName} · {profile.condition}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={16} /> Print
          </button>
          <button className="btn btn-outline" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Export PDF
          </button>
          <Link to="/dashboard/doctor-feedback" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={16} /> Doctor Feedback
          </Link>
        </div>
      </div>

      {/* Report Document */}
      <div
        ref={reportRef}
        style={{
          background: '#fff',
          padding: '50px 70px',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          border: '1px solid #E5E1E3',
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {/* Report Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E5E1E3', paddingBottom: '24px', marginBottom: '24px' }}>
          <div>
            <img src={logo} alt="SpineLIT" style={{ height: '42px', marginBottom: '14px' }} />
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#2C2C2C', margin: 0 }}>
              Automated Spine Clinical Report
            </h2>
            <p style={{ fontSize: '13px', color: '#6B6B6B', marginTop: '4px', marginBottom: 0 }}>
              Target Pathology: Lower Back Pain (Degenerative Disc Disease & Spondylolisthesis)
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#2C2C2C', margin: 0, marginBottom: '4px' }}>
              Exam: {profile.patient.examDate}
            </p>
            <p style={{ fontSize: '12px', color: '#6B6B6B', margin: 0 }}>
              Scan File: {uploadedFileName || profile.fileName}
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '10px', padding: '5px 12px', background: '#FFFBEB', color: '#D97706', borderRadius: '6px', border: '1px solid #FEF3C7', fontSize: '11px', fontWeight: 700 }}>
              <AlertTriangle size={13} /> Requires Specialist Verification
            </div>
          </div>
        </div>

        {/* Patient Info */}
        <SectionTitle icon={User} title="Patient Information" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <DataRow label="Patient Name:" value={displayPatientName} />
            <DataRow label="Patient ID:" value={profile.patient.id} />
          </div>
          <div>
            <DataRow label="Age / Gender:" value={`${displayAge} yrs / ${displayGender}`} />
            <DataRow label="Exam Modality:" value={`${profile.modality} (${profile.view})`} />
          </div>
        </div>

        {/* Clinical Info */}
        <SectionTitle icon={Activity} title="Clinical Presentation (Lower Back Pain)" />
        <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '8px', border: '1px solid #F3F4F6' }}>
          <DataRow label="Reported Symptoms:" value={displaySymptoms.join(', ')} />
          <DataRow label="Duration:" value={displayDuration} />
          <DataRow label="Pain Severity Score:" value={displaySeverity} />
          <DataRow label="Clinical Anomaly Focus:" value={profile.metrics.targetAnomaly} />
        </div>

        {/* Imaging Analysis Findings Table */}
        <SectionTitle icon={Eye} title="Segmented Imaging Findings" />
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '14px' }}>
          <img
            src={displayImage}
            alt="Scan Thumbnail"
            style={{ width: '130px', maxHeight: '160px', objectFit: 'contain', background: '#000', borderRadius: '8px', border: '1px solid #E5E7EB' }}
          />
          <div style={{ flex: 1 }}>
            <DataRow label="Target Anatomy:" value="Lumbar Spine L1–S1 (Sagittal / AP / Lateral)" />
            <DataRow label="Scan File Name:" value={uploadedFileName || profile.fileName} />
            <DataRow label="Identified Lesion:" value={profile.metrics.targetAnomaly} />
            <DataRow label="AI Mean Confidence:" value={profile.metrics.meanConfidence} />
          </div>
        </div>

        <div style={{ marginTop: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#F3F4F6', borderBottom: '1px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '10px 16px', fontWeight: 700, color: '#4B5563' }}>Region</th>
                <th style={{ padding: '10px 16px', fontWeight: 700, color: '#4B5563' }}>Morphological Finding</th>
                <th style={{ padding: '10px 16px', fontWeight: 700, color: '#4B5563' }}>Severity</th>
                <th style={{ padding: '10px 16px', fontWeight: 700, color: '#4B5563' }}>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {profile.findings.map((f, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700 }}>{f.region}</td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>
                    <strong>{f.feature}</strong>
                    {f.desc && <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>{f.desc}</div>}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      color: f.severity === 'Severe' ? '#DC2626' : f.severity === 'Moderate' ? '#D97706' : '#059669',
                      fontWeight: 700
                    }}>
                      {f.severity}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#4B5563', fontWeight: 600 }}>{f.confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Assessment & Longitudinal Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div>
            <SectionTitle icon={Brain} title="AI Assessment" />
            <DataRow label="Primary Condition:" value={<span style={{ fontWeight: 700, color: '#D97706' }}>{profile.condition}</span>} />
            <DataRow label="Severity Grade:" value={profile.metrics.severityGrade} />
            <DataRow label="Diagnostic Confidence:" value={`${profile.metrics.aiConfidence}% (Mean Landmark: ${profile.metrics.meanConfidence})`} />
          </div>
          <div>
            <SectionTitle icon={TrendingUp} title="Longitudinal / Biomechanical Status" />
            <div style={{ padding: '14px', background: '#FFF8EC', border: '1px solid #FDE68A', borderRadius: '8px' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#92400E', margin: '0 0 4px 0' }}>
                {profile.metrics.progression}
              </p>
              <p style={{ fontSize: '12px', color: '#92400E', margin: 0, lineHeight: '1.4' }}>
                {profile.metrics.progressionSub}
              </p>
            </div>
          </div>
        </div>

        {/* Clinical Intelligence Context */}
        <SectionTitle icon={FileText} title="Evidence-Based Clinical Guidelines (RAG)" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {profile.ragContext.map((ctx, i) => (
            <div key={i} style={{ padding: '10px 14px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px', color: '#374151', lineHeight: '1.5' }}>
              <strong>{ctx.type}:</strong> {ctx.content}
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>Source: {ctx.source}</div>
            </div>
          ))}
        </div>

        {/* Clinical Conclusion */}
        <SectionTitle icon={ShieldCheck} title="Clinical Conclusion & Recommended Care Plan" />
        <div style={{ padding: '16px', background: 'rgba(133,57,83,0.05)', border: '1px solid rgba(133,57,83,0.15)', borderRadius: '8px', marginBottom: '14px' }}>
          <p style={{ fontSize: '13px', color: '#1F2937', lineHeight: '1.6', margin: 0 }}>
            Imaging confirms <strong>{profile.condition}</strong> ({profile.metrics.severityGrade}) with primary lesion localized to <strong>{profile.metrics.targetAnomaly}</strong>. {profile.conclusionText}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {profile.nextSteps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#374151' }}>
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: step.p === 'high' ? '#EF4444' : step.p === 'medium' ? '#F59E0B' : '#10B981',
              }} />
              <span>{step.text}</span>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #E5E1E3', fontSize: '11px', color: '#9CA3AF', textAlign: 'center' }}>
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', margin: 0, marginBottom: '4px' }}>
            <AlertTriangle size={13} /> Spine-LIT AI-assisted clinical decision support system. Final diagnosis and treatment plan responsibility rests with the attending spine specialist.
          </p>
          <p style={{ margin: 0 }}>Specialized for Lower Back Pain · Lumbar Degenerative Disc Disease & Spondylolisthesis.</p>
        </div>

      </div>
    </div>
  )
}
