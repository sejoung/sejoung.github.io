---
layout: post
title: "이펙티브 코틀린 아이템 36: 상속보다는 컴포지션을 사용하라"
date: 2022-12-30 11:31 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(클래스설계)
## 아이템 36: 상속보다는 컴포지션을 사용하라

단순하게 코드 추출 또는 재사용을 위해 상속을 하려고 한다면, 조금 더 신중하게 생각해야 한다.

### 간단한 행위 재사용

상속의 단점

* 상속은 하나의 클래스만을 대상으로 할 수 있다. 상속을 사용해서 행위를 추출하다 보면 거대한 Base 클래스를 만들게 되고 복잡한 계층 구조가 만들어 진다.
* 상속은 클래스의 모든것을 가지고 오게 된다. 불필요한 함수를 갖는 클래스가 만들어진다.
* 상속은 이해하기 어렵다.

컴포지션을 사용하는것은 객체를 프로퍼티로 갖고 함수를 호출하는 형태로 재사용하는 것을 의미 한다.

### 모든것을 가지고 올 수밖에 없는 상속

상속은 슈퍼클래스의 매서드, 제약, 행위 등 모든 것을 가지고 온다. 객체의 계층구조를 나타낼 때 굉장히 좋은 도구

하지만 그래서 단점도 존재 한다. 필요 없는 매소드는 오버라이딩 해서 처리해야 된다.(인터페이스 분리 원칙의 위배)

### 캡슐화를 깨는 상속

```kotlin
class CounterSet<T> : HashSet<T>() {
    var elementsAdded: Int = 0
        private set

    override fun add(element: T): Boolean {
        ...
    }

    override fun addAll(): Boolean {
        elementsAdded += elements.size
        return super.addAll(elements)
    }
}
```
위임 패턴, 포워딩 매소드 

위임 패턴을 쉽게 구현할수 있는 문법을 제공해 준다.

```kotlin
class CounterSet<T>(
    private val innerSet: MutableSet<T> = mutableSetOf()
) : MutableSet<T> by innerSet {
    var elementsAdded: Int = 0

    override fun add(element: T): Boolean {
        ...
    }

    override fun addAll(): Boolean {
        elementsAdded += elements.size
        return innerSet.addAll(elements)
    }
}
```

### 오버라이딩 제한하기

개발자가 상속용으로 설계 되지 않은 클래스의 상속을 막을려면 final 키워드를 붙히면 된다. 
하지만 어떤 이유에서 상속은 허용하지만 메소드의 오버라이딩만 제한하고 싶을때는 open 키워드를 사용하면 된다.

open 클래스는 open된 메소드만 오버라이딩 가능하다.

정리 

* 컴포지션은 더 안전하다.
* 컴포지션이 더 유연하다.
* 컴포지션이 더 명시적이다.

* 컴포지션은 생각보다 번거롭다.
* 다형성을 가지기 어렵다.

# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)
