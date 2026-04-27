import type { Metadata } from 'next';
import { Pagination } from '@/components/Pagination';
import { PostList } from '@/components/PostList';
import { getAllWriting, paginateWriting, totalWritingPages } from '@/lib/writing';

export const metadata: Metadata = {
  title: 'Writing',
  description: '기술 자체보다 어떤 문제를 왜 그렇게 풀었는지에 초점을 둔 작업 노트입니다.',
  alternates: {
    canonical: '/writing/',
  },
};

export default function WritingPage() {
  const writing = getAllWriting();

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Writing</p>
        <h1>작업 노트</h1>
        <p className="lead">기술 자체보다 어떤 문제를 왜 그렇게 풀었는지에 초점을 둡니다.</p>
      </section>
      <PostList posts={paginateWriting(writing, 1)} />
      <Pagination currentPage={1} totalPages={totalWritingPages(writing)} basePath="/writing" />
    </>
  );
}
