import RSS from 'rss';
import { absoluteUrl, getAllPosts, siteUrl } from '@/lib/posts';

export const dynamic = 'force-static';

export function GET() {
  const feed = new RSS({
    title: '폭간의 기술블로그',
    description: 'Java, Kotlin 등 백엔드 개발 기술과 소프트웨어 엔지니어링 학습 내용을 정리하는 기술 블로그입니다.',
    feed_url: `${siteUrl}/rss2.xml`,
    site_url: siteUrl,
    language: 'ko',
  });

  for (const post of getAllPosts().slice(0, 20)) {
    feed.item({
      title: post.title,
      description: post.excerpt,
      url: absoluteUrl(post.url),
      date: post.date,
      categories: post.tags,
    });
  }

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
