/**
 * PayPal server-side client for donation payments.
 * Uses Orders v2 API: create order → buyer approves → capture.
 * Config from dashboard (integration_config) or env.
 */

import { getIntegrationConfigServer } from '@/lib/integration-config'
import { INTEGRATION_KEYS } from '@/lib/integration-config-keys'

type PayPalConfig = {
  clientId: string
  clientSecret: string
  apiBase: string
}

async function getPayPalConfig(): Promise<PayPalConfig> {
  const config = await getIntegrationConfigServer()
  const clientId = (config[INTEGRATION_KEYS.paypal_client_id] ?? '').trim()
  const clientSecret = (config[INTEGRATION_KEYS.paypal_client_secret] ?? '').trim()
  const apiBase = (config[INTEGRATION_KEYS.paypal_api_base] ?? '').trim() || 'https://api-m.sandbox.paypal.com'
  return { clientId, clientSecret, apiBase }
}

function isPayPalConfigured(config: PayPalConfig): boolean {
  return !!(
    config.clientId &&
    config.clientSecret &&
    config.clientSecret !== 'your_paypal_client_secret'
  )
}

async function getAccessToken(cfg: PayPalConfig): Promise<string> {
  const auth = Buffer.from(
    `${cfg.clientId}:${cfg.clientSecret}`,
    'utf8'
  ).toString('base64')

  const res = await fetch(`${cfg.apiBase}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PayPal auth failed: ${res.status} ${text}`)
  }

  const data = (await res.json()) as { access_token: string }
  return data.access_token
}

export async function isPayPalConfiguredAsync(): Promise<boolean> {
  const cfg = await getPayPalConfig()
  return isPayPalConfigured(cfg)
}

export type CreateOrderParams = {
  amount: number
  frequency: 'once' | 'monthly'
  donorName: string
  donorEmail: string
}

export async function createPayPalOrder(
  params: CreateOrderParams
): Promise<{ orderId: string }> {
  const cfg = await getPayPalConfig()
  if (!isPayPalConfigured(cfg)) {
    throw new Error(
      'PayPal is not configured. Set Client ID and Client Secret in Settings → API & Integrations (or env).'
    )
  }

  const { amount, frequency, donorName, donorEmail } = params
  const value = amount.toFixed(2)
  const description =
    frequency === 'monthly'
      ? 'Monthly donation to Chosen Arrows Foundation'
      : 'One-time donation to Chosen Arrows Foundation'

  const token = await getAccessToken(cfg)

  const body = {
    intent: 'CAPTURE' as const,
    purchase_units: [
      {
        amount: { currency_code: 'USD', value },
        description,
        custom_id: JSON.stringify({
          donorName,
          donorEmail,
          frequency,
        }),
      },
    ],
    application_context: {
      brand_name: 'Chosen Arrows Foundation',
      landing_page: 'NO_PREFERENCE' as const,
      user_action: 'PAY_NOW' as const,
    },
  }

  const res = await fetch(`${cfg.apiBase}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      `PayPal create order failed: ${res.status} ${JSON.stringify(err)}`
    )
  }

  const data = (await res.json()) as { id: string }
  return { orderId: data.id }
}

export type CaptureResult = {
  orderId: string
  captureId: string
  status: string
  amount: string
  payerEmail?: string
}

export async function capturePayPalOrder(orderId: string): Promise<CaptureResult> {
  const cfg = await getPayPalConfig()
  if (!isPayPalConfigured(cfg)) {
    throw new Error('PayPal is not configured.')
  }

  const token = await getAccessToken(cfg)

  const res = await fetch(
    `${cfg.apiBase}/v2/checkout/orders/${orderId}/capture`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: '{}',
    }
  )

  interface CaptureResp {
    id: string
    amount?: { value: string }
  }
  interface PurchaseUnitResp {
    payments?: { captures?: CaptureResp[] }
    payee?: { email_address?: string }
  }
  const data = (await res.json()) as {
    id: string
    status: string
    purchase_units?: PurchaseUnitResp[]
  }

  if (!res.ok) {
    throw new Error(
      `PayPal capture failed: ${res.status} ${JSON.stringify(data)}`
    )
  }

  const capture = data.purchase_units?.[0]?.payments?.captures?.[0]
  return {
    orderId: data.id,
    captureId: capture?.id ?? '',
    status: data.status,
    amount: capture?.amount?.value ?? '0',
    payerEmail: data.purchase_units?.[0]?.payee?.email_address,
  }
}
