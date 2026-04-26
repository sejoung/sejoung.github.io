---
layout: post
title: "이펙티브 코틀린 아이템 17: 이름 있는 아규먼트를 사용하라"
date: 2022-08-26 06:18 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(가독성)
## 아이템 17: 이름 있는 아규먼트를 사용하라

메소드의 Argument 용도가 분명하게 보이지 않을경우가 있다.

```kotlin

val text = (1..10).joinToString("|")

```

위처럼 joinToString에 | 값이 무엇을 뜻하는지 분명하지 않다.

```kotlin
val text = (1..10).joinToString(separator = "|")

```

코틀린에서는 이름있는 아규먼트를 지원한다.

```kotlin

val separator = "|"
val text = (1..10).joinToString(separator)

```
물론 위와 같은 코드도 의미를 명확하게 알수 있다.

### 이름있는 아규먼트는 언제 사용할까?

이름있는 아규먼트의 장점

* 이름을 기반으로 값이 무엇을 하는지 알수 있다.
* 파라미터 입력 순서와 상관 없으므로 안전하다.

이름있는 아규먼트는 사용 시기

* 디폴트 아규먼트인 경우
* 같은 타입의 파라미터가 많은 경우
* 함수 타입의 파라미터가 있는 경우

### 디폴트 아규먼트인 경우

프로퍼티가 디폴트 아규먼트를 가질경우 항상 붙혀서 사용하는것이 좋다.
일반적으로 함수 이름은 필수 파라미터들과 관련이 있기 때문에 옵션 파라미터에 대한 설명이 부족하다.

### 같은 타입의 파라미터가 많은 경우

같은 타입만 있으면 인자의 순서가 헷갈린다.

```kotlin
fun sendEmail(to: String, massage: String){}

sendEmail(
    to = "aaa@email.com",
    massage = "Hello",
)


```

### 함수 타입 파라미터

일반 적으로 함수타입 파라미터는 마지막에 배치하는것이 좋다.
함수 이름이 함수 타입 아규먼트를 설명해주기도 하기 때문이다.

```kotlin

fun call(before: () -> Unit = {}, after: () -> Unit = {}) {
    before()
    /* ... */
    after()
}

call(before = { print("CALL") } )
call(after = { print("CALL") } )

```

함수타입을 여러개 받을때는 위와 같이 이름있는 아규먼트를 사용하면 훨씬 쉽게 이해 할수 있다.

# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)

