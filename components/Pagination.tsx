import Link from 'next/link';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

function pageHref(page: number, basePath: string) {
  return page === 1 ? `${basePath}/` : `${basePath}/page/${page}/`;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="mt-8 flex justify-between" aria-label="Pagination">
      <span>
        {currentPage > 1 ? (
          <Link className="inline-flex min-h-10 items-center rounded-lg border border-[var(--line)] bg-[var(--panel)] px-3.5 py-1.5 no-underline" href={pageHref(currentPage - 1, basePath)}>
            Newer
          </Link>
        ) : null}
      </span>
      <span>
        {currentPage < totalPages ? (
          <Link className="inline-flex min-h-10 items-center rounded-lg border border-[var(--line)] bg-[var(--panel)] px-3.5 py-1.5 no-underline" href={pageHref(currentPage + 1, basePath)}>
            Older
          </Link>
        ) : null}
      </span>
    </nav>
  );
}
