---
layout: post
title: "아이템 61. 박싱된 기본타입 보단 기본타입을 사용하라."
date: 2019-03-08 10:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 61. 박싱된 기본타입 보단 기본타입을 사용하라.

자바의 데이터 타입은 크게 두가지로 나눌수 있다. 

기본 타입 : boolean, short, int, long, float, double, char

참조 타입 : String, List

기본 타입 |박싱된 기본타입(Wrapper Class)
-------|---------------
byte | Byte
short | Short
int | Integer
long | Long
float | Float
double | Double
char | Char
boolean | Boolean

java 5 부터 들어온 오토 박싱 언박싱 덕분에 편하게 사용하긴하지만
그차이가 사라지는건 아니다.

기본타입 과 박싱된 기본타입의 차이점

* 기본 타입은 값만 가지고 있으니 박싱된 기본타입은 값에 더해서 식별성(identity)이란 속성을 가진다.
다르게 이야기하면 값은 같아도 서로 다르게 인식할수있다.

* 기본타입의 갑은 유효 하지만 박싱된 기본타입은 유효하지 않은 값을 가질수 있다. null을 가질수 있다.

* 기본타입은 박싱된 기본타입보다 시간과 메모리 사용율에서 더 효율적이다.

```
동일성(identity) : 실제 인스턴스가 같다. 따라서 참조 값을 비교하는 == 비교의 값이 같다.
동등성(equality) : 실제 인스턴스는 다를 수 있지만 인스턴스가 가지고 있는 값이 같다. 자바에서 동등성 비교는 equals() 메소드를 구현해야 된다.
```

`박싱된 기본 타입에 == 연산자를 사용하면 오류가 난다.` 

아래 예제를 보자

```java

package com.github.sejoung.codetest.general;

import java.util.*;

// 코드 61-1 잘못 구현된 비교자 - 문제를 찾아보자! (359쪽)
public class BrokenComparator {
    public static void main(String[] args) {

        Comparator<Integer> naturalOrder =
                (i, j) -> (i < j) ? -1 : (i == j ? 0 : 1);

        int result = naturalOrder.compare(new Integer(42), new Integer(42));
        System.out.println(result);
    }
}


```
실행결과
```
1

Process finished with exit code 0
```

Comparator 하는데 코드에 연산자 == 가 들어갔다.

위에 코드는 == 비교가 객체라서 동일성 비교가 되어 false가 나오므로 1이 되었다.

그럼 위에 코드를 수정하면

```java

package com.github.sejoung.codetest.general;

import java.util.*;

// 코드 61-1 잘못 구현된 비교자 - 문제를 찾아보자! (359쪽)
public class BrokenComparator {
    public static void main(String[] args) {
        // 코드 61-2 문제를 수정한 비교자 (359쪽)
        Comparator<Integer> naturalOrder = (iBoxed, jBoxed) -> {
            int i = iBoxed, j = jBoxed; // 오토박싱
            return i < j ? -1 : (i == j ? 0 : 1);
        };
        int result = naturalOrder.compare(new Integer(42), new Integer(42));
        System.out.println(result);
    }
}


``` 
실행결과
```
0

Process finished with exit code 0

```
위에 코드는 오토 박싱을 활용하여 해결한 예제 이다.

아래 코드는 박싱된 기본타입이 null을 참조 할수 있다고 보여주는 예제 이다.

```java

package com.github.sejoung.codetest.general;

// 코드 61-3 기이하게 동작하는 프로그램 - 결과를 맞혀보자! (360쪽)
public class Unbelievable {
    static Integer i;

    public static void main(String[] args) {
        
        if (i == 42)
            System.out.println("믿을 수 없군!");
    }
}

```
실행결과
```

Exception in thread "main" java.lang.NullPointerException
	at com.github.sejoung.codetest.general.Unbelievable.main(Unbelievable.java:9)

Process finished with exit code 1
```
기본 타입과 박싱타입을 혼용한 연산에서 박싱이 자동으로 풀린다. 그래서 null 참조를 언박싱 하면서 NullPointerException이 일어난다.
간단한 해결 방법은 아래처럼 i를 int로 바꾸는 것이다.

```java

package com.github.sejoung.codetest.general;

// 코드 61-3 기이하게 동작하는 프로그램 - 결과를 맞혀보자! (360쪽)
public class Unbelievable {
    static int i;
    public static void main(String[] args) {

        if (i == 42)
            System.out.println("믿을 수 없군!");
    }
}
```
실행결과
```

Process finished with exit code 0
```

```java

package com.github.sejoung.codetest.objects;

public class AutoBoxingExample {
    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        Long sum = 0l;
        for (long i = 0 ; i <= Integer.MAX_VALUE ; i++) {
            sum += i;
        }
        System.out.println(sum);
        System.out.println(System.currentTimeMillis() - start);

        start = System.currentTimeMillis();
        long sum2 = 0l;
        for (long i = 0 ; i <= Integer.MAX_VALUE ; i++) {
            sum2 += i;
        }
        System.out.println(sum2);
        System.out.println(System.currentTimeMillis() - start);

    }

}


```
실행결과
```
2305843008139952128
7590
2305843008139952128
736

Process finished with exit code 0
```

위에 코드를 보면오토 박싱을 하므로 엄청나게 느리게 된다.

박싱된 기본타입을 언제 써야 되나?

* 컬렉션의 원소, 키값으로 쓴다. 컬렉션은 기본타입을 가질수 없으므로 어쩔수 없이 박싱된 기본타입을 써야 된다.

* 매개변수화 타입이나 매개변수화 매서드의 타입 매개변수로는 박싱된 기본타입을 써야 된다.

# 참조
-----
* [아이템 6. 불필요한 객체생성을 피하라](https://sejoung.github.io/2018/11/Avoid_creating_unnecessary_objects)

