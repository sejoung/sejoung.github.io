---
layout: post
title: "java-simpledateformat-thread-safety-issues"
date: 2018-12-14 10:58 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### Java의 SimpleDateFormat은 thread-safe 하지 않다. multi-threaded 환경에서 조심히 사용하자

```java

package com.github.sejoung.codetest.simpledateformat;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

public class SimpleDateFormatThreadUnsafetyExample {
    private static final Logger log = LoggerFactory.getLogger(SimpleDateFormatThreadUnsafetyExample.class);

    private static AtomicInteger counter = new AtomicInteger(0);

    private static final SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");

    public static void main(String[] args) {
        String dateStr = "2018-06-22";
        Date date = new Date();
        int nThreads = 10;
        ExecutorService executorService = Executors.newFixedThreadPool(nThreads);
        CyclicBarrier barrier = new CyclicBarrier(nThreads);

        for(int i = 0; i < nThreads; i++) {
            executorService.submit(()->{
                int idx = counter.addAndGet(1);
                barrier.await();

                log.info("Thread {}",idx);
                formatDate(date);
                parseDate(dateStr);
                return null;
            });
        }

        executorService.shutdown();
    }

    private static void parseDate(String dateStr) {
        try {
            Date date = simpleDateFormat.parse(dateStr);
            System.out.println("Successfully Parsed Date " + date);
        } catch (ParseException e) {
            System.out.println("ParseError " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    private static void formatDate(Date date) {
        try {
            String dateStr = simpleDateFormat.format(date);
            System.out.println("Successfully format Date " + dateStr);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

```
실행결과
```

java.lang.NumberFormatException: multiple points
	at sun.misc.FloatingDecimal.readJavaFormatString(FloatingDecimal.java:1890)
	at sun.misc.FloatingDecimal.parseDouble(FloatingDecimal.java:110)
	at java.lang.Double.parseDouble(Double.java:538)
	at java.text.DigitList.getDouble(DigitList.java:169)
	at java.text.DecimalFormat.parse(DecimalFormat.java:2056)
	at java.text.SimpleDateFormat.subParse(SimpleDateFormat.java:1869)
	at java.text.SimpleDateFormat.parse(SimpleDateFormat.java:1514)
	at java.text.DateFormat.parse(DateFormat.java:364)
	at com.github.sejoung.codetest.simpledateformat.SimpleDateFormatThreadUnsafetyExample.parseDate(SimpleDateFormatThreadUnsafetyExample.java:45)
	at com.github.sejoung.codetest.simpledateformat.SimpleDateFormatThreadUnsafetyExample.lambda$main$0(SimpleDateFormatThreadUnsafetyExample.java:35)
	at java.util.concurrent.FutureTask.run(FutureTask.java:266)
	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)
	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)
	at java.lang.Thread.run(Thread.java:748)

```

음 위에 코드에서는 parse 부분에서는 에러가 나는데 format 부분은 문제가 없었다.

그래서 java doc를 찾아 보았다 그랬더니 Synchronization 부분이 존재하는데 내용은 아래처럼 나와 있다.

![java doc](https://sejoung.github.io/images/2018_12_14_01.jpg){: width="100%"}{: .center}

쓰레드마다 객체를 생성하거나 여러 쓰레드가 동시에 접근하는 경우는 외부에 synchronized 를 하는것이라고 나와있다.

그럼 코드에 synchronized 를 걸거나 아에 내부적으로 new하는 코드를 하는것이 좋다.

전 메소드 안에서 new 하는것이 좋을것 같다


# 참조
-----
* [SimpleDateFormat](https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html)
* [java-simpledateformat-thread-safety-issues/](https://www.callicoder.com/java-simpledateformat-thread-safety-issues/)

