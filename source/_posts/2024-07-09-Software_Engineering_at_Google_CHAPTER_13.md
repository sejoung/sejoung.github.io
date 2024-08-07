---
layout: post
title: "CHAPTER 13 테스트 대역"
date: 2024-07-09 09:45 +0900
comments: true
tags: [ "구글 엔지니어는 이렇게 일한다","구글러가 전하는 문화, 프로세스, 도구의 모든 것" ]
categories: [ "books" ]
sitemap:
    changefreq: daily
    priority: 1.0
---

# Part III 프로세스
## CHAPTER 13 테스트 대역
단순한 코드라면 단위 테스트 작성이 전혀 부담되지 않습니다 하지만 대상 코드가 복잡해질수록 테스트를 작성하기도 어려워진다

테스트 대역은 실제 구현 대신 사용 할 수 있는 객체나 함수를 말한다

### 테스트 대역이 소프트웨어 개발에 미치는 영향

* 테스트 용이성
* 적용 가능성
* 충실성

### 테스트 대역 @ 구글
품질을 높은 예도 많지만 잘못 할용하여 역효과를 낸 예도 못지 않다

* 엔지니어가 관행들에 익숙하지 않는다
* 코드베이스가 관행을 따르기에 적합하지 않게 작성되어 있기도 한다

### 기본 개념
* 테스트 대역 예
* 이어주기
  * 테스트 하기 쉽다
  * 의존성 주입
* 모의 객체 프레임 워크

### 테스트 대역 활용 기법
* 속이기(가짜 객체)
* 뭉개기(스텁)
* 상호작용 테스트하기

### 실제 구현
* 실제 구현을 선호하는 테스트 방식을 고전적 테스트
* 모의 객체 프레임워크를 선호하는 테스트 방식은 모의 객체 중심주의 테스트
* 갹리 보단 현실성을 우선하자
* 실제 구현을 사용할지 결정하기
  * 실행시간
  * 결정성
  * 의존성 생성

### 속이기(가짜 객체)
* 가짜 객체가 중요한 이유
* 가짜 객체를 작성해야 할때
* 가자 객체의 충실성
* 가짜 객체도 테스트 해야
* 가짜 객체를 이용할 수 없다면
### 뭉개기(스텁)
* 스텁 과용의 위험성
  * 불명확해진다
  * 깨지기 쉬워진다
  * 테스트 효과가 감소한다
* 스텁이 적합한경우
  * 대상 시스템을 원하는 상태로 변경하려 할 때 제격
  
### 상호작용 테스트하기
* 상호작용 테스트보다 상태 테스트를 우선하자
  * 변경 검충 테스트
* 상호작용 테스트가 적합한 경우
  * 상태 변경 함수일 경우에만 상호작용 테스트를 우선 고려하자
  * 너무 상세한 테스트는 피하자


# 참조
-----

* [구글 엔지니어는 이렇게 일한다](https://www.yes24.com/Product/Goods/109182479)
