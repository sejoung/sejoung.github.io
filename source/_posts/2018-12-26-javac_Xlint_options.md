---
layout: post
title: "java xlint 옵션에 대한 설명"
date: 2018-12-26 10:33 +0900
comments: true
tags : ["java xlint"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### javac Xlint options

xlint 옵션에 대한 설명

실행은  -Xlint:name 으로 하고 name은 아래의 이름중 하나 입니다.

* cast : 불필요한 cast에 대해서 경고를 나타냅니다.

```java

String s = (String) "Hello!"


```

* classfile : 클래스 파일에 대한 문제에 대해 나타냅니다.

* deprecation : deprecated 된것을 사용하면 경고를 나타낸다.
 
 ```java

java.util.Date myDate = new java.util.Date();
int currentDay = myDate.getDay();


```

java.util.Date.getDay 메소드는 since JDK 1.1이후 deprecated 되었다.

* dep-ann : 주석으로 @deprecated 되어 있지만  @Deprecated annotation을 갖지않은것에 대한 경고

```java

/**
  * @deprecated As of Java SE 7, replaced by {@link #newMethod()}
  */
public static void deprecatedMethood() { }
public static void newMethod() { }

```

* divzero : 0으로 나눌려고 할때 경고

```java

int divideByZero = 42 / 0;

```

* empty : if문에서 아무동작을 안할때 경고

```java

class E {
    void m() {
         if (true) ;
    }
}

```

* fallthrough : switch문이 break으로 끝내지 않는 케이스에 대한 경고 

```java

switch (x) { 
case 1 : 
  System.out.println ( "1"); 
  // No break statement here.
case 2 : 
  System.out.println ( "2"); 
}

```

* finally : finally절이 정상적으로 끝나지 않는문제에 대한 경고

```java

public static int m() {
  try {
     throw new NullPointerException();
  }  catch (NullPointerException(); {
     System.err.println("Caught NullPointerException.");
     return 1;
   } finally {
     return 0;
   }
  }


```
컴파일러 finally는이 예제 에서 블록에 대한 경고를 생성합니다 . 때 int메소드가 호출되며, 이것은 0의 값을 반환하는 finally블록이 실행되면 try블록 종료. 이 예에서 컨트롤이 catch블록으로 전송 되면 int메서드가 종료됩니다. 
그러나 finally컨트롤이 메서드 외부로 전송 되었더라도 블록이 실행되어야하므로 실행됩니다.

* overrides : 메서드 재정의와 관련된 문제에 대해 경고합니다. 

```java

public class ClassWithVarargsMethod {
  void varargsMethod(String... s) { }
}

public class ClassWithOverridingMethod extends ClassWithVarargsMethod {
   @Override
   void varargsMethod(String[] s) { }
}

```
아래의 경고가 나타납니다.
```

warning: [override] varargsMethod(String[]) in ClassWithOverridingMethod 
overrides varargsMethod(String...) in ClassWithVarargsMethod; overriding
method is missing '...'

```
위에서는 String... 과 String[]는 틀린것이기 때문에 경고가 나옴

* path : 명령 행에서 유효하지 않은 경로 요소와 존재하지 않는 경로 디렉토리 (클래스 경로, 소스 경로 및 기타 경로와 관련하여)에 대해 경고합니다.

```

javac -Xlint:path -classpath C:\nonexistentpath Example.java

```

* processing : 주석 처리와 관련된 문제에 대해 경고합니다

Source file AnnocProc.java

```java

import java.util.*;
import javax.annotation.processing.*;
import javax.lang.model.*;
import javax.lang.model.element.*;

@SupportedAnnotationTypes("NotAnno")
public class AnnoProc extends AbstractProcessor {
  public boolean process(Set<? extends TypeElement> elems, RoundEnvironment renv){
     return true;
  }

  public SourceVersion getSupportedSourceVersion() {
     return SourceVersion.latest();
   }
}

```

Source file AnnosWithoutProcessors.java
```java

@interface Anno { }
 
@Anno
class AnnosWithoutProcessors { }

```


```

javac AnnoProc.java
javac -cp . -Xlint:processing -processor AnnoProc -proc:only AnnosWithoutProcessors.java


```
경고
```
warning: [processing] No processor claimed any of these annotations: Anno
```

* rawtypes : rawtypes에 사용에 대한 경고를 합니다. 

경고가 나옴
```java

void countElements(List l) { ... }

```

경고가 않나옴
```java

void countElements(List<?> l) { ... }

```

* Serial : serializable classes에서 serialVersionUID 를 정의하지 않으면 경고가 나온다

```java

public class PersistentTime implements Serializable
{
  private Date time;
 
   public PersistentTime() {
     time = Calendar.getInstance().getTime();
   }
 
   public Date getTime() {
     return time;
   }
}

```
경고

```
warning: [serial] serializable class PersistentTime has no definition of
serialVersionUID
```

명시적으로 serialVersionUID를 선언해주는것이 좋다.

* static : static 사용에 대한 경고를 활성화 한다.

```java

class XLintStatic {
    static void m1() { }
    void m2() { this.m1(); }
}

```
경고
```
warning: [static] static method should be qualified by type name, 
XLintStatic, instead of by an expression
```
위에 문제의 해결방법은 

```java

class XLintStatic {
    static void m1() { }
    void m2() { XLintStatic.m1(); }
}

```
또는 

```java

class XLintStatic {
    void m1() { }
    void m2() { this.m1(); }
}

```

* try : 자원사용에 대해서 체크 할려고 함

```java

try ( AutoCloseable ac = getResource() ) {    // do nothing}

```

* unchecked : Java 언어 사양에 의해 규정 된 체크되지 않은 변환 경고에 대한 자세한 내용을 제공합니다

```java

List l = new ArrayList<Number>();
List<String> ls = l;       // unchecked warning

```

* varargs : 변수 arguments ( varargs) 메소드 의 안전하지 않은 사용법 , 특히 검증 불가능한 인수를 포함하는 메소드 에 대해 경고 합니다. 예를 들면 다음과 같습니다.
            

```java

public class ArrayBuilder {
  public static <T> void addToList (List<T> listArg, T... elements) {
    for (T x : elements) {
      listArg.add(x);
    }
  }
}

```
경고

```
warning: [varargs] Possible heap pollution from parameterized vararg type T

```

# 참조
-----
* [javac](https://docs.oracle.com/javase/8/docs/technotes/tools/windows/javac.html)

