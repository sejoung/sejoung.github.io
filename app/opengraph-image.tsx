import { ogSize, renderOgImage } from '@/lib/og';

export const dynamic = 'force-static';
export const size = ogSize;
export const contentType = 'image/png';
export const alt = 'beni kim · 김세중 | Systems and Production Pipelines';

export default function Image() {
  return renderOgImage({
    title: '시스템을 만들며 남긴 기록',
    footer: 'sejoung.github.io',
  });
}
