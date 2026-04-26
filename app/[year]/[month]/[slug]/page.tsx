import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  absoluteUrl,
  formatDate,
  getAllPosts,
  getPostByParams,
  renderPost,
} from '@/lib/posts';
import { getProjectForPost } from '@/lib/projects';

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    year: post.year,
    month: post.month,
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; month: string; slug: string }>;
}): Promise<Metadata> {
  const { year, month, slug } = await params;
  const post = getPostByParams(year, month, decodeURIComponent(slug));

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: post.url,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: absoluteUrl(post.url),
      publishedTime: post.date.toISOString(),
      modifiedTime: post.updated?.toISOString(),
      tags: post.tags,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ year: string; month: string; slug: string }>;
}) {
  const { year, month, slug } = await params;
  const post = getPostByParams(year, month, decodeURIComponent(slug));

  if (!post) {
    notFound();
  }

  const rendered = await renderPost(post);
  const relatedProject = getProjectForPost(post);

  return (
    <article className="article">
      <header className="article-header">
        <p className="eyebrow">
          <time dateTime={rendered.date.toISOString()}>{formatDate(rendered.date)}</time>
        </p>
        <h1 className="article-title">{rendered.title}</h1>
        <p className="meta">
          {rendered.readingMinutes} min read
          {rendered.categories.length > 0 ? ` · ${rendered.categories.join(', ')}` : ''}
        </p>
        {rendered.tags.length > 0 ? (
          <div className="tags">
            {rendered.tags.map((tag) => (
              <Link className="tag" href={`/tags/${encodeURIComponent(tag)}/`} key={tag}>
                {tag}
              </Link>
            ))}
          </div>
        ) : null}
        {relatedProject ? (
          <div className="related-project">
            <span>Related project</span>
            <Link href={relatedProject.url}>{relatedProject.title}</Link>
          </div>
        ) : null}
      </header>
      <div className="content" dangerouslySetInnerHTML={{ __html: rendered.html }} />
    </article>
  );
}
