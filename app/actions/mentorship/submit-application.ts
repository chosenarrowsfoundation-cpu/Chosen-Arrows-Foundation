'use server'

import { z } from 'zod'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { getSetting } from '@/app/actions/settings/get-settings'
import { getIntegrationConfigServer } from '@/lib/integration-config'
import { INTEGRATION_KEYS } from '@/lib/integration-config-keys'

const mentorApplicationSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(255),
  lastName: z.string().min(1, 'Last name is required').max(255),
  email: z.string().email('Please enter a valid email address').max(255),
  phone: z.string().max(100).optional(),
  occupation: z.string().max(255).optional(),
  whyMentor: z.string().max(2000).optional(),
  skillsExpertise: z.string().max(2000).optional(),
  availability: z.string().max(1000).optional(),
})

export type MentorApplicationResult =
  | { success: true; message: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

export async function submitMentorApplication(
  formData: FormData
): Promise<MentorApplicationResult> {
  try {
    const rawData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: (formData.get('phone') as string) || undefined,
      occupation: (formData.get('occupation') as string) || undefined,
      whyMentor: (formData.get('whyMentor') as string) || undefined,
      skillsExpertise: (formData.get('skillsExpertise') as string) || undefined,
      availability: (formData.get('availability') as string) || undefined,
    }

    const validation = mentorApplicationSchema.safeParse(rawData)

    if (!validation.success) {
      const fieldErrors: Record<string, string[]> = {}
      validation.error.errors.forEach((err) => {
        const field = err.path[0] as string
        if (!fieldErrors[field]) fieldErrors[field] = []
        fieldErrors[field].push(err.message)
      })
      return {
        success: false,
        error: 'Please correct the errors in the form',
        fieldErrors,
      }
    }

    const data = validation.data

    const supabase = createServiceRoleClient()

    const { data: application, error: insertError } = await supabase
      .from('mentor_applications')
      .insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone ?? null,
        occupation: data.occupation ?? null,
        why_mentor: data.whyMentor ?? null,
        skills_expertise: data.skillsExpertise ?? null,
        availability: data.availability ?? null,
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('Mentor application insert error:', insertError)
      return { success: false, error: 'Failed to submit application. Please try again.' }
    }

    // Send email notification (optional - requires RESEND_API_KEY)
    await sendMentorNotificationEmail(data, application?.id)

    return {
      success: true,
      message: "We've received your application. We'll review it and get back to you within 5 business days.",
    }
  } catch (error) {
    console.error('Mentor application error:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

async function sendMentorNotificationEmail(
  data: z.infer<typeof mentorApplicationSchema>,
  applicationId?: string
) {
  const config = await getIntegrationConfigServer()
  const apiKey =
    (config[INTEGRATION_KEYS.resend_api_key] ?? '').trim() ||
    process.env.RESEND_API_KEY ||
    ''
  let notificationEmail =
    (config[INTEGRATION_KEYS.mentor_notification_email] ?? '').trim() ||
    process.env.MENTOR_NOTIFICATION_EMAIL ||
    process.env.NOTIFICATION_EMAIL ||
    ''

  if (!notificationEmail) {
    const contactInfo = (await getSetting('contact_info')) as { emails?: string[] } | null
    notificationEmail = contactInfo?.emails?.[0] ?? ''
  }

  if (!apiKey || !notificationEmail) {
    if (!apiKey) {
      console.warn(
        'Resend API key not set — configure in Settings → API & Integrations or set RESEND_API_KEY'
      )
    }
    return
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
      <h2>New Mentor Application</h2>
      <p>A new mentor application has been submitted.</p>
      <table style="border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.firstName} ${data.lastName}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.email}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.phone || '—'}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Occupation</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.occupation || '—'}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Why mentor?</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${(data.whyMentor || '—').replace(/\n/g, '<br>')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Skills & Expertise</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${(data.skillsExpertise || '—').replace(/\n/g, '<br>')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Availability</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${(data.availability || '—').replace(/\n/g, '<br>')}</td></tr>
      </table>
      ${applicationId ? `<p><em>Application ID: ${applicationId}</em></p>` : ''}
    `

    await resend.emails.send({
      from: `${fromName} <${fromDomain}>`,
      to: notificationEmail,
      subject: `New Mentor Application: ${data.firstName} ${data.lastName}`,
      html,
    })
  } catch (err) {
    console.error('Failed to send mentor notification email:', err)
    // Don't fail the whole submission - data is already saved
  }
}
