---
layout: post
title: "이펙티브 코틀린 아이템 39: 태그 클래스보다는 클래스 계층을 사용하라"
date: 2023-01-03 22:02 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(클래스설계)
## 아이템 39: 태그 클래스보다는 클래스 계층을 사용하라

상수(constant) 모드를 가진 클래스를 많이 볼수 있다. 이러한 상수 모드를 태그(tag)라고 부르며 태크를 포함한 클래스를 태그 클래스라고 부른다.

태그 클래스는 서로다른 책임을 한 클래스에 태그로 넣는 문제를 가진다.

```kotlin

class ValueMatcher<T> private constructor(
    private val value: T? = null,
    private val matcher: Matcher
){
    fun match(value: T?) = when(matcher) {
        Matcher.EQUAL -> value == this.value
        Matcher.NOT_EQUAL -> value != this.value
        Matcher.LIST_EMPTY -> value is List<*> && value.isEmpty()
        Matcher.LIST_NOT_EMPTY -> value is List<*> && value.isNotEmpty()
    }
    enum class Matcher {
        EQUAL,
        NOT_EQUAL,
        LIST_EMPTY,
        LIST_NOT_EMPTY
    }
    companion object {
        fun <T> equal(value: T) = 
            ValueMatcher<T>(value = value, matcher = Matcher.EQUAL)
        fun <T> notEqual(value: T) =
            ValueMatcher<T>(value = value, matcher = Matcher.NOT_EQUAL)
        fun <T> emptyList(value: T) =
            ValueMatcher<T>(value = value, matcher = Matcher.LIST_EMPTY)
        fun <T> notEmptyList(value: T) =
            ValueMatcher<T>(value = value, matcher = Matcher.LIST_NOT_EMPTY)
    }
}

```
태그 클래스의 단점

* 한 클래스에 여러 모드를 처리하기 위한 상용구(boilerplate)가 추가된다.
* 여러 목적으로 사용해야 하므로 프로퍼티가 일관적이지 않게 사용될 수 있다. (value는 LIST_EMPTY, LIST_NOT_EMPTY일때 사용 안됨)
* 요소가 여러 목적을 가지고 요소를 여러 방법으로 설정할 수 있는 경우 상태의 일관성과 정확성을 지키기 어렵다.
* 팩토리 메소드를 사용해야 하는 경우가 많다. 그렇지 않으면 객체가 제대로 생성되었는지 확인하는 것 자체가 어렵다.

코틀린에서는 일반적으로 태그 클래스보다 sealed 클래스를 많이 사용한다. 한 클래스에 여러 모드를 만드는 방법 대신에 각각의 모드를 여러 클래스로 만들고 타입 시스템과 다형성을 활용하는 것이다.

```kotlin
sealed class ValueMatcher<T> {
    abstract fun match(value: T): Boolean

    class Equal<T>(private val value: T) : ValueMatcher<T>() {
        override fun match(value: T): Boolean = value == this.value
    }

    class NotEqual<T>(private val value: T) : ValueMatcher<T>() {
        override fun match(value: T): Boolean = value != this.value
    }

    class EmptyList<T>() : ValueMatcher<T>() {
        override fun match(value: T): Boolean = value is List<*> && value.isEmpty()
    }

    class NotEmptyList<T>() : ValueMatcher<T>() {
        override fun match(value: T): Boolean = value is List<*> && value.isNotEmpty()
    }
}

```

### sealed 한정자

sealed 한정자를 반드시 사용해야 하는 것은 아니다. 대신 abstract 한정자를 사용할 수도 있지만 sealed 한정자는 외부 파일에서 서브클래스를 만드는 행위 자체를 모두 제한한다.

sealed class 의 장점

* 외부에서 추가적인 서브클래스를 만들 수 없으므로 타입이 추가되지 않는 것이 보장된다. 따라서 when을 사용할 때 else 브랜치를 만들 필요가 없다.
* 위 장점을 이용해 새로운 기능을 쉽게 추가할 수 있으며 when 구문에서 처리하는 것을 잊어버리지 않을 수 있다.

```kotlin
fun <T> ValueMatcher<T>.reversed(): ValueMatcher<T> =
    when (this) {
        is ValueMatcher.EmptyList -> ValueMatcher.EmptyList<T>()
        is ValueMatcher.NotEmptyList -> ValueMatcher.NotEmptyList<T>()
        is ValueMatcher.Equal -> ValueMatcher.Equal<T>(value)
        is ValueMatcher.NotEqual -> ValueMatcher.NotEqual<T>(value)
    }
```

클래스의 서브 클래스를 제어하려면 sealed 한정자를 사용하고 abstract는 상속과 관련된 설계를 할 때 사용한다.

### 태그 클래스와 상태 패턴의 차이

태그 클래스와 상태 패턴(state pattern)을 혼동하면 안된다. 상태 패턴은 객체의 내부 상태가 변화할 때, 객체의 동작이 변하는 소프트웨어 디자인 패턴이다.

```kotlin
sealed class WorkoutState

class PrepareState(val exercise: Exercise) : WorkoutState()
class ExerciseState(val exercise: Exercise) : WorkoutState()
object DoneState : WorkoutState()

fun List<Exercise>.toStates(): List<WorkoutState> = 
    flatMap { exercise -> 
        listOf(PrepareState(exercise), ExerciseState(exercise))
    } + DoneState

class WorkoutPresenter( /*...*/ ) {
    private var state: WorkoutState = states.first()
    
    // ...
}
```
차이점
* 상태는 더 많은 책임을 가진 클래스이다
* 상태는 변경할 수 있다



# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)
