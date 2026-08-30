require('dotenv').config()
const admin = require('firebase-admin')
const { getFirebaseApp } = require('../src/config/firebase')
const { sequelize } = require('../src/config/database')
const { User } = require('../src/models')

async function createDoctor() {
  const args = process.argv.slice(2)
  const email = args[0] || 'doctor@spinelit.com'
  const password = args[1] || 'Doctor@1234'
  const name = args[2] || 'Dr. Spine Specialist'

  console.log(`\n🏥 Setting Up Doctor Account...`)
  console.log(`   Email:    ${email}`)
  console.log(`   Password: ${password}`)
  console.log(`   Name:     ${name}\n`)

  try {
    await sequelize.authenticate()
    await sequelize.sync()

    // 1. Create or update user in SQLite DB
    const [dbUser, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        name,
        email,
        role: 'doctor',
        provider: 'email',
        is_active: true,
        is_verified: true,
      },
    })

    if (!created) {
      await dbUser.update({
        role: 'doctor',
        name,
        is_active: true,
        is_verified: true,
      })
      console.log(`✅  Database record updated to Doctor role.`)
    } else {
      console.log(`✅  Doctor record created in database.`)
    }

    // 2. Try creating in Firebase Auth
    try {
      getFirebaseApp()
      const existingFb = await admin.auth().getUserByEmail(email).catch(() => null)
      if (existingFb) {
        await admin.auth().updateUser(existingFb.uid, { password, displayName: name })
        await dbUser.update({ firebase_uid: existingFb.uid })
        console.log(`✅  Firebase user updated (UID: ${existingFb.uid})`)
      } else {
        const newFb = await admin.auth().createUser({
          email,
          password,
          displayName: name,
          emailVerified: true,
        })
        await dbUser.update({ firebase_uid: newFb.uid })
        console.log(`✅  Firebase user created (UID: ${newFb.uid})`)
      }
    } catch (fbErr) {
      console.warn(`\n⚠️  Note on Firebase User Creation:`, fbErr.message)
      if (fbErr.message.includes('reasonable timeframe') || fbErr.message.includes('invalid_grant')) {
        console.warn(`👉 Notice: Your computer system clock is set ahead of real time.`)
        console.warn(`   Sync your Windows date/time in Settings -> Time & Language -> Sync now.`)
        console.warn(`   Alternatively, create this account once via Firebase Console or Sign Up page.`)
      }
    }

    console.log(`\n🎉 Doctor ready in SpineLIT database!`)
    console.log(`   1. Open Login page -> click 'Doctor' tab`)
    console.log(`   2. Email: ${email}`)
    console.log(`   3. Click "Send OTP" -> Check this terminal for the 6-digit code`)
    console.log(`   4. Enter Password (${password}) and OTP`)
    console.log(`   5. Click "Sign In"\n`)

    process.exit(0)
  } catch (err) {
    console.error(`❌ Error setting up doctor:`, err)
    process.exit(1)
  }
}

createDoctor()
