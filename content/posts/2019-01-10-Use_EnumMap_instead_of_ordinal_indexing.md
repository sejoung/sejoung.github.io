---
layout: post
title: "아이템 37. ordinal indexing 대신 EnumMap을 사용하라."
date: 2019-01-10 13:30 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 37. ordinal indexing 대신 EnumMap을 사용하라.

```java

package com.github.sejoung.codetest.enumtest;

import java.util.*;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toSet;

// EnumMap을 사용해 열거 타입에 데이터를 연관시키기 (226-228쪽)

// 식물을 아주 단순하게 표현한 클래스 (226쪽)
class Plant {
    enum LifeCycle {ANNUAL, PERENNIAL, BIENNIAL}

    final String name;
    final LifeCycle lifeCycle;

    Plant(String name, LifeCycle lifeCycle) {
        this.name = name;
        this.lifeCycle = lifeCycle;
    }

    @Override
    public String toString() {
        return name;
    }

    public static void main(String[] args) {
        Plant[] garden = {
                new Plant("바질", LifeCycle.ANNUAL),
                new Plant("캐러웨이", LifeCycle.BIENNIAL),
                new Plant("딜", LifeCycle.ANNUAL),
                new Plant("라벤더", LifeCycle.PERENNIAL),
                new Plant("파슬리", LifeCycle.BIENNIAL),
                new Plant("로즈마리", LifeCycle.PERENNIAL)
        };

        // 코드 37-1 ordinal()을 배열 인덱스로 사용 - 따라 하지 말 것! (226쪽)
        Set<Plant>[] plantsByLifeCycleArr =
                (Set<Plant>[]) new Set[Plant.LifeCycle.values().length];
        for (int i = 0; i < plantsByLifeCycleArr.length; i++)
            plantsByLifeCycleArr[i] = new HashSet<>();
        for (Plant p : garden)
            plantsByLifeCycleArr[p.lifeCycle.ordinal()].add(p);
        // 결과 출력
        for (int i = 0; i < plantsByLifeCycleArr.length; i++) {
            System.out.printf("%s: %s%n",
                    Plant.LifeCycle.values()[i], plantsByLifeCycleArr[i]);
        }

    }
}


```
실행결과
```
ANNUAL: [딜, 바질]
PERENNIAL: [라벤더, 로즈마리]
BIENNIAL: [캐러웨이, 파슬리]

Process finished with exit code 0

```

위에 코드에는 문제점이 많다 배열을 사용해서 제네릭을 사용하지도 못했고 그래서 문제가 될 소지들이 있고 앞에서 말했던 잘못된 동작을 할수있는 사항이 많다

이런 상황에서는 EnumMap이 존재한다 EnumMap으로 대체한 코드는 아래와 같다.

```java

package com.github.sejoung.codetest.enumtest;

import java.util.*;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toSet;

// EnumMap을 사용해 열거 타입에 데이터를 연관시키기 (226-228쪽)

// 식물을 아주 단순하게 표현한 클래스 (226쪽)
class Plant {
    enum LifeCycle {ANNUAL, PERENNIAL, BIENNIAL}

    final String name;
    final LifeCycle lifeCycle;

    Plant(String name, LifeCycle lifeCycle) {
        this.name = name;
        this.lifeCycle = lifeCycle;
    }

    @Override
    public String toString() {
        return name;
    }

    public static void main(String[] args) {
        Plant[] garden = {
                new Plant("바질", LifeCycle.ANNUAL),
                new Plant("캐러웨이", LifeCycle.BIENNIAL),
                new Plant("딜", LifeCycle.ANNUAL),
                new Plant("라벤더", LifeCycle.PERENNIAL),
                new Plant("파슬리", LifeCycle.BIENNIAL),
                new Plant("로즈마리", LifeCycle.PERENNIAL)
        };

        // 코드 37-2 EnumMap을 사용해 데이터와 열거 타입을 매핑한다. (227쪽)
        Map<Plant.LifeCycle, Set<Plant>> plantsByLifeCycle =
                new EnumMap<>(Plant.LifeCycle.class);
        for (Plant.LifeCycle lc : Plant.LifeCycle.values())
            plantsByLifeCycle.put(lc, new HashSet<>());
        for (Plant p : garden)
            plantsByLifeCycle.get(p.lifeCycle).add(p);
        System.out.println(plantsByLifeCycle);

    }
}


```
실행결과
```

{ANNUAL=[딜, 바질], PERENNIAL=[라벤더, 로즈마리], BIENNIAL=[캐러웨이, 파슬리]}


Process finished with exit code 0

```

