---
layout: post
title: "아이템 81. wait 와 notify 보다는 동시성 유틸리티를 애용하라."
date: 2019-03-26 16:48 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 81. wait 와 notify 보다는 동시성 유틸리티를 애용하라.

wait 와 notify는 올바르게 사용하기가 아주 까다로우니 고수준 동시성 유틸리티를 사용하자.

동시성 컬렉션에서 동시성을 무력화하는 건 불가능하며, 외부에서 락을 추가로 사용하면 오히려 속도가 느려진다.

```java

package com.github.sejoung.codetest.concurrent.utilities;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

// ConcurrentMap으로 구현한 동시성 정규화 맵
public class Intern {

  private static final Map<String, String> map = new ConcurrentHashMap<>();

  // 코드 81-1 ConcurrentMap으로 구현한 동시성 정규화 맵 - 최적은 아니다. (432쪽)
  public static String intern(String s) {
    String previousValue = map.putIfAbsent(s, s);
    return previousValue == null ? s : previousValue;
  }
}

```

위에 코드에서 개선할 포인트가 있는데 putIfAbsent 보다 get이 빠르다 코드를 수정하면

```java

package com.github.sejoung.codetest.concurrent.utilities;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

// ConcurrentMap으로 구현한 동시성 정규화 맵
public class Intern {

  private static final Map<String, String> map = new ConcurrentHashMap<>();

  // 코드 81-2 ConcurrentMap으로 구현한 동시성 정규화 맵 - 더 빠르다! (432쪽)
  public static String intern(String s) {
    String result = map.get(s);
    if (result == null) {
      result = map.putIfAbsent(s, s);
      if (result == null) {
        result = s;
      }
    }
    return result;
  }
}

```

위에처럼 필요할때만 putIfAbsent를 호출하는것으로 바꾸는것이 좋다.

`Collections.synchronizedMap()` 보다 `ConcurrentHashMap`를 사용하는것이 훨씬 좋다.

```java

package com.github.sejoung.codetest.concurrent.utilities;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

// 코드 81-3 동시 실행 시간을 재는 간단한 프레임워크 (433-434쪽)
public class ConcurrentTimer {

  private ConcurrentTimer() {
  } // 인스턴스 생성 불가

  public static long time(Executor executor, int concurrency, Runnable action)
      throws InterruptedException {
    CountDownLatch ready = new CountDownLatch(concurrency);
    CountDownLatch start = new CountDownLatch(1);
    CountDownLatch done = new CountDownLatch(concurrency);

    for (int i = 0; i < concurrency; i++) {
      executor.execute(() -> {
        ready.countDown(); // 타이머에게 준비를 마쳤음을 알린다.
        try {
          start.await(); // 모든 작업자 스레드가 준비될 때까지 기다린다.
          action.run();
        } catch (InterruptedException e) {
          Thread.currentThread().interrupt();
        } finally {
          done.countDown();  // 타이머에게 작업을 마쳤음을 알린다.
        }
      });
    }

    ready.await();     // 모든 작업자가 준비될 때까지 기다린다.
    long startNanos = System.nanoTime();
    start.countDown(); // 작업자들을 깨운다.
    done.await();      // 모든 작업자가 일을 끝마치기를 기다린다.
    return System.nanoTime() - startNanos;
  }

  public static void main(String[] args) throws InterruptedException {

    int concurrency = 10;
    ExecutorService es = Executors.newFixedThreadPool(concurrency);

    long nanotime = ConcurrentTimer.time(es,concurrency,()-> System.out.println("test"));

    System.out.println(nanotime);

    es.shutdown();
  }
}

```

위에서는 CountDownLatch를 사용하는 법이다. 위에 기능을 wait 와 notify를 사용하여 구현하려면 엄청 코드가 지저분해진다.

시간 간격을 잴때는 `System.currentTimeMillis()` 이것 보다 `System.nanoTime()`를 사용하자.

wait메서드를 사용할때의 관용구이다. 반드시 반복문에서 사용하고 반복문 밖에서는 사용하지 말자.

```java

   synchronized (obj){
      while (조건이 충족되지 않았다){
        obj.wait()
      }
    }

```
 
코드를 새로작성한다면 wait 와 notify는 거의 사용할일이 없다.


# 참조
-----




