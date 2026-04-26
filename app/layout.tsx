import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sejoung.github.io'),
  title: {
    default: 'sejoung kim | System Archive',
    template: '%s | sejoung kim',
  },
  description: '제작 과정을 시스템으로 바꾸는 백엔드 엔지니어의 문제 해결 아카이브입니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <div className="site-header-inner">
              <Link className="brand" href="/">
                sejoung.systems
              </Link>
              <nav className="nav" aria-label="Main navigation">
                <Link href="/projects/">Projects</Link>
                <Link href="/writing/">Writing</Link>
                <Link href="/about/">About</Link>
              </nav>
            </div>
          </header>
          <main className="main">{children}</main>
          <footer className="site-footer">제작 과정을 시스템으로 바꾸는 엔지니어 · sejoung kim</footer>
        </div>
      </body>
    </html>
  );
}
