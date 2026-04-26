import type { Metadata } from 'next';
import { PostList } from '@/components/PostList';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Archives',
  alternates: {
    canonical: '/archives/',
  },
};

export default function ArchivesPage() {
  return (
    <>
      <h1>Archives</h1>
      <p className="lead">전체 글을 최신순으로 정리했습니다.</p>
      <PostList posts={getAllPosts()} />
    </>
  );
}
