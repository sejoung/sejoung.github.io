import type { Metadata } from 'next';
import Link from 'next/link';
import { getTaxonomy } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Tags',
  alternates: {
    canonical: '/tags/',
  },
};

export default function TagsPage() {
  const tags = getTaxonomy('tags');

  return (
    <>
      <h1>Tags</h1>
      <div className="taxonomy-grid">
        {tags.map((tag) => (
          <Link className="taxonomy-link" href={`/tags/${encodeURIComponent(tag.name)}/`} key={tag.name}>
            <span>{tag.name}</span>
            <span className="taxonomy-count">{tag.posts.length}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
