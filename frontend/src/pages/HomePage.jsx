import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import spineMri from '../assets/spine_mri.png'
import './HomePage.css'
import { useAuth } from '../context/AuthContext'
import {
  ArrowRight, Upload, Brain, FileText, Users, Activity, Shield,
  CheckCircle, Zap, TrendingUp, Eye, Heart, Lock, Send,
  ExternalLink, Globe, MessageCircle, Mail, ChevronRight, Search
} from 'lucide-react'

const navLinks = ['Home', 'About Us', 'How It Works', 'Features', 'For Doctors', 'Resources', 'Contact']

const stats = [
  { value: '5,000+', label: 'Patients Analyzed', sub: 'and growing every day', icon: Users },
  { value: '12,000+', label: 'Analyses Performed', sub: 'across hospitals', icon: Activity },
  { value: '95%+', label: 'AI Accuracy', sub: 'validated by experts', icon: CheckCircle },
  { value: '100%', label: 'Data Security', sub: 'HIPAA Compliant', icon: Shield },
]

const trustedBy = [
  { name: 'Apollo', letter: 'A' },
  { name: 'medanta', letter: 'M' },
  { name: 'MAX', letter: 'M' },
  { name: 'Fortis', letter: 'F' },
  { name: 'Narayana Health', letter: 'N' },
  { name: 'AIIMS', letter: 'A' },
]

const steps = [
  { icon: Upload, title: 'Upload Scan', desc: 'Upload MRI / X-ray scans securely and enter patient information.' },
  { icon: Brain, title: 'AI Analysis', desc: 'Our AI models analyze scans and assess severity with high accuracy.' },
  { icon: FileText, title: 'Insights & Report', desc: 'Get detailed insights, visualizations and explainable reports.' },
  { icon: Users, title: 'Clinical Decision', desc: 'Support better clinical decisions and monitor progress over time.' },
]

