---
layout: post
title: "아이템 41. 정의하려는 것이 타입이라면 마커 인터페이스를 사용하라."
date: 2019-01-23 13:49 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 41. 정의하려는 것이 타입(ElementType.TYPE)이라면 마커 인터페이스를 사용하라.

아무 구현이 없고 단지 자기를 구현하는 클래스가 특성 속성을 가짐을 표시해주는것 인터페이스를 마커인터페이스라고 한다.

대표적인 예가 Serializable이다 그럼 코드를 보면

```java

package java.io;

public interface Serializable {
}


```

마커인터페이스는 두가지 측면에서 마커 인터페이스 보다 낫다.

첫번째 마커 인터페이스는 이를 구현한 클래스의 인스턴스를 구분하는 타입으로 쓸수 있으나 마커 어너테이션은 아니다.

이부분은 아래의 예제를 통해서 보겠다 

```java

package com.github.sejoung.codetest.annotation.markerannotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Developer {

}



```

@Target에 ElementType.TYPE 이면 Class나 interface 그리고 enum에 사용할수 있는데 이부분에 대한 설명이다.

```java

package com.github.sejoung.codetest.annotation;

import com.github.sejoung.codetest.annotation.markerannotation.Developer;

@Developer
public class Sejoung {


}


```

이런식으로 선언하면 해당 값을 판별 할수있는것이 런타임때 아래와 같이 할수 있다.

```java

package com.github.sejoung.codetest.annotation;

import com.github.sejoung.codetest.annotation.markerannotation.Developer;

public class RunTests {
    public static void main(String[] args) {
        Class<?> testClass = Sejoung.class;

        if(testClass.isAnnotationPresent(Developer.class)){
            System.out.println("Developer Annotation");
        }

    }
}

```
실행결과
```
Developer Annotation

Process finished with exit code 0
```

하지만 인터페이스를 사용하면 코드레벨에서 컴파일시에 할수있다 예제를 보면

마커 인터페이스 

```java

package com.github.sejoung.codetest.annotation.markerinterface;

public interface Developer {

}


```

```java

package com.github.sejoung.codetest.annotation;

import com.github.sejoung.codetest.annotation.markerannotation.Developer;

public class Sejoung {


}


```
```java

package com.github.sejoung.codetest.annotation;

import com.github.sejoung.codetest.annotation.markerinterface.Developer;

public class RunTests {
    public static void main(String[] args) {
        Developer developer = new Sejoung();

    }
}

```
메시지
```

Error:(14, 86) java: incompatible types: com.github.sejoung.codetest.annotation.Sejoung cannot be converted to com.github.sejoung.codetest.annotation.markerinterface.Developer

```
위와 같이 컴파일 시점에 알수있다.

두번째 장점은 적용대상을 좀더 정밀히 지정할수 있다.

어너테이션은 모든타입에 달수 있으니 모든 타입을 다 검사해야 되지만 인터페이스는 인터페이스를 구현한 클래스만이 하위클래스임을 보장하는것이다.

그럼 마커 어너테이션의 장점은 거대한 어너테이션 시스템의 지원을 받는다는 것이다. 

클래스의 타입을 정의 할때는 한번더 생각해 보아야 된다.

# 참조
-----
* [jdk docs Serializable](https://docs.oracle.com/javase/8/docs/api/java/io/Serializable.html)
*[아이템 39. 명명 패턴보다는 애너테이션을 사용하라](https://sejoung.github.io/2019/01/2019-01-21-Prefer_annotations_to_naming_patterns/)



