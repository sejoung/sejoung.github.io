---
layout: post
title: "이펙티브 코틀린 아이템 19: knowledge를 반복하지 말라"
date: 2022-08-29 05:10 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(재사용성)

재사용성 : 프로그램 언어의 핵심 특성

## 아이템 19: knowledge를 반복하지 말라

`프로젝트에서 이미 있던 코드를 복사해서 붙여넣고 있다면, 무언가가 잘못된 것이다.`

knowledge 를 반복하여 사용하지 말라 

DRY 규칙, WET 안티패턴, SSOT(Singe Source of Truth)


### Knowledge

넓은 의미로 의도적인 정보

중요한 Knowledge

* 로직
* 공통 알고리즘

### 모든 것은 변화한다.

프로그래밍에서 유일하게 유지되는 것은 변화한다는 속성

변화의 이유

* 회사가 사용자의 요구 또는 습관을 더많이 알게 되었다
* 디자인 표준이 변화했다.
* 플랫폼, 라이브러리, 도구 등이 변화해서 이에 대응해야 한다.

Knowledge 반복은 확장성을 막고 쉽게 깨지게 만든다.

### 언제 코드를 반복해도 될까?

반복처럼 보이지만 실질적으로 다른 Knowledge를 나타내는곳

함께 변경될 가능성이 높은가? 따로 변경될 가능성이 높은가? 이 질문으로 구분할수도 있겠다.

잘못된 코드 추출로부터 우리를 보호할수 있는 단일 책임 원칙(SRP)가 있다.

### 단일 책임 원칙

단일 책임 원칙: 클래스를 변경하는 이유는 단 한가지여야 한다. 두 액터가 같은 클래스를 변경하는일이 없어야 된다. 액터는 변화를 만들어 내는 존재


# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)
* [How System.out.println() really works](https://luckytoilet.wordpress.com/2010/05/21/how-system-out-println-really-works/)
