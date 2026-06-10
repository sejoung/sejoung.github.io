import RSS from 'rss';
import { absoluteUrl, getAllPosts, renderPost, siteUrl } from '@/lib/posts';

export const dynamic = 'force-static';

function absolutizeUrls(html: string) {
  return html.replace(/(href|src)="\//g, `$1="${siteUrl}/`);
}

export async function GET() {
  const feed = new RSS({
    title: 'beni kim · 김세중 · 작업 노트',
    description: '백엔드 시스템과 제작 파이프라인을 설계해 온 엔지니어의 작업 노트. 시스템 설계, 웹툰 제작 자동화, 운영 기록을 모았습니다.',
    feed_url: `${siteUrl}/rss2.xml`,
    site_url: siteUrl,
    language: 'ko',
  });

  for (const post of getAllPosts().slice(0, 20)) {
    const rendered = await renderPost(post);

    feed.item({
      title: post.title,
      description: post.excerpt,
      url: absoluteUrl(post.url),
      date: post.date,
      categories: post.tags,
      custom_elements: [
        {
          'content:encoded': {
            _cdata: absolutizeUrls(rendered.html),
          },
        },
      ],
    });
  }

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
