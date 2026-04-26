---
layout: post
title: "아이템 21. 인터페이스를 구현하는 쪽을 생각해 설계하라."
date: 2018-12-17 10:33 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 이펙티브 자바

### 아이템 21. 인터페이스를 구현하는 쪽을 생각해 설계하라.

java 8 이전에는 인터페이스를 해치지 않고 메서드를 추가할 방법이 없었지만 지금은 default 메소드가 생겼다.
그렇다고 해서 모든 위험이 사라진것은 아니다.

생각할수 있느 모든상황에서 불변식을 해치지 않는 디폴트메소드를 작성하는것은 어려운 법이다

java8 에서 추가된 Collection 인터페이스에서 제공하는 removeIf 메소드이다.

```java

    /**
     * Removes all of the elements of this collection that satisfy the given
     * predicate.  Errors or runtime exceptions thrown during iteration or by
     * the predicate are relayed to the caller.
     *
     * @implSpec
     * The default implementation traverses all elements of the collection using
     * its {@link #iterator}.  Each matching element is removed using
     * {@link Iterator#remove()}.  If the collection's iterator does not
     * support removal then an {@code UnsupportedOperationException} will be
     * thrown on the first matching element.
     *
     * @param filter a predicate which returns {@code true} for elements to be
     *        removed
     * @return {@code true} if any elements were removed
     * @throws NullPointerException if the specified filter is null
     * @throws UnsupportedOperationException if elements cannot be removed
     *         from this collection.  Implementations may throw this exception if a
     *         matching element cannot be removed or if, in general, removal is not
     *         supported.
     * @since 1.8
     */
    default boolean removeIf(Predicate<? super E> filter) {
        Objects.requireNonNull(filter);
        boolean removed = false;
        final Iterator<E> each = iterator();
        while (each.hasNext()) {
            if (filter.test(each.next())) {
                each.remove();
                removed = true;
            }
        }
        return removed;
    }


```

위에 코드는 문제 없지만 모든 구현체들이 해당 메소드를 구현한것은 아니다 한가지 예로 

apache commons-collections에 SynchronizedCollection이란 구현체가 있다. 
이글을 쓰는 오늘 최종 버전은 4.2이며 최종 릴리즈 일자는 2018/07/17일이다

하지만 여전히 removeIf에대한 구현이 없다 구현이 없으면 디폴트 메소드가 실행되는데

ConcurrentModificationException이 일어날수 있는 여지가 있다.

그럼 테스트 하기 위해 pom.xml에 아래의 디펜턴시를 추가

```xml

<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-collections4</artifactId>
    <version>4.2</version>
</dependency>

```

그럼 먼저 싱글쓰레드에서 removeIf를 실행해 보겠다.

```java

package com.github.sejoung.codetest.synchronizedcollection;

import org.apache.commons.collections4.collection.SynchronizedCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

public class SynchronizedCollectionTest {
    private static final Logger log = LoggerFactory.getLogger(SynchronizedCollectionTest.class);

    public static void main(String[] args) {
        List<String> list = new ArrayList<String>();
        list.add("바보");
        list.add("천재");
        list.add("뭐지");
        list.add("진짜?");


        SynchronizedCollection sc = SynchronizedCollection.synchronizedCollection(list);

        String a = "바보";
        Predicate<String> predicate = p->p.equals(a);

        sc.forEach((s)->{
            log.debug("before ={}",s);
        });

        sc.removeIf(predicate);

        sc.forEach((s)->{
            log.debug("after ={}",s);
        });


    }

}


```
실행결과

```

11:09:52.629 [main] DEBUG com.github.sejoung.codetest.synchronizedcollection.SynchronizedCollectionTest - before =바보
11:09:52.635 [main] DEBUG com.github.sejoung.codetest.synchronizedcollection.SynchronizedCollectionTest - before =천재
11:09:52.635 [main] DEBUG com.github.sejoung.codetest.synchronizedcollection.SynchronizedCollectionTest - before =뭐지
11:09:52.636 [main] DEBUG com.github.sejoung.codetest.synchronizedcollection.SynchronizedCollectionTest - before =진짜?
11:09:52.637 [main] DEBUG com.github.sejoung.codetest.synchronizedcollection.SynchronizedCollectionTest - after =천재
11:09:52.637 [main] DEBUG com.github.sejoung.codetest.synchronizedcollection.SynchronizedCollectionTest - after =뭐지
11:09:52.638 [main] DEBUG com.github.sejoung.codetest.synchronizedcollection.SynchronizedCollectionTest - after =진짜?

Process finished with exit code 0

```
위에 코드는 정상동작하는것으로 보인다.

