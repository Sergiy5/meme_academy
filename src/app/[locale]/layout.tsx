import '../styles/globals.css';
import localFont from 'next/font/local';
import { ThemeProvider } from '@/context/ThemeContext';
import { Open_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Locale } from '@/i18n/config';

export const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-family',
});

const fixelDisplay = localFont({
  src: [
    {
      path: '../../../public/fonts/fixelDisplay-semiBold.woff2',
      weight: '600',
    },
    {
      path: '../../../public/fonts/fixelDisplay-medium.woff2',
      weight: '500',
    },
  ],
  variable: '--font-secondary',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for this locale
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${openSans.variable} ${fixelDisplay.variable} dark`}
      data-theme="dark"
    >
      <body className={`${openSans.className} font-sans antialiased dark:bg-gray-900`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
