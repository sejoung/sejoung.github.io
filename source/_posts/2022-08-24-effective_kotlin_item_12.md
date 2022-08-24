---
layout: post
title: "이펙티브 코틀린 아이템 12: 연산자 오버로드를 할 때는 의미에 맞게 사용하라"
date: 2022-08-24 09:09 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(가독성)
## 아이템 12: 연산자 오버로드를 할 때는 의미에 맞게 사용하라

연산자 오버로딩 할때는 항상 신중 해야 된다. 
코틀린에서는 각 연산자의 의미는 항상 같게 유지된다.
그래서 오버로딩해서 연산자의 의미를 바꾸면 혼란스럽게 된다.

### 분명하지 않는 경우

* Infix functions(두개의 변수 가운데 오는 함수)를 활용해서 확장함수를 사용한다.
* top level function을 사용한다.

### 규칙을 무시해도 되는 경우

도메인 특화 언어(Domain Specific Language, DSL) 를 설계할 때는 연산자 오버로딩 규칙을 무시해도 된다.

해당 도메인을 위해 설계된 DSL이기 때문이다.


# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)

