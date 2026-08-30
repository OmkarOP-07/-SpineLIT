const jwt = require('jsonwebtoken')

const SECRET         = process.env.SECRET_KEY || 'change-me-in-production'
const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRE_MINUTES
  ? `${process.env.ACCESS_TOKEN_EXPIRE_MINUTES}m`
  : '15m'
const REFRESH_EXPIRES_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRE_DAYS || '7', 10)

/**
 * Creates a short-lived access token.
 * @param {{ id, email, role }} payload
 */
function signAccessToken(payload) {
  return jwt.sign(
    { sub: payload.id, email: payload.email, role: payload.role },
    SECRET,
    { expiresIn: ACCESS_EXPIRES }
  )
}

/**
 * Creates a long-lived refresh token.
 * @param {{ id }} payload
 * @returns {{ token: string, expiresAt: Date }}
 */
function signRefreshToken(payload) {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + REFRESH_EXPIRES_DAYS)

  const token = jwt.sign(
    { sub: payload.id, type: 'refresh' },
    SECRET,
    { expiresIn: `${REFRESH_EXPIRES_DAYS}d` }
  )

  return { token, expiresAt }
}

/**
 * Verifies and decodes a JWT.
 * @param {string} token
 * @returns {object} decoded payload
 * @throws {Error} if invalid or expired
 */
function verifyToken(token) {
  return jwt.verify(token, SECRET)
}

module.exports = { signAccessToken, signRefreshToken, verifyToken }
