import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Nunito_Sans, Figtree } from 'next/font/google';
import { Sparkles, Shirt } from 'lucide-react';

import './globals.css';

const nunitosans = Nunito_Sans({
  subsets: ['latin'], weight: ['400', '600', '700', '900'],
  variable: '--font-nunito', display: 'swap',
});

const figtree = Figtree({
  subsets: ['latin'], weight: ['400', '500', '600', '700'],
  variable: '--font-figtree', display: 'swap',
});

export const metadata: Metadata = {
  title: 'Laundry Optimizer — Clean, Fast, Nearby',
  description: 'Find laundry with real-time capacity & book instantly in Jakarta.',
};

const navItems = [
  { href: '/', label: 'Browse' },
  { href: '/status', label: 'My Status' },
];

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${nunitosans.variable} ${figtree.variable}`}>
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
          <header className="mb-8 flex items-center justify-between rounded-2xl border border-[#EEF2F5] bg-white px-5 py-3 shadow-sm">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B8D4E3] text-white">
                <Sparkles size={18} />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-[#1A1F24]" style={{ fontFamily: "var(--font-nunito)" }}>
                  Laundry<span style={{ color: "#7BA989" }}>Optimizer</span>
                </h1>
                <p className="text-[10px] text-[#A3B0BC] uppercase tracking-[0.12em]">Clean · Fast · Nearby</p>
              </div>
            </Link>
            <nav className="flex items-center gap-1.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-[#6B7B8A] transition-all hover:bg-[#F0F5F8] hover:text-[#1A1F24]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
