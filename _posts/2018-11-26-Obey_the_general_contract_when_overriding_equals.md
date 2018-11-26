---
layout: post
title: "Obey the general contract when overriding equals"
date: 2018-11-26 14:34 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 10. equals는 일반규약을 지켜서 재정의 하라

equals는 재정의 하기 쉬워 보이지만 어렵다. 아래 사항중 하나라도 판단이 되면 재정의 하지 말자

* 각 인스턴스가 본질적으로 고유하다.
* 인스턴스의 논리적 동치성을 검사할일이 없다.
* 상위 클래스에서 재정의한 equals가 하위 클래스에서 들어 맞는다.
* 클래스가 private이거나 package-private 이고 equals를 호출할 일이 없다.

```java

    @Override
    public boolean equals(Object obj) {
        return new AssertionError();//호출금지
    }

```

그럼 equals를 재정의 할때는 언제인가 논리적 동치성을 비교 해야 되는데 값 class에서 논리적 동치성을 비교 하도록 구현되지 않았을때

equals의 일반적 규약은 java.lang.Object의 doc를 보면 되는데 equals 메소드에 정의 되 있다.

```

equals 메서는 동치관계(equivalence relation)를 구현하며, 다음을 만족한다.

* 반사성(reflexivity) : null이 아닌 모든 참조값 x에 대해, x.equals(x)는 true이다
* 대칭성(symmetry) : null이 아닌 모든 참조 값 x,y에 대해, x.equals(y)가 true 이면 y.equals(x) 도 true이다.
* 추이성(transitivity) : null이 아닌 모든 참조 값 x,y,z에 대해, x.equals(y)가 true 이면 y.equals(z)도 true이면 x.equals(z)도 true이다
* 일관성(consistency) : null이 아닌 모든 참조 값 x,y에 대해, x.equals(y) 반복해서 호출하면 항상 true를 반환하거나 항상 false를 반환한다.
* null-아님 : null이 아닌 모든 참조값 x에 대해, x.equals(null)는 false이다

```

반사성은 객체는 자기자신과 같아야 된다라는것이다 이부분은 만족시키지 못하게는 어려울것 같다.

대칭성은 서로에대한 동치여부에 대해 똑같이 답을해야 한다 이다. 

대칭성을 위배하고 있는 샘플 코드를 보겠다.
 
 
```java

package com.github.sejoung.codetest.equals;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class CaseInsensitiveString {
    private final String s;

    public CaseInsensitiveString(String s) {
        this.s = Objects.requireNonNull(s);
    }

    // 대칭성 위배!
    @Override
    public boolean equals(Object o) {
        if (o instanceof CaseInsensitiveString)
            return s.equalsIgnoreCase(
                    ((CaseInsensitiveString) o).s);
        if (o instanceof String)  // 한 방향으로만 작동한다!
            return s.equalsIgnoreCase((String) o);
        return false;
    }

    // 문제 시연 (55쪽)
    public static void main(String[] args) {
        CaseInsensitiveString cis = new CaseInsensitiveString("Polish");
        String s = "polish";
        System.out.println(cis.equals(s));
        System.out.println(s.equals(cis));

        List<CaseInsensitiveString> list = new ArrayList<CaseInsensitiveString>();
        list.add(cis);

        System.out.println(list.contains(s));
    }

}


```

실행 결과

```

true
false
false

Process finished with exit code 0


```

위에 코드를 보면 먼가 잘못 되고 있다고 생각이 들것이다.

```
        if (o instanceof String)  // 한 방향으로만 작동한다!
            return s.equalsIgnoreCase((String) o);
```

위에 코드 때문에 순전히 값만 비교 해서 equals가 구현되어 있다.
그리고 list에서 contains을 했을때 openjdk에서는 false가 나오지만 순전히 구현에 문제라서 문제가 생길수도 있다.

위에 코드를 변경시키면

