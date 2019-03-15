---
layout: post
title: "Enum Types"
date: 2019-01-08 10:16 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### Enum Types

자바 열거는 상수의 집합을 정의하는 데 사용되는 특수 자바 유형입니다. 보다 정확하게는 Java enum 유형은 특별한 종류의 Java 클래스입니다. 열거 형은 상수, 메소드 등을 포함 할 수 있습니다. 자바 열거 형은 Java 5에 추가되었습니다.

Enum 예제

다음은 간단한 Java enum 예제입니다.

```java

package com.github.sejoung.codetest.enumtest;

public enum Level {
    HIGH,
    MEDIUM,
    LOW
}


```
enum대신 사용되는 키워드 class또는 interface. Java enum키워드는이 유형 정의가 열거 형임을 Java 컴파일러에 알려줍니다.

위의 열거 형에서 상수를 다음과 같이 참조 할 수 있습니다.

```java

package com.github.sejoung.codetest.enumtest;

public class Test {
    public static void main(String[] args) {
        Level level = Level.HIGH;
        System.out.println(level);

    }
}

```
실행결과
```
HIGH

```
#### if 문에 Enum

if-statement에 Java enum을 사용하는 예
 
```java

package com.github.sejoung.codetest.enumtest;

public class Test {
    public static void main(String[] args) {
        Level level = Level.HIGH;
        if (level == Level.HIGH) {
            System.out.println("높다");
        } else if (level == Level.MEDIUM) {
            System.out.println("중간");
        } else if (level == Level.LOW) {
            System.out.println("낮다");
        }

    }
}


``` 
실행결과
```
높다

Process finished with exit code 0

```

#### switch 문에 Enum

```java

package com.github.sejoung.codetest.enumtest;

public class Test {
    public static void main(String[] args) {
        Level level = Level.HIGH;

        switch (level) {
            case HIGH   : System.out.println("switch 높다"); break;
            case MEDIUM : System.out.println("switch 중간"); break;
            case LOW    : System.out.println("switch 낮다"); break;
        }

    }
}


```
실행결과
```
switch 높다

Process finished with exit code 0
```
#### Enum 반복

```java

package com.github.sejoung.codetest.enumtest;

public class Test {
    public static void main(String[] args) {
        for (Level forlevel : Level.values()) {
            System.out.println(forlevel);
        }
    }
}


```
실행결과
```
HIGH
MEDIUM
LOW

Process finished with exit code 0
```

#### Enum toString()

```java

package com.github.sejoung.codetest.enumtest;

public class Test {
    public static void main(String[] args) {

        String levelText = Level.HIGH.toString();
        System.out.println(levelText);

    }
}


```
실행결과
```

HIGH

Process finished with exit code 0

```
#### Enum 출력

```java

package com.github.sejoung.codetest.enumtest;

public class Test {
    public static void main(String[] args) {
        System.out.println(Level.HIGH);
    }
}


```
실행결과
```
HIGH

Process finished with exit code 0
```

#### Enum valueOf()

```java

package com.github.sejoung.codetest.enumtest;

public class Test {
    public static void main(String[] args) {

        Level levelValueOf = Level.valueOf("HIGH");
        System.out.println(levelValueOf);
    }
}


```

#### Enum Fields

```java

package com.github.sejoung.codetest.enumtest;

public enum Level {
    HIGH  (3),  //calls constructor with value 3
    MEDIUM(2),  //calls constructor with value 2
    LOW   (1)   //calls constructor with value 1
    ; // semicolon needed when fields / methods follow


    private final int levelCode;

    private Level(int levelCode) {
        this.levelCode = levelCode;
    }

}


```
#### Enum Methods
```java

package com.github.sejoung.codetest.enumtest;

public enum Level {
    HIGH  (3),  //calls constructor with value 3
    MEDIUM(2),  //calls constructor with value 2
    LOW   (1)   //calls constructor with value 1
    ; // semicolon needed when fields / methods follow


    private final int levelCode;

    private Level(int levelCode) {
        this.levelCode = levelCode;
    }

    public int getLevelCode() {
        return this.levelCode;
    }
}


```

```java
package com.github.sejoung.codetest.enumtest;

public class Test {
    public static void main(String[] args) {
        Level level = Level.HIGH;
        System.out.println(level.getLevelCode());
    }
}


```
실행결과
```
3

Process finished with exit code 0
```

#### Enum Abstract Methods

```java

package com.github.sejoung.codetest.enumtest.abstracttest;

public enum Level {
    HIGH{
        @Override
        public String asLowerCase() {
            return HIGH.toString().toLowerCase();
        }
    },
    MEDIUM{
        @Override
        public String asLowerCase() {
            return MEDIUM.toString().toLowerCase();
        }
    },
    LOW{
        @Override
        public String asLowerCase() {
            return LOW.toString().toLowerCase();
        }
    };

    public abstract String asLowerCase();
}

```
```java

package com.github.sejoung.codetest.enumtest.abstracttest;

public class Test {
    public static void main(String[] args) {
        String lowLevelText = Level.HIGH.asLowerCase();
        System.out.println(lowLevelText);
    }
}


```
실행결과
```
high

Process finished with exit code 0
```

#### Enum Implementing Interface

```java

package com.github.sejoung.codetest.enumtest.interfacetest;

public interface MyInterface {
    public String getDescription();
}


```

```java

package com.github.sejoung.codetest.enumtest.interfacetest;

public enum EnumImplementingInterface implements MyInterface {
    FIRST("First Value"), SECOND("Second Value");

    private String description = null;

    private EnumImplementingInterface(String desc){
        this.description = desc;
    }

    @Override
    public String getDescription() {
        return this.description;
    }
}

```

```java
package com.github.sejoung.codetest.enumtest.interfacetest;

public class Test {
    public static void main(String[] args) {
        MyInterface mi = EnumImplementingInterface.FIRST;
        System.out.println(mi.getDescription());
    }
}

```
실행결과
```
First Value

Process finished with exit code 0
```
#### EnumSet

```java

package com.github.sejoung.codetest.enumtest;

import java.util.EnumSet;

public class Test {
    public static void main(String[] args) {
        EnumSet<Level> enumSet = EnumSet.of(Level.HIGH, Level.MEDIUM);

        for(Level enumLevael : enumSet){
            System.out.println(enumLevael);
        }


    }
}


```
실행결과
```
HIGH
MEDIUM

Process finished with exit code 0
```

#### EnumMap

```java

package com.github.sejoung.codetest.enumtest;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;

public class Test {
    public static void main(String[] args) {
      
        Map<Level, String> enumMap = new EnumMap<>(Level.class);
        enumMap.put(Level.HIGH  , "High level");
        enumMap.put(Level.MEDIUM, "Medium level");
        enumMap.put(Level.LOW   , "Low level");

        String levelValue = enumMap.get(Level.HIGH);

        System.out.println(levelValue);


    }
}


```
실행결과
```
High level

Process finished with exit code 0
```
#### Enum 세부정보

Java 열거 형은 java.lang.Enum클래스를 암시 적으로 extend  하므로 열거 형에서 다른 클래스를 extend 할 수 없습니다.

Java enum에 필드와 메소드가 포함되어 있으면 필드와 메소드의 정의가 항상 enum의 상수 목록 뒤에 와야합니다 . 또한 열거 형 상수 목록은 세미콜론으로 끝나야합니다.

# 참조
-----
* [javase enums](https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html)
* [jenkov enums](http://tutorials.jenkov.com/java/enums.html)


