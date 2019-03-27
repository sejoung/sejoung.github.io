---
layout: post
title: "아이템 84. 프로그램의 동작을 스레드 스케줄러에 기대하지 말라."
date: 2019-03-27 11:08 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 84. 프로그램의 동작을 스레드 스케줄러에 기대하지 말라.

정확성이나 성능이 스레드 스케줄러에 따라 달라지는 프로그램이라면 다른 플랫폼에 이식하기 어렵다.

스레드는 당장 처리해야 할 적업이 없다면 실행돼서는 안된다.

```java

package com.github.sejoung.codetest.concurrent.latchtest;

// 코드 84-1 끔찍한 CountDownLatch 구현 - 바쁜 대기 버전! (447쪽)
public class SlowCountDownLatch {

  private int count;

  public SlowCountDownLatch(int count) {
    if (count < 0) {
      throw new IllegalArgumentException(count + " < 0");
    }
    this.count = count;
  }

  public void await() {
    while (true) {
      synchronized (this) {
        if (count == 0) {
          return;
        }
      }
    }
  }

  public synchronized void countDown() {
    if (count != 0) {
      count--;
    }
  }
}


```

```java
package com.github.sejoung.codetest.concurrent.latchtest;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class CountDownLatchTest {

  public static void main(String[] args) throws InterruptedException {
    ExecutorService e = Executors.newFixedThreadPool(1000);

    System.out.println("time :" + time(e, 1000, () -> System.out.print("")));
    System.out.println("time2:" + time2(e, 1000, () -> System.out.print("")));
    e.shutdown();
  }

  // Simple framework for timing concurrent execution
  public static long time(Executor executor, int concurrency, Runnable action)
      throws InterruptedException {
    CountDownLatch ready = new CountDownLatch(concurrency);
    CountDownLatch start = new CountDownLatch(1);
    CountDownLatch done = new CountDownLatch(concurrency);
    for (int i = 0; i < concurrency; i++) {
      executor.execute(() -> {
        ready.countDown(); // Tell timer we're ready
        try {
          start.await(); // Wait till peers are ready
          action.run();
        } catch (InterruptedException e) {
          Thread.currentThread().interrupt();
        } finally {
          done.countDown(); // Tell timer we're done
        }
      });
    }
    ready.await(); // Wait for all workers to be ready
    long startNanos = System.nanoTime();
    start.countDown(); // And they're off!
    done.await(); // Wait for all workers to finish
    return System.nanoTime() - startNanos;

  }

  public static long time2(Executor executor, int concurrency, Runnable action)
      throws InterruptedException {
    SlowCountDownLatch ready = new SlowCountDownLatch(concurrency);
    SlowCountDownLatch start = new SlowCountDownLatch(1);
    SlowCountDownLatch done = new SlowCountDownLatch(concurrency);
    for (int i = 0; i < concurrency; i++) {
      executor.execute(() -> {
        ready.countDown(); // Tell timer we're ready
        try {
          start.await(); // Wait till peers are ready
          action.run();
        } finally {
          done.countDown(); // Tell timer we're done
        }
      });
    }
    ready.await(); // Wait for all workers to be ready
    long startNanos = System.nanoTime();
    start.countDown(); // And they're off!
    done.await(); // Wait for all workers to finish
    return System.nanoTime() - startNanos;

  }
}

```
실행결과
```
time :8935416
time2:28724199

Process finished with exit code 0

```

# 참조
-----
* [Item 84: Don’t depend on the thread scheduler](https://qiita.com/nannany/items/e8f23c2ea8225551a511)



