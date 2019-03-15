---
layout: post
title: "아이템 47. 반환타입으로 스트림보다 컬렉션이 낫다."
date: 2019-02-08 14:30 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 47. 반환타입으로 스트림보다 컬렉션이 낫다.

반환타입으로 스트림보다 컬렉션이 나은 이유가 둘다 iterable을 구현하고 있지만 
스트림은 iterable을 extend 하지 않아서 loop문이 정상적으로 동작 되지 않는다.

```java

public interface BaseStream<T, S extends BaseStream<T, S>>
        extends AutoCloseable {
    /**
     * Returns an iterator for the elements of this stream.
     *
     * <p>This is a <a href="package-summary.html#StreamOps">terminal
     * operation</a>.
     *
     * @return the element iterator for this stream
     */
    Iterator<T> iterator();
.....
}

```

```java

/*
 * Copyright (c) 2003, 2013, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */
package java.lang;

import java.util.Iterator;
import java.util.Objects;
import java.util.Spliterator;
import java.util.Spliterators;
import java.util.function.Consumer;

/**
 * Implementing this interface allows an object to be the target of the enhanced
 * {@code for} statement (sometimes called the "for-each loop" statement).
 *
 * @param <T> the type of elements returned by the iterator
 *
 * @since 1.5
 * @jls 14.14.2 The enhanced {@code for} statement
 */
public interface Iterable<T> {
    /**
     * Returns an iterator over elements of type {@code T}.
     *
     * @return an Iterator.
     */
    Iterator<T> iterator();

    /**
     * Performs the given action for each element of the {@code Iterable}
     * until all elements have been processed or the action throws an
     * exception.  Actions are performed in the order of iteration, if that
     * order is specified.  Exceptions thrown by the action are relayed to the
     * caller.
     * <p>
     * The behavior of this method is unspecified if the action performs
     * side-effects that modify the underlying source of elements, unless an
     * overriding class has specified a concurrent modification policy.
     *
     * @implSpec
     * <p>The default implementation behaves as if:
     * <pre>{@code
     *     for (T t : this)
     *         action.accept(t);
     * }</pre>
     *
     * @param action The action to be performed for each element
     * @throws NullPointerException if the specified action is null
     * @since 1.8
     */
    default void forEach(Consumer<? super T> action) {
        Objects.requireNonNull(action);
        for (T t : this) {
            action.accept(t);
        }
    }

    /**
     * Creates a {@link Spliterator} over the elements described by this
     * {@code Iterable}.
     *
     * @implSpec
     * The default implementation creates an
     * <em><a href="../util/Spliterator.html#binding">early-binding</a></em>
     * spliterator from the iterable's {@code Iterator}.  The spliterator
     * inherits the <em>fail-fast</em> properties of the iterable's iterator.
     *
     * @implNote
     * The default implementation should usually be overridden.  The
     * spliterator returned by the default implementation has poor splitting
     * capabilities, is unsized, and does not report any spliterator
     * characteristics. Implementing classes can nearly always provide a
     * better implementation.
     *
     * @return a {@code Spliterator} over the elements described by this
     * {@code Iterable}.
     * @since 1.8
     */
    default Spliterator<T> spliterator() {
        return Spliterators.spliteratorUnknownSize(iterator(), 0);
    }
}


```

그래서 스트림으로 반환하면 무조건 forEach문을 사용해야 된다 그래서 선택지를 스트림으로만 제한하기 때문이다.

하지만 이문제점을 우회해줄 멋진 해결점은 없다. 바로 전장에서 다뤘던 케이스를 보면

```java

package com.github.sejoung.codetest.stream;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.*;


// 빈도표 초기화에 스트림을 적절하지 못하게 혹은 적절하게 사용하는 예 (277-279쪽)
public class Freq {
    public static void main(String[] args) throws FileNotFoundException {
        File file = new File("src/main/resources/words.txt");


        Map<String, Long> freq = new HashMap<>();
        // 반복적인 코드
        try (Stream<String> words = new Scanner(file).tokens()) {
            List<String> wordsList = words.collect(toList());
            for(String word : wordsList){
                freq.merge(word.toLowerCase(), 1L, Long::sum);
            }
        }

        System.out.println(freq);
    }
}

```

워에 코드에서 스트림을 가지고 loop를 돌리지 못해서 toList를 통해서 변환 후에 loop를 돌렸다 

얼핏 보면 iterator 메소드를 통해 loop를 돌릴수 있을것 같다 그럼 코드를 수정해 보겠다.

```java

package com.github.sejoung.codetest.stream;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toList;


// 빈도표 초기화에 스트림을 적절하지 못하게 혹은 적절하게 사용하는 예 (277-279쪽)
public class Freq {
    public static void main(String[] args) throws FileNotFoundException {
        File file = new File("src/main/resources/words.txt");

        Map<String, Long> freq = new HashMap<>();
        // 반복적인 코드
        try (Stream<String> words = new Scanner(file).tokens()) {
            for(String word : words::iterator){
                freq.merge(word.toLowerCase(), 1L, Long::sum);
            }
        }
        System.out.println(freq);

    }
}


```
컴파일 결과
```
D:\repo\codeTestJDK8\src\main\java\com\github\sejoung\codetest\stream\Freq.java
Error:(32, 32) java: method reference not expected here

```

위에 코드는 안타깝게도 에러가 난다 타입추론에 한계로 인해 컴파일이 되지 않는다 아래 처럼 형변환을 하면되는데

예제 코드를 보겠다.

