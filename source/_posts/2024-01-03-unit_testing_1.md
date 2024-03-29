---
layout: post
title: "1장. 단위 테스트 목표"
date: 2024-01-03 10:43 +0900
comments: true
tags: [ "단위 테스트","생산성과 품질을 위한 단위 테스트 원칙과 패턴" ]
categories: [ "books" ]
sitemap:
    changefreq: daily
    priority: 1.0
---

# 1장. 단위 테스트 목표

단위 테스트를 배우는 것은 테스트 프레임워크나 목 라이브러리등과 같은 기술적인 부분을 익히는 것에 그치지 않는다

단위 테스트를 매우 많이 작성하더라도 많은 버그와 유지비로 프로젝트 진행이 느려지게 된다

## 단위 테스트 현황

대부분의 프로그래머는 단위 테스트를 실천하고 중요성을 알고 있다

보통 제품코드와 테스트 코드의 비율은 1:1에서 1:3 정도 된다

좋은 테스트와 좋지 않은 테스트의 차이는 취향이나 개인적인 선호도의 문제가 아니라 현재 작업 중인 중대한 프로젝트의 성패를 가르는 문제이다

## 단위 테스트 목표

단위 테스트와 코드 설계의 관계
* 코드 조각을 단위 테스트하는 것은 훌륭한 리스머스 시험이지만 한 방향으로 작동한다

단위 테스트의 목표는? -> 소프트웨어 프로젝트의 지속 가능한 성장을 가능하게 하는 것 이다

개발속도가 빠르게 감소하는 현상을 소프트웨어 엔트로피라고 한다

### 좋은 테스트와 좋지 않은 테스트를 가르는 요인

테스트의 가치와 유지비용을 모두 고려해야함 비용요소는 다음과 같은 다양한 활동에 필요한 시간에 따라 결정된다

* 기반 코드를 리팩터링할 때 테스트도 리팩터링하라
* 각 코드 변경 시 테스트를 실행하라
* 테스트가 잘못된 경고를 발생시킬 경우 처리하라
* 기반 코드가 어떻게 동작하는지 이해라려고 할때 테스트를 읽는 시간에 투자하라

제품 코드 대 테스트 코드
* 코드는 자산이 아니라 책임이다
* 테스트도 역시 코드다 다른 코드와 마찬가지로 유지보수가 필요하다

## 테스트 스위트 품질 측정을 위한 커버리지 지표

* 코드 커버리지
* 분기 커버리지

커버리지 지표는 중요한 피드백을 주더라도 테스트 스위트 품질을 효과적으로 측정하는 데 사용될 수 없다

### 코드 커버리지 지표에 대한 이해

가장 많이 사용되는 커버리지 지표로 코드 커버리지가 있으며 테스트 커버리지로도 알려져 있다

코드가 작을수록 커버리지 지표는 더 좋아지는데 이는 원래 라인 수만 처리해서이다

코드를 더 작게 해도 테스트 스위트의 가치나 기반 코드베이스의 유지보수성이 변경되지 않는다

### 분기 커버리지 지표에 대한 이해

분기 커버리지는 코드 라인 수를 사용하는 대신 if 문과 switch 문과 같은 제어 구조의 수를 나타낸다

### 커버리지 지표에 관한 문제점

테스트 스위트의 품질을 결정하는 데 어떤 커버리지 지표도 의존할 수 없는 이유
* 테스트 대상 시스템의 모든 가능한 결과를 검증한다고 보장할 수 없다
* 외부 라이브러리의 코드 경로를 고려할 수 있는 커버리지 지표는 없다

단위 테스트에는 반드시 적잘한 검증이 있어야 된다

정수 타입으로 변환할수 없는 몇가지 가능한 인수
* 널 값
* 빈 문자열
* 정수가 아님
* 너무 긴 문자열

### 특정 커버리지 숫자를 목표로 하기

커버리지 지표를 보는 가장 좋은 방법은 지표 그 자체로 보는 것이며, 목표로 여겨서는 안된다

커버리지 지표는 좋은 부정 지표이지만 나쁜 긍정 지표다

## 무엇이 성공적인 테스트 스위트를 만드는가?
테스트 스위트의 품질은 어떻게 측정해야 하는가? 믿을만한 방법은 스위트 내 각 테스트를 하나씩 따로 평가하는것 뿐이다

성공적인 테스트 스위트의 특성
* 개발 주기에 통합돼 있다
  * 자동화된 테스트를 할수 있는 방법은 끊임없이 하는것 뿐
* 코드베이스에서 가장 중요한 부분만을 대상으로 한다
  * 비지니스 로직이 아닌 부분
    * 인프라 코드
    * 데이터베이스나 서드파티 시스템과 같은 외부 서비스 및 종속성
    * 모든 것을 하나로 묶는 코드
* 최소한의 유지비로 최대의 가치를 끌어낸다
  * 가치 있는 테스트 식별하기
  * 가치 있는 테스트 작성하기

# 참조
-----

* [단위 테스트(생산성과 품질을 위한 단위 테스트 원칙과 패턴)](http://www.acornpub.co.kr/book/unit-testing)
