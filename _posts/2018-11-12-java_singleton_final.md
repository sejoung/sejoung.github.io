---
layout: post
title: "java_singleton_final"
date: 2018-11-12 11:55 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### private 생성자나 열거 타입으로 싱글턴임을 보장하라

#### final 키워드로 싱글톤임을 보장함

```java

package com.github.sejoung.codetest.singleton;

import java.io.Serializable;

class OldSingleton implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = -4253142440722917903L;
    // compile-time constant
    final static String NAME = new String("OldSingleton");
    // run-time constant
    // final static String NAME = new String("OldSingleton");
    final static OldSingleton INSTANCE = new OldSingleton();

    private OldSingleton() {
        System.out.println("hi");
    }

}


```
위에 코드는 기본적으로 final 키워드로 싱글톤임을 보장한다. 

#### 정적 팩토리 패턴으로 싱글턴임을 보장 

```java

package com.github.sejoung.codetest.singleton;

import java.io.Serializable;

class OldSingleton implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = -4253142440722917903L;
    // compile-time constant
    final static String NAME = "OldSingleton";
    // run-time constant
    // final static String NAME = new String("OldSingleton");
    private final static OldSingleton INSTANCE = new OldSingleton();

    private OldSingleton() {
        System.out.println("hi");
    }
    public static OldSingleton getInstance() {
        return INSTANCE;
    }

    
}


```
위에 코드는 싱글톤 구현에 두번째 방법인 정적 팩토리 패턴으로 싱글턴을 구현한 예제이다.

위에 코드들는 문제 점이 있는데

OldSingleton의 INSTANCE를 사용하지 않고 위에 NAME만 사용해도 인스턴스가 생성이 된다.

그단점을 보안한게 Bill Pugh Singleton Implementation인데 

```java

package com.github.sejoung.codetest.singleton;

import java.io.Serializable;

class LazySingleton implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = 2648649688472510437L;
    // compile-time constant
    final static String NAME = "LazySingleton";
    // run-time constant
    // final static String NAME = new String("LazySingleton");

    private final static class LazySingletonHolder {
        private final static LazySingleton INSTANCE = new LazySingleton();
    }

    private LazySingleton() {
        System.out.println("hi");
    }

    public static LazySingleton getInstance() {
        return LazySingletonHolder.INSTANCE;
    }

}


```

위에처럼 Holder를 사용해서 초기화 한다 

위에 코드들은 그럼 싱글톤임을 보장하는가 보장하지 못하는 케이스가 있다. 

그것은 직렬화 하고 복호화 시켰을때 보장하지 못하는 케이스가 있다.

그것을 해결하는 방법으로 readResolve를 구현하는 것이 있다.

위에 코드의 문제점들을 테스트 해보는 코드는 이렇게 작성했다.

```java

package com.github.sejoung.codetest.singleton;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;

public class SingletonTest {

    public static void main(String[] args) {
        
        try {
            System.out.println("1======================");
            System.out.println(OldSingleton.NAME);
            System.out.println("2======================");
            OldSingleton oldSingleton1 = OldSingleton.getInstance();
            System.out.println("3======================");
            OldSingleton oldSingleton2 = OldSingleton.getInstance();
            System.out.println("4======================");
            System.out.println(serializeAndUnSerialize(oldSingleton1) == serializeAndUnSerialize(oldSingleton2));

            System.out.println("1======================");
            System.out.println(LazySingleton.NAME);
            System.out.println("2======================");
            LazySingleton lazySingleton1 = LazySingleton.getInstance();
            System.out.println("3======================");
            LazySingleton lazySingleton2 = LazySingleton.getInstance();
            System.out.println("4======================");
            System.out.println(serializeAndUnSerialize(lazySingleton1) == serializeAndUnSerialize(lazySingleton2));

        } catch (Exception e) {
            e.printStackTrace();
        }
      
    }

    public static <T> T serializeAndUnSerialize(T o) throws Exception {
        
        byte[] serialized;
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            try (ObjectOutputStream oos = new ObjectOutputStream(baos)) {
                oos.writeObject(o);
                serialized = baos.toByteArray();
            }
        }
        
        T unSerialized = null;
        try (ByteArrayInputStream bais = new ByteArrayInputStream(serialized)) {
            try (ObjectInputStream ois = new ObjectInputStream(bais)) {
                Object object = ois.readObject();
                unSerialized = (T) object;
            }
        }
        return unSerialized;
    }

}


```

```

1======================
hi
OldSingleton
2======================
3======================
4======================
false

1======================
LazySingleton
2======================
hi
3======================
4======================
false

Process finished with exit code 0


```

