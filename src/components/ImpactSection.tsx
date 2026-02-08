"use client";

import { GraduationCap, Users, BookOpen, Heart, TrendingUp, Globe, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import Link from "next/link";

type ImpactContent = {
  title?: string;
  subtitle?: string;
  stats?: Array<{
    value: string | number;
    label: string;
    description: string;
  }>;
  transparency?: {
    title?: string;
    description?: string;
    features?: string[];
  };
};

const iconList = [Users, GraduationCap, BookOpen, Heart, TrendingUp, Globe];

const ImpactSection = ({ content }: { content?: ImpactContent }) => {
  const { t } = useTranslation();

  const fallbackStats = [
    {
      icon: Users,
      value: "45",
      labelKey: "impact.children",
      descKey: "impact.childrenDesc",
    },
    {
      icon: GraduationCap,
      value: "30",
      labelKey: "impact.scholarships",
      descKey: "impact.scholarshipsDesc",
    },
    {
      icon: BookOpen,
      value: "8",
      labelKey: "impact.mentorships",
      descKey: "impact.mentorshipsDesc",
    },
    {
      icon: Heart,
      value: "100+",
      labelKey: "impact.donorsWorldwide",
      descKey: "impact.donorsDesc",
    },
    {
      icon: TrendingUp,
      value: "95%",
      labelKey: "impact.successRate",
      descKey: "impact.successDesc",
    },
    {
      icon: Globe,
      value: "1",
      labelKey: "impact.countries",
      descKey: "impact.countriesDesc",
    },
  ];

  const stats = content?.stats?.length
    ? content.stats.map((stat, index) => ({
      icon: iconList[index % iconList.length],
      value: stat.value,
      label: stat.label,
      description: stat.description,
    }))
    : fallbackStats.map((stat) => ({
      ...stat,
      label: t(stat.labelKey),
      description: t(stat.descKey),
    }));

  const title = content?.title ?? t("impact.title");
  const subtitle = content?.subtitle ?? t("impact.subtitle");

  return (
    <section id="impact" className="section-padding bg-background">
      <div className="enterprise-container">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="mb-4 text-foreground text-balance">{title}</h2>
          <p className="text-muted-foreground text-lg">{subtitle}</p>
        </div>

        {/* Stats Grid - Bento Style */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={`${stat.label}-${index}`}
                className="enterprise-card p-6 hover-lift group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-mint-100 to-taffy-100 flex items-center justify-center group-hover:from-mint-200 group-hover:to-taffy-200 transition-colors duration-200">
                    <Icon className="w-4 h-4 text-mint-600" />
                  </div>
                </div>
                <div className="stat-value text-3xl md:text-4xl mb-1 bg-gradient-to-r from-taffy-500 to-mint-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-foreground mb-1">
                  {stat.label}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Transparency CTA */}
        <div className="mt-12 md:mt-16 text-center">
          <div className="inline-flex flex-col items-center">
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              {t("impact.transparencyDesc")}
            </p>
            <Link
              href="/transparency-repo"
              className="inline-flex items-center text-primary font-semibold hover:underline group"
            >
              {t("impact.realTime")}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
