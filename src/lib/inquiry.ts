import { createHash } from 'node:crypto'

export type Inquiry = {
  fullName: string
  phone: string
  email: string
  treatment: string
  newPatient: string
  preferredTime: string
  message: string
  consent: true
}

export const isEmail = (value: string) => value.length <= 254 && /^[^\s@<>,;\r\n]+@[^\s@<>,;\r\n]+\.[^\s@<>,;\r\n]+$/.test(value)

export function validateInquiry(value: unknown): { inquiry?: Inquiry; errors: Record<string, string> } {
  const errors: Record<string, string> = {}
  const input = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
  const text = (name: string, max: number, required = true) => {
    const raw = input[name]
    const result = typeof raw === 'string' ? raw.trim() : ''
    if ((required && !result) || (raw !== undefined && typeof raw !== 'string') || result.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(result)) {
      errors[name] = `Enter ${required ? 'a value' : 'text'} of ${max} characters or fewer.`
    }
    return result
  }
  const inquiry: Inquiry = {
    fullName: text('fullName', 120), phone: text('phone', 40), email: text('email', 254),
    treatment: text('treatment', 40), newPatient: text('newPatient', 3),
    preferredTime: text('preferredTime', 200), message: text('message', 2000, false), consent: true,
  }
  if (!isEmail(inquiry.email)) errors.email = 'Enter a valid email address.'
  if (!/^[+\d\s().-]+$/.test(inquiry.phone) || inquiry.phone.replace(/\D/g, '').length < 7) errors.phone = 'Enter a valid phone number.'
  if (!['Check Up/Cleaning', 'Emergency'].includes(inquiry.treatment)) errors.treatment = 'Choose a treatment.'
  if (!['yes', 'no'].includes(inquiry.newPatient)) errors.newPatient = 'Choose an option.'
  if (input.consent !== true) errors.consent = 'Please agree to the privacy policy and terms of service.'
  return Object.keys(errors).length ? { errors } : { inquiry, errors }
}

export function inquiryText(inquiry: Inquiry) {
  return [
    'New website enquiry', '',
    `Full name: ${inquiry.fullName}`, `Phone: ${inquiry.phone}`, `Email: ${inquiry.email}`,
    `Treatment: ${inquiry.treatment}`, `New patient: ${inquiry.newPatient === 'yes' ? 'Yes' : 'No'}`,
    `Preferred time/day: ${inquiry.preferredTime}`, '', 'Message:', inquiry.message || '(No message)', '',
    'Privacy policy and terms accepted: Yes',
    'This is an enquiry, not a confirmed appointment.',
  ].join('\n')
}

const headers = { 'Cache-Control': 'private, no-store, max-age=0', 'X-Content-Type-Options': 'nosniff' }
const reply = (status: number, body: object, extra: Record<string, string> = {}) => Response.json(body, { status, headers: { ...headers, ...extra } })

// Per-process safeguards, not a distributed firewall. No patient content or raw IPs are retained.
export function createInquiryHandler(options: {
  configured: () => boolean
  send: (inquiry: Inquiry) => Promise<void>
  now?: () => number
}) {
  const now = options.now ?? Date.now
  const windowMs = 10 * 60 * 1000
  let windowStart = now()
  let total = 0
  const senders = new Map<string, number>()

  return async (request: Request) => {
    if (request.method === 'GET') return reply(200, { available: options.configured() })
    // Browsers must post JSON from this site; this also prevents pre-hydration GET submissions.
    if (request.headers.get('origin') !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site') {
      return reply(403, { error: 'Please submit this form from our website.' })
    }
    if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') return reply(415, { error: 'Unsupported request.' })
    let input: unknown
    try {
      const reader = request.body?.getReader()
      if (!reader) return reply(400, { error: 'Invalid request.' })
      let bytes = 0
      const chunks: Uint8Array[] = []
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        bytes += value.byteLength
        if (bytes > 16_384) {
          await reader.cancel()
          return reply(413, { error: 'Your enquiry is too long.' })
        }
        chunks.push(value)
      }
      input = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    } catch {
      return reply(400, { error: 'Invalid request.' })
    }
    if (input && typeof input === 'object' && 'website' in input && input.website) {
      return reply(400, { error: 'Unable to submit this enquiry. Please call or email us.' })
    }
    const { inquiry, errors } = validateInquiry(input)
    if (!inquiry) return reply(400, { error: 'Please review the marked fields.', errors })
    if (!options.configured()) return reply(503, { error: 'Online enquiries are currently unavailable. Please call or email us.' })
    if (now() - windowStart >= windowMs) {
      windowStart = now()
      total = 0
      senders.clear()
    }
    const sender = createHash('sha256').update(inquiry.email.toLowerCase()).digest('hex')
    const count = senders.get(sender) ?? 0
    if (total >= 30 || count >= 3) return reply(429, { error: 'Too many enquiries. Please try again later or call us.' }, { 'Retry-After': String(Math.ceil((windowStart + windowMs - now()) / 1000)) })
    total++
    senders.set(sender, count + 1)
    try {
      await options.send(inquiry)
      return reply(200, { status: 'sent' })
    } catch {
      // Never return or log SMTP errors: they may contain credentials or patient information.
      // No automatic retries: SMTP failure after acceptance can have an uncertain delivery outcome.
      return reply(502, { error: 'We could not confirm your enquiry was sent. Your details are still here. Please call or email us before submitting again.' })
    }
  }
}
