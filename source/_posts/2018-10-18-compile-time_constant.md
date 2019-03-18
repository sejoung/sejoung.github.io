---
layout: post
title: "compile-time_constant"
date: 2018-10-18 15:20 +0900
comments: true
tags : ["compile-time_constant"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### compile-time_constant


```java

package com.github.sejoung.codetest.singleton;

class OldSingleton {
    //compile-time constant
    final static String NAME = "OldSingleton";
 
    final static String NAME = new String("OldSingleton");
    final static OldSingleton INSTANCE = new OldSingleton();

    private OldSingleton() {
        System.out.println("hi");
    }

}
```

위에 코드에서 아래의 변수를 선언하면 compile-time constant라고 하는데 컴파일 시점에 상수를 참조 하고 있는 값을 상수 내부의 값으로 바꿔준다.

```java

final static String NAME = "OldSingleton";

```

그래서 아래의 코드를 찍어 보면 

```java

package com.github.sejoung.codetest.singleton;

public class SingletonTest {
    
    public static void main(String[] args) {
        System.out.println("1======================");
        System.out.println(OldSingleton.NAME);
        System.out.println("2======================");
        OldSingleton oldSingleton1 = OldSingleton.INSTANCE;
        System.out.println("3======================");
        OldSingleton oldSingleton2 = OldSingleton.INSTANCE;
        System.out.println("4======================");
        System.out.println(oldSingleton1 == oldSingleton2);

    }

}


```

아래 처럼 static 변수를 선언해서 가지고 와도 싱글톤 객체가 참조 되는 순간 new되는 것 처럼 보인다.

```

1======================
OldSingleton
2======================
hi
3======================
4======================

```
 
하지만 위에서 말했듯이 compile-time constant라서 정상인것처럼 보였지만 코드를 아래 처럼 변경 해주면

```java

 final static String NAME = new String("OldSingleton");

```

아래 처럼  OldSingleton.NAME 참조 되는 순간 객체가 생성 되는 것이 보인다.
 
 ```
1======================
hi
OldSingleton
2======================
3======================
4======================
true
 ```
 
 
# 참조 
-----
* [[HQ] 케빈 TV 30회 (2부) - 패턴 이야기 - 싱글톤 패턴](https://www.youtube.com/watch?v=ZrF8r5LUadc)
* [compile-time-constants-and-variables](https://stackoverflow.com/questions/9082971/compile-time-constants-and-variables)
* [Initialization-on-demand holder idiom](https://en.wikipedia.org/wiki/Initialization-on-demand_holder_idiom)