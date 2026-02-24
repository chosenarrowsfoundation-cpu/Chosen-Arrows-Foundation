import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import LayoutWrapper from "@/components/LayoutWrapper";
import { getServerLanguage } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://chosen-arrows-foundation-six.vercel.app"),
  title: {
    default: "Chosen Arrows Foundation",
    template: "%s | Chosen Arrows Foundation",
  },
  description: "Empowering children and communities through education and mentorship. Guide children toward their divine destiny with holistic care, education, and mentorship.",
  keywords: ["children", "education", "mentorship", "charity", "foundation", "community", "nonprofit"],
  authors: [{ name: "Chosen Arrows Foundation" }],
  creator: "Chosen Arrows Foundation",
  publisher: "Chosen Arrows Foundation",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://chosen-arrows-foundation-six.vercel.app",
    siteName: "Chosen Arrows Foundation",
    title: "Chosen Arrows Foundation",
    description: "Empowering children and communities through education and mentorship",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chosen Arrows Foundation",
    description: "Empowering children and communities through education and mentorship",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = await getServerLanguage();

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className="antialiased">
        <Providers lang={lang}>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
