const { verifyToken } = require('../services/jwtService')
const { User }        = require('../models')

/**
 * Middleware that validates a Bearer JWT in the Authorization header.
 * Attaches the full User DB record to req.user.
 */
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ detail: 'Authentication required.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = verifyToken(token)
    const user    = await User.findByPk(decoded.sub)

    if (!user || !user.is_active) {
      return res.status(401).json({ detail: 'User not found or deactivated.' })
    }

    req.user = user
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ detail: 'Access token expired. Please refresh.' })
    }
    return res.status(401).json({ detail: 'Invalid token.' })
  }
}

/**
 * Middleware factory that restricts access to specific roles.
 * Must be used after authenticate().
 * @param {...string} roles  e.g. requireRole('doctor', 'admin')
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ detail: 'Not authenticated.' })
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ detail: `Access restricted to: ${roles.join(', ')}` })
    }
    next()
  }
}

module.exports = { authenticate, requireRole }
