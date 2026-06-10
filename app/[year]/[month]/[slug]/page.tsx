import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Comments } from '@/components/Comments';
import { extractToc } from '@/lib/markdown';
import {
  absoluteUrl,
  formatDate,
  getAdjacentPosts,
  getAllPosts,
  getPostByParams,
  getRelatedPosts,
  renderPost,
} from '@/lib/posts';
import { getProjectForPost } from '@/lib/projects';

export const dynamicParams = false;

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
  const toc = extractToc(rendered.html);
  const { newer, older } = getAdjacentPosts(post);
  const related = getRelatedPosts(post);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: absoluteUrl(post.url),
    datePublished: post.date.toISOString(),
    dateModified: (post.updated ?? post.date).toISOString(),
    inLanguage: 'ko',
    keywords: post.tags.join(', '),
    author: {
      '@type': 'Person',
      name: '김세중',
      url: 'https://sejoung.github.io/about/',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(post.url),
    },
  };

  return (
    <div className="post-layout">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="post-main">
        <article className="article" data-pagefind-body>
          <header className="article-header">
            <p className="eyebrow">
              <time dateTime={rendered.date.toISOString()}>{formatDate(rendered.date)}</time>
            </p>
            <h1 className="article-title">{rendered.title}</h1>
            <p className="meta">{rendered.readingMinutes} min read</p>
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
        <footer className="article post-footer">
          <nav className="post-nav" aria-label="이전 글과 다음 글">
            {older ? (
              <Link className="post-nav-link" href={older.url}>
                <span>← 이전 글</span>
                <strong>{older.title}</strong>
              </Link>
            ) : (
              <span />
            )}
            {newer ? (
              <Link className="post-nav-link next" href={newer.url}>
                <span>다음 글 →</span>
                <strong>{newer.title}</strong>
              </Link>
            ) : null}
          </nav>
          {related.length > 0 ? (
            <section className="related-posts">
              <h2>관련 글</h2>
              <ul>
                {related.map((item) => (
                  <li key={item.url}>
                    <Link href={item.url}>{item.title}</Link>
                    <time dateTime={item.date.toISOString()}>{formatDate(item.date)}</time>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          <Comments />
        </footer>
      </div>
      {toc.length >= 3 ? (
        <aside className="toc-rail">
          <nav className="toc" aria-label="목차">
            <p className="toc-title">목차</p>
            <ul>
              {toc.map((entry) => (
                <li className={entry.depth === 3 ? 'toc-depth-3' : undefined} key={entry.id}>
                  <a href={`#${entry.id}`}>{entry.text}</a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      ) : null}
    </div>
  );
}
