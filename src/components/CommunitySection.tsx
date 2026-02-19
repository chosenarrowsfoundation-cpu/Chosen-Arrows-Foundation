"use client";

import { Quote } from "lucide-react";
import { useTranslation } from "react-i18next";

type CommunityContent = {
  title?: string;
  subtitle?: string;
  imageCaption?: string;
  testimonials?: Array<{
    name: string;
    role: string;
    content: string;
    avatar?: string;
  }>;
  stats?: {
    donorRetention?: string | number;
    avgRating?: string | number;
    transparency?: string | number;
  };
};

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Monthly Donor",
    content: "Seeing the direct impact of my contributions has been incredibly fulfilling. Every update reminds me that I'm part of something truly meaningful.",
    avatar: "SJ",
  },
  {
    name: "Michael Chen",
    role: "Mentor",
    content: "Mentoring through Chosen Arrows has transformed my life as much as the children I guide. It's a privilege to be part of their journey toward purpose.",
    avatar: "MC",
  },
  {
    name: "Grace Okonkwo",
    role: "Parent",
    content: "My daughter's confidence and dreams have flourished thanks to this foundation. They didn't just provide financial support — they gave her hope and direction.",
    avatar: "GO",
  },
];

const formatStat = (value: string | number | undefined, fallback: string) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "number") return value.toString();
  return value;
};

type Testimonial = {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar_initials: string | null;
};

const DEFAULT_COMMUNITY_VIDEO = '/hero-background.mp4';

const CommunitySection = ({ 
  content, 
  testimonials: testimonialsProp,
  videoUrl,
  posterUrl,
}: { 
  content?: CommunityContent;
  testimonials?: Testimonial[];
  videoUrl?: string | null;
  posterUrl?: string | null;
}) => {
  const { t } = useTranslation();
  
  // Use testimonials from prop if available, otherwise from content, otherwise fallback
  const testimonialsList = testimonialsProp?.length 
    ? testimonialsProp.map(t => ({
        name: t.name,
        role: t.role,
        content: t.content,
        avatar: t.avatar_initials || t.name.split(" ").map((part) => part[0]).join("").slice(0, 2),
      }))
    : content?.testimonials?.length 
    ? content.testimonials 
    : testimonials;

  return (
    <section id="community" className="section-padding bg-background">
      <div className="enterprise-container">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="mb-4 text-foreground text-balance">
            {content?.title ?? t("community.title")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {content?.subtitle ?? t("community.subtitle")}
          </p>
        </div>

        {/* Community Video */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-16">
          <div className="relative overflow-hidden h-56 md:h-72 enterprise-card rounded-xl">
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={posterUrl || undefined}
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source
                src={videoUrl?.trim() || DEFAULT_COMMUNITY_VIDEO}
                type={(videoUrl?.trim() || DEFAULT_COMMUNITY_VIDEO).toLowerCase().endsWith('.webm') ? 'video/webm' : 'video/mp4'}
              />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-lg md:text-xl font-medium text-white">
                {content?.imageCaption ?? t("community.imageCaption")}
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {testimonialsList.map((testimonial) => (
            <div
              key={testimonial.name}
              className="enterprise-card p-6 hover-lift group"
            >
              <Quote className="w-6 h-6 text-taffy-300 mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-taffy-100 to-mint-100 flex items-center justify-center text-xs font-semibold text-taffy-600 group-hover:from-taffy-200 group-hover:to-mint-200 transition-colors duration-200">
                  {testimonial.avatar ?? testimonial.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Stats */}
        <div className="max-w-3xl mx-auto mt-12 md:mt-16">
          <div className="enterprise-card p-8 bg-gradient-to-r from-mint-50/50 via-white to-taffy-50/50 border-mint-200/30">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="stat-value text-2xl md:text-3xl mb-1 text-mint-600">
                  {formatStat(content?.stats?.donorRetention, "98%")}
                </div>
                <div className="stat-label">{t("community.donorRetention")}</div>
              </div>
              <div>
                <div className="stat-value text-2xl md:text-3xl mb-1 text-taffy-500">
                  {formatStat(content?.stats?.avgRating, "4.9★")}
                </div>
                <div className="stat-label">{t("community.avgRating")}</div>
              </div>
              <div>
                <div className="stat-value text-2xl md:text-3xl mb-1 text-mint-600">
                  {formatStat(content?.stats?.transparency, "100%")}
                </div>
                <div className="stat-label">{t("community.transparency")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
