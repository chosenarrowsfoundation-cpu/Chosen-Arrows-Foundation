#!/usr/bin/env tsx
/**
 * Update the super admin's email using Supabase Admin API.
 * The dashboard doesn't allow editing the email field directly, so this script does it.
 *
 * Usage:
 *   npx tsx scripts/update-super-admin-email.ts <USER_ID> <NEW_EMAIL>
 *
 * Example:
 *   npx tsx scripts/update-super-admin-email.ts 123e4567-e89b-12d3-a456-426614174000 admin@newdomain.com
 *
 * To get your user ID: Supabase Dashboard → Table Editor → admin_users (copy the id column)
 * Or: Authentication → Users (copy the UUID)
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

async function main() {
  const userId = process.argv[2]
  const newEmail = process.argv[3]

  if (!userId || !newEmail) {
    console.error('Usage: npx tsx scripts/update-super-admin-email.ts <USER_ID> <NEW_EMAIL>')
    console.error('Example: npx tsx scripts/update-super-admin-email.ts 123e4567-e89b-12d3-a456-426614174000 admin@example.com')
    process.exit(1)
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  console.log(`Updating user ${userId} to email: ${newEmail}...`)

  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    email: newEmail,
  })

  if (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }

  console.log('Done. New email:', data.user?.email)
}

main()
