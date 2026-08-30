/**
 * In-memory OTP store with auto-expiry.
 *
 * In production, replace with Redis:
 *   const redis = require('ioredis')
 *   const client = new redis(process.env.REDIS_URL)
 *   client.setex(`otp:${email}`, 600, otp)
 */

const OTP_EXPIRE_MS = (parseInt(process.env.OTP_EXPIRE_MINUTES || '10', 10)) * 60 * 1000

/** @type {Map<string, { otp: string, expiresAt: number, attempts: number }>} */
const store = new Map()

// Sweep expired entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now()
  for (const [key, val] of store) {
    if (val.expiresAt < now) store.delete(key)
  }
}, 5 * 60 * 1000)

/**
 * Generates a random 6-digit OTP and stores it for the given email.
 * @param {string} email
 * @returns {string} the generated OTP
 */
function generateOtp(email) {
  const otp = String(Math.floor(100000 + Math.random() * 900000))
  store.set(email.toLowerCase(), {
    otp,
    expiresAt: Date.now() + OTP_EXPIRE_MS,
    attempts: 0,
  })
  return otp
}

/**
 * Verifies the OTP for an email.
 * Returns true if valid, false otherwise.
 * Deletes the OTP after a successful verification (one-time use).
 * @param {string} email
 * @param {string} otp
 * @returns {{ valid: boolean, reason?: string }}
 */
function verifyOtp(email, otp) {
  const key    = email.toLowerCase()
  const record = store.get(key)

  if (!record) return { valid: false, reason: 'No OTP found. Please request a new one.' }
  if (Date.now() > record.expiresAt) {
    store.delete(key)
    return { valid: false, reason: 'OTP has expired. Please request a new one.' }
  }
  if (record.attempts >= 5) {
    store.delete(key)
    return { valid: false, reason: 'Too many failed attempts. Please request a new OTP.' }
  }
  if (record.otp !== String(otp)) {
    record.attempts += 1
    return { valid: false, reason: `Invalid OTP. ${5 - record.attempts} attempts remaining.` }
  }

  store.delete(key)   // one-time use
  return { valid: true }
}

module.exports = { generateOtp, verifyOtp }
