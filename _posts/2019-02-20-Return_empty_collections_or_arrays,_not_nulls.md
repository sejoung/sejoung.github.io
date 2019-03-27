---
layout: post
title: "아이템 54. null이 아닌 빈컬렉션이나 배열을 반환하라."
date: 2019-02-20 17:24 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 54. null이 아닌 빈컬렉션이나 배열을 반환하라.

```java

package com.github.sejoung.codetest.methods;

import java.util.ArrayList;
import java.util.List;

public class NullCollectionsTest {

    private final static List<Cheese> cheesesInStock = new ArrayList<>();


    public List<Cheese> getCheeses() {
        return cheesesInStock.isEmpty() ? null : new ArrayList<>(cheesesInStock);
    }

    public static void main(String[] args) {
        NullCollectionsTest shop = new NullCollectionsTest();
        cheesesInStock.add(Cheese.STILTON);

        List<Cheese> cheeses = shop.getCheeses();

        if(cheeses != null && cheeses.contains(Cheese.STILTON)){
            System.out.println("좋았어 바로 그거야");
        }
    }
}


```
실행결과
```
좋았어 바로 그거야

Process finished with exit code 0

```
위에 코드는 흔하게 볼수 있는 코드이다 여기서 getCheeses()에서 null을 반환하는것보다 빈 컬렉션을 반환하는 것이 좋다.

```java

    public List<Cheese> getCheeses() {
        return new ArrayList<>(cheesesInStock);
    }




```
빈컬렉션을 반환하는 일차 코드는 위처럼 바꿀수 있다. 위 코드는 매번 빈 콜렉션을 할당하니 다시 한번 바꿔 줄수 있는 코드는

```java

    public List<Cheese> getCheeses() {
        return cheesesInStock.isEmpty() ? Collections.emptyList() : new ArrayList<>(cheesesInStock);
    }

```

길이가 0일수도 있는 배열을 올바르게 반환하는 법

```java


    public Cheese[] getCheeses() {
        return cheesesInStock.toArray(new Cheese[0]);
    }

```

계속 생성하지 않게 

```java

    private final static Cheese [] EMPTY_CHEESE_ARRAY = new Cheese[0];


    public Cheese[] getCheeses() {
        return cheesesInStock.toArray(EMPTY_CHEESE_ARRAY);
    }


```

잘못된 예 

```java

    public Cheese[] getCheeses() {
        return cheesesInStock.toArray(new Cheese[cheesesInStock.size()]);
    }

```

배열에 미리 사이즈를 할당하지 않도록 한다.


# 참조
-----




