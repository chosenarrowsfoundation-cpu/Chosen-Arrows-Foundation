'use client'

import { useTransition } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2 } from 'lucide-react'
import { submitContactForm } from '@/app/actions/contact/submit-contact-form'
import { toast } from 'sonner'

export function ContactForm() {
  const [isPending, startTransition] = useTransition()

  return (
    <Card>
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
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
                toast.error('error' in result ? result.error : 'Something went wrong.')
              }
            })
          }}
          id="contact-form"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                className="mt-1"
                required
                disabled={isPending}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                className="mt-1"
                required
                disabled={isPending}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="How can we help you?"
              className="mt-1"
              required
              disabled={isPending}
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us more about your inquiry..."
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
            {isPending ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
