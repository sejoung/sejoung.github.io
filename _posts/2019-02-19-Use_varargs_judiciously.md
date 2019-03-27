---
layout: post
title: "아이템 53. 가변인수(varargs)는 신중히 사용하라."
date: 2019-02-19 09:24 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 53. 가변인수(varargs)는 신중히 사용하라.

가변인수(varargs) 메서드는 몇시한 타입의 인수를 0개 이상 받을수 있다.

```java

package com.github.sejoung.codetest.methods;

// 가변인수 활용 예 (320-321쪽)
public class Varargs {
    // 코드 53-1 간단한 가변인수 활용 예 (320쪽)
    static int sum(int... args) {
        int sum = 0;
        for (int arg : args)
            sum += arg;
        return sum;
    }

    public static void main(String[] args) {

        System.out.println(sum());
        System.out.println(sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
    }
}

```
실행결과
```

0
55

Process finished with exit code 0
```

위에 코드는 간단한 가변인수의 활용예 이다. 

또 인수가 하나이상이어야 할수도 있다. 코드를 바꿔보면

```java
package com.github.sejoung.codetest.methods;

// 가변인수 활용 예 (320-321쪽)
public class Varargs {


    // 코드 53-2 인수가 1개 이상이어야 하는 가변인수 메서드 - 잘못 구현한 예! (320쪽)
    static int min(int... args) {
        if (args.length == 0)
            throw new IllegalArgumentException("인수가 1개 이상 필요합니다.");
        int min = args[0];
        for (int i = 1; i < args.length; i++)
            if (args[i] < min)
                min = args[i];
        return min;
    }


    public static void main(String[] args) {
        
        System.out.println(min(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
        System.out.println(min());
    }
}

```
실행결과
```
1
Exception in thread "main" java.lang.IllegalArgumentException: 인수가 1개 이상 필요합니다.
	at com.github.sejoung.codetest.methods.Varargs.min(Varargs.java:16)
	at com.github.sejoung.codetest.methods.Varargs.main(Varargs.java:40)

Process finished with exit code 1


```
위에 코드는 문제 점이 있다. 런타임에야 코드가 실패를 한다는것이다. 그리고 코드도 장황해진다.

간결하게 바꿔보면
```java

package com.github.sejoung.codetest.methods;

// 가변인수 활용 예 (320-321쪽)
public class Varargs {

    // 코드 53-3 인수가 1개 이상이어야 할 때 가변인수를 제대로 사용하는 방법 (321쪽)
    static int min(int firstArg, int... remainingArgs) {
        int min = firstArg;
        for (int arg : remainingArgs)
            if (arg < min)
                min = arg;
        return min;
    }

    public static void main(String[] args) {

        System.out.println(min(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
        System.out.println(min());

    }
}

```
컴파일 메시지
```

Error:(38, 28) java: method min in class com.github.sejoung.codetest.methods.Varargs cannot be applied to given types;
  required: int,int[]
  found: no arguments
  reason: actual and formal argument lists differ in length
```
위에 코드는 컴파일 타임에 실패를 하고 더 코드도 명료해진다. 위에 코드의 잘 활용된 예가 System.out.printf() 이다

```java

    public PrintStream printf(String format, Object ... args) {
        return format(format, args);
    }

```

대부분의 코드가 인자 3개를 호출하고 3개이상 인자를 호출하는 경우가 극소수일때 아래와 같은 코드처럼 사용하기도 한다.

```java


    public void foo(){}

    public void foo(int a1){}

    public void foo(int a1, int a2){}

    public void foo(int a1, int a2, int a3){}

    public void foo(int a1, int a2, int a3, int... rest){}


```

위에 처럼 사용한 예가 EnumSet.of 메소드 이다.

```java

  public static <E extends Enum<E>> EnumSet<E> of(E e) {
        EnumSet<E> result = noneOf(e.getDeclaringClass());
        result.add(e);
        return result;
    }


    public static <E extends Enum<E>> EnumSet<E> of(E e1, E e2) {
        EnumSet<E> result = noneOf(e1.getDeclaringClass());
        result.add(e1);
        result.add(e2);
        return result;
    }

    public static <E extends Enum<E>> EnumSet<E> of(E e1, E e2, E e3) {
        EnumSet<E> result = noneOf(e1.getDeclaringClass());
        result.add(e1);
        result.add(e2);
        result.add(e3);
        return result;
    }
    
    public static <E extends Enum<E>> EnumSet<E> of(E e1, E e2, E e3, E e4) {
        EnumSet<E> result = noneOf(e1.getDeclaringClass());
        result.add(e1);
        result.add(e2);
        result.add(e3);
        result.add(e4);
        return result;
    }
    
    public static <E extends Enum<E>> EnumSet<E> of(E e1, E e2, E e3, E e4,
                                                    E e5)
    {
        EnumSet<E> result = noneOf(e1.getDeclaringClass());
        result.add(e1);
        result.add(e2);
        result.add(e3);
        result.add(e4);
        result.add(e5);
        return result;
    }
        
    @SafeVarargs
    public static <E extends Enum<E>> EnumSet<E> of(E first, E... rest) {
        EnumSet<E> result = noneOf(first.getDeclaringClass());
        result.add(first);
        for (E e : rest)
            result.add(e);
        return result;
    }

```

# 참조
-----




