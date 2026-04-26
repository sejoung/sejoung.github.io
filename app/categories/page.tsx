import type { Metadata } from 'next';
import Link from 'next/link';
import { getTaxonomy } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Categories',
  alternates: {
    canonical: '/categories/',
  },
};

export default function CategoriesPage() {
  const categories = getTaxonomy('categories');

  return (
    <>
      <h1>Categories</h1>
      <div className="taxonomy-grid">
        {categories.map((category) => (
          <Link
            className="taxonomy-link"
            href={`/categories/${encodeURIComponent(category.name)}/`}
            key={category.name}
          >
            <span>{category.name}</span>
            <span className="taxonomy-count">{category.posts.length}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
