import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Khoj — Free Search Engine',
  description: 'A free, open search engine powered by Wikipedia, Open-Meteo, CoinGecko, arXiv, GitHub and more. No login required.',
  keywords: ['search engine', 'free search', 'wikipedia', 'khoj', 'knowledge'],
  openGraph: {
    title: 'Khoj — Free Search Engine',
    description: 'Free, open search engine with instant answers, weather, crypto, dictionary and more.',
    type: 'website',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#6366f1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('khoj-theme');
                const p = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                document.documentElement.classList.toggle('dark', (t ?? p) === 'dark');
              } catch {}
            `,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
