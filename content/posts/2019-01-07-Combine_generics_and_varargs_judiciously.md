---
layout: post
title: "아이템 32. 제네릭과 가변인수를 함께 쓸 때는 신중하라."
date: 2019-01-07 11:25 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 32. 제네릭과 가변인수를 함께 쓸 때는 신중하라.

가변인수(varargs) 메서드와 제네릭은 자바 5 때 함께 추가되었으므로 서로 시너지 효과가 날꺼라고 예상하는데 그렇지가 않다.

가변인수는 인수의 갯수를 클라이언트에서 조절할수 있게 해주는데 구현방식에서 헛점이 있다. 
가변인수를 사용하면 배열이 하나 만들어 지는데 이배열을 감추지 않고 외부로 노출했을때 문제가 생긴다.

jls-3.12.2 에서 말하는 코드를 보면 힙오염이 나타나는데 코드를 보겠다.

```java

        List l = new ArrayList<Number>();
        List<String> ls = l;  // Unchecked warning

```

실제로 위에 코드는 컴파일은 되지만 런타임시에 에러가 난다.

```java

    static void m(List<String>... stringLists) {
        Object[] array = stringLists;
        List<Integer> tmpList = Arrays.asList(42);
        array[0] = tmpList;                // (1)
        String s = stringLists[0].get(0);  // (2) ClassCastException
    }

```

여기서 힙오염이 발생하는건 1번에서 발생하지만 결과적으로는 2번에서 ClassCastException이 발생한다.

제네릭 varargs 배열 매개변수에 값을 저장하는것은 안전하지 않다.

unchecked 메시지가 나오는데 java 7 이전에는 @SuppressWarnings("unchecked")을 달아서 처리를 해줘야 했고 이후에는 @SafeVarargs 어너테이션으로 처리한다.

매서드가 안전한지 확인하는 방법은 무얼까 아래의 코드를 보자

```java

package com.github.sejoung.codetest.generics.varargs;

import java.util.Arrays;
import java.util.concurrent.ThreadLocalRandom;

// 미묘한 힙 오염 발생 (193-194쪽)
public class PickTwo {
    // 코드 32-2 자신의 제네릭 매개변수 배열의 참조를 노출한다. - 안전하지 않다! (193쪽)
    static <T> T[] toArray(T... args) {
        return args;
    }

    static <T> T[] pickTwo(T a, T b, T c) {
        switch(ThreadLocalRandom.current().nextInt(3)) {
            case 0: return toArray(a, b);
            case 1: return toArray(a, c);
            case 2: return toArray(b, c);
        }
        throw new AssertionError(); // 도달할 수 없다.
    }

    public static void main(String[] args) { // (194쪽)
        String[] attributes = pickTwo("좋은", "빠른", "저렴한");
        System.out.println(Arrays.toString(attributes));
    }
}

```
컴파일 메시지 

```

Warning:(9, 33) java: Possible heap pollution from parameterized vararg type T
Warning:(15, 35) java: unchecked generic array creation for varargs parameter of type T[]
Warning:(16, 35) java: unchecked generic array creation for varargs parameter of type T[]
Warning:(17, 35) java: unchecked generic array creation for varargs parameter of type T[]

```
실행 결과
```
Exception in thread "main" java.lang.ClassCastException: class [Ljava.lang.Object; cannot be cast to class [Ljava.lang.String; ([Ljava.lang.Object; and [Ljava.lang.String; are in module java.base of loader 'bootstrap')
	at com.github.sejoung.codetest.generics.varargs.PickTwo.main(PickTwo.java:23)

Process finished with exit code 1
```

위에 코드에서는 힙오염이 발생한다. 그이유는  자신의 제네릭 매개변수 배열의 참조를 노출 해서 이다.

제네릭 varargs 매개변수 배열에 다른 메서드가 접근하도록 허용하면 안전하지 않다.

비슷한 코드로 

