"use client";

import { Facebook, X, Instagram, Linkedin, Mail } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import logo from "@/assets/logo.jpg";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const Footer = () => {
  const { t } = useTranslation();
  const [contactInfo, setContactInfo] = useState<{ email?: string; emails?: string[]; phone?: string; address?: string } | null>(null);
  const [socialLinks, setSocialLinks] = useState<{ facebook?: string; twitter?: string; instagram?: string; linkedin?: string } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const supabase = createClient();
        const [contactResult, socialResult] = await Promise.all([
          supabase.from('site_settings').select('setting_value').eq('setting_key', 'contact_info').single(),
          supabase.from('site_settings').select('setting_value').eq('setting_key', 'social_links').single(),
        ]);

        if (contactResult.data) setContactInfo(contactResult.data.setting_value);
        if (socialResult.data) setSocialLinks(socialResult.data.setting_value);
      } catch (error) {
        console.error('Error fetching footer settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const quickLinks = [
    { href: "/#mission", label: t("footer.ourMission") },
    { href: "/#campaigns", label: t("footer.activeCampaigns") },
    { href: "/#impact", label: t("footer.ourImpact") },
    { href: "/#community", label: t("footer.community") },
  ];

  const getInvolved = [
    { href: "/donate", label: t("footer.donate") },
    { href: "/mentorship", label: t("footer.becomeMentor") },
    { href: "/donate", label: t("footer.sponsorChild") },
    { href: "/contact", label: t("footer.partner") },
  ];

  const socialLinksArray = [
    { icon: Facebook, href: socialLinks?.facebook || "#", label: "Facebook" },
    { icon: X, href: socialLinks?.twitter || "https://x.com/ChosenArrows", label: "X" },
    { icon: Instagram, href: socialLinks?.instagram || "#", label: "Instagram" },
    { icon: Linkedin, href: socialLinks?.linkedin || "https://www.linkedin.com/company/chosen-arrows-foundation", label: "LinkedIn" },
  ];

  const email = contactInfo?.email || contactInfo?.emails?.[0] || "chosenarrowsfoundation@gmail.com";

  return (
    <footer className="bg-gradient-to-b from-white to-mint-50/30 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-slate-900 dark:via-[#11111b] dark:to-black border-t border-mint-200/50 dark:border-white/5">
      <div className="enterprise-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src={logo}
                alt="Chosen Arrows Foundation Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain rounded"
              />
              <span className="text-base font-semibold text-foreground">
                Chosen Arrows
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {t("footer.tagline")}
            </p>
            <div className="flex gap-2">
              {socialLinksArray.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-mint-100 hover:bg-taffy-100 flex items-center justify-center text-mint-600 hover:text-taffy-500 transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              {t("footer.getInvolved")}
            </h4>
            <ul className="space-y-2.5">
              {getInvolved.map((link, index) => (
                <li key={`${link.href}-${index}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-foreground mb-4">
              {t("footer.contactUs")}
            </h4>
            <ul className="space-y-3">
              <li className="min-w-0 overflow-hidden">
                <a
                  href={`mailto:${email}`}
                  className="grid grid-cols-[auto_minmax(0,1fr)] gap-2 items-center text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="break-all min-w-0">{email}</span>
                </a>
              </li>
              <li className="text-sm text-muted-foreground leading-relaxed">
                {t("footer.contactMessage")}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 Chosen Arrows Foundation. {t("footer.rights")}.</p>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="hover:text-foreground transition-colors duration-150">
                {t("footer.privacy")}
              </Link>
              <Link href="/terms-of-service" className="hover:text-foreground transition-colors duration-150">
                {t("footer.terms")}
              </Link>
              <Link href="/transparency-repo" className="hover:text-foreground transition-colors duration-150">
                {t("footer.transparency")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
