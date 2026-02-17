'use server'

import { z } from 'zod'
import { getIntegrationConfigServer } from '@/lib/integration-config'
import { INTEGRATION_KEYS } from '@/lib/integration-config-keys'

const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Please enter a valid email address').max(255),
  subject: z.string().min(1, 'Subject is required').max(255),
  message: z.string().min(1, 'Message is required').max(10000),
})

export type ContactFormResult =
  | { success: true; message: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

export async function submitContactForm(formData: FormData): Promise<ContactFormResult> {
  const raw = {
    name: (formData.get('name') as string)?.trim() ?? '',
    email: (formData.get('email') as string)?.trim() ?? '',
    subject: (formData.get('subject') as string)?.trim() ?? '',
    message: (formData.get('message') as string)?.trim() ?? '',
  }

  const parsed = contactFormSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {}
    parsed.error.errors.forEach((err) => {
      const path = err.path[0] as string
      if (!fieldErrors[path]) fieldErrors[path] = []
      fieldErrors[path].push(err.message)
    })
    return { success: false, error: 'Please correct the errors below.', fieldErrors }
  }

  const config = await getIntegrationConfigServer()
  const apiKey =
    (config[INTEGRATION_KEYS.resend_api_key] ?? '').trim() || process.env.RESEND_API_KEY || ''
  let toEmail =
    (config[INTEGRATION_KEYS.contact_form_email] ?? '').trim() ||
    process.env.CONTACT_FORM_EMAIL ||
    process.env.MENTOR_NOTIFICATION_EMAIL ||
    process.env.NOTIFICATION_EMAIL ||
    ''

  if (!apiKey || !toEmail) {
    return {
      success: false,
      error:
        'Contact form is not configured. Please set Resend API key and contact form recipient email in Admin → Settings → API & Integrations.',
    }
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)
    const fromDomain =
      (config[INTEGRATION_KEYS.resend_from_domain] ?? '').trim() ||
      process.env.RESEND_FROM_DOMAIN ||
      'onboarding@resend.dev'
    const fromName =
      (config[INTEGRATION_KEYS.resend_from_name] ?? '').trim() ||
      process.env.RESEND_FROM_NAME ||
      'Chosen Arrows Foundation'

    const html = `
      <h2>Contact form submission</h2>
      <table style="border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(parsed.data.name)}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(parsed.data.email)}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Subject</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(parsed.data.subject)}</td></tr>
      </table>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${escapeHtml(parsed.data.message)}</p>
    `

    await resend.emails.send({
      from: `${fromName} <${fromDomain}>`,
      to: toEmail,
      replyTo: parsed.data.email,
      subject: `[Contact] ${parsed.data.subject}`,
      html,
    })
  } catch (err) {
    console.error('Contact form email error:', err)
    return { success: false, error: 'Failed to send your message. Please try again later.' }
  }

  return {
    success: true,
    message: "Thanks for reaching out. We'll get back to you soon.",
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
