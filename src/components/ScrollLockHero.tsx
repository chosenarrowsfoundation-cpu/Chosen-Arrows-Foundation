"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, ChevronDown } from "lucide-react";
import Link from "next/link";
import type { HeroLabels } from "@/lib/server-translations";

type HeroContent = {
  badge?: string;
  title?: string;
  subtitle?: string;
  cta?: string;
  ctaMentor?: string;
  stats?: {
    childrenSupported?: number | string;
    activeMentors?: number | string;
    fundsRaised?: number | string;
  };
};

const formatStat = (value: number | string | undefined, fallback: string) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "number") return value.toLocaleString();
  const asNumber = Number(value);
  return Number.isFinite(asNumber) ? asNumber.toLocaleString() : value;
};

const formatCurrency = (value: number | string | undefined, fallback: string) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "string" && value.trim().startsWith("$")) return value;
  const asNumber = typeof value === "number" ? value : Number(value);
  return Number.isFinite(asNumber) ? `$${asNumber.toLocaleString()}` : String(value);
};

const DEFAULT_VIDEO_URL = 'https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4'
const DEFAULT_POSTER = '/hero-poster.jpg'

const ScrollLockHero = ({
  content,
  labels,
  videoUrl,
  posterUrl,
}: {
  content?: HeroContent
  labels?: HeroLabels
  videoUrl?: string | null
  posterUrl?: string | null
}) => {
  // Use server-provided labels to prevent hydration mismatch (server/client language can differ on first paint)
  const badge = content?.badge ?? labels?.badge ?? "Empowering Children, Shaping Destinies";
  const title = content?.title ?? labels?.title ?? "Every Child is an Arrow in the Hand of God";
  const subtitle = content?.subtitle ?? labels?.subtitle ?? "We guide children toward their ordained destinies through mentorship, education, and transparent support — planting seeds of hope that will light up the world.";
  const cta = content?.cta ?? labels?.cta ?? "Start Giving Hope";
  const ctaMentor = content?.ctaMentor ?? labels?.ctaMentor ?? "Become a Mentor";
  const childrenSupportedLabel = labels?.childrenSupported ?? "Children Supported";
  const activeMentorsLabel = labels?.activeMentors ?? "Active Mentors";
  const fundsRaisedLabel = labels?.fundsRaised ?? "Funds Raised";
  const scrollLabel = labels?.scroll ?? "Scroll";
  const [isLocked, setIsLocked] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const scrollAccumulator = useRef(0);
  const lastScrollY = useRef(0);
  const SCROLL_THRESHOLD = 150; // Amount of scroll needed to unlock

  // Scroll to next section
  const scrollToContent = useCallback(() => {
    setIsLocked(false);
    document.getElementById("mission")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Handle wheel events for scroll lock (only blocks downward scroll when locked)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Only lock when at top of page and scrolling down
      if (!isLocked || window.scrollY > 10) {
        setIsLocked(false);
        return;
      }

      // Allow scrolling up freely
      if (e.deltaY < 0) {
        return;
      }

      // Accumulate downward scroll
      scrollAccumulator.current += e.deltaY;

      // If threshold reached, unlock and scroll to content
      if (scrollAccumulator.current >= SCROLL_THRESHOLD) {
        setIsLocked(false);
        scrollToContent();
      } else {
        // Block the scroll while accumulating
        e.preventDefault();
      }
    };

    // Handle touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      lastScrollY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isLocked || window.scrollY > 10) {
        setIsLocked(false);
        return;
      }

      const currentY = e.touches[0].clientY;
      const deltaY = lastScrollY.current - currentY; // Positive = scrolling down

      // Allow scrolling up freely
      if (deltaY < 0) {
        return;
      }

      // Accumulate downward scroll
      scrollAccumulator.current += deltaY;
      lastScrollY.current = currentY;

      // If threshold reached, unlock and scroll to content
      if (scrollAccumulator.current >= SCROLL_THRESHOLD) {
        setIsLocked(false);
        scrollToContent();
      } else {
        // Block the scroll while accumulating
        e.preventDefault();
      }
    };

    // Track scroll position for visual state
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      setHasScrolled(scrolled);
      
      // If user has scrolled past hero, they've unlocked
      if (window.scrollY > 10) {
        setIsLocked(false);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLocked, scrollToContent]);

  // Reset lock when returning to top
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        // Reset accumulator when at top
        scrollAccumulator.current = 0;
        // Re-lock after a short delay to allow for intentional scroll up
        setTimeout(() => {
          if (window.scrollY === 0) {
            setIsLocked(true);
          }
        }, 500);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative h-screen min-h-[600px] max-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster={posterUrl || DEFAULT_POSTER}
        >
          <source
            src={videoUrl?.trim() || DEFAULT_VIDEO_URL}
            type={(videoUrl?.trim() || DEFAULT_VIDEO_URL).toLowerCase().endsWith('.webm') ? 'video/webm' : 'video/mp4'}
          />
        </video>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-foreground/60" />
      </div>

      {/* Content - Optimized for mobile to fit everything on screen */}
      <div className="relative z-10 enterprise-container h-full flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center flex flex-col">
          {/* Badge - Smaller on mobile */}
          <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 mb-3 md:mb-6 text-[10px] md:text-xs font-medium text-white bg-taffy-400/20 backdrop-blur-sm rounded-full border border-taffy-400/30 self-center">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-taffy-400 rounded-full animate-pulse" />
            <span>{badge}</span>
          </div>

          {/* Main Heading - Smaller on mobile */}
          <h1 className="mb-3 md:mb-6 text-balance text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            <span>{title}</span>
          </h1>

          {/* Subheading - Condensed on mobile */}
          <p className="mb-5 md:mb-8 text-sm md:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed px-2">
            {subtitle}
          </p>

          {/* CTA Buttons - Smaller on mobile */}
          <div className="flex flex-row items-center justify-center gap-2 md:gap-4 mb-6 md:mb-10">
            <Link href="/donate">
              <Button
                size="sm"
                variant="gradient"
                className="px-4 md:px-8 text-xs md:text-sm rounded-full h-9 md:h-11"
              >
                {cta}
                <ArrowRight className="ml-1.5 md:ml-2 w-3 h-3 md:w-4 md:h-4" />
              </Button>
            </Link>
            <Link href="/mentorship">
              <Button
                size="sm"
                variant="outline-light"
                className="px-4 md:px-8 text-xs md:text-sm rounded-full border-mint-300/50 bg-mint-300/10 hover:bg-mint-300/20 hover:border-mint-300/70 h-9 md:h-11"
              >
                <Users className="mr-1.5 md:mr-2 w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">{ctaMentor}</span>
                <span className="sm:hidden">Mentor</span>
              </Button>
            </Link>
          </div>

          {/* Stats Grid - Compact on mobile */}
          <div className="grid grid-cols-3 gap-3 md:gap-8 pt-4 md:pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-taffy-300 tabular-nums">
                {formatStat(content?.stats?.childrenSupported, "45")}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-white/70 font-medium mt-0.5 md:mt-1 leading-tight">
                {childrenSupportedLabel}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-mint-300 tabular-nums">
                {formatStat(content?.stats?.activeMentors, "8")}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-white/70 font-medium mt-0.5 md:mt-1 leading-tight">
                {activeMentorsLabel}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tabular-nums">
                {formatCurrency(content?.stats?.fundsRaised, "$15K")}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-white/70 font-medium mt-0.5 md:mt-1 leading-tight">
                {fundsRaisedLabel}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade - Smaller on mobile */}
      <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-background via-background/70 to-transparent z-10" />

      {/* Scroll Down Indicator - Click to smooth scroll */}
      <button
        onClick={scrollToContent}
        className={`absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-0.5 md:gap-1.5 transition-all duration-300 cursor-pointer group ${
          hasScrolled 
            ? "text-foreground/40 scale-90" 
            : "text-foreground/80 hover:text-foreground scale-100"
        }`}
        aria-label={scrollLabel}
      >
        <span className={`text-[8px] md:text-xs font-medium tracking-wider uppercase transition-opacity ${
          hasScrolled ? "opacity-50" : "opacity-100"
        }`}>
          {scrollLabel}
        </span>
        <div className={`relative w-4 h-6 md:w-6 md:h-9 rounded-full border-2 border-current flex items-start justify-center p-0.5 md:p-1 transition-all ${
          isLocked && !hasScrolled ? "animate-pulse-subtle" : ""
        }`}>
          <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-current rounded-full animate-scroll-down" />
        </div>
        <ChevronDown className={`w-3 h-3 md:w-5 md:h-5 -mt-0.5 ${
          isLocked && !hasScrolled ? "animate-bounce-subtle" : ""
        }`} />
      </button>
    </section>
  );
};

export default ScrollLockHero;
