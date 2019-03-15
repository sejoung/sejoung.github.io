---
layout: post
title: "아이템 22. 인터페이스는 타입을 정의하는 용도로만 사용하라"
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


상수형 인터페이스의 단점

* 그것은 사용되지 않을 수도있는 읽기 전용 변수로 클래스 네임 스페이스 를 오염시킵니다 .
* 받는 사람과는 달리 컴파일시 상수 인터페이스를 구현의 전술 유틸리티 인은 부수적 런타임 유물이 거의 실제적인 목적 (참조,이 마커 인터페이스 도 어떤 방법이 없지만 입니다 실행시 유용).
* 경우 바이너리 코드 호환성은 향후 릴리스에 필요, 상수 인터페이스가 통상적 인 의미에서의 인터페이스로 사용되지 않았음에도 불구하고, 영원히 인터페이스 (이 클래스로 변환 할 수 없습니다)를 유지해야합니다.
* 상수가 어디에서 오는 것인지를 결정하는 IDE가 없으면이를 포함하는 클래스 나 인터페이스로 다시 추적하는 것은 시간이 오래 걸릴 수 있습니다.
* 인터페이스의 변수 (인스턴스를 나타냄)는 구문 적으로 인터페이스 이름 자체보다 유용하지 않습니다 (메소드가 없으므로).
* 개발자가 클래스에 상수를 추가 할 때 구현 된 인터페이스를 확인하지 않거나 새 상수 이름에 오타가 생기지 않으면 상수의 값을 자동 변경할 수 있습니다. 아래 예제 2를 고려하십시오.

예제 2

```java
package com.github.sejoung.codetest.constantinterface;

public interface Constants {

    public static final int	CONSTANT = 1;
}



```

```java

package com.github.sejoung.codetest.constantinterface;

public class Class1 implements Constants {

    public static final int CONSTANT = 2;    // *

    public static void main(String args[]) throws Exception {
        System.out.println(CONSTANT);
    }
}

```
실행결과
```

2

Process finished with exit code 0

```
위에처럼 상수값을 재조정 할수있다.

# 참조
-----
* [Constant_interface](https://en.wikipedia.org/wiki/Constant_interface)
* [What is the best way to implement constants in Java? [closed]](https://stackoverflow.com/questions/66066/what-is-the-best-way-to-implement-constants-in-java)
* [What is the use of interface constants?](https://stackoverflow.com/questions/2659593/what-is-the-use-of-interface-constants)



