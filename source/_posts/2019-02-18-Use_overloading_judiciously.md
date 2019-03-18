---
layout: post
title: "아이템 52. 다중정의(overloading)는 신중히 사용하라."
date: 2019-02-18 11:20 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 52. 다중정의(overloading)는 신중히 사용하라.

```java


package com.github.sejoung.codetest.methods.overloading;

import java.math.BigInteger;
import java.util.*;

// 코드 52-1 컬렉션 분류기 - 오류! 이 프로그램은 무엇을 출력할까? (312쪽)
public class CollectionClassifier {
    public static String classify(Set<?> s) {
        return "집합";
    }

    public static String classify(List<?> lst) {
        return "리스트";
    }

    public static String classify(Collection<?> c) {
        return "그 외";
    }

    public static void main(String[] args) {
        Collection<?>[] collections = {
                new HashSet<String>(),
                new ArrayList<BigInteger>(),
                new HashMap<String, String>().values()
        };

        for (Collection<?> c : collections)
            System.out.println(classify(c));
    }
}


```
실행결과
```
그 외
그 외
그 외

Process finished with exit code 0

```

위에 코드는 집합 리스트 그외를 차례대로 출력할것 같지만, 실제로는 그외만 3번 출력된다.

다중정의(overloading)된 메소드(classify)중 어떤것을 호출할지는 런타임시에 정해진다. 
위에 보면 for문에서 Collection 타입이다 하지만 런타임시에는 계속 바뀌지만 영향을 주지 못한다.

위같은 이유는 재정의된 메소드(Override)는 동적으로 선택 되지만 다중정의된 메소드(overloading)는 정적으로 선택이 된다.

그럼 재정의된 메소드(Override)의 코드는 아래를 보면

```java

package com.github.sejoung.codetest.methods.overloading;

// 재정의된 메서드 호출 메커니즘 (313쪽, 코드 52-2의 일부)
class Wine {
    String name() { return "포도주"; }
}

```

```java

package com.github.sejoung.codetest.methods.overloading;

// 재정의된 메서드 호출 메커니즘 (313쪽, 코드 52-2의 일부)
class SparklingWine extends Wine {
    @Override
    String name() {
        return "발포성 포도주";
    }
}

```

```java

package com.github.sejoung.codetest.methods.overloading;

// 재정의된 메서드 호출 메커니즘 (313쪽, 코드 52-2의 일부)
class Champagne extends SparklingWine {
    @Override
    String name() {
        return "샴페인";
    }
}

```

```java

package com.github.sejoung.codetest.methods.overloading;

import java.util.List;

// 재정의된 메서드 호출 메커니즘 (313쪽, 코드 52-2의 일부)
public class Overriding {
    public static void main(String[] args) {
        List<Wine> wineList = List.of(
                new Wine(), new SparklingWine(), new Champagne());

        for (Wine wine : wineList)
            System.out.println(wine.name());
    }
}

```
실행결과
```
포도주
발포성 포도주
샴페인

Process finished with exit code 0

```

위와 같이 동적으로 선택이 된다.

다중정의된 메소드는 컴파일 타임에 타입에 의해서 결정이 된다.

해결 방안으로 아래의 코드를 보면

```java

package com.github.sejoung.codetest.methods.overloading;

import java.math.BigInteger;
import java.util.*;

// 수정된 컬렉션 분류기 (314쪽)
public class FixedCollectionClassifier {
    public static String classify(Collection<?> c) {
        return c instanceof Set ? "집합" :
                c instanceof List ? "리스트" : "그 외";
    }

    public static void main(String[] args) {
        Collection<?>[] collections = {
                new HashSet<String>(),
                new ArrayList<BigInteger>(),
                new HashMap<String, String>().values()
        };

        for (Collection<?> c : collections)
            System.out.println(classify(c));
    }
}

```
실행결과
```
집합
리스트
그 외

Process finished with exit code 0
```
위에 처럼 인자를 받아 instanceof로 검사를 하면 된다.