```java

package com.github.sejoung.codetest.equals;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class CaseInsensitiveString {
    private final String s;

    public CaseInsensitiveString(String s) {
        this.s = Objects.requireNonNull(s);
    }

    // 문제 시연 (55쪽)
    public static void main(String[] args) {
        CaseInsensitiveString cis = new CaseInsensitiveString("Polish");
        String s = "polish";
        System.out.println(cis.equals(s));
        System.out.println(s.equals(cis));

        List<CaseInsensitiveString> list = new ArrayList<CaseInsensitiveString>();
        list.add(cis);

        System.out.println(list.contains(s));
    }

    // 수정한 equals 메서드 (56쪽)
    @Override
    public boolean equals(Object o) {
        return o instanceof CaseInsensitiveString &&
                ((CaseInsensitiveString) o).s.equalsIgnoreCase(s);
    }
}


```

실행결과

```

false
false
false

Process finished with exit code 0

```

위에 처럼 바꿀수 있다. 

추이성은 첫번째 객체와 두번째 객체가 같고 두번째와 세번째 객체가 같으면 첫번째와 세번째 객체는 같아야 된다 이다.

추이성을 위배하는 코드를 작성해보면

```java

package com.github.sejoung.codetest.equals;

public class Point {
    private final int x;
    private final int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Point))
            return false;
        Point p = (Point) o;
        return p.x == x && p.y == y;
    }

    // 아이템 11 참조
    @Override
    public int hashCode() {
        return 31 * x + y;
    }
}


```

```java

package com.github.sejoung.codetest.equals;

public class ColorPoint extends Point {
    private final Color color;

    public ColorPoint(int x, int y, Color color) {
        super(x, y);
        this.color = color;
    }

    // 코드 10-2 잘못된 코드 - 대칭성 위배! (57쪽)
    @Override
    public boolean equals(Object o) {
        if (!(o instanceof ColorPoint))
            return false;
        return super.equals(o) && ((ColorPoint) o).color == color;
    }

    public static void main(String[] args) {
        // 첫 번째 equals 메서드(코드 10-2)는 대칭성을 위배한다. (57쪽)
        Point p = new Point(1, 2);
        ColorPoint cp = new ColorPoint(1, 2, Color.RED);
        System.out.println(p.equals(cp) + " " + cp.equals(p));

        // 두 번째 equals 메서드(코드 10-3)는 추이성을 위배한다. (57쪽)
        ColorPoint p1 = new ColorPoint(1, 2, Color.RED);
        Point p2 = new Point(1, 2);
        ColorPoint p3 = new ColorPoint(1, 2, Color.BLUE);
        System.out.printf("%s %s %s%n",
                p1.equals(p2), p2.equals(p3), p1.equals(p3));
    }
}

```
실행 결과

```

true false
false true false

Process finished with exit code 0

```
위에 코드에서는 대칭성과 추이성을 모두 위반 하고 있다.

그러면 ColorPoint의 equals 메소드를 변경 시켜보면

```java

package com.github.sejoung.codetest.equals;

public class ColorPoint extends Point {
    private final Color color;

    public ColorPoint(int x, int y, Color color) {
        super(x, y);
        this.color = color;
    }


    // 코드 10-3 잘못된 코드 - 추이성 위배! (57쪽)
    @Override public boolean equals(Object o) {
        if (!(o instanceof Point))
            return false;

        // o가 일반 Point면 색상을 무시하고 비교한다.
        if (!(o instanceof ColorPoint))
            return o.equals(this);

        // o가 ColorPoint면 색상까지 비교한다.
        return super.equals(o) && ((ColorPoint) o).color == color;
    }

    public static void main(String[] args) {
        // 첫 번째 equals 메서드(코드 10-2)는 대칭성을 위배한다. (57쪽)
        Point p = new Point(1, 2);
        ColorPoint cp = new ColorPoint(1, 2, Color.RED);
        System.out.println(p.equals(cp) + " " + cp.equals(p));

        // 두 번째 equals 메서드(코드 10-3)는 추이성을 위배한다. (57쪽)
        ColorPoint p1 = new ColorPoint(1, 2, Color.RED);
        Point p2 = new Point(1, 2);
        ColorPoint p3 = new ColorPoint(1, 2, Color.BLUE);
        System.out.printf("%s %s %s%n",
                p1.equals(p2), p2.equals(p3), p1.equals(p3));
    }
}

```
실행결과 