스트림을 사용하면 코드를 줄일수가 있다.

```java

package com.github.sejoung.codetest.enumtest;

import java.util.*;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toSet;

// EnumMap을 사용해 열거 타입에 데이터를 연관시키기 (226-228쪽)

// 식물을 아주 단순하게 표현한 클래스 (226쪽)
class Plant {
    enum LifeCycle {ANNUAL, PERENNIAL, BIENNIAL}

    final String name;
    final LifeCycle lifeCycle;

    Plant(String name, LifeCycle lifeCycle) {
        this.name = name;
        this.lifeCycle = lifeCycle;
    }

    @Override
    public String toString() {
        return name;
    }

    public static void main(String[] args) {
        Plant[] garden = {
                new Plant("바질", LifeCycle.ANNUAL),
                new Plant("캐러웨이", LifeCycle.BIENNIAL),
                new Plant("딜", LifeCycle.ANNUAL),
                new Plant("라벤더", LifeCycle.PERENNIAL),
                new Plant("파슬리", LifeCycle.BIENNIAL),
                new Plant("로즈마리", LifeCycle.PERENNIAL)
        };


        // 코드 37-3 스트림을 사용한 코드 1 - EnumMap을 사용하지 않는다! (228쪽)
        System.out.println(Arrays.stream(garden)
                .collect(groupingBy(p -> p.lifeCycle)));

        // 코드 37-4 스트림을 사용한 코드 2 - EnumMap을 이용해 데이터와 열거 타입을 매핑했다. (228쪽)
        System.out.println(Arrays.stream(garden)
                .collect(groupingBy(p -> p.lifeCycle,
                        () -> new EnumMap<>(LifeCycle.class), toSet())));
    }
}


```
실행결과
```

{ANNUAL=[바질, 딜], BIENNIAL=[캐러웨이, 파슬리], PERENNIAL=[라벤더, 로즈마리]}
{ANNUAL=[딜, 바질], PERENNIAL=[라벤더, 로즈마리], BIENNIAL=[캐러웨이, 파슬리]}

Process finished with exit code 0

```

중첩을 사용한 케이스(ordinal를 사용)

```java

package com.github.sejoung.codetest.enumtest;


public enum Phase {
    SOLID, LIQUID, GAS;
    public enum Transition {

        MELT, FREEZE,
        BOIL, CONDENSE,
        SUBLIME, DEPOSIT;

        private static final Transition[][] TRANSITIONS = {
                {null,MELT,SUBLIME},
                {FREEZE,null,BOIL},
                {DEPOSIT,CONDENSE,null}
        };

        public static Transition from(Phase from, Phase to) {
            return TRANSITIONS[from.ordinal()][to.ordinal()];
        }
    }

    // 간단한 데모 프로그램 - 깔끔하지 못한 표를 출력한다.
    public static void main(String[] args) {
        for (Phase src : Phase.values()) {
            for (Phase dst : Phase.values()) {
                Transition transition = Transition.from(src, dst);
                if (transition != null)
                    System.out.printf("%s에서 %s로 : %s %n", src, dst, transition);
            }
        }
    }
}


```
실행결과
```
SOLID에서 LIQUID로 : MELT 
SOLID에서 GAS로 : SUBLIME 
LIQUID에서 SOLID로 : FREEZE 
LIQUID에서 GAS로 : BOIL 
GAS에서 SOLID로 : DEPOSIT 
GAS에서 LIQUID로 : CONDENSE 

Process finished with exit code 0

```

위에 문제점은 Transition에 추가를 할때 TRANSITIONS 함께 수정하지 않으면 상관관계를 알수가 없다.

그럼 EnumMap으로 수정하면

