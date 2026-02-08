'use server'

import { createClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/app/actions/auth/check-admin-auth'

export interface DashboardStats {
  // Campaign Metrics
  activeCampaigns: number
  totalRaised: number
  totalGoal: number
  overallProgress: number
  campaignCompletionRate: number
  recentChildren: Array<{
    id: string
    slug: string
    child_name: string | null
    child_age: number | null
    location: string | null
    created_at: string
  }>
  childrenNeedingSponsorship: Array<{
    id: string
    slug: string
    child_name: string | null
    child_age: number | null
    location: string | null
    title: string | null
    raised_amount: number
    goal_amount: number
    progress: number
  }>

  // Donation Metrics
  totalDonations: number
  uniqueDonors: number
  averageDonation: number
  monthlyDonationTrend: number // Percentage change
  recentDonations: Array<{
    id: string
    donor_name: string
    amount: number
    created_at: string
    campaign_title: string | null
  }>

  // Content Metrics
  contentSectionsCount: number

  // Activity
  recentActivity: Array<{
    id: string
    action: string
    table_name: string
    actor_name: string | null
    created_at: string
  }>

  // Blog (blocks reflect on frontend)
  recentBlogPosts: Array<{
    id: string
    title: string
    slug: string
    status: string
    updated_at: string
  }>
}

/**
 * Optimized dashboard stats fetcher
 * Aggregates multiple queries efficiently
 */
export async function getDashboardStats(): Promise<DashboardStats | null> {
  // Verify admin access
  const { user, error: authError } = await checkAdminAuth()
  if (authError || !user) {
    return null
  }

  const supabase = await createClient()

  try {
    // Execute all queries in parallel for optimal performance
    const [
      campaignsResult,
      donationsResult,
      sectionsResult,
      recentActivityResult,
      recentChildrenResult,
      recentDonationsResult,
      blogPostsResult,
    ] = await Promise.allSettled([
      // Campaign stats - optimized single query
      supabase
        .from('campaigns')
        .select('id, raised_amount, goal_amount, status, slug, created_at')
        .eq('status', 'active'),
      
      // Donations (amount, donor_email, created_at for totals + unique count + monthly trend)
      supabase
        .from('donations')
        .select('amount, donor_email, created_at')
        .eq('status', 'completed'),
      
      // Content sections count
      supabase
        .from('content_sections')
        .select('id', { count: 'exact', head: true }),
      
      // Recent activity
      supabase
        .from('content_audit_log')
        .select('id, created_at, action, table_name, actor_name')
        .order('created_at', { ascending: false })
        .limit(5),
      
      // Recent children (last 30 days)
      supabase
        .from('campaigns')
        .select(`
          id,
          slug,
          created_at,
          translations:campaign_translations!inner(
            child_name,
            child_age,
            location
          )
        `)
        .eq('campaign_translations.language_code', 'en')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(10),
      
      // Recent donations with campaign info
      supabase
        .from('donations')
        .select(`
          id,
          donor_name,
          amount,
          created_at,
          campaign_id,
          campaigns:campaign_id(
            translations:campaign_translations!inner(
              title
            )
          )
        `)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(10),

      // Recent blog posts (dashboard blocks → reflect on frontend)
      supabase
        .from('blog_posts')
        .select('id, title, slug, status, updated_at')
        .order('updated_at', { ascending: false })
        .limit(5),
    ])

    // Process campaign data
    const campaigns = campaignsResult.status === 'fulfilled' ? campaignsResult.value.data || [] : []
    const totalRaised = campaigns.reduce((sum: number, c: any) => sum + (Number(c.raised_amount) || 0), 0)
    const totalGoal = campaigns.reduce((sum: number, c: any) => sum + (Number(c.goal_amount) || 0), 0)
    const overallProgress = totalGoal > 0 ? Math.round((totalRaised / totalGoal) * 100) : 0
    
    // Calculate completion rate (campaigns that reached 100%)
    const completedCampaigns = campaigns.filter((c: any) => {
      const raised = Number(c.raised_amount) || 0
      const goal = Number(c.goal_amount) || 0
      return goal > 0 && raised >= goal
    }).length
    const campaignCompletionRate = campaigns.length > 0 
      ? Math.round((completedCampaigns / campaigns.length) * 100) 
      : 0

    // Process donation data
    const donations = donationsResult.status === 'fulfilled' ? donationsResult.value.data || [] : []
    const totalDonations = donations.reduce((sum: number, d: any) => sum + (Number(d.amount) || 0), 0)
    const uniqueDonors = new Set(
      (donations as { donor_email?: string }[]).map((d) => d.donor_email).filter(Boolean)
    ).size
    const averageDonation = donations.length > 0 
      ? totalDonations / donations.length 
      : 0

    // Calculate monthly trend (last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    
    const recentDonationsSum = donations
      .filter((d: any) => new Date(d.created_at) >= thirtyDaysAgo)
      .reduce((sum: number, d: any) => sum + (Number(d.amount) || 0), 0)
    
    const previousDonationsSum = donations
      .filter((d: any) => {
        const date = new Date(d.created_at)
        return date >= sixtyDaysAgo && date < thirtyDaysAgo
      })
      .reduce((sum: number, d: any) => sum + (Number(d.amount) || 0), 0)
    
    const monthlyDonationTrend = previousDonationsSum > 0
      ? Math.round(((recentDonationsSum - previousDonationsSum) / previousDonationsSum) * 100)
      : recentDonationsSum > 0 ? 100 : 0

    // Process recent children
    const recentChildren = recentChildrenResult.status === 'fulfilled'
      ? (recentChildrenResult.value.data || []).map((child: any) => ({
          id: child.id,
          slug: child.slug,
          child_name: child.translations?.[0]?.child_name || null,
          child_age: child.translations?.[0]?.child_age || null,
          location: child.translations?.[0]?.location || null,
          created_at: child.created_at,
        }))
      : []

    // Get children needing sponsorship - fetch translations in batch
    const childrenNeedingSponsorshipFiltered = campaigns
      .filter((c: any) => {
        const raised = Number(c.raised_amount) || 0
        const goal = Number(c.goal_amount) || 0
        return goal > 0 && raised < goal * 0.5
      })
      .slice(0, 5)

    // Fetch all translations in one query
    const campaignIds = childrenNeedingSponsorshipFiltered.map((c: any) => c.id)
    const { data: translationsData } = await supabase
      .from('campaign_translations')
      .select('campaign_id, child_name, child_age, location, title')
      .in('campaign_id', campaignIds)
      .eq('language_code', 'en')

    // Map translations to campaigns
    const childrenNeedingSponsorship = childrenNeedingSponsorshipFiltered.map((c: any) => {
      const translation = translationsData?.find((t: any) => t.campaign_id === c.id)
      const raised = Number(c.raised_amount) || 0
      const goal = Number(c.goal_amount) || 0
      const progress = goal > 0 ? Math.round((raised / goal) * 100) : 0

      return {
        id: c.id,
        slug: c.slug,
        child_name: translation?.child_name || null,
        child_age: translation?.child_age || null,
        location: translation?.location || null,
        title: translation?.title || null,
        raised_amount: raised,
        goal_amount: goal,
        progress,
      }
    })

    // Process recent donations
    const recentDonations = recentDonationsResult.status === 'fulfilled'
      ? (recentDonationsResult.value.data || []).map((donation: any) => ({
          id: donation.id,
          donor_name: donation.donor_name,
          amount: Number(donation.amount) || 0,
          created_at: donation.created_at,
          campaign_title: donation.campaigns?.translations?.[0]?.title || null,
        }))
      : []

    // Process activity
    const recentActivity = recentActivityResult.status === 'fulfilled'
      ? recentActivityResult.value.data || []
      : []

    // Process blog posts (may be empty if migration not run)
    const recentBlogPosts = blogPostsResult.status === 'fulfilled' && blogPostsResult.value.data
      ? blogPostsResult.value.data.map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          status: p.status,
          updated_at: p.updated_at,
        }))
      : []

    return {
      activeCampaigns: campaigns.length,
      totalRaised,
      totalGoal,
      overallProgress,
      campaignCompletionRate,
      recentChildren,
      childrenNeedingSponsorship,
      totalDonations,
      uniqueDonors,
      averageDonation,
      monthlyDonationTrend,
      recentDonations,
      contentSectionsCount: sectionsResult.status === 'fulfilled' ? sectionsResult.value.count || 0 : 0,
      recentActivity,
      recentBlogPosts,
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return null
  }
}
