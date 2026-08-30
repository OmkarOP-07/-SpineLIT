import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Mail, Lock, Eye, EyeOff, Stethoscope, User, ShieldCheck,
  ArrowRight, RefreshCw, ChevronLeft, AlertCircle, CheckCircle2
} from 'lucide-react'
import logo from '../assets/logo.png'
import './AuthPage.css'
import { signInWithGoogle, signInWithEmail } from '../services/firebase'
import { loginPatient, loginDoctor, loginWithGoogle, requestDoctorOtp } from '../services/authService'
import { useAuth } from '../context/AuthContext'

/* ─── Google SVG Icon ─────────────────────────────── */
function GoogleIcon() {
  return (
    <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

/* ─── Validation helpers ──────────────────────────── */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(val) {
  if (!val) return 'Email is required.'
  if (!emailRegex.test(val)) return 'Enter a valid email address.'
  return ''
}

function validatePassword(val) {
  if (!val) return 'Password is required.'
  if (val.length < 8) return 'Must be at least 8 characters.'
  if (!/[A-Z]/.test(val)) return 'Must contain an uppercase letter.'
  if (!/[a-z]/.test(val)) return 'Must contain a lowercase letter.'
  if (!/[0-9]/.test(val)) return 'Must contain a number.'
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(val)) return 'Must contain a special character.'
  return ''
}

function validateOtp(val) {
  if (!val) return 'OTP is required.'
  if (!/^\d{6}$/.test(val)) return 'OTP must be exactly 6 digits.'
  return ''
}

/* ─── Password strength meter ─────────────────────── */
function getStrength(password) {
  let score = 0
  if (!password) return { score: 0, label: '', color: '' }
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++

  const levels = [
    { score: 1, label: 'Very Weak', color: '#ef4444' },
    { score: 2, label: 'Weak', color: '#f97316' },
    { score: 3, label: 'Fair', color: '#eab308' },
    { score: 4, label: 'Strong', color: '#22c55e' },
    { score: 5, label: 'Very Strong', color: '#10b981' },
  ]
  return levels[score - 1] || { score: 0, label: '', color: '' }
}

/* ─── OTP Input component ─────────────────────────── */
function OtpInput({ value, onChange, error }) {
  const refs = useRef([])
  const digits = value.split('')

  function handleKey(e, i) {
    if (e.key === 'Backspace') {
      const next = [...digits]
      if (next[i]) {
        next[i] = ''
        onChange(next.join(''))
      } else if (i > 0) {
        refs.current[i - 1]?.focus()
      }
      return
    }
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus()
    if (e.key === 'ArrowRight' && i < 5) refs.current[i + 1]?.focus()
  }

  function handleChange(e, i) {
    const char = e.target.value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[i] = char
    onChange(next.join(''))
    if (char && i < 5) refs.current[i + 1]?.focus()
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    onChange(pasted.padEnd(6, '').slice(0, 6))
    refs.current[Math.min(pasted.length, 5)]?.focus()
    e.preventDefault()
  }

  return (
    <div>
      <div className="otp-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <input
            key={i}
            id={`otp-digit-${i}`}
            ref={el => (refs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digits[i] || ''}
            onChange={e => handleChange(e, i)}
            onKeyDown={e => handleKey(e, i)}
            onPaste={handlePaste}
            className={`otp-cell ${error ? 'input-error' : ''} ${digits[i] ? 'otp-filled' : ''}`}
            aria-label={`OTP digit ${i + 1}`}
          />
        ))}
      </div>
      {error && <p className="field-error"><AlertCircle size={13} />{error}</p>}
    </div>
  )
}

