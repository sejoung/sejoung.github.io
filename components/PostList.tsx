import Link from 'next/link';
import { formatDate } from '@/lib/posts';
import type { WritingItem } from '@/lib/writing';

function isExternalWriting(item: WritingItem) {
  return 'external' in item;
}

export function PostList({ posts }: { posts: WritingItem[] }) {
  return (
    <div className="mt-6 grid">
      {posts.map((post) => (
        <article className="grid grid-cols-[132px_minmax(0,1fr)] gap-6 border-b border-[#26313d] py-6 max-[760px]:grid-cols-1 max-[760px]:gap-2" key={post.url}>
          <time className="text-sm text-[#93a1b2]" dateTime={post.date.toISOString()}>
            {formatDate(post.date)}
          </time>
          <div>
            <h2 className="mb-2 text-2xl leading-tight">
              {isExternalWriting(post) ? (
                <a className="no-underline" href={post.url} rel="noreferrer" target="_blank">
                  {post.title}
                </a>
              ) : (
                <Link className="no-underline" href={post.url}>{post.title}</Link>
              )}
            </h2>
            {post.excerpt ? <p className="lead">{post.excerpt}</p> : null}
            <div className="text-sm text-[#93a1b2]">{isExternalWriting(post) ? `${post.source} · External` : `${post.readingMinutes} min read`}</div>
            {post.tags.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.slice(0, 5).map((tag) => (
                  isExternalWriting(post) ? (
                    <span className="inline-flex min-h-7 items-center rounded-full bg-[#17342f] px-2.5 py-0.5 text-[13px] text-[#68d4c2]" key={tag}>
                      {tag}
                    </span>
                  ) : (
                    <Link className="inline-flex min-h-7 items-center rounded-full bg-[#17342f] px-2.5 py-0.5 text-[13px] text-[#68d4c2] no-underline hover:bg-[#254842]" href={`/tags/${encodeURIComponent(tag)}/`} key={tag}>
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
