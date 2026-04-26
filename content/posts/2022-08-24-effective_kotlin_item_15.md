---
layout: post
title: "이펙티브 코틀린 아이템 15: 리시버를 명시적으로 참조하라"
date: 2022-08-24 09:36 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(가독성)
## 아이템 15: 리시버를 명시적으로 참조하라

무언가를 더 자세하기 설명하기 위해 명시적으로 긴코드를 사용할때가 있다.
대표적으로 함수와 프로퍼티 지역 또는 톱레벨 변수가 아닌 다른 리시버로부터 가지고 온다는것을 나타낼때가 있다.
예를 들면 클래스의 메서드라는것을 나타내기 위한 this가 있다.

리시버를 명시적으로 사용안한 경우

```kotlin

fun <T : Comparable<T>> List<T>.quickSort(): List<T> {
    if (size < 2) return this
}

```
리시버를 명시적으로 사용한 경우
```kotlin

fun <T : Comparable<T>> List<T>.quickSort(): List<T> {
    if (this.size < 2) return this
}

```

### 여러 개의 리시버

스코프 내부의 둘 이상의 리시버가 있는 경우 리시버를 명시적으로 나타내면 좋다.

apply, with, run 함수를 사용할때가 대표적인 예이다.

```kotlin

class Node(val name: String){
    
    fun makeChild(child: String) {
        create("$name.$child")
            .apply { print("Created ${name}") }
    }

    fun create(name: String) = Node(name)
}

fun main() {
    val node = Node("parent")
    node.makeChild("child") 
}

```

위에 코드는 의도한대로 동작하지 않는다 this name이 Node의 name 출력하길 원했지만 그렇게 동작하지 않는다. 이럴때 this를 명시하자

좋은 선택지는 also를 사용하는것이다. 람다 함수를 인자로 받기 때문에 명시적으로 지정하게 된다.

```kotlin
class Node(val name: String){

    fun makeChild(child: String) {
        create("$name.$child")
            .also { print("Created ${it.name}") }
    }

    fun create(name: String) = Node(name)
}
```

### DSL 마커 

코틀린 DSL을 사용할 때는 여러 리시버를 가진 요소들이 중첩되더라고 리시버를 명시적으로 붙히지 않는다. 
DSL은 원래 그렇게 사용하도록 설계 되었기 때문이다.

```kotlin
table {
    tr{
        td{ + "Column1"}
        td{ + "Column2"}
    }
    tr{
        td{ + "Value1"}
        td{ + "Value2"}
    }
}
```

기본적으로 모든 스코프에서 외부 스코프에 있는 리시버의 메서드를 사용할수 있다. 이러면 코드에 문제가 생긴다.

```kotlin

table {
    tr{
        td{ + "Column1"}
        td{ + "Column2"}
        tr{
            td{ + "Value1"}
            td{ + "Value2"}
        }
    }
}

```
위에 코드에서 안쪽의 tr이 외부 스코프의 tr을 사용하는것인지 내부의 tr을 사용하는것인지 알기 어렵다.
코틀린에서 DslMarker 어노테이션을 제공한다.

```kotlin

@DslMarker
annotation class HtmlDsl

@HtmlDsl
class TableDsl { /*...*/ }

fun table(f: TableDsl.() -> Unit) { /*...*/ }

```

이를 사용하면, 암묵적으로 외부스코프의 리시버를 호출하게되면 컴파일 오류가 발생한다.


```kotlin
table {
    tr{
        td{ + "Column1"}
        td{ + "Column2"}
    }
    this@table.tr{
        td{ + "Value1"}
        td{ + "Value2"}
    }
}
```
외부 스코프의 함수를 사용하고 싶으면 위에처럼 명시적으로 사용해야 된다.

짧다는 이유로 리시버를 제거하지 말아라.

# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)

