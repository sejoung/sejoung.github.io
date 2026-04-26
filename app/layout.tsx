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
                <Link href="/about/">About</Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto w-[min(1180px,calc(100%_-_32px))] py-[52px] pb-[72px]">{children}</main>
          <footer className="mx-auto w-[min(1180px,calc(100%_-_32px))] border-t border-[#26313d] py-7 text-sm text-[#93a1b2]">
            제작 과정을 시스템으로 바꾸는 엔지니어 · sejoung kim
          </footer>
        </div>
      </body>
    </html>
  );
}
