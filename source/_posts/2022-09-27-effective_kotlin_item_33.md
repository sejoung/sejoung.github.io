---
layout: post
title: "이펙티브 코틀린 아이템 33: 생성자 대신 팩토리 함수를 사용하라"
date: 2022-09-27 12:41 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(객체생성)
## 아이템 33: 생성자 대신 팩토리 함수를 사용하라

생성자 역활을 대신해주는 함수를 팩토리 함수

팩토리 함수의 장점

* 함수의 이름을 붙일수 있다
* 함수가 원하는 타입을 리턴할 수 있다
* 호출될때 마다 새객체를 만들 필요가 없다
* 아직 존재하지 않는 객체를 리턴할 수 있다
* 객체 외부에 팩토리 함수를 만들면 가시성을 원하는 대로 조정할수 있다
* 팩토리 함수는 인라인으로 만들수 있으며 그 파라미터들을 reified로 만들수 있다
* 생성자로 만들기 복잡한 객체도 만들수 있다
* 원하는 때에 생성자를 호출할수 있다

팩토리 함수의 제약

서브클레스 생성에는 슈퍼클래스 생성자가 필요하기 때문에 서브 클래스를 만들어 낼수 없다.

### Companion 객체 팩토리 함수

자바의 정적 팩토리 함수

c++ 이름을 가진 생성자

많이 사용되는 함수 이름
* from : 파라미터를 하나 받고, 같은 타입의 인스턴스를 하나 리턴하는 타입의 변환 함수
* of : 파라미터를 여러개 받고, 이를 통합하여 인스턴스를 만들어 주는 함수
* valueOf : from 또는 of 와 비슷한 기능을 하면서 의미를 조금 더 쉽게 읽을수 있게 이름을 붙힘 함수
* instance or getInstance : 싱글턴으로 인스턴스 하나를 리턴하는 함수
* createInstance : instance or getInstance 처럼 동작하지만 싱글턴이 적용되지 않아 매번 인스턴스를 새롭게 만드는 함수
* getType : getInstance 처럼 동작하지만 팩토리 함수가 다른 클래스에 있을때 사용하는 함수
* newType : createInstance 처럼 동작하지만 팩토리 함수가 다른 클래스에 있을때 사용하는 함수

추상 Companion 객체 팩토리는 값을 가질수 있다 캐싱을 구현 하거나 테스트를 위한 가짜 객체 생성할수 있다.

### 확장 팩토리 함수

```kotlin
interface Tool {
    companion object {}
}

fun Tool.Companion.createBigTool() : BigTool{
}
```
* companion 객체가 존재할 때, 객체의 함수처럼 사용할 수 있는 팩토리 함수를 만들어야 할 때 사용

### 톱레벨 팩토리 함수

* 대표적인 예 listOf, setOf, mapOf
* public 톱 레벨 함수는 모든곳에서 사용할 수 있으므로 ide가 제공하는 팁을 복잡하게 만드는 단점

### 가짜 생성자

```kotlin
List(4) {"User$it"}

inline fun <T> List(
size:Int,
init: (index:Int)->T
): List<T> = MutableList(size,init)


class Tree<T> {
    companion object {
        operator fun <T> invoke(size: Int, generator: (Int) -> T): Tree <T>
    }
}

```
invoke 연산자를 갖는 companion 객체를 사용할 수도 있는데 추천 하지 않는 방식이다

* 인터페이스를 위한 생성자를 만들고 싶을때
* reified 타입 아규먼트를 갖게 하고 싶을때

### 팩토리 클래스의 메서드

```kotlin

class SutudentsFactory{
     var nextId = 0
     fun next(name:String,surname:String = Student(nextId++,name,surname)
}
```

* 팩토리 클래스는 프로퍼티를 가질 수 있다

# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)