/* ─── Main Component ──────────────────────────────── */
export default function LoginPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user, loginWithCredentials } = useAuth()
  const from = location.state?.from?.pathname || '/dashboard'

  // If already logged in, redirect directly
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  const [tab, setTab] = useState('patient')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors]     = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [success, setSuccess]   = useState(false)

  const [otp, setOtp]           = useState('')
  const [otpSent, setOtpSent]   = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)
  const [sendingOtp, setSendingOtp] = useState(false)

  useEffect(() => {
    setEmail(''); setPassword(''); setOtp('')
    setShowPass(false); setErrors({})
    setOtpSent(false); setOtpTimer(0); setSuccess(false)
  }, [tab])

  useEffect(() => {
    if (otpTimer <= 0) return
    const id = setTimeout(() => setOtpTimer(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [otpTimer])

  const strength = getStrength(password)

  function validate() {
    const e = {}
    const emailErr = validateEmail(email)
    const passErr  = validatePassword(password)
    if (emailErr) e.email = emailErr
    if (passErr)  e.password = passErr
    if (tab === 'doctor') {
      if (!otpSent) e.otp = 'Please request and enter the OTP first.'
      else {
        const otpErr = validateOtp(otp)
        if (otpErr) e.otp = otpErr
      }
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  /* ── Google sign-in (real Firebase + backend) ── */
  async function handleGoogleLogin() {
    setGoogleLoading(true)
    setErrors({})
    try {
      const idToken = await signInWithGoogle()       // Firebase popup
      const result  = await loginWithGoogle(idToken) // our backend
      loginWithCredentials(result)
      navigate(from, { replace: true })
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrors({ submit: err.detail || 'Google sign-in failed. Please try again.' })
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  /* ── OTP request (real backend) ── */
  async function handleSendOtp() {
    const emailErr = validateEmail(email)
    if (emailErr) { setErrors(prev => ({ ...prev, email: emailErr })); return }
    setSendingOtp(true)
    try {
      await requestDoctorOtp(email)
      setOtpSent(true)
      setOtpTimer(60)
      setOtp('')
      setErrors(prev => { const copy = { ...prev }; delete copy.otp; return copy })
    } catch (err) {
      setErrors(prev => ({ ...prev, email: err.detail || 'Could not send OTP.' }))
    } finally {
      setSendingOtp(false)
    }
  }

  /* ── Email/password submit (real Firebase + backend) ── */
  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      // Step 1: Firebase signs in and returns an ID token
      const idToken = await signInWithEmail(email, password)

      // Step 2: Send ID token (+ OTP for doctors) to our backend
      const result = tab === 'patient'
        ? await loginPatient(idToken)
        : await loginDoctor(idToken, otp)

      // Step 3: Store tokens & redirect
      loginWithCredentials(result)
      setSuccess(true)
      setTimeout(() => navigate(from, { replace: true }), 800)
    } catch (err) {
      // Firebase errors have a .code, backend errors have a .detail
      const msg = err.detail
        || (err.code === 'auth/wrong-password' ? 'Incorrect password.' : null)
        || (err.code === 'auth/user-not-found' ? 'No account found with this email.' : null)
        || (err.code === 'auth/invalid-credential' ? 'Invalid email or password.' : null)
        || 'Login failed. Please try again.'
      setErrors({ submit: msg })
    } finally {
      setSubmitting(false)
    }
  }

  function setField(field, val, validator) {
    if (field === 'email') setEmail(val)
    if (field === 'password') setPassword(val)
    if (errors[field] && validator) {
      const err = validator(val)
      setErrors(prev => ({ ...prev, [field]: err || undefined }))
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      <div className="auth-wrapper animate-fadeInUp">
        {/* Left panel */}
        <div className="auth-left">
          <div className="auth-left-content">
            <div className="auth-brand">
              <img src={logo} alt="SpineLIT logo" className="auth-logo" />
              <span className="auth-brand-name">SpineLIT</span>
            </div>
            <h2 className="auth-tagline">AI-Powered Spine Intelligence</h2>
            <p className="auth-sub">Advanced spinal MRI analysis with explainable AI for faster, smarter clinical decisions.</p>

            <ul className="auth-features">
              {[
                '95%+ AI diagnostic accuracy',
                'HIPAA-compliant & encrypted',
                'Instant explainable reports',
                'Longitudinal patient tracking',
              ].map(f => (
                <li key={f} className="auth-feature-item">
                  <CheckCircle2 size={16} className="auth-feature-icon" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="auth-stat-row">
              {[['5K+','Patients'],['12K+','Analyses'],['95%','Accuracy']].map(([v,l]) => (
                <div key={l} className="auth-stat">
                  <span className="auth-stat-val">{v}</span>
                  <span className="auth-stat-lbl">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="auth-right">
          <Link to="/" className="auth-back-link">
            <ChevronLeft size={16} /> Back to Home
          </Link>

          <div className="auth-form-header">
            <h1 className="auth-form-title">Welcome Back</h1>
            <p className="auth-form-desc">Sign in to your account to continue</p>
          </div>

          <div className="auth-tab-group" role="tablist">
            <button
              id="tab-patient"
              role="tab"
              aria-selected={tab === 'patient'}
              className={`auth-tab ${tab === 'patient' ? 'auth-tab-active' : ''}`}
              onClick={() => setTab('patient')}
            >
              <User size={15} /> Patient
            </button>
            <button
              id="tab-doctor"
              role="tab"
              aria-selected={tab === 'doctor'}
              className={`auth-tab ${tab === 'doctor' ? 'auth-tab-active' : ''}`}
              onClick={() => setTab('doctor')}
            >
              <Stethoscope size={15} /> Doctor
            </button>
          </div>

          {/* Google sign-in */}
          <button
            type="button"
            id="google-login-btn"
            className="google-btn"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            {googleLoading
              ? <><RefreshCw size={16} className="spin" /> Signing in with Google&hellip;</>
              : <><GoogleIcon /> Continue with Google</>
            }
          </button>

          {errors.submit && (
            <p className="field-error" style={{ justifyContent: 'center', marginBottom: 4 }}>
              <AlertCircle size={13} />{errors.submit}
            </p>
          )}

          <div className="auth-divider">
            <span className="auth-divider-line" />
            <span className="auth-divider-text">or sign in with email</span>
            <span className="auth-divider-line" />
          </div>

          {success ? (
            <div className="auth-success">
              <CheckCircle2 size={40} className="success-icon" />
              <p>Login successful! Redirecting&hellip;</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="auth-form">
              {/* Email */}
              <div className="form-group">
                <label htmlFor="login-email" className="form-label">Email Address</label>
                <div className="input-wrap">
                  <Mail size={16} className="input-icon" />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setField('email', e.target.value, validateEmail)}
                    className={`form-input input-padded ${errors.email ? 'input-error' : ''}`}
                  />
                </div>
                {errors.email && <p className="field-error"><AlertCircle size={13} />{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="login-password" className="form-label">Password</label>
                <div className="input-wrap">
                  <Lock size={16} className="input-icon" />
                  <input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setField('password', e.target.value, validatePassword)}
                    className={`form-input input-padded input-padded-right ${errors.password ? 'input-error' : ''}`}
                  />
                  <button
                    type="button"
                    id="toggle-password-visibility"
                    className="input-eye"
                    onClick={() => setShowPass(v => !v)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="field-error"><AlertCircle size={13} />{errors.password}</p>}
                {password && (
                  <div className="strength-bar-wrap">
                    <div className="strength-bar-track">
                      {[1,2,3,4,5].map(n => (
                        <div
                          key={n}
                          className="strength-segment"
                          style={{ background: n <= strength.score ? strength.color : '' }}
                        />
                      ))}
                    </div>
                    <span className="strength-label" style={{ color: strength.color }}>{strength.label}</span>
                  </div>
                )}
              </div>

              {/* Doctor OTP */}
              {tab === 'doctor' && (
                <div className="form-group">
                  <div className="otp-label-row">
                    <label className="form-label">Email OTP</label>
                    <button
                      type="button"
                      id="send-otp-btn"
                      className={`otp-send-btn ${otpTimer > 0 ? 'otp-send-btn-disabled' : ''}`}
                      onClick={handleSendOtp}
                      disabled={otpTimer > 0 || sendingOtp}
                    >
                      {sendingOtp ? (
                        <><RefreshCw size={13} className="spin" /> Sending&hellip;</>
                      ) : otpTimer > 0 ? (
                        <><ShieldCheck size={13} /> Resend in {otpTimer}s</>
                      ) : (
                        <><ShieldCheck size={13} /> {otpSent ? 'Resend OTP' : 'Send OTP'}</>
                      )}
                    </button>
                  </div>
                  {otpSent && (
                    <p className="otp-hint">A 6-digit OTP was sent to <strong>{email}</strong></p>
                  )}
                  <OtpInput value={otp} onChange={setOtp} error={errors.otp} />
                </div>
              )}

              <div className="auth-forgot-row">
                <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
              </div>

              <button
                type="submit"
                id="login-submit-btn"
                className="auth-submit-btn"
                disabled={submitting}
              >
                {submitting ? (
                  <><RefreshCw size={16} className="spin" /> Signing in&hellip;</>
                ) : (
                  <>Sign In <ArrowRight size={16} /></>
                )}
              </button>

              {tab === 'patient' && (
                <p className="auth-redirect">
                  Don&apos;t have an account?{' '}
                  <Link to="/signup" className="auth-link auth-link-bold">Create one &rarr;</Link>
                </p>
              )}
              {tab === 'doctor' && (
                <p className="auth-redirect">
                  Doctor accounts are provisioned by your institution.<br />
                  <span className="auth-muted">Contact your admin for access.</span>
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
