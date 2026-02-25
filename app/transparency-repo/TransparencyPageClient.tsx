"use client";

import { useTranslation } from "react-i18next";
import { FileText, Download, ExternalLink, Activity } from "lucide-react";
import type { TransparencyDocument } from "@/app/actions/transparency/get-documents";

const reportTypeKeys: Record<string, string> = {
  Impact: "typeImpact",
  Financial: "typeFinancial",
  Project: "typeProject",
  Governance: "typeGovernance",
};

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface TransparencyPageClientProps {
  documents: TransparencyDocument[];
}

export default function TransparencyPageClient({ documents }: TransparencyPageClientProps) {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            {t("transparency.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            {t("transparency.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <Activity size={24} />
              </div>
              <h3 className="text-2xl font-bold">{t("transparency.realTimeImpact")}</h3>
            </div>
            <p className="text-muted-foreground mb-6">{t("transparency.realTimeDesc")}</p>
            <button className="inline-flex items-center text-primary font-medium hover:underline">
              {t("transparency.viewLiveDashboard")} <ExternalLink size={16} className="ml-2" />
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <FileText size={24} />
              </div>
              <h3 className="text-2xl font-bold">{t("transparency.publicLedger")}</h3>
            </div>
            <p className="text-muted-foreground mb-6">{t("transparency.publicLedgerDesc")}</p>
            <button className="inline-flex items-center text-primary font-medium hover:underline">
              {t("transparency.accessPublicLedger")} <ExternalLink size={16} className="ml-2" />
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">{t("transparency.documentsReports")}</h2>
        <div className="space-y-4">
          {documents.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">
              No documents yet. Check back soon for our annual reports and financial statements.
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-4 mb-4 md:mb-0">
                  <div className="p-2 bg-muted rounded text-muted-foreground">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {doc.title}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1 flex-wrap">
                      <span>{doc.published_date ?? "—"}</span>
                      <span className="w-1 h-1 bg-border rounded-full"></span>
                      <span>{t(`transparency.${reportTypeKeys[doc.document_type] ?? doc.document_type}`)}</span>
                      <span className="w-1 h-1 bg-border rounded-full"></span>
                      <span>{formatFileSize(doc.file_size_bytes)}</span>
                    </div>
                  </div>
                </div>

                {doc.file_url && doc.file_url !== "#" ? (
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm font-medium"
                  >
                    <Download size={16} className="mr-2" />
                    {t("transparency.download")}
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-muted text-muted-foreground text-sm font-medium">
                    Coming soon
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
