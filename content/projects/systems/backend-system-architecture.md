---
title: "Backend System Architecture"
summary: "백엔드 시스템 설계, 데이터 모델링, 운영 문제 해결 경험을 구조화합니다."
problem: "서비스 문제는 코드 한 조각보다 경계, 데이터 흐름, 운영 조건에서 자주 발생합니다."
solution: "도메인 경계, 테스트, 데이터 저장소, 배포 환경을 함께 설계 대상으로 봅니다."
impact: "문제 원인을 시스템 단위로 파악하고 유지보수 가능한 구조로 전환합니다."
stack: ["Java", "Kotlin", "Spring", "Architecture"]
relatedPosts: ["hexagonal", "hexagonal_package", "Designing_Data_Intensive_Applications_chapter1", "Domain_Events_1"]
featured: true
order: 3
---

백엔드 설계는 프레임워크 사용법보다 경계와 흐름을 다루는 일에 가깝습니다. 이 프로젝트는 도메인 모델, 데이터 저장소, 메시징, 테스트, 운영 문제를 시스템 관점으로 정리합니다.

오래된 기술 메모도 이 축 안에서는 특정 문제를 해결한 기록으로 다시 연결됩니다.
