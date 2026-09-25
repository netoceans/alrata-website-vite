import nodemailer from 'nodemailer'
import { inquiryText, isEmail, type Inquiry } from './inquiry'

export function inquiryMailConfig(env: Record<string, string | undefined> = process.env) {
  const user = (env.SMTP_USER || 'dr.alrata@alratadental.com').trim()
  const to = (env.INQUIRY_TO || 'dr.alrata@alratadental.com').trim()
  const pass = (env.SMTP_PASS ?? '').replace(/\s/g, '')
  return isEmail(user) && isEmail(to) && /^[a-zA-Z]{16}$/.test(pass) ? { user, to, pass } : null
}

export async function sendInquiry(inquiry: Inquiry, createTransport = nodemailer.createTransport) {
  const config = inquiryMailConfig()
  if (!config) throw new Error('Email is not configured')
  const transport = createTransport({
    host: 'smtp.gmail.com', port: 465, secure: true,
    auth: { user: config.user, pass: config.pass },
    tls: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
    connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 15_000, dnsTimeout: 10_000,
    logger: false, debug: false, disableFileAccess: true, disableUrlAccess: true,
  })
  try {
    const result = await transport.sendMail({
      from: { name: 'Alrata Website', address: config.user },
      to: { address: config.to, name: 'Alrata Dental' },
      replyTo: { address: inquiry.email, name: '' },
      subject: 'New website enquiry', text: inquiryText(inquiry),
    })
    if (!result.accepted.length || result.rejected.length) throw new Error('Email was not accepted')
  } finally {
    transport.close()
  }
}
