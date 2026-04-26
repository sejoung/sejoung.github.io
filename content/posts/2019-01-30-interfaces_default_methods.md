---
layout: post
title: "인터페이스 default 메소드로 기존 인터페이스를 해치지 않게 확장 하기"
date: 2019-01-30 10:25 +0900
comments: true
tags : ["interface default"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### 인터페이스 default 메소드로 기존 인터페이스를 해치지 않게 확장 하기

```java

package com.github.sejoung.codetest.lamdas;

public interface SimpleInterface {
    public void doSomeWork();
}


```

위에 인터페이스를 상속받아 구현한 케이스

```java

package com.github.sejoung.codetest.lamdas;

public class SimpleInterfaceImpl implements SimpleInterface{
    @Override
    public void doSomeWork() {
        System.out.println("Do Some Work implementation in the class");
    }

    public static void main(String[] args) {
        SimpleInterfaceImpl simpObj = new SimpleInterfaceImpl();
        simpObj.doSomeWork();
    }
}

```
실행결과
```

Do Some Work implementation in the class

Process finished with exit code 0

```

위에 인터페이스에 하나를 추가하면

```java

package com.github.sejoung.codetest.lamdas;

public interface SimpleInterface {
    public void doSomeWork();
    public void doSomeOtherWork();

}


```

상속받은 클래스에서 컴파일 에러가 난다.

```

Class 'SimpleInterfaceImpl' must either be declared abstract or implement abstract method 'doSomeOtherWork()' in 'SimpleInterface'

```

여기서 편하게 추가 할수있는 방법은

```java

package com.github.sejoung.codetest.lamdas;

public interface SimpleInterface {
    public void doSomeWork();
    default public void doSomeOtherWork(){
        System.out.println("DoSomeOtherWork implementation in the interface");
    }
}


```

```java

package com.github.sejoung.codetest.lamdas;

public class SimpleInterfaceImpl implements SimpleInterface{
    @Override
    public void doSomeWork() {
        System.out.println("Do Some Work implementation in the class");
    }

    public static void main(String[] args) {
        SimpleInterfaceImpl simpObj = new SimpleInterfaceImpl();
        simpObj.doSomeWork();
        simpObj.doSomeOtherWork();

    }
}

```
실행결과
```

Do Some Work implementation in the class
DoSomeOtherWork implementation in the interface

Process finished with exit code 0

```

그럼 이런 경우에는 한번 보자

```java

package com.github.sejoung.codetest.lamdas;

public interface InterfaceWithDefaultMethod {
    public void someMethod();
    default public void someOtherMethod(){
        System.out.println("Default method implementation in the interface");
    }
}


```

```java

package com.github.sejoung.codetest.lamdas;

public interface InterfaceWithAnotherDefMethod {
    default public void someOtherMethod(){
        System.out.println("Default method implementation in the interface");
    }
}


```

```java

package com.github.sejoung.codetest.lamdas;

public class DefaultMethodSample implements
        InterfaceWithDefaultMethod, InterfaceWithAnotherDefMethod {

    @Override
    public void someMethod() {
        System.out.println("Some method implementation in the class");
    }

    public static void main(String[] args) {
        DefaultMethodSample def1 = new DefaultMethodSample();
        def1.someMethod();
        def1.someOtherMethod();
    }
}


```
컴파일 메시지
```

D:\repo\codeTestJDK8\src\main\java\com\github\sejoung\codetest\lamdas\DefaultMethodSample.java
Error:(4, 9) java: cannot find symbol
  symbol: class InterfaceWithDefaultMethod
Error:(4, 37) java: cannot find symbol
  symbol: class InterfaceWithAnotherDefMethod
  
```

같은 이름에 동일한 디폴트 메소드가 있을때는 에러메시지를 나타내어 준다

위에 처럼 디폴트 메소드를 사용하면 기존 인터페이스를 해치지 않고 확장 할수 있는 방법이 있다.

# 참조
-----
* [introduction-to-default-methods-defender-methods-in-java-8](https://sanaulla.info/2013/03/20/introduction-to-default-methods-defender-methods-in-java-8/)
