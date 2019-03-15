---
layout: post
title: "java static thread safe"
date: 2017-12-05 14:47:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

# java static thread safe


작업 수행 중 여러 스레드가 공유하는 특정 클래스의 인스턴스 상태가 변경 될 가능성이 있는 경우 해당 클래스는 thread safe 하지 않다 라고 표현함.

FreqABTest.setType(adConfigData); 의 경우에는 freqAbtestType 변수를 static으로 사용하여,

실제 쿠키값이 C이나, 다른 D형태의 cookie를 가진 유저에 유입으로 D로 변경될 가능성이 있어 thread safe 하지 않다라고 할 수 있음.

FreqABTest.setType(adConfigData, inclinations); 로 변경하여,

실제 쿠키값을 전달하여 thread safe하도록 변경해야함.


thread safe Test Code


```
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

```

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


# 참조 
-----

