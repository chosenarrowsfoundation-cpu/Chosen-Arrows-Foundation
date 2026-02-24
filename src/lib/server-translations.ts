/**
 * Server-side translation lookup for SSR/hydration consistency.
 * Use these when rendering client components that need to match server output.
 */

import en from '@/i18n/locales/en.json'
import fr from '@/i18n/locales/fr.json'
import zh from '@/i18n/locales/zh.json'

const locales: Record<string, typeof en> = { en, fr, zh }

export type HeroLabels = {
  badge: string
  title: string
  subtitle: string
  cta: string
  ctaMentor: string
  childrenSupported: string
  activeMentors: string
  fundsRaised: string
  scroll: string
}

export function getHeroLabels(lang: string): HeroLabels {
  const l = locales[lang] || locales.en
  const common = (l as any).common || (en as any).common
  return {
    badge: (l as any).hero?.badge ?? (en as any).hero.badge,
    title: (l as any).hero?.title ?? (en as any).hero.title,
    subtitle: (l as any).hero?.subtitle ?? (en as any).hero.subtitle,
    cta: (l as any).hero?.cta ?? (en as any).hero.cta,
    ctaMentor: (l as any).hero?.ctaMentor ?? (en as any).hero.ctaMentor,
    childrenSupported: (l as any).hero?.childrenSupported ?? (en as any).hero.childrenSupported,
    activeMentors: (l as any).hero?.activeMentors ?? (en as any).hero.activeMentors,
    fundsRaised: (l as any).hero?.fundsRaised ?? (en as any).hero.fundsRaised,
    scroll: common?.scroll ?? 'Scroll',
  }
}
