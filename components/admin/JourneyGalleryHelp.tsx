'use client'

import { useTranslation } from 'react-i18next'
import { HelpCircle } from 'lucide-react'

export function JourneyGalleryHelp() {
  const { t } = useTranslation()

  return (
    <details className="rounded-lg border bg-muted/30 text-sm">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 font-medium [&::-webkit-details-marker]:hidden">
        <HelpCircle className="h-4 w-4 text-muted-foreground" />
        <span>{t('help.journeyGalleryTitle')}</span>
      </summary>
      <div className="border-t px-4 py-3 text-muted-foreground space-y-2">
        <p>{t('help.journeyGalleryIntro')}</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>{t('help.journeyStep1')}</li>
          <li>{t('help.journeyStep2')}</li>
          <li>{t('help.journeyStep3')}</li>
        </ol>
      </div>
    </details>
  )
}
