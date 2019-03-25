---
layout: post
title: "동시성(Concurrency) Liveness"
date: 2019-03-25 14:11 +0900
comments: true
tags : ["동시성", "Concurrency", "Liveness"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 동시성(Concurrency)

### 생명(Liveness)

적시에 동시 응용 프로그램을 실행할 수있는 기능을 활성이라고 합니다. 
이 섹션에서는 가장 일반적인 종류의 생명 문제, 교착 상태 에 대해 설명하고 다른 두 가지 생명 문제, 기아 및 라이브 록 을 간략하게 설명 합니다.

#### 교착 상태(Deadlock)

교착 상태 는 두 개 이상의 스레드가 서로를 기다리고 영원히 차단되는 상황을 나타냅니다. 
여기에 예제가 있습니다.

Alphonse와 Gaston은 친구이며 훌륭한 신자입니다. 
예의 바른 규칙은 친구에게 절을 할 때 친구가 활을 반납 할 수있을 때까지 절을 한 채로 있어야한다는 것입니다. 
불행히도,이 규칙은 두 친구가 동시에 서로에게 절을 수있는 가능성을 설명하지 않습니다. 
이 예제 응용 프로그램은 다음 Deadlock과 같은 가능성을 제시합니다.

```java

package com.github.sejoung.codetest.concurrent.liveness;

public class Deadlock {

  public static void main(String[] args) {
    final Friend alphonse = new Friend("Alphonse");
    final Friend gaston = new Friend("Gaston");
    new Thread(() -> alphonse.bow(gaston)).start();
    new Thread(() -> gaston.bow(alphonse)).start();
  }

  static class Friend {

    private final String name;

    public Friend(String name) {
      this.name = name;
    }

    public String getName() {
      return this.name;
    }

    public synchronized void bow(Friend bower) {
      System.out.format("%s: %s  has bowed to me!%n", this.name, bower.getName());
      bower.bowBack(this);
    }

    public synchronized void bowBack(Friend bower) {
      System.out.format("%s: %s has bowed back to me!%n", this.name, bower.getName());
    }
  }
}

```
실행결과
```
Alphonse: Gaston  has bowed to me!
Gaston: Alphonse  has bowed to me!

```

Deadlock실행 하면 두 스레드가 bowBack 호출을 시도 할 때 차단 될 가능성이 큽니다 . 
각 스레드는 다른 스레드가 종료되기를 기다리고 있기 때문에 어느 블록도 종료되지 않습니다.

#### Starvation and Livelock

Starvation 과 Livelock 은 교착 상태보다 문제가 덜 일반적이지만 동시 소프트웨어의 모든 디자이너가 직면 할 수있는 문제는 여전히 있습니다.

##### Starvation

기아 상태는 스레드가 공유 리소스에 대한 정기적 인 액세스를 얻을 수없고 진행을 할 수없는 상황을 나타냅니다. 
이것은 공유 자원이 "욕심 많은"스레드에 의해 오랫동안 사용할 수 없게 될 때 발생합니다. 
예를 들어 객체가 반환하는 데 오랜 시간이 걸리는 동기화 된 메서드를 제공한다고 가정합니다. 
한 스레드가이 메소드를 자주 호출하면 동일한 객체에 자주 동기화 액세스가 필요한 다른 스레드도 종종 차단됩니다.

##### Livelock

스레드는 종종 다른 스레드의 동작에 응답하여 작동합니다. 
다른 스레드의 동작이 다른 스레드의 동작에 대한 응답이기도 한 경우 라이브 록 이 발생할 수 있습니다. 
교착 상태와 마찬가지로 라이브 잠금 스레드는 더 이상 진행할 수 없습니다. 
그러나 스레드는 차단되지 않으며 작업을 다시 시작하기 위해 서로 응답하는 데 너무 바쁩니다. 
이것은 복도에서 서로를 지나치려는 두 사람에 비견 될 수 있습니다. 
Alphonse는 왼쪽으로 이동하여 Gaston을 통과시키고, Gaston은 Alphonse를 통과시킬 수있는 권리로 이동합니다. 
그들은 여전히 ​​서로를 차단하고있는 것을보고, Alston은 그의 오른쪽으로 움직이고, Gaston은 왼쪽으로 움직입니다. 
여전히 서로를 차단하고있어. 그래서 ..


# 참조
-----
* [Liveness](https://docs.oracle.com/javase/tutorial/essential/concurrency/liveness.html)
* [Deadlock](https://docs.oracle.com/javase/tutorial/essential/concurrency/deadlock.html)
* [Starvation and Livelock](https://docs.oracle.com/javase/tutorial/essential/concurrency/starvelive.html)

