'use client';

import { useEffect, useRef } from 'react';
import { commentsEnabled, giscusConfig } from '@/lib/comments';
import { effectiveTheme, THEME_CHANGE_EVENT } from '@/lib/theme';

function giscusTheme() {
  return effectiveTheme() === 'light' ? 'light' : 'transparent_dark';
}

export function Comments() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!commentsEnabled || !containerRef.current) {
      return;
    }

    if (!containerRef.current.hasChildNodes()) {
      const script = document.createElement('script');
      script.src = 'https://giscus.app/client.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.setAttribute('data-repo', giscusConfig.repo);
      script.setAttribute('data-repo-id', giscusConfig.repoId);
      script.setAttribute('data-category', giscusConfig.category);
      script.setAttribute('data-category-id', giscusConfig.categoryId);
      script.setAttribute('data-mapping', 'pathname');
      script.setAttribute('data-strict', '0');
      script.setAttribute('data-reactions-enabled', '1');
      script.setAttribute('data-emit-metadata', '0');
      script.setAttribute('data-input-position', 'top');
      script.setAttribute('data-theme', giscusTheme());
      script.setAttribute('data-lang', 'ko');
      script.setAttribute('data-loading', 'lazy');
      containerRef.current.appendChild(script);
    }

    const syncTheme = () => {
      const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
      iframe?.contentWindow?.postMessage(
        { giscus: { setConfig: { theme: giscusTheme() } } },
        'https://giscus.app',
      );
    };

    const media = window.matchMedia('(prefers-color-scheme: light)');
    window.addEventListener(THEME_CHANGE_EVENT, syncTheme);
    media.addEventListener('change', syncTheme);

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, syncTheme);
      media.removeEventListener('change', syncTheme);
    };
  }, []);

  if (!commentsEnabled) {
    return null;
  }

  return <div className="comments" ref={containerRef} />;
}
