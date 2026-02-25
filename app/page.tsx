import type { Metadata } from "next";
import ScrollLockHero from "@/components/ScrollLockHero";
import ValuesSection from "@/components/ValuesSection";
import ImpactSection from "@/components/ImpactSection";
import CampaignsSection from "@/components/CampaignsSection";
import CommunitySection from "@/components/CommunitySection";
import CTASection from "@/components/CTASection";
import { getContent } from "@/app/actions/content/get-content";
import { getCampaigns } from "@/app/actions/campaigns/get-campaigns";
import { getTotalFundsRaised } from "@/app/actions/campaigns/get-total-funds-raised";
import { getGoogleTestimonials } from "@/app/actions/testimonials/get-google-testimonials";
import { getSetting } from "@/app/actions/settings/get-settings";
import { getServerLanguage } from "@/lib/i18n";
import { getPageMetadata } from "@/app/actions/metadata/get-page-metadata";
import { getHeroLabels } from "@/lib/server-translations";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage();
  const metadata = await getPageMetadata('/', language);

  if (metadata) {
    return {
      title: metadata.title || "Home | Chosen Arrows Foundation",
      description: metadata.description || "A five-scene, story-driven journey that turns a child's present into a clear decision.",
      keywords: metadata.keywords || ["crowdfunding", "children", "education", "decision", "relief"],
      openGraph: {
        title: metadata.og_title || metadata.title || "Chosen Arrows Foundation",
        description: metadata.og_description || metadata.description || "A five-scene, story-driven journey that turns a child's present into a clear decision.",
        type: (metadata.og_type || "website") as any,
        images: metadata.og_image_url ? [{ url: metadata.og_image_url }] : undefined,
        siteName: "Chosen Arrows Foundation",
      },
      twitter: {
        card: (metadata.twitter_card || "summary_large_image") as any,
        title: metadata.twitter_title || metadata.title || "Chosen Arrows Foundation",
        description: metadata.twitter_description || metadata.description || "A five-scene, story-driven journey that turns a child's present into a clear decision.",
        images: metadata.twitter_image_url ? [metadata.twitter_image_url] : undefined,
      },
    };
  }

  // Fallback metadata
  return {
    title: "Home | Chosen Arrows Foundation",
    description: "A five-scene, story-driven journey that turns a child's present into a clear decision.",
    keywords: ["crowdfunding", "children", "education", "decision", "relief"],
    openGraph: {
      title: "Chosen Arrows Foundation",
      description: "A five-scene, story-driven journey that turns a child's present into a clear decision.",
      type: "website",
      siteName: "Chosen Arrows Foundation",
    },
    twitter: {
      card: "summary_large_image",
      title: "Chosen Arrows Foundation",
      description: "A five-scene, story-driven journey that turns a child's present into a clear decision.",
    },
  };
}

export default async function HomePage() {
  const language = await getServerLanguage();
  
  // Fetch all content in parallel
  const [heroContent, valuesContent, impactContent, communityContent, ctaContent, campaignsRaw, testimonials, heroStats, heroVideo, communityVideo, totalFundsRaised] = await Promise.all([
    getContent('hero', language).catch(() => null),
    getContent('values', language).catch(() => null),
    getContent('impact', language).catch(() => null),
    getContent('community', language).catch(() => null),
    getContent('cta', language).catch(() => null),
    getCampaigns(language, { limit: 5, status: 'active' }).catch(() => []),
    getGoogleTestimonials(language).catch(() => []),
    getSetting('hero_stats').catch(() => null),
    getSetting('hero_video').catch(() => null),
    getSetting('community_video').catch(() => null),
    getTotalFundsRaised().catch(() => 0),
  ]);

  // Transform campaigns to match CampaignsSection expected format
  // Campaigns are already ordered by creation date (newest first) from getCampaigns
  const campaigns = campaignsRaw.map(campaign => ({
    id: campaign.id,
    slug: campaign.slug,
    name: campaign.translation?.title || '',
    age: campaign.translation?.child_age || null,
    location: campaign.translation?.location || null,
    story: campaign.translation?.story || '',
    image: campaign.primaryImage || undefined,
    goal: campaign.goal_amount,
    raised: campaign.raised_amount,
    donors: campaign.donor_count,
    daysLeft: campaign.days_left,
  }));

  // Merge hero stats from settings; override fundsRaised with live total from campaigns
  const heroContentWithStats = heroContent
    ? {
        ...heroContent,
        stats: {
          ...heroContent.stats,
          ...(heroStats || {}),
          fundsRaised: totalFundsRaised,
        },
      }
    : { stats: { fundsRaised: totalFundsRaised } };

  const heroVideoConfig = heroVideo as { url?: string; posterUrl?: string } | null
  const communityMediaConfig = communityVideo as {
    url?: string;
    posterUrl?: string;
    enabled?: boolean;
    mediaType?: 'video' | 'image';
  } | null

  // Resolve community media URL on server to avoid hydration mismatch (single source of truth)
  const DEFAULT_COMMUNITY_VIDEO = 'https://videos.pexels.com/video-files/35025845/14838443_2560_1440_60fps.mp4'
  const communityMediaUrl = (communityMediaConfig?.url?.trim() || DEFAULT_COMMUNITY_VIDEO)
  const heroLabels = getHeroLabels(language)

  return (
    <main className="bg-background text-foreground">
      {/* Scroll-locked Hero Section */}
      <ScrollLockHero content={heroContentWithStats} labels={heroLabels} videoUrl={heroVideoConfig?.url} posterUrl={heroVideoConfig?.posterUrl} />
      <ValuesSection content={valuesContent} />
      <ImpactSection content={impactContent} />
      <CampaignsSection campaigns={campaigns} />
      <CommunitySection
        content={communityContent}
        testimonials={testimonials}
        mediaUrl={communityMediaUrl}
        posterUrl={communityMediaConfig?.posterUrl}
        mediaEnabled={communityMediaConfig?.enabled === true}
        mediaType={communityMediaConfig?.mediaType ?? 'video'}
      />
      <CTASection content={ctaContent} />
    </main>
  );
}
