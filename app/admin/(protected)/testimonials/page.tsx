import { getTestimonials } from '@/app/actions/testimonials/get-testimonials'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus, MessageSquare, GripVertical } from 'lucide-react'
import TestimonialsList from '@/components/admin/TestimonialsList'

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials({ admin: true })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Testimonials</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage community testimonials and reviews
          </p>
        </div>
        <Link href="/admin/testimonials/new" className="shrink-0">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Testimonial
          </Button>
        </Link>
      </div>

      <TestimonialsList initialTestimonials={testimonials} />
    </div>
  )
}
