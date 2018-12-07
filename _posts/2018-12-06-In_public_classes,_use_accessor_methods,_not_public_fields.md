---
layout: post
title: "In public classes, use accessor methods, not public fields"
date: 2018-12-06 17:04 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 16. public classes에는 public fields를 사용하지 말고 접근 메소드를 사용해라.

```java

package com.github.sejoung.codetest.accessor;

public class Point {
    public double x;
    public double y;
}


```

```java

package com.github.sejoung.codetest.accessor;

public class PointTest {
    public static void main(String[] args) {
        Point p = new Point();
        p.x = 1;
        p.x = 2;
        System.out.println(p.x+" "+p.y);

    }
}


```

위와 같은 클래스는 public fields를 통해서 접근이 가능하다 하지만 저런식으로 작성하면 캡슐화의 이점을 살리지 못하고
이렇게 되면 클라이언트 코드를 수정하지 않고 해당 정보를 수정할수 없다

그러면 어떻게 해야 되냐면

```java

package com.github.sejoung.codetest.accessor;

public class Point {
    private double x;
    private double y;

    public Point(double x, double y) {
        this.x = x;
        this.y = y;
    }

    public double getX() { return x; }
    public double getY() { return y; }

    public void setX(double x) { this.x = x; }
    public void setY(double y) { this.y = y; }
}


```

```java

package com.github.sejoung.codetest.accessor;

public class PointTest {
    public static void main(String[] args) {
        Point p = new Point(10,9);
        p.setX(1);
        p.setY(2);
        System.out.println(p.getX()+" "+p.getY());

    }
}


```

바꾼 코드에서는 x와 y를 private으로 접근을 제한했고 getter와 setter를 통해서 접근및 수정을 가능하게 해
외부 클라이언트 수정할 필요 없이 로직 수적이 가능하다.

하지만 package-private 클래스나 private 중첩클래스(Nested-Class)라면 데이터 필드를 노출해도 하등에 문제가 없다 
클래스가 표현하고자 하는 추상개념을 잘표현 하면 된다. 

```java

package com.github.sejoung.codetest.accessor;

public class NestedClass {



    public void Test(){
        A a = new A();
        a.a = "1";
    }

    private class A{
        public String a;

    }
}


```

위에서 중첩클래스인 A는 NestedClass에서만 접근이 가능하기 때문에 추상개념을 잘구현하면 문제가 없다는것이다.

```java

package com.github.sejoung.codetest.accessor;

class B {

    public String a;


}


```

위에 package-private 클래스에서는 같은 패키지 내에서만 해당 클래스를 접근하기 때문에 영향이 퍼지는것을 최소화 할수 있다

```java

package com.github.sejoung.codetest.accessor;

// 코드 16-3 불변 필드를 노출한 public 클래스 - 과연 좋은가? (103-104쪽)
public final class Time {
    private static final int HOURS_PER_DAY = 24;
    private static final int MINUTES_PER_HOUR = 60;

    public final int hour;
    public final int minute;

    public Time(int hour, int minute) {
        if (hour < 0 || hour >= HOURS_PER_DAY)
            throw new IllegalArgumentException("Hour: " + hour);
        if (minute < 0 || minute >= MINUTES_PER_HOUR)
            throw new IllegalArgumentException("Min: " + minute);
        this.hour = hour;
        this.minute = minute;
    }

// 나머지 코드 생략
}

```

그러면 위에 클래스처럼 불편 필드는 노출해도 괜찮을까 가변필드보다는 덜 위험하지만 쓸때 없이 불변필드를 노출하면 안된다.


# 참조
-----
