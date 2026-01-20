'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { locales, localeNames, Locale } from '@/i18n/config';
import { useTransition, useState } from 'react';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (newLocale: Locale) => {
    setIsOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-game-card border border-game-border hover:border-game-neon/50 transition-colors text-sm"
      >
        <span className="text-lg">{getFlag(locale)}</span>
        <span className="text-game-text-dim">{locale.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 text-game-text-dim transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 py-2 bg-game-card border border-game-border rounded-lg shadow-lg z-50 min-w-[140px]">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleChange(loc)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-game-neon/10 transition-colors ${
                loc === locale ? 'text-game-neon' : 'text-white'
              }`}
            >
              <span className="text-lg">{getFlag(loc)}</span>
              <span>{localeNames[loc]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function getFlag(locale: Locale): string {
  const flags: Record<Locale, string> = {
    en: '🇬🇧',
    uk: '🇺🇦',
    pl: '🇵🇱',
  };
  return flags[locale];
}
