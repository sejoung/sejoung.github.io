---
layout: post
title: "static_factory_method"
date: 2018-11-05 09:49 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 생성자 대신 정적 팩토리 매소드 패턴(static factory method) 사용을 고려 해라

클라이언트가 클래스의 인스턴스를 얻는 수단은 public 생성자 이다.
하지만 프로그래머가 알아 둬야 할 기법이 하나 있는데 그것이 정적 팩토리 매소드 패턴이다.

#### 장점.1 이름을 가질수 있다.

```java

package com.github.sejoung.codetest.staticfactory;

public class Human {

    private String name;
    
    public Human(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
    
}


```

위 클래스에서 인스턴스를 얻는 수단은 생성자를 통해서 얻을수 있다.

```java

package com.github.sejoung.codetest.staticfactory;

public class Test {
    
    public static void main(String[] args) {
        
        Human zolla = new Human("zolla"); 
        System.out.println(zolla.getName());
        
        Human zola = new Human("zola"); 
        System.out.println(zola.getName());
    }

}


```

여기서 정적 팩토리 메소드 패턴을 쓰면 이름을 가질수 있는데

```java

package com.github.sejoung.codetest.staticfactory;

public class Human {

    private String name;
    
    private Human(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
    
    public static Human createZolla() {
        return new Human("zolla");
    }
    
    public static Human createZola() {
        return new Human("zola");
    }
}


```

아래처럼 호출하면 된다.

```java

package com.github.sejoung.codetest.staticfactory;

public class Test {
    
    public static void main(String[] args) {
        
        Human zolla = Human.createZolla(); 
        System.out.println(zolla.getName());
        
        Human zola = Human.createZola(); 
        System.out.println(zola.getName());
    }

}

```

이름을 갖게 되면서 코드에 대한 가독성이 올라갈수 있다.


#### 장점.2 호출 될때 마다 인스턴스를 새로 생성 하지 않다도 된다.

이 덕분에 불변 클래스는 인스턴스를 미리 만들어 놓거나 
새로 생성한 인스턴스를 캐싱하여 재활용하는 식으로 불필요한 사항을 피할수 있다.

예제로는 Boolean.valueOf()를 들수 있는데 코드를 살펴 보면

```java

public final class Boolean implements java.io.Serializable,
                                      Comparable<Boolean>
{
    /**
     * The {@code Boolean} object corresponding to the primitive
     * value {@code true}.
     */
    public static final Boolean TRUE = new Boolean(true);

    /**
     * The {@code Boolean} object corresponding to the primitive
     * value {@code false}.
     */
    public static final Boolean FALSE = new Boolean(false);
    

```

```java

    public static Boolean valueOf(boolean b) {
        return (b ? TRUE : FALSE);
    }

```

위에가 valueOf 메소드인데 Boolean.TRUE/Boolean.FALSE 객체를 상수로 선언 해서 아래의 
valueOf메소드에서 활용하는것 그렇게 되므로 불필요하게 낭비되는 객체를 줄일수있고 이것이
플라이웨이트 패턴(Flyweight pattern)과 비슷하다고 할수있다.

정적 팩토리 메소드 방식은 언제 어느 인스턴스가 살아 있게 할지를 철저히 통제할수 있다.
이런 클래스를 인스턴스 통제(instance-cotrolled) 클래스라고 한다.

인스턴스의 통제하는 이유

* 클래스를 싱글턴으로 만들수 있다.
* 인스턴스화 불가로 만들수 있다.
* 불변 값 클래스에서 동치인 인스턴스가 단하나뿐임을 보장할수 있다(a.equals(b)) 

인스턴스 통제는 플라이웨이트 패턴(Flyweight pattern) 근간이 되면 열거타입은 인스턴스가 하나가 만들어 짐을 보장함


#### 장점.3 반환 타입의 하위 타입 객체를 반환할 수 있는 능력이 있다.

이것은 반환할 객체의 구현을 맘대로 선택할수 있는 장점이 있다. 
API를 만들때 이 유연성을 응용하면 구현 클래스를 공개하지 않고도 그 객체를 반환 할수 있어서 API를 작개 유지 할수 있다.
이는 인터페이스를 정적 팩터리 메서드의 반환타입으로 사용하는 인터페이스 기반 프레임워크를 만드는 핵심기술이다.

아래는 java.util.Collections 의 일부 코드 발췌이다.

```java

  public static <E> List<E> checkedList(List<E> list, Class<E> type) {
        return (list instanceof RandomAccess ?
                new CheckedRandomAccessList<>(list, type) :
                new CheckedList<>(list, type));
    }

```

