---
layout: post
title: "아이템 60. 정확한 답이 필요하면 float와 double 은 피하라 "
date: 2019-03-07 10:40 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 60. 정확한 답이 필요하면 float와 double 은 피하라 

개발을 할때 floating point 문제에 직면하게 되는데 그 내용에 대해서 푸는 문제이다.

먼저 아래 코드를 보면

```java

package com.github.sejoung.codetest.general;

public class Change {
    // 코드 60-1 오류 발생! 금융 계산에 부동소수 타입을 사용했다. (356쪽)
    public static void main(String[] args) {
        double funds = 1.00;
        int itemsBought = 0;
        for (double price = 0.10; funds >= price; price += 0.10) {
            funds -= price;
            itemsBought++;
        }
        System.out.println(itemsBought + "개 구입");
        System.out.println("잔돈(달러): " + funds);
    }
}


```
실행결과
```
3개 구입
잔돈(달러): 0.3999999999999999

Process finished with exit code 0
```
위에 결과가 전혀 다르게 나오게 된다 

float와 double금융타입의 계산과는 맞지 않다.

그럼 대안으로는 int나 long, BigDecimal을 사용해야 된다 

아래 코드는 int를 사용한 예

```java
package com.github.sejoung.codetest.general;

public class IntChange {
    // 코드 60-3 정수 타입을 사용한 해법 (357쪽)
    public static void main(String[] args) {
        int itemsBought = 0;
        int funds = 100;
        for (int price = 10; funds >= price; price += 10) {
            funds -= price;
            itemsBought++;
        }
        System.out.println(itemsBought + "개 구입");
        System.out.println("잔돈(센트): " + funds);
    }
}

```
실행결과
```

4개 구입
잔돈(센트): 0

Process finished with exit code 0
```
위에서는 정수로서 문제를 풀었고 소수점까지 계산 해야 되면 BigDecimal을 사용해야 되는데 
단점이 2가지 있다.

* 기본타입 보다 사용하기 불편하다.

* 무겁고 느리다. 

```java

package com.github.sejoung.codetest.general;

import java.math.BigDecimal;

public class BigDecimalChange {
    // 코드 60-2 BigDecimal을 사용한 해법. 속도가 느리고 쓰기 불편하다. (356쪽)
    public static void main(String[] args) {
        final BigDecimal TEN_CENTS = new BigDecimal(".10");

        int itemsBought = 0;
        BigDecimal funds = new BigDecimal("1.00");
        for (BigDecimal price = TEN_CENTS;
             funds.compareTo(price) >= 0;
             price = price.add(TEN_CENTS)) {
            funds = funds.subtract(price);
            itemsBought++;
        }
        System.out.println(itemsBought + "개 구입");
        System.out.println("잔돈(달러): " + funds);
    }
}


```
실행결과
```

4개 구입
잔돈(달러): 0.00

Process finished with exit code 0
```


# 참조
-----
* [부동소수점 정확도 문제](https://ko.wikipedia.org/wiki/%EB%B6%80%EB%8F%99%EC%86%8C%EC%88%98%EC%A0%90#.EC.A0.95.ED.99.95.EB.8F.84_.EB.AC.B8.EC.A0.9C)


