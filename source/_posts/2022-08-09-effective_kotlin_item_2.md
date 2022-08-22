---
layout: post
title: "이펙티브 코틀린 아이템 2: 변수의 스코프를 최소화하라"
date: 2022-08-09 14:50 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(안정성)
## 아이템 2: 변수의 스코프를 최소화하라

상태를 정의할 때는 변수와 프로퍼티는 스코프를 최소화 하는것이 좋다.

* 프로퍼티보다 지역 변수를 사용하는것이 좋다.
* 최대한 좁은 스코프를 갖게 변수를 사용하자.

여러 프로퍼티를 한꺼번에 설정해야 하는 경우에는 구조분해 선언을 사용하는 것이 좋다.

스코프를 좁게 만들고 var 대신 val 을 사용하는게 좋습니다.

# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)