```java

package com.github.sejoung.codetest.generics.varargs;

import java.util.List;

// 제네릭 varargs 배열 매개변수에 값을 저장하는 것은 안전하지 않다. (191-192쪽)
public class Dangerous {
    // 코드 32-1 제네릭과 varargs를 혼용하면 타입 안전성이 깨진다! (191-192쪽)
    static void dangerous(List<String>... stringLists) {
        List<Integer> intList = List.of(42);
        Object[] objects = stringLists;
        objects[0] = intList; // 힙 오염 발생
        String s = stringLists[0].get(0); // ClassCastException
    }

    public static void main(String[] args) {
        dangerous(List.of("There be dragons!"));
    }
}


```
컴파일 메시지
```
Warning:(8, 43) java: Possible heap pollution from parameterized vararg type java.util.List<java.lang.String>
Warning:(16, 18) java: unchecked generic array creation for varargs parameter of type java.util.List<java.lang.String>[]

```
실행결과
```
Exception in thread "main" java.lang.ClassCastException: class java.lang.Integer cannot be cast to class java.lang.String (java.lang.Integer and java.lang.String are in module java.base of loader 'bootstrap')
	at com.github.sejoung.codetest.generics.varargs.Dangerous.dangerous(Dangerous.java:12)
	at com.github.sejoung.codetest.generics.varargs.Dangerous.main(Dangerous.java:16)

Process finished with exit code 1

```

가변인수와 제네릭에 대해서 안전하게 사용된 메서드

```java

package com.github.sejoung.codetest.generics.varargs;

import java.util.ArrayList;
import java.util.List;

// 코드 32-3 제네릭 varargs 매개변수를 안전하게 사용하는 메서드 (195쪽)
public class FlattenWithVarargs {
    @SafeVarargs
    static <T> List<T> flatten(List<? extends T>... lists) {
        List<T> result = new ArrayList<>();
        for (List<? extends T> list : lists)
            result.addAll(list);
        return result;
    }

    public static void main(String[] args) {
        List<Integer> flatList = flatten(
                List.of(1, 2), List.of(3, 4, 5), List.of(6,7));
        System.out.println(flatList);
    }
}


```
실행결과
```
[1, 2, 3, 4, 5, 6, 7]

Process finished with exit code 0
```

다음 두가지 조건을 만족하는 varargs를 사용하는 제네릭 메소드는 안전하다.

1. varargs 매개변수 배열에 아무것도 저장하지 않는다.
1. varargs 매개변수 배열(혹은 복제본)을 신뢰할 수 없는 코드에 노출하지 않는다.

varargs 매개변수가 무조건 정답은 아니다. 실체를 List로 바꿀수 있다. 바뀐 메소드는 아래 코드이다.

```java

package com.github.sejoung.codetest.generics.varargs;

import java.util.ArrayList;
import java.util.List;

// 코드 32-4 제네릭 varargs 매개변수를 List로 대체한 예 - 타입 안전하다. (195-196쪽)
public class FlattenWithList {
    static <T> List<T> flatten(List<List<? extends T>> lists) {
        List<T> result = new ArrayList<>();
        for (List<? extends T> list : lists)
            result.addAll(list);
        return result;
    }

    public static void main(String[] args) {
        List<Integer> flatList = flatten(List.of(
                List.of(1, 2), List.of(3, 4, 5), List.of(6,7)));
        System.out.println(flatList);
    }
}


```
실행결과
```
[1, 2, 3, 4, 5, 6, 7]

Process finished with exit code 0

```
타입 세이프 하면서 컴파일시에 타입 안정성을 검증할수 있다.
단점은 클라이언트 코드가 조금 지저분해 진다.

그럼 위에서 문제가 되었던 pickTwo 코드를 바꿔 보겠다.

```java

package com.github.sejoung.codetest.generics.varargs;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

public class PickTwoList {

    static <T> List<T> pickTwo(T a, T b, T c) {
        switch(ThreadLocalRandom.current().nextInt(3)) {
            case 0: return List.of(a, b);
            case 1: return List.of(a, c);
            case 2: return List.of(b, c);
        }
        throw new AssertionError();
    }

    public static void main(String[] args) {
        List<String> attributes = pickTwo("좋은", "빠른", "저렴한");

        for(String str : attributes){
            System.out.println(str);
        }
    }
}

```
실행결과
```
좋은
빠른

Process finished with exit code 0

```

결과 코드는 배열없이 제네릭만 사용하므로 타입 안전하다.


# 참조
-----
* [Variables of Reference Type](https://docs.oracle.com/javase/specs/jls/se8/html/jls-4.html#jls-4.12.2)



