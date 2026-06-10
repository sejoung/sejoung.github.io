'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/projects/', label: 'Projects' },
  { href: '/writing/', label: 'Writing' },
  { href: '/archives/', label: 'Archives' },
  { href: '/about/', label: 'About' },
];

function isActive(pathname: string, href: string) {
  if (pathname.startsWith(href)) {
    return true;
  }
  // 포스트 상세(/YYYY/MM/slug/)는 Writing 섹션으로 취급
  return href === '/writing/' && /^\/\d{4}\//.test(pathname);
}

export function HeaderNav() {
  const pathname = usePathname() ?? '';

  return (
    <nav
      className="main-nav flex gap-4 text-sm text-[var(--muted)] max-[760px]:order-3 max-[760px]:basis-full max-[760px]:flex-wrap"
      aria-label="Main navigation"
    >
      {items.map((item) => (
        <Link
          aria-current={isActive(pathname, item.href) ? 'page' : undefined}
          href={item.href}
          key={item.href}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
