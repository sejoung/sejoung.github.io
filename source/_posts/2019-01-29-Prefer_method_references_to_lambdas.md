---
layout: post
title: "아이템 43. 람다보다 매서드 참조를 사용하라."
date: 2019-01-29 10:16 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 43. 람다보다 매서드 참조를 사용하라.

람다가 익명 클래스보다 가장 큰 나은점은 간결함이다. 
자바에서 람다 보다 더 간결하게 만들수 있는것이 있는데 그것은 메서드 참조이다.


```java

package com.github.sejoung.codetest.lamdas;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;

// map.merge를 이용해 구현한 빈도표 - 람다 방식과 메서드 참조 방식을 비교해보자. (259쪽)
public class Freq {
    public static void main(String[] args) {
        Map<String, Integer> frequencyTable = new TreeMap<>();

        List<String> list = List.of("A","B","C","A");

        for (String s : list)
            frequencyTable.merge(s, 1, (count, incr) -> count + incr); // 람다

        System.out.println(frequencyTable);

    }
}


```
실행결과
```

{A=2, B=1, C=1}

Process finished with exit code -1

```

위에선 람다를 사용한 경우 코드 이다. 

다시 메서드 참조를 사용하면 

```java

package com.github.sejoung.codetest.lamdas;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

// map.merge를 이용해 구현한 빈도표 - 람다 방식과 메서드 참조 방식을 비교해보자. (259쪽)
public class Freq {
    public static void main(String[] args) {
        Map<String, Integer> frequencyTable = new TreeMap<>();

        List<String> list = List.of("A","B","C","A");

        for (String s : list)
            frequencyTable.merge(s, 1, Integer::sum); // 메서드 참조
        System.out.println(frequencyTable);

    }
}


```
실행결과
```

{A=2, B=1, C=1}

Process finished with exit code -1

```

코드가 간결해진다. 그럼 반대의 경우는 한번 살펴 보겠다.

```java

package com.github.sejoung.codetest.lamdas;

public class GoThisClassNameIsHumongous{

    public static void action(){
        System.out.println("GoThisClassNameIsHumongous action");

    }


}


```

위에 클래스가 있고 실행을

```java

package com.github.sejoung.codetest.lamdas;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Freq {
    public static void main(String[] args) {
        ExecutorService es = Executors.newFixedThreadPool(10);

        es.execute(GoThisClassNameIsHumongous::action);

        es.shutdown();
    }
}


```
실행결과
```
GoThisClassNameIsHumongous action

Process finished with exit code 0

```

위에 코드인데 람다로 표현하면 

```java

package com.github.sejoung.codetest.lamdas;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Freq {
    public static void main(String[] args) {

        ExecutorService es = Executors.newFixedThreadPool(10);

        es.execute(() -> System.out.println("lamdas action"));

        es.shutdown();
    }
}


```
실행결과
```
lamdas action

Process finished with exit code 0

```
위에 람다 표현이 더 심플하다.

메서드 참조는 람다의 간단한 대안이 될수도 있다. 하지만 람다가 더 짧고 명료하면 람다를 사용하자.

Example 9.9-2. Generic Function Types 만이 유일하게 람다를 사용하지 못하는 경우 이다.


# 참조
-----
* [jls-9.html#jls-9.9](https://docs.oracle.com/javase/specs/jls/se9/html/jls-9.html#jls-9.9)

