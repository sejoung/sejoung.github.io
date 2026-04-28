import type { Metadata } from 'next';
import Link from 'next/link';
import { contactLinks } from '@/lib/about';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sejoung.github.io'),
  title: {
    default: 'sejoung kim | Systems and Production Pipelines',
    template: '%s | sejoung kim',
  },
  description: '백엔드/파이프라인 엔지니어 김세중의 작업 노트. 시스템 설계, 웹툰 제작 자동화, 운영 기록을 모았습니다.',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'sejoung.systems',
    url: 'https://sejoung.github.io',
    title: 'sejoung kim | Systems and Production Pipelines',
    description: '백엔드/파이프라인 엔지니어 김세중의 작업 노트. 시스템 설계, 웹툰 제작 자동화, 운영 기록을 모았습니다.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'sejoung kim | Systems and Production Pipelines',
    description: '백엔드/파이프라인 엔지니어 김세중의 작업 노트. 시스템 설계, 웹툰 제작 자동화, 운영 기록을 모았습니다.',
  },
  alternates: {
    types: {
      'application/rss+xml': '/rss2.xml',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-[#0b0f14] text-[#e7edf3]">
        <div className="min-h-screen">
          <header className="sticky top-0 z-10 border-b border-[#26313d] bg-[#0b0f14]/90 backdrop-blur-md">
            <div className="mx-auto flex min-h-16 w-[min(1180px,calc(100%_-_32px))] items-center justify-between gap-5 max-[760px]:flex-col max-[760px]:items-start max-[760px]:py-3.5">
              <Link className="font-extrabold no-underline" href="/">
                sejoung.systems
              </Link>
              <nav className="flex gap-4 text-sm text-[#93a1b2] max-[760px]:flex-wrap" aria-label="Main navigation">
                <Link href="/projects/">Projects</Link>
                <Link href="/writing/">Writing</Link>
                <Link href="/archives/">Archives</Link>
                <Link href="/about/">About</Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto w-[min(1180px,calc(100%_-_32px))] py-[52px] pb-[72px]">{children}</main>
          <footer className="mx-auto flex w-[min(1180px,calc(100%_-_32px))] flex-wrap items-center justify-between gap-3 border-t border-[#26313d] py-7 text-sm text-[#93a1b2]">
            <span>시스템과 파이프라인을 설계하고 기록합니다 · sejoung kim</span>
            <nav className="flex gap-3" aria-label="Contact links">
              {contactLinks.map((item) => (
                <a href={item.href} key={item.href} rel={item.external ? 'noreferrer' : undefined} target={item.external ? '_blank' : undefined}>
                  {item.label}
                </a>
              ))}
            </nav>
          </footer>
        </div>
      </body>
    </html>
  );
}
