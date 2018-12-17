---
layout: post
title: "Use interfaces only to define types"
date: 2018-12-17 14:06 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

## 이펙티브 자바

### 아이템 22. 인터페이스는 타입을 정의하는 용도로만 사용하라


```java

package com.github.sejoung.codetest.constantinterface;

// 코드 22-1 상수 인터페이스 안티패턴 - 사용금지! (139쪽)
public interface PhysicalConstants {
    // 아보가드로 수 (1/몰)
    static final double AVOGADROS_NUMBER   = 6.022_140_857e23;

    // 볼츠만 상수 (J/K)
    static final double BOLTZMANN_CONSTANT = 1.380_648_52e-23;

    // 전자 질량 (kg)
    static final double ELECTRON_MASS      = 9.109_383_56e-31;
}

```

상수인터페이스 안티패턴은 인터페이스를 잘못 사용한 예다.

java.io.ObjectStreamConstants 등 자바의 상수형 인터페이스

```java

package com.github.sejoung.codetest.constantutilityclass;

// 코드 22-2 상수 유틸리티 클래스 (140쪽)
public class PhysicalConstants {
    private PhysicalConstants() { }  // 인스턴스화 방지

    // 아보가드로 수 (1/몰)
    public static final double AVOGADROS_NUMBER = 6.022_140_857e23;

    // 볼츠만 상수 (J/K)
    public static final double BOLTZMANN_CONST  = 1.380_648_52e-23;

    // 전자 질량 (kg)
    public static final double ELECTRON_MASS    = 9.109_383_56e-31;
}

```

```java

package com.github.sejoung.codetest.constantutilityclass;

import static com.github.sejoung.codetest.constantutilityclass.PhysicalConstants.AVOGADROS_NUMBER;

public class Test {
    double atoms(double mols){
        return AVOGADROS_NUMBER * mols;
    }
    // PhysicalConstants 를 자주사용하면 정적임포트가 좋다.

}


```

상수형 인터페이스를 삼으면 구현체에서 PhysicalConstants.AVOGADROS_NUMBER 이런식으로 접근 하지 않아도 되는데
이것은 import static 으로 해결할수 있다.

# 참조
-----
* [Constant_interface](https://en.wikipedia.org/wiki/Constant_interface)
* [What is the best way to implement constants in Java? [closed]](https://stackoverflow.com/questions/66066/what-is-the-best-way-to-implement-constants-in-java)
* [What is the use of interface constants?](https://stackoverflow.com/questions/2659593/what-is-the-use-of-interface-constants)



