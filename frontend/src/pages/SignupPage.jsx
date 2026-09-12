import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Mail, Lock, Eye, EyeOff, User, Phone, Calendar,
  ArrowRight, RefreshCw, ChevronLeft, AlertCircle, CheckCircle2, UserPlus,
  MapPin, LocateFixed
} from 'lucide-react'
import logo from '../assets/logo.png'
import './AuthPage.css'
import { createUserWithEmail, signInWithGoogle } from '../services/firebase'
import { registerPatient, loginWithGoogle } from '../services/authService'
import { getPatientLocation } from '../services/nearbyDoctorsService'
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
const phoneRegex = /^[6-9]\d{9}$/

function validateName(val) {
  if (!val.trim()) return 'Full name is required.'
  if (val.trim().length < 2) return 'Name must be at least 2 characters.'
  if (!/^[a-zA-Z\s'-]+$/.test(val.trim())) return 'Name can only contain letters, spaces, hyphens and apostrophes.'
  return ''
}

function validateEmail(val) {
  if (!val) return 'Email is required.'
  if (!emailRegex.test(val)) return 'Enter a valid email address.'
  return ''
}

function validatePhone(val) {
  if (!val) return 'Phone number is required.'
  if (!phoneRegex.test(val)) return 'Enter a valid 10-digit Indian mobile number.'
  return ''
}

function validateDob(val) {
  if (!val) return 'Date of birth is required.'
  const dob = new Date(val)
  const today = new Date()
  const age = today.getFullYear() - dob.getFullYear()
  if (isNaN(dob.getTime())) return 'Enter a valid date.'
  if (dob >= today) return 'Date of birth must be in the past.'
  if (age > 120) return 'Enter a valid date of birth.'
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

function validateConfirmPassword(val, password) {
  if (!val) return 'Please confirm your password.'
  if (val !== password) return 'Passwords do not match.'
  return ''
}

/* ─── Password strength ───────────────────────────── */
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

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: v => v.length >= 8 },
  { label: 'One uppercase letter', test: v => /[A-Z]/.test(v) },
  { label: 'One lowercase letter', test: v => /[a-z]/.test(v) },
  { label: 'One number', test: v => /[0-9]/.test(v) },
  { label: 'One special character', test: v => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v) },
]

