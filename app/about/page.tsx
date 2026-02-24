import type { Metadata } from "next";
import { getJourneyGallery } from "@/app/actions/journey/get-journey-gallery";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Us | Chosen Arrows Foundation",
  description: "Learn about Chosen Arrows Foundation's mission to provide holistic care, education, and mentorship to vulnerable children, empowering them to discover and fulfill their God-given purpose.",
  keywords: ["about", "mission", "vision", "story", "children", "education", "mentorship"],
  openGraph: {
    title: "About Us | Chosen Arrows Foundation",
    description: "Learn about our mission to guide children toward their divine destiny",
    type: "website",
  },
};

export default async function AboutPage() {
  const galleryImages = await getJourneyGallery();
  return <AboutPageClient galleryImages={galleryImages} />;
}
