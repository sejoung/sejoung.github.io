---
layout: post
title: "아이템 49: 하나 이상의 처리 단계를 가진 경우에는 시퀀스를 사용하라"
date: 2023-03-27 21:24 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(효율성)
## 아이템 49: 하나 이상의 처리 단계를 가진 경우에는 시퀀스를 사용하라

Iterable 과 Sequence 는 완전히 다른 목적으로 설계되어서 완전히 다른 형태로 동작한다
Sequence 는 지연 처리 된다

시퀀스 지연처리의 장점
* 자연스러운 처리 순서를 유지함
* 최소한만 연산함
* 무한 시컨스 형태로 사용할 수 있음
* 각각의 단계에서 컬렉션을 만들어 내지 않음


시퀀스가 빠르지 않는경우
* stdlib의 sorted
* 무한 시퀀스에서 sorted를 사용할수 없다

# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)
