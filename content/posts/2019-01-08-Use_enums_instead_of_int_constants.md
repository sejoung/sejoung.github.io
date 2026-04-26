---
layout: post
title: "아이템 34. int 상수 대신 열거 타입을 사용하라."
date: 2019-01-08 15:22 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 34. int 상수 대신 열거 타입을 사용하라.

```java

package com.github.sejoung.codetest.enumtest;

public class Constants {
    public static final int APPLE_FUJI           = 0;
    public static final int APPLE_PIPPIN         = 1;
    public static final int APPLE_GRANNY_SMITH   = 2;

    public static final int ORANGE_NAVEL         = 0;
    public static final int ORANGE_TEMPLE        = 1;
    public static final int ORANGE_BLOOD         = 2;
}


```
위에 정수 열거 패턴에는 단점들이 많다. 실제로 오렌지와 사과의 이름이 동일한것이 있으면 같은것을 구분하기 위해 앞에 명칭에 오렌지를 붙혀야 했다.

```java

package com.github.sejoung.codetest.enumtest;

public class OldTest {
    public static void main(String[] args) {

        OldTest ot = new OldTest();

        ot.orangeShow(Constants.ORANGE_BLOOD,Constants.ORANGE_NAVEL,Constants.APPLE_FUJI);

    }

    public void orangeShow(int ...orangeType){
        for (int orange : orangeType){
            System.out.println(orange);
        }
    }
}


```
실행결과
```
2
0
0

Process finished with exit code 0
```

그리고 위에 코드 처럼 오렌지를 보내야 하는 클래스에 사과를 보내도 문제가 생기지 않는다.
 
문자열 상수 패턴은 더 나쁘다. 
문자열 상수 패턴을 쓰면 컴파일 시점에 해당 상수가 String으로 변환되어 수정하려고 하면 컴파일을 다시 해야된다.

이 모든 문제를 해결해주는 것이 열거 타입이다.

```java

package com.github.sejoung.codetest.enumtest;

public enum Orange {
    NAVEL, TEMPLE, BLOOD
}


```

```java

package com.github.sejoung.codetest.enumtest;

public enum Apple {
    FUJI, PIPPIN, GRANNY_SMITH
}


```
```java

package com.github.sejoung.codetest.enumtest;

public class EnumTest {
    public static void main(String[] args) {
        EnumTest et = new EnumTest();

        et.orangeShow(Orange.BLOOD,Orange.TEMPLE);

    }

    public void orangeShow(Orange... orangeType) {
        for (Orange orange : orangeType){
            System.out.println(orange);
        }
    }
}


```

이전에 만들었던 파일을 enum으로 바꾸면 오렌지를 사용하는곳에 사과가 들어갈수가 없다.

데이터와 메서드를 갖는 열거타입도 만들수 있다. 열거타입은 불변이라 모든필드가 final이여야 한다

```java

package com.github.sejoung.codetest.enumtest;

// 코드 34-3 데이터와 메서드를 갖는 열거 타입 (211쪽)
public enum Planet {
    MERCURY(3.302e+23, 2.439e6),
    VENUS  (4.869e+24, 6.052e6),
    EARTH  (5.975e+24, 6.378e6),
    MARS   (6.419e+23, 3.393e6),
    JUPITER(1.899e+27, 7.149e7),
    SATURN (5.685e+26, 6.027e7),
    URANUS (8.683e+25, 2.556e7),
    NEPTUNE(1.024e+26, 2.477e7);

    private final double mass;           // 질량(단위: 킬로그램)
    private final double radius;         // 반지름(단위: 미터)
    private final double surfaceGravity; // 표면중력(단위: m / s^2)

    // 중력상수(단위: m^3 / kg s^2)
    private static final double G = 6.67300E-11;

    // 생성자
    Planet(double mass, double radius) {
        this.mass = mass;
        this.radius = radius;
        surfaceGravity = G * mass / (radius * radius);
    }

    public double mass()           { return mass; }
    public double radius()         { return radius; }
    public double surfaceGravity() { return surfaceGravity; }

    public double surfaceWeight(double mass) {
        return mass * surfaceGravity;  // F = ma
    }
}


```
```java

package com.github.sejoung.codetest.enumtest;

public class WeightTable {
    public static void main(String[] args) {
        double earthWeight = 185;
        double mass = earthWeight / Planet.EARTH.surfaceGravity();
        for (Planet p : Planet.values())
            System.out.printf("%s에서의 무게는 %f이다.%n",
                    p, p.surfaceWeight(mass));
    }
}


```
실행결과
```

MERCURY에서의 무게는 69.912739이다.
VENUS에서의 무게는 167.434436이다.
EARTH에서의 무게는 185.000000이다.
MARS에서의 무게는 70.226739이다.
JUPITER에서의 무게는 467.990696이다.
SATURN에서의 무게는 197.120111이다.
URANUS에서의 무게는 167.398264이다.
NEPTUNE에서의 무게는 210.208751이다.

Process finished with exit code 0

```

