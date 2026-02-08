import type { Metadata } from "next";
import CampaignsWithPagination from "./CampaignsWithPagination";
import { getCampaigns } from "@/app/actions/campaigns/get-campaigns";
import { getServerLanguage } from "@/lib/i18n";
import { getPageMetadata } from "@/app/actions/metadata/get-page-metadata";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage();
  const metadata = await getPageMetadata('/campaigns', language);

  if (metadata) {
    return {
      title: metadata.title || "Campaigns | Chosen Arrows Foundation",
      description: metadata.description || "Support our campaigns to help children achieve their dreams.",
      keywords: metadata.keywords || ["campaigns", "children", "education", "support", "donate"],
      openGraph: {
        title: metadata.og_title || metadata.title || "Campaigns | Chosen Arrows Foundation",
        description: metadata.og_description || metadata.description || "Support our campaigns to help children achieve their dreams.",
        type: (metadata.og_type || "website") as any,
        images: metadata.og_image_url ? [{ url: metadata.og_image_url }] : undefined,
        siteName: "Chosen Arrows Foundation",
      },
      twitter: {
        card: (metadata.twitter_card || "summary_large_image") as any,
        title: metadata.twitter_title || metadata.title || "Campaigns | Chosen Arrows Foundation",
        description: metadata.twitter_description || metadata.description || "Support our campaigns to help children achieve their dreams.",
        images: metadata.twitter_image_url ? [metadata.twitter_image_url] : undefined,
      },
    };
  }

  // Fallback metadata
  return {
    title: "Campaigns | Chosen Arrows Foundation",
    description: "Support our campaigns to help children achieve their dreams.",
    keywords: ["campaigns", "children", "education", "support", "donate"],
    openGraph: {
      title: "Campaigns | Chosen Arrows Foundation",
      description: "Support our campaigns to help children achieve their dreams.",
      type: "website",
      siteName: "Chosen Arrows Foundation",
    },
    twitter: {
      card: "summary_large_image",
      title: "Campaigns | Chosen Arrows Foundation",
      description: "Support our campaigns to help children achieve their dreams.",
    },
  };
}

// Helper function to transform campaign data for the frontend
type TransformedCampaign = {
  id: string;
  slug: string;
  title: string;
  child: string;
  story: string;
  image: string | null;
  raised: number;
  goal: number;
  supporters: number;
  daysLeft: number | null;
  category: string;
};

function transformCampaignData(campaign: any): TransformedCampaign {
  // Format child information as "Name, Age - Location" or just "Name" if no age/location
  let childDisplay = campaign.translation?.child_name || '';
  
  if (campaign.translation?.child_age && campaign.translation?.location) {
    childDisplay = `${campaign.translation.child_name}, ${campaign.translation.child_age} - ${campaign.translation.location}`;
  } else if (campaign.translation?.child_age) {
    childDisplay = `${campaign.translation.child_name}, ${campaign.translation.child_age}`;
  } else if (campaign.translation?.location) {
    childDisplay = `${campaign.translation.child_name} - ${campaign.translation.location}`;
  }

  return {
    id: campaign.id,
    slug: campaign.slug,
    title: campaign.translation?.title || 'Untitled Campaign',
    child: childDisplay,
    story: campaign.translation?.story || '',
    image: campaign.primaryImage || null,
    raised: campaign.raised_amount || 0,
    goal: campaign.goal_amount || 0,
    supporters: campaign.donor_count || 0,
    daysLeft: campaign.days_left,
    category: campaign.category || '',
  };
}

export default async function CampaignsPage() {
  const language = await getServerLanguage();
  
  // Fetch all active campaigns ordered by creation date (newest first)
  const rawCampaigns = await getCampaigns(language, { status: 'active' }).catch(() => []);
  
  // Transform campaigns data to match component expectations
  const campaigns = rawCampaigns.map(transformCampaignData);

  return (
    <Suspense fallback={
      <main className="pt-24 pb-20">
        <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <p className="text-muted-foreground">Loading campaigns...</p>
            </div>
          </div>
        </section>
      </main>
    }>
      <CampaignsWithPagination campaigns={campaigns} />
    </Suspense>
  );
}