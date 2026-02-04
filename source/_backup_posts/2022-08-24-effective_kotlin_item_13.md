---
layout: post
title: "이펙티브 코틀린 아이템 13: Unit? 을 리턴하지 말라"
date: 2022-08-24 09:18 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(가독성)
## 아이템 13: Unit? 을 리턴하지 말라

Unit? 은 Unit 과 null을 반환할수 있다. 하지만 읽을때 오해의 소지가 있으며 예측하기 어려운 오류를 만들수 있다.

Unit? 이 붙은 함수가 만들어지면 아래와 같은 코드가 나올수 있다. 이부분은 가독성 측면에서 이해하기 어렵다.

```kotlin

fun getData(): Unit? = ...

getData()?.let { view.showData(it) } ?: view.showError()

```

# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)

