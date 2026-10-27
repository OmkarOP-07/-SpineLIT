const admin = require('firebase-admin')
const path  = require('path')
const fs    = require('fs')

let _app       = null
let _initError = null

function getFirebaseApp() {
  if (_app) return _app
  if (_initError) throw _initError

  // Check if credentials provided via environment variable (ideal for Render/Cloud)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
      _app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      })
      console.log('✅  Firebase Admin initialised from environment variable')
      return _app
    } catch (err) {
      console.error('❌  Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', err.message)
    }
  }

  const keyPath = path.resolve(
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 'serviceAccountKey.json'
  )

  if (!fs.existsSync(keyPath)) {
    _initError = new Error(
      `serviceAccountKey.json not found at: ${keyPath}\n` +
      'Download it from: Firebase Console → Project Settings → Service Accounts → Generate new private key'
    )
    _initError.code = 'MISSING_SERVICE_ACCOUNT'
    throw _initError
  }

  try {
    const serviceAccount = require(keyPath)
    _app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
    console.log('✅  Firebase Admin initialised')
  } catch (err) {
    _initError = err
    console.error('❌  Firebase Admin init failed:', err.message)
    throw err
  }

  return _app
}

/**
 * Verifies a Firebase ID token (sent from the frontend after sign-in).
 * @param {string} idToken
 * @returns {Promise<admin.auth.DecodedIdToken>}
 */
async function verifyFirebaseToken(idToken) {
  getFirebaseApp()
  return admin.auth().verifyIdToken(idToken)
}

/** Returns true when Firebase Admin is ready to use */
function isFirebaseReady() {
  if (_app) return true
  try {
    getFirebaseApp()
    return _app !== null
  } catch {
    return false
  }
}

module.exports = { getFirebaseApp, verifyFirebaseToken, isFirebaseReady }
