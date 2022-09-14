---
layout: post
title: "이펙티브 코틀린 아이템 23: 타입 파라미터의 섀도잉을 피하라"
date: 2022-09-14 22:40 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(재사용성)
## 아이템 23: 타입 파라미터의 섀도잉을 피하라

```kotlin

class Forest(val name: String){
    
    fun addTree(name: String){
        //....
    }
}

```
지역 파라미터가 외부 스코프에 있는 프로퍼티를 가린다. 이를 새도잉이라고 한다.

```kotlin

interface Tree

class Birch: Tree
class Spruce: Tree

class Forest<T: Tree> {
    fun <T: Tree> addTree(tree: T){
        //....
    } 
}


val forest = Forest<Birch>()
forest.addTree(Birch())
forest.addTree(Spruce())

```
위와 같이 선언하면 타입 파라미터가 새도잉된다.

하지만 위처럼 독립적으로 동작합니다.

```kotlin
class Forest<T: Tree> {
    fun addTree(tree: T){
        //....
    } 
}

val forest = Forest<Birch>()
forest.addTree(Birch())
forest.addTree(Spruce()) // Error
```
위처럼 선언해야 의도한 방식대로 동작할것입니다.

```kotlin
class Forest<T: Tree> {
    fun <ST: T> addTree(tree: ST){
        //....
    } 
}
```
독립적으로 선언하고 싶으면 이름을 아에 다르게 선언하는것이 좋다.

# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)
