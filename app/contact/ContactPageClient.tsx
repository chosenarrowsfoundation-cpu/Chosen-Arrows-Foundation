"use client";

import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { ContactForm } from "./ContactForm";

export default function ContactPageClient() {
  const { t } = useTranslation();

  return (
    <main className="pt-24 pb-20">
      {/* Header */}
      <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              {t("contact.title").includes(" ") ? (
                <>
                  {t("contact.title").split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {t("contact.title").split(" ").slice(-1)[0]}
                  </span>
                </>
              ) : (
                t("contact.title")
              )}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {t("contact.subtitle")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[minmax(400px,1fr)_2fr] gap-8">
            {/* Contact Info */}
            <div className="space-y-6 min-w-0">
              <Card className="min-w-0">
                <CardContent className="p-6 space-y-6 min-w-0">
                  <div className="space-y-4 min-w-0">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 break-words">
                        <h3 className="font-semibold mb-1">{t("contact.email")}</h3>
                        <p className="text-sm text-muted-foreground break-words">
                          <a href="mailto:info@chosenarrowsfoundation.org" className="text-primary hover:underline break-all">info@chosenarrowsfoundation.org</a>
                        </p>
                        <p className="text-sm text-muted-foreground break-words">
                          <a href="mailto:support@chosenarrowsfoundation.org" className="text-primary hover:underline break-all">support@chosenarrowsfoundation.org</a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{t("contact.phone")}</h3>
                        <p className="text-sm text-muted-foreground">
                          <a href="tel:+254798213309" className="text-primary hover:underline">+254 798 213 309</a>
                        </p>
                        <p className="text-sm text-muted-foreground">{t("contact.phoneHours")}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{t("contact.office")}</h3>
                        <p className="text-sm text-muted-foreground">
                          Nanyuki, Marura Block 3<br />
                          Sweet Water Road
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 min-w-0">
                <CardContent className="p-6 min-w-0">
                  <h3 className="font-semibold mb-2">{t("contact.officeHours")}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>{t("contact.monday")}</p>
                    <p>{t("contact.saturday")}</p>
                    <p>{t("contact.sunday")}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="min-w-0">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
