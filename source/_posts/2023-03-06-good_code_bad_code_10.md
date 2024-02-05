---
layout: post
title: "CHAPTER 10 단위 테스트의 원칙"
date: 2023-03-06 21:26 +0900
comments: true
tags : ["좋은코드 나쁜코드: 프로그래머의 코드 품질 개선법"]
categories : ["book"]
sitemap :
changefreq : daily
priority : 1.0
---

# 좋은코드 나쁜코드: 프로그래머의 코드 품질 개선법(PART III 단위 테스트)
## CHAPTER 10 단위 테스트의 원칙

### 10.1 단위 테스트 기초

* 테스트 중인 코드
* 테스트 코드
* 테스트 케이스
  * 준비
  * 실행
  * 단언
* 테스트 러너

### 10.2 좋은 단위 테스트는 어떻게 작성할 수 있는가?

좋은 단위 테스트가 가져야 할 주요 기능
* 훼손의 정확한 감지
  * 코드에 대한 초기 신뢰를 준다
  * 미래의 훼손을 막아준다
* 세부 구현 사항에 독립적
  * 기능적 변화
  * 리팩터링
* 잘 설명되는 실패
* 이해 할수 있는 테스트 코드
* 쉽고 빠르게 실행

### 10.3 퍼블릭 API에 집중하되 중요한 동작은 무시하지 말라

퍼블릭 API만을 사용한 테스트

퍼블릭 API만으로 테스트 할수 없는 테스트
* 서버와 상호작용하는 코드
* 데이터베이스에 값을 저장하거나 읽는 코드

### 10.4 테스트 더블
의존성을 실제로 사용하는 것데 대한 대안으로 테스트 더블이 있다

* 테스트 더블을 사용하는 이유
  * 테스트 단순화
    * 테스트를 더 빠르게 실행하는 것
  * 테스트로부터 외부 세계 보호
    * 사용자는 이상하고 혼란스러운 값을 볼 수 있다
    * 모니터링 및 로깅에 영향을 미칠 수 있다
  * 외부로부터 테스트 보호
  * 가장 일반적인 테스트 더블
    * 목 mock : 클래스나 인터페이스를 시뮬레이션하는 데 멤버 함수에 대한 호출을 기록하는 것 외에는 어떠한 일도 수행하지 않는다
    * 스텁 stub : 함수가 호출되면 미리 정해 놓은 값을 반환함으로써 함수를 시뮬레이션 한다
    * 페이크 fake : 클래스의 대체 구현체로 테스트에서 안전하게 사용할 수 있다
  * 목과 스텁은 문제가 될 수 있다
    * 목이나 스텁이 실제 의존성과 다른 방식으로 동작하도록 설정되면 테스트는 실제적이지 않다
    * 구현 세부 사항과 테스트가 밀접 하게 결합하여 리팩터링이 어려워질수 있다
  * 페이크로 인해 보다 실질적인 테스트가 이루어질 수 있다
  * 페이크를 사용하면 구현 세부 정보로부터 테스트를 분리 할수 있다
  * 목에 대한 의견
    * mockist : 런던학파
      * 단위 테스트가 더욱 격리된다
      * 테스트 코드 작성이 쉬워진다
    * classicist : 디트로이트 학파
      * 목은 실제 호출이 유용한지 검증이 되지 않는다
      * 구현 세부 사항에 대해 더 독립적인 테스트를 할 수 있다


### 10.5 테스트 철학으로부터 신중하게 선택하라

테스트 철학과 방법론

* 테스트 주도 개발
* 행동 주도 개발
* 수용 테스트 주도 개발

# 참조

-----
* [좋은코드 나쁜코드: 프로그래머의 코드 품질 개선법](http://www.yes24.com/Product/Goods/109366833)