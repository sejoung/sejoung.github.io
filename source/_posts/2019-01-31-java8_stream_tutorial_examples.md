---
layout: post
title: "java stream 예제"
date: 2019-01-31 09:27 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### java stream 예제

여기에 글을 번역한 것입니다. [java8-stream-tutorial-examples](https://winterbe.com/posts/2014/07/31/java8-stream-tutorial-examples/)

이 예제 중심 자습서에서는 Java 8 스트림에 대한 심층적 인 개요를 제공합니다. StreamAPI 에 대해 처음 읽었을 때 Java I / O InputStream와 비슷하게 들리며 이름에 대해 혼란스러워했습니다 OutputStream. 하지만 Java 8 스트림은 완전히 다른 것입니다. 스트림은 모나드 이므로, 자바에 기능적 프로그래밍 을 가져 오는 데 큰 역할을합니다 .

```
함수 프로그래밍에서 모나드는 일련의 계단으로 정의 된 계산을 나타내는 구조입니다. 
모나드 구조가있는 형식은 연산을 연결하는 의미와 해당 형식의 함수를 함께 정의합니다.
```

이 가이드는 Java 8 스트림을 사용하여 작업하는 방법과 다양한 종류의 사용 가능한 스트림 작업을 사용하는 방법을 설명합니다. 처리 순서 및 스트림 작업의 순서가 런타임 성능에 미치는 영향에 대해 학습합니다. 더 강력한 스트림 작업 reduce, collect그리고 flatMap자세히 설명합니다. 이 튜토리얼은 병렬 스트림에 대한 심층적 인 설명으로 끝납니다.


#### 스트림의 작동 방식

스트림은 일련의 요소를 나타내며 이러한 요소에 대한 계산을 수행하는 다른 종류의 연산을 지원합니다.

```java

package com.github.sejoung.codetest.stream;

import java.util.List;

public class HowStreamsWork {
    public static void main(String[] args) {
        List<String> myList = List.of("a1", "a2", "b1", "c2", "c1");

        myList
                .stream()
                .filter(s -> s.startsWith("c"))
                .map(String::toUpperCase)
                .sorted()
                .forEach(System.out::println);

    }
}


```
실행결과
```
C1
C2

Process finished with exit code 0

```

스트림 작업은 중간 또는 터미널입니다. 
중간 작업은 스트림을 반환하므로 세미콜론을 사용하지 않고 여러 중간 작업을 연결할 수 있습니다. 
터미널 작업은 void이거나 비 스트림 결과를 반환합니다. 

위의 예 filter에서 map, sorted은 forEach 터미널 작업의  중간 작업입니다. 
사용 가능한 모든 스트림 작업의 전체 목록은 Stream Javadoc을 참조하십시오 . 

위 예에서 볼 수있는 이러한 스트림 작업 체인은 작업 파이프 라인 이라고도 합니다 .

대부분의 스트림 연산은 어떤 종류의 람다 표현식 매개 변수 (operation)의 정확한 동작을 지정하는 기능적 인터페이스를 허용합니다. 
이러한 작업의 대부분은 간섭이 없고 상태가 없어야합니다 . 

그게 무슨 뜻 이죠?

함수는 스트림의 기본 데이터 소스를 수정하지 않을 때 간섭을받지 않습니다. 
예를 들어 위 예제에서 람다 표현식은 myList컬렉션에 요소를 추가하거나 제거하여 수정하지 않습니다.

함수의 실행이 결정적이라면 함수는 상태 가 없습니다. 
예를 들어 위의 예제에서 실행 중에 변경 될 수있는 외부 범위의 변경 가능한 변수 나 상태에 따라 람다식이 달라지지는 않습니다.


#### 다른 종류의 스트림 

스트림은 다양한 데이터 소스, 특히 컬렉션에서 만들 수 있습니다. 
목록 및 세트 새로운 방법을 지원 stream()하고 parallelStream()중 하나에하는 것은 순차적 또는 병렬 스트림을 생성합니다. 
병렬 스트림은 여러 스레드에서 작동 할 수 있으며이 자습서의 뒷부분에서 다룰 예정입니다.
현재 순차적 스트림에 중점을 둡니다.

```java

package com.github.sejoung.codetest.stream;

import java.util.List;

public class DifferentKindOfStreams {
    public static void main(String[] args) {
        List.of("a1", "a2", "a3")
                .stream()
                .findFirst()
                .ifPresent(System.out::println);

    }
}


```
실행결과
```

a1

Process finished with exit code 0
```

stream()객체 목록 에서 메소드 를 호출하면 일반 객체 스트림이 반환됩니다. 
그러나 우리는 다음 코드 샘플에서 볼 수있는 것처럼 스트림을 다루기 위해 컬렉션을 생성 할 필요가 없습니다.

```java

package com.github.sejoung.codetest.stream;

import java.util.stream.Stream;

public class DifferentKindOfStreams {
    public static void main(String[] args) {
        Stream.of("a1", "a2", "a3")
                .findFirst()
                .ifPresent(System.out::println);
    }
}


```
실행결과
```

a1

Process finished with exit code 0
```

Stream.of()한 무리의 객체 참조에서 스트림을 만드는 데 사용 하십시오.

게다가 일반 개체는 기본 데이터 형(int, long하고 double) 작업을 위한 자바에게 스트림의 특별한 종류를 제공한다. 
당신이 짐작 했겠지만 IntStream, LongStream그리고 DoubleStream.


IntStreams는 for 루프를 사용하여 일반 for를 대체 할 수 있습니다 IntStream.range().

```java

package com.github.sejoung.codetest.stream;

import java.util.stream.IntStream;

public class DifferentKindOfStreams {
    public static void main(String[] args) {
        IntStream.range(1, 4)
                .forEach(System.out::println);
    }
}


```
실행결과
```
1
2
3

Process finished with exit code 0

```

이러한 모든 원시 스트림은 다음과 같은 차이점이있는 일반 객체 스트림과 동일하게 작동합니다. 
원시 스트림은 추가 터미널 집계 연산(sum(), average())을 지원하며 특수 λ 식을 사용합니다 
(예 : IntFunction대신 Function또는 IntPredicate대신 Predicate). 

```java

package com.github.sejoung.codetest.stream;

import java.util.Arrays;
import java.util.stream.Stream;

public class DifferentKindOfStreams {
    public static void main(String[] args) {
        Arrays.stream(new int[]{1, 2, 3})
                .map(n -> 2 * n + 1)
                .average()
                .ifPresent(System.out::println);
    }
}

```
실행결과
```
5.0

Process finished with exit code 0
```

때로는 일반 객체 스트림을 원시 스트림으로 변환하거나 그 반대로 변환하는 것이 유용합니다. 
이를 위해 객체 스트림은 특별한 매핑 작업(mapToInt(), mapToLong()및 mapToDouble())을 지원

```java

package com.github.sejoung.codetest.stream;

import java.util.stream.Stream;

public class DifferentKindOfStreams {
    public static void main(String[] args) {
        Stream.of("a1", "a2", "a3")
                .map(s -> s.substring(1))
                .mapToInt(Integer::parseInt)
                .max()
                .ifPresent(System.out::println);
    }
}

```
실행결과
```
3

Process finished with exit code 0
```

원시 스트림은 다음을 통해 객체 스트림(mapToObj())으로 변환 될 수 있습니다.

```java

package com.github.sejoung.codetest.stream;

import java.util.stream.IntStream;

public class DifferentKindOfStreams {
    public static void main(String[] args) {
        IntStream.range(1, 4)
                .mapToObj(i -> "a" + i)
                .forEach(System.out::println);
    }
}


```
실행결과
```

a1
a2
a3

Process finished with exit code 0
```

다음은 결합 된 예제입니다. double의 스트림은 먼저 int 스트림에 매핑되고 string의 객체 스트림에 매핑됩니다.

```java

package com.github.sejoung.codetest.stream;

import java.util.stream.Stream;

public class DifferentKindOfStreams {
    public static void main(String[] args) {
     
        Stream.of(1.0, 2.0, 3.0)
                .mapToInt(Double::intValue)
                .mapToObj(i -> "a" + i)
                .forEach(System.out::println);
    }
}


```
실행결과
```

a1
a2
a3

Process finished with exit code 0
```

#### Processing Order

다양한 종류의 스트림을 만들고 작동하는 방법을 배웠으므로 이제 스트림 작동이 어떻게 처리되는지 자세히 살펴 보겠습니다.

중간 작업의 중요한 특징은 lazy입니다. 터미널 작동이없는이 샘플을보십시오.

```java

package com.github.sejoung.codetest.stream;

import java.util.stream.Stream;

public class ProcessingOrder {
    public static void main(String[] args) {
        Stream.of("d2", "a2", "b1", "b3", "c")
                .filter(s -> {
                    System.out.println("filter: " + s);
                    return true;
                });
    }
}


```
실행결과
```

Process finished with exit code 0

```
이 코드 스니펫을 실행할 때 콘솔에 아무 것도 인쇄되지 않습니다. 
중간 작업은 터미널 작업이있을 때만 실행되기 때문입니다.

```java

package com.github.sejoung.codetest.stream;

import java.util.stream.Stream;

public class ProcessingOrder {
    public static void main(String[] args) {
        Stream.of("d2", "a2", "b1", "b3", "c")
                .filter(s -> {
                    System.out.println("filter: " + s);
                    return true;
                }).forEach(s -> System.out.println("forEach: " + s));

    }
}



```
실행결과
```
filter: d2
forEach: d2
filter: a2
forEach: a2
filter: b1
forEach: b1
filter: b3
forEach: b3
filter: c
forEach: c

Process finished with exit code 0
```
이 코드 스니펫을 실행하면 콘솔에 원하는 결과가 나타납니다.

결과의 순서는 놀랄 수 있습니다. 
순진한 방법은 스트림의 모든 요소에 대해 수평 적으로 연산을 차례대로 실행하는 것입니다. 
그러나 대신 각 요소는 체인을 따라 세로로 이동합니다. 
첫번째 문자열 "D2"는 전달 filter후 forEach 그래야만 두번째 문자열 "A2"가 처리된다.

이 동작은 다음 예제에서 볼 수 있듯이 각 요소에서 수행 된 실제 작업 수를 줄일 수 있습니다.

```java

package com.github.sejoung.codetest.stream;

import java.util.stream.Stream;

public class ProcessingOrder {
    public static void main(String[] args) {
        Stream.of("d2", "a2", "b1", "b3", "c")
                .map(s -> {
                    System.out.println("map: " + s);
                    return s.toUpperCase();
                })
                .anyMatch(s -> {
                    System.out.println("anyMatch: " + s);
                    return s.startsWith("A");
                });
    }
}

```
실행결과
```
map: d2
anyMatch: D2
map: a2
anyMatch: A2

Process finished with exit code 0
```
술어가 주어진 입력 요소에 적용되는 즉시 조작이 anyMatch리턴 true됩니다. 
이것은 "A2"가 전달 된 두 번째 요소에 해당됩니다. 
스트림 체인의 수직 실행 map때문에이 경우에는 두 번만 실행하면됩니다. 
따라서 스트림의 모든 요소를 매핑하는 대신 map가능하면 적게 호출됩니다.


##### 주문 문제가있는 이유

다음 예제는 두 개의 중간 작업 map및 filter터미널 작업으로 구성 forEach됩니다. 
이러한 작업이 어떻게 실행되고 있는지 다시 한번 살펴 보겠습니다.


```java

package com.github.sejoung.codetest.stream;

import java.util.stream.Stream;

public class WhyOrderMatters {
    public static void main(String[] args) {
        Stream.of("d2", "a2", "b1", "b3", "c")
                .map(s -> {
                    System.out.println("map: " + s);
                    return s.toUpperCase();
                })
                .filter(s -> {
                    System.out.println("filter: " + s);
                    return s.startsWith("A");
                })
                .forEach(s -> System.out.println("forEach: " + s));
    }
}


```
실행결과
```

map: d2
filter: D2
map: a2
filter: A2
forEach: A2
map: b1
filter: B1
map: b3
filter: B3
map: c
filter: C

Process finished with exit code 0

```
당신은 둘 다 짐작으로 map하고 filter반면에 기본 컬렉션의 모든 문자열을 다섯 번이라고 
forEach 한 번만 호출된다고 생각했다 하지만 결과는 아니다.

filter체인의 시작 부분으로 이동하여 작업 순서를 변경하면 실제 실행 횟수를 크게 줄일 수 있습니다 .


```java

package com.github.sejoung.codetest.stream;

import java.util.stream.Stream;

public class WhyOrderMatters {
    public static void main(String[] args) {
        Stream.of("d2", "a2", "b1", "b3", "c")
                .filter(s -> {
                    System.out.println("filter: " + s);
                    return s.startsWith("a");
                })
                .map(s -> {
                    System.out.println("map: " + s);
                    return s.toUpperCase();
                })
                .forEach(s -> System.out.println("forEach: " + s));
    }
}


```
실행결과
```
filter: d2
filter: a2
map: a2
forEach: A2
filter: b1
filter: b3
filter: c

Process finished with exit code 0
```

이제는 map한 번만 호출되므로 많은 수의 입력 요소에 대해 작업 파이프 라인이 훨씬 빠르게 수행됩니다. 복잡한 메소드 체인을 작성할 때이를 명심하십시오.

위의 예제를 추가 작업으로 확장 해 보겠습니다 sorted.

```java
package com.github.sejoung.codetest.stream;

import java.util.stream.Stream;

public class WhyOrderMatters {
    public static void main(String[] args) {

        Stream.of("d2", "a2", "a1", "b1", "b3", "c")
                .sorted((s1, s2) -> {
                    System.out.printf("sort: %s; %s\n", s1, s2);
                    return s1.compareTo(s2);
                })
                .filter(s -> {
                    System.out.println("filter: " + s);
                    return s.startsWith("a");
                })
                .map(s -> {
                    System.out.println("map: " + s);
                    return s.toUpperCase();
                })
                .forEach(s -> System.out.println("forEach: " + s));
    }
}


```

정렬은 특별한 종류의 중간 작업입니다. 이것은 소위 스테이트 풀(stateful) 연산 입니다. 
요소 모음을 정렬하기 위해 주문하는 동안 상태를 유지해야하기 때문입니다.

이 예제를 실행하면 다음 콘솔 출력이됩니다.

실행결과
```
sort: a2; d2
sort: a1; a2
sort: b1; a1
sort: b1; a2
sort: b1; d2
sort: b3; b1
sort: b3; d2
sort: c; b1
sort: c; d2
sort: c; b3
filter: a1
map: a1
forEach: A1
filter: a2
map: a2
forEach: A2
filter: b1
filter: b3
filter: c
filter: d2

Process finished with exit code 0
```

먼저 정렬 작업이 전체 입력 컬렉션에 대해 실행됩니다. 즉, sorted가로로 실행됩니다. 
따라서이 경우 sorted입력 컬렉션의 모든 요소에서 여러 조합에 대해 8 번 호출됩니다.

체인의 순서를 다시 지정하여 성능을 최적화 할 수 있습니다.

```java
package com.github.sejoung.codetest.stream;

import java.util.stream.Stream;

public class WhyOrderMatters {
    public static void main(String[] args) {
       
        Stream.of("d2", "a2", "b1", "b3", "c")
                .filter(s -> {
                    System.out.println("filter: " + s);
                    return s.startsWith("a");
                })
                .sorted((s1, s2) -> {
                    System.out.printf("sort: %s; %s\n", s1, s2);
                    return s1.compareTo(s2);
                })
                .map(s -> {
                    System.out.println("map: " + s);
                    return s.toUpperCase();
                })
                .forEach(s -> System.out.println("forEach: " + s));
    }
}


```
실행결과
```
filter: d2
filter: a2
filter: b1
filter: b3
filter: c
map: a2
forEach: A2

Process finished with exit code 0
```
이 예제에서는 filter로 입력 컬렉션을 하나의 요소로만 줄일 수 sorted있기 때문에 호출 된 적이 없다 . 
따라서 더 큰 입력 컬렉션의 경우 성능이 크게 향상됩니다.

#### 스트림 재사용

Java 8 스트림은 재사용 할 수 없습니다. 터미널 작업을 호출하자마자 스트림이 닫힙니다.

```java

package com.github.sejoung.codetest.stream;

import java.util.stream.Stream;

public class ReusingStreams {
    public static void main(String[] args) {
        Stream<String> stream =
                Stream.of("d2", "a2", "b1", "b3", "c")
                        .filter(s -> s.startsWith("a"));

        stream.anyMatch(s -> true);    // ok
        stream.noneMatch(s -> true);   // exception
    }
}


```

호출 noneMatch후 anyMatch다음과 같은 예외가 동일한 스트림 결과 :

실행결과
```
Exception in thread "main" java.lang.IllegalStateException: stream has already been operated upon or closed
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:229)
	at java.base/java.util.stream.ReferencePipeline.noneMatch(ReferencePipeline.java:538)
	at com.github.sejoung.codetest.stream.ReusingStreams.main(ReusingStreams.java:12)

Process finished with exit code 1
```

이 제한을 극복하기 위해, 우리는 실행하고자하는 모든 터미널 작업에 대해 새로운 스트림 체인을 생성해야합니다. 
예를 들어, 모든 중간 작업이 이미 설정된 상태에서 새로운 스트림을 생성하기 위해 스트림 공급 업체를 생성 할 수 있습니다.

```java

package com.github.sejoung.codetest.stream;

import java.util.function.Supplier;
import java.util.stream.Stream;

public class ReusingStreams {
    public static void main(String[] args) {
        Supplier<Stream<String>> streamSupplier =
                () -> Stream.of("d2", "a2", "b1", "b3", "c")
                        .filter(s -> s.startsWith("a"));

        streamSupplier.get().anyMatch(s -> true);   // ok
        streamSupplier.get().noneMatch(s -> true);  // ok
    }
}

```
실행결과
```
Process finished with exit code 0
```
각 호출 get()은 원하는 터미널 작업을 호출하기 위해 저장되는 새 스트림 을 생성합니다.

#### 고급 작업

스트림은 다양한 작업을 지원합니다. 
우리는 이미 같은 가장 중요한 작업에 대해 배운 filter나 map. 
사용 가능한 다른 모든 연산을 발견하기 위해 여러분에게 맡깁니다 ( Stream Javadoc 참고 ). 
대신 이제 더 복잡한 작업으로 깊은 다이빙을하자 collect, flatMap하고 reduce.

이 섹션의 대부분의 코드 샘플은 데모 목적으로 다음 사람 목록을 사용합니다.

```java

package com.github.sejoung.codetest.stream;

public class Person {
    String name;
    int age;

    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return name;
    }
}


```

```java

package com.github.sejoung.codetest.stream;

import java.util.Arrays;
import java.util.List;

public class AdvancedOperations {
    public static void main(String[] args) {
        List<Person> persons =
                Arrays.asList(
                        new Person("Max", 18),
                        new Person("Peter", 23),
                        new Person("Pamela", 23),
                        new Person("David", 12));
    }
}


```

##### Collect

수집은 다른 결과의 종류, 예로 스트림의 변환 소자를 위해 매우 유용하다 단말기 동작 List, Set또는 Map. 수집 (Collect)은 공급 업체 , 누적 기 , 결합기 및 피니셔Collector 의 네 가지 작업으로 구성된 a 를 수용합니다 . 이것은 처음에는 매우 복잡해 보이지만, Java 8은 클래스 를 통해 다양한 내장 콜렉터를 지원합니다 . 따라서 가장 일반적인 작업의 경우 수집기를 직접 구현할 필요가 없습니다.Collectors

매우 일반적인 유즈 케이스부터 시작합시다.

```java

package com.github.sejoung.codetest.stream;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class AdvancedOperations {
    public static void main(String[] args) {
        List<Person> persons =
                Arrays.asList(
                        new Person("Max", 18),
                        new Person("Peter", 23),
                        new Person("Pamela", 23),
                        new Person("David", 12));

        List<Person> filtered =
                persons
                        .stream()
                        .filter(p -> p.name.startsWith("P"))
                        .collect(Collectors.toList());
        System.out.println(filtered);    // [Peter, Pamela]

    }
}


```
실행결과
```
[Peter, Pamela]

Process finished with exit code 0
```

보시다시피 스트림 요소에서 List을 만드는 것은 매우 간단합니다. 
List 대신 Set이 필요합니다 Collectors.toSet(). 사용하십시오 .

다음 예는 모든 사람을 나이별로 분류합니다.

```java

package com.github.sejoung.codetest.stream;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class AdvancedOperations {
    public static void main(String[] args) {
        List<Person> persons =
                Arrays.asList(
                        new Person("Max", 18),
                        new Person("Peter", 23),
                        new Person("Pamela", 23),
                        new Person("David", 12));

        Map<Integer, List<Person>> personsByAge = persons
                .stream()
                .collect(Collectors.groupingBy(p -> p.age));

        personsByAge
                .forEach((age, p) -> System.out.format("age %s: %s\n", age, p));
    }
}


```
실행결과
```
age 18: [Max]
age 23: [Peter, Pamela]
age 12: [David]

Process finished with exit code 0
```

컬렉터는 매우 다목적입니다. 

스트림의 요소에 대한 집계를 만들 수도 있습니다 (예 : 모든 사람의 평균 연령).

```java

package com.github.sejoung.codetest.stream;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class AdvancedOperations {
    public static void main(String[] args) {
        List<Person> persons =
                Arrays.asList(
                        new Person("Max", 18),
                        new Person("Peter", 23),
                        new Person("Pamela", 23),
                        new Person("David", 12));

        Double averageAge = persons
                .stream()
                .collect(Collectors.averagingInt(p -> p.age));

        System.out.println(averageAge);
    }
}


```
실행결과
```
19.0

Process finished with exit code 0

```

보다 포괄적 인 통계에 관심이 있다면, 요약 콜렉터는 특수 내장 기본 통계 오브젝트를 리턴합니다. 
따라서 우리는 단순히 사람의 최소 , 최대 및 산술 평균 연령뿐만 아니라 합계 및 수를 결정할 수 있습니다.

```java
package com.github.sejoung.codetest.stream;

import java.util.Arrays;
import java.util.IntSummaryStatistics;
import java.util.List;
import java.util.stream.Collectors;

public class AdvancedOperations {
    public static void main(String[] args) {
        List<Person> persons =
                Arrays.asList(
                        new Person("Max", 18),
                        new Person("Peter", 23),
                        new Person("Pamela", 23),
                        new Person("David", 12));

        IntSummaryStatistics ageSummary =
                persons
                        .stream()
                        .collect(Collectors.summarizingInt(p -> p.age));

        System.out.println(ageSummary);
    }
}


```
실행결과
```
IntSummaryStatistics{count=4, sum=76, min=12, average=19.000000, max=23}

Process finished with exit code 0

```

다음 예는 모든 사람을 단일 문자열로 결합합니다.

```java

package com.github.sejoung.codetest.stream;

import java.util.Arrays;
import java.util.IntSummaryStatistics;
import java.util.List;
import java.util.stream.Collectors;

public class AdvancedOperations {
    public static void main(String[] args) {
        List<Person> persons =
                Arrays.asList(
                        new Person("Max", 18),
                        new Person("Peter", 23),
                        new Person("Pamela", 23),
                        new Person("David", 12));

        String phrase = persons
                .stream()
                .filter(p -> p.age >= 18)
                .map(p -> p.name)
                .collect(Collectors.joining(" and ", "In Germany ", " are of legal age."));

        System.out.println(phrase);
    }
}

```
실행결과
```
In Germany Max and Peter and Pamela are of legal age.

Process finished with exit code 0

```

조인 콜렉터는 선택적 접두어 및 접미어와 구분 기호를 허용합니다.

스트림 요소를지도로 변환하려면 키와 값을 매핑하는 방법을 지정해야합니다. 
매핑 된 키는 고유해야하며 그렇지 않으면 an IllegalStateException이 Throw됩니다. 
선택적으로 병합 함수를 추가 매개 변수로 전달하여 예외를 무시할 수 있습니다.

```java

package com.github.sejoung.codetest.stream;

import java.util.Arrays;
import java.util.IntSummaryStatistics;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class AdvancedOperations {
    public static void main(String[] args) {
        List<Person> persons =
                Arrays.asList(
                        new Person("Max", 18),
                        new Person("Peter", 23),
                        new Person("Pamela", 23),
                        new Person("David", 12));

        Map<Integer, String> map = persons
                .stream()
                .collect(Collectors.toMap(
                        p -> p.age,
                        p -> p.name,
                        (name1, name2) -> name1 + ";" + name2));

        System.out.println(map);
    }
}


```
실행결과
```
{18=Max, 23=Peter;Pamela, 12=David}

Process finished with exit code 0

```

이제 가장 강력한 빌트인 콜렉터 중 일부를 알았으니 이제는 자체 콜렉터를 만들자. 
우리는 스트림의 모든 사람을 |파이프 문자 로 구분 된 상위 문자로 된 모든 이름으로 구성된 단일 문자열로 변환하려고합니다 . 
이것을 달성하기 위해 우리는 새로운 컬렉터를 통해 만듭니다 Collector.of(). 
우리는 수집가의 4 가지 성분 , 즉 공급자 , 축 압기 , 결합기 및 피니셔 를 통과해야합니다 .

```java

package com.github.sejoung.codetest.stream;

import java.util.*;
import java.util.stream.Collector;
import java.util.stream.Collectors;

public class AdvancedOperations {
    public static void main(String[] args) {
        List<Person> persons =
                Arrays.asList(
                        new Person("Max", 18),
                        new Person("Peter", 23),
                        new Person("Pamela", 23),
                        new Person("David", 12));

        Collector<Person, StringJoiner, String> personNameCollector =
                Collector.of(
                        () -> new StringJoiner(" | "),          // supplier
                        (j, p) -> j.add(p.name.toUpperCase()),  // accumulator
                        (j1, j2) -> j1.merge(j2),               // combiner
                        StringJoiner::toString);                // finisher

        String names = persons
                .stream()
                .collect(personNameCollector);

        System.out.println(names);
    }
}


```
실행결과
```
MAX | PETER | PAMELA | DAVID

Process finished with exit code 0
```
Java의 문자열은 불변이므로 StringJoiner 콜렉터가 문자열을 생성하도록 하는 헬퍼 클래스가 필요 합니다. 
공급자(supplier)는 초기에 적절한 구분 기호로 이러한 StringJoiner를 생성합니다. 
누적기(accumulator)는 StringJoiner에 각 사람 대문자 이름을 추가하는 데 사용됩니다. 
결합 자 (combiner)는 두 개의 StringJoiners를 하나로 병합하는 방법을 알고 있습니다.
마지막 단계에서 finisher는 StringJoiner에서 원하는 String을 생성합니다.

##### FlatMap

우리는 이미 map작업 을 활용하여 스트림의 객체를 다른 유형의 객체로 변환하는 방법을 배웠습니다 . 
모든 객체는 정확히 하나의 다른 객체에만 매핑 될 수 있기 때문에지도가 다소 제한적입니다. 
그러나 하나의 객체를 여러 객체로 변환하거나 전혀 변환하지 않으려면 어떻게해야할까요? 
이것은 flatMap구출에 관해서입니다.

FlatMap은 스트림의 각 요소를 다른 오브젝트의 스트림으로 변환합니다. 
따라서 각 객체는 스트림에 의해 지원되는 0, 하나 또는 여러 개의 다른 객체로 변환됩니다.
이러한 스트림의 내용은 반환 된 flatMap작업 스트림에 배치됩니다 .

flatMap실제로 작동 하기 전에 적절한 유형 계층 구조가 필요합니다.

```java

package com.github.sejoung.codetest.stream;

public class Bar {
    String name;

    Bar(String name) {
        this.name = name;
    }
}


```

```java

package com.github.sejoung.codetest.stream;

import java.util.ArrayList;
import java.util.List;

public class Foo {
    String name;
    List<Bar> bars = new ArrayList<>();

    Foo(String name) {
        this.name = name;
    }
}

```
다음으로 스트림에 대한 지식을 활용하여 몇 가지 객체를 인스턴스화합니다.

```java

package com.github.sejoung.codetest.stream;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

public class FlatMapTest {
    public static void main(String[] args) {
        List<Foo> foos = new ArrayList<>();

        // create foos
        IntStream
                .range(1, 4)
                .forEach(i -> foos.add(new Foo("Foo" + i)));

        // create bars
        foos.forEach(f ->
                IntStream
                        .range(1, 4)
                        .forEach(i -> f.bars.add(new Bar("Bar" + i + " <- " + f.name))));
    }
}


```
이제 우리는 3 개의 막대로 구성된 목록을 각각 3 개의 막대로 구성했습니다.

FlatMap은 객체 스트림을 반환해야하는 함수를 허용합니다. 따라서 각 foo의 bar 객체를 해결하기 위해 적절한 함수를 전달합니다.

```java

package com.github.sejoung.codetest.stream;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

public class FlatMapTest {
    public static void main(String[] args) {
        List<Foo> foos = new ArrayList<>();

        // create foos
        IntStream
                .range(1, 4)
                .forEach(i -> foos.add(new Foo("Foo" + i)));

        // create bars
        foos.forEach(f ->
                IntStream
                        .range(1, 4)
                        .forEach(i -> f.bars.add(new Bar("Bar" + i + " <- " + f.name))));

        foos.stream()
                .flatMap(f -> f.bars.stream())
                .forEach(b -> System.out.println(b.name));
    }
}


```
실행결과
```
Bar1 <- Foo1
Bar2 <- Foo1
Bar3 <- Foo1
Bar1 <- Foo2
Bar2 <- Foo2
Bar3 <- Foo2
Bar1 <- Foo3
Bar2 <- Foo3
Bar3 <- Foo3

Process finished with exit code 0
```
보시다시피, 우리는 성공적으로 3 개의 foo 객체의 스트림을 9 개의 막대 객체의 스트림으로 변환했습니다.

마지막으로 위의 코드 예제를 스트림 작업의 단일 파이프 라인으로 단순화 할 수 있습니다.

```java

package com.github.sejoung.codetest.stream;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

public class FlatMapTest {
    public static void main(String[] args) {
        IntStream.range(1, 4)
                .mapToObj(i -> new Foo("Foo" + i))
                .peek(f -> IntStream.range(1, 4)
                        .mapToObj(i -> new Bar("Bar" + i + " <- " + f.name))
                        .forEach(f.bars::add))
                .flatMap(f -> f.bars.stream())
                .forEach(b -> System.out.println(b.name));
    }
}

```
실행결과
```
Bar1 <- Foo1
Bar2 <- Foo1
Bar3 <- Foo1
Bar1 <- Foo2
Bar2 <- Foo2
Bar3 <- Foo2
Bar1 <- Foo3
Bar2 <- Foo3
Bar3 <- Foo3

Process finished with exit code 0
```
FlatMap은 OptionalJava 8에 도입 된 클래스 에서도 사용할 수 있습니다. 
옵션 flatMap연산은 다른 유형의 선택적 객체를 반환합니다.
따라서 불쾌한 null검사 를 방지하기 위해 활용할 수 있습니다 .

다음과 같이 고도로 계층화 된 구조를 생각해보십시오.

```java

package com.github.sejoung.codetest.stream;

class Outer {
    Nested nested;
}

class Nested {
    Inner inner;
}

class Inner {
    String foo;
}


```
foo외부 인스턴스 의 내부 문자열을 해결하려면 NullPointerExceptions을 방지하기 위해 여러 개의 null 검사를 추가해야합니다.

```java

package com.github.sejoung.codetest.stream;

public class NestedTest {
    public static void main(String[] args) {
        Outer outer = new Outer();
        if (outer != null && outer.nested != null && outer.nested.inner != null) {
            System.out.println(outer.nested.inner.foo);
        }
    }
}


```
optionals flatMap연산 을 사용하여 동일한 동작을 얻을 수 있습니다 .

```java

package com.github.sejoung.codetest.stream;

import java.util.Optional;

public class NestedTest {
    public static void main(String[] args) {

        Optional.of(new Outer())
                .flatMap(o -> Optional.ofNullable(o.nested))
                .flatMap(n -> Optional.ofNullable(n.inner))
                .flatMap(i -> Optional.ofNullable(i.foo))
                .ifPresent(System.out::println);
    }
}


```

각 호출 flatMap다시 표시 Optional포장 존재하는 경우 또는 원하는 개체 null없는 경우.

##### Reduce

```java

package com.github.sejoung.codetest.stream;

import java.util.Arrays;
import java.util.List;

public class ReduceTest {
    public static void main(String[] args) {
        List<Person> persons =
                Arrays.asList(
                        new Person("Max", 18),
                        new Person("Peter", 23),
                        new Person("Pamela", 23),
                        new Person("David", 12));

        persons
                .stream()
                .reduce((p1, p2) -> p1.age > p2.age ? p1 : p2)
                .ifPresent(System.out::println);    // Pamela


    }
}


```
실행결과
```
Pamela

Process finished with exit code 0
```

이 reduce메서드는 BinaryOperator 누산기 함수를 허용 합니다. 
이 경우 실제로 BiFunction두 피연산자가 같은 유형을 공유합니다 Person. BiFunction은 비슷 Function하지만 두 가지 인수를 허용합니다. 
예제 함수는 두 사람의 나이를 비교하여 최대 연령의 사람을 반환합니다.

두 번째 reduce방법은 신원 값과 BinaryOperator누적 기를 모두 허용합니다.
이 메소드는 스트림의 다른 모든 사람들로부터 집합 된 이름과 나이를 가진 새로운 Person을 생성하는 데 사용할 수 있습니다.

```java

package com.github.sejoung.codetest.stream;

import java.util.Arrays;
import java.util.List;

public class ReduceTest {
    public static void main(String[] args) {
        List<Person> persons =
                Arrays.asList(
                        new Person("Max", 18),
                        new Person("Peter", 23),
                        new Person("Pamela", 23),
                        new Person("David", 12));

        Person result =
                persons
                        .stream()
                        .reduce(new Person("", 0), (p1, p2) -> {
                            p1.age += p2.age;
                            p1.name += p2.name;
                            return p1;
                        });

        System.out.format("name=%s; age=%s", result.name, result.age);
    }
}


```
실행결과
```
name=MaxPeterPamelaDavid; age=76
Process finished with exit code 0
```
세 번째 reduce방법은 신원 값, BiFunction누적 기 및 유형의 결합 함수의 세 가지 매개 변수를 허용 합니다 BinaryOperator. 
신원 값 유형은 유형에만 국한되지 않으므로이 Person감소를 활용하여 모든 사람의 연령 합계를 결정할 수 있습니다.

```java

package com.github.sejoung.codetest.stream;

import java.util.Arrays;
import java.util.List;

public class ReduceTest {
    public static void main(String[] args) {
        List<Person> persons =
                Arrays.asList(
                        new Person("Max", 18),
                        new Person("Peter", 23),
                        new Person("Pamela", 23),
                        new Person("David", 12));
        Integer ageSum = persons
                .stream()
                .reduce(0, (sum, p) -> sum += p.age, (sum1, sum2) -> sum1 + sum2);

        System.out.println(ageSum);  // 76
    }
}


```
실행결과
```
76

Process finished with exit code 0

```
보시다시피 결과는 76 이지만 정확히 어떤 일이 일어나고 있습니까? 
위의 코드를 일부 디버그 출력으로 확장 해 봅시다.


```java

package com.github.sejoung.codetest.stream;

import java.util.Arrays;
import java.util.List;

public class ReduceTest {
    public static void main(String[] args) {
        List<Person> persons =
                Arrays.asList(
                        new Person("Max", 18),
                        new Person("Peter", 23),
                        new Person("Pamela", 23),
                        new Person("David", 12));

        Integer ageSum = persons
                .stream()
                .reduce(0,
                        (sum, p) -> {
                            System.out.format("accumulator: sum=%s; person=%s\n", sum, p);
                            return sum += p.age;
                        },
                        (sum1, sum2) -> {
                            System.out.format("combiner: sum1=%s; sum2=%s\n", sum1, sum2);
                            return sum1 + sum2;
                        });

    }
}


```
실행결과
```
accumulator: sum=0; person=Max
accumulator: sum=18; person=Peter
accumulator: sum=41; person=Pamela
accumulator: sum=64; person=David

Process finished with exit code 0

```
보시다시피 accumulator 함수가 모든 작업을 수행합니다. 처음에는 초기 신원 값 0 과 첫 번째 사람 Max로 호출됩니다 . 다음 3 단계 sum에서는 마지막 단계 인력의 나이까지 76 세까지 지속적으로 증가합니다 .

와트, 기다려? 결합자는 결코 불리지 않는다? 동일한 스트림을 병렬로 실행하면 비밀이 해제됩니다.

```java

package com.github.sejoung.codetest.stream;

import java.util.Arrays;
import java.util.List;

public class ReduceTest {
    public static void main(String[] args) {
        List<Person> persons =
                Arrays.asList(
                        new Person("Max", 18),
                        new Person("Peter", 23),
                        new Person("Pamela", 23),
                        new Person("David", 12));

        Integer ageSum = persons
                .parallelStream()
                .reduce(0,
                        (sum, p) -> {
                            System.out.format("accumulator: sum=%s; person=%s\n", sum, p);
                            return sum += p.age;
                        },
                        (sum1, sum2) -> {
                            System.out.format("combiner: sum1=%s; sum2=%s\n", sum1, sum2);
                            return sum1 + sum2;
                        });
    }
}


```
실행결과
```
accumulator: sum=0; person=Pamela
accumulator: sum=0; person=Max
accumulator: sum=0; person=Peter
combiner: sum1=18; sum2=23
accumulator: sum=0; person=David
combiner: sum1=23; sum2=12
combiner: sum1=41; sum2=35

Process finished with exit code 0
```
이 스트림을 병렬로 실행하면 완전히 다른 실행 동작이 발생합니다. 이제 결합자는 실제로 호출됩니다. 누산기가 병렬로 호출되기 때문에, 결합기는 별도의 누적 값을 합산하는 데 필요합니다.

다음 장에서 병렬 스트림에 대해 자세히 살펴 봅시다.


#### 병렬 스트림

스트림을 병렬로 실행하여 많은 양의 입력 요소에서 런타임 성능을 향상시킬 수 있습니다.
병렬 스트림 ForkJoinPool은 정적 ForkJoinPool.commonPool()메서드 를 통해 사용할 수 있는 공용 객체를 사용합니다 . 
기본 스레드 풀의 크기는 사용 가능한 실제 CPU 코어의 양에 따라 최대 5 개의 스레드를 사용합니다.

```java

package com.github.sejoung.codetest.stream;

import java.util.concurrent.ForkJoinPool;

public class ParallelStream {
    public static void main(String[] args) {
        ForkJoinPool commonPool = ForkJoinPool.commonPool();
        System.out.println(commonPool.getParallelism());    // 3
    }
}


```
실행결과
```
3

Process finished with exit code 0
```
내 컴퓨터에서 공통 풀은 기본값 당 3의 병렬 처리로 초기화됩니다. 이 값은 다음 JVM 매개 변수를 설정하여 줄이거 나 늘릴 수 있습니다.
```
-Djava.util.concurrent.ForkJoinPool.common.parallelism=5

```
컬렉션 parallelStream()은 요소의 병렬 스트림을 만드는 방법 을 지원합니다 . 또는 parallel()주어진 스트림 에서 intermediate 메소드 를 호출하여 순차 스트림을 병렬 스트림으로 변환 할 수 있습니다 .

병렬 스트림의 병렬 실행 동작을 줄이기 위해 다음 예제는 현재 스레드에 대한 정보를 다음에 인쇄합니다 sout

```java

package com.github.sejoung.codetest.stream;

import java.util.Arrays;
import java.util.concurrent.ForkJoinPool;

public class ParallelStream {
    public static void main(String[] args) {
        Arrays.asList("a1", "a2", "b1", "c2", "c1")
                .parallelStream()
                .filter(s -> {
                    System.out.format("filter: %s [%s]\n",
                            s, Thread.currentThread().getName());
                    return true;
                })
                .map(s -> {
                    System.out.format("map: %s [%s]\n",
                            s, Thread.currentThread().getName());
                    return s.toUpperCase();
                })
                .forEach(s -> System.out.format("forEach: %s [%s]\n",
                        s, Thread.currentThread().getName()));
    }
}


```

디버그 출력을 조사하여 스트림 작업을 실행하는 데 실제로 사용되는 스레드를 더 잘 이해해야합니다.

실행결과
```
filter: b1 [main]
filter: c2 [ForkJoinPool.commonPool-worker-7]
map: c2 [ForkJoinPool.commonPool-worker-7]
forEach: C2 [ForkJoinPool.commonPool-worker-7]
filter: c1 [ForkJoinPool.commonPool-worker-3]
map: c1 [ForkJoinPool.commonPool-worker-3]
filter: a2 [ForkJoinPool.commonPool-worker-5]
map: a2 [ForkJoinPool.commonPool-worker-5]
forEach: C1 [ForkJoinPool.commonPool-worker-3]
filter: a1 [ForkJoinPool.commonPool-worker-7]
map: a1 [ForkJoinPool.commonPool-worker-7]
forEach: A1 [ForkJoinPool.commonPool-worker-7]
map: b1 [main]
forEach: B1 [main]
forEach: A2 [ForkJoinPool.commonPool-worker-5]

Process finished with exit code 0

```

보시다시피 병렬 스트림은 ForkJoinPool스트림 작업을 실행하기 위해 공통에서 사용 가능한 모든 스레드를 사용합니다 . 
특정 스레드가 실제로 사용되는 동작이 비 결정적이기 때문에 연속 실행에서 출력이 다를 수 있습니다.

추가 스트림 작업을 통해 예제를 확장 해 보겠습니다 sort

```java

package com.github.sejoung.codetest.stream;

import java.util.Arrays;
import java.util.concurrent.ForkJoinPool;

public class ParallelStream {
    public static void main(String[] args) {
   
        Arrays.asList("a1", "a2", "b1", "c2", "c1")
                .parallelStream()
                .filter(s -> {
                    System.out.format("filter: %s [%s]\n",
                            s, Thread.currentThread().getName());
                    return true;
                })
                .map(s -> {
                    System.out.format("map: %s [%s]\n",
                            s, Thread.currentThread().getName());
                    return s.toUpperCase();
                })
                .sorted((s1, s2) -> {
                    System.out.format("sort: %s <> %s [%s]\n",
                            s1, s2, Thread.currentThread().getName());
                    return s1.compareTo(s2);
                })
                .forEach(s -> System.out.format("forEach: %s [%s]\n",
                        s, Thread.currentThread().getName()));
    }
}

```

결과는 처음에는 이상하게 보일 수 있습니다.


실행결과
```
filter: b1 [main]
filter: a1 [ForkJoinPool.commonPool-worker-7]
map: a1 [ForkJoinPool.commonPool-worker-7]
filter: a2 [ForkJoinPool.commonPool-worker-5]
map: a2 [ForkJoinPool.commonPool-worker-5]
filter: c1 [ForkJoinPool.commonPool-worker-3]
map: c1 [ForkJoinPool.commonPool-worker-3]
filter: c2 [ForkJoinPool.commonPool-worker-7]
map: c2 [ForkJoinPool.commonPool-worker-7]
map: b1 [main]
sort: A2 <> A1 [main]
sort: B1 <> A2 [main]
sort: C2 <> B1 [main]
sort: C1 <> C2 [main]
sort: C1 <> B1 [main]
sort: C1 <> C2 [main]
forEach: B1 [main]
forEach: A1 [ForkJoinPool.commonPool-worker-5]
forEach: C2 [ForkJoinPool.commonPool-worker-3]
forEach: A2 [ForkJoinPool.commonPool-worker-7]
forEach: C1 [ForkJoinPool.commonPool-worker-5]

Process finished with exit code 0
```

그 보인다 sort메인 스레드에서만 순차적으로 실행됩니다. 
사실, sort병렬 스트림에서는 새로운 Java 8 메소드를 사용합니다 Arrays.parallelSort(). Javadoc 로 설명 했듯이이 방법은 정렬이 순차적으로 또는 병렬로 수행되는 경우 배열의 길이를 결정합니다.

```
지정된 배열의 길이가 최소 단위보다 작은 경우, 적절한 Arrays.sort 메소드를 사용해 소트됩니다.

```
reduce마지막 절의 예제로 돌아갑니다 . 

우리는 이미 결합 자 함수가 병렬로만 호출되지만 순차 스트림에서는 호출하지 않는다는 것을 알았습니다. 실제로 어떤 스레드가 관련되어 있는지 살펴 봅시다.

```java


package com.github.sejoung.codetest.stream;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ForkJoinPool;

public class ParallelStream {
    public static void main(String[] args) {
   
        List<Person> persons = Arrays.asList(
                new Person("Max", 18),
                new Person("Peter", 23),
                new Person("Pamela", 23),
                new Person("David", 12));

        persons
                .parallelStream()
                .reduce(0,
                        (sum, p) -> {
                            System.out.format("accumulator: sum=%s; person=%s [%s]\n",
                                    sum, p, Thread.currentThread().getName());
                            return sum += p.age;
                        },
                        (sum1, sum2) -> {
                            System.out.format("combiner: sum1=%s; sum2=%s [%s]\n",
                                    sum1, sum2, Thread.currentThread().getName());
                            return sum1 + sum2;
                        });
    }
}


```

콘솔 출력은 accumulator 와 combiner 함수가 모두 사용 가능한 모든 스레드에서 병렬로 실행 된다는 것을 보여줍니다 .

실행결과
```

accumulator: sum=0; person=Pamela [main]
accumulator: sum=0; person=Max [ForkJoinPool.commonPool-worker-5]
accumulator: sum=0; person=David [main]
combiner: sum1=23; sum2=12 [main]
accumulator: sum=0; person=Peter [ForkJoinPool.commonPool-worker-3]
combiner: sum1=18; sum2=23 [ForkJoinPool.commonPool-worker-3]
combiner: sum1=41; sum2=35 [ForkJoinPool.commonPool-worker-3]

Process finished with exit code 0
```
요약하면 병렬 스트림을 사용하면 많은 양의 입력 요소가있는 스트림에 좋은 성능 향상을 가져올 수 있습니다. 그러나 일부 병렬 스트림 작업 은 순차적으로 실행될 때 필요하지 않은 추가 연산 (결합 연산)이 필요 reduce하고 마음에 드십시오 collect.

또한 모든 병렬 스트림 작업이 동일한 JVM 전체 공통을 공유한다는 것을 알았습니다 ForkJoinPool. 따라서 느린 블로킹 스트림 작업을 구현하지 않으려면 병렬 스트림에 많이 의존하는 응용 프로그램의 다른 부분을 느려질 수 있기 때문입니다.


# 참조
-----
* [java8-stream-tutorial-examples](https://winterbe.com/posts/2014/07/31/java8-stream-tutorial-examples/)
* [java doc Stream](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html)

