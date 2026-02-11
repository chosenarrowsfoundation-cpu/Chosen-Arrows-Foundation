"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import Link from "next/link";
import { Heart, Calendar, Users, Target, Share2 } from "lucide-react";
import type { StaticImageData } from "next/image";

interface CampaignDetailClientProps {
  campaign: {
    id: string;
    slug: string;
    title: string;
    child: string;
    fullStory: string;
    image: string | StaticImageData;
    raised: number;
    goal: number;
    supporters: number;
    daysLeft: number;
    category: string;
    updates: Array<{ date: string; text: string }>;
  };
}

export default function CampaignDetailClient({ campaign }: CampaignDetailClientProps) {
  const progress =
    campaign.goal > 0
      ? Math.min(100, (campaign.raised / campaign.goal) * 100)
      : 0;

  return (
    <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Hero Image */}
                <div className="relative h-96 rounded-2xl overflow-hidden">
                  <Image
                    src={campaign.image}
                    alt={campaign.child}
                    fill
                    priority
                    quality={90}
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                  <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-primary text-primary-foreground font-semibold backdrop-blur-sm">
                    {campaign.category}
                  </div>
                </div>

                {/* Campaign Info */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{campaign.title}</h1>
                    <p className="text-xl text-primary font-semibold">{campaign.child}</p>
                  </div>

                  <div className="prose prose-lg max-w-none">
                    {campaign.fullStory.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Updates */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Campaign Updates</h2>
                    <div className="space-y-4">
                      {campaign.updates.map((update, index) => (
                        <div key={index} className="border-l-2 border-primary pl-4 py-2">
                          <p className="text-sm text-muted-foreground mb-1">{update.date}</p>
                          <p className="font-medium">{update.text}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="sticky top-24">
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-baseline">
                        <span className="text-3xl font-bold">${campaign.raised.toLocaleString()}</span>
                        <span className="text-muted-foreground">of ${campaign.goal.toLocaleString()}</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                      
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                            <Users className="w-4 h-4" />
                          </div>
                          <div className="text-2xl font-bold">{campaign.supporters}</div>
                          <div className="text-sm text-muted-foreground">Supporters</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div className="text-2xl font-bold">{campaign.daysLeft}</div>
                          <div className="text-sm text-muted-foreground">Days Left</div>
                        </div>
                      </div>
                    </div>

                    <Link href={`/donate?campaign_id=${campaign.id}`}>
                      <Button variant="gradient" className="w-full h-12 text-lg rounded-full">
                        <Heart className="w-5 h-5 mr-2" fill="currentColor" />
                        Donate Now
                      </Button>
                    </Link>

                    <Button variant="outline" className="w-full rounded-full">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Campaign
                    </Button>

                    <div className="pt-4 border-t space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span>100% of donations go to the child</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        <span>Tax-deductible contributions</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
