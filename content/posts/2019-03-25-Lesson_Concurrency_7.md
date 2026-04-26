---
layout: post
title: "동시성(Concurrency) High Level Concurrency Objects"
date: 2019-03-25 17:03 +0900
comments: true
tags : ["동시성", "Concurrency", "High Level Concurrency Objects", "높은 수준의 동시성 객체"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 동시성(Concurrency)

### High Level Concurrency Objects

지금까지이 레슨은 처음부터 Java 플랫폼의 일부인 저수준 API에 중점을 두었습니다. 
이러한 API는 매우 기본적인 작업에는 적합하지만보다 고급 작업에는 더 높은 수준의 구성 요소가 필요합니다. 
특히 오늘날의 멀티 프로세서 및 멀티 코어 시스템을 완벽하게 활용하는 대용량 동시 응용 프로그램의 경우 더욱 그렇습니다.

이 절에서는 Java 플랫폼의 5.0 버전에서 소개 된 몇 가지 고급 동시성 기능을 살펴볼 것입니다. 
이러한 기능의 대부분은 새 java.util.concurrent 패키지 에서 구현 됩니다. 
Java Collections Framework에는 새로운 동시 데이터 구조가 있습니다.

* Lock objects는 많은 동시 응용 프로그램을 단순화하는 잠금 관용구를 지원합니다.

* Executors는 스레드를 시작하고 관리하기위한 고급 API를 정의합니다. 
실행 프로그램 구현은 java.util.concurrent 대규모 응용 프로그램에 적합한 스레드 풀 관리 기능을 제공합니다.

* Concurrent collections을 사용하면 많은 양의 데이터를보다 쉽게 ​​관리 할 수 ​​있으며 동기화 필요성을 크게 줄일 수 있습니다

* Atomic variables에는 동기화를 최소화하고 메모리 일관성 오류를 방지하는 기능이 있습니다.

* ThreadLocalRandom(JDK 7)은 여러 스레드에서 의사 난수를 효율적으로 생성합니다.

#### Lock Objects

동기화 된 코드는 단순한 종류의 재진입 잠금에 의존합니다. 
이러한 종류의 잠금 장치는 사용하기 쉽지만 많은 제한이 있습니다. 
더 정교한 잠금 관용구는 java.util.concurrent.locks 패키지에서 지원됩니다. 
우리는이 패키지를 자세히 조사하지는 않겠지만 가장 기본적인 Lock 인터페이스에 초점을 맞출 것이다.

Lock객체는 동기화 된 코드에서 사용되는 암시 적 잠금과 매우 흡사합니다. 
암시 적 잠금과 마찬가지로 한 번에 하나의 스레드 만 Lock개체를 소유 할 수 있습니다. 
Lock객체는 wait/notify관련 Condition객체를 통해 메커니즘 을 지원 합니다.

암시적 잠금에 비해 Lock 오브젝트의 가장 큰 장점은 잠금을 확보하려는 시도에서 벗어나는 능력입니다. 
이 tryLock 메소드는 잠금을 즉시 사용할 수 없거나 제한 시간이 만료되기 전에 (지정된 경우) 철회합니다. 
이 lockInterruptibly 메소드는 다른 스레드가 잠금을 얻기 전에 인터럽트를 보내면 취소됩니다.


Liveness Lock 에서 본 교착 상태 문제를 해결하기 위해 객체를 사용합시다. 
Alphonse와 Gaston은 친구가 활을 댈 때를 알아 차릴 수 있도록 훈련했습니다. 
우리 는 활을 계속하기 전에 두 대상이 모두 자물쇠를 채워야한다고 요구함으로써 이러한 개선을 모델링 합니다. 
다음은 개선 된 모델의 소스 코드입니다. 
이 관용구의 다양성을 보여주기 위해, 우리는 Alphonse와 Gaston이 서로에게 굴복을 멈추지 않도록 안전하게 구부릴 수있는 새로운 기능Friend Safelock에 너무 몰입했다고 가정합니다.

```java
package com.github.sejoung.codetest.concurrent.highlevel;

import java.util.Random;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class Safelock {

  public static void main(String[] args) {
    final Friend alphonse = new Friend("Alphonse");
    final Friend gaston = new Friend("Gaston");
    new Thread(new BowLoop(alphonse, gaston)).start();
    new Thread(new BowLoop(gaston, alphonse)).start();
  }

  static class Friend {

    private final String name;
    private final Lock lock = new ReentrantLock();

    public Friend(String name) {
      this.name = name;
    }

    public String getName() {
      return this.name;
    }

    public boolean impendingBow(Friend bower) {
      Boolean myLock = false;
      Boolean yourLock = false;
      try {
        myLock = lock.tryLock();
        yourLock = bower.lock.tryLock();
      } finally {
        if (!(myLock && yourLock)) {
          if (myLock) {
            lock.unlock();
          }
          if (yourLock) {
            bower.lock.unlock();
          }
        }
      }
      return myLock && yourLock;
    }

    public void bow(Friend bower) {
      if (impendingBow(bower)) {
        try {
          System.out.format("%s: %s has"
                  + " bowed to me!%n",
              this.name, bower.getName());
          bower.bowBack(this);
        } finally {
          lock.unlock();
          bower.lock.unlock();
        }
      } else {
        System.out.format("%s: %s started"
                + " to bow to me, but saw that"
                + " I was already bowing to"
                + " him.%n",
            this.name, bower.getName());
      }
    }

    public void bowBack(Friend bower) {
      System.out.format("%s: %s has" +
              " bowed back to me!%n",
          this.name, bower.getName());
    }
  }

  static class BowLoop implements Runnable {

    private Friend bower;
    private Friend bowee;

    public BowLoop(Friend bower, Friend bowee) {
      this.bower = bower;
      this.bowee = bowee;
    }

    public void run() {
      Random random = new Random();
      for (; ; ) {
        try {
          Thread.sleep(random.nextInt(10));
        } catch (InterruptedException e) {
        }
        bowee.bow(bower);
      }
    }
  }
}

```
실행결과
```
Alphonse: Gaston has bowed to me!
Gaston: Alphonse started to bow to me, but saw that I was already bowing to him.
Gaston: Alphonse has bowed back to me!
Alphonse: Gaston has bowed to me!
Gaston: Alphonse has bowed back to me!
Alphonse: Gaston has bowed to me!
Gaston: Alphonse has bowed back to me!
Gaston: Alphonse started to bow to me, but saw that I was already bowing to him.
Alphonse: Gaston has bowed to me!
Gaston: Alphonse has bowed back to me!
Gaston: Alphonse has bowed to me!
Alphonse: Gaston has bowed back to me!

Process finished with exit code -1

```

#### Executors

이전 예제 모두에서, Runnable 객체에 의해 정의 된 새로운 스레드에 의해 수행되는 작업 과 객체에 의해 정의 된 스레드 자체 사이에 긴밀한 연결이 있습니다. 
이것은 작은 응용 프로그램에서는 잘 작동하지만 대규모 응용 프로그램에서는 나머지 응용 프로그램과 스레드 관리 및 작성을 분리하는 것이 좋습니다. 
이러한 기능을 캡슐화하는 객체를 실행 프로그램이라고 합니다. 
다음 하위 섹션에서는 Executors에 대해 자세히 설명합니다.

* Executor Interfaces는 세 개의 Executor 객체 유형을 정의합니다.
* Thread Pools은 가장 일반적인 종류의 실행 프로그램 구현입니다.
* Fork/Join은 다중 프로세서를 활용하기위한 프레임 워크입니다 (JDK 7의 새로운 기능).

##### Executor Interfaces
이 java.util.concurrent 패키지는 3 개의 실행자 인터페이스를 정의합니다.

* Executor, 새로운 작업을 시작하는 것을 지원하는 간단한 인터페이스.
* ExecutorService, 하위 인터페이스로 Executor, 라이프 사이클, 개별 작업 및 실행 프로그램 자체의 관리에 도움이되는 기능을 추가합니다.
* ScheduledExecutorService,의 하위 인터페이스 ExecutorService는 작업의 미래 및 / 또는 주기적 실행을 지원합니다.

일반적으로, 실행 프로그램 오브젝트를 참조하는 변수는 실행 프로그램 클래스 유형이 아닌이 세 가지 인터페이스 유형 중 하나로 선언됩니다.


###### The Executor Interface

이 Executor인터페이스는 하나의 메소드를 제공합니다.
이 메소드 execute는 일반적인 스레드 생성 관용구의 드롭 인 대체품으로 설계되었습니다. r는 Runnable 객체이며 대체 할 수 e 있는 Executor객체입니다.

`(new Thread(r)).start();`

`e.execute(r);`

그러나 그 정의 execute는 덜 구체적입니다. 
하위 레벨 관용구는 새로운 스레드를 생성하고 즉시 시작합니다. 
Executor구현 에 따라 execute 동일한 작업을 수행 할 수 있지만 기존 작업자 스레드를 r을 사용하여 실행 하거나 작업자 r 스레드가 사용 가능할 때까지 대기열에 배치 할 가능성이 큽니다. 
(우리는 스레드 풀 에 대한 절에서 작업자 스레드를 설명 할 것 입니다.)

실행 프로그램 구현 은 기본 인터페이스 와도 작동하지만 java.util.concurrent Executor는 고급 인터페이스 ExecutorService와 ScheduledExecutorService 인터페이스를 최대한 활용하도록 설계되었습니다 .

###### The ExecutorService Interface

ExecutorService 인터페이스 보충제 execute 유사하지만, 더 다양한와 submit방법. 
마찬가지로 execute, 객체를 submit 받아들이지 Runnable만, Callable객체가 값을 반환하도록 허용하는 객체 도 허용 합니다. 
이 submit메서드는 반환 값 Future을 검색하고 Callable둘 다 Callable및 Runnable작업 의 상태를 관리하는 데 사용되는 개체를 반환 합니다.


ExecutorService 또한 대규모 Callable개체 컬렉션을 제출하는 방법을 제공 합니다. 
마지막으로, ExecutorService실행 프로그램 종료를 관리하는 여러 가지 메소드를 제공합니다. 
즉각적인 종료를 지원하려면 작업이 인터럽트를 올바르게 처리해야 합니다.

###### The ScheduledExecutorService Interface

ScheduledExecutorService 인터페이스는 부모의 보충 방법 ExecutorService으로 schedule실행하고, Runnable또는 Callable소정의 지연 후에 작업. 
또한, 상기 인터페이스를 정의 scheduleAtFixedRate 하고 scheduleWithFixedDelay 정의 된 간격으로 반복적으로 특정 작업을 수행한다.

##### Thread Pools

java.util.concurrent사용중인 스레드 풀 의 executor 구현은 대부분 작업자 스레드 로 구성됩니다. 
이 종류의 스레드는 실행되는 태스크 Runnable와 별도로 존재하며 Callable 여러 태스크를 실행하는 데 자주 사용됩니다.

작업자 스레드를 사용하면 스레드 생성으로 인한 오버 헤드가 최소화됩니다. 
스레드 객체는 상당한 양의 메모리를 사용하고 대규모 응용 프로그램에서는 많은 스레드 객체를 할당 및 할당 해제하면 상당한 메모리 관리 오버 헤드가 발생합니다.

스레드 풀의 한 가지 일반적인 유형은 고정 된 스레드 풀 입니다. 
이 유형의 풀에는 항상 지정된 수의 스레드가 실행됩니다. 
스레드가 아직 사용 중일 때 어떻게 든 종료되면 새 스레드로 자동 교체됩니다. 
작업은 스레드보다 많은 활성 작업이있을 때마다 추가 작업을 보유하는 내부 대기열을 통해 풀에 제출됩니다.

고정 된 스레드 풀의 중요한 장점은 이를 사용하는 응용 프로그램 이 정상적으로 작동된다는 것 입니다.
이를 이해하려면 각 HTTP 요청이 별도의 스레드에 의해 처리되는 웹 서버 응용 프로그램을 고려하십시오. 
응용 프로그램이 모든 새 HTTP 요청에 대해 새 스레드를 생성하고 시스템이 즉시 처리 할 수있는 것보다 많은 요청을받는 경우 모든 스레드의 오버 헤드가 시스템의 용량을 초과하면 모든 요청에 대한 응용 프로그램의 응답이 갑자기 중지 됩니다. 
만들 수있는 스레드 수에 제한이 있기 때문에 응용 프로그램은 들어오는 것처럼 빠르게 HTTP 요청을 처리하지는 않지만 시스템이 유지할 수있는 한 빨리 서비스를 처리합니다.

고정 된 스레드 풀을 사용하는 실행 프로그램을 만드는 간단한 newFixedThreadPool방법은 java.util.concurrent.Executors 이 팩토리 메소드 를 호출하는 것입니다. 
이 클래스는 또한 다음 팩토리 메소드를 제공합니다.

* 이 newCachedThreadPool메소드는 확장 가능한 스레드 풀과 함께 실행 프로그램을 작성합니다. 
이 실행 프로그램은 많은 단명 작업을 시작하는 응용 프로그램에 적합합니다.

* 이 newSingleThreadExecutor메소드는 한 번에 하나의 태스크를 실행하는 실행 프로그램을 작성합니다.

* 몇 가지 팩토리 메소드는 ScheduledExecutorService 위 실행자의 버전입니다.

위의 팩토리 메소드에서 제공하는 집행자 중 어느 것도 요구 사항을 충족시키지 못하면 인스턴스를 생성 java.util.concurrent.ThreadPoolExecutor 하거나 java.util.concurrent.ScheduledThreadPoolExecutor 추가 옵션을 제공합니다.

##### Fork/Join

fork/join framework는 ExecutorService 다중 프로세서를 활용하는 데 도움이 되는 인터페이스 의 구현입니다. 
재귀 적으로 작은 조각으로 나눌 수있는 작업을 위해 설계되었습니다. 
목표는 사용 가능한 모든 처리 성능을 사용하여 응용 프로그램의 성능을 향상시키는 것입니다.

어떤과 마찬가지로 ExecutorService구현, 포크 / 조인 프레임 워크는 스레드 풀의 작업자 스레드에 작업을 분배합니다. 
포크 / 조인 프레임 워크는 작업 도용 알고리즘을 사용하기 때문에 뚜렷 합니다. 
실행되지 않는 작업 스레드는 여전히 사용중인 다른 스레드에서 작업을 도용 할 수 있습니다.

포크 / 조인 프레임 워크의 중심은 ForkJoinPool 클래스이며 AbstractExecutorService 클래스의 확장입니다. 
ForkJoinPool 핵심 작업 도용 알고리즘을 구현하고 ForkJoinTask 프로세스 를 실행할 수 있습니다 .

###### Basic Use

포크 / 조인 프레임 워크를 사용하기위한 첫 번째 단계는 작업의 세그먼트를 수행하는 코드를 작성하는 것입니다. 
코드는 다음 의사 코드와 비슷하게 보입니다.

```
if (내 부분이 충분히 작다)
    일을 직접한다.
else
  내 일을 두 조각으로 나눠 라.
  두 부분을 호출하고 결과를 기다린다.
  
```

ForkJoinTask서브 클래스 에이 코드를 랩합니다. 
일반적으로 RecursiveTask는, 결과를 돌려 줄 수가있는 RecursiveAction 보다 특화된 형태의 1개를 사용 합니다.

당신의 후 ForkJoinTask서브 클래스가 준비되어, 모든 작업이 완료 될 나타내는 개체를 만들고에 전달 invoke()의 방법 ForkJoinPool인스턴스입니다.

###### Blurring for Clarity

포크 / 조인 프레임 워크의 작동 방식을 이해하려면 다음 예제를 고려하십시오. 
이미지를 흐리게 처리한다고 가정합니다. 
원본 소스 이미지는 정수 배열로 표현되며 각 정수에는 단일 픽셀의 색상 값이 포함됩니다. 
흐리게 처리 된 대상 이미지는 소스와 크기가 같은 정수 배열로 표시됩니다.

흐림 효과는 한 번에 하나의 픽셀 씩 소스 배열을 통해 작업함으로써 수행됩니다. 
각 픽셀은 주변 픽셀과 함께 평균화되며 (빨강, 녹색 및 파랑 구성 요소의 평균이 계산됩니다) 결과가 대상 배열에 배치됩니다. 
이미지가 큰 배열이므로이 프로세스는 오랜 시간이 걸릴 수 있습니다. 
fork / join 프레임 워크를 사용하여 알고리즘을 구현함으로써 다중 프로세서 시스템에서 동시 처리를 활용할 수 있습니다. 
가능한 구현은 다음과 같습니다.

```java

public class ForkBlur extends RecursiveAction {
    private int[] mSource;
    private int mStart;
    private int mLength;
    private int[] mDestination;
  
    // Processing window size; should be odd.
    private int mBlurWidth = 15;
  
    public ForkBlur(int[] src, int start, int length, int[] dst) {
        mSource = src;
        mStart = start;
        mLength = length;
        mDestination = dst;
    }

    protected void computeDirectly() {
        int sidePixels = (mBlurWidth - 1) / 2;
        for (int index = mStart; index < mStart + mLength; index++) {
            // Calculate average.
            float rt = 0, gt = 0, bt = 0;
            for (int mi = -sidePixels; mi <= sidePixels; mi++) {
                int mindex = Math.min(Math.max(mi + index, 0),
                                    mSource.length - 1);
                int pixel = mSource[mindex];
                rt += (float)((pixel & 0x00ff0000) >> 16)
                      / mBlurWidth;
                gt += (float)((pixel & 0x0000ff00) >>  8)
                      / mBlurWidth;
                bt += (float)((pixel & 0x000000ff) >>  0)
                      / mBlurWidth;
            }
          
            // Reassemble destination pixel.
            int dpixel = (0xff000000     ) |
                   (((int)rt) << 16) |
                   (((int)gt) <<  8) |
                   (((int)bt) <<  0);
            mDestination[index] = dpixel;
        }
    }
    
}

```


이제 compute()블러를 직접 수행하거나 두 개의 작은 태스크로 분할 하는 추상 메소드 를 구현 합니다. 
간단한 배열 길이 임계 값은 작업 수행 여부를 결정하는 데 도움이됩니다.

```java

protected static int sThreshold = 100000;

protected void compute() {
    if (mLength < sThreshold) {
        computeDirectly();
        return;
    }
    
    int split = mLength / 2;
    
    invokeAll(new ForkBlur(mSource, mStart, split, mDestination),
              new ForkBlur(mSource, mStart + split, mLength - split,
                           mDestination));
}

```

이전 메소드가 클래스의 서브 클래스에있는 경우 RecursiveAction, a에서 실행할 태스크를 설정하는 ForkJoinPool것은 간단하며 다음 단계가 포함됩니다.

* 수행 할 모든 작업을 나타내는 작업을 만듭니다.
  
```java

// 원본 이미지 픽셀이 src에 있습니다.
// 목적지 이미지 픽셀이 dst에 있습니다.
ForkBlur fb = new ForkBlur (src, 0, src.length, dst);

```

* ForkJoinPool해당 작업을 실행할 파일을 만듭니다 .

`ForkJoinPool pool = new ForkJoinPool();`  

* 작업을 실행하십시오.

`pool.invoke (fb);`

###### Standard Implementations

포크 / 조인 프레임 워크를 사용하여 멀티 프로세서 시스템에서 동시에 수행 할 작업 (예 : ForkBlur.java이전 섹션 의 예)에 대한 사용자 정의 알고리즘을 구현하는 것 외에도 포크 / 조인을 사용하여 이미 구현 된 Java SE에는 일반적으로 유용한 몇 가지 기능이 있습니다 뼈대. 
Java SE 8에서 소개 된 이러한 구현 중 하나는 java.util.Arrays클래스에서 해당 parallelSort()메소드에 사용됩니다. 
이러한 메소드는 sort() fork / join 프레임 워크 와 유사 하지만 병행 성을 활용합니다. 
대형 어레이의 병렬 정렬은 다중 프로세서 시스템에서 실행될 때 순차 정렬보다 빠릅니다. 
그러나 이러한 메소드로 fork / join 프레임 워크가 얼마나 정확하게 활용되는지는 Java 자습서의 범위를 벗어납니다. 
이 정보는 Java API 문서를 참조하십시오.

포크 / 조인 프레임 워크의 또 다른 구현은 java.util.streams 패키지의 메소드에 의해 사용되며, 이는 Java SE 8 릴리스에 대해 스케줄 된 Project Lambda의 일부입니다. 
자세한 내용은 Lambda Expressions 절을 참조하십시오 .

#### Concurrent Collections

java.util.concurrent패키지는 자바 컬렉션 프레임 워크에 추가의 숫자를 포함하고 있습니다. 
이들은 제공되는 컬렉션 인터페이스에 의해 가장 쉽게 분류됩니다 :

* BlockingQueue 전체 큐에 추가를 시도하거나 빈 큐에서 검색하려고 시도 할 때 블록되거나 시간 초과되는 선입 선출 (FIFO) 데이터 구조를 정의합니다.

* ConcurrentMap java.util.Map 유용한 하위 작업을 정의 하는 하위 인터페이스입니다. 
이러한 조작은 키가있는 경우에만 키 - 값 쌍을 제거하거나 대체하거나, 키가없는 경우에만 키 - 값 쌍을 추가합니다. 
이러한 작업을 원 자성으로 만드는 것은 동기화를 피하는 데 도움이됩니다. 표준 범용 구현 ConcurrentMap 은 ConcurrentHashMap 의 HashMap 동시 아날로그이다 .

* ConcurrentNavigableMap ConcurrentMap 근사 일치를 지원 하는 하위 인터페이스입니다. 
표준 범용 구현 ConcurrentNavigableMap IS ConcurrentSkipListMap의 TreeMap 동시 아날로그이다 .

이러한 모든 컬렉션은 컬렉션 에 개체를 추가하는 작업과 해당 개체에 액세스하거나 제거하는 후속 작업간에 발생하는 관계를 정의하여 메모리 일관성 오류 를 방지하는 데 도움이 됩니다.

#### Atomic Variables

이 java.util.concurrent.atomic 패키지는 단일 변수에 대한 기본 작업을 지원하는 클래스를 정의합니다. 
모든 클래스에는 volatile 변수 에 대한 읽기 및 쓰기와 같은 메소드 get및 set메소드가 있습니다. 
즉, a set는 get동일한 변수에서 후속 항목과 발생하기 전에 관계를 맺습니다. 
atomic compareAndSet 메소드는 정수형 원자 변수에 적용되는 단순한 원자 산술 메소드처럼 메모리 일관성 기능도 가지고 있습니다.

이 패키지가 어떻게 사용되는지 보려면 Counter스레드 간섭을 설명하기 위해 원래 사용 했던 클래스로 돌아가십시오 .

```java

package com.github.sejoung.codetest.concurrent.synchronization;

class Counter {

  private int c = 0;

  public void increment() {
    c++;
  }

  public void decrement() {
    c--;
  }

  public int value() {
    return c;
  }

}

```

Counter스레드 간섭으로부터 안전하게하는 한 가지 방법 은 SynchronizedCounter 다음 과 같이 메소드를 동기화하는 것입니다 .

```java

package com.github.sejoung.codetest.concurrent.synchronization;

public class SynchronizedCounter {

  private int c = 0;

  public synchronized void increment() {
    c++;
  }

  public synchronized void decrement() {
    c--;
  }

  public synchronized int value() {
    return c;
  }
}


```
이 간단한 클래스의 경우 동기화가 허용 가능한 솔루션입니다. 
그러나 더 복잡한 클래스의 경우에는 불필요한 동기화로 인한 영향을 피할 수 있습니다. 
일 교체 int와 필드 것은 AtomicInteger우리가 같이 동기화에 의존하지 않고 스레드 간섭을 방지 할 수 있습니다 AtomicCounter:


```java

package com.github.sejoung.codetest.concurrent.synchronization;


import java.util.concurrent.atomic.AtomicInteger;

class AtomicCounter {

  private AtomicInteger c = new AtomicInteger(0);

  public void increment() {
    c.incrementAndGet();
  }

  public void decrement() {
    c.decrementAndGet();
  }

  public int value() {
    return c.get();
  }

}

```

#### Concurrent Random Numbers

JDK 7 java.util.concurrent에는 ForkJoinTask 편의 클래스가 포함 ThreadLocalRandom 되어 있습니다. 
여러 스레드 또는 스레드에서 임의의 숫자를 사용할 것으로 예상되는 응용 프로그램 의 경우.

동시 액세스 ThreadLocalRandom의 경우 Math.random()결과 대신 경쟁을 덜 사용 하고 결국 궁극적으로 성능을 향상시킵니다.

당신이해야 할 일은 전화해서 ThreadLocalRandom.current(), 난수를 가져 오는 메소드 중 하나를 호출하는 것입니다. 
다음은 한 가지 예입니다.

`int r = ThreadLocalRandom.current().nextInt (4, 77);`


# 참조
-----
* [High Level Concurrency Objects](https://docs.oracle.com/javase/tutorial/essential/concurrency/highlevel.html)
* [Lock Objects](https://docs.oracle.com/javase/tutorial/essential/concurrency/newlocks.html)
* [executors](https://docs.oracle.com/javase/tutorial/essential/concurrency/executors.html)
* [Concurrent Collections](https://docs.oracle.com/javase/tutorial/essential/concurrency/collections.html)
* [javaconcurrenta](https://sourceforge.net/projects/javaconcurrenta/)


