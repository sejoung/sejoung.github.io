import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostList } from '@/components/PostList';
import { getTaxonomy, getTaxonomyItem } from '@/lib/posts';

export function generateStaticParams() {
  return getTaxonomy('tags').map((tag) => ({
    tag: tag.name,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const name = decodeURIComponent(tag);

  return {
    title: `Tag: ${name}`,
    alternates: {
      canonical: `/tags/${encodeURIComponent(name)}/`,
    },
  };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const item = getTaxonomyItem('tags', decodeURIComponent(tag));

  if (!item) {
    notFound();
  }

  return (
    <>
      <h1>{item.name}</h1>
      <p className="lead">{item.posts.length} posts</p>
      <PostList posts={item.posts} />
    </>
  );
}
