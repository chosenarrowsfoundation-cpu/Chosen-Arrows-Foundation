'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { submitMentorApplication } from '@/app/actions/mentorship/submit-application'

function SubmitButton() {
  const { pending } = useFormStatus()
  const { t } = useTranslation()

  return (
    <Button
      type="submit"
      variant="gradient"
      className="w-full h-12 rounded-full"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          {t('mentorship.submitting')}
        </>
      ) : (
        <>
          <CheckCircle className="w-5 h-5 mr-2" />
          {t('mentorship.submit')}
        </>
      )}
    </Button>
  )
}

export default function MentorshipForm() {
  const { t } = useTranslation()
  const [key, setKey] = useState(0)

  async function handleSubmit(formData: FormData) {
    const result = await submitMentorApplication(formData)

    if (result.success) {
      toast.success(result.message)
      setKey((k) => k + 1)
    } else {
      toast.error('error' in result ? result.error : 'Submission failed')
      if ('fieldErrors' in result && result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, messages]) => {
          messages.forEach((msg) => toast.error(`${field}: ${msg}`))
        })
      }
    }
  }

  return (
    <Card>
      <CardContent className="p-8 space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-bold">{t('mentorship.joinProgram')}</h2>
          <p className="text-muted-foreground">
            {t('mentorship.formSubtitle')}
          </p>
        </div>

        <form key={key} action={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">{t('mentorship.firstName')}</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder={t('contact.placeholderName').split(' ')[0]}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">{t('mentorship.lastName')}</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder={t('contact.placeholderName').split(' ').slice(-1)[0] || ''}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">{t('mentorship.emailAddress')}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t('contact.placeholderEmail')}
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">{t('mentorship.phoneNumber')}</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="occupation">{t('mentorship.occupation')}</Label>
            <Input
              id="occupation"
              name="occupation"
              placeholder={t('mentorship.occupationPlaceholder')}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="whyMentor">{t('mentorship.whyMentor')}</Label>
            <Textarea
              id="whyMentor"
              name="whyMentor"
              placeholder={t('mentorship.whyPlaceholder')}
              className="mt-1 min-h-32"
            />
          </div>

          <div>
            <Label htmlFor="skillsExpertise">{t('mentorship.skillsExpertise')}</Label>
            <Textarea
              id="skillsExpertise"
              name="skillsExpertise"
              placeholder={t('mentorship.skillsPlaceholder')}
              className="mt-1 min-h-24"
            />
          </div>

          <div>
            <Label htmlFor="availability">{t('mentorship.availability')}</Label>
            <Textarea
              id="availability"
              name="availability"
              placeholder={t('mentorship.availabilityPlaceholder')}
              className="mt-1 min-h-20"
            />
          </div>

          <SubmitButton />

          <p className="text-sm text-center text-muted-foreground">
            {t('mentorship.reviewMessage')}
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
