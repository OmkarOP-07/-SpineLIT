const express        = require('express')
const rateLimit      = require('express-rate-limit')
const { body, validationResult } = require('express-validator')

const { verifyFirebaseToken, isFirebaseReady } = require('../config/firebase')
const { User, RefreshToken }  = require('../models')
const { signAccessToken, signRefreshToken, verifyToken } = require('../services/jwtService')
const { generateOtp, verifyOtp }  = require('../services/otpService')
const { sendOtpEmail }            = require('../services/emailService')
const { authenticate }            = require('../middleware/authenticate')

const router = express.Router()

// ─── Firebase guard ───────────────────────────────────
// Returns 503 with clear setup instructions when serviceAccountKey.json is missing
function firebaseRequired(req, res, next) {
  if (!isFirebaseReady()) {
    return res.status(503).json({
      detail: 'Firebase Admin is not configured on the server.',
      fix: 'Download serviceAccountKey.json from Firebase Console → Project Settings → Service Accounts and place it in the backend/ folder, then restart the server.',
    })
  }
  next()
}

// ─── Rate limiters ────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 10,
  message: { detail: 'Too many login attempts. Please wait 15 minutes.' },
})

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { detail: 'Too many OTP requests. Please wait 15 minutes.' },
})

// ─── Helpers ──────────────────────────────────────────
function validationErrors(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const first = errors.array()[0]
    res.status(422).json({ detail: first.msg, field: first.path })
    return true
  }
  return false
}

async function issueTokens(user, res) {
  const access  = signAccessToken(user)
  const { token: refreshToken, expiresAt } = signRefreshToken(user)

  // Store refresh token in DB
  await RefreshToken.create({
    user_id:    user.id,
    token:      refreshToken,
    expires_at: expiresAt,
  })

  // Set httpOnly cookie for refresh token (more secure)
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   parseInt(process.env.REFRESH_TOKEN_EXPIRE_DAYS || '7', 10) * 24 * 60 * 60 * 1000,
  })

  return {
    access_token: access,
    user: user.toJSON ? {
      id:         user.id,
      email:      user.email,
      name:       user.name,
      phone:      user.phone,
      dob:        user.dob,
      gender:     user.gender,
      city:       user.city,
      location:   user.location,
      latitude:   user.latitude,
      longitude:  user.longitude,
      photo_url:  user.photo_url,
      role:       user.role,
      provider:   user.provider,
      is_verified: user.is_verified,
    } : user,
  }
}

// ══════════════════════════════════════════════════════
// POST /api/auth/register   — Patient self-registration
// Frontend flow:
//   1. Firebase creates account (email+password)
//   2. Frontend gets ID token
//   3. Sends { firebase_id_token, name, phone, dob, gender, city, location, latitude, longitude } here
// ══════════════════════════════════════════════════════
router.post('/register',
  firebaseRequired,
  loginLimiter,
  [
    body('firebase_id_token').notEmpty().withMessage('Firebase ID token is required.'),
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters.'),
    body('phone').optional().isMobilePhone().withMessage('Invalid phone number.'),
    body('dob').optional().isDate().withMessage('Invalid date of birth.'),
    body('city').optional().isString(),
    body('location').optional().isString(),
    body('latitude').optional().isNumeric(),
    body('longitude').optional().isNumeric(),
  ],
  async (req, res, next) => {
    if (validationErrors(req, res)) return
    try {
      const { firebase_id_token, name, phone, dob, gender, city, location, latitude, longitude } = req.body

      // Verify Firebase token
      const decoded = await verifyFirebaseToken(firebase_id_token)
      const { uid, email, picture } = decoded

      // Check if user already exists
      const existing = await User.findOne({ where: { email } })
      if (existing) {
        return res.status(409).json({ detail: 'An account with this email already exists.' })
      }

      // Create user in DB
      const user = await User.create({
        firebase_uid: uid,
        email,
        name,
        phone:     phone || null,
        dob:       dob   || null,
        gender:    gender || null,
        city:      city   || null,
        location:  location || null,
        latitude:  latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        photo_url: picture || null,
        role:      'patient',
        provider:  decoded.firebase?.sign_in_provider === 'google.com' ? 'google' : 'email',
        is_verified: decoded.email_verified || false,
      })

      const payload = await issueTokens(user, res)
      return res.status(201).json({ message: 'Account created successfully.', ...payload })
    } catch (err) {
      next(err)
    }
  }
)

