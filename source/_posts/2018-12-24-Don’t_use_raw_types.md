---
layout: post
title: "아이템 26. raw 타입은 사용하지 말자."
date: 2018-12-24 09:10 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

## 이펙티브 자바

### 아이템 26. raw 타입은 사용하지 말자.


```java

package com.github.sejoung.codetest.generics;

public class Stamp {
    private String name;

    public Stamp(String name) {
        this.name = name;
    }

    public void cancel() {
        System.out.println("cancel");
    }
}


```

```java

package com.github.sejoung.codetest.generics;

public class Coin {

    private String name;

    public Coin(String name){
        this.name = name;
    }


}


```


```java

package com.github.sejoung.codetest.generics;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;

public class OldTest {
    // Stamp 클래스만 들어가야 됨
    private final static Collection stamps = new ArrayList();

    public static void main(String[] args) {

        stamps.add(new Coin("바보"));


        for (Iterator i = stamps.iterator(); i.hasNext();){
            Stamp stamp = (Stamp) i.next();//ClassCastException
            stamp.cancel();
        }
    }


}


```
실행결과 

```

Exception in thread "main" java.lang.ClassCastException: com.github.sejoung.codetest.generics.Coin cannot be cast to com.github.sejoung.codetest.generics.Stamp
	at com.github.sejoung.codetest.generics.OldTest.main(OldTest.java:16)

Process finished with exit code 1

```

위에 처럼 raw 타입을 선언하면 런타임 익셉션에 노출되어 있다.


```java

package com.github.sejoung.codetest.generics;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;

public class OldTest {
    private final static Collection<Stamp> stamps = new ArrayList();

    public static void main(String[] args) {

        stamps.add(new Coin("바보"));


        for (Iterator i = stamps.iterator(); i.hasNext();){
            Stamp stamp = (Stamp) i.next();
            stamp.cancel();
        }
    }


}


```
컴파일시에 에러
```
Error:(12, 20) java: incompatible types: com.github.sejoung.codetest.generics.Coin cannot be converted to com.github.sejoung.codetest.generics.Stamp
```

위에 코드에서 타입을 선언하면 주석을 선언 할필요없이 코드에 어떤 값이 들어갈지 녹아 들어가있다. 
그리고 컴파일시에 타입에러가 나온다

raw타입을 활용하면 제네릭이 주는 안정성과 표현력을 모두 잃게 된다.

```java

package com.github.sejoung.codetest.generics;

import java.util.ArrayList;
import java.util.List;

// 코드 26-4 런타임에 실패한다. - unsafeAdd 메서드가 로 타입(List)을 사용 (156-157쪽)
public class Raw {
    public static void main(String[] args) {
        List<String> strings = new ArrayList<>();
        unsafeAdd(strings, Integer.valueOf(42));
        String s = strings.get(0); // 컴파일러가 자동으로 형변환 코드를 넣어준다.
    }

    private static void unsafeAdd(List list, Object o) {
        list.add(o);
    }
}


```

위에서는 unsafeAdd 메소드가 List의 raw 타입을 사용해서 실행시에 에러가 난다.

```java

    static int numElementsInCommon(Set s1, Set s2){
        int result = 0;

        for(Object o1 : s1){
            if(s2.contains(01)){
                result++;
            }
        }
        return result;
    }

```
위에 처럼 로타입을 선언 하는것 보다.

```java

    static int numElementsInCommon(Set<?> s1, Set<?> s2){
        int result = 0;

        for(Object o1 : s1){
            if(s2.contains(01)){
                result++;
            }
        }
        return result;
    }

```
비한정 와일드카드 타입을 사용하는것이 좋다 타입 안전하며 유용하다.

다만 raw타입이 허용된 부분이 있는데 그것은 클래스리터럴(class literal)에서 이다. 클래스 리터럴에서는 파라미터 매개변수타입을 선언할수 없다.

List.class, String[].class 는 허용하지만 List<String>.class, List<?>.class는 허용하지 않는다. 

또 raw타입을 써도 좋은예는 instanceof이다

```java

    if (o1 instanceof Set) { //raw 타입
        Set<?> s = (Set<?>) o1; // 비한정 와일드카드 타입
    }

```

Object 와 ?의 차이점

```java

package com.github.sejoung.codetest.generics;

import java.util.Arrays;
import java.util.List;

public class Generics {

    static void printList(List<Object> list){
        list.forEach(s-> System.out.println(s));
    }

    static void printList2(List<?> list){
        list.forEach(s-> System.out.println(s));
    }

    public static void main(String[] args) {


        List<Integer> list = Arrays.asList(1,2,3,4,5);
        printList(list); // 에러가 남
        printList2(list);
        
    }
}


```

위에 코드에서는 원소관계의 계층관계를 허용하지 않아서 그렇게 됨


```java

package com.github.sejoung.codetest.generics;

import java.util.Arrays;
import java.util.List;

public class Generics {

    static void printList(List<Object> list){
        list.forEach(s-> System.out.println(s));
    }

    static void printList2(List<?> list){
        list.forEach(s-> System.out.println(s));
    }

    public static void main(String[] args) {


        printList(Arrays.asList(1,2,3,4,5)); 
        printList2(Arrays.asList(1,2,3,4,5));
        
    }
}


```

이 코드는 에러가 없이 정상 동작함 


# 참조
-----
* [토비의 봄 TV 4회 (1) 자바 Generics](https://www.youtube.com/watch?v=ipT2XG1SHtQ)
* [토비의 봄 TV 4회 (2) Generics에서 와일드카드 활용법, 람다와 인터섹션 타입을 이용한 동적인 기능확장법](https://www.youtube.com/watch?v=PQ58n0hk7DI)
* [java doc Class](https://docs.oracle.com/javase/8/docs/api/java/lang/Class.html)
