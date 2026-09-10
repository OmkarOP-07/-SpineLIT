import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, Download, Printer, Send, ShieldCheck, CheckCircle,
  User, Activity, Eye, TrendingUp, AlertTriangle, Brain, ChevronLeft
} from 'lucide-react'
import logo from '../../assets/logo.png'

const REPORT_DATA = {
  id: 'RPT-2025-0234',
  date: '20 May 2025, 10:52 AM',
  patient: {
    id: 'PNT-2025-0487',
    name: 'Rohit Kumar',
    age: 54,
    sex: 'Male',
    phone: '+91 98765 43210',
  },
  clinical: {
    symptoms: 'Lower back pain, radiating pain to left leg, mild numbness.',
    duration: '3–6 months',
    severity: 'Moderate (5/10)',
    lifestyle: 'Desk-based work, 8-10 hours sitting daily, slightly limited mobility.',
  },
  imaging: {
    scanType: 'X-ray Lumbar Spine',
    findings: [
      { region: 'L4-L5', description: 'Disc height reduction — 28% compared to reference', severity: 'Moderate' },
      { region: 'L3-L4', description: 'Mild spinal canal narrowing observed', severity: 'Mild' },
      { region: 'L5-S1', description: 'Degenerative changes in vertebral body endplates', severity: 'Mild' },
    ]
  },
  aiAssessment: {
    severity: 'Grade II',
    confidence: '87%',
    progression: 'Changed (Grade I → Grade II)',
    reasoning: 'Disc morphology contributes 42% to severity. Bone density patterns contribute 28%. Progression noted over 6 months.',
  },
  ragContext: [
    'Similar cases (n=1,247) show disc height reduction at L4-L5 is common in this age group.',
    'Guidelines recommend monitoring every 6 months for Grade II.',
  ],
  decisionSupport: 'Further Evaluation Recommended. Consider MRI for detailed soft-tissue evaluation.',
}

