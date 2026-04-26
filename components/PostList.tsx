import Link from 'next/link';
import { formatDate } from '@/lib/posts';
import type { WritingItem } from '@/lib/writing';

function isExternalWriting(item: WritingItem) {
  return 'external' in item;
}

export function PostList({ posts }: { posts: WritingItem[] }) {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <article className="post-row" key={post.url}>
          <time className="post-date" dateTime={post.date.toISOString()}>
            {formatDate(post.date)}
          </time>
          <div>
            <h2>
              {isExternalWriting(post) ? (
                <a href={post.url} rel="noreferrer" target="_blank">
                  {post.title}
                </a>
              ) : (
                <Link href={post.url}>{post.title}</Link>
              )}
            </h2>
            {post.excerpt ? <p className="lead">{post.excerpt}</p> : null}
            <div className="meta">{isExternalWriting(post) ? `${post.source} · External` : `${post.readingMinutes} min read`}</div>
            {post.tags.length > 0 ? (
              <div className="tags">
                {post.tags.slice(0, 5).map((tag) => (
                  isExternalWriting(post) ? (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ) : (
                    <Link className="tag" href={`/tags/${encodeURIComponent(tag)}/`} key={tag}>
                      {tag}
                    </Link>
                  )
                ))}
              </div>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
