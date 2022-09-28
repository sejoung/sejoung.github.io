---
layout: post
title: "이펙티브 코틀린 아이템 34: 기본 생성자에 이름 있는 옵션 아규먼트를 사용하라"
date: 2022-09-27 12:41 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(객체생성)
## 아이템 34: 기본 생성자에 이름 있는 옵션 아규먼트를 사용하라

기본 생성자 : 객체를 정의하고 생성하는 방법을 지정할때 사용하는 가장 기본적인 방법

```kotlin
class User(var name: String, var surname: String)

val user = User("Zola", "Gianfranco")
```

### 점층적 생성자 패턴(telescoping constructor pattern)

```kotlin

class Pizza {
    val size: String
    val cheese: Int
    val olives: Int
    val bacon: Int
    
    constructor(size: String, cheess: Int, olives: Int, bacon: Int) {
        this.size = size
        this.cheess = cheess
        this.olives = olives
        this.bacon = bacon
    }
    constructor(size: String, cheese: Int, olives: Int): this(size, cheese, olives, 0)
    constructor(size: String, cheese: Int): this(size, cheese, 0)
    constructor(size: String): this(size, 0)
}

```

코틀린은 디폴트 아규먼트(default argument)를 사용할 수 있기 때문에 아래처럼 사용할수 있다.

```kotlin

class Pizza(
    val size: String,
    val cheese: Int = 0,
    val olives: Int = 0,
    val bacon: Int = 0
)

```

### 빌더 패턴(builder pattern)

자바에서는 네임드 파라미터(named parameter)와 디폴트 아규먼트(default argument)를 사용할 수 없다. 그래서 빌더 패턴을 사용한다.

빌더 패턴의 장점

* 파라미터에 이름을 가진다.
* 파라미터를 원하는 순서대로 지정
* 디폴트 값을 지정


```kotlin
class Pizza private constructor(
    val size: String,
    val cheese: Int,
    val olives: Int,
    val bacon: Int
) {
    class Builder(private val size: String) {
        private var cheese: Int = 0
        private var olives: Int = 0
        private var bacon: Int = 0
        
        fun setCheese(value: Int): Builder = apply {
            cheese = value
        }
        
        // ...
        
        fun build() = Pizza(size, cheese, olives, bacon)
    }
}
```

코틀린은 빌더 패턴을 사용하는것 보다 네임드 파라미터를 사용하는게 좋다.

값의 의미를 묶어서 지정할때나 특정값을 누적하는 형태로 사용될때 빌더 패턴을 이용하는것이 나을수도 있는데
코틀린에서는 DSL 빌더를 이용해서 구현하는것을 더 좋게 본다(?)

빌더 패턴은 다음과 같은 경우에만 사용

* 빌더 패턴을 사용하는 다른 언어로 작성된 라이브러리를 그대로 옮길 때
* 디폴트 아규먼트와 DSL을 지원하지 않는 다른 언어에서 쉽게 사용할 수 있게 API를 설계할 때




# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)