export default function AIGeneratedReportPage() {
  const reportRef = useRef(null)
  const [isPrinting, setIsPrinting] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const SectionTitle = ({ icon: Icon, title }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid var(--primary)', paddingBottom: '8px', marginBottom: '16px', marginTop: '32px' }}>
      <Icon size={18} color="var(--primary)" />
      <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h3>
    </div>
  )

  const DataRow = ({ label, value }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '16px', marginBottom: '8px' }}>
      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontSize: '13px', color: 'var(--text-dark)' }}>{value}</span>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto' }} className="animate-fadeIn">
      
      {/* Actions Header (Not printed) */}
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', background: 'var(--bg-card)', padding: '16px 24px', borderRadius: '16px', border: '1px solid rgba(133,57,83,0.15)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/dashboard/ai-analysis-result" style={{ color: 'var(--text-dark)' }}>
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-dark)' }}>Clinical Report</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Ready for doctor review or export</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={16} /> Print
          </button>
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Download PDF
          </button>
          <Link to="/dashboard/doctor-feedback" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={16} /> Send for Doctor Review
          </Link>
        </div>
      </div>

      {/* Report Document */}
      <div 
        ref={reportRef}
        style={{ 
          background: '#fff', 
          padding: '60px 80px', 
          borderRadius: '8px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          border: '1px solid #E5E1E3',
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {/* Report Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E5E1E3', paddingBottom: '24px', marginBottom: '32px' }}>
          <div>
            <img src={logo} alt="SpineLCI" style={{ height: '40px', marginBottom: '16px' }} />
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#2C2C2C' }}>Automated Clinical Report</h2>
            <p style={{ fontSize: '14px', color: '#6B6B6B', marginTop: '4px' }}>Generated by SpineLCI Agentic System</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#2C2C2C', marginBottom: '4px' }}>Report ID: {REPORT_DATA.id}</p>
            <p style={{ fontSize: '13px', color: '#6B6B6B' }}>Date: {REPORT_DATA.date}</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px', padding: '6px 12px', background: '#FFFBEB', color: '#D97706', borderRadius: '6px', border: '1px solid #FEF3C7', fontSize: '12px', fontWeight: 600 }}>
              <AlertTriangle size={14} /> Pending Doctor Review
            </div>
          </div>
        </div>

        {/* Patient Info */}
        <SectionTitle icon={User} title="Patient Information" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <DataRow label="Patient Name:" value={REPORT_DATA.patient.name} />
            <DataRow label="Patient ID:" value={REPORT_DATA.patient.id} />
          </div>
          <div>
            <DataRow label="Age / Sex:" value={`${REPORT_DATA.patient.age} / ${REPORT_DATA.patient.sex}`} />
            <DataRow label="Contact:" value={REPORT_DATA.patient.phone} />
          </div>
        </div>

        {/* Clinical Info */}
        <SectionTitle icon={Activity} title="Clinical Information" />
        <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '8px', border: '1px solid #F3F4F6' }}>
          <DataRow label="Presenting Symptoms:" value={REPORT_DATA.clinical.symptoms} />
          <DataRow label="Duration:" value={REPORT_DATA.clinical.duration} />
          <DataRow label="Pain Severity:" value={REPORT_DATA.clinical.severity} />
          <DataRow label="Lifestyle / Functional:" value={REPORT_DATA.clinical.lifestyle} />
        </div>

        {/* Imaging Analysis */}
        <SectionTitle icon={Eye} title="Imaging Analysis" />
        <DataRow label="Scan Type:" value={REPORT_DATA.imaging.scanType} />
        <div style={{ marginTop: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#F3F4F6', borderBottom: '1px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '10px 16px', fontWeight: 600, color: '#4B5563' }}>Region</th>
                <th style={{ padding: '10px 16px', fontWeight: 600, color: '#4B5563' }}>Finding Description</th>
                <th style={{ padding: '10px 16px', fontWeight: 600, color: '#4B5563' }}>Severity</th>
              </tr>
            </thead>
            <tbody>
              {REPORT_DATA.imaging.findings.map((f, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{f.region}</td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{f.description}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ color: f.severity === 'Moderate' ? '#D97706' : '#059669', fontWeight: 600 }}>{f.severity}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Assessment & Longitudinal */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div>
            <SectionTitle icon={Brain} title="AI Assessment" />
            <DataRow label="Overall Severity:" value={<span style={{ fontWeight: 700, color: '#D97706' }}>{REPORT_DATA.aiAssessment.severity}</span>} />
            <DataRow label="AI Confidence:" value={REPORT_DATA.aiAssessment.confidence} />
            <DataRow label="AI Reasoning:" value={REPORT_DATA.aiAssessment.reasoning} />
          </div>
          <div>
            <SectionTitle icon={TrendingUp} title="Longitudinal Comparison" />
            <div style={{ padding: '12px', background: '#FFF8EC', border: '1px solid #FDE68A', borderRadius: '8px' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#92400E', marginBottom: '4px' }}>Progression Detected</p>
              <p style={{ fontSize: '13px', color: '#92400E' }}>{REPORT_DATA.aiAssessment.progression}</p>
            </div>
          </div>
        </div>

        {/* Clinical Intelligence Context */}
        <SectionTitle icon={FileText} title="Retrieved Clinical Context (RAG)" />
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#4B5563', lineHeight: '1.6' }}>
          {REPORT_DATA.ragContext.map((ctx, i) => (
            <li key={i} style={{ marginBottom: '8px' }}>{ctx}</li>
          ))}
        </ul>

        {/* Decision Support */}
        <SectionTitle icon={ShieldCheck} title="Clinical Decision Support" />
        <div style={{ padding: '16px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#166534', marginBottom: '4px' }}>AI Recommendation</p>
          <p style={{ fontSize: '14px', color: '#15803D' }}>{REPORT_DATA.decisionSupport}</p>
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #E5E1E3', fontSize: '12px', color: '#9CA3AF', textAlign: 'center' }}>
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
            <AlertTriangle size={14} /> AI-assisted clinical decision support. Final decisions remain with qualified healthcare professionals.
          </p>
          <p>Generated by SpineLCI Explainable AI Pipeline.</p>
        </div>

      </div>
    </div>
  )
}
