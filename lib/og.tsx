import fs from 'node:fs';
import path from 'node:path';
import { ImageResponse } from 'next/og';

export const ogSize = { width: 1200, height: 630 };

const fontData = fs.readFileSync(
  path.join(process.cwd(), 'node_modules/pretendard/dist/public/static/Pretendard-Bold.otf'),
);

function clampTitle(title: string) {
  return title.length > 80 ? `${title.slice(0, 79)}…` : title;
}

export function renderOgImage({ title, footer }: { title: string; footer: string }) {
  const fontSize = title.length > 50 ? 48 : title.length > 28 ? 56 : 66;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          backgroundColor: '#0b0f14',
          borderTop: '14px solid #8bb8ad',
          color: '#e7edf3',
          fontFamily: 'Pretendard',
        }}
      >
        <div style={{ display: 'flex', color: '#8bb8ad', fontSize: 30 }}>Work Notes</div>
        <div
          style={{
            display: 'flex',
            fontSize,
            lineHeight: 1.28,
            wordBreak: 'keep-all',
          }}
        >
          {clampTitle(title)}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            color: '#93a1b2',
            fontSize: 28,
          }}
        >
          <div style={{ display: 'flex' }}>beni kim · 김세중</div>
          <div style={{ display: 'flex' }}>{footer}</div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        {
          name: 'Pretendard',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    },
  );
}
