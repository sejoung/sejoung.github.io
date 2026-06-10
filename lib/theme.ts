export type ThemeMode = 'system' | 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';
export const THEME_CHANGE_EVENT = 'theme-change';

const THEME_COLORS = { dark: '#0b0f14', light: '#f7f9fb' } as const;

export function effectiveTheme(): 'light' | 'dark' {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === 'light' || explicit === 'dark') {
    return explicit;
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function applyThemeMode(mode: ThemeMode) {
  if (mode === 'system') {
    localStorage.removeItem(THEME_STORAGE_KEY);
    delete document.documentElement.dataset.theme;
  } else {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
    document.documentElement.dataset.theme = mode;
  }

  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    const resolved =
      mode === 'system'
        ? (meta.getAttribute('media')?.includes('dark') ? 'dark' : 'light')
        : mode;
    meta.setAttribute('content', THEME_COLORS[resolved]);
  });

  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

// hydration 전에 실행되어 라이트/다크 깜빡임(FOUC)을 막는 인라인 스크립트.
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;
