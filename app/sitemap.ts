import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/app/actions/blog/get-posts";
import { getCampaigns } from "@/app/actions/campaigns/get-campaigns";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://chosen-arrows-foundation-six.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/campaigns`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/mentorship`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/donate`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/transparency-repo`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms-of-service`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const [blogPosts, campaigns] = await Promise.all([
    getBlogPosts({ publishedOnly: true }),
    getCampaigns("en", { status: "active" }),
  ]);

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(post.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const campaignEntries: MetadataRoute.Sitemap = campaigns.map((campaign) => ({
    url: `${BASE_URL}/campaigns/${campaign.slug || campaign.id}`,
    lastModified: new Date(campaign.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...blogEntries, ...campaignEntries];
}
