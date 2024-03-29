---
layout: post
title: "CHAPTER 9 코드를 재사용하고 일반화할 수 있도록 하라"
date: 2023-03-05 23:00 +0900
comments: true
tags : ["좋은코드 나쁜코드: 프로그래머의 코드 품질 개선법"]
categories : ["book"]
sitemap :
changefreq : daily
priority : 1.0
---

# 좋은코드 나쁜코드: 프로그래머의 코드 품질 개선법(PART II 실전)
## CHAPTER 9 코드를 재사용하고 일반화할 수 있도록 하라

### 9.1 가정을 주의하라

* 가정은 코드 재사용 시 버그를 초래할 수 있다
  * 해결책
    * 불필요한 가정을 피하라
    * 가정이 필요하면 강제적으로 하라
      * 가정이 깨지지 않게 만들라
      * 오류 전달 기술을 사용하라
      * 문제의 소지가 있는 강제되지 않은 가정
      * 가정의 강제적 확인

### 9.2 전역 상태를 주의하라

전역변수를 정의 하는 일반적인 방법
* 자바나 C# 같은 언어에서 변수를 static 으로 표시
* c++ 같은 언어에서 클래스나 함수의 외부 즉 파일 수준의 변수 정의
* 자바스크립트 기반 언어에서 전역 원도 객체의 속성으로 정의


* 전역 상태를 갖는 코드는 재사용하기 안전하지 않을 수 있다
  * 해결책
    * 공유 상태에 의존성 주입하라

### 9.3 기본 반환값을 적절하게 사용하라

* 낮은 층위의 코드의 기본 반환값은 재사용성을 해칠 수 있다
  * 상위 수준의 코드에서 기본 값을 제공하라

### 9.4 함수의 매개변수를 주목하라

* 필요 이상으로 매개변수를 받는 함수는 재사용하기 어려울 수 있다
  * 해결책
    * 함수는 필요한것만 매개변수로 받도록 하라

### 9.5 제네릭의 사용을 고려하라

* 특정 유형에 의존하면 일반화를 제한한다
  * 제네릭을 사용하라

# 참조

-----
* [좋은코드 나쁜코드: 프로그래머의 코드 품질 개선법](http://www.yes24.com/Product/Goods/109366833)
