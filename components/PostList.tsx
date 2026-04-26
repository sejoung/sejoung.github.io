import Link from 'next/link';
import { formatDate, type Post } from '@/lib/posts';

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <article className="post-row" key={post.url}>
          <time className="post-date" dateTime={post.date.toISOString()}>
            {formatDate(post.date)}
          </time>
          <div>
            <h2>
              <Link href={post.url}>{post.title}</Link>
            </h2>
            {post.excerpt ? <p className="lead">{post.excerpt}</p> : null}
            <div className="meta">{post.readingMinutes} min read</div>
            {post.tags.length > 0 ? (
              <div className="tags">
                {post.tags.slice(0, 5).map((tag) => (
                  <Link className="tag" href={`/tags/${encodeURIComponent(tag)}/`} key={tag}>
                    {tag}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
