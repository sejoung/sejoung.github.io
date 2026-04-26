import Link from 'next/link';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath?: string;
};

function pageHref(page: number, basePath = '') {
  if (basePath) {
    return page === 1 ? `${basePath}/` : `${basePath}/page/${page}/`;
  }

  return page === 1 ? '/' : `/page/${page}/`;
}

export function Pagination({ currentPage, totalPages, basePath = '' }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <span>
        {currentPage > 1 ? (
          <Link className="button" href={pageHref(currentPage - 1, basePath)}>
            Newer
          </Link>
        ) : null}
      </span>
      <span>
        {currentPage < totalPages ? (
          <Link className="button" href={pageHref(currentPage + 1, basePath)}>
            Older
          </Link>
        ) : null}
      </span>
    </nav>
  );
}
