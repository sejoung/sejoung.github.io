---
layout: post
title: "아이템 82. 스레드 안정성 수준을 문서화 하라."
date: 2019-03-27 10:10 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 82. 스레드 안정성 수준을 문서화 하라.

메서드 선언에 synchronized 한정자를 선언할지는 구현 이슈일뿐 API에 속하진 않는다.

멀티스레드 환경에서도 API를 안전하게 사용하게 하려면 클래스가 지원하는 스레드 안정성 수준을 정확히 명시해야 한다.

스레드 안정성 수준이 높은순으로 나열한 목록

* 불변 : 이 클래스는 마치 상수와 같아서 외부 동기화도 필요없다.(String, Long)
* 무조건적 스레드 안전 : 이 클래스의 인스턴스는 수정될 수 있으나, 내부에서 충실히 동기화하여 별도의 외부 동기화 없이 동시에 사용해도 괜찮다.(ConcurrentHashMap, AtomicLong)
* 조건부 스레드 안전 : 무조건적 스레드 안전과 같으나 일부 메서드는 외부 동기화가 필요하다.
* 스레드 안전 하지 않음 : 이 클래스의 인스턴스는 수정될 수 있다. 동시에 사용하려면 외부 동기화 메커니즘으로 감싸야 된다.(ArrayList, HashMap)
* 스레드 적대적 : 이 클래스는 모든 메서드 호출은 외부 동기화로 감싸더라도 멀티스레드 환경에서 안전하지 않다.

```java

  private final Object o1 = new Object();

  public void test1() {
    synchronized (o1) {
      System.out.println("test1");
    }
  }

```

락 필드는 항상 final 선언하라.


# 참조
-----




