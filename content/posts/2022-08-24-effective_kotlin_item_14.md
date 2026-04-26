---
layout: post
title: "이펙티브 코틀린 아이템 14: 변수 타입이 명확하지 않은 경우 확실하게 지정하라"
date: 2022-08-24 09:26 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(가독성)
## 아이템 14: 변수 타입이 명확하지 않은 경우 확실하게 지정하라

코틀린은 개발자가 타입을 지정하지 않아도 타입을 지정해서 넣어주는 굉장히 수준 높은 타입 추론 시스템을 가지고 있다.
이는 개발시간을 줄여주거나 코드를 줄여줘서 가독성이 크게 향상 된다. 하지만 유형이 명확하지 않을때 남용하지 말자.

```kotlin

val data = getSomeData() 

```
위 처럼 유형이 명확하지 않으면 타입을 지정해주는 것이 좋다.

```kotlin

val data: UserData = getSomeData()

```

위에 값을 지정해주면 가독성 측면에서 향상 됩니다.


# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)

