---
layout: post
title: "아이템 50. 적시에 방어적 복사본을 만들어라."
date: 2019-02-14 13:57 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 50. 적시에 방어적 복사본을 만들어라.

클라이언트가 여러분의 불변식을 깨뜨릴려고 혈안이 되있다고 가정하고 방어적으로 프로그래밍 해야 한다.

```java


package com.github.sejoung.codetest.methods;

import java.util.*;

// 코드 50-1 기간을 표현하는 클래스 - 불변식을 지키지 못했다. (302-305쪽)
public final class Period {
    private final Date start;
    private final Date end;

    /**
     * @param  start 시작 시각
     * @param  end 종료 시각. 시작 시각보다 뒤여야 한다.
     * @throws IllegalArgumentException 시작 시각이 종료 시각보다 늦을 때 발생한다.
     * @throws NullPointerException start나 end가 null이면 발생한다.
     */
    public Period(Date start, Date end) {
        if (start.compareTo(end) > 0)
            throw new IllegalArgumentException(
                    start + "가 " + end + "보다 늦다.");
        this.start = start;
        this.end   = end;
    }

    public Date start() {
        return start;
    }
    public Date end() {
        return end;
    }

    public String toString() {
        return start + " - " + end;
    }
}


```
위에 코드는 보면 불변식을 지키는것 같아 그럼 식을 깨뜨리는 방법을 써보면

```java

package com.github.sejoung.codetest.methods;

import java.util.*;

// '불변'인 Period의 내부를 공격하는 두 가지 예 (303-305쪽)
public class Attacks {
    public static void main(String[] args) {
        // 코드 50-2 Period 인스턴스의 내부를 공격해보자. (303쪽)
        Date start = new Date();
        Date end = new Date();
        Period p = new Period(start, end);
        end.setYear(78);  // p의 내부를 변경했다!
        System.out.println(p);

        // 코드 50-4 Period 인스턴스를 향한 두 번째 공격 (305쪽)
        start = new Date();
        end = new Date();
        p = new Period(start, end);
        p.end().setYear(78);  // p의 내부를 변경했다!
        System.out.println(p);
    }
}


```
실행결과

```

Thu Feb 14 14:00:33 KST 2019 - Tue Feb 14 14:00:33 KST 1978
Thu Feb 14 14:00:33 KST 2019 - Tue Feb 14 14:00:33 KST 1978

Process finished with exit code 0
```

위에 처럼 참조가 열려 있으므로 생성시점과는 상관 없이 불변식을 깨뜨릴수 있다.

그럼 다시 코드를 고치면

```java

package com.github.sejoung.codetest.methods;

import java.util.Date;

// 코드 50-1 기간을 표현하는 클래스 - 불변식을 지키지 못했다. (302-305쪽)
public final class Period {
    private final Date start;
    private final Date end;


    // 코드 50-3 수정한 생성자 - 매개변수의 방어적 복사본을 만든다. (304쪽)
    public Period(Date start, Date end) {
        this.start = new Date(start.getTime());
        this.end   = new Date(end.getTime());

        if (this.start.compareTo(this.end) > 0)
            throw new IllegalArgumentException(
                    this.start + "가 " + this.end + "보다 늦다.");
    }

    // 코드 50-5 수정한 접근자 - 필드의 방어적 복사본을 반환한다. (305쪽)
    public Date start() {
        return new Date(start.getTime());
    }

    public Date end() {
        return new Date(end.getTime());
    }

    public String toString() {
        return start + " - " + end;
    }

}


```
```java

package com.github.sejoung.codetest.methods;

import java.util.*;

// '불변'인 Period의 내부를 공격하는 두 가지 예 (303-305쪽)
public class Attacks {
    public static void main(String[] args) {
        // 코드 50-2 Period 인스턴스의 내부를 공격해보자. (303쪽)
        Date start = new Date();
        Date end = new Date();
        Period p = new Period(start, end);
        end.setYear(78);  // p의 내부를 변경했다!
        System.out.println(p);

        // 코드 50-4 Period 인스턴스를 향한 두 번째 공격 (305쪽)
        start = new Date();
        end = new Date();
        p = new Period(start, end);
        p.end().setYear(78);  // p의 내부를 변경했다!
        System.out.println(p);
    }
}


```
실행결과

```

Thu Feb 14 14:08:43 KST 2019 - Thu Feb 14 14:08:43 KST 2019
Thu Feb 14 14:08:43 KST 2019 - Thu Feb 14 14:08:43 KST 2019

Process finished with exit code 0
```

위에 코드처럼 방어적으로 복사를 하여 참조를 통한 공격이 통하지 않게 할수도 있다.

매개변수를 검사하기 전에 방어적 복사본을 만들고 유호성을 검사해야 된다 멀티쓰레드 환경에서 해당 값을 다른쓰레드가 바꿀수도 있어서 이다.

매개변수가 제3자를 통해 확장될수 있다면 clone을 통해 복사본을 만들면 안된다.



# 참조
-----