const features = [
  { icon: Brain, title: 'Advanced AI Analysis', desc: 'Deep learning models detect spinal abnormalities and grade severity.' },
  { icon: TrendingUp, title: 'Longitudinal Monitoring', desc: 'Track progression over time with AI-powered trend analysis.' },
  { icon: Eye, title: 'Explainable AI', desc: 'Interpretable results with visual explanations and heatmaps.' },
  { icon: FileText, title: 'Smart Reports', desc: 'Generate comprehensive reports in seconds with key measurements.' },
  { icon: Lock, title: 'Secure & Compliant', desc: 'Enterprise-grade security with HIPAA compliance and data encryption.' },
]

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="landing-page">
      {/* ── Navbar ── */}
      <nav className="lp-navbar">
        <div className="lp-navbar-inner">
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Spine-LIT" style={{ height: 40, filter: 'invert(1) hue-rotate(210deg) brightness(1.5)', mixBlendMode: 'screen' }} />
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
                <Link to="/signup" className="lp-btn-get-started">
                  Get Started
                </Link>
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
              <Zap size={12} /> CLINICAL DECISION SUPPORT
            </div>

            <h1>
              Intelligent <span className="purple">Spine Analysis.</span><br />
              Better Clinical Decisions.
            </h1>

            <p className="lp-hero-desc">
              Spine-LIT combines advanced AI, explainable intelligence,
              and longitudinal insights to analyze spine scans, assess
              severity, monitor progression, and support doctors in
              delivering better patient outcomes.
            </p>

            <div className="lp-hero-btns">
              <Link to="/dashboard" className="lp-btn-primary">
                <Upload size={16} /> Upload & Analyze
              </Link>
              <button className="lp-btn-outline">
                <Search size={16} /> Explore Features
              </button>
            </div>

            <div className="lp-trust-badges">
              <span><CheckCircle size={14} /> HIPAA Compliant</span>
              <span>•</span>
              <span><Shield size={14} /> Secure</span>
              <span>•</span>
              <span><Lock size={14} /> Privacy Protected</span>
            </div>
          </div>

          {/* Analysis Card */}
          <div className="animate-fadeInUp delay-200">
            <div className="lp-analysis-card">
              <div className="lp-analysis-header">
                <span className="dot" /> Spine-LIT Analysis
              </div>
              <div className="lp-patient-info">
                <span>Patient ID: 12453</span>
                <span>38 yrs</span>
                <span>Male</span>
              </div>
              <div className="lp-analysis-body">
                <div className="lp-spine-image">
                  <img src={spineMri} alt="Spine MRI Scan" />
                </div>
                <div className="lp-score-panel">
                  <div className="lp-severity-score">
                    <p className="label">AI Severity Score</p>
                    <p className="score">7.2 <small>/ 10</small></p>
                    <p className="level">Moderate</p>
                    <div className="lp-score-bar"><div className="lp-score-bar-fill" /></div>
                    <div className="lp-score-labels">
                      <span>0</span><span>5</span><span>10</span>
                    </div>
                  </div>
                  <div className="lp-findings">
                    <h4>Key Findings</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      <li>Disc height reduction at L4-L5</li>
                      <li>Mild spinal canal narrowing</li>
                      <li>Degenerative changes detected</li>
                    </ul>
                  </div>
                </div>
              </div>
              <button className="lp-view-report">
                View Full Report <ArrowRight size={14} />
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
              <div className="lp-stat-icon"><Icon size={22} /></div>
              <div>
                <div className="lp-stat-value">{value}</div>
                <div className="lp-stat-label">{label}</div>
                <div className="lp-stat-sub">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trusted By ── */}
      <section className="lp-trusted">
        <h2>Trusted by Healthcare Professionals & Institutions</h2>
        <div className="lp-trusted-logos">
          {trustedBy.map(({ name, letter }) => (
            <div key={name} className="lp-logo-item">
              <span className="logo-icon">{letter}</span>
              {name}
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="lp-how">
        <div className="lp-section-title">
          <h2>How <span className="purple">Spine-LIT</span> Works</h2>
        </div>
        <div className="lp-steps">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div className="lp-step">
                <div className="lp-step-icon"><Icon size={28} /></div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="lp-step-arrow">----→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="lp-features">
        <div className="lp-section-title">
          <h2>Powerful <span className="purple">Features</span> for Better Spine Care</h2>
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

      {/* ── CTA ── */}
      <section className="lp-cta">
        <div className="lp-cta-inner">
          <div>
            <h2>Ready to Transform Spine Care?</h2>
            <p>Join Spine-LIT and experience the future of<br />AI-powered spine intelligence.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link to="/dashboard" className="lp-cta-btn">
              Get Started Free <ArrowRight size={16} />
            </Link>
            <div className="lp-cta-note">
              <CheckCircle size={12} /> No credit card required
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <img src={logo} alt="Spine-LIT" style={{ height: 36, filter: 'invert(1) hue-rotate(210deg) brightness(1.5)', mixBlendMode: 'screen' }} />
            <p>AI-powered clinical decision support system for spine analysis, severity assessment and better patient outcomes.</p>
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
              <li><a href="#">About Us</a></li>
              <li><a href="#">How It Works</a></li>
              <li><a href="#">Features</a></li>
              <li><a href="#">For Doctors</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          <div className="lp-footer-col">
            <h4>Resources</h4>
            <ul>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Case Studies</a></li>
              <li><a href="#">User Guide</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>

          <div className="lp-footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Contact Support</a></li>
              <li><a href="#">Report an Issue</a></li>
            </ul>
          </div>

          <div className="lp-footer-col">
            <h4>Stay Updated</h4>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8 }}>
              Subscribe to our newsletter for latest updates.
            </p>
            <div className="lp-newsletter-input">
              <input type="email" placeholder="Enter your email" />
              <button><ArrowRight size={16} /></button>
            </div>
          </div>
        </div>

        <div className="lp-footer-bottom">
          © 2024 Spine-LIT. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
