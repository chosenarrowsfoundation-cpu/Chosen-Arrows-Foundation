"use client";

import { useTranslation } from "react-i18next";
import Image from "next/image";
import { Target, Sparkles, ShieldCheck, FileSearch, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import CTASection from "@/components/CTASection";

type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  span: string;
};

export default function AboutPageClient({
  galleryImages,
}: {
  galleryImages: GalleryImage[];
}) {
  const { t } = useTranslation();
  const stats = [
    { value: "500+", labelKey: "childrenSupported", color: "text-taffy-500" },
    { value: "15", labelKey: "communitiesServed", color: "text-mint-500" },
    { value: "100+", labelKey: "mentors", color: "text-taffy-500" },
    { value: "98%", labelKey: "successRate", color: "text-mint-500" },
  ];

  return (
    <main className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-taffy-50 via-mint-50/30 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              {t("about.title").split(" ").slice(0, -2).join(" ")}{" "}
              <span className="bg-gradient-to-r from-taffy-500 to-mint-500 bg-clip-text text-transparent">
                {t("about.title").split(" ").slice(-2).join(" ")}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              {t("about.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="border-taffy-200/50 hover:shadow-lg hover:shadow-taffy-100/50 transition-shadow duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-taffy-400 to-taffy-500 flex items-center justify-center shadow-lg shadow-taffy-400/25">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold">{t("about.mission")}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t("about.missionText")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-mint-200/50 hover:shadow-lg hover:shadow-mint-100/50 transition-shadow duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-mint-400 to-mint-500 flex items-center justify-center shadow-lg shadow-mint-400/25">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold">{t("about.vision")}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t("about.visionText")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gradient-to-b from-mint-50/30 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center">
              {t("about.storyHeading").replace(t("about.storyWord"), "").trim()}{" "}
              <span className="text-mint-500">{t("about.storyWord")}</span>
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>{t("about.storyP1")}</p>
              <p>{t("about.storyP2")}</p>
              <p>{t("about.storyP3")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency & Accountability */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t("about.transparencySectionTitle")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("about.transparencySectionDesc")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-taffy-200/50 hover:shadow-lg hover:shadow-taffy-100/50 transition-shadow duration-300">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-taffy-100 to-taffy-200 flex items-center justify-center">
                    <BarChart3 className="w-7 h-7 text-taffy-600" />
                  </div>
                  <h3 className="text-xl font-bold">{t("about.realTimeTracking")}</h3>
                  <p className="text-muted-foreground">{t("about.realTimeTrackingDesc")}</p>
                </CardContent>
              </Card>

              <Card className="border-mint-200/50 hover:shadow-lg hover:shadow-mint-100/50 transition-shadow duration-300">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-mint-100 to-mint-200 flex items-center justify-center">
                    <ShieldCheck className="w-7 h-7 text-mint-600" />
                  </div>
                  <h3 className="text-xl font-bold">{t("impact.verified")}</h3>
                  <p className="text-muted-foreground">{t("about.verifiedImpactDesc")}</p>
                </CardContent>
              </Card>

              <Card className="border-taffy-200/50 hover:shadow-lg hover:shadow-taffy-100/50 transition-shadow duration-300">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-taffy-100 to-taffy-200 flex items-center justify-center">
                    <FileSearch className="w-7 h-7 text-taffy-600" />
                  </div>
                  <h3 className="text-xl font-bold">{t("impact.accountability")}</h3>
                  <p className="text-muted-foreground">{t("about.accountabilityDesc")}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">
              {t("about.journeyHeading")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 auto-rows-[140px] md:auto-rows-[160px] grid-flow-dense">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className={`relative overflow-hidden rounded-lg md:rounded-xl group ${image.span}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs md:text-sm font-medium">{image.alt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-gradient-to-br from-taffy-50/50 via-white to-mint-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-10">
            {t("about.impactHeading")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6 space-y-2">
                  <div className={`text-4xl md:text-5xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {t(`about.${stat.labelKey}`)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
}
