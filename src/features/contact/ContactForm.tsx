'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const fields = [
  { name: 'fullName', label: 'Full name', type: 'text', autoComplete: 'name', maxLength: 120 },
  { name: 'phone', label: 'Phone number', type: 'tel', autoComplete: 'tel', maxLength: 40 },
  { name: 'email', label: 'Email address', type: 'email', autoComplete: 'email', maxLength: 254 },
] as const

type Errors = Partial<Record<string, string>>

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [available, setAvailable] = useState(false)
  const [sending, setSending] = useState(false)
  const [feedback, setFeedback] = useState('')
  const busy = useRef(false)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/inquiries', { cache: 'no-store', signal: controller.signal })
      .then(async response => { if (response.ok) setAvailable((await response.json()).available === true) })
      .catch(() => { /* Keep phone and email alternatives when availability cannot be checked. */ })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (available && !sending && Object.keys(errors).length) {
      formRef.current?.querySelector<HTMLElement>('input[aria-invalid="true"], select[aria-invalid="true"], textarea[aria-invalid="true"]')?.focus()
    }
  }, [available, errors, sending])

  async function submitInquiry() {
    const form = formRef.current
    if (!form || busy.current || !available) return
    const nextErrors: Errors = {}
    const controls = Array.from(form.elements).filter((element): element is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement =>
      element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement,
    )
    for (const control of controls) {
      if (!control.validity.valid || (control.required && control.type !== 'checkbox' && !control.value.trim())) {
        if (control.validity.typeMismatch) {
          nextErrors[control.name] = 'Enter a valid email address.'
        } else if (control.name === 'consent') {
          nextErrors[control.name] = 'Please agree to the privacy policy and terms of service.'
        } else {
          nextErrors[control.name] = 'Please complete this field.'
        }
      }
    }
    setErrors(nextErrors)
    controls.find(control => nextErrors[control.name])?.focus()
    if (Object.keys(nextErrors).length) {
      setFeedback('Please review the marked fields. No details have been sent.')
      return
    }
    const data = Object.fromEntries(new FormData(form))
    busy.current = true
    setSending(true)
    setFeedback('Sending your enquiry…')
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, consent: data.consent === 'on' }),
        signal: AbortSignal.timeout(65_000),
      })
      const result = await response.json()
      if (!response.ok || result.status !== 'sent') {
        if (result.errors) {
          setErrors(result.errors)
        }
        if (response.status === 503) setAvailable(false)
        setFeedback(result.error || 'We could not confirm your enquiry was sent. Please call or email us before submitting again.')
        return
      }
      form.reset()
      setErrors({})
      setFeedback('Your enquiry has been sent. Our team will contact you. This does not confirm an appointment.')
    } catch {
      setFeedback('We could not confirm your enquiry was sent. Your details are still here. Please call or email us before submitting again.')
    } finally {
      busy.current = false
      setSending(false)
    }
  }

  function errorFor(name: string) {
    return errors[name] ? <p className='contact-field-error' id={`contact-${name}-error`}>{errors[name]}</p> : null
  }

  function accessibilityFor(name: string) {
    return {
      'aria-invalid': Boolean(errors[name]),
      'aria-describedby': errors[name] ? `contact-${name}-error` : undefined,
    }
  }

  return (
    <form
      id='contact-form'
      tabIndex={-1}
      ref={formRef}
      className='contact-form'
      aria-label='Contact enquiry'
      aria-describedby='contact-form-notice'
      noValidate
      onSubmit={event => { event.preventDefault(); void submitInquiry() }}
      onChange={() => { if (!busy.current) setFeedback('') }}
    >
      <div className='contact-form-heading'>
        <h3>Your enquiry</h3>
        <span>* Required fields</span>
      </div>
      <p id='contact-form-notice' className='contact-form-notice'>
        {available
          ? 'Send an enquiry and our team will contact you. For urgent dental care, please call the clinic. Please do not include detailed medical records.'
          : 'Online submission is currently unavailable. Please call or email us to get in touch.'}
      </p>
      <fieldset className='contact-form-controls' disabled={!available || sending}>
        <div className='contact-honeypot' aria-hidden='true'>
          <label htmlFor='contact-website'>Leave this field empty</label>
          <input id='contact-website' name='website' type='text' tabIndex={-1} autoComplete='off' />
        </div>
        <div className='contact-fields'>
          {fields.map(field => (
            <div className={field.name === 'fullName' ? 'contact-field contact-field--wide' : 'contact-field'} key={field.name}>
              <label htmlFor={`contact-${field.name}`}>{field.label} <span aria-hidden='true'>*</span></label>
              <input
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                maxLength={field.maxLength}
                id={`contact-${field.name}`}
                required
                {...accessibilityFor(field.name)}
              />
              {errorFor(field.name)}
            </div>
          ))}
          <fieldset className='contact-field contact-field--wide' {...accessibilityFor('treatment')}>
            <legend>What treatment are you looking for? <span aria-hidden='true'>*</span></legend>
            <div className='contact-choices'>
              {['Check Up/Cleaning', 'Emergency'].map(treatment => (
                <label key={treatment}>
                  <input type='radio' name='treatment' value={treatment} required {...accessibilityFor('treatment')} />
                  {treatment}
                </label>
              ))}
            </div>
            {errorFor('treatment')}
          </fieldset>
          <div className='contact-field'>
            <label htmlFor='contact-newPatient'>New patient? <span aria-hidden='true'>*</span></label>
            <select id='contact-newPatient' name='newPatient' required defaultValue='' {...accessibilityFor('newPatient')}>
              <option value='' disabled>Select an option</option>
              <option value='yes'>Yes</option>
              <option value='no'>No</option>
            </select>
            {errorFor('newPatient')}
          </div>
          <div className='contact-field'>
            <label htmlFor='contact-preferredTime'>Best time/day? <span aria-hidden='true'>*</span></label>
            <input id='contact-preferredTime' name='preferredTime' type='text' maxLength={200} required {...accessibilityFor('preferredTime')} />
            {errorFor('preferredTime')}
          </div>
          <div className='contact-field contact-field--wide'>
            <label htmlFor='contact-message'>How can we help? <span className='contact-optional'>(optional)</span></label>
            <textarea id='contact-message' name='message' rows={4} maxLength={2000} />
          </div>
        </div>
        <div className='contact-consent'>
          <input id='contact-consent' name='consent' type='checkbox' required {...accessibilityFor('consent')} />
          <label htmlFor='contact-consent'>
            I agree with the <Link href='/privacy-policy'>privacy policy</Link> and{' '}
            <Link href='/terms-of-service'>terms of service</Link>. <span aria-hidden='true'>*</span>
          </label>
        </div>
        {errorFor('consent')}
        <div className='contact-form-bottom'>
          {/* Disabled until hydration and server configuration check, preventing native data submission. */}
          <button type='submit' className='button button--primary' disabled={!available || sending}>{sending ? 'Sending…' : 'Send enquiry'}</button>
          <span>An enquiry does not confirm an appointment.</span>
        </div>
      </fieldset>
      <p className='contact-form-feedback' role='status' aria-live='polite' aria-atomic='true'>
        {feedback}
      </p>
      <noscript>
        <p>Sending an enquiry requires JavaScript. Please use the phone or email links to contact us.</p>
      </noscript>
    </form>
  )
}
