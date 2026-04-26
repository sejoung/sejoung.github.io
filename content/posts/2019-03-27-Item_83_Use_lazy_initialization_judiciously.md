---
layout: post
title: "아이템 83. 지연 초기화는 신중히 사용하라."
date: 2019-03-27 11:08 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 83. 지연 초기화는 신중히 사용하라.

다른 모든 최적화와 마찬가지로 지연 초기화에 대해 해줄 조언은 필요할때까지 하지마라.

대부분의 상황에서 일반적인 초기화가 지연 초기화 보다 낫다.

`private final FieldType field1 = computeFieldValue();` 인스턴스 필드를 초기화하는 일반적인 방법

```java

  private FieldType field2;
  private synchronized FieldType getField2() {
    if (field2 == null)
      field2 = computeFieldValue();
    return field2;
  }

```

지연 초기화가 초기 순환성을 깨뜨릴 것 같으면 synchronized를 단 접근자를 사용하자.


```java

  // 코드 83-3 정적 필드용 지연 초기화 홀더 클래스 관용구 (443쪽)
  private static class FieldHolder {
    static final FieldType field = computeFieldValue();
  }

  private static FieldType getField() { return FieldHolder.field; }

```

성능 때문에 정적 필드를 지연 초기화해야 한다면 지연 초기화 홀더 클래스 관용구를 사용하자.


```java

  // 코드 83-4 인스턴스 필드 지연 초기화용 이중검사 관용구 (444쪽)
  private volatile FieldType field4;

  private FieldType getField4() {
    FieldType result = field4;
    if (result != null)    // 첫 번째 검사 (락 사용 안 함)
      return result;

    synchronized(this) {
      if (field4 == null) // 두 번째 검사 (락 사용)
        field4 = computeFieldValue();
      return field4;
    }
  }

```

성능 때문에 인스턴스 필드를 지연 초기화해야 한다면 이중검사 관용구를 사용하자.

```java

  private volatile FieldType field5;

  private FieldType getField5() {
    FieldType result = field5;
    if (result == null)
      field5 = result = computeFieldValue();
    return result;
  }

```

단일 검사 관용구로는 초기화가 중복해서 일어날수 있다.


# 참조
-----