```

true true
true true false

Process finished with exit code 0

```

색상을 무시하는 코드를 넣어서 대칭성에서는 모두 통과 하였지만 추이성에서는 문제가 생겼다.

클래스를 확장해서 상위클래스와 equals 규약을 만족시킬 방법은 존재하지 않는다. 객체지향적 추상화 이점을 포기 하지 않는 한 말이다.

point 클래스를 조금 수정해보면

```java

package com.github.sejoung.codetest.equals;

public class Point {
    private final int x;
    private final int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    // 잘못된 코드 - 리스코프 치환 원칙 위배! (59쪽)
    @Override
    public boolean equals(Object o) {
        if (o == null || o.getClass() != getClass())
            return false;
        Point p = (Point) o;
        return p.x == x && p.y == y;
    }

    // 아이템 11 참조
    @Override
    public int hashCode() {
        return 31 * x + y;
    }
}


```

위에 처럼 수정하고 다시 실행해 보면

```

false false
false false false

Process finished with exit code 0

```

같은 클래스의 비교로만 작동하기 때문에 모두 통과한것 처럼 보인다.
하지만 문제가 있다 ColorPoint도 어디서든 Point로 활용되어야 되기 때문에 잘못되어 있는 함수이다.

위에 상황을 설명하는 예제를 하나 만들어 보겠다.

```java

package com.github.sejoung.codetest.equals;

import java.util.concurrent.atomic.AtomicInteger;

public class CounterPoint extends Point {
    private static final AtomicInteger counter =
            new AtomicInteger();

    public CounterPoint(int x, int y) {
        super(x, y);
        counter.incrementAndGet();
    }

    public static int numberCreated() {
        return counter.get();
    }
}

```

```java

package com.github.sejoung.codetest.equals;

import java.util.Set;

public class CounterPointTest {
    // 단위 원 안의 모든 점을 포함하도록 unitCircle을 초기화한다. (58쪽)
    private static final Set<Point> unitCircle = Set.of(
            new Point( 1,  0), new Point( 0,  1),
            new Point(-1,  0), new Point( 0, -1));

    public static boolean onUnitCircle(Point p) {
        return unitCircle.contains(p);
    }

    public static void main(String[] args) {
        Point p1 = new Point(1,  0);
        Point p2 = new CounterPoint(1,  0);

        // true를 출력한다.
        System.out.println(onUnitCircle(p1));

        // true를 출력해야 하지만, Point의 equals가 getClass를 사용해 작성되었다면 그렇지 않다.
        System.out.println(onUnitCircle(p2));
    }
}

```

재정의 getClass를 통해서 재정이 되면 아래의 코드가 이렇게 된다.

```

true
false

Process finished with exit code 0

```

위에서 보면 unitCircle에 point를 초기화 해서 넣었고 Point의 1,0의 좌표와 하위클래스 CounterPoint의 좌표 1,0을 비교하는것인데
위에는 true가 나와야 되지만 클래스를 비교했기 때문에 false가 나오게 된다.

리스코프 치환의 법칙은 어떤 타입에서 중요한 속성이면 하위타입에도 마찬가지이다. 따라서 그타입에 모든 메소드가 하위타입에서도 똑같이 잘작동해야 된다.

CounterPoint는 Point의 하위 타입이기 때문에 어디서든 Point로 인식될수 있다. 그러므로 모든 메소드가 정상적으로 동작해야된다 위에서는 그것을 위반하고 있다.

구체 클래스의 하위 클래스에서 값을 추가할 방법은 없지만 괜찮은 우회방법이 있다. 상속되신 컴포지션을 사용하라