위에서 보면 checkedList 메소드는 인터페이스인 List를 반환 하지만 구현체는 아래에서 CheckedRandomAccessList인지 CheckedList 인지를 선택해서 반환하게 된다.

그리고 저기 List에 구현체인 CheckedRandomAccessList, CheckedList는 외부에 공개 되지 않고 단하나인 외부 구현체인 Collections를 통해서만 얻을수 있게 했다.
The Collections Framework는 공개하지 않는 클래스 덕분에 API 외형을 줄일수도 있고 프로그래머가 알아야 할 클래스를 줄여 줄수도 있었다.

#### 장점.4 입력 매개변수에 따라 매번 다른 클래스의 객체를 반환 할수 있다.

EnumSet클래스는 정적 팩토리 메소드 패턴으로만 제공하는데

```java

 public static <E extends Enum<E>> EnumSet<E> noneOf(Class<E> elementType) {
        Enum<?>[] universe = getUniverse(elementType);
        if (universe == null)
            throw new ClassCastException(elementType + " not an enum");

        if (universe.length <= 64)
            return new RegularEnumSet<>(elementType, universe);
        else
            return new JumboEnumSet<>(elementType, universe);
    }

```
위 noneOf 메소드를 보면 인자의 원소가 64개 이하면 RegularEnumSet을 반환하고 65개 이상이면 JumboEnumSet을 반환한다.
이런 방법은 버전에 따라서 다른 클래스를 반환해도 문제가 없고 심지어 다음 버전에서 RegularEnumSet을 삭제해도 시스템에 문제가 없다(느슨한 결합)

#### 장점.5 정적 팩터리 매서드를 작성하는 시점에는 반환할 객체의 클래스가 존재 하지 않아도 된다.

이 말의 예제로 jdbc 드라이버를 예제로 들고 있다. 그럼 jdbc 드라이버의 코드를 보면 (DriverManager.getConnection)

```java

  private static Connection getConnection(
        String url, java.util.Properties info, Class<?> caller) throws SQLException {
        /*
         * When callerCl is null, we should check the application's
         * (which is invoking this class indirectly)
         * classloader, so that the JDBC driver class outside rt.jar
         * can be loaded from here.
         */
        ClassLoader callerCL = caller != null ? caller.getClassLoader() : null;
        synchronized(DriverManager.class) {
            // synchronize loading of the correct classloader.
            if (callerCL == null) {
                callerCL = Thread.currentThread().getContextClassLoader();
            }
        }

        if(url == null) {
            throw new SQLException("The url cannot be null", "08001");
        }

        println("DriverManager.getConnection(\"" + url + "\")");

        // Walk through the loaded registeredDrivers attempting to make a connection.
        // Remember the first exception that gets raised so we can reraise it.
        SQLException reason = null;

        for(DriverInfo aDriver : registeredDrivers) {
            // If the caller does not have permission to load the driver then
            // skip it.
            if(isDriverAllowed(aDriver.driver, callerCL)) {
                try {
                    println("    trying " + aDriver.driver.getClass().getName());
                    Connection con = aDriver.driver.connect(url, info);
                    if (con != null) {
                        // Success!
                        println("getConnection returning " + aDriver.driver.getClass().getName());
                        return (con);
                    }
                } catch (SQLException ex) {
                    if (reason == null) {
                        reason = ex;
                    }
                }

            } else {
                println("    skipping: " + aDriver.getClass().getName());
            }

        }

        // if we got here nobody could connect.
        if (reason != null)    {
            println("getConnection failed: " + reason);
            throw reason;
        }

        println("getConnection: no suitable driver found for "+ url);
        throw new SQLException("No suitable driver found for "+ url, "08001");
    }


public static synchronized void registerDriver(java.sql.Driver driver,
        DriverAction da)
    throws SQLException {

    /* Register the driver if it has not already been added to our list */
    if(driver != null) {
        registeredDrivers.addIfAbsent(new DriverInfo(driver, da));
    } else {
        // This is for compatibility with the original DriverManager
        throw new NullPointerException();
    }

    println("registerDriver: " + driver);

}

``` 

여기서 우리가 가지고 올 Connection 객체가 미리 구현되지 않아도 현제 시점에서 우리는 메소드를 작성하는게 전혀 문제가 없다.
위에 코드에선 registerDriver로 등록하고 등록된 Driver를 런타임시에 찾기 때문에 코드를 작성하는데는 문제가 없다

이런것을 서비스 제공자 프레임워크(service provider framework) 패턴이라고 한다. 비슷한 패턴으로 브릿지 패턴, 의존 객체 주입등이 있다.