// ══════════════════════════════════════════════════════
// POST /api/auth/login/patient   — Patient login
// Frontend flow:
//   1. Firebase signs in with email+password → ID token
//   2. Sends { firebase_id_token } here
// ══════════════════════════════════════════════════════
router.post('/login/patient',
  firebaseRequired,
  loginLimiter,
  [body('firebase_id_token').notEmpty().withMessage('Firebase ID token required.')],
  async (req, res, next) => {
    if (validationErrors(req, res)) return
    try {
      const decoded = await verifyFirebaseToken(req.body.firebase_id_token)
      const { uid, email, name, picture } = decoded

      let user = await User.findOne({ where: { email } })

      if (!user) {
        // Auto-create patient on first login (social flow)
        user = await User.create({
          firebase_uid: uid,
          email,
          name:      name || email.split('@')[0],
          photo_url: picture || null,
          role:      'patient',
          provider:  'email',
          is_verified: decoded.email_verified || false,
        })
      } else {
        // Keep firebase_uid & verification status up to date
        await user.update({ firebase_uid: uid, is_verified: decoded.email_verified || false })
      }

      if (!user.is_active) {
        return res.status(403).json({ detail: 'Your account has been deactivated.' })
      }

      const payload = await issueTokens(user, res)
      return res.json({ message: 'Login successful.', ...payload })
    } catch (err) {
      next(err)
    }
  }
)

// ══════════════════════════════════════════════════════
// POST /api/auth/google   — Google OAuth (both roles)
// Frontend flow:
//   1. Firebase signInWithPopup → ID token
//   2. Sends { firebase_id_token } here
// ══════════════════════════════════════════════════════
router.post('/google',
  firebaseRequired,
  loginLimiter,
  [body('firebase_id_token').notEmpty().withMessage('Firebase ID token required.')],
  async (req, res, next) => {
    if (validationErrors(req, res)) return
    try {
      const decoded = await verifyFirebaseToken(req.body.firebase_id_token)
      const { uid, email, name, picture } = decoded

      let user = await User.findOne({ where: { email } })

      if (!user) {
        user = await User.create({
          firebase_uid: uid,
          email,
          name:       name || email.split('@')[0],
          photo_url:  picture || null,
          role:       'patient',     // Google users default to patient
          provider:   'google',
          is_verified: true,
        })
      } else {
        await user.update({
          firebase_uid: uid,
          photo_url:    picture || user.photo_url,
          provider:     'google',
          is_verified:  true,
        })
      }

      if (!user.is_active) {
        return res.status(403).json({ detail: 'Your account has been deactivated.' })
      }

      const payload = await issueTokens(user, res)
      return res.json({ message: 'Google login successful.', ...payload })
    } catch (err) {
      next(err)
    }
  }
)

// ══════════════════════════════════════════════════════
// POST /api/auth/doctor/request-otp
// Generates and sends OTP email via Nodemailer to the requested email.
// ══════════════════════════════════════════════════════
router.post('/doctor/request-otp',
  otpLimiter,
  [body('email').isEmail().normalizeEmail().withMessage('Valid email required.')],
  async (req, res, next) => {
    if (validationErrors(req, res)) return
    try {
      const { email } = req.body

      // Authorized email check: if AUTHORIZED_DOCTOR_EMAILS is set, restrict to authorized list
      const authorizedList = process.env.AUTHORIZED_DOCTOR_EMAILS
        ? process.env.AUTHORIZED_DOCTOR_EMAILS.split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
        : []

      if (authorizedList.length > 0 && !authorizedList.includes(email.toLowerCase())) {
        return res.status(403).json({
          detail: 'This email is not on the authorized doctor list. Please contact administrator.'
        })
      }

      // Look up doctor name if already registered, otherwise default
      const doctor = await User.findOne({ where: { email, is_active: true } })
      const doctorName = doctor?.name || 'Dr. ' + (email.split('@')[0].replace(/[._]/g, ' '))

      // Generate 6-digit OTP
      const otp = generateOtp(email)

      // Send OTP via Nodemailer
      const emailResult = await sendOtpEmail(email, otp, doctorName)

      return res.json({
        message: 'Verification code has been sent to your email address.',
        // In dev or when SMTP is not yet active, supply dev_otp so testing is always unblocked
        ...(process.env.NODE_ENV !== 'production' ? { dev_otp: otp } : {}),
        email_sent: emailResult?.sent || false,
      })
    } catch (err) {
      next(err)
    }
  }
)

