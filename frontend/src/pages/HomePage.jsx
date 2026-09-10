import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import spineMri from '../assets/spine_mri.png'
import './HomePage.css'
import { useAuth } from '../context/AuthContext'
import {
  ArrowRight, Upload, Brain, FileText, Users, Activity, Shield,
  CheckCircle, Zap, TrendingUp, Eye, Lock, Send,
  ExternalLink, Globe, MessageCircle, Mail, Search, Database,
  Cpu, Layers, GitBranch, RefreshCw, BarChart2
} from 'lucide-react'

const navLinks = ['Home', 'How It Works', 'Features', 'For Doctors', 'Resources', 'Contact']

const steps = [
  { num: '01', icon: Upload,    title: 'Upload Data',            desc: 'Upload X-ray/MRI and enter clinical information.' },
  { num: '02', icon: Brain,     title: 'AI Analysis',            desc: 'Specialized AI agents process the available information.' },
  { num: '03', icon: Database,  title: 'Clinical Intelligence',  desc: 'RAG and historical information provide additional context.' },
  { num: '04', icon: FileText,  title: 'Explainable Report',     desc: 'Generate an interpretable report for doctor review.' },
]

const features = [
  { icon: Brain,     title: 'AI Image Analysis',       desc: 'Analyze medical images using computer vision to detect spinal features.' },
  { icon: TrendingUp,title: 'Longitudinal Monitoring', desc: 'Compare current and previous imaging records over time.' },
  { icon: Eye,       title: 'Explainable AI',          desc: 'Provide visual heatmaps and textual explanations for each prediction.' },
  { icon: FileText,  title: 'Clinical Reports',        desc: 'Generate structured AI-assisted reports for clinical documentation.' },
  { icon: Users,     title: 'Doctor Feedback',         desc: 'Allow clinicians to validate and correct AI outputs for continuous learning.' },
]

const agents = [
  { num: '01', title: 'Image Enhancement',             desc: 'Pre-process and enhance raw medical imaging inputs.' },
  { num: '02', title: 'Image Parsing & Preprocessing', desc: 'Segment and extract relevant spinal structures.' },
  { num: '03', title: 'RAG & Vector Matching',         desc: 'Retrieve similar historical cases and clinical knowledge.' },
  { num: '04', title: 'Prediction Agent',              desc: 'Generate severity assessment and confidence scores.' },
  { num: '05', title: 'AI Report Generation',          desc: 'Compose structured, explainable clinical summaries.' },
  { num: '06', title: 'Feedback & Learning',           desc: 'Incorporate doctor corrections into the clinical knowledge loop.' },
]

const longitudinalSteps = [
  { label: 'Previous Record',         desc: 'Historical imaging and baseline assessment.' },
  { label: 'Current Record',          desc: 'Latest uploaded imaging and clinical data.' },
  { label: 'Comparison',             desc: 'Automated feature-level diff between records.' },
  { label: 'Trend / Progression',    desc: 'Severity change detection and progression tracking.' },
  { label: 'Clinical Decision Support', desc: 'AI-assisted insight delivered to the clinician.' },
]

