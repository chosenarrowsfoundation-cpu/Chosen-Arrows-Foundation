'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Returns the sum of raised_amount across all active campaigns.
 * Used for the hero "Funds Raised" stat.
 */
export async function getTotalFundsRaised(): Promise<number> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('campaigns')
      .select('raised_amount')
      .eq('status', 'active')

    if (error) {
      console.warn('Failed to fetch total funds raised:', error.message)
      return 0
    }

    const total = (data || []).reduce(
      (sum, row) => sum + (Number(row.raised_amount) || 0),
      0
    )
    return total
  } catch {
    return 0
  }
}
