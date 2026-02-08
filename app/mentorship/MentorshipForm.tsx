'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
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
          Submitting...
        </>
      ) : (
        <>
          <CheckCircle className="w-5 h-5 mr-2" />
          Submit Application
        </>
      )}
    </Button>
  )
}

export default function MentorshipForm() {
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
          <h2 className="text-3xl font-bold">Join Our Mentor Program</h2>
          <p className="text-muted-foreground">
            Fill out the form below to begin your mentorship journey
          </p>
        </div>

        <form key={key} action={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                className="mt-1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              name="occupation"
              placeholder="Your profession"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="whyMentor">Why do you want to be a mentor?</Label>
            <Textarea
              id="whyMentor"
              name="whyMentor"
              placeholder="Share your motivation and what you hope to bring to the mentorship..."
              className="mt-1 min-h-32"
            />
          </div>

          <div>
            <Label htmlFor="skillsExpertise">Skills & Areas of Expertise</Label>
            <Textarea
              id="skillsExpertise"
              name="skillsExpertise"
              placeholder="What skills, knowledge, or life experiences can you share?"
              className="mt-1 min-h-24"
            />
          </div>

          <div>
            <Label htmlFor="availability">Availability</Label>
            <Textarea
              id="availability"
              name="availability"
              placeholder="What days/times work best for you?"
              className="mt-1 min-h-20"
            />
          </div>

          <SubmitButton />

          <p className="text-sm text-center text-muted-foreground">
            We&apos;ll review your application and get back to you within 5 business days
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
