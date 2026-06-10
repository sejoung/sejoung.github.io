import { ogSize, renderOgImage } from '@/lib/og';
import { formatDate, getAllPosts, getPostByParams } from '@/lib/posts';

export const dynamic = 'force-static';
export const size = ogSize;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    year: post.year,
    month: post.month,
    slug: post.slug,
  }));
}
export const contentType = 'image/png';
export const alt = '글 제목이 담긴 미리보기 이미지';

export default async function Image({
  params,
}: {
  params: Promise<{ year: string; month: string; slug: string }>;
}) {
  const { year, month, slug } = await params;
  const post = getPostByParams(year, month, decodeURIComponent(slug));

  return renderOgImage({
    title: post?.title ?? 'beni kim · 김세중',
    footer: post ? formatDate(post.date) : 'sejoung.github.io',
  });
}