const stats = [
  { value: 'AI-Powered', label: 'Clinical Decision Support', sub: 'Explainable & longitudinal',          icon: Brain   },
  { value: 'Secure',     label: 'Data Protection',           sub: 'Clinician-controlled access',          icon: Shield  },
  { value: 'HITL',       label: 'Human-in-the-Loop',         sub: 'Doctor validation required',           icon: Users   },
  { value: 'XAI',        label: 'Transparent AI',            sub: 'Visual & textual explanations',        icon: Eye     },
]

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="landing-page">
      {/* ── Navbar ── */}
      <nav className="lp-navbar">
        <div className="lp-navbar-inner">
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="SpineLCI" style={{ height: 44, objectFit: 'contain' }} />
          </Link>

          <div className="lp-nav-links">
            {navLinks.map((link, i) => (
              <button key={link} className={`lp-nav-link${i === 0 ? ' active' : ''}`}>
                {link}
                {link === 'Resources' && <span style={{ marginLeft: 4, fontSize: 10 }}>▾</span>}
              </button>
            ))}
          </div>

          <div className="lp-nav-cta">
            {user ? (
              <Link to="/dashboard" className="lp-btn-get-started" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                {user.photo_url || user.photo ? (
                  <img
                    src={user.photo_url || user.photo}
                    alt=""
                    referrerPolicy="no-referrer"
                    style={{ width: '22px', height: '22px', borderRadius: '999px', objectFit: 'cover' }}
                  />
                ) : null}
                Go to Dashboard <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="lp-btn-login">Log In</Link>
                <Link to="/signup" className="lp-btn-get-started">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="animate-fadeInUp">
            <div className="lp-badge">
              <Zap size={12} /> AI-POWERED CLINICAL DECISION SUPPORT
            </div>

            <h1>
              Intelligent <span className="purple">Spine Analysis.</span><br />
              Better Clinical Decisions.
            </h1>

            <p className="lp-hero-desc">
              SpineLCI combines medical image analysis, explainable AI, longitudinal patient information
              and clinical intelligence to support doctors in evaluating spine conditions over time.
            </p>

            <div className="lp-hero-btns">
              <Link to="/dashboard/image-analysis" className="lp-btn-primary">
                <Upload size={16} /> Upload &amp; Analyze
              </Link>
              <button className="lp-btn-outline">
                <Search size={16} /> Explore Features
              </button>
            </div>

            <div className="lp-trust-badges">
              <span><CheckCircle size={14} /> Secure</span>
              <span>•</span>
              <span><Eye size={14} /> Explainable</span>
              <span>•</span>
              <span><Users size={14} /> Clinician-in-the-Loop</span>
            </div>
          </div>

          {/* Analysis Card */}
          <div className="animate-fadeInUp delay-200">
            <div className="lp-analysis-card">
              <div className="lp-analysis-header">
                <span className="dot" /> SpineLCI Analysis
              </div>
              <div className="lp-patient-info">
                <span>Patient ID: DEMO-001</span>
                <span>Age: Demo</span>
                <span>Status: Completed</span>
              </div>
              <div className="lp-analysis-body">
                <div className="lp-spine-image">
                  <img src={spineMri} alt="Demo Spine MRI" />
                </div>
                <div className="lp-score-panel">
                  <div className="lp-severity-score">
                    <p className="label">AI Assessment</p>
                    <p className="score">92<small>%</small></p>
                    <p className="level">Confidence</p>
                    <div className="lp-score-bar"><div className="lp-score-bar-fill" /></div>
                    <div className="lp-score-labels">
                      <span>0</span><span>50</span><span>100</span>
                    </div>
                  </div>
                  <div className="lp-findings">
                    <h4>Key Findings</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      <li>Imaging features detected</li>
                      <li>Clinical symptoms considered</li>
                      <li>Previous record available</li>
                    </ul>
                  </div>
                </div>
              </div>
              <button className="lp-view-report">
                View Analysis <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="lp-stats">
        <div className="lp-stats-inner">
          {stats.map(({ value, label, sub, icon: Icon }) => (
            <div key={label} className="lp-stat-card">
              <div className="lp-stat-icon">
                <Icon size={22} />
              </div>
              <div>
                <p className="lp-stat-value">{value}</p>
                <p className="lp-stat-label">{label}</p>
                <p className="lp-stat-sub">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="lp-how">
        <div className="lp-section-title">
          <h2>How <span className="purple">SpineLCI</span> Works</h2>
          <p className="lp-section-sub">Four clear steps from data upload to clinical insight.</p>
        </div>
        <div className="lp-steps">
          {steps.map(({ num, icon: Icon, title, desc }, i) => (
            <div key={title} style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div className="lp-step">
                <div className="lp-step-num">{num}</div>
                <div className="lp-step-icon"><Icon size={26} /></div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="lp-step-arrow">→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="lp-features">
        <div className="lp-section-title">
          <h2>Intelligent <span className="purple">Clinical Support</span></h2>
          <p className="lp-section-sub">Purpose-built tools to assist spine assessment.</p>
        </div>
        <div className="lp-features-grid">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="lp-feature-card">
              <div className="lp-feature-icon"><Icon size={22} /></div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Agentic AI Pipeline ── */}
      <section className="lp-agents">
        <div className="lp-section-title">
          <h2>Agentic <span className="purple">AI Pipeline</span></h2>
          <p className="lp-section-sub">Six specialized agents work in sequence from raw data to verified clinical output.</p>
        </div>

        <div className="lp-pipeline">
          {/* Input node */}
          <div className="lp-pipeline-node lp-pipeline-input">
            <div className="lp-pipeline-input-icon"><Users size={20} /></div>
            <span>Patient Data &amp; Imaging</span>
          </div>

          <div className="lp-pipeline-arrow-down">↓</div>

          {/* Agent nodes */}
          <div className="lp-agents-grid">
            {agents.map((agent, i) => (
              <div key={agent.num} className="lp-agent-card">
                <div className="lp-agent-num">{agent.num}</div>
                <div className="lp-agent-body">
                  <p className="lp-agent-title">{agent.title}</p>
                  <p className="lp-agent-desc">{agent.desc}</p>
                </div>
                {i < agents.length - 1 && (
                  <div className="lp-agent-connector">↓</div>
                )}
              </div>
            ))}
          </div>

          <div className="lp-pipeline-arrow-down">↓</div>

          {/* Output node */}
          <div className="lp-pipeline-node lp-pipeline-output">
            <div className="lp-pipeline-output-icon"><CheckCircle size={20} /></div>
            <span>Verified Feedback Memory &amp; Future Retrieval</span>
          </div>
        </div>
      </section>

      {/* ── Longitudinal Intelligence ── */}
      <section className="lp-longitudinal">
        <div className="lp-longitudinal-inner">
          <div className="lp-section-title" style={{ textAlign: 'left' }}>
            <h2>Longitudinal <span className="purple">Intelligence</span></h2>
            <p className="lp-section-sub">Track spine health progression across multiple visits over time.</p>
          </div>

          <div className="lp-long-timeline">
            {longitudinalSteps.map((step, i) => (
              <div key={step.label} className="lp-long-step">
                <div className="lp-long-dot" />
                <div className="lp-long-content">
                  <p className="lp-long-label">{step.label}</p>
                  <p className="lp-long-desc">{step.desc}</p>
                </div>
                {i < longitudinalSteps.length - 1 && (
                  <div className="lp-long-line" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta">
        <div className="lp-cta-inner">
          <div>
            <h2>Bring Intelligent Clinical Support to Spine Care.</h2>
            <p>Analyze. Compare. Explain. Improve.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link to={user ? '/dashboard/image-analysis' : '/signup'} className="lp-cta-btn">
              Start Analysis <ArrowRight size={16} />
            </Link>
            <div className="lp-cta-note">
              <Shield size={12} /> AI-assisted · Clinician-validated · Explainable
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <img src={logo} alt="SpineLCI" style={{ height: 40, objectFit: 'contain' }} />
            <p>Explainable Agentic Clinical Decision Support System for longitudinal spine assessment.</p>
            <p style={{ fontSize: 12, color: '#6B6B6B', marginTop: 4 }}>
              AI-assisted · Final decisions remain with qualified clinicians.
            </p>
            <div className="lp-footer-social">
              <a href="#"><ExternalLink size={16} /></a>
              <a href="#"><Globe size={16} /></a>
              <a href="#"><MessageCircle size={16} /></a>
              <a href="#"><Mail size={16} /></a>
            </div>
          </div>

          <div className="lp-footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">How It Works</a></li>
              <li><a href="#">Features</a></li>
              <li><a href="#">For Doctors</a></li>
              <li><a href="#">Resources</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          <div className="lp-footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>

          <div className="lp-footer-col">
            <h4>Stay Updated</h4>
            <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 8 }}>
              Subscribe for latest updates.
            </p>
            <div className="lp-newsletter-input">
              <input type="email" placeholder="Enter your email" />
              <button><Send size={16} /></button>
            </div>
          </div>
        </div>

        <div className="lp-footer-bottom">
          © 2025 SpineLCI. All rights reserved. &nbsp;|&nbsp; AI-assisted clinical decision support.
        </div>
      </footer>
    </div>
  )
}
