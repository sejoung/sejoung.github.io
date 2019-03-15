---
layout: post
title: "아이템 62. 다른타입이 적절하다면 문자열 사용을 피하라."
date: 2019-03-11 09:43 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 62. 다른타입이 적절하다면 문자열 사용을 피하라.

* 문자열은 다른 값을 대신하기 적절하지 않다.

숫자를 표현할때는 int, float 등등의 타입이 좋고 예/아니오는 boolean 타입이 좋다

* 문자열은 열거타입을 대신하기에 적합하지 않다.

상수를 열거할때 열거 타입이 훨씬 좋다.[아이템 34. int 상수 대신 열거 타입을 사용하라.](https://sejoung.github.io/2019/01/Use_enums_instead_of_int_constants)

* 문자열은 혼합타입을 대신하기 적합하지 않다.

```java

String compoundKey = className + "#" + i.next();

```

위에 코드에서는 문자열로 혼합타입을 작성했는데 구분을 # 으로만 하고 두타입중에 하나라도 #이 쓰이면 문제가 된다 
타입을 나눌때는 파싱을 해야 되기 때문에 느리다.

* 문자열은 권한을 표현하기에 적합하지 않다.

```java

package com.github.sejoung.codetest.general;

public class ThreadLocal {

    //객체 생성 불가
    private ThreadLocal() {
    }

    // 현 스레드의 값을 키로 구분해 저장
    public static void set(String key, Object value) {
    }

    //키가 가르키는 현 스레드의 값을 반환한다.
    public static Object get(String key) {
        return null;
    }
}


```

위에 코드는 문자열 key를 통해 권한(capacity)을 구분하였다.

위코드는 key가 전역공간에 저장되고 공유가 된다. 
key생성 로직에 문제가 있거나 다른 스레드에서 같은 키를 생성하면 같은 변수를 공유한다.

보안에도 취약한데 의도적으로 같은 키를 사용하여 다른 클라이언트의 값을 가지고 올수도 있다.

문자열 대신 위조할수 없는 키를 사용하면 되는데 이 키를 권한(capacity)이라고 한다.


```java

package com.github.sejoung.codetest.general;

public class ThreadLocal {

    //객체 생성 불가
    private ThreadLocal() {
    }

    // 현 스레드의 값을 키로 구분해 저장
    public static void set(Key key, Object value) {
    }

    //키가 가르키는 현 스레드의 값을 반환한다.
    public static Object get(Key key) {
        return null;
    }

    //권한
    public static class Key{
        Key(){}
    }

    // 위조 불가능한 고유키를 생성
    public static Key getKey(){
        return new Key();
    }
}


```

위에 처럼 코드를 작성하면 해결이 되지만 아직 까지 개선의 여지가 있다.

```java

package com.github.sejoung.codetest.general;

public class ThreadLocal {

    public ThreadLocal() {
    }

    // 현 스레드의 값을 키로 구분해 저장
    public void set(Object value) {
    }

    //키가 가르키는 현 스레드의 값을 반환한다.
    public  Object get() {
        return null;
    }

}


```
다시 리팩토링 해서 set 하거나 get 할때 Object를 반환하지 않고 타입세이프하게 제네릭을 사용하면

```java

package com.github.sejoung.codetest.general;

public class ThreadLocal<T> {

    public ThreadLocal() {
    }

    // 현 스레드의 값을 키로 구분해 저장
    public void set(T value) {
    }

    //키가 가르키는 현 스레드의 값을 반환한다.
    public  T get() {
        return null;
    }

}

```

이제 위에 코드는 java.lang.ThreadLocal 과 비슷하다 


# 참조
-----
[아이템 34. int 상수 대신 열거 타입을 사용하라.](https://sejoung.github.io/2019/01/Use_enums_instead_of_int_constants)

