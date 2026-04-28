# sejoung.github.io

백엔드 시스템과 제작 파이프라인을 설계해 온 엔지니어의 작업 노트. Next.js 정적 사이트로 빌드하고 GitHub Pages에 배포한다.

## 기술 스택

- Next.js 16 (App Router, `output: 'export'` 정적 빌드)
- React 19, TypeScript, Tailwind CSS v4
- 마크다운: `unified` + `remark` + `rehype` (코드 하이라이팅, 헤딩 슬러그·자동 링크)

## 로컬 실행

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # 정적 산출물 → out/
```

## 디렉터리 구조

```
app/                  라우트 (App Router)
components/           재사용 컴포넌트 (Tailwind 인라인)
content/
  posts/              내부 글
  external-writing/   외부 매체에 쓴 글의 메타데이터
  projects/
    systems/          시스템 프로젝트
    open-source/      오픈소스 도구
  pages/about.md      About 페이지 콘텐츠
lib/                  콘텐츠 로딩·렌더 헬퍼
public/images/        본문에서 참조하는 이미지
```

## 콘텐츠 작성

### 글 (`content/posts`)

- 파일명: `YYYY-MM-DD-slug.md`
- URL: `/{YYYY}/{MM}/{slug}/` (파일명 날짜에서 자동 생성)

```markdown
---
title: "글 제목"
date: 2026-04-26
tags: ["kotlin", "spring"]
project: "backend-system-architecture"   # 선택. 프로젝트와 연결
---

본문…
```

이미지는 `public/images/example.png`에 두고 본문에서 `/images/example.png`로 참조한다.

### 외부 글 (`content/external-writing`)

다른 사이트에 쓴 글을 통합 목록(`/writing/`)에 노출하기 위한 메타데이터 전용 항목.

```markdown
---
title: "외부 글 제목"
date: 2026-03-20
url: "https://tech.realdraw.ai/..."
source: "REALDRAW Tech Blog"
excerpt: "한 줄 요약"
tags: ["unreal"]
project: "webtoon-production-pipeline"
---
```

### 프로젝트 (`content/projects/{systems,open-source}`)

```markdown
---
title: "Webtoon Production Pipeline"
summary: "한 줄 설명"
problem: "어떤 문제를"
solution: "어떻게 풀었고"
impact: "무엇이 바뀌었는지"
stack: ["Unreal", "Python"]
relatedPosts: ["unreal_python_script"]   # posts 슬러그
relatedTags: ["unreal"]                  # 태그로도 자동 연결
featured: true
order: 1
repository: "https://github.com/..."
links:
  - label: "데모"
    href: "https://..."
    external: true
---
```

`type`은 디렉터리(`systems`/`open-source`)로 자동 결정된다.

## 라우팅

| 경로 | 설명 |
|---|---|
| `/` | 홈. 프로젝트·작업 노트 일부와 Approach |
| `/writing/`, `/writing/page/N/` | 통합 작업 노트 (내부 + 외부 글) |
| `/projects/`, `/projects/[slug]/` | 프로젝트 목록·상세 |
| `/[year]/[month]/[slug]/` | 글 상세 |
| `/tags/`, `/tags/[tag]/` | 큐레이션된 태그 그룹과 태그별 글 |
| `/archives/` | 전체 글 한 페이지 |
| `/about/` | About |
| `/rss2.xml`, `/sitemap.xml` | 피드 / 사이트맵 |

## 스타일 규칙

- **컴포넌트** (`components/*`, `app/layout.tsx`): Tailwind 인라인 클래스
- **페이지·마크다운 본문** (`app/**/page.tsx`, `.article`, `.content`): `app/globals.css`의 시맨틱 클래스

새 컴포넌트를 만들 때 이 경계를 지키면 globals.css와 인라인 Tailwind 사이의 이중 정의가 다시 생기지 않는다.

## 큐레이션 태그

`/tags/`는 모든 태그가 아니라 `lib/curated-tags.ts`에 정의된 그룹(Production Pipeline / Backend Architecture / System Design Notes)만 노출한다. 개별 태그 페이지(`/tags/[tag]/`)는 모든 태그에 대해 빌드된다.

## 배포

`npm run build` 산출물(`out/`)을 GitHub Pages에 정적 호스팅한다.
