"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, MapPin, Calendar } from "lucide-react";
import Image from "next/image";
import child1 from "@/assets/child-1.jpg";
import child2 from "@/assets/child-2.jpg";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import type { StaticImageData } from "next/image";
import { useRef } from "react";
import { motion, useTransform, useScroll } from "framer-motion";

type CampaignCard = {
  id: string | number;
  slug?: string;
  name: string;
  age?: number | null;
  location?: string;
  story: string;
  image?: string | StaticImageData;
  goal: number;
  raised: number;
  donors: number;
  daysLeft?: number | null;
};

type CampaignsSectionProps = {
  campaigns?: CampaignCard[];
};

const fallbackCampaigns: CampaignCard[] = [
  {
    id: 1,
    name: "Grace's Educational Journey",
    age: 8,
    location: "Nairobi, Kenya",
    story: "Grace dreams of becoming a doctor to help her community. With your support, she can receive the education and mentorship needed to achieve her destiny.",
    image: child1,
    goal: 1500,
    raised: 850,
    donors: 15,
    daysLeft: 25,
  },
  {
    id: 2,
    name: "David's Hope for Tomorrow",
    age: 10,
    location: "Nairobi, Kenya",
    story: "David has a gift for mathematics and science. Help us provide him with the resources and guidance to become the engineer he's meant to be.",
    image: child2,
    goal: 1200,
    raised: 580,
    donors: 12,
    daysLeft: 18,
  },
  {
    id: 3,
    name: "Sarah's Music Dream",
    age: 12,
    location: "Kisumu, Kenya",
    story: "Sarah has a natural talent for music. Help her attend the music academy to refine her skills and share her gift with the world.",
    image: child1, // Using child1 as placeholder for now
    goal: 2000,
    raised: 450,
    donors: 8,
    daysLeft: 30,
  },
  {
    id: 4,
    name: "Michael's Tech Ambition",
    age: 14,
    location: "Mombasa, Kenya",
    story: "Michael builds robots from scrap metal. He needs a laptop and coding lessons to turn his hobby into a career.",
    image: child2,
    goal: 1800,
    raised: 200,
    donors: 5,
    daysLeft: 45,
  },
  {
    id: 5,
    name: "Faith's Nursing Goal",
    age: 11,
    location: "Nakuru, Kenya",
    story: "Faith wants to be a nurse like her aunt. Support her education to help her care for the sick in her village.",
    image: child1,
    goal: 1600,
    raised: 900,
    donors: 18,
    daysLeft: 15,
  },
];

const CampaignsSection = ({ campaigns }: CampaignsSectionProps) => {
  const { t } = useTranslation();
  const campaignList = campaigns?.length ? campaigns : fallbackCampaigns;
  // Show exactly 5 most recent campaigns (already ordered by creation date from backend)
  const displayCampaigns = campaignList.slice(0, 5);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-75%"]);

  return (
    <section ref={targetRef} id="campaigns" className="relative h-[300vh] bg-gradient-to-b from-mint-50/50 to-white">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-12">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-8 px-4 md:mb-12 shrink-0">
          <h2 className="mb-4 text-foreground text-balance">
            {t("campaigns.title")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("campaigns.subtitle")}
          </p>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative w-full">
          <motion.div style={{ x }} className="flex gap-8 px-4 md:px-12 w-max">
            {displayCampaigns.map((campaign) => {
              const progress = (campaign.raised / campaign.goal) * 100;
              const imageSrc = campaign.image || child1;

              return (
                <div key={campaign.id} className="w-[350px] md:w-[450px] shrink-0">
                  <div className="enterprise-card overflow-hidden hover-lift h-full flex flex-col bg-white rounded-2xl border border-border/40 shadow-sm">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden shrink-0">
                      <Image
                        src={imageSrc}
                        alt={campaign.name}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Header */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {campaign.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {campaign.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {campaign.location}
                            </span>
                          )}
                          {campaign.age ? (
                            <span>Age {campaign.age}</span>
                          ) : null}
                        </div>
                      </div>

                      {/* Story */}
                      <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-grow">
                        {campaign.story}
                      </p>

                      {/* Progress */}
                      <div className="mb-4 mt-auto">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-semibold text-foreground">
                            ${campaign.raised.toLocaleString()} {t("campaigns.raised")}
                          </span>
                          <span className="text-muted-foreground">
                            {t("campaigns.of")} ${campaign.goal.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </div>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground pb-5 mb-5 border-b border-border">
                        <span className="font-medium">
                          {campaign.donors} {t("campaigns.donors")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {campaign.daysLeft} {t("campaigns.daysLeft")}
                        </span>
                      </div>

                      {/* CTA */}
                      <Link href={`/campaigns/${campaign.slug || campaign.id}`} className="mt-auto">
                        <Button variant="gradient" className="w-full rounded-full">
                          {t("campaigns.support")} {campaign.name.split("'")[0]}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* View All Link */}
        <div className="text-center mt-12 shrink-0">
          <Link href="/campaigns">
            <Button
              variant="outline"
              className="font-semibold px-8 rounded-full border-mint-300 text-mint-600 hover:bg-mint-50 hover:border-mint-400 transition-all duration-200"
            >
              {t("campaigns.viewAll")}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CampaignsSection;
