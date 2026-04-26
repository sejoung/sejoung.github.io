---
layout: post
title: "아이템 35. ordinals 메서드 대신 instance fields를 사용하라"
date: 2019-01-09 10:01 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 35. ordinals 메서드 대신 instance fields를 사용하라

```java

package com.github.sejoung.codetest.enumtest;

public enum Ensemble {
    SOLO, DUET, TRIO, QUARTET, QUINTET,
    SEXTET, SEPTET, OCTET, DOUBLE_QUARTET,
    NONET, DECTET, TRIPLE_QUARTET;

    public int numberOfMusicians() { return ordinal()+1; }


}


```

```java

package com.github.sejoung.codetest.enumtest;

public class EnsembleTest {

    public static void main(String[] args) {

        Ensemble ensemble=Ensemble.DECTET;

        System.out.println(ensemble.numberOfMusicians());

    }
}


```
실행결과
```
11

Process finished with exit code 0

```

위에서 ordinal() 메소드를 사용했는데 이것은 문제가 많다 일단 중간에 다른 값이 들어간다고 하면 값이 바뀌게 된다 

```java

package com.github.sejoung.codetest.enumtest;

// 인스턴스 필드에 정수 데이터를 저장하는 열거 타입 (222쪽)
public enum Ensemble {
    SOLO, DUET, TRIO, QUARTET, QUINTET,
    SEXTET, SEPTET, OCTET, DOUBLE_QUARTET,OCTET2,
    NONET, DECTET, TRIPLE_QUARTET;

    public int numberOfMusicians() { return ordinal()+1; }

}


```
```java

package com.github.sejoung.codetest.enumtest;

public class EnsembleTest {

    public static void main(String[] args) {

        Ensemble ensemble=Ensemble.DECTET;

        System.out.println(ensemble.numberOfMusicians());

    }
}


```
실행결과
```
12

Process finished with exit code 0

```

OCTET2를 추가하면 결과값이 바뀌게 된다.

java doc를 보면 아래 처럼

```

public final int ordinal()
Returns the ordinal of this enumeration constant (its position in its enum declaration, where the initial constant is assigned an ordinal of zero). 
Most programmers will have no use for this method. It is designed for use by sophisticated enum-based data structures, such as EnumSet and EnumMap.
Returns:
the ordinal of this enumeration constant


```

Most programmers will have no use for this method(대부분의 프로그래머는 이메소드를 쓸일이 없다.)

위에 처럼 코멘트 되어 있다. 그럼 더 나은 방법으로는 아래의 방법이 좋다.

```java

package com.github.sejoung.codetest.enumtest;

// 인스턴스 필드에 정수 데이터를 저장하는 열거 타입 (222쪽)
public enum Ensemble {

    SOLO(1), DUET(2), TRIO(3), QUARTET(4), QUINTET(5),
    SEXTET(6), SEPTET(7), OCTET(8), DOUBLE_QUARTET(8),
    NONET(9), DECTET(10), TRIPLE_QUARTET(12);

    private final int numberOfMusicians;
    Ensemble(int size) { this.numberOfMusicians = size; }
    public int numberOfMusicians() { return numberOfMusicians; }


}


```
```java

package com.github.sejoung.codetest.enumtest;

public class EnsembleTest {

    public static void main(String[] args) {

        Ensemble ensemble=Ensemble.DECTET;

        System.out.println(ensemble.numberOfMusicians());

    }
}


```
실행결과
```
10

Process finished with exit code 0

```
인스턴스 필드에 정수 데이터를 저장하는 열거 타입 으로 선언하면 상수가 추가 되어도 데이터가 바뀌지 않는다.
위에 방법을 사용하자.

# 참조
-----
* [Enum ordinal doc](https://docs.oracle.com/javase/8/docs/api/java/lang/Enum.html#ordinal--)



