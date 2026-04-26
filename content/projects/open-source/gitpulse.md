---
title: "GitPulse"
type: "open-source"
summary: "Git 히스토리에서 코드 churn, 소유 집중도, 활동 흐름, 배포 압력을 읽어내는 local-first 데스크톱 대시보드입니다."
problem: "저장소의 위험 신호는 커밋 목록만 봐서는 잘 드러나지 않고, churn, bug-fix 흔적, ownership 집중도 같은 지표가 흩어져 있습니다."
solution: "로컬 Git 저장소를 분석해 hotspots, ownership, activity, delivery risk를 시각화하고, 각 신호를 실제 커밋 근거로 추적할 수 있게 만들었습니다."
impact: "코드베이스와 팀 상태를 추측이 아니라 Git 히스토리 기반 신호로 확인하고, 리뷰나 개선 우선순위를 잡는 데 활용할 수 있습니다."
stack: ["Tauri", "React", "TypeScript", "Rust", "Git"]
repository: "https://github.com/sejoung/GitPulse"
links:
  - label: "Download"
    href: "https://sejoung.github.io/GitPulse/"
    external: true
featured: true
order: 14
---

GitPulse는 Git 저장소의 기록을 분석해 코드베이스와 팀의 상태를 읽는 local-first 데스크톱 앱입니다. 커밋을 조작하는 Git GUI가 아니라, 저장소 신호를 해석하는 대시보드에 가깝습니다.

## What It Does

파일별 churn, bug-fix overlap, ownership concentration, activity trend, hotfix/revert/rollback 패턴을 분석합니다. 각 지표는 테이블과 차트로 보여주고, 의심 신호는 실제 커밋 근거로 drill-down할 수 있게 합니다.

## Why I Built It

코드 품질과 팀 건강은 한두 개의 숫자로 판단하기 어렵지만, Git 히스토리에는 반복적으로 변하는 파일, 특정 사람에게 몰린 영역, 긴급 수정 패턴 같은 신호가 남습니다. GitPulse는 그 신호를 운영 가능한 형태로 꺼내기 위해 만든 도구입니다.

## Design Notes

분석은 로컬 저장소와 로컬 상태를 기준으로 동작합니다. Rust/Tauri 명령 계층은 Git CLI와 저장소 분석을 담당하고, React UI는 기본 현황에서 상세 근거로 점진적으로 들어가는 구조를 가집니다.
