---
layout: post
title: "아이템 90. 직렬화된 인스턴스 대신 직렬화 프록시 사용을 검토하라."
date: 2019-03-28 17:39 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 90. 직렬화된 인스턴스 대신 직렬화 프록시 사용을 검토하라.

직렬화 프록시 패턴의 한계

1. 클라이언트가 멋대로 확장할 수 있는 클래스에는 적용할 수 없다.
1. 객체 그래프에 순환이 있는 클래스에도 적용할 수 없다.

```java

package com.github.sejoung.codetest.serialization.serializationproxy;

// 직렬화 프록시를 사용한 Period 클래스 (479-480쪽)

import java.io.InvalidObjectException;
import java.io.ObjectInputStream;
import java.io.Serializable;
import java.util.Date;

// 방어적 복사를 사용하는 불변 클래스
public final class Period implements Serializable {

  private final Date start;
  private final Date end;

  /**
   * @param start 시작 시각
   * @param end 종료 시각; 시작 시각보다 뒤여야 한다.
   * @throws IllegalArgumentException 시작 시각이 종료 시각보다 늦을 때 발생한다.
   * @throws NullPointerException start나 end가 null이면 발행한다.
   */
  public Period(Date start, Date end) {
    this.start = new Date(start.getTime());
    this.end = new Date(end.getTime());
    if (this.start.compareTo(this.end) > 0) {
      throw new IllegalArgumentException(
          start + "가 " + end + "보다 늦다.");
    }
  }

  public Date start() {
    return new Date(start.getTime());
  }

  public Date end() {
    return new Date(end.getTime());
  }

  public String toString() {
    return start + " - " + end;
  }

  // 직렬화 프록시 패턴용 writeReplace 메서드 (480쪽)
  private Object writeReplace() {
    return new SerializationProxy(this);
  }

  // 직렬화 프록시 패턴용 readObject 메서드 (480쪽)
  private void readObject(ObjectInputStream stream)
      throws InvalidObjectException {
    throw new InvalidObjectException("프록시가 필요합니다.");
  }

  // 코드 90-1 Period 클래스용 직렬화 프록시 (479쪽)
  private static class SerializationProxy implements Serializable {

    private static final long serialVersionUID = 234098243823485285L; // 아무 값이나 상관없다. (아이템 87)
    private final Date start;
    private final Date end;

    SerializationProxy(Period p) {
      this.start = p.start;
      this.end = p.end;
    }
  }
}


```



# 참조
-----



