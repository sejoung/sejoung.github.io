---
layout: post
title: "이펙티브 코틀린 아이템 11: 가독성을 목표로 설계하라"
date: 2022-08-22 22:09 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(가독성)
## 아이템 11: 가독성을 목표로 설계하라

코틀린은 간결성을 목표로 설계된 언어가 아니다 가독성을 항상 신경쓰자.

개발자가 코드를 작성하는데 1분 읽는데 10분 걸린다.

### 인식 부하 감소

가독성은 사람마다 다르게 느낄수 있다.
이해하기 쉬운지는 읽는 사람이 얼마나 많은 관용구(구조, 함수, 패턴)에 익숙한지에 따라 달라진다.


```kotlin

// 구현 A
if (person != null && person.isAdult) {
  view.showPerson(person)
} else {
  view.showError()
}

// 구현 B
person?.takeIf { it.isAdult }
  ?.let(view::showPerson)
  ?: view.showError()

```

가독성을 따졌을때는 A 구현이 훨씬 좋다. B 구현은 코틀린에 익숙한 개발자면 좋다고 느끼겠지만 숙련되지 않으면 알아보기 어렵다.

디버깅도 A 구현이 더 좋다. 

### 극단적이 되지 않기

let 으로 인해 예상치 못한 결과가 나올 수 있다고 했다. 그렇다고 let을 쓰지 말고 if-else를 쓰는게 좋다고 말하는게 아니다.

let은 좋은 코드를 만들기 위해 널리/다양하게 활용되는 관용구이다.

nullable 안전 호출

```kotlin
class Person(val name: String)
var person: Person? = null

fun printName() {
	person?.let {
		print(it.name) 
    }
```

연산을 아규먼트 처리 후로 이동시킬 때

```kotlin
students
	.filter { it.result >= 50 }
	.joinToString(separator = "\n") {
		"${it.name} ${it.surname}, ${it.result}"
	}
	.let(::print)
```

데코레이터를 사용해서 객체를 wrap 할 때

```kotlin

var obj = FileInputStream("/file.gz")
	.let(::BufferedInputStream)
	.let(::ZipInputStream)
	.let(::ObjectInputStream)
	.readObject() as SomeObject

```

### 컨벤션

사람에 따라 가독성에 대한 관점이 다르다.

* 함수 이름을 어떻게 지어야 하는지
* 어떤 것이 명시적이고, 어떤 것이 암묵적이어야 하는지
* 어떤 관용구를 사용해야 하는지

최악의 코드
```kotlin

val abc = "A" { "B" } and "C"
print(abc) // ABC

```

이렇게 사용하기 위해서는, 아래와 같은 코드가 필요하다.

```kotlin
operator fun String.invoke(f: ()->String): String = this + f()

infix fun String.and(s: String) = this + s
```

* 연산자는 의미에 맞게 사용해야한다. invoke는 이렇게 사용하면 안된다.
* 람다를 마지막 인자로 사용한다 라는 컨벤션을 적용하면 코드가 복잡해진다
* 함수 이름을 보고 동작을 유추할 수 있어야한다. and를 다른 의미로 사용하고있다.
* 이미 있는 것을 다시 만들 필요는 없다 문자열 결합은 이미 코틀린에 내장된 함수가 있다.

# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)

