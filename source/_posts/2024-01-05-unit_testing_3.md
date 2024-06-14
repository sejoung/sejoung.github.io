---
layout: post
title: "3장. 단위 테스트 구조"
date: 2024-01-05 10:07 +0900
comments: true
tags: [ "단위 테스트","생산성과 품질을 위한 단위 테스트 원칙과 패턴" ]
categories: [ "books" ]
sitemap:
    changefreq: daily
    priority: 1.0
---

# 3장. 단위 테스트 구조
## 단위 테스트를 구성하는 방법
### AAA(arrange act assert) 패턴 사용
3A 패턴은 테스트를 준비(arrange), 실행(act), 검증(assert) 세 단계로 나누는 것을 의미한다.

AAA 패턴은 스위트 내 모든 테스트가 단순하고 균일한 구조를 갖는데 도움이 된다

일관성이 이 패턴의 가장 큰 장점 중 하나다

Given-When-Then 패턴

* Given: 테스트를 위한 사전 조건을 설정한다
* When: 테스트를 수행한다
* Then: 테스트 결과를 검증한다

### 여러 개의 준비, 실행, 검증 구절 피하기

여러 개의 준비 실행 검증 구절은 테스트가 너무 많은 것을 한 번에 검증한다는 의미다

검증 구절로 구분된 여러 개의 실행 구절을 보면 려러 개의 동작 단위를 검증 하는 테스트를 뜻한다 이건 더 이상 단위 테스트가 아니라 통합 테스트다

### 테스트 내 if 문 피하기
이것도 안티 패턴이다

이러한 테스트는 반드시 여러 개의 테스트로 분리해야 한다

테스트에 분기가 있어서 얻는 이점은 없다

### 각 구절은 얼마나 커야 하는가?

일반적으로 준비 구절이 세 구절 중 가장 크다. 
실행과 검증을 합친 만큼 클 수도 있다

그러나 준비 구절이 너무 크면 코드 재사용에 도움이 되는 두가지 패턴으로 
오브젝트 마더(object mother)와 테스트 데이터 빌더(test data builder)가 있다

실행 구절은 보통 한 줄이다. 실행 구절이 두줄 이상인 경우는 sut의 공개 API에 문제가 있을수도 있다

불변 위반(jnvariant violation) 잠재적인 모순으로 부터 코드를 보호 하는 행위를 캡슐화라고 한다


### 검증 구절에는 검증문이 얼마나 있어야 하는가

단위 테스트의 단위는 동작의 단위이지 코드의 단위가 아니다
단일 동작 단위는 여러 결과를 낼 수 있으며 하나의 테스트로 모든 결과를 평가하는것이 좋다

### 종료 단계는 어떤가

준비, 실행, 검증 이후의 네 번째 구절로 종료 구절을 따로 구분하기도 한다

AAA 패턴에는 이 단계를 포함하지 않는다

종료는 통합 테스트의 영역이다

### 테스트 대상 시스템 구별하기

SUT(System Under Test) 테스트에서 중요한 역할을 하는데 애플리케이션을 호출하고자 하는 동작에 대한 진입점을 제공한다

SUT와 의존성과 구분하는 것이 중요하다

### 준비, 실행, 검증 주석 제거하기

의존성에서 SUT를 떼어내는 것이 중요하듯이 주석으로 하는것 보다 빈 줄로 구절을 구분한다

* AAA 패턴을 따르고 준비 및 검증 구절에 빈 줄을 추가하지 않아도 되는 테스트라면 구절 주석들을 제거하라
* 그렇지 않으면 구절 주석을 유지하라

## 테스트 간 테스트 픽스처 재사용

테스트 픽처스
* 테스트 픽스처는 테스트 실행 대상 객체이다
* NUnit에서 [TestFixture] 특성을 사용하여 테스트가 포함된 클래스를 표시한다

준비 구절을 생성자로 추출 할때 단점
* 테스트 간 결합도가 높아진다
* 테스트 가독성이 떨어진다

### 테스트 간의 높은 결합도는 안티 패턴이다
테스트를 수정해도 다른 테스트에 영향을 주어서는 안된다.

### 테스트 가독성을 떨어뜨리는 생성자 사용
준비 코드를 생성자로 추출할 때 테스트 가독성을 떨어뜨린다

### 더 나은 테스트 픽스처 재사용법

테스트 픽스처를 재사용할때 생성자 사용이 최선의 방법은 아니다
* 비공개 팩토리 매서드를 두는것도 하나의 방법이다
* 기초 클래스 내 공통 초기화 코드를 두는법

## 단위 테스트 명명법

가장 도움 되지 않는 명명법

[테스트 대상]_[시나리오]_[예상 결과]

* 테스트 대상 메서드 : 테스트 중인 메서드의 이름
* 시나리오 : 메서드를 테스트하는 조건
* 현재 시나리오에서 테스트 대상 메서드에 기대하는 것


프로그래머가 아닌 사람들에게 이름을 어떻게 생각하는지 중요하지 않다고 말할 수 있다 테스트는 프로그래머를 위한것이라서 그렇게 생각한다


### 단위 테스트 명명 지침

* 엄격한 명명 정책을 따르지 않는다
* 문제 도메인에 익숙한 비개발자들에게 시나리오를 설명하는 것처럼 테스트 이름을 짓자
* 단어를 밑줄 표시(_)로 구분한다

### 예제: 지침에 따른 테스트 이름 변경

테스트 이름에 SYUT(System Under Test)에 메서드 이름을 포함하지 말라

## 매개변수화된 테스트 리팩터링하기
동작이 너무 복잡하면 매개변수화된 테스트를 조금도 사용하지 말라


# 참조
-----

* [단위 테스트(생산성과 품질을 위한 단위 테스트 원칙과 패턴)](http://www.acornpub.co.kr/book/unit-testing)