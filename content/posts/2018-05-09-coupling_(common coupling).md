---
layout: post
title: "결합도_(common coupling)"
date: 2018-05-09 11:00:00 +0900
comments: true
tags : ["결합도"]
categories : ["study"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### 결합도 (coupling)

#### 공통결합 (common coupling) 

전역결합(global coupling)이라고도 함

강결합 

두개 이상의 모듈에서 전역으로 선언된 데이터 모듈에 등록 할때 공통결합이 발생한다.

자바 코드에서 실수하는 부분이 static 변수를 선언해서 여러 쓰래드에서 공통적으로 사용하는 경우이다.

이렇게 되면 예기치 않은 문제가 생길수도 있다.(예: 데이터 변조)

이것만으로 공통 결합을 설명해야 되는지가... 일반 적으로는 공통결합 적인 코드를 작성하지 않는데 

쓰레드 관련해서는 해당 사항으로 코딩이 되고 있는것 같다. 

아래는 예제 이다 FreqABTest 의 freqAbtestType 값이 static으로 공유되고 있어서 공통 결합이 나타 났다.

해당 변수가 static 아니라 클래스나 아니면 클래스 자체를 싱글턴으로 유지하는 코드에서도 똑같은 형태가 나타난다.

공통 결합은 추상화를 도입하여 해결할 수 있습니다. 디자인 패턴은 훌륭한 아키텍처를 달성하는 데 유용 할 수 있습니다.

Static Factory Methods 이것도 이야기 하고 싶어 지는데 아래처럼 공유 변수를 참조하는 스테틱팩토리 메소드 패턴은 hread safe 하지 않은 코드이다.
 
```java

package com.github.sejoung.reactive.test;

import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

public class TestCode {
    public static void main(String[] args) throws InterruptedException {
        ExecutorService es = Executors.newCachedThreadPool();

        int count = 100;
        AtomicInteger ai = new AtomicInteger();
        CyclicBarrier cb = new CyclicBarrier(count);

        for (int i = 0; i < count; i++) {
            es.submit(() -> {
                int idx = ai.addAndGet(1);
                cb.await();
                FreqABTest cTest = new FreqABTest();        /// C
                cTest.setFreqAbtestType(idx);

                if ((idx != cTest.getFreqAbtestType())) {
                    System.out.println(" idx " + idx + " freqAbtestType " + cTest.getFreqAbtestType());
                }
                return null;
            });

        }
        es.shutdown();
        es.awaitTermination(10000, TimeUnit.HOURS);

    }
}

```

```java

package com.github.sejoung.reactive.test;

public class FreqABTest {

    private static int freqAbtestType;

    public static void setFreqAbtestType(int freqAbtestType) {
        FreqABTest.freqAbtestType = freqAbtestType;
    }

    public static int getFreqAbtestType(){
        return FreqABTest.freqAbtestType;
    }
}

```