import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Pagination } from '@/components/Pagination';
import { PostList } from '@/components/PostList';
import { getAllWriting, paginateWriting, totalWritingPages } from '@/lib/writing';

export const dynamicParams = false;

export function generateStaticParams() {
  const pages = totalWritingPages(getAllWriting());
  return Array.from({ length: Math.max(0, pages - 1) }, (_, index) => ({
    page: String(index + 2),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `Writing page ${page}`,
    alternates: {
      canonical: `/writing/page/${page}/`,
    },
  };
}

export default async function WritingPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const currentPage = Number(page);
  const writing = getAllWriting();
  const pages = totalWritingPages(writing);

  if (!Number.isInteger(currentPage) || currentPage < 2 || currentPage > pages) {
    notFound();
  }

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Writing</p>
        <h1>문제 해결 기록</h1>
        <p className="lead">기술 자체보다 어떤 문제를 왜 그렇게 풀었는지에 초점을 둡니다.</p>
      </section>
      <PostList posts={paginateWriting(writing, currentPage)} />
      <Pagination currentPage={currentPage} totalPages={pages} basePath="/writing" />
    </>
  );
}
