---
layout: post
title: "java_annotations"
date: 2019-01-14 10:45 +0900
comments: true
tags : ["java annotations"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## Annotation

Annotation(메타 데이터의 한 형태)은 프로그램 자체에 포함되지 않은 프로그램에 대한 데이터를 제공합니다. 
Annotation은 Annotation이 달린 코드의 작동에 직접적인 영향을 미치지 않습니다.

Annotations에는 다음과 같은 여러 가지 용도가 있습니다.

* Information for the compiler - Annotations은 컴파일러에서 오류를 감지하거나 경고를 표시하는 데 사용할 수 있습니다.
* Compile-time and deployment-time processing - 소프트웨어 도구는 Annotations 정보를 처리하여 코드, XML 파일 등을 생성 할 수 있습니다.
* Runtime processing - 일부 Annotations은 런타임에 검사 할 수 있습니다.

### Annotation의 기본

#### Annotation 형식

가장 간단한 형식은 아래와 같습니다.

```java

@Entity

```

기호문자 @는 컴파일러에게 다음에 오는것이 Annotation임을 나타낸다. 다음은 Override Annotation이다.

```java

@Override
void mySuperMethod() { ... }

```

annotation은 elements를 포함하고 있다. 이름이 있을수도 있고 없을수도 있습니다. 그리고 values 값이 있다.

```java

@Author(
   name = "Benjamin Franklin",
   date = "3/27/2003"
)
class MyClass() { ... }

```
또는 

```java

@SuppressWarnings(value = "unchecked")
void myMethod() { ... }

```
명명 된 elements가 하나 뿐인 경우 value다음과 같이 이름을 생략 할 수 있습니다.

```java

@SuppressWarnings("unchecked")
void myMethod() { ... }

```

어노테이션에 elements가 없으면 이전 @Override예제 와 같이 괄호를 생략 할 수 있습니다 .


동일한 선언에 여러 개의 주석을 사용할 수도 있습니다.

```java

@Author(name = "Jane Doe")
@EBook
class MyClass { ... }

```

주석의 유형이 동일한 경우 반복 주석(repeating annotation)이라고합니다.

```java

@Author(name = "Jane Doe")
@Author(name = "John Smith")
class MyClass { ... }

```

반복적 인 주석은 Java SE 8 릴리스부터 지원됩니다. 자세한 내용은 아래 내용을 참조하십시오

#### annotation을 사용할수 있는곳

어노테이션은 선언에 적용될 수 있습니다 : 클래스, 필드, 메소드 및 기타 프로그램 요소의 선언. 선언문에서 사용될 때, 각 주석은 관습에 따라 자체 라인에서 종종 나타납니다.

Java SE 8 릴리스에서는 주석 을 유형 의 사용 에도 적용 할 수 있습니다. 여기 예시들이 있습니다 :

Class instance 생성 식 :

```java
    new @Interned MyObject();

```

Type cast :

```java

    myString = (@NonNull String) str;


```

implements 절:

```java
 class UnmodifiableList<T> implements
        @Readonly List<@Readonly T> { ... }

```
Thrown exception 절

```java

    void monitorTemperature() throws
        @Critical TemperatureException { ... }

```

위와 같은것을 type annotation이라고 한다.



### Annotation Type 선언

소프트웨어 그룹이 전통적으로 중요한 정보를 제공하는 주석으로 모든 클래스의 본문을 시작한다고 가정 해보십시오.

```java


public class Generation3List extends Generation2List {

   // Author: John Doe
   // Date: 3/17/2002
   // Current revision: 6
   // Last modified: 4/12/2004
   // By: Jane Doe
   // Reviewers: Alice, Bill, Cindy

   // class code goes here

}

```

이 메타 데이터에 주석을 추가하려면 먼저 주석 유형을 정의해야합니다 . 이 작업을 수행하는 구문은 다음과 같습니다.

```java

@interface ClassPreamble {
   String author();
   String date();
   int currentRevision() default 1;
   String lastModified() default "N/A";
   String lastModifiedBy() default "N/A";
   // Note use of array
   String[] reviewers();
}

```

주석 유형 정의는 키워드 interface앞에 at 기호 ( @) (@ = AT, 주석 유형에서와 같이) 가 오는 인터페이스 정의와 유사합니다 . 주석 유형은 인터페이스의 한 형태로 , 이후 강의에서 다룹니다. 지금은 인터페이스를 이해할 필요가 없습니다.

이전의 주석 정의의 본문에는 메소드와 매우 흡사 한 주석 유형 요소 선언이 포함되어 있습니다 . 선택적 기본값을 정의 할 수 있습니다.

주석 유형이 정의 된 후 다음과 같이 값을 채운 해당 유형의 주석을 사용할 수 있습니다.

```java

@ClassPreamble (
   author = "John Doe",
   date = "3/17/2002",
   currentRevision = 6,
   lastModified = "4/12/2004",
   lastModifiedBy = "Jane Doe",
   // Note array notation
   reviewers = {"Alice", "Bob", "Cindy"}
)
public class Generation3List extends Generation2List {

// class code goes here

}


```

주 :@ClassPreamble Javadoc에 의해 생성 된 문서에  정보를 표시하려면 주석을 사용하여 @ClassPreamble정의에 @Documented주석을 달아야합니다.

```java

// import this to use @Documented
import java.lang.annotation.*;

@Documented
@interface ClassPreamble {

   String author();
   String date();
   int currentRevision() default 1;
   String lastModified() default "N/A";
   String lastModifiedBy() default "N/A";
   // Note use of array
   String[] reviewers();
   
}

```

### Predefined Annotation Types

annotation types세트는, Java SE API로 미리 정의되고 있습니다. 일부 주석 유형은 Java 컴파일러에서 사용하고 일부 주석 유형은 다른 주석에 적용됩니다.

#### 자바 언어에서 사용되는 Annotation Types 

에 정의 된 미리 정의 된 주석 유형이 java.lang있다 @Deprecated, @Override하고 @SuppressWarnings.

* @Deprecated - @Deprecated 주석은 표시된 요소가 더 이상 사용되지 않으며 더 이상 사용되지 않아야 함을 나타냅니다 . 
컴파일러는 프로그램이 @Deprecated주석이 있는 메소드, 클래스 또는 필드를 사용할 때마다 경고를 생성합니다 . 
요소가 더 이상 사용되지 @deprecated않으면 다음 예제와 같이 Javadoc 태그를 사용하여 문서화해야합니다 . 
@Javadoc 주석과 주석에서 at 기호 (@)를 사용하는 것은 우연이 아니며 개념적으로 관련되어 있습니다. 또한 Javadoc 태그는 소문자 d로 시작하고 Annotation은 대문자 D로 시작합니다 .

```java

// Javadoc comment follows
    /**
     * @deprecated
     * explanation of why it was deprecated
     */
    @Deprecated
    static void deprecatedMethod() { }

```

* @Override - @Override 주석은 요소가 수퍼 클래스에 선언 된 요소를 무시할 것이라는 것을 컴파일러에 알립니다. 메서드 오버라이드에 대해서는 인터페이스 및 상속 에서 설명 합니다.

```java

 // mark method as a superclass method
   // that has been overridden
   @Override 
   int overriddenMethod() { }

```
메소드를 재정의 할 때이 주석을 사용할 필요는 없지만 오류를 방지하는 데 도움이됩니다. @Override메소드가 해당 수퍼 클래스 중 하나에서 메소드를 올바르게 대체하지 못하면 컴파일러는 오류를 생성합니다.

* @SuppressWarnings - @SuppressWarnings 주석은 달리 생성 할 특정 경고를 억제하도록 컴파일러에 지시합니다. 다음 예제에서는 더 이상 사용되지 않는 메서드가 사용되고 컴파일러는 일반적으로 경고를 생성합니다. 그러나이 경우 주석으로 인해 경고가 표시되지 않습니다.
  
```java

// use a deprecated method and tell 
   // compiler not to generate a warning
   @SuppressWarnings("deprecation")
    void useDeprecatedMethod() {
        // deprecation warning
        // - suppressed
        objectOne.deprecatedMethod();
    }

```
모든 컴파일러 경고는 카테고리에 속합니다. Java 언어 사양에는 두 가지 범주가 나열 deprecation되어 unchecked있습니다. unchecked의 출현 이전에 작성된 레거시 코드와 인터페이스 할 때 경고가 발생할 수 있습니다 제네릭 . 여러 범주의 경고를 표시하지 않으려면 다음 구문을 사용하십시오.

```java

@SuppressWarnings ({ "unchecked", "deprecation"})

```

* @SafeVarargs - @SafeVarargs 어노테이션은 메소드 또는 생성자에 적용될 때 코드가 해당 varargs매개 변수 에서 잠재적으로 안전하지 않은 작업을 수행하지 않는다고 주장합니다 . 이 주석 유형을 사용하면 varargs사용 과 관련된 확인되지 않은 경고 가 표시되지 않습니다.
  

* @FunctionalInterface - Java SE 8에 도입 된 @FunctionalInterface 주석은, 형태 선언이 Java 언어 스펙으로 정의 된 기능 인터페이스가되는 것을 나타냅니다.
  
#### meta-annotations

@Retention - @Retention annotation은 표시된 주석을 저장하는 방법을 지정합니다.

* RetentionPolicy.SOURCE - 표시된 주석은 소스 레벨에서만 유지되며 컴파일러에서 무시됩니다.
* RetentionPolicy.CLASS - 표시된 주석은 컴파일시 컴파일러에 의해 유지되지만 Java Virtual Machine (JVM)에서는 무시됩니다.
* RetentionPolicy.RUNTIME - 표시된 주석은 JVM에 의해 유지되므로 런타임 환경에서 사용할 수 있습니다.

@Documented - @Documented annotation은 지정된 주석이 사용될 때마다 해당 요소가 Javadoc 도구를 사용하여 문서화되어야 함을 나타냅니다. 기본적으로 주석은 Javadoc에 포함되어 있지 않습니다. 자세한 내용은 Javadoc 도구 페이지를 참조하십시오 .

@Target - @Target annotation은 다른 주석을 표시하여 주석을 적용 할 수있는 Java 요소의 종류를 제한합니다. 타겟 주석은 다음 요소 유형 중 하나를 해당 값으로 지정합니다.

* ElementType.ANNOTATION_TYPE 주석 유형에 적용 할 수 있습니다.
* ElementType.CONSTRUCTOR 생성자에 적용 할 수 있습니다.
* ElementType.FIELD 필드 또는 속성에 적용 할 수 있습니다.
* ElementType.LOCAL_VARIABLE 로컬 변수에 적용 할 수 있습니다.
* ElementType.METHOD 메소드 레벨의 주석에 적용 할 수 있습니다.
* ElementType.PACKAGE 패키지 선언에 적용 할 수 있습니다.
* ElementType.PARAMETER 메소드의 매개 변수에 적용 할 수 있습니다.
* ElementType.TYPE 클래스의 모든 요소에 적용 할 수 있습니다


@Inherited - @Inherited annotation은 주석 유형이 수퍼 클래스에서 상속 될 수 있음을 나타냅니다. 사용자가 주석 유형을 쿼리하고 클래스에이 유형에 대한 주석이없는 경우 주석 유형에 대해 클래스의 수퍼 클래스가 쿼리됩니다. 이 주석은 클래스 선언에만 적용됩니다.

@Repeatable - Java SE 8에서 소개 된 Repeatable annotation은 표시된 주석이 동일한 선언이나 형식 사용에 두 번 이상 적용될 수 있음을 나타냅니다. 자세한 내용은 주석 반복을 참조하십시오 .



### Repeating Annotations

동일한 주석을 선언에 적용하거나 사용하려는 경우가 있습니다. Java SE 8 릴리스부터 반복되는 주석을 사용하여이 작업을 수행 할 수 있습니다.

예를 들어 UNIX cron 서비스 와 마찬가지로 특정 시간이나 특정 일정에 따라 메서드를 실행할 수있는 타이머 서비스를 사용하는 코드를 작성하고 있습니다 . 
이제 방법, 실행하는 타이머를 설정할 doPeriodicCleanup, 실행 만들 타이머를 설정하려면 오후 11시 매주 금요일 달과의 마지막 날을, 
@Schedule주석과에 두 번 적용 doPeriodicCleanup의 방법. 첫 번째 사용은 월의 마지막 날을 지정하고 두 번째 사용은 다음 코드 예제와 같이 금요일 오후 11시를 지정합니다.


```java

@Schedule(dayOfMonth="last")
@Schedule(dayOfWeek="Fri", hour="23")
public void doPeriodicCleanup() { ... }

```

이전 예제는 주석을 메소드에 적용합니다. 표준 주석을 사용하는 곳이면 어디서나 주석을 반복 할 수 있습니다. 예를 들어 무단 액세스 예외를 처리하는 클래스가 있습니다. 
@Alert관리자 는 하나의 주석으로, 관리자 는 주석으로 클래스에 주석을 답니다 .

```java

@Alert(role="Manager")
@Alert(role="Administrator")
public class UnauthorizedAccessException extends SecurityException { ... }

```

호환성을 위해 반복되는 주석은 Java 컴파일러에서 자동으로 생성되는 컨테이너 주석에 저장됩니다 . 컴파일러가 이를 수행하려면 코드에 두 가지 선언이 필요합니다.

#### Step 1: Declare a Repeatable Annotation Type

```java

import java.lang.annotation.Repeatable;

@Repeatable(Schedules.class)
public @interface Schedule {
  String dayOfMonth() default "first";
  String dayOfWeek() default "Mon";
  int hour() default 12;
}

```




@Repeatable괄호 안의 meta-annotation 값은 반복 주석을 저장하기 위해 Java 컴파일러가 생성하는 컨테이너 주석의 유형입니다. 이 예제에서 포함 된 주석 유형은 Schedules이므로 반복되는 @Schedule주석은 주석에 저장됩니다 @Schedules.

동일한 주석을 반복적으로 선언하지 않고 선언에 적용하면 컴파일 타임 오류가 발생합니다.


#### Step 2: Declare the Containing Annotation Type

포함하는 주석 유형 value에는 배열 유형 이있는 요소가 있어야합니다 . 배열 유형의 구성 요소 유형은 반복 가능한 주석 유형이어야합니다. Schedules포함하는 주석 형 의 선언 은 다음과 같습니다.


```java

public @interface Schedules {
    Schedule[] value();
}

```

어노테이션 가져 오기
Reflection API에는 주석을 검색하는 데 사용할 수있는 몇 가지 방법이 있습니다. AnnotatedElement.getAnnotation (Class <T>) 등, 단일의 주석을 돌려주는 메소드의 동작은, 요구 된 형태의 주석이 1 개만있는 경우, 단일의 주석만을 돌려 주는 것으로 변경되지 않습니다 . 요청한 유형의 주석이 두 개 이상있는 경우 먼저 컨테이너 주석을 가져 와서 얻을 수 있습니다. 이 방법으로 레거시 코드가 계속 작동합니다. Java SE 8에서는 AnnotatedElement.getAnnotationsByType (Class <T>) 와 같이 여러 개의 주석을 동시에 반환하기 위해 컨테이너 주석을 검사하는 다른 메소드가 도입되었습니다 . AnnotatedElement 보기 모든 사용 가능한 메소드에 대한 정보는 클래스 스펙을 참조하십시오.

디자인 고려 사항
어노테이션 유형을 설계 할 때는 해당 유형의 어노테이션의 카디널리티 를 고려해야합니다 . 주석을 0 번, 한 번 또는 주석 유형이 @Repeatable두 번 이상으로 표시된 경우 사용할 수 있습니다. 또한 @Target메타 주석 을 사용하여 주석 유형을 사용할 수있는 위치를 제한 할 수 있습니다 . 예를 들어 메서드 및 필드에서만 사용할 수있는 반복 가능한 주석 유형을 만들 수 있습니다. 어노테이션을 사용 하는 프로그래머 가 유연하고 강력한 것으로 밝혀 지도록 프로그래머가주의 깊게 주석 유형을 설계하는 것이 중요 합니다.




# 참조
-----
* [annotations tutorial](https://docs.oracle.com/javase/tutorial/java/annotations/)

