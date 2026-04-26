---
layout: post
title: "java_optional"
date: 2018-10-17 09:13 +0900
comments: true
tags : ["optional"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### java optional

Java에서는 참조 유형을 사용하여 객체에 액세스하고 참조 점을 만들 특정 객체가 없을 때 이러한 참조를 설정  null 하여 값이 없음을 나타냅니다.

일반적으로 객체의 필드 멤버가 자동으로 null 초기화됩니다 여기서 다른 곳에해 null을 참조해서 작업을 진행 할때 NPE(NullPointerException)가 발생할수 있습니다.

아래의 코드는 NPE가 발생할수 있는 코드입니다.

```java

package com.github.sejoung.codetest.optional;

import lombok.Getter;

public class Fruit {

    @Getter
    private String name;

    public Fruit(String name) {
        this.name = name;
    }
}


```

```java


package com.github.sejoung.codetest.optional;

import java.util.Arrays;
import java.util.List;

public class OptionalNon {
    
    public static Fruit find(String name, List<Fruit> fruits) {
        for (Fruit fruit : fruits) {
            if (fruit.getName().equals(name)) {
                return fruit;
            }
        }
        return null;
    }

    public static void main(String[] args) {

        List<Fruit> fruits = Arrays.asList(new Fruit("apple"), new Fruit("grape"), new Fruit("orange"));

        Fruit found = find("lemon", fruits);
        String name = found.getName(); // NPE 발생
    
    
    }

}

```

위에 코드에서는 간단하게 감지 할수 있는 오류 코드가 없습니다. 보면 개발자는 위에서 자신이 null을 억세스 한다는 시나리오를 인지 하지 못했을 뿐입니다.

functional programming paradigm 언어에서는 null이 참조 해제 될때가지 에러를 발생시키는 값이 없습니다.
이러한 언어는 선택적 값을 보유할수 있는 특수데이터를 제공해줘서 값이 없음을 표한하는데 편리하게 사용된다. 

그렇게 되면서 위에 코드에서는 값이 없음을 확인하기 위해서는 아래 처럼 null 체크 하는 로직을 넣어 줘야 된다.

```java

    public static void main(String[] args) {

        List<Fruit> fruits = Arrays.asList(new Fruit("apple"), new Fruit("grape"), new Fruit("orange"));

        Fruit found = find("lemon", fruits);

        // String name = found.getName(); // NPE 발생

        if (found != null) {
            String name = found.getName();
        }
    }

```

java8 에서 functional programming paradigm 언어에서 와 비슷한 구문인  Optional이라는 새로운 구문이 탄생 하였다.

위에 코드를 Optional로 재구성 해보았다.

```java

package com.github.sejoung.codetest.optional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class OptionalTest {

    public static Optional<Fruit> find(String name, List<Fruit> fruits) {
        for (Fruit fruit : fruits) {
            if (fruit.getName().equals(name)) {
                return Optional.of(fruit);
            }
        }
        return Optional.empty();
    }

    public static void main(String[] args) {

        List<Fruit> fruits = Arrays.asList(new Fruit("apple"), new Fruit("grape"), new Fruit("orange"));

        Optional<Fruit> found = find("lemon", fruits);

        if (found.isPresent()) {
            Fruit fruit = found.get();
            log.info(fruit.getName());
        }
        
        
    }
}



```

위에 처럼 재구성할수도 있고 Optional에서 재공해주는 여러가지 함수로 구성해 볼수도 있다.

orElse로 위에 코드를 변경 해보겠다. 값이 있으면 위에 값을 반환 하고 없으면 kiwi로 반환한다.

```java

        log.info(found.orElse(new Fruit("Kiwi")).getName());


```

ifPresent 를 사용하여 변경 값이 있을때 함수형 인터페이스를 사용해서 이름을 출력해보았다.

```java

        found.ifPresent(f -> { log.info(f.getName()); });


```

orElseGet을 사용하여 변경 값이 없을때 레몬 객체를 반환

```java

        log.info(found.orElseGet(() -> new Fruit("Lemon")).getName());


```

그럼 Optional에서는 NPE가 발생하진 않지만 get 메소드를 사용시에 값이 없으면 NoSuchElementException을 발생한다. 그럼 비슷한 문제가 발생하게 된다.

또 어떤 사람들은 말한다 jdk8에서 Optional이 추가 되었지만 인터페이스들은 바뀌지 않았다고 예시는 아래의 코드를 보면 된다.

```java

public interface List<E> {
    Optional<E> get(int index);
    [...]
}

```

LIST 인터페이스는 위처럼 바껴야 되는데 여전히 바뀌지 않았고 그럼 여전히 아래 처럼 어떤건 사용하고 어떤건 사용하지 않아서 일관성을 해친다고 생각한다.

```java
Optional<T> optional = // [...]


T nonOptional = list.get(index);

if (optional.isPresent()) {
    // do stuff
}

if (nonOptional != null) {
    // do stuff
}

```

그리고 또 다른 대안을 존재한다는 사실 jsr305 @Nullable @NonNull 어너테이션

위처럼 여러가지 이유로 옵셔널에 대해 부정적인 관점도 존재 한다.

 
# 참조 
-----
* [JSR 335:Lambda Expressions for the JavaTM Programming Language](https://www.jcp.org/en/jsr/detail?id=335)
* [design-optional](https://blog.codefx.org/java/dev/design-optional/)
* [java-optional-objects](https://dzone.com/articles/java-optional-objects)
* [Three-valued_logic](https://en.wikipedia.org/wiki/Three-valued_logic)
* [on-java-8s-introduction-of-optional](https://blog.jooq.org/2013/04/11/on-java-8s-introduction-of-optional/)
* [jdk8 list](https://docs.oracle.com/javase/8/docs/api/java/util/List.html)
* [JSR 305: Annotations for Software Defect Detection](https://jcp.org/en/jsr/detail?id=305)