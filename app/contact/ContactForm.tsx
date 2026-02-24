'use client'

import { useTransition } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2 } from 'lucide-react'
import { submitContactForm } from '@/app/actions/contact/submit-contact-form'
import { toast } from 'sonner'

export function ContactForm() {
  const { t } = useTranslation()
  const [isPending, startTransition] = useTransition()

  return (
    <Card>
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold mb-6">{t('contact.sendMessage')}</h2>
        <form
          className="space-y-6"
          action={(formData) => {
            startTransition(async () => {
              const result = await submitContactForm(formData)
              if (result.success) {
                toast.success(result.message)
                const form = document.getElementById('contact-form') as HTMLFormElement
                form?.reset()
              } else {
                toast.error('error' in result ? result.error : t('contact.somethingWentWrong'))
              }
            })
          }}
          id="contact-form"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">{t('contact.fullName')}</Label>
              <Input
                id="name"
                name="name"
                placeholder={t('contact.placeholderName')}
                className="mt-1"
                required
                disabled={isPending}
              />
            </div>
            <div>
              <Label htmlFor="email">{t('contact.email')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t('contact.placeholderEmail')}
                className="mt-1"
                required
                disabled={isPending}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="subject">{t('contact.subject')}</Label>
            <Input
              id="subject"
              name="subject"
              placeholder={t('contact.placeholderSubject')}
              className="mt-1"
              required
              disabled={isPending}
            />
          </div>

          <div>
            <Label htmlFor="message">{t('contact.message')}</Label>
            <Textarea
              id="message"
              name="message"
              placeholder={t('contact.placeholderMessage')}
              className="mt-1 min-h-40"
              required
              disabled={isPending}
            />
          </div>

          <Button
            type="submit"
            variant="gradient"
            className="w-full h-12 rounded-full"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Send className="w-5 h-5 mr-2" />
            )}
            {isPending ? t('contact.sending') : t('contact.send')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
