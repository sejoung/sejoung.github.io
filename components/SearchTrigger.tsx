'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type PagefindRawResult = {
  id: string;
  data: () => Promise<{
    url: string;
    excerpt: string;
    meta?: { title?: string };
  }>;
};

type Pagefind = {
  search: (query: string) => Promise<{ results: PagefindRawResult[] }>;
  preload?: (query: string) => Promise<void>;
  init?: () => Promise<void>;
};

type Hit = {
  url: string;
  title: string;
  excerpt: string;
};

let pagefindPromise: Promise<Pagefind | null> | null = null;

function loadPagefind(): Promise<Pagefind | null> {
  if (pagefindPromise) {
    return pagefindPromise;
  }

  pagefindPromise = (async () => {
    try {
      const url = `${window.location.origin}/pagefind/pagefind.js`;
      const mod = (await new Function('u', 'return import(u)')(url)) as Pagefind;
      await mod.init?.();
      return mod;
    } catch (err) {
      console.warn('Pagefind unavailable', err);
      return null;
    }
  })();

  return pagefindPromise;
}

export function SearchTrigger() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Hit[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setResults([]);
    setStatus('idle');
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const isMod = event.metaKey || event.ctrlKey;
      if (isMod && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((prev) => !prev);
        return;
      }

      if (event.key === '/' && !open) {
        const target = event.target as HTMLElement | null;
        if (target) {
          const tag = target.tagName;
          if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) {
            return;
          }
        }
        event.preventDefault();
        setOpen(true);
        return;
      }

      if (event.key === 'Escape' && open) {
        event.preventDefault();
        close();
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 0);

    void loadPagefind();

    return () => {
      html.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setStatus('idle');
      return;
    }

    setStatus('loading');
    const requestId = ++requestIdRef.current;

    debounceRef.current = setTimeout(async () => {
      const pagefind = await loadPagefind();
      if (requestId !== requestIdRef.current) {
        return;
      }
      if (!pagefind) {
        setStatus('error');
        return;
      }

      try {
        const search = await pagefind.search(trimmed);
        if (requestId !== requestIdRef.current) {
          return;
        }
        const hits = await Promise.all(
          search.results.slice(0, 10).map(async (result) => {
            const data = await result.data();
            return {
              url: data.url,
              title: data.meta?.title ?? data.url,
              excerpt: data.excerpt,
            } satisfies Hit;
          }),
        );
        if (requestId !== requestIdRef.current) {
          return;
        }
        setResults(hits);
        setActiveIndex(0);
        setStatus('idle');
      } catch (err) {
        console.error('Pagefind search failed', err);
        if (requestId === requestIdRef.current) {
          setStatus('error');
        }
      }
    }, 140);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, open]);

  const navigateToActive = useCallback(() => {
    const hit = results[activeIndex];
    if (!hit) {
      return;
    }
    close();
    window.location.href = hit.url;
  }, [results, activeIndex, close]);

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => (results.length ? (prev + 1) % results.length : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => (results.length ? (prev - 1 + results.length) % results.length : 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      navigateToActive();
    }
  };

  const overlay = open ? (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search">
      <button
        type="button"
        className="search-overlay-backdrop"
        aria-label="Close search"
        onClick={close}
        tabIndex={-1}
      />
      <div className="search-modal">
        <div className="search-modal-input-row">
          <SearchIcon className="search-modal-input-icon" />
          <input
            ref={inputRef}
            type="search"
            placeholder="포스트와 프로젝트를 검색하세요"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onInputKeyDown}
            className="search-modal-input"
            autoComplete="off"
            spellCheck={false}
            aria-label="Search query"
            enterKeyHint="search"
          />
          <button type="button" onClick={close} className="search-modal-close" aria-label="Close search">
            ESC
          </button>
        </div>
        <div className="search-modal-results">
          {status === 'error' ? (
            <p className="search-modal-empty">검색 인덱스를 불러올 수 없습니다. 빌드 후 다시 시도해주세요.</p>
          ) : status === 'loading' ? (
            <p className="search-modal-empty">검색 중…</p>
          ) : !query.trim() ? (
            <p className="search-modal-empty">포스트 본문과 프로젝트를 검색합니다.</p>
          ) : results.length === 0 ? (
            <p className="search-modal-empty">결과가 없습니다.</p>
          ) : (
            <ul className="search-modal-list" role="listbox">
              {results.map((hit, index) => (
                <li key={hit.url}>
                  <a
                    href={hit.url}
                    onClick={close}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`search-modal-hit${index === activeIndex ? ' is-active' : ''}`}
                    role="option"
                    aria-selected={index === activeIndex}
                  >
                    <span className="search-modal-hit-title">{hit.title}</span>
                    <span
                      className="search-modal-hit-excerpt"
                      dangerouslySetInnerHTML={{ __html: hit.excerpt }}
                    />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button type="button" aria-label="Search" className="search-trigger" onClick={() => setOpen(true)}>
        <SearchIcon />
        <span className="search-trigger-label">Search</span>
        <kbd className="search-trigger-kbd">⌘K</kbd>
      </button>
      {mounted && overlay ? createPortal(overlay, document.body) : null}
    </>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
