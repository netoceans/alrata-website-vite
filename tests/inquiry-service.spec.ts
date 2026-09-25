import { expect, test } from '@playwright/test'
import { createInquiryHandler, inquiryText, validateInquiry, type Inquiry } from '../src/lib/inquiry'
import nodemailer from 'nodemailer'
import { inquiryMailConfig, sendInquiry } from '../src/lib/inquiry-mail'

const inquiry: Inquiry = {
  fullName: 'Example Patient', phone: '+1 (314) 555-0100', email: 'patient@example.com',
  treatment: 'Check Up/Cleaning', newPatient: 'yes', preferredTime: 'Monday morning',
  message: 'Synthetic enquiry for testing.', consent: true,
}
const request = (data: unknown = inquiry, headers: Record<string, string> = {}) => new Request('https://clinic.example/api/inquiries', {
  method: 'POST', headers: { origin: 'https://clinic.example', 'content-type': 'application/json', ...headers }, body: JSON.stringify(data),
})

test('missing credentials fail closed and spaced App Passwords are normalized', () => {
  expect(inquiryMailConfig({})).toBeNull()
  expect(inquiryMailConfig({ SMTP_PASS: 'not-a-password' })).toBeNull()
  expect(inquiryMailConfig({ SMTP_PASS: 'abcd efgh ijkl mnop' })).toEqual({ user: 'dr.alrata@alratadental.com', to: 'dr.alrata@alratadental.com', pass: 'abcdefghijklmnop' })
  expect(inquiryMailConfig({ SMTP_PASS: 'abcdefghijklmnop', INQUIRY_TO: 'one@example.com,two@example.com' })).toBeNull()
})

test('valid submission sends all normalized fields and only returns acceptance', async () => {
  const sent: Inquiry[] = []
  const handler = createInquiryHandler({ configured: () => true, send: async value => { sent.push(value) } })
  const result = await handler(request({ ...inquiry, fullName: '  Example Patient  ', to: 'attacker@example.com' }))
  expect(result.status).toBe(200)
  expect(await result.json()).toEqual({ status: 'sent' })
  expect(result.headers.get('cache-control')).toContain('no-store')
  expect(sent).toEqual([inquiry])
  const text = inquiryText(sent[0])
  for (const value of [inquiry.fullName, inquiry.phone, inquiry.email, inquiry.treatment, inquiry.preferredTime, inquiry.message, 'New patient: Yes', 'accepted: Yes']) expect(text).toContain(value)
})

test('unconfigured service never sends and availability contains no secrets', async () => {
  const handler = createInquiryHandler({ configured: () => false, send: async () => { throw new Error('must not send') } })
  expect(await (await handler(new Request('https://clinic.example/api/inquiries'))).json()).toEqual({ available: false })
  expect((await handler(request())).status).toBe(503)
})

for (const [name, change, field] of [
  ['blank name', { fullName: '  ' }, 'fullName'],
  ['invalid email', { email: 'invalid' }, 'email'],
  ['header injection', { email: 'patient@example.com\r\nBcc: other@example.com' }, 'email'],
  ['invalid phone', { phone: 'abc' }, 'phone'],
  ['missing consent', { consent: false }, 'consent'],
  ['string consent', { consent: 'true' }, 'consent'],
  ['unknown treatment', { treatment: 'anything' }, 'treatment'],
  ['unknown patient status', { newPatient: 'maybe' }, 'newPatient'],
  ['long message', { message: 'x'.repeat(2001) }, 'message'],
  ['wrong type', { fullName: {} }, 'fullName'],
] as const) {
  test(`rejects ${name} before email delivery`, async () => {
    let calls = 0
    const handler = createInquiryHandler({ configured: () => true, send: async () => { calls++ } })
    const result = await handler(request({ ...inquiry, ...change }))
    expect(result.status).toBe(400)
    expect((await result.json()).errors[field]).toBeTruthy()
    expect(calls).toBe(0)
  })
}

