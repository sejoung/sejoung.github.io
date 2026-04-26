import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostList } from '@/components/PostList';
import { getTaxonomy, getTaxonomyItem } from '@/lib/posts';

export const dynamicParams = false;

export function generateStaticParams() {
  return getTaxonomy('categories').map((category) => ({
    category: category.name,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const name = decodeURIComponent(category);

  return {
    title: `Category: ${name}`,
    alternates: {
      canonical: `/categories/${encodeURIComponent(name)}/`,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const item = getTaxonomyItem('categories', decodeURIComponent(category));

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
