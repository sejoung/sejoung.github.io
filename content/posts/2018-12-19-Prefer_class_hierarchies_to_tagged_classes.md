---
layout: post
title: "아이템 23. 테그달린 클래스보다 클래스 계층구조를 활용하라."
date: 2018-12-19 11:48 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 이펙티브 자바

### 아이템 23. 테그달린 클래스보다 클래스 계층구조를 활용하라.

테그 달린 클래스의 단점은

* 여러 구현이 하나의 클래스에 담겨서 장황하고 오류를 내기 쉬우며 비효율 적이다.
* 테그 달린 구조는 클래스 계층구조의 아류일뿐이다.

```java

package com.github.sejoung.codetest.tags.taggedclass;

// 코드 23-1 태그 달린 클래스 - 클래스 계층구조보다 훨씬 나쁘다! (142-143쪽)
class Figure {
    enum Shape {RECTANGLE, CIRCLE};

    // 태그 필드 - 현재 모양을 나타낸다.
    final Shape shape;

    // 다음 필드들은 모양이 사각형(RECTANGLE)일 때만 쓰인다.
    double length;
    double width;

    // 다음 필드는 모양이 원(CIRCLE)일 때만 쓰인다.
    double radius;

    // 원용 생성자
    Figure(double radius) {
        shape = Shape.CIRCLE;
        this.radius = radius;
    }

    // 사각형용 생성자
    Figure(double length, double width) {
        shape = Shape.RECTANGLE;
        this.length = length;
        this.width = width;
    }

    double area() {
        switch (shape) {
            case RECTANGLE:
                return length * width;
            case CIRCLE:
                return Math.PI * (radius * radius);
            default:
                throw new AssertionError(shape);
        }
    }
}


```

위에는 테그달린 코드인데 장황하게 쓸때 없는 switch문 그리고 enum등이 들어가게 된다.

계층화 구조로 바꾸면

```java

package com.github.sejoung.codetest.tags.hierarchy;

// 코드 23-2 태그 달린 클래스를 클래스 계층구조로 변환 (144쪽)
abstract class Figure {
    abstract double area();
}


```

abstract 클래스로 구현 하고

```java

package com.github.sejoung.codetest.tags.hierarchy;

// 코드 23-2 태그 달린 클래스를 클래스 계층구조로 변환 (144쪽)
class Circle extends Figure {
    final double radius;

    Circle(double radius) {
        this.radius = radius;
    }

    @Override
    double area() {
        return Math.PI * (radius * radius);
    }
}


```
상속해서 구현

```java

package com.github.sejoung.codetest.tags.hierarchy;

// 코드 23-2 태그 달린 클래스를 클래스 계층구조로 변환 (144쪽)
class Rectangle extends Figure {
    final double length;
    final double width;

    Rectangle(double length, double width) {
        this.length = length;
        this.width = width;
    }

    @Override
    double area() {
        return length * width;
    }
}

```

다시 확장을 해도 

```java

package com.github.sejoung.codetest.tags.hierarchy;

// 태그 달린 클래스를 클래스 계층구조로 변환 (145쪽)
class Square extends Rectangle {
    Square(double side) {
        super(side, side);
    }
}

```


# 참조
-----
