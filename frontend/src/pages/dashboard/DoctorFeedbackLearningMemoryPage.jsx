import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp, Activity, Brain, CheckCircle, Clock, Eye, AlertTriangle,
  Trash2, Sparkles, Shield, Maximize2, X, RefreshCw, ChevronRight,
  Database, Zap, CheckCircle2, User, FileText
} from 'lucide-react'
import {
  getFeedbackHistory,
  getTemporaryLearningMemoryScan,
  clearTemporaryLearningMemory,
  simulateDoctorFeedback,
} from '../../services/feedbackService'

export default function DoctorFeedbackLearningMemoryPage() {
  const [feedbackList, setFeedbackList] = useState([])
  const [temporaryScan, setTemporaryScan] = useState(null)
  const [activeModalScan, setActiveModalScan] = useState(null)
  const [filterMode, setFilterMode] = useState('all') // 'all' | 'in-memory'
  const [notification, setNotification] = useState(null)

  const loadData = async () => {
    const list = await getFeedbackHistory()
    setFeedbackList(list)
    const temp = getTemporaryLearningMemoryScan()
    setTemporaryScan(temp)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handlePurgeTemporaryScan = () => {
    clearTemporaryLearningMemory()
    setTemporaryScan(null)
    loadData()
    setNotification('Patient scan purged from temporary learning memory.')
    setTimeout(() => setNotification(null), 4000)
  }

  const handleSimulateFeedback = () => {
    const simulated = simulateDoctorFeedback()
    setTemporaryScan(simulated)
    loadData()
    setNotification('Simulated doctor feedback loaded with patient scan in temporary memory!')
    setTimeout(() => setNotification(null), 4000)
  }

  const displayedList = filterMode === 'in-memory'
    ? feedbackList.filter(item => item.isTemporaryScanInMemory)
    : feedbackList

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px' }} className="animate-fadeIn">
      
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          background: 'var(--text-dark)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 99999,
          fontSize: '14px',
          fontWeight: 600,
          animation: 'fadeIn 0.25s ease-out'
        }}>
          <Sparkles size={16} color="#10B981" />
          {notification}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-dark)' }}>
            Continuous Learning Memory & Doctor Feedback
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '6px' }}>
            Human-in-the-loop validation buffer for model fine-tuning and verified diagnostic ground truth.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/dashboard/doctor-feedback" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} /> Provide Feedback
          </Link>
          {!temporaryScan && (
            <button 
              onClick={handleSimulateFeedback} 
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Sparkles size={16} /> Simulate Feedback Scan
            </button>
          )}
        </div>
      </div>

      {/* ─── TEMPORARY PATIENT SCAN IN LEARNING MEMORY ─── */}
      {temporaryScan ? (
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '24px',
          border: '2px solid rgba(16, 185, 129, 0.4)',
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.12), 0 2px 12px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          {/* Active Status Bar */}
          <div style={{
            background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))',
            padding: '16px 28px',
            borderBottom: '1.5px solid rgba(16, 185, 129, 0.25)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                width: '12px', height: '12px', borderRadius: '50%',
                background: '#10B981', boxShadow: '0 0 12px #10B981',
                display: 'inline-block'
              }} />
              <div>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Temporary In-Memory Buffer: Active Patient Scan
                </span>
                <span style={{ marginLeft: '10px', fontSize: '12px', color: '#047857' }}>
                  Mounted via Doctor Feedback Review
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '12px', fontWeight: 600, color: '#065F46',
                background: '#D1FAE5', padding: '6px 14px', borderRadius: '999px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                <Clock size={14} /> Auto-purges in ~24h (Ephemeral Privacy Cache)
              </span>

              <button
                onClick={handlePurgeTemporaryScan}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'rgba(239, 68, 68, 0.1)', color: '#DC2626',
                  border: '1px solid rgba(239, 68, 68, 0.25)', padding: '6px 14px',
                  borderRadius: '10px', fontSize: '12px', fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.15s'
                }}
                title="Purge scan from memory buffer to test temporary lifecycle"
              >
                <Trash2 size={13} /> Purge Scan from Memory
              </button>
            </div>
          </div>

          {/* Main Visualizer and Assessment Card */}
          <div style={{ padding: '28px', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '28px' }}>
            
            {/* Left: Interactive Scan Visualizer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div 
                onClick={() => setActiveModalScan(temporaryScan)}
                style={{
                  background: '#040711',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1.5px solid rgba(0, 191, 255, 0.3)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  height: '320px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  group: 'true'
                }}
              >
                <img 
                  src={temporaryScan.scanImage || '/sample_lateral_xray.jpg'} 
                  alt="Patient Scan" 
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />

                {/* Overlay Badge */}
                <div style={{
                  position: 'absolute', top: '10px', left: '10px',
                  background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
                  padding: '4px 10px', borderRadius: '8px', fontSize: '11px',
                  color: '#67E8F9', fontWeight: 700, border: '1px solid rgba(103, 232, 249, 0.3)'
                }}>
                  ● LIVE SCAN IN MEMORY
                </div>

                {/* Inspect Button Prompt */}
                <div style={{
                  position: 'absolute', bottom: '10px', right: '10px',
                  background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
                  padding: '6px 12px', borderRadius: '10px', fontSize: '12px',
                  color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <Maximize2 size={13} /> Click to Inspect
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                <span>Modality: <strong>{temporaryScan.scanType}</strong></span>
                <span style={{ color: '#059669', fontWeight: 600 }}>● Cached for Retraining</span>
              </div>
            </div>

            {/* Right: Diagnostic Comparison & Human-in-the-Loop Feedback */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Patient and Case Metadata */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(133,57,83,0.1)', paddingBottom: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
                    {temporaryScan.patientName}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                    Patient ID: <strong>{temporaryScan.patientId || 'PNT-2025-0487'}</strong> · Case Ref: <strong>{temporaryScan.caseId}</strong> · Feedback: <strong>{temporaryScan.id}</strong>
                  </p>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'var(--bg-warm)', padding: '6px 12px', borderRadius: '8px', fontWeight: 600 }}>
                  Feedback Given: {temporaryScan.timestamp}
                </span>
              </div>

              {/* AI vs Doctor Comparison Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                
                {/* AI Box */}
                <div style={{ padding: '16px', background: 'var(--bg-warm)', borderRadius: '14px', border: '1px solid rgba(133,57,83,0.1)' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
                    Original AI Prediction
                  </p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '22px', fontWeight: 800, color: '#D97706' }}>{temporaryScan.aiPrediction}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>({temporaryScan.confidence}% confidence)</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
                    Initial computer vision inference
                  </p>
                </div>

                {/* Doctor Box */}
                <div style={{
                  padding: '16px',
                  background: temporaryScan.status === 'Accepted' ? '#ECFDF5' : '#FFFBEB',
                  borderRadius: '14px',
                  border: `1.5px solid ${temporaryScan.status === 'Accepted' ? '#10B981' : '#F59E0B'}`,
                }}>
                  <p style={{
                    fontSize: '11px', fontWeight: 700,
                    color: temporaryScan.status === 'Accepted' ? '#047857' : '#92400E',
                    textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em'
                  }}>
                    Doctor Feedback / Verified Truth
                  </p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{
                      fontSize: '22px', fontWeight: 800,
                      color: temporaryScan.status === 'Accepted' ? '#059669' : '#D97706'
                    }}>
                      {temporaryScan.doctorCorrection || temporaryScan.aiPrediction}
                    </span>
                    <span style={{
                      fontSize: '12px', fontWeight: 700,
                      color: temporaryScan.status === 'Accepted' ? '#065F46' : '#92400E',
                      background: 'rgba(255,255,255,0.7)', padding: '2px 8px', borderRadius: '999px'
                    }}>
                      {temporaryScan.status}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '12px',
                    color: temporaryScan.status === 'Accepted' ? '#047857' : '#92400E',
                    margin: '6px 0 0 0'
                  }}>
                    Clinically verified ground truth
                  </p>
                </div>
              </div>

              {/* Doctor Comment */}
              <div style={{ padding: '14px 18px', background: 'var(--bg-warm)', borderRadius: '14px', borderLeft: '4px solid var(--primary)' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Doctor Clinical Commentary:
                </p>
                <p style={{ fontSize: '13px', color: 'var(--text-dark)', lineHeight: '1.5', margin: 0, fontStyle: 'italic' }}>
                  "{temporaryScan.doctorComment || 'Verified by clinical specialist.'}"
                </p>
              </div>

              {/* Retraining Impact Metrics */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px',
                paddingTop: '6px'
              }}>
                <div style={{ padding: '10px 14px', background: 'rgba(133,57,83,0.06)', borderRadius: '10px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Loss Alignment Delta</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>Δ -0.042 (Calibrated)</span>
                </div>
                <div style={{ padding: '10px 14px', background: 'rgba(133,57,83,0.06)', borderRadius: '10px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>RAG Retrieval Cluster</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)' }}>Spondy-L4L5-Index</span>
                </div>
                <div style={{ padding: '10px 14px', background: 'rgba(16,185,129,0.08)', borderRadius: '10px' }}>
                  <span style={{ fontSize: '11px', color: '#047857', display: 'block' }}>Clinical Governance</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#059669' }}>HIPAA Compliant Cache</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* Empty In-Memory State */
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1.5px dashed rgba(133, 57, 83, 0.3)',
          padding: '36px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '18px',
            background: 'rgba(133, 57, 83, 0.08)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
            color: 'var(--primary)'
          }}>
            <Brain size={32} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '8px' }}>
            No Active Scan in Temporary Learning Memory
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto 20px', lineHeight: '1.6' }}>
            When doctor feedback is given on a patient scan, the image and clinical annotations are held temporarily in learning memory to calibrate neural weight updates and refine retrieval.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
            <Link to="/dashboard/doctor-feedback" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={15} /> Go to Doctor Feedback Review
            </Link>
            <button 
              onClick={handleSimulateFeedback} 
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Sparkles size={15} /> Load Sample Patient Scan into Memory
            </button>
          </div>
        </div>
      )}

      {/* HITL Educational Panel */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
        borderRadius: '20px', padding: '28px 32px', color: 'white',
        display: 'flex', alignItems: 'center', gap: '28px',
        boxShadow: '0 8px 32px rgba(133,57,83,0.2)'
      }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '18px',
          background: 'rgba(255,255,255,0.12)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <Brain size={36} color="white" />
        </div>
        <div>
          <h2 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '6px' }}>
            Human-in-the-Loop Continuous Learning Architecture
          </h2>
          <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6', margin: 0, maxWidth: '840px' }}>
            Doctor feedback is stored securely as verified feedback memory. Verified scans are held in ephemeral learning memory to calculate gradient descent loss deltas before model release checkpoints. This ensures continuous adaptation to real-world spine pathologies while strictly maintaining clinician oversight and patient privacy.
          </p>
        </div>
      </div>

      {/* Verified Feedback History Table */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1.5px solid rgba(133, 57, 83, 0.15)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(133, 57, 83, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
              Recent Verified Feedback History
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Historical doctor corrections and verified cases used for ongoing model retraining.
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setFilterMode('all')}
              style={{
                padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                border: 'none', cursor: 'pointer',
                background: filterMode === 'all' ? 'var(--primary)' : 'rgba(133,57,83,0.1)',
                color: filterMode === 'all' ? 'white' : 'var(--text-muted)',
                transition: 'all 0.15s'
              }}
            >
              All Records ({feedbackList.length})
            </button>
            <button
              onClick={() => setFilterMode('in-memory')}
              style={{
                padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                border: 'none', cursor: 'pointer',
                background: filterMode === 'in-memory' ? '#059669' : 'rgba(16,185,129,0.12)',
                color: filterMode === 'in-memory' ? 'white' : '#065F46',
                display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'all 0.15s'
              }}
            >
              <Zap size={13} /> Active In-Memory ({feedbackList.filter(x => x.isTemporaryScanInMemory).length})
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-warm)', borderBottom: '1px solid rgba(133, 57, 83, 0.15)' }}>
                {['Scan', 'Date', 'Feedback ID', 'Patient', 'AI Prediction', 'Doctor Correction', 'Status', 'Doctor Note', 'Actions'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '16px 20px', fontSize: '12px', fontWeight: 700,
                    color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em',
                    whiteSpace: 'nowrap'
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayedList.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                    No records found matching current filter.
                  </td>
                </tr>
              ) : (
                displayedList.map(row => (
                  <tr 
                    key={row.id} 
                    style={{
                      borderBottom: '1px solid #F5F0E8',
                      transition: 'background 0.2s',
                      background: row.isTemporaryScanInMemory ? 'rgba(16, 185, 129, 0.04)' : 'transparent'
                    }} 
                    onMouseEnter={e => e.currentTarget.style.background = row.isTemporaryScanInMemory ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-warm)'} 
                    onMouseLeave={e => e.currentTarget.style.background = row.isTemporaryScanInMemory ? 'rgba(16, 185, 129, 0.04)' : 'transparent'}
                  >
                    {/* Scan Thumbnail */}
                    <td style={{ padding: '12px 20px' }}>
                      <div 
                        onClick={() => setActiveModalScan(row)}
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          background: '#040711',
                          border: row.isTemporaryScanInMemory ? '2px solid #10B981' : '1px solid rgba(133,57,83,0.2)',
                          cursor: 'pointer',
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: row.isTemporaryScanInMemory ? '0 0 8px rgba(16,185,129,0.3)' : 'none'
                        }}
                        title="Click to view scan"
                      >
                        <img 
                          src={row.scanImage || '/sample_lateral_xray.jpg'} 
                          alt="Scan Thumbnail" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        {row.isTemporaryScanInMemory && (
                          <div style={{
                            position: 'absolute', top: 0, right: 0, width: '8px', height: '8px',
                            background: '#10B981', borderRadius: '50%', border: '1.5px solid white'
                          }} />
                        )}
                      </div>
                    </td>

                    <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--text-dark)', whiteSpace: 'nowrap' }}>
                      {row.timestamp ? row.timestamp.split(',')[0] : 'Today'}
                    </td>
                    
                    <td style={{ padding: '16px 20px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-muted)' }}>
                      {row.id}
                      {row.isTemporaryScanInMemory && (
                        <span style={{
                          display: 'block', fontSize: '10px', color: '#059669',
                          fontWeight: 700, textTransform: 'uppercase', marginTop: '2px'
                        }}>
                          ⚡ In-Memory
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)', whiteSpace: 'nowrap' }}>
                      {row.patientName}
                    </td>

                    <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      {row.aiPrediction}
                    </td>

                    <td style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)' }}>
                      {row.doctorCorrection}
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
                        background: row.status === 'Accepted' ? '#D1FAE5' : '#FFFBEB',
                        color: row.status === 'Accepted' ? '#065F46' : '#92400E'
                      }}>
                        {row.status}
                      </span>
                    </td>

                    <td style={{
                      padding: '16px 20px', fontSize: '13px', color: 'var(--text-muted)',
                      maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }} title={row.doctorComment}>
                      {row.doctorComment}
                    </td>

                    <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                      <button
                        onClick={() => setActiveModalScan(row)}
                        style={{
                          background: 'none', border: '1px solid rgba(133,57,83,0.2)',
                          borderRadius: '8px', padding: '6px 12px', fontSize: '12px',
                          color: 'var(--primary)', fontWeight: 600, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '5px'
                        }}
                      >
                        <Eye size={13} /> View Scan
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── FULLSCREEN SCAN LIGHTBOX / MODAL ─── */}
      {activeModalScan && (
        <div 
          onClick={() => setActiveModalScan(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(3, 7, 18, 0.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 99999, padding: '24px', backdropFilter: 'blur(4px)'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0B1120', borderRadius: '24px', maxWidth: '860px',
              width: '100%', overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.15)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '18px 24px', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.02)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 style={{ color: 'white', fontWeight: 800, fontSize: '17px', margin: 0 }}>
                    {activeModalScan.patientName} — Patient Scan
                  </h4>
                  {activeModalScan.isTemporaryScanInMemory && (
                    <span style={{
                      background: 'rgba(16, 185, 129, 0.2)', color: '#34D399',
                      fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px',
                      border: '1px solid rgba(52, 211, 153, 0.3)'
                    }}>
                      ⚡ Active Memory Buffer
                    </span>
                  )}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: '4px 0 0 0' }}>
                  {activeModalScan.scanType || 'X-ray Lumbar Spine'} · Case ID: {activeModalScan.caseId || 'ANA-2025-0234'} · Feedback Ref: {activeModalScan.id}
                </p>
              </div>

              <button 
                onClick={() => setActiveModalScan(null)} 
                style={{
                  background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
                  cursor: 'pointer', borderRadius: '50%', width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Image View */}
            <div style={{
              padding: '24px', background: '#02040A',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              minHeight: '380px', maxHeight: '520px', overflow: 'hidden'
            }}>
              <img 
                src={activeModalScan.scanImage || '/sample_lateral_xray.jpg'} 
                alt="Patient Scan Full" 
                style={{ maxHeight: '480px', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>

            {/* Modal Footer: Clinical Summary */}
            <div style={{
              padding: '18px 24px', background: 'rgba(255,255,255,0.03)',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: '12px'
            }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>AI Prediction</span>
                  <p style={{ color: '#F59E0B', fontWeight: 800, fontSize: '15px', margin: 0 }}>{activeModalScan.aiPrediction}</p>
                </div>
                <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
                <div>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Doctor Correction</span>
                  <p style={{ color: '#10B981', fontWeight: 800, fontSize: '15px', margin: 0 }}>{activeModalScan.doctorCorrection}</p>
                </div>
                <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
                <div>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Status</span>
                  <p style={{ color: 'white', fontWeight: 700, fontSize: '14px', margin: 0 }}>{activeModalScan.status}</p>
                </div>
              </div>

              <div style={{ maxWidth: '360px', textAlign: 'right' }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: 0, fontStyle: 'italic' }}>
                  "{activeModalScan.doctorComment || 'Clinically verified.'}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

