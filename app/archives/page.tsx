import type { Metadata } from 'next';
import { PostList } from '@/components/PostList';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Archives',
  description: '전체 작업 노트를 최신순으로 한 페이지에 모았습니다.',
  alternates: {
    canonical: '/archives/',
  },
};

export default function ArchivesPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Archives</p>
        <h1>전체 작업 노트</h1>
        <p className="lead">최신순으로 한 페이지에 모았습니다.</p>
      </section>
      <PostList posts={getAllPosts()} />
    </>
  );
}