위에 처럼 다중정의가 혼돈을 일으키는 상황을 피하자.

안전하고 보수적으로 가려면 매개변수 수가 같은 다중정의는 만들지말자.

다중정의 대신 메서드 이름을 다르게 지어주는 길도 항상 열려있으니 말이다. 
이름을 다르게 지어주는 예제로 ObjectInputStream을 보면 read 메소드를 보면 된다.

생성자는 두번째 부터 무조건 다중정의가 되는데 정적팩터리라는 대안이 있으니 적절히 사용하자.


```java

package com.github.sejoung.codetest.methods.overloading;

import java.util.*;

// 이 프로그램은 무엇을 출력할까? (315-316쪽)
public class SetList {
    public static void main(String[] args) {
        Set<Integer> set = new TreeSet<>();
        List<Integer> list = new ArrayList<>();

        for (int i = -3; i < 3; i++) {
            set.add(i);
            list.add(i);
        }
        for (int i = 0; i < 3; i++) {
            set.remove(i);
            list.remove(i);
        }
        System.out.println(set + " " + list);
    }
}


```
실행결과
```
[-3, -2, -1] [-2, 0, 2]

Process finished with exit code 0

```
위에 실행결과를 보면 우리가 예상했던 결과와 틀리다.

위에서는 ArrayList에서 remove를 다중정의 했기 때문이다. 
그래서 같은 메소드를 호출해주기 위해 아래처럼 코드를 수정했다.

```java

package com.github.sejoung.codetest.methods.overloading;

import java.util.*;

// 이 프로그램은 무엇을 출력할까? (315-316쪽)
public class SetList {
    public static void main(String[] args) {
        Set<Integer> set = new TreeSet<>();
        List<Integer> list = new ArrayList<>();

        for (int i = -3; i < 3; i++) {
            set.add(i);
            list.add(i);
        }
        for (int i = 0; i < 3; i++) {
            set.remove(i);
            list.remove((Integer) i);
        }
        System.out.println(set + " " + list);
    }
}


```
실행결과
```
[-3, -2, -1] [-3, -2, -1]

Process finished with exit code 0
```

람다와 메소드 참조도 다중정의에 혼란을 이르켰다. 아래 코드를 보자

```java

package com.github.sejoung.codetest.methods.overloading;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Lamda {
    public static void main(String[] args) {

        new Thread(System.out::println).start();

        ExecutorService es = Executors.newCachedThreadPool();

        es.submit(System.out::println);

    }
}


```
컴파일 에러

```
D:\repo\codeTestJDK8\src\main\java\com\github\sejoung\codetest\methods\overloading\Lamda.java
Error:(13, 11) java: reference to submit is ambiguous
  both method <T>submit(java.util.concurrent.Callable<T>) in java.util.concurrent.ExecutorService and method submit(java.lang.Runnable) in java.util.concurrent.ExecutorService match
Error:(13, 18) java: incompatible types: cannot infer type-variable(s) T
    (argument mismatch; bad return type in method reference
      void cannot be converted to T)

```

메서드를 다중정의할 때, 서로 다른 함수형 인터페이스라도 같은 위치의 인수로 받아서는 안된다.

String 클래스를 보면 contentEquals 메소드는 forward 시켜 버리는 방법을 선택했다 같은 객체를 입력하면 동일한 기능을 수행한다.

```java

    public boolean contentEquals(StringBuffer sb) {
        return contentEquals((CharSequence)sb);
    }


```

하지만 아래는 같은 객체를 넘겨도 다른 작업을 하게 된다.

```java

    public static String valueOf(Object obj) {
        return (obj == null) ? "null" : obj.toString();
    }

  
    public static String valueOf(char data[]) {
        return new String(data);
    }


```


# 참조
-----
* [ObjectInputStream](https://docs.oracle.com/javase/9/docs/api/java/io/ObjectInputStream.html)




