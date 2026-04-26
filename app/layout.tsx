import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sejoung.github.io'),
  title: {
    default: '폭간의 기술블로그',
    template: '%s | 폭간의 기술블로그',
  },
  description: 'Java, Kotlin 등 백엔드 개발 기술과 소프트웨어 엔지니어링 학습 내용을 정리하는 기술 블로그입니다.',
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
                폭간의 기술블로그
              </Link>
              <nav className="nav" aria-label="Main navigation">
                <Link href="/archives/">Archives</Link>
                <Link href="/categories/">Categories</Link>
                <Link href="/tags/">Tags</Link>
                <Link href="/about/">About</Link>
              </nav>
            </div>
          </header>
          <main className="main">{children}</main>
          <footer className="site-footer">© sejoung kim</footer>
        </div>
      </body>
    </html>
  );
}
