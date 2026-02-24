import type { Metadata } from "next";
import TermsPageClient from "./TermsPageClient";

export const metadata: Metadata = {
    title: "Terms of Service | Chosen Arrows Foundation",
    description: "Terms and conditions for using the Chosen Arrows Foundation website and services.",
};

export default function TermsOfServicePage() {
    return <TermsPageClient />;
}