위에 코드에서 보면 시리얼라이즈 했다가 다시 언시리얼라이즈 한코드가 있는데 
그부분에서 싱글톤임을 보장해주지 못하고 있고
레이지 홀더 패턴을 사용하기전에는 생성자가 OldSingleton.NAME하기 전에 생성되는것을 확인할수있다.

위에 문제를 해결하기 위해서 LazySingleton 코드를 조금 수정해보겠다. 

```java

package com.github.sejoung.codetest.singleton;

import java.io.ObjectStreamException;
import java.io.Serializable;

class LazySingleton implements Serializable {
    /**
     *
     */
    private static final long serialVersionUID = 2648649688472510437L;
    // compile-time constant
    final static String NAME = "LazySingleton";
    // run-time constant
    // final static String NAME = new String("LazySingleton");

    private final static class LazySingletonHolder {
        private final static LazySingleton INSTANCE = new LazySingleton();
    }

    private LazySingleton() {
        System.out.println("hi");
    }

    public static LazySingleton getInstance() {
        return LazySingletonHolder.INSTANCE;
    }


    Object readResolve() throws ObjectStreamException {
        return LazySingletonHolder.INSTANCE;
    }


}


```

위에 코드를 보면 readResolve()를 구현했는데 이렇게 구현하고 다시 한번 위에 테스트 코드를 작성 하면 싱글톤임을 보장한다.

```

1======================
hi
OldSingleton
2======================
3======================
4======================
false
1======================
LazySingleton
2======================
hi
3======================
4======================
true

Process finished with exit code 0


```

그리고 private 생성자로 생성자를 잠궈도 호출할수 있는 방법이 존재하는데 java 의 reflect을 통해서 호출할수 있다.

아래는 호출 방법에 대한 코드이다.

```java

package com.github.sejoung.codetest.singleton;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

public class AccessibleObjectTest {
    public static void main(String[] args) throws NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException {

        OldSingleton a1 = OldSingleton.getInstance();

        Constructor<OldSingleton> c = OldSingleton.class.getDeclaredConstructor();

        c.setAccessible(true);

        OldSingleton a2 = c.newInstance();

        System.out.println(a1 == a2);
    }

}


```
위에 코드를 실행해서 보면

```

hi
hi
false

Process finished with exit code 0


```

생성자가 2번 호출이 되고 객체 비교가 false로 나온다.

음 위에 코드의 방어를 한다고 하면 OldSingleton 바꿔야 되는데 간단한 코드를 작성하면

```java

package com.github.sejoung.codetest.singleton;

import java.io.Serializable;

class OldSingleton implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = -4253142440722917903L;

    private static int CNT = 0;


    // compile-time constant
    final static String NAME = new String("OldSingleton");
    // run-time constant
    // final static String NAME = new String("OldSingleton");
    private static OldSingleton INSTANCE = null;

    static {
        try {
            INSTANCE = new OldSingleton();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private OldSingleton() throws Exception {
        if(CNT>0){
            throw new AssertionError();
        }
        System.out.println("hi");

        CNT++;
    }
    public static OldSingleton getInstance() {
        return INSTANCE;
    }


}


```

위처럼 다시 코드를 바꾸고 테스트 코드를 실행 시키면 

```

hi
Exception in thread "main" java.lang.reflect.InvocationTargetException
	at sun.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
	at sun.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:62)
	at sun.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
	at java.lang.reflect.Constructor.newInstance(Constructor.java:423)
	at com.github.sejoung.codetest.singleton.AccessibleObjectTest.main(AccessibleObjectTest.java:15)
Caused by: java.lang.Exception
	at com.github.sejoung.codetest.singleton.OldSingleton.<init>(OldSingleton.java:31)
	... 5 more

Process finished with exit code 1


```
처음 생성자는 정상인데 두번째 부터 익셉션을 만든다.

#### enum으로 싱글톤을 보장

이모든 작업을 하기 어려워서 3번째 enum 클래스를 생성해서 하는게 위에서 말한 코드를 가장 편하게 방어 할수있는 코드이다.

```java

package com.github.sejoung.codetest.singleton;

public enum EnumSingleton {
    INSTANCE;

    public void test() {
        System.out.println("test");
    }
}


```
위처럼 만들면 위에서 처리 했던내용을 가장 간단하게 구현할수 있다.

단점은 enum 외 다른클래스를 상속받지 못한다.

extends는 안되고 implements는 가능함


# 참조
-----
* [Object Input Classes jdk 8 doc](https://docs.oracle.com/javase/8/docs/platform/serialization/spec/input.html)
* [java-serialization-readobject-vs-readresolve](https://stackoverflow.com/questions/1168348/java-serialization-readobject-vs-readresolve)

