---
title: "Gridlock"
type: "open-source"
summary: "Rush Hour 스타일의 주차장 슬라이딩 퍼즐 게임으로, 힌트 시스템과 레벨 생성 도구를 포함합니다."
problem: "작은 퍼즐 게임도 레벨 설계, 풀이 가능성 검증, 힌트, 저장, 플랫폼 빌드까지 갖추려면 반복 구현이 많습니다."
solution: "Love2D와 Lua로 퍼즐 규칙, BFS 기반 힌트, 저장 시스템, 레벨 생성/분석 도구, GitHub Pages 기반 웹 배포를 구성했습니다."
impact: "플레이 가능한 게임뿐 아니라 레벨 제작과 자동 업데이트, 멀티 플랫폼 빌드 흐름까지 포함한 작은 게임 시스템으로 정리했습니다."
stack: ["Love2D", "Lua", "Game", "BFS", "GitHub Pages"]
repository: "https://github.com/sejoung/Gridlock"
featured: true
order: 16
---

Gridlock은 차를 밀어서 빨간 차를 출구로 빼내는 슬라이딩 퍼즐 게임입니다. 클래식 Rush Hour 규칙을 기반으로 하되, 웹/데스크톱/모바일 빌드와 레벨 관리 흐름까지 함께 구성했습니다.

## What It Does

17개 레벨, 이동/되돌리기/초기화, progressive hint, 클리어 기록, 레벨 선택 화면을 제공합니다. 힌트는 현재 보드 상태에서 BFS solver로 계산하며, 레벨 생성기와 분석 도구도 포함합니다.

## Why I Built It

게임은 작은 규칙에서도 상태 관리, 검증, 피드백, 저장, 배포가 모두 필요합니다. Gridlock은 그 흐름을 간결한 Lua 코드와 Love2D 기반으로 정리한 프로젝트입니다.

## Design Notes

게임 로직은 board, car, input, level, hint, save, ui 모듈로 분리했습니다. 레벨은 Lua 테이블로 작성하고, GitHub Pages를 통해 새 레벨 데이터를 확인해 로컬에 캐시하는 자동 업데이트 흐름을 둡니다.
