---
layout: post
title: "동시성(Concurrency) Thread Objects"
date: 2019-03-25 10:30 +0900
comments: true
tags : ["동시성", "Concurrency", "Thread Objects"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 동시성(Concurrency)

### Thread Objects

각 스레드는 Thread 클래스의 인스턴스와 연관됩니다. 
Thread 객체를 사용하여 동시 응용 프로그램을 만드는 두 가지 기본 전략이 있습니다 .

* 스레드 생성 및 관리를 직접 제어하려면 Thread 응용 프로그램이 비동기 작업을 시작해야 할 때마다 인스턴스를 작성하기 만하면 됩니다.

* 나머지 응용 프로그램에서 스레드 관리를 추상화하려면 응용 프로그램의 태스크를 executor 에 전달하십시오 .

이 절에서는 Thread 객체 사용에 대해 설명 합니다. Executors는 다른 고수준 동시성 객체 와 논의 됩니다 .

#### 스레드 정의 및 시작

인스턴스를 생성하는 응용 프로그램 Thread은 해당 스레드에서 실행될 코드를 제공해야합니다. 
이 작업에는 두 가지 방법이 있습니다.

* Runnable 개체를 제공하십시오. Runnable 인터페이스는 하나의 메소드를 정의 run 스레드에서 실행되는 코드를 포함하는 의미. 
HelloRunnable 같이 Thread 생성자에 Runnable 객체가 전달됩니다

```java

package com.github.sejoung.codetest.concurrent.threadobjects;

public class HelloRunnable implements Runnable {

  public static void main(String[] args) {
    (new Thread(new HelloRunnable())).start();
  }

  public void run() {
    System.out.println("Hello from a thread!");
  }

}

```
실행결과
```
Hello from a thread!

Process finished with exit code 0
```

* 서브 클래스 Thread. Thread클래스 자체는 구현 Runnable은하지만, run방법은 아무것도하지 않습니다. 
응용 프로그램은 하위 클래스로 만들 수 있으며 다음 예 와 같이 Thread자체 구현을 제공합니다. 


```java

package com.github.sejoung.codetest.concurrent.threadobjects;

public class HelloThread extends Thread {

  public static void main(String[] args) {
    (new HelloThread()).start();
  }

  public void run() {
    System.out.println("Hello from a thread!");
  }

}


```
실행결과
```
Hello from a thread!

Process finished with exit code 0
```
Thread.start 새 스레드를 시작하기 위해 두 예제가 모두 호출된다는 점에 유의 하십시오.

다음 중이 관용구 중 어느 것을 사용해야합니까? Runnable객체를 사용하는 첫 번째 방법은 더 일반적입니다. 
왜냐하면 Runnable 객체가 다른 클래스를 서브 클래스로 만들 수 있기 때문입니다. 
두 번째 방법은 간단한 응용 프로그램에서 사용하기가 더 쉽지만 작업 클래스는 하위 클래스 여야한다는 사실에 의해 제한됩니다. 
이 단원에서는 Runnable 작업 Thread을 실행하는 개체 와 작업 을 구분하는 첫 번째 방법에 중점을 둡니다. 
이 방법은보다 융통성이있을뿐만 아니라 나중에 다루는 고급 스레드 관리 API에도 적용됩니다.

Thread 클래스는 스레드 관리를위한 유용한 방법의 수를 정의합니다. 
여기에는 static 메소드를 호출하는 스레드에 대한 정보를 제공하거나 스레드의 상태에 영향을주는 메소드가 포함됩니다. 
다른 메소드는 스레드와 Thread객체 를 관리하는 데 관련된 다른 스레드에서 호출됩니다. 
다음 섹션에서 이러한 메소드 중 일부를 살펴 보겠습니다.

#### Pausing Execution with Sleep

Thread.sleep 현재 스레드가 지정된 기간 동안 실행을 일시 중단하도록합니다. 
이는 컴퓨터 시스템에서 실행될 수있는 응용 프로그램이나 다른 응용 프로그램의 다른 스레드에서 프로세서 시간을 사용할 수있게하는 효율적인 방법입니다. 
이 sleep 방법은 뒤 따르는 예와 같이 페이싱에 사용할 수 SimpleThreads 있으며 이후 섹션 의 예 와 같이 시간 요구 사항이있는 것으로 이해되는 의무가있는 다른 스레드를 기다리고 있습니다.

두 가지 오버로드 된 버전 sleep이 제공됩니다. 
하나는 sleep 시간을 밀리 초로 지정하고 다른 하나는 sleep 시간을 나노초로 지정합니다. 
그러나 이러한 sleep 시간은 기본 OS에서 제공하는 기능으로 인해 제한되기 때문에 정확하지는 않습니다. 
또한 sleep 구간은 인터럽트에 의해 종료 될 수 있습니다. 
어쨌든 호출 sleep이 지정된 기간 동안 스레드를 일시 중단 한다고 가정 할 수는 없습니다 .

이 SleepMessages 예제에서는 sleep이 4 초 간격으로 메시지를 인쇄 하는 데 사용 합니다.

```java

package com.github.sejoung.codetest.concurrent.threadobjects;

public class SleepMessages {

  public static void main(String[] args) throws InterruptedException {
    String[] importantInfo = {
        "Mares eat oats",
        "Does eat oats",
        "Little lambs eat ivy",
        "A kid will eat ivy too"
    };

    for (int i = 0; i < importantInfo.length; i++) {
      //Pause for 4 seconds
      Thread.sleep(4000);
      //Print a message
      System.out.println(importantInfo[i]);
    }
  }
}


```
실행결과
```
Mares eat oats
Does eat oats
Little lambs eat ivy
A kid will eat ivy too

Process finished with exit code 0
```

main에 throws InterruptedException 선언했다. 
이것은, sleep 다른 thread sleep과 액티브 한 동안 현재의 thread를 인터럽트했을 경우 에 슬로우 되는 예외입니다. 
이 응용 프로그램은 인터럽트를 발생시키는 다른 스레드를 정의하지 않았기 때문에 InterruptedException을 잡을 필요가 없습니다 .

#### Interrupts

인터럽트는 그것이 일을하고 다른 일을 할 무엇을 중지해야하는 스레드 표시입니다. 
스레드가 인터럽트에 어떻게 반응하는지는 프로그래머가 결정하지만 스레드가 종료되는 경우는 매우 일반적입니다. 
이것은이 단원에서 강조하는 사용법입니다.


스레드는 인터럽트를 보내고 스레드가 인터럽트되도록 Thread객체를 호출 interrupt합니다 . 
인터럽트 메커니즘이 제대로 작동하려면 인터럽트 된 스레드가 자체 인터럽트를 지원해야합니다.

##### Supporting Interruption

스레드가 자체 인터럽트를 어떻게 지원합니까? 이것은 현재 무엇을하고 있는지에 달려 있습니다. 
thread가 빈번하게 throw하는 메소드를 호출하는 경우는 InterruptedException, run 그 예외를 캐치 한 후에 메소드 로부터 리턴합니다 . 
예를 들어, 예제의 중앙 메시지 루프 가 스레드 객체 SleepMessages의 run메서드에 있다고 가정 Runnable합니다. 
그런 다음 인터럽트를 지원하기 위해 다음과 같이 수정 될 수 있습니다.


```java

package com.github.sejoung.codetest.concurrent.threadobjects;

public class SleepMessages {

  public static void main(String[] args) {
    String[] importantInfo = {
        "Mares eat oats",
        "Does eat oats",
        "Little lambs eat ivy",
        "A kid will eat ivy too"
    };

    for (int i = 0; i < importantInfo.length; i++) {
      //Pause for 4 seconds

      try {
        Thread.sleep(4000);
      } catch (InterruptedException e) {
        // We've been interrupted: no more messages.
        return;
      }
      //Print a message
      System.out.println(importantInfo[i]);
    }
  }
}

```
실행결과
```
Mares eat oats
Does eat oats
Little lambs eat ivy
A kid will eat ivy too

Process finished with exit code 0
```

throw InterruptedException와 같이 throw하는 많은 메서드는 sleep 현재 작업을 취소하고 인터럽트를 받으면 즉시 반환하도록 설계되었습니다.

throw되는 메소드를 호출하지 않고 스레드가 오랜 시간이 지나면 InterruptedException 어떻게 될까요? 
그런 다음 주기적으로 호출해야 하며 인터럽트가 수신되면이 Thread.interrupted true 를 반환 합니다.

이 간단한 예제에서 코드는 인터럽트를 테스트하고 스레드가 수신되면 인터럽트를 종료합니다. 
보다 복잡한 응용 프로그램에서는 다음 InterruptedException을 throw하는 것이 더 적합 할 수 있습니다.

```java

if (Thread.interrupted()) {
    throw new InterruptedException();
}

```

이렇게하면 인터럽트 처리 코드를 catch절 에서 중앙 집중식으로 처리 할 수 ​​있습니다 .

##### The Interrupt Status Flag

인터럽트 메커니즘은 인터럽트 상태 라고하는 내부 플래그를 사용하여 구현됩니다. 
호출 Thread.interrupt 은이 플래그를 설정합니다. 
스레드가 정적 메서드를 호출하여 인터럽트를 검사하면 Thread. 
interrupted인터럽트 상태가 지워집니다. 
isInterrupted한 스레드가 다른 스레드의 인터럽트 상태를 쿼리하기 위해 사용하는 비 정적 메서드는 인터럽트 상태 플래그를 변경하지 않습니다.

관례에 따라, 던짐에 의하여 나가는 어떤 방법든지 InterruptedException 그것을 할 때 차단 상태를 맑게한다. 
그러나 다른 스레드가 호출하여 인터럽트 상태가 즉시 다시 설정 될 수도 있습니다 interrupt.

#### Joins

이 join메서드는 한 스레드가 다른 스레드의 완료를 기다릴 수있게합니다. 현재 스레드가 실행중인 Thread 객체 t가있는 경우,

```java

t.join();

```
t스레드가 종료 될 때까지 현재 스레드가 실행을 일시 중지 합니다. 
오버로드는 프로그래머가 join 대기 기간을 지정할 수있게합니다. 
그러나 sleep과 마찬가지로 , join 타이밍은 OS에 따라 달라집니다, 그래서 당신은 그 가정해서는 안 join 정확히 한 사용자가 지정한로 대기합니다.

sleep과 마찬가지로, join종료로 인터럽트에 응답합니다 InterruptedException.

#### The SimpleThreads Example

다음 예제에서는이 섹션의 개념 중 일부를 정리합니다. SimpleThreads두 개의 스레드로 구성됩니다. 
첫 번째는 모든 Java 애플리케이션에있는 기본 스레드입니다. 
메인 쓰레드는 Runnable객체 로부터 새로운 쓰레드를 생성하고 MessageLoop, 완료 될 때까지 기다린다. 
경우 MessageLoop스레드가 완료하는 데 시간이 너무 오래 걸리는 주 스레드가 중단됩니다.

MessageLoop스레드는 일련의 메시지를 출력합니다. 
모든 메시지를 인쇄하기 전에 인터럽트되면 MessageLoop 스레드는 메시지를 인쇄하고 종료합니다.

```java

package com.github.sejoung.codetest.concurrent.threadobjects;

public class SimpleThreads {

  // Display a message, preceded by
  // the name of the current thread
  static void threadMessage(String message) {
    String threadName =
        Thread.currentThread().getName();
    System.out.format("%s: %s%n",
        threadName,
        message);
  }

  public static void main(String[] args)
      throws InterruptedException {

    // Delay, in milliseconds before
    // we interrupt MessageLoop
    // thread (default one hour).
    long patience = 1000 * 60 * 60;

    // If command line argument
    // present, gives patience
    // in seconds.
    if (args.length > 0) {
      try {
        patience = Long.parseLong(args[0]) * 1000;
      } catch (NumberFormatException e) {
        System.err.println("Argument must be an integer.");
        System.exit(1);
      }
    }

    threadMessage("Starting MessageLoop thread");
    long startTime = System.currentTimeMillis();
    Thread t = new Thread(new MessageLoop());
    t.start();

    threadMessage("Waiting for MessageLoop thread to finish");
    // loop until MessageLoop
    // thread exits
    while (t.isAlive()) {
      threadMessage("Still waiting...");
      // Wait maximum of 1 second
      // for MessageLoop thread
      // to finish.
      t.join(1000);
      if (((System.currentTimeMillis() - startTime) > patience)
          && t.isAlive()) {
        threadMessage("Tired of waiting!");
        t.interrupt();
        // Shouldn't be long now
        // -- wait indefinitely
        t.join();
      }
    }
    threadMessage("Finally!");
  }

  private static class MessageLoop
      implements Runnable {

    public void run() {
      String[] importantInfo = {
          "Mares eat oats",
          "Does eat oats",
          "Little lambs eat ivy",
          "A kid will eat ivy too"
      };
      try {
        for (int i = 0;
            i < importantInfo.length;
            i++) {
          // Pause for 4 seconds
          Thread.sleep(4000);
          // Print a message
          threadMessage(importantInfo[i]);
        }
      } catch (InterruptedException e) {
        threadMessage("I wasn't done!");
      }
    }
  }
}


```
실행결과
```

main: Starting MessageLoop thread
main: Waiting for MessageLoop thread to finish
main: Still waiting...
main: Still waiting...
main: Still waiting...
main: Still waiting...
Thread-0: Mares eat oats
main: Still waiting...
main: Still waiting...
main: Still waiting...
main: Still waiting...
Thread-0: Does eat oats
main: Still waiting...
main: Still waiting...
main: Still waiting...
main: Still waiting...
Thread-0: Little lambs eat ivy
main: Still waiting...
main: Still waiting...
main: Still waiting...
main: Still waiting...
Thread-0: A kid will eat ivy too
main: Finally!

Process finished with exit code 0

```

# 참조
-----
* [Thread Objects](https://docs.oracle.com/javase/tutorial/essential/concurrency/threads.html)
* [jdk Thread](https://docs.oracle.com/javase/8/docs/api/java/lang/Thread.html)
* [Defining and Starting a Thread](https://docs.oracle.com/javase/tutorial/essential/concurrency/runthread.html)
* [Pausing Execution with Sleep](https://docs.oracle.com/javase/tutorial/essential/concurrency/sleep.html)
* [interrupt](https://docs.oracle.com/javase/tutorial/essential/concurrency/interrupt.html)
* [understanding-the-usage-of-thread-interrupt](https://stackoverflow.com/questions/18100130/understanding-the-usage-of-thread-interrupt)


