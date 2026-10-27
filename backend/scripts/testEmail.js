require('dotenv').config()
const nodemailer = require('nodemailer')
const { sendOtpEmail, isSmtpConfigured } = require('../src/services/emailService')

async function main() {
  console.log('\n--- SMTP Diagnostic Check ---')
  console.log('SMTP_HOST:', process.env.SMTP_HOST || '(none)')
  console.log('SMTP_PORT:', process.env.SMTP_PORT || '(none)')
  console.log('SMTP_USER:', process.env.SMTP_USER ? `${process.env.SMTP_USER.slice(0, 3)}***` : '(EMPTY)')
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? '****** (Set)' : '(EMPTY)')
  console.log('Is Configured?:', isSmtpConfigured())
  console.log('-----------------------------\n')

  if (!isSmtpConfigured()) {
    console.log('❌ Cannot send real email: SMTP_USER and SMTP_PASS are empty in backend/.env.')
    console.log('💡 How to fix:')
    console.log('   1. Open backend/.env')
    console.log('   2. Set SMTP_USER=your_email@gmail.com')
    console.log('   3. Set SMTP_PASS=your_16_char_app_password')
    console.log('   4. Save .env and restart backend\n')
    process.exit(1)
  }

  const testRecipient = process.argv[2] || process.env.SMTP_USER
  console.log(`Sending test OTP email to: ${testRecipient}...`)
  const result = await sendOtpEmail(testRecipient, '884920', 'Doctor')
  console.log('Result:', result)
}

main().catch(console.error)
