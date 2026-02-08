"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, Calendar, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface UnifiedCampaignCardProps {
  campaign: {
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
    category?: string;
  };
  buttonText?: string;
  variant?: "campaigns" | "home" | "default";
  showCategory?: boolean;
  imageHeight?: string;
}

export function UnifiedCampaignCard({
  campaign,
  buttonText = "Support Campaign",
  variant = "default",
  showCategory = false,
  imageHeight = "h-64",
}: UnifiedCampaignCardProps) {
  const progress = (campaign.raised / campaign.goal) * 100;

  return (
    <Card className="group hover:shadow-[var(--shadow-divine)] transition-all duration-300 hover:-translate-y-2 overflow-hidden">
      <div className={cn("relative overflow-hidden bg-muted", imageHeight)}>
        {campaign.image ? (
          <Image
            src={campaign.image}
            alt={campaign.child}
            fill
            quality={85}
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-mint-100 to-taffy-100">
            <Heart className="w-16 h-16 text-mint-300" />
          </div>
        )}
        {showCategory && campaign.category && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-sm font-semibold backdrop-blur-sm">
            {campaign.category}
          </div>
        )}
      </div>

      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold mb-2">{campaign.title}</h3>
          <p className="text-sm text-primary font-semibold mb-3">{campaign.child}</p>
          <p className="text-muted-foreground leading-relaxed line-clamp-3">
            {campaign.story}
          </p>
        </div>

        <div className="space-y-3 pb-6 border-b border-border">
          <div className="flex justify-between text-sm">
            <span className="font-semibold">${campaign.raised.toLocaleString()}</span>
            <span className="text-muted-foreground">of ${campaign.goal.toLocaleString()}</span>
          </div>
          <Progress value={progress} className="h-2" />

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{campaign.supporters} supporters</span>
            </div>
            {campaign.daysLeft !== null && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{campaign.daysLeft} days left</span>
              </div>
            )}
          </div>
        </div>

        <Link href={`/campaigns/${campaign.slug || campaign.id}`}>
          <Button variant="gradient" className="w-full rounded-full">
            <Heart className="w-4 h-4 mr-2" fill="currentColor" />
            {buttonText}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
