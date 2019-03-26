---
layout: post
title: "아이템 78. 공유중인 가변 데이터는 동기화 해서 사용하라."
date: 2019-03-26 09:16 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 78. 공유중인 가변 데이터는 동기화 해서 사용하라.

동기화(synchronized)는 배타적 실행뿐 아니라 스레드 사이에 안정적인 통신에도 필요하다.


```java

package com.github.sejoung.codetest.concurrent.brokenstopthread;

import java.util.concurrent.TimeUnit;

// 코드 78-1 잘못된 코드 - 이 프로그램은 얼마나 오래 실행될까? (415쪽)
public class StopThread {

  private static boolean stopRequested;

  public static void main(String[] args) throws InterruptedException {

    new Thread(() -> {
      int i = 0;
      while(!stopRequested){
          i++;
      }
    }).start();

    TimeUnit.SECONDS.sleep(1);
    stopRequested = true;
  }
}


```

위에 동작은 1초내에 종료할것이라고 생각이 되는가? vm에서 hoisting이 일어나서 종료되지 않는다.

```java
      while(!stopRequested){
          i++;
      }

```

위에 코드가 아래 코드 처럼 최적화 되는것을 말한다.

```java
      if(!stopRequested){
        while(true){
            i++;
        }
      }
      

```

그러면 코드를 수정해 보면

```java

package com.github.sejoung.codetest.concurrent.fixedstopthread1;


import java.util.concurrent.TimeUnit;

// 코드 78-2 적절히 동기화해 스레드가 정상 종료한다. (416쪽)
public class StopThread {

  private static boolean stopRequested;

  private static synchronized void requestStop() {
    stopRequested = true;
  }

  private static synchronized boolean stopRequested() {
    return stopRequested;
  }

  public static void main(String[] args)
      throws InterruptedException {
    Thread backgroundThread = new Thread(() -> {
      int i = 0;
      while (!stopRequested()) {
        i++;
      }
    });
    backgroundThread.start();

    TimeUnit.SECONDS.sleep(1);
    requestStop();
  }
}

```

위처럼 동기화 synchronized를 선언하거나

```java

package com.github.sejoung.codetest.concurrent.fixedstopthread2;

import java.util.concurrent.TimeUnit;

// 코드 78-3 volatile 필드를 사용해 스레드가 정상 종료한다. (417쪽)
public class StopThread {

  private static volatile boolean stopRequested;

  public static void main(String[] args) throws InterruptedException {
    new Thread(() -> {
      int i = 0;
      while (!stopRequested) {
        i++;
      }
    }).start();

    TimeUnit.SECONDS.sleep(1);
    stopRequested = true;
  }
}


```

위에 코드 처럼 volatile으로 선언하여 처리하는 것이다 volatile 키워드는 모든것을 해결해주지 않는다.

가변 데이터는 단일 쓰레드에서만 사용하자.


# 참조
-----
* [why-hotspot-will-optimize-the-following-using-hoisting](https://stackoverflow.com/questions/9338180/why-hotspot-will-optimize-the-following-using-hoisting)