```java

package com.github.sejoung.codetest.enumtest;

import java.util.EnumMap;
import java.util.Map;
import java.util.stream.Stream;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toMap;

// 코드 37-6 중첩 EnumMap으로 데이터와 열거 타입 쌍을 연결했다. (229-231쪽)
public enum Phase {
    SOLID, LIQUID, GAS;

    public enum Transition {

        MELT(SOLID, LIQUID), FREEZE(LIQUID, SOLID),
        BOIL(LIQUID, GAS), CONDENSE(GAS, LIQUID),
        SUBLIME(SOLID, GAS), DEPOSIT(GAS, SOLID);

        private final Phase from;
        private final Phase to;

        Transition(Phase from, Phase to) {
            this.from = from;
            this.to = to;
        }

        // 상전이 맵을 초기화한다.
        private static final Map<Phase, Map<Phase, Transition>>
                m = Stream.of(values()).collect(groupingBy(t -> t.from,
                () -> new EnumMap<>(Phase.class),
                toMap(t -> t.to, t -> t,
                        (x, y) -> y, () -> new EnumMap<>(Phase.class))));

        public static Transition from(Phase from, Phase to) {
            return m.get(from).get(to);
        }


    }

    // 간단한 데모 프로그램 - 깔끔하지 못한 표를 출력한다.
    public static void main(String[] args) {
        for (Phase src : Phase.values()) {
            for (Phase dst : Phase.values()) {
                Transition transition = Transition.from(src, dst);
                if (transition != null)
                    System.out.printf("%s에서 %s로 : %s %n", src, dst, transition);
            }
        }
    }
}


```
실행결과
```

SOLID에서 LIQUID로 : MELT 
SOLID에서 GAS로 : SUBLIME 
LIQUID에서 SOLID로 : FREEZE 
LIQUID에서 GAS로 : BOIL 
GAS에서 SOLID로 : DEPOSIT 
GAS에서 LIQUID로 : CONDENSE 

Process finished with exit code 0

```

위처럼 짜면 새로 추가 되어도 문제가 없다. 

그럼 추가해 보면

```java

package com.github.sejoung.codetest.enumtest;

import java.util.EnumMap;
import java.util.Map;
import java.util.stream.Stream;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toMap;

// 코드 37-6 중첩 EnumMap으로 데이터와 열거 타입 쌍을 연결했다. (229-231쪽)
public enum Phase {
    // 코드 37-7 EnumMap 버전에 새로운 상태 추가하기 (231쪽)
    SOLID, LIQUID, GAS, PLASMA;
    public enum Transition {
        MELT(SOLID, LIQUID), FREEZE(LIQUID, SOLID),
        BOIL(LIQUID, GAS), CONDENSE(GAS, LIQUID),
        SUBLIME(SOLID, GAS), DEPOSIT(GAS, SOLID),
        IONIZE(GAS, PLASMA), DEIONIZE(PLASMA, GAS);

        private final Phase from;
        private final Phase to;

        Transition(Phase from, Phase to) {
            this.from = from;
            this.to = to;
        }

        // 상전이 맵을 초기화한다.
        private static final Map<Phase, Map<Phase, Transition>>
                m = Stream.of(values()).collect(groupingBy(t -> t.from,
                () -> new EnumMap<>(Phase.class),
                toMap(t -> t.to, t -> t,
                        (x, y) -> y, () -> new EnumMap<>(Phase.class))));

        public static Transition from(Phase from, Phase to) {
            return m.get(from).get(to);
        }


    }

    // 간단한 데모 프로그램 - 깔끔하지 못한 표를 출력한다.
    public static void main(String[] args) {
        for (Phase src : Phase.values()) {
            for (Phase dst : Phase.values()) {
                Transition transition = Transition.from(src, dst);
                if (transition != null)
                    System.out.printf("%s에서 %s로 : %s %n", src, dst, transition);
            }
        }
    }
}


```
실행결과
```
SOLID에서 LIQUID로 : MELT 
SOLID에서 GAS로 : SUBLIME 
LIQUID에서 SOLID로 : FREEZE 
LIQUID에서 GAS로 : BOIL 
GAS에서 SOLID로 : DEPOSIT 
GAS에서 LIQUID로 : CONDENSE 
GAS에서 PLASMA로 : IONIZE 
PLASMA에서 GAS로 : DEIONIZE 

Process finished with exit code 0

```


# 참조
-----
* [Enum ordinal doc](https://docs.oracle.com/javase/8/docs/api/java/lang/Enum.html#ordinal--)



