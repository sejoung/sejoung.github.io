---
layout: post
title: "동시성(Concurrency) Immutable Objects"
date: 2019-03-25 16:42 +0900
comments: true
tags : ["동시성", "Concurrency", "Immutable Objects", "변경 불가능한 객체", "불변객체 만드는법"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 동시성(Concurrency)

### Immutable Objects

오브젝트 는, 구축 후에 상태를 변경할 수없는 경우, 불변 이라고 보여집니다. 
불변 객체에 대한 최대 의존도는 간단하고 안정적인 코드를 만들기위한 건전한 전략으로 널리 받아 들여지고 있습니다.

변경 불가능한 객체는 동시 응용 프로그램에서 특히 유용합니다. 
상태를 변경할 수 없으므로 스레드 간섭으로 인해 손상되거나 일관성없는 상태로 관찰 될 수 없습니다.

프로그래머는 불변 객체를 사용하는 것을 꺼려합니다. 
왜냐하면 객체를 제자리에서 업데이트하는 것과는 대조적으로 새로운 객체를 만드는 비용에 대해 걱정하기 때문입니다. 
객체 생성의 영향은 과대 평가되는 경우가 많으며, 변경 불가능한 객체와 관련된 몇 가지 효율성으로 인해 상쇄 될 수 있습니다. 
여기에는 가비지 수집으로 인한 오버 헤드 감소 및 변경 가능한 객체를 손상으로부터 보호하는 데 필요한 코드 제거가 포함됩니다.

다음 부절은 인스턴스가 변경 가능하고 불변 인스턴스가있는 클래스를 파생시키는 클래스를 사용합니다. 
그렇게 할 때, 그들은 이런 종류의 변환을위한 일반적인 규칙을 제시하고 불변 객체의 몇 가지 이점을 보여줍니다.

#### A Synchronized Class Example

클래스, SynchronizedRGB는 색상을 나타내는 객체를 정의합니다. 
각 객체는 기본 색상 값을 나타내는 3 개의 정수와 색상 이름을 제공하는 문자열로 색상을 나타냅니다.

```java

package com.github.sejoung.codetest.concurrent.immutableobjects;

public class SynchronizedRGB {

  // Values must be between 0 and 255.
  private int red;
  private int green;
  private int blue;
  private String name;

  public SynchronizedRGB(int red,
      int green,
      int blue,
      String name) {
    check(red, green, blue);
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.name = name;
  }

  private void check(int red, int green, int blue) {
    if (red < 0 || red > 255
        || green < 0 || green > 255
        || blue < 0 || blue > 255) {
      throw new IllegalArgumentException();
    }
  }

  public void set(int red, int green, int blue, String name) {
    check(red, green, blue);
    synchronized (this) {
      this.red = red;
      this.green = green;
      this.blue = blue;
      this.name = name;
    }
  }

  public synchronized int getRGB() {
    return ((red << 16) | (green << 8) | blue);
  }

  public synchronized String getName() {
    return name;
  }

  public synchronized void invert() {
    red = 255 - red;
    green = 255 - green;
    blue = 255 - blue;
    name = "Inverse of " + name;
  }
}

```

SynchronizedRGB 일관성없는 상태로 보이지 않도록 신중하게 사용해야합니다. 
예를 들어 스레드가 다음 코드를 실행한다고 가정 해보십시오.

```java

SynchronizedRGB color =
    new SynchronizedRGB(0, 0, 0, "Pitch Black");
...
int myColorInt = color.getRGB();      //Statement 1
String myColorName = color.getName(); //Statement 2

```
다른 스레드가 color.set명령문 1 다음에 명령문 2를 호출하면 ,myColorName 의 값은의 myColorInt 값과 일치하지 않습니다.
이 결과를 피하려면 두 명령문을 결합해야합니다.

```java

synchronized (color) {
    int myColorInt = color.getRGB();
    String myColorName = color.getName();
} 

```

이러한 종류의 불일치는 변경 가능한 SynchronizedRGB 객체에서만 가능합니다. 
불변의 버전에서는 문제가되지 않습니다.

#### 변경 불가능한 객체를 정의하기위한 전략

다음 규칙은 변경 불가능한 객체를 만드는 간단한 전략을 정의합니다. 
"불변"으로 문서화 된 모든 클래스가 이러한 규칙을 따르는 것은 아닙니다. 
그렇다고해서 반드시이 클래스의 제작자가 엉뚱한 것을 의미하지는 않습니다. 
클래스의 인스턴스가 생성 후에 변경되지 않는다고 믿을만한 충분한 이유가있을 수 있습니다. 
그러나 이러한 전략은 정교한 분석이 필요하며 초보자를위한 것이 아닙니다.

1. 필드에 의해 참조 된 필드 또는 객체를 수정하는 메서드 인 "setter"메서드를 제공하지 마십시오.
1. 모든 필드 final와 private 필드를 확인하십시오.
1. 서브 클래스가 메소드를 오버라이드 (override) 할 수 없게합니다. 가장 간단한 방법은 클래스를로 final 선언하는 것 입니다. 더 정교한 접근법은 생성자를 만들고 private 팩토리 메서드로 인스턴스를 생성하는 것입니다.
1. 인스턴스 필드가 변경 가능한 객체에 대한 참조를 포함하는 경우 해당 객체가 변경되지 않도록하십시오.
    * 변경 가능한 객체를 수정하는 메소드를 제공하지 마십시오.
    * 변경 가능한 객체에 대한 참조를 공유하지 마십시오. 
    생성자에 전달 된 외부의 변경 가능한 객체에 대한 참조를 저장하지 마십시오. 
    필요한 경우 복사본을 만들고 복사본에 대한 참조를 저장합니다. 
    마찬가지로 필요에 따라 내부 변경 가능 객체의 복사본을 만들어 메서드에서 원본을 반환하지 않도록합니다.

이 전략을 SynchronizedRGB 적용 하면 다음 단계가 수행됩니다.

1. 이 클래스에는 두 가지 setter 메소드가 있습니다. 첫 번째 set객체는 임의로 객체를 변형하며 클래스의 수정 불가능 버전에 자리를 갖지 않습니다. 두 번째 invert는 기존 개체를 수정하는 대신 새 개체를 만드는 대신 적용 할 수 있습니다.
1. 모든 필드는 private 이미 있습니다. 그들은 final 더 자격이있다 .
1. 클래스 자체가 선언 final됩니다.
1. 하나의 필드 만 객체를 참조하며, 그 객체는 그 자체로 불변이다. 따라서 "포함 된"변경 가능한 개체의 상태를 변경하는 것에 대한 보호 장치가 필요하지 않습니다.

이러한 변경 후 우리는 ImmutableRGB:

```java

package com.github.sejoung.codetest.concurrent.immutableobjects;

public final class ImmutableRGB {

  // Values must be between 0 and 255.
  private final int red;
  private final int green;
  private final int blue;
  private final String name;

  public ImmutableRGB(int red, int green, int blue, String name) {
    check(red, green, blue);
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.name = name;
  }

  private void check(int red, int green, int blue) {
    if (red < 0 || red > 255
        || green < 0 || green > 255
        || blue < 0 || blue > 255) {
      throw new IllegalArgumentException();
    }
  }

  public int getRGB() {
    return ((red << 16) | (green << 8) | blue);
  }

  public String getName() {
    return name;
  }

  public ImmutableRGB invert() {
    return new ImmutableRGB(255 - red, 255 - green, 255 - blue, "Inverse of " + name);
  }
}


```

# 참조
-----
* [Immutable Objects](https://docs.oracle.com/javase/tutorial/essential/concurrency/immutable.html)




