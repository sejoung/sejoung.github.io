---
layout: post
title: "6장: 데이터 보호"
date: 2023-12-27 10:17 +0900
comments: true
tags : ["파이브 라인스 오브 코드","five lines of code"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 6장: 데이터 보호
데이터와 기능에 대한 접근을 제한하는 캡슐화에 초점을 맞춰 불변속성이 지역에만 영향을 주게 만드는데 중점

## getter 없이 캡슐화하기
### 규칙: getter와 setter를 사용하지 말 것
부울(Boolean)이 아닌 필드에 setter나 getter를 사용하지 말 것

필드를 비공개로 하는 것의 가장 큰 장점은 그렇게 하는 것이 푸시 기반(push-base) 아키텍처를 장려하기 때문

디미터 법칙에서 유래

### 규칙 적용하기
### 리팩터링 패턴: getter와 setter 제거하기
기능을 데이터에 더 가깝게 이동하여 getter와 setter를 제거할수 있다
### 마지막 getter 삭제
## 간단한 데이터 캡슐화하기
### 규칙: 공통 접사를 사용하지 말 것
코드에 공통 접두사나 접미사가 있는 메서드나 변수가 없어야 된다

클래스를 사용해서 메서드와 변수를 그룹하하면 공통 접두사나 접미사를 제거할 수 있다

단일 책임 원칙을 따르는 클래스를 만들어야 한다

### 리팩터링 패턴: 데이터 캡슐화
변수와 메서드를 클래스로 옴기는 작업
## 순서에 존재하는 불변속성 제거하기
무언가가 다른 것보다 먼저 호출되어야 할때 그것을 순서 불변속성(sequence invariance)이라고 한다
### 리팩터링 패턴: 순서 강제화
생성자를 먼저 호출하지 않는 것은 불가능 하기 때문에 이불변속성이 제거된다 이 리팩터링을 순서 강제화라고 한다
## 열거형을 제거하는 또 다른 방법
### 비공개 생성자를 통한 열거
### 숫자를 클래스에 다시 매핑하기

# 참조
-----

* [파이브 라인스 오브 코드](https://wikibook.co.kr/five-lines/)
* [Fantasy Battle Refactoring Kata](https://github.com/Neppord/FantasyBattle-Refactoring-Kata)