그럼 멀티쓰레드에서는 실행 한번 해보겠다.

```java

package com.github.sejoung.codetest.synchronizedcollection;

import org.apache.commons.collections4.collection.SynchronizedCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Predicate;

public class SynchronizedCollectionMutiThreadTest {
    private static AtomicInteger counter = new AtomicInteger(0);
    private static final Logger log = LoggerFactory.getLogger(SynchronizedCollectionMutiThreadTest.class);

    public static void main(String[] args) {
        List<String> list = new ArrayList<String>();
        list.add("바보");
        list.add("천재");
        list.add("뭐지");
        list.add("진짜?");


        SynchronizedCollection sc = SynchronizedCollection.synchronizedCollection(list);

        String a = "바보";
        Predicate<String> predicate = p->p.equals(a);

        sc.forEach((s)->{
            log.debug("before ={}",s);
        });


        int nThreads = 10;
        ExecutorService executorService = Executors.newFixedThreadPool(nThreads);
        CyclicBarrier barrier = new CyclicBarrier(nThreads);

        for(int i = 0; i < nThreads; i++) {
            executorService.submit(()->{
                int idx = counter.addAndGet(1);
                barrier.await();

                log.debug("idx = {} removeIf={}",idx,sc.removeIf(predicate));

                return null;
            });
        }

        executorService.shutdown();

        sc.forEach((s)->{
            log.debug("after ={}",s);
        });

    }

}


```
실행결과

```
11:15:48.251 [pool-1-thread-4] DEBUG com.github.sejoung.codetest.synchronizedcollection.SynchronizedCollectionMutiThreadTest - idx = 3 removeIf=false
11:15:48.251 [pool-1-thread-6] DEBUG com.github.sejoung.codetest.synchronizedcollection.SynchronizedCollectionMutiThreadTest - idx = 5 removeIf=false
11:15:48.251 [pool-1-thread-8] DEBUG com.github.sejoung.codetest.synchronizedcollection.SynchronizedCollectionMutiThreadTest - idx = 9 removeIf=false
11:15:48.251 [pool-1-thread-1] DEBUG com.github.sejoung.codetest.synchronizedcollection.SynchronizedCollectionMutiThreadTest - idx = 8 removeIf=false
11:15:48.251 [pool-1-thread-2] DEBUG com.github.sejoung.codetest.synchronizedcollection.SynchronizedCollectionMutiThreadTest - idx = 1 removeIf=true
11:15:48.251 [pool-1-thread-10] DEBUG com.github.sejoung.codetest.synchronizedcollection.SynchronizedCollectionMutiThreadTest - idx = 10 removeIf=true
11:15:48.251 [pool-1-thread-9] DEBUG com.github.sejoung.codetest.synchronizedcollection.SynchronizedCollectionMutiThreadTest - idx = 7 removeIf=false
11:15:48.251 [pool-1-thread-5] DEBUG com.github.sejoung.codetest.synchronizedcollection.SynchronizedCollectionMutiThreadTest - idx = 4 removeIf=false
11:15:48.251 [pool-1-thread-7] DEBUG com.github.sejoung.codetest.synchronizedcollection.SynchronizedCollectionMutiThreadTest - idx = 6 removeIf=false

Process finished with exit code 0
```

위에 처럼 우리가 의도한것대로 한번만 수행되지도 않는다. 보면 
쓰레드 1번과 10번에서 삭제가 되었다고 나오는데 동기화가 되있으면 저렇게 될수가 없다

지금 운이 좋게 제대로 동작할수도 있지만 멀티쓰레드 환경에서는 제대로 수행되지 않는다.

디폴트 메소드는 컴파일에 성공하더라도 기존 구현체의 런타임 오류를 일으킬수 있다.

그래서 인터페이스를 설계 할때 더 세심한 주의가 필요하다.

인터페이스를 설계하면 여러가지 클라이언트 타입을 구성해 봐야 된다. 릴리즈 후에도 결함을 수정할수도 있지만
그가능성에 기대면 안된다.

# 참조
-----
* [apache commons-collections](https://commons.apache.org/proper/commons-collections/)
* [SynchronizedCollection doc](https://commons.apache.org/proper/commons-collections/apidocs/org/apache/commons/collections4/collection/SynchronizedCollection.html)

