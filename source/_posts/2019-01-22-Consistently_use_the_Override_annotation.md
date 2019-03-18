---
layout: post
title: "아이템 40. @Override 에너테이션을 일관성 있게 사용하라."
date: 2019-01-22 09:44 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 40. @Override 에너테이션을 일관성 있게 사용하라.

@Override를 달면 재정의를 잘못하는 경우를 알려준다 아래의 예를 보자.

```java

package com.github.sejoung.codetest.override;

import java.util.HashSet;
import java.util.Set;

// 코드 40-1 영어 알파벳 2개로 구성된 문자열(바이그램)을 표현하는 클래스 - 버그를 찾아보자. (246쪽)
public class Bigram {
    private final char first;
    private final char second;

    public Bigram(char first, char second) {
        this.first  = first;
        this.second = second;
    }

    public boolean equals(Bigram b) {
        return b.first == first && b.second == second;
    }

    public int hashCode() {
        return 31 * first + second;
    }

    public static void main(String[] args) {
        Set<Bigram> s = new HashSet<>();
        for (int i = 0; i < 10; i++)
            for (char ch = 'a'; ch <= 'z'; ch++)
                s.add(new Bigram(ch, ch));
        System.out.println(s.size());
    }
}

```
실행결과
```
260

Process finished with exit code 0
```

위에 코드에서 버그를 찾아 보자 

위에서는 equals를 재정의 하려고 한것 처럼 보인다 그래서 일반규약인 hashCode도 재정의 했다.

그런데 위에는 Override가 아니라 Overloading으로 메소드가 재정의 되었다 위와 같은 실수가 안나오게 하려면
@Override 어너테이션을 달면 된다.

수정코드는 아래와 같다.

```java

package com.github.sejoung.codetest.override;

import java.util.HashSet;
import java.util.Set;

// 코드 40-1 영어 알파벳 2개로 구성된 문자열(바이그램)을 표현하는 클래스 - 버그를 찾아보자. (246쪽)
public class Bigram {
    private final char first;
    private final char second;

    public Bigram(char first, char second) {
        this.first  = first;
        this.second = second;
    }

    @Override
    public boolean equals(Bigram b) {
        return b.first == first && b.second == second;
    }

    public int hashCode() {
        return 31 * first + second;
    }

    public static void main(String[] args) {
        Set<Bigram> s = new HashSet<>();
        for (int i = 0; i < 10; i++)
            for (char ch = 'a'; ch <= 'z'; ch++)
                s.add(new Bigram(ch, ch));
        System.out.println(s.size());
    }
}

```
메시지
```
Error:(16, 5) java: method does not override or implement a method from a supertype

```
위에 처럼 달면 컴파일부터 실패가 나면서 위에 메시지를 보여준다.

그럼 버그를 고친코드는 

```java

package com.github.sejoung.codetest.override;


import java.util.HashSet;
import java.util.Set;

// 버그를 고친 바이그램 클래스 (247쪽)
public class Bigram2 {
    private final char first;
    private final char second;

    public Bigram2(char first, char second) {
        this.first = first;
        this.second = second;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Bigram2))
            return false;
        Bigram2 b = (Bigram2) o;
        return b.first == first && b.second == second;
    }

    public int hashCode() {
        return 31 * first + second;
    }

    public static void main(String[] args) {
        Set<Bigram2> s = new HashSet<>();
        for (int i = 0; i < 10; i++)
            for (char ch = 'a'; ch <= 'z'; ch++)
                s.add(new Bigram2(ch, ch));
        System.out.println(s.size());
    }
}


```
실행결과
```

26

Process finished with exit code 0

```

위와 같이 일괄적으로  @Override를 달자 

예외는 하나만 존재하는데 구체클래스에서 추상메소드를 구현할때는 달지 안아도 된다. 
이것은 구현하지 않으면 컴파일러에서 자동으로 알려줘서 이다. 

아래는 예제

```java

package com.github.sejoung.codetest.override;

public abstract class Test {

    public abstract void test();

}


```

```java

package com.github.sejoung.codetest.override;

public class TestImpl extends Test {

    public void test(String a) {

    }


}


```
컴파일 메시지
```

Error:(3, 31) java: cannot find symbol
  symbol: class Test

```
위에 처럼 잘못 오버라이딩 하면 컴파일러가 알려준다 그래서 @Override를 안해줘도 되지만 해도 무방하다.

```java

package com.github.sejoung.codetest.override;

public class TestImpl extends Test {

    public void test(String a) {

    }


    @Override
    public void test() {
        
    }
}


```


# 참조
-----
* [아이템 11. equals를 재정의 하려면 hashcode도 재정의 하라](https://sejoung.github.io/2018/11/2018-11-27-Always_override_hashCode_when_you_override_equals/)

