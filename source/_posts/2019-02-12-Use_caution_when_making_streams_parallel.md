---
layout: post
title: "아이템 48. 스트림 병렬화는 주의해서 적용하라."
date: 2019-02-12 14:24 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 48. 스트림 병렬화는 주의해서 적용하라.

```java

package com.github.sejoung.codetest.stream;

import java.math.BigInteger;
import java.util.stream.Stream;

import static java.math.BigInteger.*;

// 병렬 스트림을 사용해 처음 20개의 메르센 소수를 생성하는 프로그램 (291쪽 코드 48-1의 병렬화 버전)
// 주의: 병렬화의 영향으로 프로그램이 종료하지 않는다.
public class ParallelMersennePrimes {
    public static void main(String[] args) {
        primes().map(p -> TWO.pow(p.intValueExact()).subtract(ONE))
                .parallel() // 스트림 병렬화
                .filter(mersenne -> mersenne.isProbablePrime(50))
                .limit(20)
                .forEach(System.out::println);
    }

    static Stream<BigInteger> primes() {
        return Stream.iterate(TWO, BigInteger::nextProbablePrime);
    }
}


```

스트림 병렬화를 하면 어떻게 될까? 위에 소스는 응답하지 않는다. 

이유는 데이터 소스가 Stream.iterate거가 중간연산으로 limt를 쓰면 파이브라인 병렬화로 성능을 개선할수 없다.


대체로 스트림의 소스가 ArrayList, HashMap, HashSet, ConcurrentHashMap의 인스턴스거나 배열, int 범위, long 범위일 때 병렬화의 효과가 가장좋다.

스트림을 잘못 병렬화 하면(응답불가를 포함해) 성능이 나빠질 뿐 아니라 결과 자체가 잘못 되거나 예상치 못한 동작을 한다.

조건이 잘 갖춰지면 parallel 메소드 하나로 거의 프로세서 코어수에 비례하는 성능 향상을 만끽할수 있다.

아래 코드를 보면 잘 나타난다.

```java

package com.github.sejoung.codetest.stream;

import org.springframework.util.StopWatch;

import java.math.BigInteger;
import java.util.stream.LongStream;

public class ParallelPrimeCounting {
    // 코드 48-3 소수 계산 스트림 파이프라인 - 병렬화 버전 (295쪽)
    static long pi(long n) {
        return LongStream.rangeClosed(2, n)
                .mapToObj(BigInteger::valueOf)
                .filter(i -> i.isProbablePrime(50))
                .count();
    }

    public static void main(String[] args) {

        StopWatch sw = new StopWatch();

        sw.start();
        System.out.println(pi(10_000_000));
        sw.stop();


        System.out.println(sw.getTotalTimeSeconds());

    }
}


```
실행 결과
```
664579
37.931

Process finished with exit code 0
```



```java

package com.github.sejoung.codetest.stream;

import org.springframework.util.StopWatch;

import java.math.BigInteger;
import java.util.stream.LongStream;

public class ParallelPrimeCounting {
    // 코드 48-3 소수 계산 스트림 파이프라인 - 병렬화 버전 (295쪽)
    static long pi(long n) {
        return LongStream.rangeClosed(2, n)
                .parallel()
                .mapToObj(BigInteger::valueOf)
                .filter(i -> i.isProbablePrime(50))
                .count();
    }

    public static void main(String[] args) {

        StopWatch sw = new StopWatch();

        sw.start();
        System.out.println(pi(10_000_000));
        sw.stop();


        System.out.println(sw.getTotalTimeSeconds());

    }
}


```
실행 결과
```
664579
11.844

Process finished with exit code 0
```



# 참조
-----






