#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const title = process.argv[2];
const slugArg = process.argv[3];

if (!title) {
  console.error('사용법: npm run new -- "글 제목" [slug]');
  console.error('예시:  npm run new -- "코드 리뷰 자동화 도입기" code_review_automation');
  process.exit(1);
}

const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const datePrefix = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const dateTime = `${datePrefix} ${pad(now.getHours())}:${pad(now.getMinutes())} +0900`;

const slug =
  slugArg ??
  title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s_-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '_');

const filename = `${datePrefix}-${slug}.md`;
const filePath = path.join(process.cwd(), 'content', 'posts', filename);

if (fs.existsSync(filePath)) {
  console.error(`이미 존재하는 파일입니다: ${filePath}`);
  process.exit(1);
}

const frontMatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: ${dateTime}
tags: [ ]
categories: [ ]
---

`;

fs.writeFileSync(filePath, frontMatter, 'utf8');
console.log(`생성됨: content/posts/${filename}`);