/* ─── Main Component ──────────────────────────────── */
export default function SignupPage() {
  const navigate = useNavigate()
  const { user, loginWithCredentials } = useAuth()

  // If already logged in, redirect directly
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  const [form, setForm] = useState({
    name: '', email: '', phone: '', dob: '', gender: '',
    city: '', location: '', latitude: null, longitude: null,
    password: '', confirmPassword: '',
  })
  const [isLocating, setIsLocating]   = useState(false)
  const [showPass, setShowPass]       = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors]           = useState({})
  const [submitting, setSubmitting]   = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [success, setSuccess]         = useState(false)
  const [agreed, setAgreed]           = useState(false)

  const strength = getStrength(form.password)

  // Auto-detect patient location on click
  async function handleAutoDetectLocation() {
    setIsLocating(true)
    try {
      const loc = await getPatientLocation()
      setForm(prev => ({
        ...prev,
        city: loc.city || 'Mumbai',
        location: `${loc.area || ''}, ${loc.city || ''}`.replace(/^,\s*/, ''),
        latitude: loc.coords.lat,
        longitude: loc.coords.lng
      }))
    } catch {
      /* ignore */
    } finally {
      setIsLocating(false)
    }
  }

  function setField(field, val) {
    setForm(prev => ({ ...prev, [field]: val }))
    // Clear error live as user types
    if (errors[field]) {
      let err = ''
      if (field === 'name') err = validateName(val)
      if (field === 'email') err = validateEmail(val)
      if (field === 'phone') err = validatePhone(val)
      if (field === 'dob') err = validateDob(val)
      if (field === 'password') err = validatePassword(val)
      if (field === 'confirmPassword') err = validateConfirmPassword(val, form.password)
      setErrors(prev => ({ ...prev, [field]: err || undefined }))
    }
  }

  function validate() {
    const e = {}
    const nameErr    = validateName(form.name)
    const emailErr   = validateEmail(form.email)
    const phoneErr   = validatePhone(form.phone)
    const dobErr     = validateDob(form.dob)
    const passErr    = validatePassword(form.password)
    const confirmErr = validateConfirmPassword(form.confirmPassword, form.password)
    if (nameErr)    e.name = nameErr
    if (emailErr)   e.email = emailErr
    if (phoneErr)   e.phone = phoneErr
    if (dobErr)     e.dob = dobErr
    if (!form.gender) e.gender = 'Please select your gender.'
    if (passErr)    e.password = passErr
    if (confirmErr) e.confirmPassword = confirmErr
    if (!agreed)    e.agreed = 'You must accept the Terms & Privacy Policy.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  /* ── Google sign-up ── */
  async function handleGoogleSignup() {
    setGoogleLoading(true)
    setErrors({})
    try {
      const idToken = await signInWithGoogle()
      const result  = await loginWithGoogle(idToken)
      loginWithCredentials(result)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrors({ submit: err.detail || 'Google sign-up failed. Please try again.' })
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      // Step 1: Create Firebase account
      const idToken = await createUserWithEmail(form.email, form.password)

      // Step 2: Register in our backend (passes Firebase ID token + form data)
      const result = await registerPatient({
        firebaseIdToken: idToken,
        name:      form.name,
        phone:     form.phone     || undefined,
        dob:       form.dob       || undefined,
        gender:    form.gender    || undefined,
        city:      form.city      || undefined,
        location:  form.location  || undefined,
        latitude:  form.latitude  || undefined,
        longitude: form.longitude || undefined,
      })

      // Step 3: Store session & redirect
      loginWithCredentials(result)
      setSuccess(true)
      setTimeout(() => navigate('/dashboard', { replace: true }), 900)
    } catch (err) {
      const msg = err.detail
        || (err.code === 'auth/email-already-in-use' ? 'An account with this email already exists.' : null)
        || (err.code === 'auth/weak-password' ? 'Password is too weak.' : null)
        || 'Registration failed. Please try again.'
      setErrors({ submit: msg })
    } finally {
      setSubmitting(false)
    }
  }

  const maxDob = new Date().toISOString().split('T')[0]

  return (
    <div className="auth-root">
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      <div className="auth-wrapper auth-wrapper-signup animate-fadeInUp">
        {/* Left panel
        <div className="auth-left">
          <div className="auth-left-content">
            <div className="auth-brand">
              <img src={logo} alt="SpineLIT logo" className="auth-logo" />
              <span className="auth-brand-name">SpineLIT</span>
            </div>
            <h2 className="auth-tagline">Join SpineLIT Today</h2>
            <p className="auth-sub">Create your patient account and get access to AI-powered spine health insights.</p>

            <ul className="auth-features">
              {[
                'Secure personal health record',
                'Real-time MRI analysis results',
                'Doctor-patient collaboration',
                'Track your spine health over time',
              ].map(f => (
                <li key={f} className="auth-feature-item">
                  <CheckCircle2 size={16} className="auth-feature-icon" />
                  {f}
                </li>
              ))}
            </ul>

            {form.password && (
              <div className="auth-checklist">
                <p className="auth-checklist-title">Password Requirements</p>
                {PASSWORD_RULES.map(rule => (
                  <div key={rule.label} className={`auth-check-item ${rule.test(form.password) ? 'check-pass' : 'check-fail'}`}>
                    {rule.test(form.password)
                      ? <CheckCircle2 size={13} />
                      : <AlertCircle size={13} />
                    }
                    {rule.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div> */}

        {/* Right panel */}
        <div className="auth-right">
          <Link to="/login" className="auth-back-link">
            <ChevronLeft size={16} /> Back to Login
          </Link>

          <div className="auth-form-header">
            <div className="auth-icon-badge">
              <UserPlus size={22} />
            </div>
            <h1 className="auth-form-title">Create Account</h1>
            <p className="auth-form-desc">Patient registration — it&apos;s free &amp; only takes a minute</p>
          </div>

          {/* Google sign-up */}
          <button
            type="button"
            id="google-signup-btn"
            className="google-btn"
            onClick={handleGoogleSignup}
            disabled={googleLoading}
          >
            {googleLoading
              ? <><RefreshCw size={16} className="spin" /> Signing up with Google&hellip;</>
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
            <span className="auth-divider-text">or register with email</span>
            <span className="auth-divider-line" />
          </div>

          {success ? (
            <div className="auth-success">
              <CheckCircle2 size={40} className="success-icon" />
              <p>Account created! Redirecting to login&hellip;</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="auth-form">
              {/* Full name */}
              <div className="form-group">
                <label htmlFor="signup-name" className="form-label">Full Name</label>
                <div className="input-wrap">
                  <User size={16} className="input-icon" />
                  <input
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={e => setField('name', e.target.value)}
                    className={`form-input input-padded ${errors.name ? 'input-error' : ''}`}
                  />
                </div>
                {errors.name && <p className="field-error"><AlertCircle size={13} />{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="signup-email" className="form-label">Email Address</label>
                <div className="input-wrap">
                  <Mail size={16} className="input-icon" />
                  <input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => setField('email', e.target.value)}
                    className={`form-input input-padded ${errors.email ? 'input-error' : ''}`}
                  />
                </div>
                {errors.email && <p className="field-error"><AlertCircle size={13} />{errors.email}</p>}
              </div>

              {/* Phone + DOB row */}
              <div className="form-row">
                <div className="form-group form-group-half">
                  <label htmlFor="signup-phone" className="form-label">Phone Number</label>
                  <div className="input-wrap">
                    <Phone size={16} className="input-icon" />
                    <input
                      id="signup-phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="9876543210"
                      maxLength={10}
                      value={form.phone}
                      onChange={e => setField('phone', e.target.value.replace(/\D/g, ''))}
                      className={`form-input input-padded ${errors.phone ? 'input-error' : ''}`}
                    />
                  </div>
                  {errors.phone && <p className="field-error"><AlertCircle size={13} />{errors.phone}</p>}
                </div>

                <div className="form-group form-group-half">
                  <label htmlFor="signup-dob" className="form-label">Date of Birth</label>
                  <div className="input-wrap">
                    <Calendar size={16} className="input-icon" />
                    <input
                      id="signup-dob"
                      type="date"
                      max={maxDob}
                      value={form.dob}
                      onChange={e => setField('dob', e.target.value)}
                      className={`form-input input-padded ${errors.dob ? 'input-error' : ''}`}
                    />
                  </div>
                  {errors.dob && <p className="field-error"><AlertCircle size={13} />{errors.dob}</p>}
                </div>
              </div>

              {/* Gender */}
              <div className="form-group">
                <label className="form-label">Gender</label>
                <div className="gender-group">
                  {['Male', 'Female', 'Other', 'Prefer not to say'].map(g => (
                    <button
                      key={g}
                      type="button"
                      id={`gender-${g.toLowerCase().replace(/\s+/g, '-')}`}
                      className={`gender-btn ${form.gender === g ? 'gender-btn-active' : ''}`}
                      onClick={() => setField('gender', g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                {errors.gender && <p className="field-error"><AlertCircle size={13} />{errors.gender}</p>}
              </div>

              {/* City / Location */}
              <div className="form-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label htmlFor="signup-city" className="form-label" style={{ margin: 0 }}>
                    City / Location <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 400 }}>(for finding nearby doctors)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoDetectLocation}
                    disabled={isLocating}
                    style={{
                      background: 'none', border: 'none', color: 'var(--primary-light)',
                      fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                    }}
                  >
                    <LocateFixed size={13} className={isLocating ? 'spin' : ''} />
                    {isLocating ? 'Detecting...' : 'Auto-Detect'}
                  </button>
                </div>
                <div className="input-wrap">
                  <MapPin size={16} className="input-icon" />
                  <input
                    id="signup-city"
                    type="text"
                    autoComplete="address-level2"
                    placeholder="e.g. Mumbai, Navi Mumbai, Pune, Delhi"
                    value={form.city}
                    onChange={e => setField('city', e.target.value)}
                    className="form-input input-padded"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="signup-password" className="form-label">Password</label>
                <div className="input-wrap">
                  <Lock size={16} className="input-icon" />
                  <input
                    id="signup-password"
                    type={showPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={e => setField('password', e.target.value)}
                    className={`form-input input-padded input-padded-right ${errors.password ? 'input-error' : ''}`}
                  />
                  <button
                    type="button"
                    id="toggle-signup-password"
                    className="input-eye"
                    onClick={() => setShowPass(v => !v)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="field-error"><AlertCircle size={13} />{errors.password}</p>}
                {form.password && (
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

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="signup-confirm-password" className="form-label">Confirm Password</label>
                <div className="input-wrap">
                  <Lock size={16} className="input-icon" />
                  <input
                    id="signup-confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={e => setField('confirmPassword', e.target.value)}
                    className={`form-input input-padded input-padded-right ${errors.confirmPassword ? 'input-error' : ''}`}
                  />
                  <button
                    type="button"
                    id="toggle-confirm-password"
                    className="input-eye"
                    onClick={() => setShowConfirm(v => !v)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="field-error"><AlertCircle size={13} />{errors.confirmPassword}</p>
                )}
                {form.confirmPassword && !errors.confirmPassword && form.confirmPassword === form.password && (
                  <p className="field-success"><CheckCircle2 size={13} /> Passwords match</p>
                )}
              </div>

              {/* Terms */}
              <div className="form-group">
                <label className="checkbox-label" id="terms-checkbox-label">
                  <input
                    id="agree-terms"
                    type="checkbox"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom" />
                  <span className="checkbox-text">
                    I agree to the{' '}
                    <Link to="/terms" className="auth-link">Terms of Service</Link>
                    {' '}&amp;{' '}
                    <Link to="/privacy" className="auth-link">Privacy Policy</Link>
                  </span>
                </label>
                {errors.agreed && <p className="field-error"><AlertCircle size={13} />{errors.agreed}</p>}
              </div>

              <button
                type="submit"
                id="signup-submit-btn"
                className="auth-submit-btn"
                disabled={submitting}
              >
                {submitting ? (
                  <><RefreshCw size={16} className="spin" /> Creating Account&hellip;</>
                ) : (
                  <>Create Account <ArrowRight size={16} /></>
                )}
              </button>

              <p className="auth-redirect">
                Already have an account?{' '}
                <Link to="/login" className="auth-link auth-link-bold">Sign in &rarr;</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