구현체를 만들어 보겠다.

```java

package com.github.sejoung.codetest.equals;

import java.util.Objects;

public class CompositionColorPoint {
    private final Point point;
    private final Color color;

    public CompositionColorPoint(int x, int y, Color color) {
        point = new Point(x, y);
        this.color = Objects.requireNonNull(color);
    }

    /**
     * 이 ColorPoint의 Point 뷰를 반환한다.
     */
    public Point asPoint() {
        return point;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof CompositionColorPoint))
            return false;
        CompositionColorPoint cp = (CompositionColorPoint) o;
        return cp.point.equals(point) && cp.color.equals(color);
    }

    @Override
    public int hashCode() {
        return 31 * point.hashCode();
    }

    public static void main(String[] args) {

        CompositionColorPoint cp = new CompositionColorPoint(1, 2, Color.RED);
        CompositionColorPoint p1 = new CompositionColorPoint(1, 2, Color.RED);

        System.out.println(p1.equals(cp) + " " + cp.equals(p1));

        Point p2 = new Point(1, 2);
        Point p3 = p1.asPoint();

        System.out.println(p2.equals(p3) + " " + p3.equals(p2));
        System.out.println(p1.equals(p2) + " " + p2.equals(p1));
        

    }


}


```

위에 방법으로 대칭성과 추이성을 만족시킬수도 있다.

일관성 두객체가 같다면 앞으로도 영원히 같아야 된다 이다. 클래스가 불변이든 가변이던 equals 판단에 신뢰할수 없는 자원이 끼어 들게 해서는 안된다.

```java

  @Override
    public boolean equals(Object o) {
       if(o == null)
           return false;
    }

```

위에 처럼 명시적인 null 검사보다는 

```java

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof CompositionColorPoint))
            return false;
        CompositionColorPoint cp = (CompositionColorPoint) o;
        return cp.point.equals(point) && cp.color.equals(color);
    }

```
위처럼 instanceof 사용한 묵시적인 null 검사가 좋다

양질의 equals 메소드를 구현하는 방법은 

1. == 연산자를 사용해 입력이 자기 자신의 참조인지 확인한다.
2. instanceof 연산자로 입력이 올바른 타입인지 확인한다.
3. 입력을 올바른 타입으로 형변환한다.
4. 입력 객체와 자기 자신의 대응되는 핵심 필드들이 모두 일치하는지 하나씩 검사한다.

전형적인 equals의 예

```java

package com.github.sejoung.codetest.equals;

public final class PhoneNumber {
    private final short areaCode, prefix, lineNum;

    public PhoneNumber(int areaCode, int prefix, int lineNum) {
        this.areaCode = rangeCheck(areaCode, 999, "지역코드");
        this.prefix = rangeCheck(prefix, 999, "프리픽스");
        this.lineNum = rangeCheck(lineNum, 9999, "가입자 번호");
    }

    private static short rangeCheck(int val, int max, String arg) {
        if (val < 0 || val > max)
            throw new IllegalArgumentException(arg + ": " + val);
        return (short) val;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof PhoneNumber))
            return false;
        PhoneNumber pn = (PhoneNumber) o;
        return pn.lineNum == lineNum && pn.prefix == prefix
                && pn.areaCode == areaCode;
    }

    // 나머지 코드는 생략 - hashCode 메서드는 꼭 필요하다(아이템 11)!
}


```

많이 실수하는 예

```java

    public boolean equals(Mytype o) {
       
    }

```

위에 코드는 Object의 equals를 재정의 한것이 아니라 다중정의 한것이다 입력타입은 꼭 Object야 한다.

```java

   @Override // 컴파일 실패
   public boolean equals(Mytype o) {
       
    }

```

위에 실수를 줄일수 있게 Override 어너테이션을 사용하자


# 참조
-----
* [Object doc](https://docs.oracle.com/javase/7/docs/api/java/lang/Object.html)