```java

package com.github.sejoung.codetest.stream;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toList;


// 빈도표 초기화에 스트림을 적절하지 못하게 혹은 적절하게 사용하는 예 (277-279쪽)
public class Freq {
    public static void main(String[] args) throws FileNotFoundException {
        File file = new File("src/main/resources/words.txt");

        Map<String, Long> freq = new HashMap<>();
        // 반복적인 코드
        try (Stream<String> words = new Scanner(file).tokens()) {
            for(String word : (Iterable<String>) words::iterator){
                freq.merge(word.toLowerCase(), 1L, Long::sum);
            }
        }
        System.out.println(freq);

    }
}

```

작동은 하지만 코드가 난잡하고 직관성이 떨어진다. 어뎁터 메서드를 사용하면 직관성이 조금더 좋아지는데

```java

package com.github.sejoung.codetest.stream;

import java.util.stream.Stream;
import java.util.stream.StreamSupport;

// 스트림 <-> 반복자 어댑터 (285-286쪽)
public abstract class Adapters {
    // 코드 47-3 Stream<E>를 Iterable<E>로 중개해주는 어댑터 (285쪽)
    public static <E> Iterable<E> iterableOf(Stream<E> stream) {
        return stream::iterator;
    }

}

```

```java

package com.github.sejoung.codetest.stream;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toList;


// 빈도표 초기화에 스트림을 적절하지 못하게 혹은 적절하게 사용하는 예 (277-279쪽)
public class Freq {
    public static void main(String[] args) throws FileNotFoundException {
        File file = new File("src/main/resources/words.txt");

        Map<String, Long> freq = new HashMap<>();
        // 반복적인 코드
        try (Stream<String> words = new Scanner(file).tokens()) {
            for(String word : iterableOf(words)){
                freq.merge(word.toLowerCase(), 1L, Long::sum);
            }
        }
        System.out.println(freq);

    }
}

```
위에 처럼 조금더 직관적으로 변하게 된다.


```java

package com.github.sejoung.codetest.stream;

import java.util.stream.Stream;
import java.util.stream.StreamSupport;

// 스트림 <-> 반복자 어댑터 (285-286쪽)
public abstract class Adapters {

    // 코드 47-4 Iterable<E>를 Stream<E>로 중개해주는 어댑터 (286쪽)
    public static <E> Stream<E> streamOf(Iterable<E> iterable) {
        return StreamSupport.stream(iterable.spliterator(), false);
    }
}

```

또 반대의 경우에도 위에 어텝터를 사용하면 조금더 직관적으로 사용할수 있을것이다.

하지만 선택지를 둘다 할수 있게 배려를 해주면 좋을것이다. 

Collection 인터페이스는 Iterable의 하위 타입이고 Stream도 동시에 사용할수 있게 해준다.

그래서 API의 반환타입은 Collection 이나 하위타입을 쓰는 것이 일반적으로 최선이다. 

혹시 반환할 표준 콜렉션 타입이 없다면 간단하게 구현할수도 있다.

```java

package com.github.sejoung.codetest.stream;

import java.util.*;

public abstract class PowerSet {
    // 코드 47-5 입력 집합의 멱집합을 전용 컬렉션에 담아 반환한다. (287쪽)
    public static final <E> Collection<Set<E>> of(Set<E> s) {
        List<E> src = new ArrayList<>(s);
        if (src.size() > 30)
            throw new IllegalArgumentException(
                    "집합에 원소가 너무 많습니다(최대 30개).: " + s);
        return new AbstractList<Set<E>>() {
            @Override
            public int size() {
                // 멱집합의 크기는 2를 원래 집합의 원소 수만큼 거듭제곱 것과 같다.
                return 1 << src.size();
            }

            @Override
            public boolean contains(Object o) {
                return o instanceof Set && src.containsAll((Set) o);
            }

            @Override
            public Set<E> get(int index) {
                Set<E> result = new HashSet<>();
                for (int i = 0; index != 0; i++, index >>= 1)
                    if ((index & 1) == 1)
                        result.add(src.get(i));
                return result;
            }
        };
    }

    public static void main(String[] args) {
        Set s = new HashSet(Arrays.asList("a", "b", "c"));
        System.out.println(PowerSet.of(s));
    }
}


```
실행결과
```
[[], [a], [b], [a, b], [c], [a, c], [b, c], [a, b, c]]

Process finished with exit code 0

```

위에처럼 AbstractList를 사용하면 간단하게 전용 콜렉션을 만들수도 있다.

그럼 위에 처럼 전용 콜렉션을 구현하기 귀찮을때 좀더 손쉬운 방법으로 구현할수 있다. 

어뎁터를 사용해서 인데 코드를 보자

```java

package com.github.sejoung.codetest.stream;

import java.util.*;
import java.util.stream.IntStream;
import java.util.stream.Stream;

// 리스트의 모든 부분리스트를 원소를 갖는 스트림을 생성하는 두 가지 방법 (288-289쪽)
public abstract class SubLists {
    // 코드 47-6 입력 리스트의 모든 부분리스트를 스트림으로 반환한다. (288-289쪽)
    public static <E> Stream<List<E>> of(List<E> list) {
        return Stream.concat(Stream.of(Collections.emptyList()),
                prefixes(list).flatMap(SubLists::suffixes));
    }

    private static <E> Stream<List<E>> prefixes(List<E> list) {
        return IntStream.rangeClosed(1, list.size())
                .mapToObj(end -> list.subList(0, end));
    }

    private static <E> Stream<List<E>> suffixes(List<E> list) {
        return IntStream.range(0, list.size())
                .mapToObj(start -> list.subList(start, list.size()));
    }

    public static void main(String[] args) {
        List<String> list = Arrays.asList("a", "b", "c");
        SubLists.of(list).forEach(System.out::println);
    }
}

```
실행결과
```
[]
[a]
[a, b]
[b]
[a, b, c]
[b, c]
[c]

Process finished with exit code 0

```

이러한 어뎁터는 코드를 어수선하게 만들고 코드가 느리다


# 참조
-----






