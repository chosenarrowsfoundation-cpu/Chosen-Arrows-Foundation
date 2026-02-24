import type { Metadata } from "next";
import TransparencyPageClient from "./TransparencyPageClient";

export const metadata: Metadata = {
    title: "Transparency Repository | Chosen Arrows Foundation",
    description: "Access our financial reports, impact assessments, and governance documents. We believe in complete transparency.",
};

export default function TransparencyRepoPage() {
    return <TransparencyPageClient />;
}
