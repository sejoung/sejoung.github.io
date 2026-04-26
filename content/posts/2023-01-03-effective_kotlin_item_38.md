---
layout: post
title: "이펙티브 코틀린 아이템 38: 연산 또는 액션을 전달할 때는 인터페이스 대신 함수 타입을 사용하라"
date: 2023-01-03 21:45 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(클래스설계)
## 아이템 38: 연산 또는 액션을 전달할 때는 인터페이스 대신 함수 타입을 사용하라

대부분의 프로그래밍 언어에서는 함수 타입이 없다. 그래서 액션을 전달할때 메서드가 하나만 있는 인터페이스를 전달한다
이러한 인터페이스를 SAM(Single-Abstract Method)이라 부른다.

```kotlin
interface OnClick {
    fun clicked(view: View)
}

fun setOnClickListener(listener: OnClick) {
    // ...
}

setOnClickListener(object : OnClick {
    override fun clicked(view: View) {
        // ...
    }
})

```

파라미터 전달 방법

* 람다 표현식 또는 익명 함수로 전달

* 함수 레퍼런스 또는 제한된 함수 레퍼런스로 전달

* 선언된 함수 타입을 구현한 객체로 전달

SAM의 장점이 아규먼트에 이름이 붙어있다고 말하는 경우도 있지만, type alias를 이용해 함수 타입도 이름을 붙여 사용할 수 있다.

```kotlin
typealias Onclick = (View) -> Unit
typealias OnClick = (view: View) -> Unit
```

람다 표현식을 사용할 때는 아규먼트 분해(destructure argument)도 사용할 수 있다.


### 언제 SAM을 사용해야 할까?

코틀린이 아닌 다른 언어에서 사용할 클래스를 설계하는 경우라면 SAM을 사용하는것이 좋다.

함수 타입으로 사용할떄 단점

* 함수 타입으로 만들어진 클래스는 자바에서 type alias과 IDE의 지원을 제대로 받을 수 없다.
* 다른 언어(자바 등)에서 코틀린의 함수 타입을 사용하려면 Unit을 명시적으로 리턴하는 함수가 필요하다.


# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)
