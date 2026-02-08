"use client";

import { Heart, Shield, HandHeart, Sparkles, CheckCircle, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

type ValuesContent = {
  title?: string;
  subtitle?: string;
  description?: string;
  values?: Array<{
    key?: string;
    title: string;
    description: string;
  }>;
  vision?: {
    title?: string;
    quote?: string;
  };
};

const iconMap: Record<string, typeof HandHeart> = {
  responsibility: HandHeart,
  integrity: Shield,
  trust: Heart,
  adeptness: Sparkles,
  honesty: CheckCircle,
  community: Users,
};

const ValuesSection = ({ content }: { content?: ValuesContent }) => {
  const { t } = useTranslation();
  
  const fallbackValues = [
    {
      icon: HandHeart,
      titleKey: "values.responsibility",
      descKey: "values.responsibilityDesc",
    },
    {
      icon: Shield,
      titleKey: "values.integrity",
      descKey: "values.integrityDesc",
    },
    {
      icon: Heart,
      titleKey: "values.trust",
      descKey: "values.trustDesc",
    },
    {
      icon: Sparkles,
      titleKey: "values.adeptness",
      descKey: "values.adeptnessDesc",
    },
    {
      icon: CheckCircle,
      titleKey: "values.honesty",
      descKey: "values.honestyDesc",
    },
    {
      icon: Users,
      titleKey: "values.community",
      descKey: "values.communityDesc",
    },
  ];

  const values = content?.values?.length
    ? content.values.map((value) => ({
        icon: iconMap[value.key || ""] || Heart,
        title: value.title,
        description: value.description,
      }))
    : fallbackValues.map((value) => ({
        ...value,
        title: t(value.titleKey),
        description: t(value.descKey),
      }));

  return (
    <section id="mission" className="section-padding bg-gradient-to-b from-white to-taffy-50/30">
      <div className="enterprise-container">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="mb-4 text-foreground text-balance">
            {content?.title ?? t("values.title")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {content?.description ?? t("values.description")}
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon;
            const isLarge = index === 0 || index === 3;
            
            return (
              <div
                key={`${value.title}-${index}`}
                className={`enterprise-card p-6 hover-lift group ${
                  isLarge ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-taffy-100 to-mint-100 flex items-center justify-center group-hover:from-taffy-200 group-hover:to-mint-200 transition-colors duration-200">
                    <Icon className="w-5 h-5 text-taffy-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-foreground mb-1.5">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
