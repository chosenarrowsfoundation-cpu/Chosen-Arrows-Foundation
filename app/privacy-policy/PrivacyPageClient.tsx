"use client";

import { useTranslation } from "react-i18next";

export default function PrivacyPageClient() {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === "fr" ? "fr-FR" : i18n.language === "zh" ? "zh-CN" : "en-US";

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">
          {t("privacy.title")}
        </h1>
        <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
          <p className="lead">{t("privacy.lead")}</p>
          <h2>{t("privacy.collectTitle")}</h2>
          <p>{t("privacy.collectIntro")}</p>
          <ul>
            <li>{t("privacy.collect1")}</li>
            <li>{t("privacy.collect2")}</li>
            <li>{t("privacy.collect3")}</li>
            <li>{t("privacy.collect4")}</li>
          </ul>
          <h2>{t("privacy.useTitle")}</h2>
          <p>{t("privacy.useIntro")}</p>
          <ul>
            <li>{t("privacy.use1")}</li>
            <li>{t("privacy.use2")}</li>
            <li>{t("privacy.use3")}</li>
            <li>{t("privacy.use4")}</li>
          </ul>
          <h2>{t("privacy.protectionTitle")}</h2>
          <p>{t("privacy.protection")}</p>
          <h2>{t("privacy.cookiesTitle")}</h2>
          <p>{t("privacy.cookies")}</p>
          <h2>{t("privacy.rightsTitle")}</h2>
          <p>{t("privacy.rights")}</p>
          <h2>{t("privacy.updatesTitle")}</h2>
          <p>{t("privacy.updates")}</p>
          <p className="mt-8 text-sm">
            {t("privacy.lastUpdated")}: {new Date().toLocaleDateString(dateLocale)}
          </p>
        </div>
      </div>
    </div>
  );
}
