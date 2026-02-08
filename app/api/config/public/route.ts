import { NextResponse } from 'next/server'
import { getIntegrationConfigServer } from '@/lib/integration-config'
import { INTEGRATION_KEYS } from '@/lib/integration-config'

/**
 * Returns only public keys needed by the client (donate page, etc.).
 * No secrets are ever returned. Safe to call unauthenticated.
 */
export async function GET() {
  try {
    const config = await getIntegrationConfigServer()
    const body = {
      paypalClientId: (config[INTEGRATION_KEYS.paypal_client_id] ?? '').trim() || null,
      paypalApiBase: (config[INTEGRATION_KEYS.paypal_api_base] ?? '').trim() || 'https://api-m.sandbox.paypal.com',
      flutterwavePublicKey: (config[INTEGRATION_KEYS.flutterwave_public_key] ?? '').trim() || null,
      stripePublishableKey: (config[INTEGRATION_KEYS.stripe_publishable_key] ?? '').trim() || null,
    }
    return NextResponse.json(body)
  } catch {
    return NextResponse.json(
      {
        paypalClientId: null,
        paypalApiBase: 'https://api-m.sandbox.paypal.com',
        flutterwavePublicKey: null,
        stripePublishableKey: null,
      },
      { status: 200 }
    )
  }
}
