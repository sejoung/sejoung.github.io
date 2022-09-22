---
layout: post
title: "이펙티브 코틀린 아이템 30: 요소의 가시성을 최소화하라"
date: 2022-09-22 10:00 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(추상화 설계)
## 아이템 30: 요소의 가시성을 최소화하라

API를 설계할때 간결한 API를 선호하는 이유

* 작은 인터페이스는 배우기 쉽고 유지하기 쉽다.
* 기능이 많은 클래스보다 작은 클래스이 이해하기 쉽다.
* 유지보수가 편하다.

변경을 가할떄는 기존것을 숨기는것 보다 새로운것을 만드는것이 편하다 그래서 가시성을 최소화 시키는것이 좋다.
그리고 갑자기 가시성을 제한하면 다른곳에서 사용이 어렵다. 따라서 처음엔 작은 API로 개발을 강제하는것이 좋다.

```kotlin
class CounterSet<T>(
    private val innerSet: MutableSet<T> = mutableSetOf()
) : MutableSet<T> by innerSet{

    var elementsAdded: Int = 0
        private set

    override fun add(element: T): Boolean {
        elementsAdded++
        return innerSet.add(element)
    }

    override fun addAll(elements: Collection<T>):Boolean {
        elementsAdded += elements.size
        return innerSet.addAll(elements)
    }

}
```

### 가시성 한정자 사용하기

클래스의 맴버의 경우

* public(default): 어디에서나 볼 수 있다.
* private: 클래스 내부에서만 볼 수 있다.
* protected: 클래스와 서브클래스 내부에서만 볼 수 있다.
* internal: 모듈 내부에서만 볼 수 있다.

톱레벨 요소

* public(default): 어디에서나 볼 수 있다.
* private: 같은 파일 내부에서만 볼 수 있다.
* internal: 모듈 내부에서만 볼 수 있다.

### 결론

* 인터페이스가 작을수록 이를 공부하고 유지하는 것이 쉽다.
* 최대한 제한이 되어 있어야 변경하기 쉽다.
* 클래스의 상태를 나타내는 프로퍼티가 노출되어 있다면, 클래스가 자신의 상태를 책임질 수 없다.
* 가시성이 제한되면 API의 변경을 쉽게 추적할 수 있다.

# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)