```java

package com.github.sejoung.codetest.enumtest;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;
import static java.util.stream.Collectors.toMap;

// 코드 34-6 상수별 클래스 몸체(class body)와 데이터를 사용한 열거 타입 (215-216쪽)
public enum Operation {
    PLUS("+") {
        public double apply(double x, double y) { return x + y; }
    },
    MINUS("-") {
        public double apply(double x, double y) { return x - y; }
    },
    TIMES("*") {
        public double apply(double x, double y) { return x * y; }
    },
    DIVIDE("/") {
        public double apply(double x, double y) { return x / y; }
    };

    private final String symbol;

    Operation(String symbol) { this.symbol = symbol; }

    @Override public String toString() { return symbol; }

    public abstract double apply(double x, double y);

    // 코드 34-7 열거 타입용 fromString 메서드 구현하기 (216쪽)
    private static final Map<String, Operation> stringToEnum =
            Stream.of(values()).collect(
                    toMap(Object::toString, e -> e));

    // 지정한 문자열에 해당하는 Operation을 (존재한다면) 반환한다.
    public static Optional<Operation> fromString(String symbol) {
        return Optional.ofNullable(stringToEnum.get(symbol));
    }

    public static void main(String[] args) {
        double x = 2;
        double y = 4;
        for (Operation op : Operation.values()) {
            System.out.printf("%f %s %f = %f%n", x, op, y, op.apply(x, y));
        }

       Operation.fromString("+").ifPresent((s)->{
           System.out.println(s);
           System.out.println(s.name());
        });



    }
}


```
실행결과
```
2.000000 + 4.000000 = 6.000000
2.000000 - 4.000000 = -2.000000
2.000000 * 4.000000 = 8.000000
2.000000 / 4.000000 = 0.500000
+
PLUS

```


전략 열거 타입 패턴
```java

package com.github.sejoung.codetest.enumtest;
import static  com.github.sejoung.codetest.enumtest.PayrollDay.PayType.*;

// 코드 34-9 전략 열거 타입 패턴 (218-219쪽)
enum PayrollDay {
    MONDAY(WEEKDAY), TUESDAY(WEEKDAY), WEDNESDAY(WEEKDAY),
    THURSDAY(WEEKDAY), FRIDAY(WEEKDAY),
    SATURDAY(WEEKEND), SUNDAY(WEEKEND);
    // (역자 노트) 원서 1~3쇄와 한국어판 1쇄에는 위의 3줄이 아래처럼 인쇄돼 있습니다.
    //
    // MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY,
    // SATURDAY(PayType.WEEKEND), SUNDAY(PayType.WEEKEND);
    //
    // 저자가 코드를 간결하게 하기 위해 매개변수 없는 기본 생성자를 추가했기 때문인데,
    // 열거 타입에 새로운 값을 추가할 때마다 적절한 전략 열거 타입을 선택하도록 프로그래머에게 강제하겠다는
    // 이 패턴의 의도를 잘못 전달할 수 있어서 원서 4쇄부터 코드를 수정할 계획입니다.

    private final PayType payType;

    PayrollDay(PayType payType) { this.payType = payType; }
    // PayrollDay() { this(PayType.WEEKDAY); } // (역자 노트) 원서 4쇄부터 삭제

    int pay(int minutesWorked, int payRate) {
        return payType.pay(minutesWorked, payRate);
    }

    // 전략 열거 타입
    enum PayType {
        WEEKDAY {
            int overtimePay(int minsWorked, int payRate) {
                return minsWorked <= MINS_PER_SHIFT ? 0 :
                        (minsWorked - MINS_PER_SHIFT) * payRate / 2;
            }
        },
        WEEKEND {
            int overtimePay(int minsWorked, int payRate) {
                return minsWorked * payRate / 2;
            }
        };

        abstract int overtimePay(int mins, int payRate);
        private static final int MINS_PER_SHIFT = 8 * 60;

        int pay(int minsWorked, int payRate) {
            int basePay = minsWorked * payRate;
            return basePay + overtimePay(minsWorked, payRate);
        }
    }

    public static void main(String[] args) {
        for (PayrollDay day : values())
            System.out.printf("%-10s%d%n", day, day.pay(8 * 60, 1));
    }
}

```
실행결과
```
MONDAY    480
TUESDAY   480
WEDNESDAY 480
THURSDAY  480
FRIDAY    480
SATURDAY  720
SUNDAY    720

Process finished with exit code 0

```

switch 문을 이용해 원래 열거 타입에 없는 기능을 수행한다. 

```java

package com.github.sejoung.codetest.enumtest;

// 코드 34-10 switch 문을 이용해 원래 열거 타입에 없는 기능을 수행한다. (219쪽)
public class Inverse {
    public static Operation inverse(Operation op) {
        switch(op) {
            case PLUS:   return Operation.MINUS;
            case MINUS:  return Operation.PLUS;
            case TIMES:  return Operation.DIVIDE;
            case DIVIDE: return Operation.TIMES;

            default:  throw new AssertionError("Unknown op: " + op);
        }
    }

    public static void main(String[] args) {
        double x = 2;
        double y = 4;
        for (Operation op : Operation.values()) {
            Operation invOp = inverse(op);
            System.out.printf("%f %s %f %s %f = %f%n",
                    x, op, y, invOp, y, invOp.apply(op.apply(x, y), y));
        }
    }
}


```
실행결과
```

2.000000 + 4.000000 - 4.000000 = 2.000000
2.000000 - 4.000000 + 4.000000 = 2.000000
2.000000 * 4.000000 / 4.000000 = 2.000000
2.000000 / 4.000000 * 4.000000 = 2.000000

Process finished with exit code 0

```
필요한 원소를 컴파일타임에 다 알수 있는 상수 집합이라면 항상 열거 타입을 사용하자


# 참조
-----




