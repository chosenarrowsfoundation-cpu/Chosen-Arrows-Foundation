'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'

export type MentorApplication = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  occupation: string | null
  why_mentor: string | null
  skills_expertise: string | null
  availability: string | null
  status: string
  created_at: string
  updated_at: string
}

export async function getMentorApplications(): Promise<{
  applications: MentorApplication[]
  error?: string
}> {
  try {
    const supabase = createServiceRoleClient()

    const { data, error } = await supabase
      .from('mentor_applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      const errMsg = error.message || JSON.stringify(error)
      console.error('Error fetching mentor applications:', errMsg, error.code)
      return {
        applications: [],
        error: error.code === '42P01'
          ? 'Mentor applications table not found. Run the database migration: supabase/migrations/003_mentor_applications.sql'
          : error.message || 'Failed to fetch applications',
      }
    }

    return { applications: (data || []) as MentorApplication[] }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch applications'
    console.error('Mentor applications fetch error:', message)
    return { applications: [], error: message }
  }
}
