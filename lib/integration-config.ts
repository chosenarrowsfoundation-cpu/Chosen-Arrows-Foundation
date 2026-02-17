/**
 * Server-only: reads API keys and integration config from DB (integration_config table)
 * with fallback to process.env. Use only in Server Actions, API routes, and server code.
 * Never import this from client components.
 */

import { createServiceRoleClient } from '@/lib/supabase/server'
import { INTEGRATION_KEYS } from './integration-config-keys'

export { INTEGRATION_KEYS }

export const SECRET_KEYS = new Set<string>([
  INTEGRATION_KEYS.paypal_client_secret,
  INTEGRATION_KEYS.stripe_secret_key,
  INTEGRATION_KEYS.stripe_webhook_secret,
  INTEGRATION_KEYS.google_places_api_key,
  INTEGRATION_KEYS.resend_api_key,
])

const ENV_MAP: Record<string, string> = {
  [INTEGRATION_KEYS.paypal_client_id]: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
  [INTEGRATION_KEYS.paypal_client_secret]: process.env.PAYPAL_CLIENT_SECRET ?? '',
  [INTEGRATION_KEYS.paypal_api_base]: process.env.PAYPAL_API_BASE ?? 'https://api-m.sandbox.paypal.com',
  [INTEGRATION_KEYS.flutterwave_public_key]: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY ?? '',
  [INTEGRATION_KEYS.stripe_publishable_key]: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
  [INTEGRATION_KEYS.stripe_secret_key]: process.env.STRIPE_SECRET_KEY ?? '',
  [INTEGRATION_KEYS.stripe_webhook_secret]: process.env.STRIPE_WEBHOOK_SECRET ?? '',
  [INTEGRATION_KEYS.google_places_api_key]: process.env.GOOGLE_PLACES_API_KEY ?? '',
  [INTEGRATION_KEYS.resend_api_key]: process.env.RESEND_API_KEY ?? '',
  [INTEGRATION_KEYS.resend_from_domain]: process.env.RESEND_FROM_DOMAIN ?? 'onboarding@resend.dev',
  [INTEGRATION_KEYS.resend_from_name]: process.env.RESEND_FROM_NAME ?? 'Chosen Arrows Foundation',
  [INTEGRATION_KEYS.mentor_notification_email]: process.env.MENTOR_NOTIFICATION_EMAIL ?? process.env.NOTIFICATION_EMAIL ?? '',
  [INTEGRATION_KEYS.contact_form_email]: process.env.CONTACT_FORM_EMAIL ?? process.env.MENTOR_NOTIFICATION_EMAIL ?? process.env.NOTIFICATION_EMAIL ?? '',
}

const MASK = '••••••••'

export type IntegrationConfigMap = Record<string, string>

/**
 * Returns config values for server-side use (unmasked).
 * Prefers integration_config table; falls back to env.
 */
export async function getIntegrationConfigServer(): Promise<IntegrationConfigMap> {
  const out: IntegrationConfigMap = { ...ENV_MAP }

  try {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from('integration_config')
      .select('key, value')

    if (error) {
      return out
    }

    if (data) {
      for (const row of data) {
        const key = row.key as string
        const value = (row.value as string)?.trim() ?? ''
        if (value) out[key] = value
      }
    }
  } catch {
    // no-op: use env only
  }

  return out
}

/**
 * Returns config for admin UI with secret values masked.
 */
export async function getIntegrationConfigForAdmin(): Promise<IntegrationConfigMap> {
  const raw = await getIntegrationConfigServer()
  const masked: IntegrationConfigMap = {}

  for (const [key, value] of Object.entries(raw)) {
    if (SECRET_KEYS.has(key) && value.length > 0) {
      masked[key] = MASK
    } else {
      masked[key] = value
    }
  }

  return masked
}

/**
 * Get a single value (server-side). Prefers DB, then env.
 */
export async function getIntegrationValue(key: string): Promise<string> {
  const config = await getIntegrationConfigServer()
  return config[key] ?? ENV_MAP[key] ?? ''
}
