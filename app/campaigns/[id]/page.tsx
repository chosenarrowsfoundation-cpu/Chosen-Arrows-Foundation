import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CampaignDetailClient from "./CampaignDetailClient";
import { getCampaign } from "@/app/actions/campaigns/get-campaign";
import { getCampaignUpdates } from "@/app/actions/campaigns/manage-campaign-updates";
import { getServerLanguage } from "@/lib/i18n";
import { getPageMetadata } from "@/app/actions/metadata/get-page-metadata";
import { formatDistanceToNow } from "date-fns";

function formatUpdateDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return dateString;
  }
}

type PageParams = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const language = await getServerLanguage();
  const { id } = await params;
  const campaign = await getCampaign(id, language);

  if (!campaign || campaign.status !== 'active') {
    return {
      title: "Campaign Not Found | Chosen Arrows Foundation",
      description: "The campaign you're looking for doesn't exist.",
    };
  }

  const pageMetadata = await getPageMetadata(`/campaigns/${campaign.slug}`, language);
  const progress = Math.round((campaign.raised_amount / campaign.goal_amount) * 100);
  const childName = campaign.translation?.child_name || '';
  const childAge = campaign.translation?.child_age;
  const child = childAge ? `${childName}, ${childAge}` : childName;
  const fullStory = campaign.translation?.full_story || campaign.translation?.story || '';
  const title = campaign.translation?.title || 'Campaign';

  const defaultDescription = `${child} - ${fullStory.substring(0, 150)}... Help us reach our goal of $${campaign.goal_amount.toLocaleString()}. ${progress}% funded.`;

  return {
    title: pageMetadata?.title || `${title} | Chosen Arrows Foundation`,
    description: pageMetadata?.description || defaultDescription,
    keywords: pageMetadata?.keywords || [campaign.category?.toLowerCase() || 'campaign', "donate", "fundraising", childName.toLowerCase()],
    openGraph: {
      title: pageMetadata?.og_title || pageMetadata?.title || `${title} | Chosen Arrows Foundation`,
      description: pageMetadata?.og_description || pageMetadata?.description || `Support ${child} - ${fullStory.substring(0, 150)}...`,
      type: (pageMetadata?.og_type || "website") as any,
      images: campaign.primaryImage ? [
        {
          url: campaign.primaryImage,
          width: 1200,
          height: 630,
          alt: child,
        },
      ] : pageMetadata?.og_image_url ? [{ url: pageMetadata.og_image_url }] : undefined,
    },
    twitter: {
      card: (pageMetadata?.twitter_card || "summary_large_image") as any,
      title: pageMetadata?.twitter_title || pageMetadata?.title || `${title} | Chosen Arrows Foundation`,
      description: pageMetadata?.twitter_description || pageMetadata?.description || `Support ${child} - ${progress}% funded. Help us reach $${campaign.goal_amount.toLocaleString()}`,
      images: campaign.primaryImage ? [campaign.primaryImage] : pageMetadata?.twitter_image_url ? [pageMetadata.twitter_image_url] : undefined,
    },
  };
}

export default async function CampaignDetailPage({ params }: PageParams) {
  const language = await getServerLanguage();
  const { id } = await params;
  const campaign = await getCampaign(id, language);

  if (!campaign || campaign.status !== 'active') {
    notFound();
  }

  // Fetch campaign updates
  const updatesRaw = await getCampaignUpdates(campaign.id).catch(() => []);
  
  // Transform updates to match component format
  const updates = updatesRaw.map(update => ({
    date: formatUpdateDate(update.update_date),
    text: update.content,
  }));

  // Format child name and age
  const childName = campaign.translation?.child_name || '';
  const childAge = campaign.translation?.child_age;
  const child = childAge ? `${childName}, ${childAge}` : childName;

  // Transform campaign data to match component format
  const campaignData = {
    id: campaign.id,
    slug: campaign.slug,
    title: campaign.translation?.title || '',
    child,
    fullStory: campaign.translation?.full_story || campaign.translation?.story || '',
    image: campaign.primaryImage || '',
    raised: campaign.raised_amount,
    goal: campaign.goal_amount,
    supporters: campaign.donor_count,
    daysLeft: campaign.days_left || 0,
    category: campaign.category || '',
    updates,
  };

  return <CampaignDetailClient campaign={campaignData} />;
}
