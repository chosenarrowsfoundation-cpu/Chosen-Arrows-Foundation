"use client";

import { useTranslation } from "react-i18next";

export default function TermsPageClient() {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === "fr" ? "fr-FR" : i18n.language === "zh" ? "zh-CN" : "en-US";

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">
          {t("terms.title")}
        </h1>
        <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
          <p className="lead">{t("terms.lead")}</p>
          <h2>{t("terms.acceptanceTitle")}</h2>
          <p>{t("terms.acceptance")}</p>
          <h2>{t("terms.contentTitle")}</h2>
          <p>{t("terms.content")}</p>
          <h2>{t("terms.donationsTitle")}</h2>
          <p>{t("terms.donations")}</p>
          <h2>{t("terms.conductTitle")}</h2>
          <p>{t("terms.conduct")}</p>
          <h2>{t("terms.linksTitle")}</h2>
          <p>{t("terms.links")}</p>
          <h2>{t("terms.liabilityTitle")}</h2>
          <p>{t("terms.liability")}</p>
          <h2>{t("terms.governingTitle")}</h2>
          <p>{t("terms.governing")}</p>
          <h2>{t("terms.contactTitle")}</h2>
          <p>{t("terms.contact")}</p>
          <p className="mt-8 text-sm">
            {t("terms.lastUpdated")}: {new Date().toLocaleDateString(dateLocale)}
          </p>
        </div>
      </div>
    </div>
  );
}
