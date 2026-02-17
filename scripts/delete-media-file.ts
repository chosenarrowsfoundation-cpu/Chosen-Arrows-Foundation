#!/usr/bin/env tsx
/**
 * Delete a media file from Supabase storage.
 * Usage: npx tsx scripts/delete-media-file.ts <path>
 * Example: npx tsx scripts/delete-media-file.ts campaigns/2d50e032-e07b-4774-825d-e05e155d4b6e
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const path = process.argv[2] || 'campaigns/2d50e032-e07b-4774-825d-e05e155d4b6e'

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function main() {
  // If path looks like "campaigns/uuid" try to find exact filename (might have extension)
  const parts = path.split('/')
  const folder = parts.slice(0, -1).join('/') || 'campaigns'
  const namePart = parts[parts.length - 1]

  const { data: files } = await supabase.storage.from('images').list(folder)
  const match = files?.find(f => f.name === namePart || f.name.startsWith(namePart))
  const toDelete = match ? `${folder}/${match.name}` : path

  const { error } = await supabase.storage.from('images').remove([toDelete])
  if (error) {
    console.error('Delete failed:', error.message)
    process.exit(1)
  }
  console.log('Deleted:', toDelete)
}

main()
