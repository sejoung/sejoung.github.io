---
layout: post
title: "아이템 64. 객체는 인터페이스를 사용해 참조하라."
date: 2019-03-13 09:30 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 64. 객체는 인터페이스를 사용해 참조하라.

적합한 인터페이스가 있다면 매개변수 뿐 아니라 반환값, 변수, 필드를 전부 인터페이스 타입으로 선언하라.

아래는 좋은 예로 인터페이스 타입을 사용하였다.

```java

    // 좋은 예. 인터페이스 타입을 사용하였다.
    Set<String> stringSet = new LinkedHashSet<>();

```

아래는 나쁜예로 클래스 타입을 사용하였다.

```java

    // 나쁜 예. 클래스 타입을 사용하였다.
    LinkedHashSet<String> stringSet = new LinkedHashSet<>();


```

인터페이스 타입을 사용하는 습관을 길러두면 프로그래밍이 훨씬 유연해진다.

적합한 인터페이스가 없다면 당연히 클래스를 참조해야 된다.

적합한 인터페이스가 없다면 클래스의 계층구조중에 필요한 기능을 만족하는 가장 덜 구체적인 클래스 타입을 사용하자.(예: java.io.OutputStream)




# 참조
-----
* [java docs OutputStream](https://docs.oracle.com/javase/7/docs/api/java/io/OutputStream.html)
