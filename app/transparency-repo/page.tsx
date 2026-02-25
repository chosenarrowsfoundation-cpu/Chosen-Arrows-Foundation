import type { Metadata } from "next";
import TransparencyPageClient from "./TransparencyPageClient";
import { getPublishedDocuments } from "@/app/actions/transparency/get-documents";

export const metadata: Metadata = {
    title: "Transparency Repository | Chosen Arrows Foundation",
    description: "Access our financial reports, impact assessments, and governance documents. We believe in complete transparency.",
};

export default async function TransparencyRepoPage() {
    const documents = await getPublishedDocuments();
    return <TransparencyPageClient documents={documents} />;
}