// ══════════════════════════════════════════════════════
// POST /api/auth/login/doctor
// Frontend flow:
//   1. Firebase signs in with email+password → ID token
//   2. Sends { firebase_id_token, otp } here
// ══════════════════════════════════════════════════════
router.post('/login/doctor',
  loginLimiter,
  [
    body('otp').isLength({ min: 6, max: 6 }).isNumeric().withMessage('OTP must be 6 digits.'),
  ],
  async (req, res, next) => {
    if (validationErrors(req, res)) return
    try {
      const { firebase_id_token, email: directEmail, otp } = req.body

      let email = directEmail
      let uid = null
      let name = null
      let picture = null

      // If a Firebase token was supplied, extract UID and profile
      if (firebase_id_token) {
        try {
          const decoded = await verifyFirebaseToken(firebase_id_token)
          uid = decoded.uid
          email = decoded.email || email
          name = decoded.name
          picture = decoded.picture
        } catch (fbErr) {
          // If Firebase client authentication failed, fallback to verified email OTP
          console.warn('Firebase client token not used:', fbErr.message)
        }
      }

      if (!email) {
        return res.status(422).json({ detail: 'Doctor email address is required.' })
      }

      email = email.trim().toLowerCase()

      // 1. Verify OTP code sent to this email address
      const { valid, reason } = verifyOtp(email, otp)
      if (!valid) {
        return res.status(401).json({ detail: reason || 'Invalid or expired OTP code.' })
      }

      // 2. Check authorized doctor email list if configured
      const authorizedList = process.env.AUTHORIZED_DOCTOR_EMAILS
        ? process.env.AUTHORIZED_DOCTOR_EMAILS.split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
        : []

      if (authorizedList.length > 0 && !authorizedList.includes(email)) {
        return res.status(403).json({
          detail: 'This email is not on the authorized doctor list.'
        })
      }

      // 3. Find or create doctor in DB
      let doctor = await User.findOne({ where: { email } })
      if (!doctor) {
        doctor = await User.create({
          firebase_uid: uid,
          email,
          name: name || 'Dr. ' + (email.split('@')[0].replace(/[._]/g, ' ')),
          photo_url: picture || null,
          role: 'doctor',
          provider: 'email',
          is_active: true,
          is_verified: true,
        })
      } else {
        await doctor.update({
          firebase_uid: uid || doctor.firebase_uid,
          role: 'doctor', // Upgrade/confirm doctor privileges
          is_active: true,
          is_verified: true,
        })
      }

      const payload = await issueTokens(doctor, res)
      return res.json({ message: 'Doctor login successful.', ...payload })
    } catch (err) {
      next(err)
    }
  }
)

// ══════════════════════════════════════════════════════
// POST /api/auth/refresh   — Rotate access token
// Reads refresh_token from httpOnly cookie (or body as fallback)
// ══════════════════════════════════════════════════════
router.post('/refresh', async (req, res, next) => {
  try {
    const token = req.cookies?.refresh_token || req.body?.refresh_token
    if (!token) return res.status(401).json({ detail: 'Refresh token not found.' })

    // Verify JWT signature
    let decoded
    try {
      decoded = verifyToken(token)
    } catch {
      return res.status(401).json({ detail: 'Invalid or expired refresh token.' })
    }

    // Check DB
    const stored = await RefreshToken.findOne({ where: { token, revoked: false } })
    if (!stored || new Date(stored.expires_at) < new Date()) {
      return res.status(401).json({ detail: 'Refresh token expired or revoked.' })
    }

    const user = await User.findByPk(decoded.sub)
    if (!user || !user.is_active) {
      return res.status(401).json({ detail: 'User not found or deactivated.' })
    }

    // Revoke old token and issue new pair
    await stored.update({ revoked: true })
    const payload = await issueTokens(user, res)

    return res.json({ message: 'Token refreshed.', ...payload })
  } catch (err) {
    next(err)
  }
})

// ══════════════════════════════════════════════════════
// POST /api/auth/logout
// ══════════════════════════════════════════════════════
router.post('/logout', async (req, res, next) => {
  try {
    const token = req.cookies?.refresh_token || req.body?.refresh_token
    if (token) {
      await RefreshToken.update({ revoked: true }, { where: { token } })
    }
    res.clearCookie('refresh_token')
    return res.json({ message: 'Logged out successfully.' })
  } catch (err) {
    next(err)
  }
})

// ══════════════════════════════════════════════════════
// GET /api/auth/me   — Get current user profile
// ══════════════════════════════════════════════════════
router.get('/me', authenticate, (req, res) => {
  const u = req.user
  res.json({
    id:         u.id,
    email:      u.email,
    name:       u.name,
    phone:      u.phone,
    dob:        u.dob,
    gender:     u.gender,
    city:       u.city,
    location:   u.location,
    latitude:   u.latitude,
    longitude:  u.longitude,
    photo_url:  u.photo_url,
    role:       u.role,
    provider:   u.provider,
    is_verified: u.is_verified,
    created_at: u.createdAt,
  })
})

// ══════════════════════════════════════════════════════
// PUT /api/auth/location   — Update user's saved location
// ══════════════════════════════════════════════════════
router.put('/location', authenticate, async (req, res, next) => {
  try {
    const { city, location, latitude, longitude } = req.body
    await req.user.update({
      city: city || req.user.city,
      location: location || req.user.location,
      latitude: latitude ? parseFloat(latitude) : req.user.latitude,
      longitude: longitude ? parseFloat(longitude) : req.user.longitude,
    })
    return res.json({ message: 'Location updated.', user: req.user })
  } catch (err) {
    next(err)
  }
})

module.exports = router