위에 부분에서는 java 9의 jisaw 개선 사항과 맞물릴수 있을꺼 같다.

[이클립스에서 jigsaw 코딩하기](https://sejoung.github.io/2018/08/jigsaw_coding_eclipse)
[인텔리제이에서 jigsaw 코딩하기](https://sejoung.github.io/2018/08/jigsaw_coding_intellij)

#### 단점.1 상속을 하려면 public이나 protected 생성자가 필요하니 정적 팩토리 매소드만 제공하면 하위 클래스를 만들수 없다.

정적 팩토리 메소드만 제공하면 상속을 받을수 없다. 

#### 단점.2 정적 팩터리 매서드는 프로그래머가 찾기 어렵다.

생성자는 java doc에서 자세히 설명 하지만 팩터리 메서드는 프로그래머가 찾기 힘들다.(상세 설명이 잘 나오지 않는다.) 

아래 이미지를 보면 생성자에 대한 설명이 나와 있다

![java doc](https://sejoung.github.io/images/2018_11_05_01.jpg){: width="100%"}{: .center}

그래서 설명을 잘 해줘야 하고 널리 알려진 이름으로 이름을 정하는게 좋다. 문서화를 잘할수 있는 방법이 나오면 좋겠다.

아래는 spring boot에서 정적팩토리 패턴을 설명하고 있는 doc이다 이렇게 자세히 달아야 되고 위 생성자 처럼 따로 써머리 되어서 
볼수 있음 좋겠다.

![spring doc](https://sejoung.github.io/images/2018_11_05_02.jpg){: width="100%"}{: .center}


#### 정적 팩터리 매서드 패턴에서 흔히 사용하는 명명규칙

* from : 매개변수를 하나 받아서 해당 타입의 인스턴스를 반환하는 형변환 메소드(Date.from)
 
```java

   public static Date from(Instant instant) {
        try {
            return new Date(instant.toEpochMilli());
        } catch (ArithmeticException ex) {
            throw new IllegalArgumentException(ex);
        }
    }


```

* of : 여러 매개변수를 받아 적합한 타입의 인스턴스를 반환하는 집계 메소드(EnumSet.of)

```java

    public static <E extends Enum<E>> EnumSet<E> of(E e1, E e2, E e3) {
        EnumSet<E> result = noneOf(e1.getDeclaringClass());
        result.add(e1);
        result.add(e2);
        result.add(e3);
        return result;
    }

```

* valueOf : from 과 of의 더 자세한 버전(String.valueOf)

```java

    public static String valueOf(boolean b) {
        return b ? "true" : "false";
    }

```

* instance 혹은 getInstance : instance 혹은 getInstance 매개변수를 받는다면 매개 변수로 명시한 인스턴스를 반환 하지만 같은 인스턴스임을 보장하지 않는다.(Calendar.getInstance)

```java

    public static Calendar getInstance()
    {
        return createCalendar(TimeZone.getDefault(), Locale.getDefault(Locale.Category.FORMAT));
    }

```
* create 혹은 newInstance : instance 혹은 getInstance와 같지만 매번 새로운 인스턴스 반환을 보장함.(Array.newInstance)

```java

    public static Object newInstance(Class<?> componentType, int length)
        throws NegativeArraySizeException {
        return newArray(componentType, length);
    }

```

* getType : getInstance와 같으나, 생성할 클래스가 아닌 다른 클래스에 팩토리 메서드를 정의 할때 쓴다.(Files.getFileStore)

```java

    public static FileStore getFileStore(Path path) throws IOException {
        return provider(path).getFileStore(path);
    }

```

* newType : newInstance와 같으나, 생성할 클래스가 아닌 다른 클래스에 팩토리 메서드를 정의 할때 쓴다.(Files.newBufferedReader)

```java

    public static BufferedReader newBufferedReader(Path path) throws IOException {
        return newBufferedReader(path, StandardCharsets.UTF_8);
    }

```

* type : getType 와 newType의 간결한 버전(Collections.list)

```java

    public static <T> ArrayList<T> list(Enumeration<T> e) {
        ArrayList<T> l = new ArrayList<>();
        while (e.hasMoreElements())
            l.add(e.nextElement());
        return l;
    }

```

# 참조 
-----
* [백기선-[이팩티브 자바] #1 생성자 대신 static 팩토리 메소드를 고려해 볼 것](https://www.youtube.com/watch?v=X7RXP6EI-5E)
* [The Collections Framework](https://docs.oracle.com/javase/8/docs/technotes/guides/collections/index.html)