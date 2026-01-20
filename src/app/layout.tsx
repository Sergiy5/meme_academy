// Root layout - delegates to [locale]/layout.tsx
// This file is required for Next.js but the actual layout logic is in [locale]/layout.tsx

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
