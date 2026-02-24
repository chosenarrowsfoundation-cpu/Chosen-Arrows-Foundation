"use client";

import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Clock, Target } from "lucide-react";
import MentorshipForm from "./MentorshipForm";

export default function MentorshipPageClient() {
  const { t } = useTranslation();
  const benefits = [
    { icon: Heart, key: "impact" },
    { icon: Users, key: "relationships" },
    { icon: Target, key: "skills" },
    { icon: Clock, key: "flexible" },
  ] as const;

  return (
    <main className="pt-24 pb-20">
      {/* Header */}
      <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              {t("mentorship.title").includes(" ") ? (
                <>
                  {t("mentorship.title").split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {t("mentorship.title").split(" ").slice(-1)[0]}
                  </span>
                </>
              ) : (
                t("mentorship.title")
              )}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {t("mentorship.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto mb-16">
            <MentorshipForm />
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              const key = benefit.key;
              return (
                <Card key={index}>
                  <CardContent className="p-6 space-y-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">{t(`mentorship.${key}`)}</h3>
                    <p className="text-muted-foreground">{t(`mentorship.${key}Desc`)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
