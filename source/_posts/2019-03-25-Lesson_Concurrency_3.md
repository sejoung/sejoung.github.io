---
layout: post
title: "동시성(Concurrency) Synchronization"
date: 2019-03-25 11:50 +0900
comments: true
tags : ["동시성", "Concurrency", "Synchronization"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 동시성(Concurrency)

### 동기화(Synchronization)

쓰레드는 주로 필드에 대한 액세스를 공유함으로써 통신하며 객체 참조 필드는 참조합니다. 
이러한 형태의 통신은 매우 효율적이지만 스레드 간섭 과 메모리 일관성 오류 의 두 가지 종류가 있습니다. 
이러한 오류를 방지하는 데 필요한 도구는 동기화 입니다.

그러나 동기화가 도입 할 수 스레드 경합 두 개 이상의 스레드가 동시에 같은 리소스에 액세스하려고 할 때 발생 및 Java 런타임이 더 느리게 하나 개 이상의 스레드를 실행, 심지어 자신의 실행을 일시 중단의 원인을 제공한다..  
Starvation and livelock은 스레드 경합의 형태입니다. 
자세한 정보는 Liveness 섹션 을 참조하십시오.

이 절에서는 다음 주제를 다룹니다.

* 스레드 간섭 은 여러 스레드가 공유 데이터에 액세스 할 때 오류가 발생하는 방식을 설명합니다.
* 메모리 일관성 오류 (Memory Consistency Errors) 는 일관성 없는 공유 메모리보기로 인한 오류를 설명합니다.
* Synchronized Methods 는 스레드 간섭과 메모리 일관성 오류를 효과적으로 방지 할 수있는 간단한 관용구를 설명합니다.
* 암시 적 잠금 및 동기화 보다 일반적인 동기화 관용구를 설명하고 암시 적 잠금에 기반한 동기화 방법을 설명합니다.
* Atomic Access 는 다른 스레드가 간섭 할 수없는 작업의 일반적인 개념에 대해 설명합니다.

#### Thread Interference

간단한 클래스를(Counter) 호출하자. 

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

Counter 각각의 호출은 increment c에서 1을 더하고 , 각각의 decrement 호출은 c에서 1을 뺀다.
그러나 Counter개체가 여러 스레드에서 참조되는 경우 스레드 간의 간섭으로 인해이 문제가 예상대로 발생하지 않을 수 있습니다.

간섭은 서로 다른 스레드에서 실행되지만 동일한 데이터에서 작동하는 두 가지 작업이 인터리브 될 때 발생합니다. 
이것은 두 작업이 여러 단계로 구성되며 단계의 순서가 겹치는 것을 의미합니다.

Counter 두 가지 작업이 c모두 단일, 간단한 문장 이므로 인터리브 할 인스턴스에 대한 작업이 불가능할 수도 있습니다. 
그러나 단순한 명령문조차도 가상 시스템에 의해 여러 단계로 변환 될 수 있습니다. 
우리는 가상 머신이 취하는 특정 단계를 조사하지 않을 것입니다. 
단일 표현식 c++을 세 단계로 분해 할 수 있다는 것을 알고 있으면 충분 합니다.

1. c 의 현재 값을 가져옵니다.
1. 검색된 값을 1 씩 증가시킵니다.
1. 증분 된 값을 c에 다시 저장하십시오.

표현식 c--은 두 번째 단계가 증가 대신 감소한다는 점을 제외하면 같은 방식으로 분해 될 수 있습니다.

스레드 A가 increment스레드 B가 호출하는 것과 거의 동시에 decrement 호출하는 것으로 가정하십시오. 
c 의 초기 값이 인 경우 0, 인터리브 된 작업은 다음 순서를 따를 수 있습니다.

1. 스레드 A : 검색 c.
1. 스레드 B : 검색 c.
1. 스레드 A : 검색된 값을 증가시킵니다. 결과는 1입니다.
1. 스레드 B : 검색된 값의 감소. 결과는 -1입니다.
1. 스레드 A : 저장소 결과는 C; c는 이제 1입니다.
1. 스레드 B : 결과 저장 c; c는 이제 -1입니다.

스레드 A의 결과는 손실되고 스레드 B에 의해 덮어 쓰여집니다.
이 특정 인터리빙은 한 가지 가능성에 불과합니다. 
다른 상황에서는 스레드 B의 결과가 손실되거나 전혀 오류가 없을 수 있습니다. 
예측할 수 없으므로 스레드 간섭 버그를 찾아서 수정하기가 어려울 수 있습니다.


#### Memory Consistency Errors

메모리 일관성 오류 는 서로 다른 스레드가 동일한 데이터가 무엇인지에 대해 일관성없는 보기가있을 때 발생합니다. 
메모리 일관성 오류의 원인은 복잡하며이 자습서의 범위를 벗어납니다. 
다행히도 프로그래머는 이러한 원인을 자세히 이해할 필요가 없습니다. 
필요한 것은 피하는 전략입니다.

메모리 일관성 오류를 피하기위한 핵심은 발생하기 전에 관계를 이해하는 것 입니다. 
이 관계는 하나의 특정 명령문에 의한 메모리 쓰기가 다른 특정 명령문에서 볼 수 있다는 것을 보증합니다. 
이를 보시려면 다음 예제를 고려하십시오. 
간단한 int 필드가 정의되고 초기화 되었다고 가정 해보십시오 .

`int counter = 0;`

이 counter필드는 A와 B의 두 스레드간에 공유됩니다. 
스레드 A가 counter 증가하는 것으로 가정하십시오 .

`counter++`

그런 다음 곧 스레드 B가 counter를 인쇄합니다.

`System.out.println (counter);`

두 문장이 같은 스레드에서 실행 되었다면 출력 된 값이 "1"이라고 가정하는 것이 안전합니다. 
그러나 두 문장이 분리 된 쓰레드에서 실행된다면, 출력 된 값은 "0"이 될 수도 있습니다. 
왜냐하면 counter 프로그래머가 이들 사이의 일이 앞선 관계를 확립하지 않는 한, 쓰레드 A의 변화 가 쓰레드 B에게 보여 질 것이라는 보장이 없기 때문 입니다.

동시 발생 관계를 작성하는 몇 가지 조치가 있습니다. 그 중 하나는 동기화입니다. 다음 섹션에서 살펴 보겠습니다.

이미 우연의 관계를 만들어내는 두 가지 행동을 이미 보았습니다.

* 명령문이 호출 될 때, Thread.start 해당 명령문과 happen-before 관계가있는 모든 명령문은 새 스레드가 실행 한 모든 명령문과 happen-before 관계를 갖습니다. 
새로운 쓰레드를 생성하게 만든 코드의 효과는 새로운 쓰레드에서 볼 수 있습니다.

* 스레드가 종료되고 Thread.join 다른 스레드의 a가 리턴되면 종료 된 스레드가 실행 한 모든 명령문은 성공적인 결합 이후의 모든 명령문과 happen-before 관계를 갖습니다. 
스레드에서 코드의 효과는 이제 조인을 수행 한 스레드에서 볼 수 있습니다.

동시 발생 관계를 작성하는 조치 목록은 패키지 의 요약 페이지를 java.util.concurrent 참조하십시오 .


#### Synchronized Methods

Java 프로그래밍 언어는 동기화 된 메소드 와 동기화 된 명령문 이라는 두 가지 기본 동기화 관용구를 제공 합니다. 
보다 복잡한 두 개의 동기화 된 명령문에 대해서는 다음 절에서 설명합니다. 
이 섹션은 동기화 된 메소드에 관한 것입니다.

메소드를 동기화하려면 선언에 synchronized 키워드를 추가하기만 하면 됩니다.

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

만약 count 가의 인스턴스 인 경우 SynchronizedCounter 이러한 메소드를 동기화하면 두 가지 효과가 있습니다.


* 우선, 같은 오브젝트상의 동기 메소드의 2 회의 호출은 인터리브 할 수 없습니다. 
한 스레드가 객체에 대해 동기화 된 메소드를 실행할 때 첫 번째 스레드가 객체로 완료 될 때까지 동일한 객체 블록에 대해 동기화 된 메소드를 호출하는 다른 모든 스레드 (실행 일시 중단).

* 둘째, 동기화 된 메소드가 종료되면 같은 객체에 대한 동기화 된 메소드의 후속 호출 과 자동으로 '발생 - 이전'관계를 설정 합니다. 
이렇게하면 모든 스레드에서 객체 상태에 대한 변경 사항을 볼 수 있습니다.

생성자 와 synchronized 키워드를 사용하는 것은 구문 오류이므로 생성자 를 동기화 할 수 없습니다. 
생성자를 동기화하는 것은 의미가 없습니다. 
왜냐하면 객체를 만드는 스레드 만이 생성되는 동안 액세스 할 수 있어야하기 때문입니다.

동기화 된 메소드는 스레드 간섭 및 메모리 일관성 오류를 방지하기위한 간단한 전략을 가능하게합니다. 
객체가 둘 이상의 스레드에서 볼 수있는 경우 해당 객체의 변수에 대한 모든 읽기 또는 쓰기는 synchronized 메소드를 통해 수행됩니다. 
(중요한 예외 : final객체가 생성 된 후에 수정할 수없는 필드는 객체가 생성되면 비동기 메소드를 통해 안전하게 읽을 수 있습니다.)
이 전략은 효과적이지만 생명력 문제를 나타낼 수 있습니다. 이 단원 뒷부분.

#### Intrinsic Locks and Synchronization

동기화는 내장 잠금 또는 모니터 잠금 이라고하는 내부 엔티티를 기반으로합니다 . 
(API 사양은 종종이 엔티티를 단순히 "모니터"라고 부릅니다.) 고유 잠금은 객체 상태에 대한 독점적 액세스를 강제하고 가시성에 필수적인 선행 관계를 설정하는 등의 두 가지 측면에서 동기화 역할을합니다.

모든 객체에는 고유 한 잠금이 있습니다. 
관례 상, 객체의 필드 독점하고 일관된 접근을 필요로하는 스레드가하는 인수 를 액세스하기 전에 개체의 고유 잠금을 한 후 해제 가 그들과 함께 끝나면 고유 잠금을. 
스레드는 잠금을 획득하고 잠금을 해제 한 시간 사이에 고유 잠금 을 소유 한다고합니다. 
스레드가 고유 잠금을 소유하고있는 한 다른 스레드는 동일한 잠금을 획득 할 수 없습니다.
다른 스레드는 잠금 획득을 시도 할 때 차단됩니다.

스레드가 내장 잠금을 해제하면 해당 작업과 이후에 동일한 잠금을 획득하는 사이에 발생 전 관계가 설정됩니다.

##### Locks In Synchronized Methods

스레드가 동기화 된 메서드를 호출하면 메서드의 개체에 대한 고유 잠금을 자동으로 가져 와서 메서드가 반환 될 때 해제합니다. 
잠금 해제는 catch되지 않은 예외로 인해 반환 된 경우에도 발생합니다.

정적(static) 메소드가 객체가 아닌 클래스와 연관되어 있기 때문에 정적 동기화 메소드가 호출 될 때 어떤 일이 발생하는지 궁금 할 수 있습니다. 
이 경우 스레드는 Class클래스와 연관된 객체에 대한 고유 잠금을 획득합니다. 
따라서 클래스의 정적 필드에 대한 액세스는 클래스의 모든 인스턴스에 대한 잠금과 구별되는 잠금에 의해 제어됩니다.


##### Synchronized Statements

동기화 된 코드를 만드는 또 다른 방법은 synchronized 문을 사용하는 것 입니다. 
동기화 된 메서드와 달리 synchronized 문은 고유 잠금을 제공하는 개체를 지정해야합니다.

```java

public void addName(String name) {
    synchronized(this) {
        lastName = name;
        nameCount++;
    }
    nameList.add(name);
}

```

이 예제에서 addName메소드는 lastName및의 변경 사항을 동기화 nameCount 해야하지만 다른 객체 메소드의 호출을 동기화하지 않아야합니다. 
(동기화 된 코드에서 다른 객체의 메서드를 호출하면 Liveness 에 대한 섹션에서 설명하는 문제가 발생할 수 있습니다 .) 
동기화 된 명령문이 없으면 호출 목적으로 별도의 동기화되지 않은 메서드가 있어야합니다 nameList.add.

동기화 된 명령문은 세밀한 동기화로 동시성을 향상시키는데도 유용합니다. 
가정, 예를 들어, 클래스는 MsLunch두 개의 인스턴스 필드 가지고 c1와 c2함께 사용되지 않습니다. 
이 필드의 모든 업데이트는 동기화되어야하지만 c1의 업데이트가 c2의 업데이트로 인터리브되지 않도록해야합니다. 
이렇게하면 불필요한 블로킹을 만들어 동시성을 줄일 수 있습니다. 
동기화 된 메서드를 사용하거나 연관된 잠금을 사용하는 대신에 잠금 this을 제공하기 위해 두 개의 개체를 만듭니다.

```java

package com.github.sejoung.codetest.concurrent.synchronization;

public class MsLunch {

  private long c1 = 0;
  private long c2 = 0;
  private Object lock1 = new Object();
  private Object lock2 = new Object();

  public void inc1() {
    synchronized (lock1) {
      c1++;
    }
  }

  public void inc2() {
    synchronized (lock2) {
      c2++;
    }
  }
}

```

이 관용구를 주의 깊게 사용하십시오. 
영향을받는 필드의 액세스를 인터리브하는 것이 실제로 안전하다는 것을 절대적으로 확신해야합니다.

##### Reentrant Synchronization

스레드가 다른 스레드가 소유 한 잠금을 획득 할 수 없음을 상기하십시오. 
그러나 스레드 는 이미 소유하고있는 잠금을 획득 할 수 있습니다. 
스레드가 동일한 잠금을 두 번 이상 획득하도록 허용하면 재진입 성 동기화가 가능 합니다 . 
동기화 된 코드가 직접 또는 간접적으로 동기화 된 코드를 포함하는 메소드를 호출하고 두 코드 세트 모두 동일한 잠금을 사용하는 상황을 설명합니다. 
재진입 동기화가 없다면, 동기화 된 코드는 스레드가 스스로를 차단하는 것을 피하기 위해 많은 추가 예방 조치를 취해야합니다.

#### Atomic Access

프로그래밍에서 원자 적 동작은 모든 것을 효과적으로 발생시킵니다. 
원자적인 행동은 중간에 멈출 수 없습니다. 
그것은 완전히 일어나거나 전혀 일어나지 않습니다. 
동작이 완료 될 때까지 원자 적 동작의 부작용이 보이지 않습니다.

우리는 이미 증가 된 표현식 (예 :와 같은 c++)이 원자 적 동작을 설명하지 않는다는 것을 이미 보았습니다. 
아주 단순한 표현조차도 다른 동작으로 분해 할 수있는 복잡한 동작을 정의 할 수 있습니다. 
그러나 원자 단위로 지정할 수있는 작업이 있습니다.

* 읽기와 쓰기가 (제외한 모든 종류의 기준 변수에 대한 가장 원시적 인 변수 원자이다 long하고 double).
* 읽기 및 쓰기는 선언 된 모든 변수 volatile( 포함 long 및 double변수)에 대한 기본 요소입니다.

원자 적 동작은 인터리브 될 수 없으므로 스레드 간섭의 두려움없이 사용할 수 있습니다. 
그러나 이것은 메모리 일관성 오류가 여전히 가능하기 때문에 원자 작업을 동기화 할 필요성을 모두 제거하지는 못합니다. 
volatile변수에 대한 쓰기 volatile가 동일한 변수의 후속 읽기와의 관계를 설정 하기 때문에 변수를 사용하면 메모리 일관성 오류의 위험이 줄어 듭니다. 
즉, volatile변수 에 대한 변경 사항 은 항상 다른 스레드에서 볼 수 있습니다. 
또한 스레드가 volatile 변수를 읽으면 변경된 최신 volatile 코드뿐 아니라 변경 사항을 초래 한 코드의 부작용도 확인합니다.

간단한 원자 변수 액세스를 사용하는 것이 동기화 된 코드를 통해 이러한 변수에 액세스하는 것보다 효율적이지만 메모리 일관성 오류를 피하기 위해 프로그래머가 더 많은주의를 기울여야합니다. 
추가 작업이 가치가 있는지 여부는 응용 프로그램의 크기와 복잡성에 따라 다릅니다.

java.util.concurrent 패키지 의 일부 클래스는 동기화에 의존하지 않는 원 자성 메소드를 제공합니다. 
우리는 그것들을 고수준 동시성 객체 에 대한 절에서 논의 할 것이다.


# 참조
-----
* [Synchronization](https://docs.oracle.com/javase/tutorial/essential/concurrency/sync.html)
* [Thread Interference](https://docs.oracle.com/javase/tutorial/essential/concurrency/interfere.html)
* [Memory Consistency Errors](https://docs.oracle.com/javase/tutorial/essential/concurrency/memconsist.html)
* [java.util.concurrent](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/package-summary.html#MemoryVisibility)
* [Synchronized Methods](https://docs.oracle.com/javase/tutorial/essential/concurrency/syncmeth.html)
* [Intrinsic Locks and Synchronization](https://docs.oracle.com/javase/tutorial/essential/concurrency/locksync.html)
* [Atomic Access](https://docs.oracle.com/javase/tutorial/essential/concurrency/atomic.html)
