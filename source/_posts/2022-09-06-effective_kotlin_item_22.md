---
layout: post
title: "이펙티브 코틀린 아이템 22: 일반적인 알고리즘을 구현할 때 제네릭을 사용하라"
date: 2022-09-06 14:10 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(재사용성)
## 아이템 22: 일반적인 알고리즘을 구현할 때 제네릭을 사용하라

타입 아규먼트를 사용하는 함수를 제네릭 함수라고 부른다.(예 stdlib에 있는 filter 함수)

타입 파라미터는 컴파일러에 타입과 관련된 정보를 제공하여 컴파일러가 타입을 정확하게 추측할수 있다.

### 제네릭 제한

타입 파라미터의 중요한 기능 중 하나는 구체적인 타입의 서브타입만 사용하게 타입을 제한하는것

```kotlin

class ListAdapter<T : ItemAdapter>(...) {
  ...
}

fun <T : Comparable<T>> Iterable<T>.sorted(): List<T> {
  ...
}

```

# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)
