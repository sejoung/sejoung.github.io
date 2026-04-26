---
layout: post
title: "이펙티브 코틀린 아이템 9: use를 사용해 리소스를 닫아라"
date: 2022-08-22 18:05 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(안정성)
## 아이템 9: use를 사용해 리소스를 닫아라

Closeable를 구현하고 있는 클래스들을 처리 할때 try finally 를 사용해서 close 메소드를 호출

java의 try with resource 대신 use 와 Reader.useLines 확장 메소드를 제공한다.

```kotlin
fun countCharactersInFile(path: String): Int {
    BufferedReader(FileReader(path)).use {
        return reader.lineSequence().sumBy { it.length }
    }
}

```

```kotlin

fun countCharactersInFile(path: String): Int {
    File(path).useLines { lines -> 
        lines.sumBy { it.length }
    }
}

```

# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)

