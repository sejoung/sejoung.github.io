---
title: "SystemScope"
type: "open-source"
summary: "CPU, 메모리, GPU, 디스크, Docker, 프로세스, 포트를 한 앱에서 확인하고 정리하는 시스템 모니터링 도구입니다."
problem: "개발 환경의 성능 문제나 디스크 증가 원인은 여러 OS 도구와 명령어에 흩어져 있어 한 번에 파악하고 정리하기 어렵습니다."
solution: "Electron과 React 기반 데스크톱 앱으로 실시간 모니터링, 디스크 분석, Docker 정리, 프로세스/포트 관리, 앱 정리를 통합했습니다."
impact: "개발자가 로컬 머신의 상태와 낭비되는 리소스를 한 곳에서 확인하고, 안전한 정리 흐름으로 이어갈 수 있게 합니다."
stack: ["Electron", "React", "TypeScript", "Vite", "Playwright"]
repository: "https://github.com/sejoung/SystemScope"
featured: true
order: 15
---

SystemScope는 개발자용 시스템 모니터링과 정리 도구입니다. CPU, 메모리, GPU, 디스크 사용량을 보는 것에서 끝나지 않고, 디스크 분석과 Docker, 프로세스, 포트, 앱 정리까지 하나의 흐름으로 묶습니다.

## What It Does

실시간 시스템 지표, 스토리지 트리맵, 대용량/오래된/중복 파일 탐색, Docker 컨테이너와 이미지 정리, 프로세스 종료, 포트 모니터링, 앱 잔여 데이터 정리 기능을 제공합니다.

## Why I Built It

개발자의 로컬 환경은 빌드 산출물, 캐시, Docker 리소스, 오래된 앱 데이터로 쉽게 무거워집니다. 원인을 찾기 위해 여러 도구를 오가는 대신, 관찰과 정리를 하나의 앱에서 처리하고 싶었습니다.

## Design Notes

보안 모델은 Electron renderer가 Node API에 직접 접근하지 않고 필요한 IPC만 노출하는 방식입니다. 삭제 작업은 제한된 경로와 휴지통 이동을 기준으로 하며, Docker나 OS 명령이 없을 때도 앱 전체가 깨지지 않도록 graceful fallback을 둡니다.
