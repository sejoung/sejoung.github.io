---
layout: post
title: "아이템 30. 이왕이면 제네릭 메서드로 만들어라"
date: 2018-12-31 16:18 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 30. 이왕이면 제네릭 메서드로 만들어라

```java

package com.github.sejoung.codetest.generics.method;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

// 제네릭 union 메서드와 테스트 프로그램 (177쪽)
public class Union {

    // 코드 30-2 제네릭 메서드 (177쪽)
    public static Set union(Set s1, Set s2) {
        Set result = new HashSet(s1);
        result.addAll(s2);
        return result;
    }

    // 코드 30-3 제네릭 메서드를 활용하는 간단한 프로그램 (177쪽)
    public static void main(String[] args) {
        Set<String> guys = Set.of("톰", "딕", "해리");
        Set<String> stooges = Set.of("래리", "모에", "컬리");
        Set<String> aflCio = union(guys, stooges);
        System.out.println(aflCio);
    }
}

```
컴파일 메시지
```
Warning:(20, 22) java: unchecked call to HashSet(java.util.Collection<? extends E>) as a member of the raw type java.util.HashSet
Warning:(21, 22) java: unchecked call to addAll(java.util.Collection<? extends E>) as a member of the raw type java.util.Set
Warning:(29, 35) java: unchecked conversion
  required: java.util.Set<java.lang.String>
  found:    java.util.Set
  
```

위처럼 메시지가 나오는데 수정을 하면 

```java

package com.github.sejoung.codetest.generics.method;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

// 제네릭 union 메서드와 테스트 프로그램 (177쪽)
public class Union {

    // 코드 30-2 제네릭 메서드 (177쪽)
    public static <E> Set<E> union(Set<E> s1, Set<E> s2) {
        Set<E> result = new HashSet<>(s1);
        result.addAll(s2);
        return result;
    }

    // 코드 30-3 제네릭 메서드를 활용하는 간단한 프로그램 (177쪽)
    public static void main(String[] args) {
        Set<String> guys = Set.of("톰", "딕", "해리");
        Set<String> stooges = Set.of("래리", "모에", "컬리");
        Set<String> aflCio = union(guys, stooges);
        System.out.println(aflCio);
    }
}

```

메시지는 없고 정상적으로 나온다.

```java

package com.github.sejoung.codetest.generics.method;

import java.util.function.UnaryOperator;

// 제네릭 싱글턴 팩터리 패턴 (178쪽)
public class GenericSingletonFactory {
    // 코드 30-4 제네릭 싱글턴 팩터리 패턴 (178쪽)
    private static UnaryOperator<Object> IDENTITY_FN = (t) -> t;

    @SuppressWarnings("unchecked")
    public static <T> UnaryOperator<T> identityFunction() {
        return (UnaryOperator<T>) IDENTITY_FN;
    }

    // 코드 30-5 제네릭 싱글턴을 사용하는 예 (178쪽)
    public static void main(String[] args) {
        String[] strings = { "삼베", "대마", "나일론" };
        UnaryOperator<String> sameString = identityFunction();
        for (String s : strings)
            System.out.println(sameString.apply(s));

        Number[] numbers = { 1, 2.0, 3L };
        UnaryOperator<Number> sameNumber = identityFunction();
        for (Number n : numbers)
            System.out.println(sameNumber.apply(n));
    }
}


```

실행결과

```
삼베
대마
나일론
1
2.0
3

Process finished with exit code 0

```

```java

package com.github.sejoung.codetest.generics.method;

import java.util.*;

// 재귀적 타입 한정을 이용해 상호 비교할 수 있음을 표현 (179쪽)
public class RecursiveTypeBound {
    // 코드 30-7 컬렉션에서 최댓값을 반환한다. - 재귀적 타입 한정 사용 (179쪽)
    public static <E extends Comparable<E>> Optional<E> max(Collection<E> c) {
        if (c.isEmpty())
            return Optional.empty();

        E result = null;
        for (E e : c) {
            if (result == null || e.compareTo(result) > 0)
                result = Objects.requireNonNull(e);
        }
        return Optional.of(result);
    }

    public static void main(String[] args) {
        List<String> argList = Arrays.asList("a","b","c");
        max(argList).ifPresent((values)->{
            System.out.println(values);
        });
    }
}
```
실행결과
```
c

Process finished with exit code 0
```


# 참조
-----

