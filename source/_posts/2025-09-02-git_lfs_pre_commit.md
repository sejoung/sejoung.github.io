---
layout: post
title: "Git LFS와 pre-commit 훅으로 대용량 파일 자동 추적하기"
date: 2025-09-02 16:13 +0900
comments: true
tags: [ "git lfs", "git", "pre-commit", "hooks" ]
categories: [ "git" ]
sitemap:
    changefreq: daily
    priority: 1.0
---

# Git LFS와 pre-commit 훅으로 대용량 파일 자동 추적하기

pre-commit 파일

```shell
#!/usr/bin/env bash
set -euo pipefail

# ===== 설정: 임계값 100MB =====
THRESH=$((100*1024*1024))

# git-lfs 설치 여부 확인
if ! command -v git-lfs >/dev/null 2>&1; then
  echo "[pre-commit] git-lfs not found. Run 'git lfs install' first." >&2
  exit 1
fi

# 스테이징된 추가/수정 파일 목록
files=$(git diff --cached --name-only --diff-filter=AM -z | tr '\0' '\n')

for f in $files; do
  [ -f "$f" ] || continue
  size=$(stat -c%s "$f" 2>/dev/null || stat -f%z "$f")

  if [ "$size" -ge "$THRESH" ]; then
    echo "[LFS] '$f' is $size bytes (>= $THRESH). Tracking with Git LFS..."
    git lfs track -- "$f" >/dev/null
    git add .gitattributes "$f"
    echo "[LFS] Tracked + re-staged: $f"
  fi
done

exit 0

```

## hooksPath 확인

```shell
git config --get core.hooksPath
```

## 로컬 설정
```shell
git config --local core.hooksPath .githooks
```

## 글로벌 설정

```shell
git config --global core.hooksPath home/beni/.githooks
```

# 참조
-----
