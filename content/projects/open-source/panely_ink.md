---
title: "Panely Ink"
type: "open-source"
summary: "Android e-ink 기기를 위한 CBZ/ZIP 만화 리더로, 터치와 물리키 중심의 고대비 리딩 경험을 제공합니다."
problem: "Android e-ink 기기에서 만화를 읽을 때 일반 리더는 애니메이션과 색상 위주의 UI, 그리고 e-ink refresh 비용을 고려하지 않은 동작으로 종이 같은 읽기 경험을 방해합니다."
solution: "Canvas 기반 단일 페이지 리더와 SAF 기반 라이브러리, Compose UI를 결합해 Meebook M7 같은 e-ink 기기에 맞춘 정적이고 고대비한 리딩 환경을 구현했습니다."
impact: "SAF 폴더와 CBZ/ZIP, ZIP-of-CBZ 시리즈를 빠르게 열고, 물리 페이지/볼륨 키와 D-pad 조작, 이어보기, 진행률, 책별 설정, 풀리프레시·트리밍·대비·반전 컨트롤을 갖춘 e-ink 친화 리더 경험을 제공합니다."
stack: ["Android", "Kotlin", "Jetpack Compose", "Room", "SAF", "Canvas"]
repository: "https://github.com/sejoung/Panely_Ink"
links:
  - label: "Download"
    href: "https://sejoung.github.io/Panely_Ink/"
    external: true
featured: true
order: 12
---

Panely Ink는 Android e-ink 기기에서 CBZ/ZIP 만화를 종이처럼 읽기 위한 리더입니다. 첫 대상 기기는 Meebook M7이며, [Panely](https://github.com/sejoung/Panely)의 방향성을 터치와 물리키 중심의 고대비 리딩 경험으로 옮기는 것을 목표로 합니다.

## What It Does

SAF 폴더 기반 라이브러리에서 중첩 폴더와 CBZ/ZIP, ZIP-of-CBZ 시리즈를 탐색하고 열 수 있습니다. 화면 좌/우 영역으로 페이지를 넘기고 가운데 영역에서 메뉴를 열며, 물리 페이지 키, 볼륨 키, D-pad, 탭 영역으로 조작합니다. 이어보기, 진행률 배지, 책별 설정, 현재 책/전체 북마크, 표지 캐시, LTR/RTL 읽기 방향, 영어·한국어 UI를 지원합니다.

## Why I Built It

Android e-ink 기기에는 화려한 애니메이션과 색상 UI보다 정적이고 고대비한, refresh 비용을 의식한 리더가 필요합니다. Panely Ink는 e-ink 풀리프레시 정책, 페이지 트리밍, 대비, 흑백 반전 같은 컨트롤을 갖춘 e-ink 전용 리딩 경험을 목표로 만들었습니다.

## Design Notes

리더 코어는 Canvas 기반 단일 페이지 렌더러와 PageDecoder, 비트맵 LRU로 구성하고, 라이브러리는 SAF 스캔과 ZIP-of-CBZ 감지, 표지 추출을 Room 메타데이터·디스크 PNG 캐시·메모리 LRU로 캐싱합니다. SAF를 통해 전체 아카이브를 복사하지 않고 CBZ/ZIP을 읽으며, 폴더 스캔과 시리즈 검사 결과를 캐시해 e-ink refresh 비용과 디스크 접근을 최소화합니다.
