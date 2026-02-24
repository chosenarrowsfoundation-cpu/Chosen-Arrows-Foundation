"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import logo from "@/assets/logo.jpg";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const navLinks = [
    { href: "/about", label: t("nav.about") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/campaigns", label: t("nav.campaigns") },
    { href: "/mentorship", label: t("nav.mentorship") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="enterprise-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={logo}
              alt="Chosen Arrows Foundation Logo"
              width={36}
              height={36}
              priority
              className="w-9 h-9 object-contain rounded"
            />
            <span className="text-lg font-semibold text-foreground">
              Chosen Arrows
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <LanguageSwitcher />
            <Link href="/donate">
              <Button
                size="sm"
                variant="gradient"
                className="px-5 rounded-full"
              >
                {t("nav.donate")}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors duration-150"
            aria-label={t("common.toggleMenu")}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-2.5 px-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors duration-150"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="py-2.5 px-3 flex items-center gap-4">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
              <div className="pt-4 mt-2 border-t border-border">
                <Link href="/donate" onClick={() => setIsOpen(false)}>
                  <Button variant="gradient" className="w-full rounded-full">
                    {t("nav.donate")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
