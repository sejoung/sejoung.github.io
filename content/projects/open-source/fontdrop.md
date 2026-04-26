---
title: "FontDrop"
type: "open-source"
summary: "폰트 폴더를 지정하면 노트에서 사용자 폰트를 즉시 적용할 수 있는 Android 노트 앱입니다."
problem: "Android에서 사용자 폰트를 설치하거나 글 작성 중 바로 시험해보는 흐름은 번거롭고, 폰트별 표현을 빠르게 비교하기 어렵습니다."
solution: "Storage Access Framework로 폰트 폴더를 연결하고, 노트별 폰트 선택과 이미지 공유까지 이어지는 Compose 기반 앱으로 정리했습니다."
impact: "폰트를 설치 과정이 아니라 작성 흐름 안에서 바로 쓰고 비교할 수 있게 만들어 typography 중심의 노트 작성 경험을 제공합니다."
stack: ["Android", "Kotlin", "Jetpack Compose", "Room", "DataStore"]
repository: "https://github.com/sejoung/FontDrop"
featured: true
order: 11
---

FontDrop은 `.ttf` / `.otf` 파일이 들어 있는 폴더를 앱에 연결하고, 각 노트에서 원하는 폰트를 즉시 적용할 수 있게 만든 Android 앱입니다.

## What It Does

사용자가 지정한 폰트 폴더를 스캔하고, 폰트를 캐싱한 뒤 노트 에디터에서 바로 전환할 수 있게 합니다. 노트는 자동 저장되며, 실제 폰트를 적용한 이미지 공유 흐름도 포함합니다.

## Why I Built It

글을 쓸 때 폰트는 단순한 장식이 아니라 문장의 인상을 바꾸는 도구입니다. 하지만 모바일에서는 사용자 폰트를 빠르게 적용하고 비교하기 어렵기 때문에, 폰트 파일을 가진 사람이 바로 글쓰기 흐름에 연결할 수 있는 앱으로 만들었습니다.

## Design Notes

폰트 로딩은 폴더 접근, 파일 캐시, 메모리 캐시, Compose `FontFamily` 구성으로 나누었습니다. 에디터는 커서 안정성을 유지하기 위해 입력 상태와 저장 상태를 분리하고, 자동 저장은 debounce와 화면 이탈 시 flush를 함께 사용합니다.
