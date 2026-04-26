---
layout: post
title: "아이템 65. 리플렉션 보다 인터페이스를 사용하라."
date: 2019-03-14 09:26 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 65. 리플렉션 보다 인터페이스를 사용하라.

리플렉션의 단점

* 컴파일 타임 타입 검사가 주는 이점을 하나도 누릴수 없다.
* 리플렉션을 이용하면 코드가 지저분해지고 장황해진다.
* 성능이 떨어진다.

리플렉션은 아주 제한적으로만 사용해야 그 단점을 피하고 이점을 취할수 있다.

만약에 써야 되도 리플렉션은 인스턴스 생성에만 사용하고 이렇게 만든 인스턴스는 상위 클래스나 인터페이스를 참조하여 사용하자.

```java

package com.github.sejoung.codetest.general;


import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.Arrays;
import java.util.Set;

// 리플렉션으로 활용한 인스턴스화 데모
public class ReflectiveInstantiation {
  // 코드 65-1 리플렉션으로 생성하고 인터페이스로 참조해 활용한다. (372-373쪽)
  public static void main(String[] args) {


    // 클래스 이름을 Class 객체로 변환
    Class<? extends Set<String>> cl = null;
    try {
      cl = (Class<? extends Set<String>>)  // 비검사 형변환!
          Class.forName("java.util.HashSet");
    } catch (ClassNotFoundException e) {
      fatalError("클래스를 찾을 수 없습니다.");
    }

    // 생성자를 얻는다.
    Constructor<? extends Set<String>> cons = null;
    try {
      cons = cl.getDeclaredConstructor();
    } catch (NoSuchMethodException e) {
      fatalError("매개변수 없는 생성자를 찾을 수 없습니다.");
    }

    // 집합의 인스턴스를 만든다.
    Set<String> s = null;
    try {
      s = cons.newInstance();
    } catch (IllegalAccessException e) {
      fatalError("생성자에 접근할 수 없습니다.");
    } catch (InstantiationException e) {
      fatalError("클래스를 인스턴스화할 수 없습니다.");
    } catch (InvocationTargetException e) {
      fatalError("생성자가 예외를 던졌습니다: " + e.getCause());
    } catch (ClassCastException e) {
      fatalError("Set을 구현하지 않은 클래스입니다.");
    }

    // 생성한 집합을 사용한다.
    s.addAll(Arrays.asList("a","b","c").subList(1, 3));
    System.out.println(s);
  }

  private static void fatalError(String msg) {
    System.err.println(msg);
    System.exit(1);
  }
}

```
실행결과
```
[b, c]

Process finished with exit code 0

```

위의 예제는 리플리케이션의 단점 2가지를 보여준다.

1. 런타임에 총 6개나 되는 예외를 던질수 있다.

2. 클래스명으로 인스턴스를 생성시키기 위해 25설이 필요하다.


# 참조
-----



