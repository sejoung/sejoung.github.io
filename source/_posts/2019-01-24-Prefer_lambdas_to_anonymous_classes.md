---
layout: post
title: "아이템 42. 익명클래스 보다 람다를 사용하라."
date: 2019-01-24 10:16 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 42. 익명클래스 보다 람다를 사용하라.

jdk 1.1부터 익명클래스를 사용했는데 jdk1.8에서 람다식을 적용하면서 코드를 더 짧게 가지고 갈수 있게 되었다.

자질구래한 코드들은 사라지고 어떻게 동작하는지에 초점을 맞추게 될수 있는 코드가 되었다.

자바에서 함수타입을 표현할때 추상메서드 하나만 담은 인터페이스(드물게는 추상 클래스)를 사용했다.

jdk 1.8에서 아래의 어너테이션이 추가 되면서 함수타입을 표현하게 되었따.

```java

@FunctionalInterface 

```

아래 코드는 Comparator를 익명 클래스에서 람다로 변환 하는것을 보여준다.

```java

package com.github.sejoung.codetest.lamdas;

import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import static java.util.Comparator.*;

import static java.util.Comparator.comparingInt;

// 함수 객체로 정렬하기 (254-255쪽)
public class SortFourWays {
    public static void main(String[] args) {
        List<String> words = Arrays.asList("a","b","c");

        // 코드 42-1 익명 클래스의 인스턴스를 함수 객체로 사용 - 낡은 기법이다! (254쪽)
        Collections.sort(words, new Comparator<String>() {
            public int compare(String s1, String s2) {
                return Integer.compare(s1.length(), s2.length());
            }
        });
        System.out.println(words);
        Collections.shuffle(words);

        // 코드 42-2 람다식을 함수 객체로 사용 - 익명 클래스 대체 (255쪽)
        Collections.sort(words,
                (s1, s2) -> Integer.compare(s1.length(), s2.length()));
        System.out.println(words);
        Collections.shuffle(words);

        // 람다 자리에 비교자 생성 메서드(메서드 참조와 함께)를 사용 (255쪽)
        Collections.sort(words, comparingInt(String::length));
        System.out.println(words);
        Collections.shuffle(words);

        // 비교자 생성 메서드와 List.sort를 사용 (255쪽)
        words.sort(comparingInt(String::length));
        System.out.println(words);
    }
}


```


그럼 기존에 작성했던 아래의 enum 클래스를 함수형으로 변환해보면


```java

package com.github.sejoung.codetest.enumtest;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toMap;

// 코드 34-6 상수별 클래스 몸체(class body)와 데이터를 사용한 열거 타입 (215-216쪽)
public enum Operation {
    PLUS("+") {
        public double apply(double x, double y) {
            return x + y;
        }
    },
    MINUS("-") {
        public double apply(double x, double y) {
            return x - y;
        }
    },
    TIMES("*") {
        public double apply(double x, double y) {
            return x * y;
        }
    },
    DIVIDE("/") {
        public double apply(double x, double y) {
            return x / y;
        }
    };

    private final String symbol;

    Operation(String symbol) {
        this.symbol = symbol;
    }

    @Override
    public String toString() {
        return symbol;
    }

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

        Operation.fromString("+").ifPresent((s) -> {
            System.out.println(s);
            System.out.println(s.name());
        });


    }
}


```

```java

package com.github.sejoung.codetest.lamdas;

import java.util.function.DoubleBinaryOperator;

// 코드 42-4 함수 객체(람다)를 인스턴스 필드에 저장해 상수별 동작을 구현한 열거 타입 (256-257쪽)
public enum Operation {
    PLUS("+", (x, y) -> x + y),
    MINUS("-", (x, y) -> x - y),
    TIMES("*", (x, y) -> x * y),
    DIVIDE("/", (x, y) -> x / y);

    private final String symbol;
    private final DoubleBinaryOperator op;

    Operation(String symbol, DoubleBinaryOperator op) {
        this.symbol = symbol;
        this.op = op;
    }

    @Override
    public String toString() {
        return symbol;
    }

    public double apply(double x, double y) {
        return op.applyAsDouble(x, y);
    }

    // 아이템 34의 메인 메서드 (215쪽)
    public static void main(String[] args) {
        double x = 2;
        double y = 4;
        for (Operation op : Operation.values())
            System.out.printf("%f %s %f = %f%n",
                    x, op, y, op.apply(x, y));
    }
}

```

```java

/*
 * Copyright (c) 2012, 2013, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */
package java.util.function;

/**
 * Represents an operation upon two {@code double}-valued operands and producing a
 * {@code double}-valued result.   This is the primitive type specialization of
 * {@link BinaryOperator} for {@code double}.
 *
 * <p>This is a <a href="package-summary.html">functional interface</a>
 * whose functional method is {@link #applyAsDouble(double, double)}.
 *
 * @see BinaryOperator
 * @see DoubleUnaryOperator
 * @since 1.8
 */
@FunctionalInterface
public interface DoubleBinaryOperator {
    /**
     * Applies this operator to the given operands.
     *
     * @param left the first operand
     * @param right the second operand
     * @return the operator result
     */
    double applyAsDouble(double left, double right);
}


```

위처럼 간결하게 변할수 있는데 이것은 jdk 1.8에 추가된 DoubleBinaryOperator를 활용해서 바꾼것이다.

람다는 이름도 없고 문서화도 못한다. 따라서 코드자체로 동작이 명확하게 설명되지 않거나 코드 라인수가 많아지면 람다를 쓰지 말아야 된다.

람다에서 this는 외부 클래스를 말한다 this를 쓸려고 하면 람다를 사용하면 안된다.

람다에서는 직렬화를 극히 삼가해야 된다.(익명클래스도 마찬가지)

# 참조
-----


