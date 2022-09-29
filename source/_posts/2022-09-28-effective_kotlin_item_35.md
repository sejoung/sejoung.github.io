---
layout: post
title: "이펙티브 코틀린 아이템 35: 복잡한 객체를 생성하기 위한 DSL을 정의하라"
date: 2022-09-27 12:41 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(객체생성)
## 아이템 35: 복잡한 객체를 생성하기 위한 DSL을 정의하라

함수 타입의 몇가지 예

* ()->Unit : 아규먼트를 갖지 않고, Unit을 리턴하는 함수
* (Int)->Unit : Int를 아규먼트로 받고, Unit을 리턴하는 함수
* (Int)->Int : Int를 아규먼트로 받고, Int를 리턴하는 함수
* (Int, Int)->Int : Int 2개를 아규먼트로 받고, Int를 리턴하는 함수
* (Int)->()->Unit : Int를 아규먼트로 받고, 다른 함수를 리턴하는 함수 이때 다른함수는 아규먼트로 아무것도 받지 않고 Unit을 리턴
* (()->Unit)->Unit : 다른 함수를 아규먼트로 받고, Unit을 리턴하는 함수

함수 타입을 만드는 기본적인 방법
* 람다 표현식
* 익명함수
* 함수 레퍼런스

```kotlin
fun plus(a: Int, b: Int) = a + b

val plus1: (Int, Int)->Int = {a, b -> a + b}
val plus2: (Int, Int)->Int = fun(a, b) = a + b
val plus3: (Int, Int)->Int = ::plus
val plus4 = {a: Int, b: Int -> a + b}
val plus5 = fun(a: Int, b: Int) = a + b

```

함수타입은 함수를 나타내는 객체를 표현하는 타입

확장함수(리시버를 가진 함수타입)

```kotlin
fun Int.myPlus(other: Int) = this + other
val myPlus: Int.(Int)->Int = fun Int.(other: Int) = thie + other
val myPlus = fun Int.(other: Int) = thie + other

```
리시버를 가진 함수타입의 호출 방법

* 일반적인 객체처럼 invoke 메서드를 사용
* 확장 함수가 아닌 함수처럼 사용
* 일반적인 확장함수처럼 사용

```kotlin
myPlus.invoke(1,2)
myPlus(1,2)
1.myPlus(2)
```

리시버를 가진 함수타입의 가장 중요한 특징은 this의 참조 대상을 변경할수 있다.

```kotlin
inline fun <T> T.apply(block: T.() -> Unit): T {
    this.block()
    return this
}

class User {
    var name: String = ""
    var surname: String = ""
}

val user = User().apply { 
    name = "sejoung"
    surname = "kim"
}
```


### DSL 의 사용

* 복잡한 자료구조
* 계층적인 구조
* 거대한 양의 데이터


# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)
