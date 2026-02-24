import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us | Chosen Arrows Foundation",
  description: "Get in touch with Chosen Arrows Foundation. Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
  keywords: ["contact", "get in touch", "email", "phone", "support"],
  openGraph: {
    title: "Contact Us | Chosen Arrows Foundation",
    description: "Get in touch with us - we'd love to hear from you",
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
