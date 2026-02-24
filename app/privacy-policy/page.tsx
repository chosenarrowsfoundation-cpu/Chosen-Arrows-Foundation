import type { Metadata } from "next";
import PrivacyPageClient from "./PrivacyPageClient";

export const metadata: Metadata = {
    title: "Privacy Policy | Chosen Arrows Foundation",
    description: "Learn how Chosen Arrows Foundation collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
    return <PrivacyPageClient />;
}
