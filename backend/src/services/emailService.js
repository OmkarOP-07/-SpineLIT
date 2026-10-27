const nodemailer = require('nodemailer')

let _transporter = null

function isSmtpConfigured() {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  return Boolean(
    user &&
    pass &&
    user.trim() !== '' &&
    pass.trim() !== '' &&
    !user.includes('your-email') &&
    !pass.includes('your-gmail')
  )
}

function getTransporter() {
  if (_transporter) return _transporter

  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASS?.trim()?.replace(/\s+/g, '') // remove spaces from Gmail app password
  const host = process.env.SMTP_HOST?.trim() || 'smtp.gmail.com'
  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const isSecure = process.env.SMTP_SECURE === 'true' || port === 465

  _transporter = nodemailer.createTransport({
    host: host.includes('gmail') ? 'smtp.gmail.com' : host,
    port: port || 587,
    secure: isSecure,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 8000, // 8s connection timeout
    greetingTimeout: 8000,
    socketTimeout: 10000,   // 10s socket timeout
  })

  return _transporter
}

/**
 * Sends an OTP email to a doctor using Nodemailer.
 * @param {string} toEmail
 * @param {string} otp
 * @param {string} name
 */
async function sendOtpEmail(toEmail, otp, name = 'Doctor') {
  console.log(`\n========================================`)
  console.log(`🔑  [DOCTOR OTP REQUEST]`)
  console.log(`    Recipient: ${toEmail}`)
  console.log(`    OTP Code:  ${otp}`)
  console.log(`    Expires:   ${process.env.OTP_EXPIRE_MINUTES || 10} minutes`)
  console.log(`========================================\n`)

  if (!isSmtpConfigured()) {
    console.log(`ℹ️  SMTP credentials not yet set in backend/.env.`)
    console.log(`👉  To send real emails to ${toEmail}, set SMTP_USER and SMTP_PASS in backend/.env.`)
    console.log(`👉  In the meantime, use the OTP code above: [${otp}] to log in immediately!\n`)
    return { sent: false, reason: 'SMTP not configured in backend/.env', otp }
  }

  const transporter = getTransporter()
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || 'SpineLIT <noreply@spinelit.com>'

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>SpineLIT Doctor Verification Code</title>
    </head>
    <body style="margin:0;padding:0;background:#0d0e1b;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <div style="max-width:520px;margin:30px auto;background:#151728;border-radius:18px;
                  border:1px solid rgba(133,57,83,0.3);box-shadow:0 12px 40px rgba(0,0,0,0.6);overflow:hidden;">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#853953,#5b2336);padding:30px 32px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:800;letter-spacing:-0.5px;">SpineLIT</h1>
          <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:13px;font-weight:500;">
            Doctor Portal Authentication
          </p>
        </div>

        <!-- Body -->
        <div style="padding:32px 30px;">
          <p style="color:#e2e8f0;font-size:15px;margin:0 0 10px;">Hello <strong>${name}</strong>,</p>
          <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 26px;">
            A login request was received for your SpineLIT clinical doctor account. Use the one-time verification code below to authorize your session:
          </p>

          <!-- OTP Box -->
          <div style="background:rgba(133,57,83,0.15);border:2px dashed rgba(133,57,83,0.5);
                      border-radius:14px;padding:22px;text-align:center;margin-bottom:26px;">
            <div style="font-size:11px;font-weight:700;color:#f472b6;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">
              Your 6-Digit One-Time Password
            </div>
            <span style="font-size:42px;font-weight:900;letter-spacing:14px;color:#ffffff;
                         font-family:'Courier New',Courier,monospace;display:inline-block;padding-left:14px;">
              ${otp}
            </span>
          </div>

          <p style="color:#94a3b8;font-size:13px;line-height:1.5;margin:0 0 16px;">
            ⏱ This code is valid for <strong>${process.env.OTP_EXPIRE_MINUTES || 10} minutes</strong>. For security, never share this code with anyone.
          </p>

          <p style="color:#64748b;font-size:12px;line-height:1.5;margin:0;border-top:1px solid rgba(255,255,255,0.08);padding-top:16px;">
            If you did not request this OTP, you can safely disregard this email or verify your account security settings.
          </p>
        </div>

        <!-- Footer -->
        <div style="background:#0e101d;border-top:1px solid rgba(255,255,255,0.06);padding:18px 30px;text-align:center;">
          <p style="color:#64748b;font-size:11px;margin:0;">
            &copy; ${new Date().getFullYear()} SpineLIT Medical Systems · Automated Security Notification
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    const sendPromise = transporter.sendMail({
      from: fromAddress.includes('<') ? fromAddress : `"SpineLIT Portal" <${fromAddress}>`,
      to: toEmail,
      subject: `SpineLIT Doctor Login OTP: ${otp}`,
      text: `Hello ${name},\n\nYour SpineLIT verification code is: ${otp}\n\nValid for ${process.env.OTP_EXPIRE_MINUTES || 10} minutes.\n\nDo not share this code.`,
      html,
    })

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('SMTP connection timed out after 9 seconds')), 9000)
    )

    const info = await Promise.race([sendPromise, timeoutPromise])

    console.log(`📧  ✅ OTP Email successfully sent to ${toEmail} (MessageId: ${info.messageId})`)
    return { sent: true, messageId: info.messageId, otp }
  } catch (err) {
    console.error(`⚠️  Nodemailer error sending to ${toEmail}:`, err.message)
    console.log(`👉  You can still log in using the terminal OTP above: [${otp}]\n`)
    return { sent: false, error: err.message, otp }
  }
}

module.exports = { sendOtpEmail, isSmtpConfigured }
