---
layout: post
title: "동시성(Concurrency) Guarded Blocks"
date: 2019-03-25 14:26 +0900
comments: true
tags : ["동시성", "Concurrency", "Guarded Blocks"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 동시성(Concurrency)

### Guarded Blocks

스레드는 종종 자신의 행동을 조정해야합니다. 
가장 일반적인 조정 관용구는 Guarded Blocks 입니다. 
이러한 블록은 블록을 진행하기 전에 참이어야하는 조건을 폴링하여 시작합니다. 
이 작업을 제대로 수행하려면 여러 단계를 수행해야합니다.

예를 들어 guardedJoy 공유 변수 joy가 다른 스레드에 의해 설정 될 때까지 진행해서는 안되는 메소드가 있다고 가정하십시오. 
이러한 방법은 이론적으로 조건이 충족 될 때까지 단순하게 반복 할 수 있지만 대기하는 동안 계속 실행되므로 루프는 낭비입니다.

```java

public void guardedJoy() {
    // Simple loop guard. Wastes
    // processor time. Don't do this!
    while(!joy) {}
    System.out.println("Joy has been achieved!");
}

```

보다 효율적인 보호 기능은 Object.wait현재 스레드를 일시 중단하도록 호출 합니다. 
wait의 호출은, 다른 thread가, 특별한 이벤트가 발생했을 가능성이있는 통지를 발행 할 때까지 복귀 합니다만,이 thread가 반드시 대기하고있는 이벤트는 아닙니다.

```java

public synchronized void guardedJoy() {
    // This guard only loops once for each special event, which may not
    // be the event we're waiting for.
    while(!joy) {
        try {
            wait();
        } catch (InterruptedException e) {}
    }
    System.out.println("Joy and efficiency have been achieved!");
}

```
* wait 대기중인 조건을 테스트하는 루프 내에서 항상 호출 하십시오. 
기다리는 특정 조건에 대한 인터럽트가 아니라고 가정하거나 조건이 여전히 참이라고 가정하지 마십시오.


실행을 일시 중단하는 많은 메소드처럼 wait는 InterruptedException을 던질 수 있습니다. 
이 예제에서 우리는 단지 그 예외를 무시할 수 있습니다.

이 버전이 guardedJoy동기화 된 이유는 무엇 입니까? 
우리가 wait를 호출하는 데 사용하는 d 객체가 있다고 가정 합니다. 
thread가 d를 호출 할 때, 그 thread는 d.waitintrinsic 잠금을 소유하고 있어야합니다. 
그렇지 않으면 에러가 발생합니다. 
wait 동기화 된 메서드 내에서 호출 하는 것은 고유 잠금을 가져 오는 간단한 방법입니다.

when wait이 호출되면 스레드는 잠금을 해제하고 실행을 일시 중단합니다. 
장래에, 다른 thread가 같은 락을 취득 해 호출 해 Object.notifyAll, 그 락을 대기하고있는 모든 thread에 중요한 일이 일어 났음을 통지합니다.

```java

public synchronized notifyJoy() {
    joy = true;
    notifyAll();
}

```

두 번째 스레드가 잠금을 해제 한 후 얼마 지나지 않아 첫 번째 스레드가 wait 잠금을 다시 획득하고의 호출에서 복귀하여 다시 시작합니다.

* 두 번째 알림 메서드가 있는데 notify,이 메서드 는 단일 스레드를 활성화합니다. 
때문에 notify당신이 깨어있는 스레드를 지정하는 것을 허용하지 않습니다, 
그것은 단지 대규모 병렬 애플리케이션에서 유용하다 - 즉, 많은 수의 스레드와 프로그램은 모두 비슷한 집안일을하고 이러한 응용 프로그램에서는 깨어나는 스레드를 신경 쓰지 않습니다.

보호 된 블록을 사용하여 Producer-Consumer 응용 프로그램 을 만듭니다. 
이러한 종류의 응용 프로그램은 두 스레드 사이에서 데이터를 공유합니다. 
즉, 데이터를 생성하는 제작자 와 함께 스레드 를 통해 수행되는 소비자 입니다. 
두 스레드는 공유 객체를 사용하여 통신합니다. 조정은 필수적입니다. 
소비자 스레드는 생산자 스레드가 전달하기 전에 데이터를 검색하려고 시도해서는 안되며 소비자가 이전 데이터를 검색하지 않은 경우 생성자 스레드가 새 데이터를 전달하려고 시도하면 안됩니다.

이 예제에서 데이터는 일련의 텍스트 메시지로, Drop다음 유형의 객체를 통해 공유됩니다 .

```java

package com.github.sejoung.codetest.concurrent.guardedblocks;

public class Drop {

  // Message sent from producer
  // to consumer.
  private String message;
  // True if consumer should wait
  // for producer to send message,
  // false if producer should wait for
  // consumer to retrieve message.
  private boolean empty = true;

  public synchronized String take() {
    // Wait until message is
    // available.
    while (empty) {
      try {
        wait();
      } catch (InterruptedException e) {
      }
    }
    // Toggle status.
    empty = true;
    // Notify producer that
    // status has changed.
    notifyAll();
    return message;
  }

  public synchronized void put(String message) {
    // Wait until message has
    // been retrieved.
    while (!empty) {
      try {
        wait();
      } catch (InterruptedException e) {
      }
    }
    // Toggle status.
    empty = false;
    // Store message.
    this.message = message;
    // Notify consumer that status
    // has changed.
    notifyAll();
  }
}


```

에 정의 된 제작자 스레드 Producer는 일련의 친숙한 메시지를 보냅니다. 
문자열 "DONE"은 모든 메시지가 전송되었음을 나타냅니다. 
실제 응용 프로그램의 예측할 수없는 성격을 시뮬레이트하기 위해 제작자 스레드는 메시지 사이의 임의의 간격 동안 일시 중지합니다.

```java

package com.github.sejoung.codetest.concurrent.guardedblocks;

import java.util.Random;

public class Producer implements Runnable {

  private Drop drop;

  public Producer(Drop drop) {
    this.drop = drop;
  }

  public void run() {
    String[] importantInfo = {
        "Mares eat oats",
        "Does eat oats",
        "Little lambs eat ivy",
        "A kid will eat ivy too"
    };
    Random random = new Random();

    for (int i = 0; i < importantInfo.length; i++) {
      drop.put(importantInfo[i]);
      try {
        Thread.sleep(random.nextInt(5000));
      } catch (InterruptedException e) {
      }
    }
    drop.put("DONE");
  }
}


```

아래의 정의 된 소비자 스레드 Consumer는 "DONE"문자열을 검색 할 때까지 단순히 메시지를 검색하여 인쇄합니다.
이 스레드는 또한 임의의 간격으로 일시 중지됩니다.

```java

package com.github.sejoung.codetest.concurrent.guardedblocks;

import java.util.Random;

public class Consumer implements Runnable {

  private Drop drop;

  public Consumer(Drop drop) {
    this.drop = drop;
  }

  public void run() {
    Random random = new Random();
    for (String message = drop.take(); !message.equals("DONE"); message = drop.take()) {
      System.out.format("MESSAGE RECEIVED: %s%n", message);
      try {
        Thread.sleep(random.nextInt(5000));
      } catch (InterruptedException e) {
      }
    }
  }
}


```

마지막으로 여기에 정의 된 메인 스레드 ProducerConsumerExample가 생성자와 소비자 스레드를 시작합니다.

```java

package com.github.sejoung.codetest.concurrent.guardedblocks;

public class ProducerConsumerExample {

  public static void main(String[] args) {
    Drop drop = new Drop();
    (new Thread(new Producer(drop))).start();
    (new Thread(new Consumer(drop))).start();
  }
}


```
실행결과
```
MESSAGE RECEIVED: Mares eat oats
MESSAGE RECEIVED: Does eat oats
MESSAGE RECEIVED: Little lambs eat ivy
MESSAGE RECEIVED: A kid will eat ivy too

Process finished with exit code 0
```

* 이 Drop클래스는 보호 된 블록을 보여주기 위해 작성되었습니다. 
바퀴를 다시 발명하지 않으려면 자체 데이터 공유 객체를 코딩하기 전에 Java Collections Framework 의 기존 데이터 구조를 검사하십시오. 
자세한 내용은 질문 및 연습 섹션을 참조하십시오.


# 참조
-----
* [Guarded Blocks](https://docs.oracle.com/javase/tutorial/essential/concurrency/guardmeth.html)
* [Object.wait](https://docs.oracle.com/javase/8/docs/api/java/lang/Object.html#wait--)

