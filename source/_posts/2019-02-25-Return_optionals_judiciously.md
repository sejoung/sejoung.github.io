---
layout: post
title: "아이템 55. 옵셔널 반환은 신중히 하라."
date: 2019-02-25 10:36 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 55. 옵셔널 반환은 신중히 하라.

```java

package com.github.sejoung.codetest.methods;

import java.util.*;

// 반환 타입으로 Optional<T> 사용하기 (327-328쪽)
public class Max {
    // 코드 55-1 컬렉션에서 최댓값을 구한다. - 컬렉션이 비었으면 예외를 던진다. (327쪽)
    public static <E extends Comparable<E>> E max(Collection<E> c) {
        if (c.isEmpty())
            throw new IllegalArgumentException("빈 컬렉션");

        E result = null;
        for (E e : c)
            if (result == null || e.compareTo(result) > 0)
                result = Objects.requireNonNull(e);

        return result;
    }

    public static void main(String[] args) {
        List<String> words = Arrays.asList(args);

        System.out.println(max(words));

    }
}


```
실행결과
```
Exception in thread "main" java.lang.IllegalArgumentException: 빈 컬렉션
	at com.github.sejoung.codetest.methods.Max.max(Max.java:10)
	at com.github.sejoung.codetest.methods.Max.main(Max.java:42)

Process finished with exit code 1

```

위에 코드는 IllegalArgumentException을 발생시켜서 체크를 한다 위에서는 
Optional을 사용하는것이 더 좋다고 했는데 바꾼 코드를 보면

```java
package com.github.sejoung.codetest.methods;

import java.util.*;

// 반환 타입으로 Optional<T> 사용하기 (327-328쪽)
public class Max {

    // 코드 55-2 컬렉션에서 최댓값을 구해 Optional<E>로 반환한다. (327쪽)
    public static <E extends Comparable<E>> Optional<E> max(Collection<E> c) {
        if (c.isEmpty())
            return Optional.empty();

        E result = null;
        for (E e : c)
            if (result == null || e.compareTo(result) > 0)
                result = Objects.requireNonNull(e);

        return Optional.of(result);
    }

    public static void main(String[] args) {
        List<String> words = Arrays.asList(args);

        System.out.println(max(words));
    }
}


```
실행결과
```
Optional.empty

Process finished with exit code 0
```

위처럼 옵셔널을 반환하는 메소드에는 절대로 null을 반환하지 말자

```java

package com.github.sejoung.codetest.methods;

import java.util.Optional;

// 불필요하게 사용한 Optional의 isPresent 메서드를 제거하자. (329쪽)
public class ParentPid {
    public static void main(String[] args) {
        ProcessHandle ph = ProcessHandle.current();

        // isPresent를 적절치 못하게 사용했다.
        Optional<ProcessHandle> parentProcess = ph.parent();
        System.out.println("부모 PID: " + (parentProcess.isPresent() ?
                String.valueOf(parentProcess.get().pid()) : "N/A"));

        // 같은 기능을 Optional의 map를 이용해 개선한 코드
        System.out.println("부모 PID: " +
                ph.parent().map(h -> String.valueOf(h.pid())).orElse("N/A"));
    }
}

```
실행결과
```

부모 PID: 16840
부모 PID: 16840

Process finished with exit code 0
```

위 처럼 옵셔널로 사용하면 적절한 메소드를 사용하면 코드를 가독성 있게 유지시킬수 있다.

그리고 컬렉션, 배열, 스트림 등 컨테이너 타입은 옵셔널로 감싸면 안된다.

ProcessHandle.Info.arguments()는 예외적 케이스로 따라하지 말자.

```java

 /**
         * Returns an array of Strings of the arguments of the process.
         *
         * @apiNote On some platforms, native applications are free to change
         *          the arguments array after startup and this method may only
         *          show the changed values.
         *
         * @return an {@code Optional<String[]>} of the arguments of the process
         */
        public Optional<String[]> arguments();

```

박싱된 기본타입을 담는 옵셔널을 반환하는 일이 없도록 하자.



# 참조
-----




