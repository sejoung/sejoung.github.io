---
layout: post
title: "아이템 47: 인라인 클래스의 사용을 고려하라"
date: 2023-03-21 20:46 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(효율성)
## 아이템 47: 인라인 클래스의 사용을 고려하라

inline 으로 만들수 있는것은 함수뿐만 아니다 하나의 값을 보유하는 객체도 inline 으로 만들수 있다

inline 클래스는 아래 상황에 많이 쓰인다

* 측정 단위를 표현할때
* 타입 오용으로 발생하는 문제를 막을때

인터페이스를 구현하는 인라인 클래스는 inline 으로 동작하지 않는다
그래서 장점이 아무것도 없다

typealias 를 사용하면 타입에 새로운 이름을 붙혀줄수 있다
하지만 안전하지 않다 

인라인 클래스를 사용하면 오버헤드없이 타입을 래핑 할 수 있다

# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)
