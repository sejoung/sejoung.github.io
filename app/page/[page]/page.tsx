import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Pagination } from '@/components/Pagination';
import { PostList } from '@/components/PostList';
import { getAllPosts, paginatePosts, totalPages } from '@/lib/posts';

export function generateStaticParams() {
  const pages = totalPages(getAllPosts());
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
    title: `Posts page ${page}`,
    alternates: {
      canonical: `/page/${page}/`,
    },
  };
}

export default async function PostsPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const currentPage = Number(page);
  const posts = getAllPosts();
  const pages = totalPages(posts);

  if (!Number.isInteger(currentPage) || currentPage < 2 || currentPage > pages) {
    notFound();
  }

  return (
    <>
      <h1>Posts</h1>
      <PostList posts={paginatePosts(posts, currentPage)} />
      <Pagination currentPage={currentPage} totalPages={pages} />
    </>
  );
}
