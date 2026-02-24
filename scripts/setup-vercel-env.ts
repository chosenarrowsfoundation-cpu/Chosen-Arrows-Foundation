#!/usr/bin/env tsx
/**
 * Setup Vercel environment variables for the project
 * Run with: npm run setup-vercel-env
 */

import { execSync } from 'child_process'
import * as readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function setupVercelEnv() {
  console.log('🚀 Setting up Vercel environment variables...\n')

  try {
    // Check if Vercel CLI is available
    execSync('vercel --version', { stdio: 'pipe' })
    console.log('✅ Vercel CLI is available\n')
  } catch (error) {
    console.error('❌ Vercel CLI is not installed. Please install it first:')
    console.error('   npm install -g vercel')
    process.exit(1)
  }

  // Check if project is linked
  try {
    execSync('vercel link --yes', { stdio: 'pipe' })
    console.log('✅ Project linked to Vercel\n')
  } catch (error) {
    console.log('⚠️  Project may already be linked or there was an issue\n')
  }

  console.log('📝 Please provide your Supabase credentials:')
  console.log('   You can find these at: https://app.supabase.com/project/_/settings/api\n')

  const supabaseUrl = await question('NEXT_PUBLIC_SUPABASE_URL (project URL): ')
  const supabaseAnonKey = await question('NEXT_PUBLIC_SUPABASE_ANON_KEY (anon/public key): ')
  const supabaseServiceKey = await question('SUPABASE_SERVICE_ROLE_KEY (service_role key): ')
  const siteUrl = await question('NEXT_PUBLIC_SITE_URL (your Vercel domain, default: https://chosen-arrows-foundation-six.vercel.app): ')

  const finalSiteUrl = siteUrl || 'https://chosen-arrows-foundation-six.vercel.app'

  console.log('\n🔧 Adding environment variables to Vercel...\n')

  const envVars = [
    { name: 'NEXT_PUBLIC_SUPABASE_URL', value: supabaseUrl.trim(), envs: ['production', 'preview', 'development'] },
    { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: supabaseAnonKey.trim(), envs: ['production', 'preview', 'development'] },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', value: supabaseServiceKey.trim(), envs: ['production', 'preview', 'development'] },
    { name: 'NEXT_PUBLIC_SITE_URL', value: finalSiteUrl.trim(), envs: ['production', 'preview', 'development'] }
  ]

  for (const envVar of envVars) {
    for (const env of envVar.envs) {
      try {
        console.log(`Adding ${envVar.name} to ${env}...`)
        execSync(`vercel env add ${envVar.name} ${env}`, {
          input: envVar.value,
          stdio: 'pipe'
        })
        console.log(`✅ Added ${envVar.name} to ${env}`)
      } catch (error) {
        console.error(`❌ Failed to add ${envVar.name} to ${env}:`, error.message)
      }
    }
  }

  console.log('\n🎉 Environment variables have been added to Vercel!')
  console.log('   The next deployment will use these variables.')
  console.log('\n📋 Next steps:')
  console.log('   1. Push your changes: git push')
  console.log('   2. Vercel will automatically redeploy with the new environment variables')
  console.log('   3. Check the deployment status in your Vercel dashboard')

  rl.close()
}

setupVercelEnv().catch(console.error)