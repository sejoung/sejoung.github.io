---
layout: post
title: "아이템 28. 배열보단 리스트를 사용하라"
date: 2018-12-27 14:15 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 28. 배열보단 리스트를 사용하라

배열은 A가 B의 하위 타입이면 A[]이 B[]의 하위타입이다. 하지만 제네릭은 List< A > 가 List< B >의 하위타입은 아니다 그래서 불변이다.

어떻게 보면 제네릭이 문제가 있는것 처럼 보이지만 문제는 배열이다. 

```java

package com.github.sejoung.codetest.generics;

public class Test {
    public static void main(String[] args) {
        Object[] objects = new String[2];
        objects[0] = 12;
    }
}


```
실행결과
```

Exception in thread "main" java.lang.ArrayStoreException: java.lang.Integer
	at com.github.sejoung.codetest.generics.Test.main(Test.java:6)

Process finished with exit code 1

```

위에 코드는 컴파일시에는 문제가 없지만 실행시에 에러가 난다.

```java

package com.github.sejoung.codetest.generics;

import java.util.ArrayList;
import java.util.List;

public class Test {
    public static void main(String[] args) {
        List<Object> objects = new ArrayList<String>();//호환되지 않는 타입
        objects.add(12);
    }
}


```
이미 위에 코드는 컴파일시에 에러가 난다. 

위와 비슷한 코드로 

```java

package com.github.sejoung.codetest.generics;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

public class ChooserOld {
    private final Object[] choiceArray;

    public ChooserOld(Collection choices) {
        choiceArray = choices.toArray();
    }

    public Object choose() {
        Random rnd = ThreadLocalRandom.current();
        return choiceArray[rnd.nextInt(choiceArray.length)];
    }

    public static void main(String[] args) {
        //List<Integer> intList = Arrays.asList(1, 2, 3, 4, 5, 6);
        List<String> stringList = Arrays.asList("1","A");

        ChooserOld chooser = new ChooserOld(stringList);

        for (int i = 0; i < 10; i++) {
            Integer choice = (Integer) chooser.choose();
            System.out.println(choice);
        }
    }
}


```

위에 코드를 제네릭으로 바꾸면

```java

package com.github.sejoung.codetest.generics;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

// 코드 28-6 리스트 기반 Chooser - 타입 안전성 확보! (168쪽)
public class Chooser<T> {
    private final List<T> choiceList;

    public Chooser(Collection<T> choices) {
        choiceList = new ArrayList<>(choices);
    }

    public T choose() {
        Random rnd = ThreadLocalRandom.current();
        return choiceList.get(rnd.nextInt(choiceList.size()));
    }

    public static void main(String[] args) {
        List<Integer> intList = Arrays.asList(1, 2, 3, 4, 5, 6);
        List<String> stringList = Arrays.asList("1","A");

       // Chooser<Integer> chooser = new Chooser<>(intList);
        Chooser<String> chooser = new Chooser<>(stringList);


        for (int i = 0; i < 10; i++) {
            String choice = chooser.choose();
            System.out.println(choice);
        }
    }
}


```

위와 같은 코드로 된다. 조금 느리지만 런타임시에 클래스케스팅 에러를 만나지 않으니 더 안전한 코드가 되었다.

# 참조
-----

