// src/services/firebase.js
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey:            'AIzaSyCVSLwjTeSj9MB77AQVVlntuqM22nAzA24',
  authDomain:        'spinelit-e64d6.firebaseapp.com',
  projectId:         'spinelit-e64d6',
  storageBucket:     'spinelit-e64d6.firebasestorage.app',
  messagingSenderId: '823157777139',
  appId:             '1:823157777139:web:48cf41df2e3301f1bdcd86',
  measurementId:     'G-9YFEX0K559',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Analytics (browser only)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null

export const auth = getAuth(app)

const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('profile')
googleProvider.addScope('email')

// ── Google sign-in popup ───────────────────────────────────────────
// Returns the Firebase ID token (string) to send to your backend
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider)
  return result.user.getIdToken()
}

// ── Email + Password: sign in ─────────────────────────────────────
// Returns the Firebase ID token after successful sign-in
export async function signInWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user.getIdToken()
}

// ── Email + Password: create account ─────────────────────────────
// Creates a Firebase account, returns the ID token
export async function createUserWithEmail(email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  return cred.user.getIdToken()
}

// ── Sign out ──────────────────────────────────────────────────────
export async function signOutFirebase() {
  await firebaseSignOut(auth)
}
