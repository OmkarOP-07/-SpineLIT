// src/services/authService.js
// All API calls to the SpineLIT backend

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

async function request(path, options = {}) {
  const token = localStorage.getItem('access_token')
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed.' }))
    // Surface the setup fix hint if Firebase isn't configured on the server
    if (res.status === 503 && err.fix) {
      err.detail = `Server not configured: ${err.fix}`
    }
    throw err
  }

  return res.json()
}

// ── Patient registration ───────────────────────────────────────────
// Call after Firebase creates the account: passes the ID token + form data
export async function registerPatient({ firebaseIdToken, name, phone, dob, gender, city, location, latitude, longitude }) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      firebase_id_token: firebaseIdToken,
      name,
      phone,
      dob,
      gender,
      city,
      location,
      latitude,
      longitude,
    }),
  })
}

// ── Update patient location ─────────────────────────────────────────
export async function updateUserLocation({ city, location, latitude, longitude }) {
  return request('/api/auth/location', {
    method: 'PUT',
    body: JSON.stringify({ city, location, latitude, longitude }),
  })
}

// ── Patient login (Firebase email/password → ID token → backend) ────
export async function loginPatient(firebaseIdToken) {
  return request('/api/auth/login/patient', {
    method: 'POST',
    body: JSON.stringify({ firebase_id_token: firebaseIdToken }),
  })
}

// ── Doctor: request OTP ────────────────────────────────────────────
export async function requestDoctorOtp(email) {
  return request('/api/auth/doctor/request-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

// ── Doctor login (Email + OTP, with optional Firebase token) ──────
export async function loginDoctor(param1, param2) {
  let body = {}
  if (typeof param1 === 'object' && param1 !== null) {
    body = {
      email: param1.email,
      otp: param1.otp,
      firebase_id_token: param1.firebaseIdToken || param1.firebase_id_token || null,
    }
  } else {
    body = {
      firebase_id_token: param1,
      otp: param2,
    }
  }
  return request('/api/auth/login/doctor', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

// ── Google OAuth ───────────────────────────────────────────────────
export async function loginWithGoogle(firebaseIdToken) {
  return request('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ firebase_id_token: firebaseIdToken }),
  })
}

// ── Refresh access token (uses httpOnly cookie) ─────────────────────
export async function refreshAccessToken() {
  const res = await fetch(`${BASE}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw await res.json()
  return res.json()  // { access_token }
}

// ── Logout ──────────────────────────────────────────────────────────
export async function logoutApi() {
  return request('/api/auth/logout', { method: 'POST' })
}

// ── Get current user ────────────────────────────────────────────────
export async function getMe() {
  return request('/api/auth/me')
}