test('rejects cross-origin, non-JSON, malformed, oversized, and honeypot requests', async () => {
  let calls = 0
  const handler = createInquiryHandler({ configured: () => true, send: async () => { calls++ } })
  expect((await handler(request(inquiry, { origin: 'https://other.example' }))).status).toBe(403)
  expect((await handler(request(inquiry, { 'content-type': 'text/plain' }))).status).toBe(415)
  expect((await handler(new Request('https://clinic.example/api/inquiries', { method: 'POST', headers: { origin: 'https://clinic.example', 'content-type': 'application/json' }, body: '{' }))).status).toBe(400)
  expect((await handler(request({ ...inquiry, message: 'x'.repeat(17000) }))).status).toBe(413)
  expect((await handler(request({ ...inquiry, website: 'spam' }))).status).toBe(400)
  expect(calls).toBe(0)
  expect(validateInquiry(null).inquiry).toBeUndefined()
})

test('provider failure never reports success or exposes SMTP details', async () => {
  const handler = createInquiryHandler({ configured: () => true, send: async () => { throw new Error('SMTP password secret; patient@example.com') } })
  const result = await handler(request())
  expect(result.status).toBe(502)
  const text = await result.text()
  expect(text).toContain('could not confirm')
  expect(text).not.toContain('secret')
  expect(text).not.toContain(inquiry.email)
})

test('throttles repeated senders and resets after ten minutes', async () => {
  let time = 0
  let calls = 0
  const handler = createInquiryHandler({ configured: () => true, send: async () => { calls++ }, now: () => time })
  for (let i = 0; i < 3; i++) expect((await handler(request())).status).toBe(200)
  const blocked = await handler(request())
  expect(blocked.status).toBe(429)
  expect(blocked.headers.get('retry-after')).toBe('600')
  expect(calls).toBe(3)
  time = 600_001
  expect((await handler(request())).status).toBe(200)
})

test('global throttle bounds attempts even with changing sender addresses', async () => {
  const handler = createInquiryHandler({ configured: () => true, send: async () => {} })
  for (let i = 0; i < 30; i++) expect((await handler(request({ ...inquiry, email: `patient${i}@example.com` }))).status).toBe(200)
  expect((await handler(request())).status).toBe(429)
})

test('SMTP adapter uses TLS, fixed clinic recipient, patient Reply-To, and requires acceptance', async () => {
  const previous = { SMTP_USER: process.env.SMTP_USER, SMTP_PASS: process.env.SMTP_PASS, INQUIRY_TO: process.env.INQUIRY_TO }
  process.env.SMTP_USER = 'clinic@example.com'
  process.env.SMTP_PASS = 'abcdefghijklmnop'
  process.env.INQUIRY_TO = 'doctor@example.com'
  let closed = 0
  let accepted = true
  let fail = false
  const transport = ((options: unknown) => {
    expect(options).toMatchObject({ host: 'smtp.gmail.com', port: 465, secure: true, logger: false, debug: false, tls: { rejectUnauthorized: true }, auth: { user: 'clinic@example.com', pass: 'abcdefghijklmnop' } })
    return {
      sendMail: async (mail: Record<string, unknown>) => {
        expect(mail).toMatchObject({ from: { address: 'clinic@example.com' }, to: { address: 'doctor@example.com' }, replyTo: { address: inquiry.email }, subject: 'New website enquiry', text: inquiryText(inquiry) })
        expect(mail.html).toBeUndefined()
        if (fail) throw new Error('simulated SMTP error')
        return { accepted: accepted ? ['doctor@example.com'] : [], rejected: accepted ? [] : ['doctor@example.com'] }
      },
      close: () => { closed++ },
    }
  }) as unknown as typeof nodemailer.createTransport
  try {
    await sendInquiry(inquiry, transport)
    accepted = false
    await expect(sendInquiry(inquiry, transport)).rejects.toThrow('Email was not accepted')
    fail = true
    await expect(sendInquiry(inquiry, transport)).rejects.toThrow('simulated SMTP error')
    expect(closed).toBe(3)
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  }
})
