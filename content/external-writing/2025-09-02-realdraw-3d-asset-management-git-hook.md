---
title: "git hook 및 git lfs를 활용한 3D 에셋 관리"
date: "2025-09-02T00:00:00+09:00"
url: "https://tech.realdraw.ai/ko/blog/2025_09_02_realdraw_3d_asset_management_git_hook/"
source: "REALDRAW TECH Blog"
excerpt: "3D 에셋처럼 큰 바이너리 파일을 Git 워크플로우 안에서 다루기 위해 Git LFS와 pre-commit hook을 결합한 운영 기록입니다."
tags: ["REALDRAW", "Git LFS", "Git Hook", "Asset Management", "Pipeline"]
project: "webtoon-production-pipeline"
---

에셋 관리에서 중요한 것은 저장소를 쓰는 것 자체보다 팀원이 실수하기 어려운 흐름을 만드는 일입니다. 이 글은 큰 파일을 자동으로 LFS 관리 대상으로 넘기기 위한 hook 기반 접근을 정리한 외부 작성물입니다.
