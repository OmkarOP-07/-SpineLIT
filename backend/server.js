require('dotenv').config()
const express    = require('express')
const cors       = require('cors')
const helmet     = require('helmet')
const morgan     = require('morgan')
const { sequelize } = require('./src/config/database')
require('./src/models')   // register all models so Sequelize knows about them

const authRoutes = require('./src/routes/auth')

const app  = express()
const PORT = process.env.PORT || 5000

// ─── Security & parsing ───────────────────────────────
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// ─── CORS ─────────────────────────────────────────────
const rawFrontendUrls = process.env.FRONTEND_URL || 'http://localhost:5173'
const allowedOrigins = [
  ...rawFrontendUrls.split(',').map(u => u.trim()),
  'https://spinelit-e64d6.web.app',
  'https://spinelit-e64d6.firebaseapp.com',
  'http://localhost:5173',
  'http://localhost:5174',
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true)
    }
    return callback(null, false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ─── Routes ───────────────────────────────────────────
app.use('/api/auth', authRoutes)

// ─── Health check ────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'SpineLIT API', version: '1.0.0' })
})

// ─── 404 ─────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ detail: 'Route not found.' })
})

// ─── Global error handler ────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err)
  res.status(err.status || 500).json({
    detail: err.message || 'Internal server error.',
  })
})

// ─── Start ───────────────────────────────────────────
async function start() {
  try {
    await sequelize.authenticate()
    console.log('✅  Database connected')

    // Clean up any stale backup table from SQLite dialect
    await sequelize.query('DROP TABLE IF EXISTS users_backup;').catch(() => {})

    // Safe sync without destructive alter table rebuild
    await sequelize.sync()

    // Ensure columns exist on SQLite
    const safeAddColumn = async (table, col, type) => {
      try {
        await sequelize.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${col}\` ${type};`)
      } catch (err) {
        // Column already exists, safe to ignore
      }
    }
    await safeAddColumn('users', 'city', 'VARCHAR(255)')
    await safeAddColumn('users', 'location', 'VARCHAR(255)')
    await safeAddColumn('users', 'latitude', 'FLOAT')
    await safeAddColumn('users', 'longitude', 'FLOAT')

    console.log('✅  Tables synced')

    try {
      const { getFirebaseApp } = require('./src/config/firebase')
      getFirebaseApp()
    } catch (fbErr) {
      console.warn('⚠️  Firebase Admin:', fbErr.message)
    }

    app.listen(PORT, () => {
      console.log(`🚀  SpineLIT backend running → http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('❌  Failed to start server:', err)
    process.exit(1)
  }
}

start()
