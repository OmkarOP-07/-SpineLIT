const nodemailer = require('nodemailer')

let _transporter = null

function isSmtpConfigured() {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  return Boolean(user && pass && !user.includes('your-email') && !pass.includes('your-gmail'))
}

function getTransporter() {
  if (_transporter) return _transporter

  const transportConfig = {
    host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
    port:   parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
  }

  if (isSmtpConfigured()) {
    transportConfig.auth = {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
  }

  _transporter = nodemailer.createTransport(transportConfig)
  return _transporter
}

/**
 * Sends an OTP email to a doctor.
 * @param {string} toEmail
 * @param {string} otp
 * @param {string} name
 */
async function sendOtpEmail(toEmail, otp, name = 'Doctor') {
  console.log(`\n========================================`)
  console.log(`🔑  [DEV OTP] For: ${toEmail} | OTP: ${otp}`)
  console.log(`========================================\n`)

  if (!isSmtpConfigured()) {
    console.log(`ℹ️  SMTP credentials not set in .env. Use the [DEV OTP] printed above to log in.`)
    return
  }

  const transporter = getTransporter()
  const from        = process.env.SMTP_FROM || process.env.SMTP_USER

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#0a0b1e;font-family:'Segoe UI',sans-serif;">
      <div style="max-width:480px;margin:40px auto;background:#12132d;border-radius:16px;
                  border:1px solid rgba(139,92,246,0.2);overflow:hidden;">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#7c3aed,#4c1d95);padding:28px 32px;">
          <h1 style="color:#fff;margin:0;font-size:22px;letter-spacing:-0.3px;">SpineLIT</h1>
          <p style="color:rgba(255,255,255,0.75);margin:4px 0 0;font-size:13px;">AI-Powered Spine Intelligence</p>
        </div>

        <!-- Body -->
        <div style="padding:32px;">
          <p style="color:#cbd5e1;font-size:15px;margin:0 0 8px;">Hi <strong>${name}</strong>,</p>
          <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 28px;">
            Use the code below to complete your login. It expires in
            <strong style="color:#a78bfa;">${process.env.OTP_EXPIRE_MINUTES || 10} minutes</strong>.
          </p>

          <!-- OTP Box -->
          <div style="background:rgba(124,58,237,0.1);border:1.5px solid rgba(139,92,246,0.3);
                      border-radius:12px;padding:20px;text-align:center;margin-bottom:28px;">
            <span style="font-size:38px;font-weight:800;letter-spacing:12px;color:#a78bfa;
                         font-family:'Courier New',monospace;">${otp}</span>
          </div>

          <p style="color:#64748b;font-size:12px;line-height:1.6;margin:0;">
            If you didn't request this code, please ignore this email or contact support
            if you think your account has been compromised.
          </p>
        </div>

        <!-- Footer -->
        <div style="border-top:1px solid rgba(139,92,246,0.1);padding:16px 32px;">
          <p style="color:#475569;font-size:11px;margin:0;">
            &copy; ${new Date().getFullYear()} SpineLIT. Do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from:    `"SpineLIT" <${from}>`,
      to:      toEmail,
      subject: `Your SpineLIT login OTP: ${otp}`,
      text:    `Your SpineLIT OTP is: ${otp}. Valid for ${process.env.OTP_EXPIRE_MINUTES || 10} minutes.`,
      html,
    })
    console.log(`📧  OTP email sent to ${toEmail}`)
  } catch (err) {
    console.error(`⚠️  Failed to send OTP email via SMTP:`, err.message)
    console.log(`💡  Use the [DEV OTP] printed in terminal above to log in.`)
  }
}

module.exports = { sendOtpEmail }
