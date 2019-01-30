---
layout: post
title: "아이템 44. 표준함수형 인터페이스를 사용하라."
date: 2019-01-30 09:37 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 44. 표준함수형 인터페이스를 사용하라.

자바가 람다를 지원하면서 API를 작성하는 모범사례도 바뀌게 되었다. 
상위클래스의 기본 클래스를 재정의 하여 원하는 동작을 하게 만드는 템플릿 메서드 패턴의 매력이 크게 줄었다.

먼저 함수형 인터페이스에 대해서 알아보자 

```java

package com.github.sejoung.codetest.lamdas;

@FunctionalInterface
public interface  SimpleFuncInterface {
    public void doWork();
}


```

위에 형태가 가장 기본적인 함수형 인터페이스 형태인데 함수형 인터페이스는 하나의 추상메소드만 가져야 된다.

그럼 아래와 같은 상황에는 어떻게 될까?

```java

package com.github.sejoung.codetest.lamdas;

@FunctionalInterface
public interface  SimpleFuncInterface {
    public void doWork();
    public String toString();
    public boolean equals(Object o);
}


```

위에 같은 경우에서는 에러가 나지 않는다. 보면 toString 과 equals는 기본 Object에 메소드라서 그렇다 

그럼 다시 추상 메소드를 추가 하면

```java

package com.github.sejoung.codetest.lamdas;

@FunctionalInterface
public interface  SimpleFuncInterface {
    public void doWork();
    public void doWork2();
}


```
컴파일 메시지
```
Error:(3, 1) java: Unexpected @FunctionalInterface annotation
  com.github.sejoung.codetest.lamdas.SimpleFuncInterface is not a functional interface
    multiple non-overriding abstract methods found in interface com.github.sejoung.codetest.lamdas.SimpleFuncInterface
```

위와 같은 에러가 나온다 하지만 더 추가 할수 있는 방법이 있는데 그것은 default 메소드를 통해서이다.

```java

package com.github.sejoung.codetest.lamdas;

@FunctionalInterface
public interface ComplexFunctionalInterface extends SimpleFuncInterface {
    default public void doSomeWork(){
        System.out.println("Doing some work in interface impl...");
    }
    default public void doSomeOtherWork(){
        System.out.println("Doing some other work in interface impl...");
    }
}

```

위에 코드는 여전히 유효한 코드이다. 위에 사용법에는 default메소드는 기존에 있는 인터페이스를 해치지 않고 구현할수있는 좋은 방법이다.

그럼 FunctionalInterface의 사용법이다.

```java

package com.github.sejoung.codetest.lamdas;

public class SimpleFunInterfaceTest {
    public static void main(String[] args) {
        carryOutWork(new SimpleFuncInterface() {
            @Override
            public void doWork() {
                System.out.println("Do work in SimpleFun impl...");
            }
        });
        carryOutWork(() -> System.out.println("Do work in lambda exp impl..."));
    }
    
    public static void carryOutWork(SimpleFuncInterface sfi){
        sfi.doWork();
    }
}


```
실행결과
```

Do work in SimpleFun impl...
Do work in lambda exp impl...

Process finished with exit code 0

```

하지만 필요한 용도에 맞는 게 있다면 구현하지 말고 표준 함수형 인터페이스를 사용하자

java 에 선언된 함수형 인터페이스는 총 43가지고 기본 인터페이스 6가지정도를 기억하면 될것 같다.

* Operator 인터페이스는 인수가 한개인 UnaryOperator와 2개인 BinaryOperator 나누어 지며 반환값이 인수의 타입가 같은 함수를 말한다.

* Predicate 인터페이스는 인수하나를 받아 boolean을 반환하는 함수를 뜻한다.

* Supplier 인터페이스는 인수를 받지 않고 값을 반환하는 함수

* Consumer 인터페이스는 인수를 하나 받고 반환값은 없는 함수


전용 함수형 인터페이스를 고려해야 하는 케이스는 3가지 이다.

* 자주 쓰이며, 이름 자체가 용도를 명확히 설명해준다.
* 반드시 따라야 하는 규약이 있다.
* 유용한 디폴트 메서드를 제공할 수 있다.

그리고 직접 만든 함수형 인터페이스에는 @FunctionalInterface 어너테이션을 꼭 사용하자.


# 참조
-----
* [java doc function](https://docs.oracle.com/javase/8/docs/api/java/util/function/package-summary.html)
