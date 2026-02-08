/**
 * Key names for integration_config table. Safe to import from client (no server deps).
 */

export const INTEGRATION_KEYS = {
  paypal_client_id: 'paypal_client_id',
  paypal_client_secret: 'paypal_client_secret',
  paypal_api_base: 'paypal_api_base',
  flutterwave_public_key: 'flutterwave_public_key',
  stripe_publishable_key: 'stripe_publishable_key',
  stripe_secret_key: 'stripe_secret_key',
  stripe_webhook_secret: 'stripe_webhook_secret',
  google_places_api_key: 'google_places_api_key',
  resend_api_key: 'resend_api_key',
  resend_from_domain: 'resend_from_domain',
  resend_from_name: 'resend_from_name',
  mentor_notification_email: 'mentor_notification_email',
} as const
