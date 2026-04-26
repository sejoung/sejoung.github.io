---
title: "리얼드로우의 언리얼 에셋 관리, 어떻게 다를까요?"
date: "2025-07-15T00:00:00+09:00"
url: "https://tech.realdraw.ai/ko/blog/2025_07_15_realdraw_3d_asset_management/"
source: "REALDRAW TECH Blog"
excerpt: "웹툰 배경 제작에서 에셋 중복을 줄이고 프로젝트 생성을 빠르게 하기 위해 Git 저장소와 심볼릭 링크 기반의 에셋 라이브러리 구조를 설계한 기록입니다."
tags: ["REALDRAW", "Unreal", "Asset Management", "Git", "Pipeline"]
project: "webtoon-production-pipeline"
---

웹툰 제작 환경에서는 하나의 배경 에셋을 여러 프로젝트에서 반복해서 활용해야 합니다. 이 글은 에셋을 복사하지 않고 참조 가능한 구조로 만들기 위해 Git 저장소, 심볼릭 링크, 스크립트를 조합한 사례입니다.
