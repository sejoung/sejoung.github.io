'use client';

import { useEffect, useState } from 'react';
import { applyThemeMode, THEME_STORAGE_KEY, type ThemeMode } from '@/lib/theme';

const CYCLE: ThemeMode[] = ['system', 'light', 'dark'];

const LABELS: Record<ThemeMode, string> = {
  system: '테마: 시스템 설정',
  light: '테마: 라이트',
  dark: '테마: 다크',
};

function SystemIcon() {
  return (
    <svg aria-hidden fill="none" height="16" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" width="16">
      <rect height="13" rx="2" width="18" x="3" y="4" />
      <path d="M8 21h8M12 17v4" strokeLinecap="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg aria-hidden fill="none" height="16" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" width="16">
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden fill="none" height="16" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" width="16">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" strokeLinejoin="round" />
    </svg>
  );
}

const ICONS: Record<ThemeMode, () => React.JSX.Element> = {
  system: SystemIcon,
  light: SunIcon,
  dark: MoonIcon,
};

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('system');

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      setMode(stored);
    }
  }, []);

  const handleClick = () => {
    const next = CYCLE[(CYCLE.indexOf(mode) + 1) % CYCLE.length];
    setMode(next);
    applyThemeMode(next);
  };

  const Icon = ICONS[mode];

  return (
    <button
      aria-label={`${LABELS[mode]} (클릭하면 변경)`}
      className="theme-toggle"
      onClick={handleClick}
      title={LABELS[mode]}
      type="button"
    >
      <Icon />
    </button>
  );
}
