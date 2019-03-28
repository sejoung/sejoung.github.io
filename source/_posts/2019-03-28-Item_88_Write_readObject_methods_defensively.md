---
layout: post
title: "아이템 88. readObject 메서드는 방어적으로 작성하라."
date: 2019-03-28 14:33 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 88. readObject 메서드는 방어적으로 작성하라.


```java

package com.github.sejoung.codetest.serialization;

import java.io.Serializable;
import java.util.Date;

public final class Period implements Serializable {

  private Date start;
  private Date end;

  public Period(Date start, Date end) {
    this.start = new Date(start.getTime());
    this.end = new Date(end.getTime());
    if (this.start.compareTo(this.end) > 0) {
      throw new IllegalArgumentException(start + " after " + end);
    }
  }

  public Date start() {
    return new Date(start.getTime());
  }

  public Date end() {
    return new Date(end.getTime());
  }

}


```

위에 코드를 역직렬화 하면 시작일이 종료일보다 늦게 생성 될수도 있다 그것을 방지하기 위해 readObject 메소드를 방어적으로 작성한 경우이다.

```java

package com.github.sejoung.codetest.serialization;

import java.io.IOException;
import java.io.InvalidObjectException;
import java.io.ObjectInputStream;
import java.io.Serializable;
import java.util.Date;

public final class Period implements Serializable {

  private Date start;
  private Date end;

  public Period(Date start, Date end) {
    this.start = new Date(start.getTime());
    this.end = new Date(end.getTime());
    if (this.start.compareTo(this.end) > 0) {
      throw new IllegalArgumentException(start + " after " + end);
    }
  }

  public Date start() {
    return new Date(start.getTime());
  }

  public Date end() {
    return new Date(end.getTime());
  }

  private void readObject(ObjectInputStream s) throws IOException, ClassNotFoundException {
    s.defaultReadObject();
    if (start.compareTo(end) > 0) {
      throw new InvalidObjectException(start + " after " + end);
    }
  }
}

```

```java

package com.github.sejoung.codetest.serialization;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.Date;

public class MutablePeriod {

  private Period period;

  private Date start;

  private Date end;

  public MutablePeriod() {
    try {
      ByteArrayOutputStream bos = new ByteArrayOutputStream();
      ObjectOutputStream out = new ObjectOutputStream(bos);

      // Serialize a valid Period instance
      out.writeObject(new Period(new Date(), new Date()));

      byte[] ref = {0x71, 0, 0x7e, 0, 5}; // Ref #5
      bos.write(ref); // The start field
      ref[4] = 4; // Ref # 4
      bos.write(ref); // The end field

      // Deserialize Period and "stolen" Date references
      ObjectInputStream in = new ObjectInputStream(new ByteArrayInputStream(bos.toByteArray()));
      period = (Period) in.readObject();
      start = (Date) in.readObject();
      end = (Date) in.readObject();
    } catch (Exception e) {
      throw new AssertionError(e);
    }
  }

  public static void main(String[] args) {
    MutablePeriod mp = new MutablePeriod();

    Period p = mp.period;
    Date pEnd = mp.end;

    pEnd.setTime(78);
    System.out.println(p);

    pEnd.setTime(68);
    System.out.println(p);

  }


}

```
실행결과

```

Period(start=Thu Mar 28 14:57:54 KST 2019, end=Thu Jan 01 09:00:00 KST 1970)
Period(start=Thu Mar 28 14:57:54 KST 2019, end=Thu Jan 01 09:00:00 KST 1970)

Process finished with exit code 0

```

위에서 참조를 훔쳐 와서 mp의 데이터를 변경했지만 p에 데이터가 변경되었다 

위에 코드를 좀더 방어적 복사를 사용해서 방어를 하면

```java

package com.github.sejoung.codetest.serialization;

import java.io.IOException;
import java.io.InvalidObjectException;
import java.io.ObjectInputStream;
import java.io.Serializable;
import java.util.Date;
import lombok.ToString;


@ToString
public final class Period implements Serializable {

  private Date start;
  private Date end;

  public Period(Date start, Date end) {
    this.start = new Date(start.getTime());
    this.end = new Date(end.getTime());
    if (this.start.compareTo(this.end) > 0) {
      throw new IllegalArgumentException(start + " after " + end);
    }
  }

  public Date start() {
    return new Date(start.getTime());
  }

  public Date end() {
    return new Date(end.getTime());
  }

  private void readObject(ObjectInputStream s) throws IOException, ClassNotFoundException {
    s.defaultReadObject();
    start = new Date(start.getTime());
    end = new Date(end.getTime());
    if (start.compareTo(end) > 0) {
      throw new InvalidObjectException(start + " after " + end);
    }
  }

}


```

위에 코드를 바꾸고 다시 공격하면

```

Period(start=Thu Mar 28 14:59:46 KST 2019, end=Thu Mar 28 14:59:46 KST 2019)
Period(start=Thu Mar 28 14:59:46 KST 2019, end=Thu Mar 28 14:59:46 KST 2019)

Process finished with exit code 0

```

위에처럼 정상 수행된다.

객체를 역직렬화할 때는 클라이언트가 소유해서는 안되는 객체 참조를 갖는 필드를 모두 반드시 방어적으로 복사해야 된다.


# 참조
-----
* [java serializable specification](https://docs.oracle.com/javase/7/docs/platform/serialization/spec/serialTOC.html)


