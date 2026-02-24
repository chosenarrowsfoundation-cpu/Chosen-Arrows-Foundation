'use client'

import { useTranslation } from 'react-i18next'
import { HelpCircle } from 'lucide-react'

export function PaymentsHelp() {
  const { t } = useTranslation()

  return (
    <details className="rounded-lg border bg-muted/30 text-sm">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 font-medium [&::-webkit-details-marker]:hidden">
        <HelpCircle className="h-4 w-4 text-muted-foreground" />
        <span>{t('help.paymentsTitle', 'Payment methods setup')}</span>
      </summary>
      <div className="border-t px-4 py-3 text-muted-foreground space-y-3">
        <p>{t('help.paymentsIntro', 'Configure keys in the Payments tab above (or in .env.local). Dashboard values override env.')}</p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Card/Mobile:</strong> Set Flutterwave Public Key (donate page uses it for card + M-Pesa).</li>
          <li><strong>PayPal:</strong> Set Client ID and Client Secret; optional API Base (default: sandbox).</li>
          <li><strong>Stripe:</strong> Keys can be stored here; the donate page currently uses Flutterwave for card, not Stripe.</li>
          <li>{t('help.paymentsManual', 'Manual (bank/M-Pesa text): use the Site Settings → Manual Payment tab.')}</li>
        </ul>
        <p className="text-xs pt-1">
          Full steps: see <code className="bg-muted px-1 rounded">docs/PAYMENTS_SETUP.md</code> in the repo.
        </p>
      </div>
    </details>
  )
}
