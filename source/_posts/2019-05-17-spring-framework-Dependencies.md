---
layout: post
title: "spring framework The IoC Container"
date: 2019-05-17 14:10 +0900
comments: true
tags : ["spring framework","core","The IoC Container"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## Spring Framework

### Dependencies

일반적인 엔터프라이즈 애플리케이션은 단일 객체 (또는 Spring 용어로는 빈)로 구성되지 않습니다.
가장 단순한 응용 프로그램이라 할지라도 최종 사용자가 일관된 응용 프로그램으로 보는 것을 표현하기 위해 함께 작동하는 몇 가지 개체가 있습니다.
이 다음 섹션에서는 독립 실행 형 Bean 정의의 정의에서 목표 달성을 위해 객체가 협업하는 완전히 실현 된 애플리케이션으로 이동하는 방법에 대해 설명합니다.

#### Dependency Injection

DI (Dependency Injection)는 생성자 인수, 팩토리 메서드에 대한 인수 또는 구성 후 개체 인스턴스에 설정된 속성을 통해서만 개체가 종속성 (즉, 작업하는 다른 개체)을 정의하는 프로세스입니다. 
팩토리 메서드에서 반환됩니다. 
그런 다음 컨테이너는 bean을 작성할 때 이러한 종속성을 주입합니다. 
이 프로세스는 기본적으로 클래스 또는 서비스 로케이터 패턴의 직접 작성을 사용하여 자체 의존성의 인스턴스화 또는 위치를 제어하는 ​​빈 자체의 역전 (따라서 제어의역전을 이룸)입니다.

코드는 DI 원칙을 사용하여보다 명확하며 객체가 종속성을 제공받을 때 디커플링이 더 효과적입니다. 
개체는 종속성을 찾지 않으며 종속성의 위치 나 클래스를 알지 못합니다. 
따라서 종속성이 인터페이스 또는 추상 기본 클래스에있을 때 클래스 테스트가 쉬워 져 단위 테스트에서 스텁 또는 모의 구현을 사용할 수 있습니다.

DI는 크게 두 가지 변종으로 나뉩니다. 
생성자 기반 종속성 주입 과 Setter 기반 종속성 주입 입니다.

##### 생성자 기반 종속성 삽입

생성자 기반 DI는 컨테이너가 여러 종속 변수를 나타내는 여러 개의 인수로 생성자를 호출함으로써 수행됩니다. 
static Bean을 생성하기위한 특정 인수를 가진 팩토리 메소드를 호출하는 것은 거의 동일하며,이 논의는 생성자와 static 팩토리 메소드 에 대한 인수를 유사하게 취급합니다. 
다음 예제는 생성자 삽입으로 만 종속성 주입 될 수있는 클래스를 보여줍니다.

```java

public class SimpleMovieLister {

    // the SimpleMovieLister has a dependency on a MovieFinder
    private MovieFinder movieFinder;

    // a constructor so that the Spring container can inject a MovieFinder
    public SimpleMovieLister(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // business logic that actually uses the injected MovieFinder is omitted...
}


```

이 클래스에는 특별한 것이 없다는 것을 주목하십시오. 
이것은 컨테이너 고유 인터페이스, 기본 클래스 또는 주석에 대한 종속성이없는 POJO입니다.

###### 생성자 인수 해석

생성자 인수 분석은 인수의 유형을 사용하여 수행됩니다. 
bean 정의의 생성자 인수에 잠재적 인 모호성이 없으면 bean 정의에서 생성자 인수가 정의되는 순서는 bean이 인스턴스화 될 때 해당 인수가 적절한 생성자에 제공되는 순서입니다. 
다음 클래스를 고려하십시오.

```java

package x.y;

public class ThingOne {

    public ThingOne(ThingTwo thingTwo, ThingThree thingThree) {
        // ...
    }
}

```

그 가정 ThingTwo및 ThingThree클래스가 상속으로 관련이없는, 잠재적 모호성은 존재하지 않는다. 
따라서 다음 구성이 제대로 작동하므로 생성자 인수 인덱스 나 유형을 명시 적으로 <constructor-arg/> 요소 에 지정할 필요가 없습니다 .

```xml

<beans>
    <bean id="beanOne" class="x.y.ThingOne">
        <constructor-arg ref="beanTwo"/>
        <constructor-arg ref="beanThree"/>
    </bean>

    <bean id="beanTwo" class="x.y.ThingTwo"/>

    <bean id="beanThree" class="x.y.ThingThree"/>
</beans>

```

다른 bean이 참조 될 때, 그 타입은 알려지고 일치가 발생할 수있다 (앞의 예에서와 같이). 
<value>true</value>Spring이 값의 타입을 결정할 수 없기 때문에 간단한 타입이 사용될 때, 도움없이 타입별로 일치시킬 수 없습니다. 
다음 클래스를 고려하십시오.

```java

package examples;

public class ExampleBean {

    // Number of years to calculate the Ultimate Answer
    private int years;

    // The Answer to Life, the Universe, and Everything
    private String ultimateAnswer;

    public ExampleBean(int years, String ultimateAnswer) {
        this.years = years;
        this.ultimateAnswer = ultimateAnswer;
    }
}

```

###### 생성자 인수 유형 일치

앞의 시나리오에서 컨테이너는 type특성 을 사용하여 생성자 인수의 형식을 명시 적으로 지정하면 단순 형식과 일치하는 형식을 사용할 수 있습니다. 
다음 예제와 같이

```xml

<bean id="exampleBean" class="examples.ExampleBean">
    <constructor-arg type="int" value="7500000"/>
    <constructor-arg type="java.lang.String" value="42"/>
</bean>

```

###### 생성자 인수 인덱스

index다음 예제와 같이이 속성을 사용하여 생성자 인수의 인덱스를 명시 적으로 지정할 수 있습니다 .

```xml

<bean id="exampleBean" class="examples.ExampleBean">
    <constructor-arg index="0" value="7500000"/>
    <constructor-arg index="1" value="42"/>
</bean>

```
여러 간단한 값의 모호성을 해결할뿐만 아니라 인덱스를 지정하면 생성자가 동일한 유형의 인수가 두 개인 모호성이 해결됩니다.

```
인덱스는 0부터 시작합니다.

```
###### 생성자 인수 이름

다음 예제와 같이 값 모호성 제거에 생성자 매개 변수 이름을 사용할 수도 있습니다.

```xml

<bean id="exampleBean" class="examples.ExampleBean">
    <constructor-arg name="years" value="7500000"/>
    <constructor-arg name="ultimateAnswer" value="42"/>
</bean>

```

이 기능을 사용하려면 Spring에서 생성자의 매개 변수 이름을 찾을 수 있도록 디버그 플래그를 활성화 한 상태로 코드를 컴파일해야합니다. 
디버그 플래그로 코드를 컴파일 할 수 없거나 컴파일하지 않으려면 @ConstructorProperties JDK 어노테이션을 사용 하여 생성자 인수의 이름을 명시 적으로 지정할 수 있습니다. 
샘플 클래스는 다음과 같이 보일 것입니다 :


```java

package examples;

public class ExampleBean {

    // Fields omitted

    @ConstructorProperties({"years", "ultimateAnswer"})
    public ExampleBean(int years, String ultimateAnswer) {
        this.years = years;
        this.ultimateAnswer = ultimateAnswer;
    }
}

```

###### 세터 기반 의존성 주입

Setter 기반 DI는 static 빈을 인스턴스화하기 위해 인수가없는 생성자 또는 인수가없는 팩토리 메소드를 호출 한 후 bean에서 setter 메소드를 호출하는 컨테이너에 의해 수행됩니다 .

다음 예제에서는 순수한 setter 주입을 사용하여 종속성 주입 만 할 수있는 클래스를 보여줍니다. 
이 클래스는 일반적인 자바입니다. 
이것은 컨테이너 고유의 인터페이스, 기본 클래스 또는 주석에 의존하지 않는 POJO입니다.

```java

public class SimpleMovieLister {

    // the SimpleMovieLister has a dependency on the MovieFinder
    private MovieFinder movieFinder;

    // a setter method so that the Spring container can inject a MovieFinder
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // business logic that actually uses the injected MovieFinder is omitted...
}

```
ApplicationContext가 관리하는 빈에 대한 지원 생성자 기반 및 setter 기반의 DI. 
또한 생성자 방식을 통해 일부 종속성이 이미 주입 된 후에도 setter 기반 DI를 지원합니다. 
종속성을 a 형식으로 구성합니다.
이 형식은 인스턴스 BeanDefinition와 함께 사용하여 PropertyEditor속성을 한 형식에서 다른 형식으로 변환합니다. 
그러나, 대부분의 Spring 사용자가 아니라 XML의와 (즉 프로그램입니다) 직접 이러한 클래스와 함께 작동하지 않습니다 bean 정의, 주석 구성 요소 (즉, 주석 클래스 @Component, @Controller등), 또는 @Bean방법 Java 기반의 @Configuration클래스. 
이 소스는 내부적으로 인스턴스로 변환되어 BeanDefinition전체 Spring IoC 컨테이너 인스턴스를 로드하는 데 사용된다.


```
생성자 기반 또는 세터 기반 DI?

생성자 기반 및 설정자 기반 DI를 혼합 할 수 있으므로 필수 종속성 및 설정자 메서드에 대한 생성자 또는 선택적 종속성에 대한 구성 메서드를 사용하는 것이 좋습니다. 
setter 메소드 에서 @Required 어노테이션을 사용하면 속성을 필수 종속성으로 만들 수 있습니다. 
그러나 인수를 프로그래밍 방식으로 검증하는 생성자 주입이 바람직합니다.

Spring 팀은 일반적으로 애플리케이션 구성 요소를 불변 객체로 구현하고 필요한 종속성을 보장 할 수 없으므로 생성자 삽입을 옹호합니다 null. 
또한 생성자가 주입 한 구성 요소는 완전히 초기화 된 상태에서 항상 클라이언트 (호출) 코드로 반환됩니다. 
부수적으로, 많은 수의 생성자 인수는 나쁜 코드의 냄새이며, 클래스가 너무 많은 책임을 가지고 있으며 적절한 관심을 분리하기 위해 리팩토링되어야 함을 의미합니다.

세터 주입은 주로 클래스 내에서 적절한 기본값을 할당 할 수있는 선택적 종속성에 대해서만 사용해야합니다. 
그렇지 않으면 코드가 종속성을 사용하는 모든 곳에서 null이 아닌 검사를 수행해야합니다. 
setter 주입의 한 가지 이점은 setter 메소드가 해당 클래스의 객체를 재구성하거나 나중에 다시 주입 할 수있게 만드는 것입니다. 
따라서 JMX MBeans 를 통한 관리 는 세터 주입에 대한 매력적인 사용 사례입니다.

특정 클래스에 가장 적합한 DI 스타일을 사용하십시오. 
때로는 소스가없는 제 3 자 클래스를 다룰 때 선택이 이루어집니다. 
예를 들어 제 3 자 클래스가 모든 setter 메소드를 노출하지 않으면 생성자 주입이 유일하게 사용 가능한 DI 형식 일 수 있습니다.

```

###### 종속성 해결 프로세스

컨테이너는 다음과 같이 Bean 의존성 분석을 수행합니다.

* 이 ApplicationContext클래스는 모든 bean을 설명하는 구성 메타 데이터로 작성되고 초기화됩니다. 
구성 메타 데이터는 XML, Java 코드 또는 주석으로 지정할 수 있습니다.

* 각 bean에 대해 종속성은 속성, 생성자 인수 또는 static-factory 메소드에 대한 인수 형식으로 표현됩니다 (일반 생성자 대신 사용하는 경우). 
이러한 종속성은 bean이 실제로 작성 될 때 bean에 제공됩니다.

* 각 특성 또는 생성자 인수는 설정할 값의 실제 정의이거나 컨테이너의 다른 Bean에 대한 참조입니다.

* 값인 각 특성 또는 생성자 인수는 지정된 형식에서 해당 특성 또는 생성자 인수의 실제 유형으로 변환됩니다. 
기본적으로 봄과 같은 모든 내장 타입의 문자열로 제공되는 값을 변환 할 수 있습니다 int, long, String, boolean등, 그리고.

Spring 컨테이너는 컨테이너가 생성 될 때 각 bean의 설정을 검증한다. 
그러나 bean 특성 자체는 bean이 실제로 작성 될 때까지 설정되지 않습니다. 
컨테이너가 생성 될 때 싱글 랭크이며 미리 인스턴스화되도록 설정된 (기본값) 빈이 만들어집니다. 
범위는 Bean Scopes에 정의되어 있습니다. 
그렇지 않으면 Bean은 요청 될 때만 작성됩니다. 
빈의 생성은 잠재적으로 빈의 그래프가 생성되도록합니다. 
빈의 의존성과 의존성의 종속성 (등등)이 생성되고 할당되기 때문입니다. 
이러한 종속성들 사이의 해상도 불일치는 늦게 나타납니다. 
즉, 영향을받는 빈을 처음 만들 때 나타납니다.


```
순환 의존성

우세하게 생성자 주입을 사용하면 해결할 수없는 순환 종속성 시나리오를 만들 수 있습니다.

예 : 클래스 A는 생성자 삽입을 통해 클래스 B의 인스턴스를 요구하고 클래스 B는 생성자 주입을 통해 클래스 A의 인스턴스를 필요로합니다. 
클래스 A와 B가 서로 주입되도록 Bean을 구성하면 Spring IoC 컨테이너는 런타임에이 순환 참조를 감지하고 a를 던집니다 BeanCurrentlyInCreationException.

한 가지 가능한 해결책은 생성자가 아닌 설정자가 구성하도록 일부 클래스의 소스 코드를 편집하는 것입니다. 
또는 생성자 주입을 피하고 setter 주입 만 사용하십시오. 
즉, 권장되지는 않지만 setter 주입을 사용하여 순환 종속성을 구성 할 수 있습니다.

원형 의존성이없는 전형적인 경우와 달리, 빈 A와 빈 B 사이의 순환 종속성은 완전히 초기화되기 전에 빈 중 하나가 다른 인스턴스에 주입되도록합니다 (고전적인 닭고기 및 계란 시나리오).

```

일반적으로 Spring이 올바른 일을 할 수 있다고 믿을 수 있습니다. 
컨테이너가 로드 될 때 존재하지 않는 bean에 대한 참조 및 순환 종속성과 같은 구성 문제점을 감지합니다. 
Spring은 속성을 설정하고 빈이 실제로 생성 될 때 가능한 한 늦게 의존성을 해결합니다. 
이것은 올바르게로드 된 Spring 컨테이너가 나중에 해당 객체 또는 그 의존성 중 하나를 생성하는 데 문제가있는 경우 객체를 요청할 때 예외를 생성 할 수 있음을 의미합니다. 
예를 들어, bean은 누락되었거나 유효하지 않은 결과로 예외를 throw합니다. 
재산. 잠재적으로 일부 구성 문제의 가시성이 지연되는 이유는 다음과 같습니다.
ApplicationContext구현은 기본적으로 싱글 톤 빈을 미리 인스턴스화합니다. 
이 bean이 실제로 필요하기 전에 이들을 작성하기 위해 사전에 시간과 메모리를 필요로하며 ApplicationContext 나중에 작성하지 않고 작성 될 때 구성 문제점을 발견하게 됩니다. 
싱글 톤 Bean이 미리 인스턴스화되기보다는 느리게 초기화되도록이 기본 동작을 무시할 수 있습니다.

순환 종속성이없는 경우, 하나 이상의 협업 bean이 종속 bean에 주입 될 때, 각 협업 bean은 종속 bean에 주입되기 전에 완전히 구성됩니다. 
즉, bean A가 bean B에 의존성을 가지면 Spring IoC 컨테이너는 bean A에 setter 메소드를 호출하기 전에 bean B를 완전히 구성합니다. 
즉, bean은 인스턴스화됩니다 (사전에 인스턴스화 된 singleton이 아닌 경우) ), 그 종속성이 설정되고, 관련 라이프 사이클 메소드 (예 : 구성된 init 메소드 또는 InitializingBean 콜백 메소드 )가 호출됩니다.

###### 의존성 삽입의 예

다음 예제에서는 setter 기반 DI에 XML 기반 구성 메타 데이터를 사용합니다. 
Spring XML 설정 파일의 작은 부분은 다음과 같이 몇 가지 bean 정의를 지정한다.

```xml

<bean id="exampleBean" class="examples.ExampleBean">
    <!-- setter injection using the nested ref element -->
    <property name="beanOne">
        <ref bean="anotherExampleBean"/>
    </property>

    <!-- setter injection using the neater ref attribute -->
    <property name="beanTwo" ref="yetAnotherBean"/>
    <property name="integerProperty" value="1"/>
</bean>

<bean id="anotherExampleBean" class="examples.AnotherBean"/>
<bean id="yetAnotherBean" class="examples.YetAnotherBean"/>


```
다음 예제는 해당 ExampleBean 클래스를 보여줍니다 .

```java

public class ExampleBean {

    private AnotherBean beanOne;

    private YetAnotherBean beanTwo;

    private int i;

    public void setBeanOne(AnotherBean beanOne) {
        this.beanOne = beanOne;
    }

    public void setBeanTwo(YetAnotherBean beanTwo) {
        this.beanTwo = beanTwo;
    }

    public void setIntegerProperty(int i) {
        this.i = i;
    }
}


```
앞의 예제에서 setter는 XML 파일에 지정된 속성과 일치하도록 선언됩니다. 

다음 예제에서는 생성자 기반 DI를 사용합니다.

```xml

<bean id="exampleBean" class="examples.ExampleBean">
    <!-- constructor injection using the nested ref element -->
    <constructor-arg>
        <ref bean="anotherExampleBean"/>
    </constructor-arg>

    <!-- constructor injection using the neater ref attribute -->
    <constructor-arg ref="yetAnotherBean"/>

    <constructor-arg type="int" value="1"/>
</bean>

<bean id="anotherExampleBean" class="examples.AnotherBean"/>
<bean id="yetAnotherBean" class="examples.YetAnotherBean"/>

```

다음 예제는 해당 ExampleBean 클래스를 보여줍니다 .

```java

public class ExampleBean {

    private AnotherBean beanOne;

    private YetAnotherBean beanTwo;

    private int i;

    public ExampleBean(
        AnotherBean anotherBean, YetAnotherBean yetAnotherBean, int i) {
        this.beanOne = anotherBean;
        this.beanTwo = yetAnotherBean;
        this.i = i;
    }
}

```

Bean 정의에 지정된 생성자 인수는의 ExampleBean 생성자에 대한 인수로 사용됩니다 .

이제 생성자를 사용하는 대신 Spring이 static 객체의 인스턴스를 반환하는 팩토리 메소드를 호출하도록 지시받는이 예제의 변형을 고려해보십시오 .

```xml

<bean id="exampleBean" class="examples.ExampleBean" factory-method="createInstance">
    <constructor-arg ref="anotherExampleBean"/>
    <constructor-arg ref="yetAnotherBean"/>
    <constructor-arg value="1"/>
</bean>

<bean id="anotherExampleBean" class="examples.AnotherBean"/>
<bean id="yetAnotherBean" class="examples.YetAnotherBean"/>

```

다음 예제는 해당 ExampleBean 클래스 를 보여줍니다 .

```java

public class ExampleBean {

    // a private constructor
    private ExampleBean(...) {
        ...
    }

    // a static factory method; the arguments to this method can be
    // considered the dependencies of the bean that is returned,
    // regardless of how those arguments are actually used.
    public static ExampleBean createInstance (
        AnotherBean anotherBean, YetAnotherBean yetAnotherBean, int i) {

        ExampleBean eb = new ExampleBean (...);
        // some other operations...
        return eb;
    }
}

```
static팩토리 메소드 에 대한 인수 <constructor-arg/>는 실제로 생성자가 사용 된 것과 완전히 동일한 요소 에 의해 제공 됩니다. 
팩토리 메소드가 리턴하는 클래스의 유형은 팩토리 메소드를 포함하는 클래스와 동일한 유형 일 필요는 없습니다 static(이 예에서는 동일 함). 
인스턴스 (비 정적) 팩토리 메소드는 본질적으로 동일한 방식으로 사용할 수 있습니다 (factory-bean속성 대신 속성을 사용 class하는 것과는 별도). 
따라서 여기서는 자세히 설명하지 않습니다.

#### 종속성 및 구성 세부 정보

이전 섹션 에서 언급했듯이 bean 속성 및 생성자 인수를 다른 관리 Bean (공동 작업자)에 대한 참조 또는 인라인으로 정의 된 값으로 정의 할 수 있습니다. 
Spring의 XML 기반 구성 메타 데이터는 이 목적을 위해 요소 내부 <property/>및 <constructor-arg/>요소 내의 하위 요소 유형을 지원합니다.

##### Straight Values (Primitives, Strings, and so on)

요소 의 value속성은 <property/>속성 또는 생성자 인수를 사람이 읽을 수있는 문자열 표현으로 지정합니다. 
Spring의 변환 서비스 는이 값을 a String에서 실제 유형의 등록 정보 또는 인수 로 변환하는 데 사용됩니다. 
다음 예제에서는 설정되는 다양한 값을 보여줍니다.

```xml

<bean id="myDataSource" class="org.apache.commons.dbcp.BasicDataSource" destroy-method="close">
    <!-- results in a setDriverClassName(String) call -->
    <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
    <property name="url" value="jdbc:mysql://localhost:3306/mydb"/>
    <property name="username" value="root"/>
    <property name="password" value="masterkaoli"/>
</bean>


```
다음 예제에서는 보다 간결한 XML 구성을 위해 p- 네임 스페이스 를 사용합니다 .

```xml

<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="myDataSource" class="org.apache.commons.dbcp.BasicDataSource"
        destroy-method="close"
        p:driverClassName="com.mysql.jdbc.Driver"
        p:url="jdbc:mysql://localhost:3306/mydb"
        p:username="root"
        p:password="masterkaoli"/>

</beans>

```
위의 XML은보다 간결합니다. 
그러나 Bean 정의를 만들 때 자동 속성 완성을 지원 하는 IDE (예 : IntelliJ IDEA 또는 Spring Tool Suite )를 사용하지 않는 한 오타가 디자인 시간이 아닌 런타임에 발견 됩니다. 
이러한 IDE 지원을 적극 권장합니다.

다음과 같이 java.util.Properties 인스턴스를 구성 할 수도 있습니다 .

```xml

<bean id="mappings"
    class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">

    <!-- typed as a java.util.Properties -->
    <property name="properties">
        <value>
            jdbc.driver.className=com.mysql.jdbc.Driver
            jdbc.url=jdbc:mysql://localhost:3306/mydb
        </value>
    </property>
</bean>

```

Spring 컨테이너는 JavaBeans 메커니즘 을 사용하여 <value/>요소 내부의 텍스트를 java.util.Properties인스턴스 로 변환합니다 PropertyEditor. 
이것은 멋진 지름길이며, Spring 팀이 속성 스타일 <value/>보다 중첩 된 요소 의 사용을 선호하는 몇 가지 장소 중 하나 value입니다.

###### idref요소

이 idref요소는 id컨테이너에있는 다른 bean 의 (문자열 값 - 참조가 아닌) a <constructor-arg/>또는 <property/> 요소 에 전달하는 실수 방지 방법 일뿐 입니다. 
다음 예제에서는 이를 사용하는 방법을 보여줍니다.

```xml

<bean id="theTargetBean" class="..."/>

<bean id="theClientBean" class="...">
    <property name="targetName">
        <idref bean="theTargetBean"/>
    </property>
</bean>

```
앞의 Bean 정의 스 니펫은 다음 스 니펫과 정확히 동일합니다 (런타임시).

```xml

<bean id="theTargetBean" class="..." />

<bean id="client" class="...">
    <property name="targetName" value="theTargetBean"/>
</bean>

```
첫 번째 형식은 두 번째 형식보다 바람직합니다. 
idref태그를 사용하면 참조 된 명명 된 Bean이 실제로 존재하는 배포 시간에 컨테이너에서 유효성을 검사 할 수 있기 때문 입니다. 
두 번째 변형에서, bean 의 targetName프로퍼티에 전달 된 값에 대한 검증은 수행되지 않는다 client. 
오타는 client빈이 실제로 인스턴스화 될 때만 발견 될 수 있습니다 (치명적인 결과가 발생할 가능성이 높음).  
IF client 는 빈입니다 프로토 타입 빈 컨테이너가 배포 된 후,이 오타 및 결과 예외은 오랫동안 발견 할 수있다.


```

local온 속성 idref은 정기적 이상의 값을 제공하지 않기 때문에 요소는 더 이상, 4.0 콩 XSD에서 지원되지 않습니다 bean더 이상 참조. 
4.0 스키마로 업그레이드 할 때 기존 idref local참조를 변경하십시오 idref bean.

```

<idref/>엘리먼트가 값을 갖게 되는 일반적인 장소 (최소한 스프링 2.0 이전 버전 에서)는 ProxyFactoryBean빈 정의 에서 AOP 인터셉터 의 설정에있다. 
<idref/>인터셉터 이름을 지정할 때 요소를 사용 하면 인터셉터 ID의 철자가 잘못 쓰는 것을 방지 할 수 있습니다.

###### 다른 콩에 대한 언급 (공동 작업자)

ref요소는 내부 최종 요소 <constructor-arg/>또는 <property/> 정의 소자. 
여기에서는 bean의 지정된 프라퍼티 값을 컨테이너가 관리하는 다른 bean (collaborator)에 대한 참조로 설정한다. 
참조 된 bean은 특성이 설정 될 bean의 종속성이며 필요에 따라 특성이 설정되기 전에 필요에 따라 초기화됩니다. 
공동 작업자가 싱글 톤 bean 인 경우 컨테이너에 의해 이미 초기화되었을 수 있습니다. 
모든 참조는 궁극적으로 다른 객체에 대한 참조입니다. 범위 지정 및 검증하는 것은 당신이를 통해 다른 개체의 ID 또는 이름을 지정 여부에 따라 bean, local,또는 parent속성.

태그 의 bean속성을 통해 대상 bean을 지정하는 <ref/>것이 가장 일반적인 양식이며 동일한 XML 파일에 있는지 여부에 관계없이 동일한 컨테이너 또는 상위 컨테이너에있는 모든 bean에 대한 참조를 작성할 수 있습니다. 
bean속성 의 값은 id대상 bean 의 속성과 같을 수도 있고 대상 bean의 name속성에있는 값 중 하나와 같을 수도 있습니다. 
다음 예제에서는 ref요소 를 사용하는 방법을 보여줍니다 .

```xml

<ref bean="someBean"/>

```

parent속성을 통해 대상 bean을 지정하면 현재 컨테이너의 상위 컨테이너에있는 bean에 대한 참조가 작성됩니다. 
parent 속성 의 값은 id대상 bean 의 속성 또는 대상 bean의 name속성에있는 값 중 하나 와 같을 수 있습니다 . 
대상 bean은 현재 bean의 상위 컨테이너에 있어야합니다. 
이 Bean 참조 변종은 주로 컨테이너의 계층 구조가 있고 상위 Bean과 동일한 이름을 가진 프록시를 사용하여 상위 컨테이너의 기존 Bean을 래핑하려는 경우에 사용해야합니다. 
다음 목록은 parent속성 을 사용하는 방법을 보여줍니다 .

```xml

<!-- in the parent context -->
<bean id="accountService" class="com.something.SimpleAccountService">
    <!-- insert dependencies as required as here -->
</bean>


```

```xml

<!-- in the child (descendant) context -->
<bean id="accountService" <!-- bean name is the same as the parent bean -->
    class="org.springframework.aop.framework.ProxyFactoryBean">
    <property name="target">
        <ref parent="accountService"/> <!-- notice how we refer to the parent bean -->
    </property>
    <!-- insert other configuration and dependencies as required here -->
</bean>

```

```
local온 속성 ref은 정기적 이상의 값을 제공하지 않기 때문에 요소는 더 이상, 
4.0 콩 XSD에서 지원되지 않습니다 bean더 이상 참조. 4.0 스키마로 업그레이드 할 때 기존 ref local참조를 변경하십시오 ref bean.
```
##### 내부 콩

<bean/>내부 소자 <property/>또는 <constructor-arg/>다음의 예와 같이, 요소, 내부 빈을 정의한다 :

```xml

<bean id="outer" class="...">
    <!-- instead of using a reference to a target bean, simply define the target bean inline -->
    <property name="target">
        <bean class="com.example.Person"> <!-- this is the inner bean -->
            <property name="name" value="Fiona Apple"/>
            <property name="age" value="25"/>
        </bean>
    </property>
</bean>

```

내부 bean 정의에는 정의 된 ID 또는 이름이 필요하지 않습니다. 
지정된 경우 컨테이너는 식별자와 같은 값을 사용하지 않습니다. 
scope내부 bean은 항상 익명이며 항상 외부 bean으로 작성되기 때문에 컨테이너는 작성시 플래그를 무시합니다. 
독립적으로 내부 bean에 액세스하거나 내부 bean을 포함하는 bean 이외의 협업 bean에 주입 할 수 없습니다.

예를 들어 싱글 톤 빈에 포함 된 요청 범위의 내부 빈에 대해 사용자 정의 범위에서 파괴 콜백을 수신 할 수 있습니다. 
내부 bean 인스턴스의 생성은 포함하는 Bean에 연결되지만 destroy 콜백은 요청 범위의 수명주기에 참여하게합니다. 
이것은 일반적인 시나리오는 아닙니다. 
내부 빈은 일반적으로 포함 빈의 범위를 단순히 공유합니다.


##### 컬렉션

<list/>, <set/>, <map/>, 및 <props/>요소가 자바의 특성과 인수 설정 Collection유형을 List, Set, Map,와 Properties, 각각 나타낸다. 
다음 예제에서는이를 사용하는 방법을 보여줍니다.

```xml

<bean id="moreComplexObject" class="example.ComplexObject">
    <!-- results in a setAdminEmails(java.util.Properties) call -->
    <property name="adminEmails">
        <props>
            <prop key="administrator">administrator@example.org</prop>
            <prop key="support">support@example.org</prop>
            <prop key="development">development@example.org</prop>
        </props>
    </property>
    <!-- results in a setSomeList(java.util.List) call -->
    <property name="someList">
        <list>
            <value>a list element followed by a reference</value>
            <ref bean="myDataSource" />
        </list>
    </property>
    <!-- results in a setSomeMap(java.util.Map) call -->
    <property name="someMap">
        <map>
            <entry key="an entry" value="just some string"/>
            <entry key ="a ref" value-ref="myDataSource"/>
        </map>
    </property>
    <!-- results in a setSomeSet(java.util.Set) call -->
    <property name="someSet">
        <set>
            <value>just some string</value>
            <ref bean="myDataSource" />
        </set>
    </property>
</bean>

```
맵 키 또는 값 또는 설정 값의 값은 다음 요소 중 하나 일 수 있습니다.

```
bean | ref | idref | list | set | map | props | value | null
```

###### 컬렉션 병합

Spring 컨테이너는 또한 병합 컬렉션을 지원한다. 
응용 프로그램 개발자는 부모를 정의 할 수 있습니다 <list/>, <map/>, <set/>또는 <props/>요소와 자식이 <list/>, <map/>, <set/>또는 <props/>요소는 상속과 부모 컬렉션 값을 대체합니다. 
즉, 하위 컬렉션의 값은 상위 컬렉션에 지정된 값을 재정의하는 하위 컬렉션 요소를 사용하여 상위 및 하위 컬렉션의 요소를 병합 한 결과입니다.

병합에 대한이 절에서는 부모 - 자식 빈 메커니즘에 대해 설명합니다. 
부모 bean bean 정의에 익숙하지 않은 독자는 계속하기 전에 관련 섹션 을 읽을 수 있습니다 .

다음 예제에서는 컬렉션 병합을 보여줍니다.

```xml

<beans>
    <bean id="parent" abstract="true" class="example.ComplexObject">
        <property name="adminEmails">
            <props>
                <prop key="administrator">administrator@example.com</prop>
                <prop key="support">support@example.com</prop>
            </props>
        </property>
    </bean>
    <bean id="child" parent="parent">
        <property name="adminEmails">
            <!-- the merge is specified on the child collection definition -->
            <props merge="true">
                <prop key="sales">sales@example.com</prop>
                <prop key="support">support@example.co.uk</prop>
            </props>
        </property>
    </bean>
<beans>

```

bean 정의 의 프로퍼티 요소에 merge=true속성 의 사용을 주목하라. 
때 콩이 해결하고 컨테이너에 의해 인스턴스화, 결과 인스턴스는이 아이의 병합의 결과가 포함되어 수집 부모와 수집을 수집.
다음 목록은 결과를 보여줍니다.<props/>adminEmails child child adminEmails Properties adminEmails adminEmails

```
administrator=administrator@example.com 
sales=sales@example.com 
support=support@example.co.uk
```
하위 Properties컬렉션의 값 집합은 부모의 모든 속성 요소를 상속 <props/>하며 하위 값의 값 support은 상위 컬렉션 의 값보다 우선합니다.

이 병합 동작은 유사하게 적용 <list/>, <map/>및 <set/> 수집 유형. 
<list/>요소 의 특정 경우 ,] List렉션 유형 과 연관된 시맨틱 (즉, ordered 값 콜렉션의 개념 )이 유지 보수됩니다. 
부모의 값은 모든 자식 목록의 값 앞에옵니다. Set 및 Map 의 경우  Properties수집 유형, 어떤 순서는 존재하지 않는다. 
따라서, 어떠한 순서 의미 연관된 기초 콜렉션 유형 효과없는 Map, Set그리고 Properties용기 내부에서 사용하는 구현의 유형.

###### 컬렉션 병합의 제한 사항

다른 컬렉션 유형 (예 : a Map및 a List)을 병합 할 수 없습니다. 
그렇게하려고 시도하면 적절한 조치 Exception가 취해집니다. 
merge 속성은 낮은, 상속, 자녀의 정의에 지정해야합니다. 
merge 상위 콜렉션 정의에 속성을 지정하는 것은 불필요하며 원하는 병합을 초래하지 않습니다.

###### 강력한 형식의 컬렉션

Java 5에서 제네릭 형식을 도입하면 강력하게 형식화 된 컬렉션을 사용할 수 있습니다. 
즉, Collection(예를 들어) String요소 만 포함 할 수 있는 형식 을 선언 할 수 있습니다. 
Spring에 의존성 삽입 (strong-type-in) Collection을 bean에 삽입하면, Spring의 타입 변환 지원을 이용하여 강력한 타입의 Collection 인스턴스 의 요소가. 
ini 에 추가되기 전에 적절한 유형으로 변환됩니다 Collection. 다음 Java 클래스 및 Bean 정의는이를 수행하는 방법을 보여줍니다.

```java

public class SomeClass {

    private Map<String, Float> accounts;

    public void setAccounts(Map<String, Float> accounts) {
        this.accounts = accounts;
    }
}

```

```xml

<beans>
    <bean id="something" class="x.y.SomeClass">
        <property name="accounts">
            <map>
                <entry key="one" value="9.99"/>
                <entry key="two" value="2.75"/>
                <entry key="six" value="3.99"/>
            </map>
        </property>
    </bean>
</beans>

```
빈 의 accounts특성이 something주입을 위해 준비되면 강하게 유형화 된 요소 유형에 대한 제네릭 정보는 Map<String, Float>리플렉션을 통해 사용할 수 있습니다. 
따라서 Spring의 타입 변환 인프라는 다양한 값 요소를 유형으로 인식 Float하고 문자열 값 ( 9.99, 2.75, 및 3.99)을 실제 Float유형 으로 변환 합니다.

##### Null 및 빈 문자열 값

Spring은 프로퍼티 등의 빈 인자를 빈 것으로 취급한다 Strings. 
다음 XML 기반 구성 메타 데이터 조각은 email속성을 빈 String값 ("")으로 설정합니다.

```xml

<bean class="ExampleBean">
    <property name="email" value=""/>
</bean>

```
앞의 예제는 다음 Java 코드와 동일합니다.

```java

exampleBean.setEmail("");

```

<null/>소자 핸들 null값. 다음 목록은 예제를 보여줍니다.

```xml

<bean class="ExampleBean">
    <property name="email">
        <null/>
    </property>
</bean>

```

앞의 구성은 다음 Java 코드와 동일합니다.

```java
exampleBean.setEmail(null);

```

##### p-namespace를 사용한 XML 바로 가기

p-namespace를 사용하면 bean중첩 된 <property/>요소 대신 요소의 속성 을 사용하여 빈을 공동 작업하는 속성 값을 설명하거나 둘 다를 설명 할 수 있습니다.

Spring은 XML 스키마 정의를 기반으로하는 네임 스페이스로 확장 가능한 구성 형식 을 지원합니다.
beans이 장에서 설명 하는 구성 형식은 XML 스키마 문서에 정의되어 있습니다. 
그러나 p-namespace는 XSD 파일에 정의되어 있지 않으며 Spring의 핵심에만 존재합니다.

다음 예제에서는 두 개의 XML 코드 조각을 보여줍니다 (첫 번째 코드는 표준 XML 형식을 사용하고 두 번째 코드는 p-namespace를 사용함).

```xml

<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean name="classic" class="com.example.ExampleBean">
        <property name="email" value="someone@somewhere.com"/>
    </bean>

    <bean name="p-namespace" class="com.example.ExampleBean"
        p:email="someone@somewhere.com"/>
</beans>

```

이 예는 emailbean 정의에서 호출 된 p-namespace의 속성을 보여줍니다. 
이것은 Spring에게 프라퍼티 선언을 포함하도록 지시한다. 
앞서 언급했듯이 p-namespace에는 스키마 정의가 없으므로 속성 이름에 속성 이름을 설정할 수 있습니다.

이 다음 예제는 다른 bean에 대한 참조를 갖는 두 개의 bean 정의를 추가로 포함합니다.

```xml

<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean name="john-classic" class="com.example.Person">
        <property name="name" value="John Doe"/>
        <property name="spouse" ref="jane"/>
    </bean>

    <bean name="john-modern"
        class="com.example.Person"
        p:name="John Doe"
        p:spouse-ref="jane"/>

    <bean name="jane" class="com.example.Person">
        <property name="name" value="Jane Doe"/>
    </bean>
</beans>

```

이 예제는 p-namespace를 사용하는 속성 값뿐만 아니라 속성 형식을 선언하는 특수 형식을 사용합니다. 
첫 번째 bean 정의가 bean <property name="spouse" ref="jane"/>에서 bean john으로 참조를 만드는 데 사용되는 반면, 
jane두 번째 bean 정의는 p:spouse-ref="jane"똑같은 일을하는 속성으로 사용 됩니다. 
이 경우 spouse는 프로퍼티 이름이며, -ref파트는 이것이 곧은 값이 아니라 다른 빈에 대한 참조임을 나타냅니다.

```
p- 네임 스페이스는 표준 XML 형식만큼 유연하지 않습니다. 
예를 들어, 속성 참조를 선언하는 형식은 끝나는 속성과 충돌 Ref하지만 표준 XML 형식은 끝나지 않습니다. 
세 가지 방법을 동시에 사용하는 XML 문서를 생성하지 않으려면 사용자의 접근 방식을 신중하게 선택하고 이를 팀 구성원에게 알리는 것이 좋습니다.
```

##### c-namespace를 사용한 XML 바로 가기

p-namespace를 가진 XML Shortcut과 유사하게, Spring 3.1에서 소개 된 c-namespace는 중첩 된 constructor-arg요소 보다는 생성자의 인자를 설정하기위한 인라인 속성을 허용 합니다.

다음 예제에서는 c:네임 스페이스를 사용하여 from Constructor 기반 Dependency Injection 과 동일한 작업을 수행합니다 .

```xml

<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:c="http://www.springframework.org/schema/c"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="beanTwo" class="x.y.ThingTwo"/>
    <bean id="beanThree" class="x.y.ThingThree"/>

    <!-- traditional declaration with optional argument names -->
    <bean id="beanOne" class="x.y.ThingOne">
        <constructor-arg name="thingTwo" ref="beanTwo"/>
        <constructor-arg name="thingThree" ref="beanThree"/>
        <constructor-arg name="email" value="something@somewhere.com"/>
    </bean>

    <!-- c-namespace declaration with argument names -->
    <bean id="beanOne" class="x.y.ThingOne" c:thingTwo-ref="beanTwo"
        c:thingThree-ref="beanThree" c:email="something@somewhere.com"/>

</beans>


```

c:네임 스페이스는 같은 규칙을 사용 p:하나 (뒤에 -ref자신의 이름으로 생성자 인수를 설정하기위한 빈 참조)입니다. 
마찬가지로 XSD 스키마 (Spring 코어 내부에 있음)에 정의되어 있지 않더라도 XML 파일에서 선언해야합니다.

드문 경우로 생성자 인수 이름을 사용할 수없는 경우 (일반적으로 바이트 코드가 디버깅 정보없이 컴파일 된 경우) 다음과 같이 대체 색인을 인수로 사용할 수 있습니다.

```xml
<!-- c-namespace index declaration -->
<bean id="beanOne" class="x.y.ThingOne" c:_0-ref="beanTwo" c:_1-ref="beanThree"
    c:_2="something@somewhere.com"/>
```

```
XML 문법 때문에 _XML 속성 이름은 숫자로 시작될 수 없으므로 (일부 IDE에서 허용되지만) 맨 앞의 존재를 필요로합니다. 
대응하는 인덱스 표기법은 <constructor-arg>엘리먼트에 대해서도 이용 가능 하지만 일반적으로 평범한 선언 순서가 보통 충분하기 때문에 일반적으로 사용되지 않는다.
```

실제로는 생성자 확인 메커니즘 이 인수 매칭에 매우 효율적이므로 꼭 필요하지 않으면 구성을 통해 이름 표기법을 사용하는 것이 좋습니다.

##### 복합 속성 이름

Bean 특성을 설정할 때 최종 특성 이름을 제외한 경로의 모든 구성 요소가 아닌 한 복합 또는 중첩 된 특성 이름을 사용할 수 있습니다 null. 다음 bean 정의를 고려하십시오.

```xml

<bean id="something" class="things.ThingOne">
    <property name="fred.bob.sammy" value="123" />
</bean>

```

something빈은 보유 fred갖는 속성 bob갖는 속성, sammy 속성 및 그 마지막 sammy속성의 값으로 설정되고있다 123. 이것이 가능하기 위해서는, fred재산 something과 bob재산 fred이 아니어야 null빈 후에는 구성된다. 
그렇지 않으면 a NullPointerException가 발생합니다.

#### depends-on 사용

빈이 다른 bean의 종속성이라면, 보통 한 bean이 다른 bean의 특성으로 설정됨을 의미합니다. 
일반적으로 XML 기반 구성 메타 데이터 의 <ref/> 요소 로 이를 수행합니다 . 
그러나 때로 콩 간의 의존성은 덜 직접적입니다. 
예를 들어 데이터베이스 드라이버 등록과 같이 클래스의 정적 초기화 프로그램을 트리거해야하는 경우를들 수 있습니다. 
depends-on이 요소를 사용하여 bean이 초기화되기 전에 명시 적으로 하나 이상의 빈을 강제 할 수 속성을 초기화 할 수 있습니다. 
다음 예제는 depends-on속성을 사용하여 단일 bean에 대한 종속성을 표현합니다.

```xml

<bean id="beanOne" class="ExampleBean" depends-on="manager"/>
<bean id="manager" class="ManagerBean" />

```
여러 bean에 대한 종속성을 표현하려면, depends-on속성 값으로 쉼표, 공백 및 세미콜론이 유효한 구분 기호 인 bean 이름 목록을 제공 하십시오.

```xml

<bean id="beanOne" class="ExampleBean" depends-on="manager,accountDao">
    <property name="manager" ref="manager" />
</bean>

<bean id="manager" class="ManagerBean" />
<bean id="accountDao" class="x.y.jdbc.JdbcAccountDao" />

```

```

이 depends-on속성은 초기화 시간 종속성과 싱글 톤 bean 의 경우 에만 해당 파괴 시간 종속성을 모두 지정할 수 있습니다. 
depends-on주어진 빈과 의 관계 를 정의하는 의존 빈은 주어진 빈 자체가 파괴되기 전에 먼저 파괴된다. 
따라서 depends-on종료 순서를 제어 할 수도 있습니다.

```
#### 게으른 초기화 된 빈

기본적으로 ApplicationContext구현 은 초기화 프로세스의 일부로 모든 싱글 톤 Bean을 열심히 만들고 구성합니다. 
일반적으로 구성 또는 주변 환경의 오류가 즉시 발견되기 때문에이 사전 인스턴스화가 바람직합니다. 
이는 수 시간 또는 며칠 후가 아니라 즉시 발견됩니다. 
이 동작이 바람직하지 않은 경우, bean 정의를 lazy-initialized로 표시하여 싱글 톤 bean의 사전 인스턴스화를 방지 할 수 있습니다. 
lazy-initialized Bean은 Bean이 시작될 때가 아니라 Bean 인스턴스가 처음 요청 될 때 Bean 인스턴스를 생성하도록 IoC 컨테이너에 지시한다.

XML에서이 동작은 다음 예제와 같이 요소 의 lazy-init특성에 의해 제어됩니다 <bean/>.

```xml

<bean id="lazy" class="com.something.ExpensiveToCreateBean" lazy-init="true"/>
<bean name="not.lazy" class="com.something.AnotherBean"/>

```

앞의 설정이 an ApplicationContext에 의해 소비 될 때 , lazybean은 ApplicationContext시작될 때 열심히 pre-instantiated되지 않지만, 
not.lazybean은 열성적으로 pre-instantiated된다.

그러나 지연 초기화 된 bean이 지연 초기화되지 않은 singleton bean의 종속성 일 때, 
시작시에 lazy 초기화 된 bean을 ApplicationContext생성합니다. 
왜냐하면 싱글 톤의 종속성을 만족시켜야하기 때문입니다. 
lazy-initialised bean은 lazy-initialized가 아닌 다른 곳에서 singleton bean으로 주입된다.

다음 예는 요소 의 default-lazy-init속성을 사용하여 컨테이너 수준에서 지연 초기화를 제어 할 수도 있습니다 <beans/>.

```xml
<beans default-lazy-init="true">
    <!-- no beans will be pre-instantiated... -->
</beans>
```

#### Autowiring Collaborators

Spring 컨테이너는 협력 빈들 사이의 관계를 자동 연결 (autowire) 할 수있다. 
Spring이 bean의 내용을 검사하여 공동 작업자 (다른 bean)를 자동으로 해결하도록 할 수있다 ApplicationContext. 
Autowiring에는 다음과 같은 장점이 있습니다.

* Autowiring은 프로퍼티 나 생성자의 인자를 지정할 필요성을 크게 줄여줍니다. 
(이 장의 다른 곳에서 논의 된 bean 템플릿과 같은 다른 메커니즘 도이 점에서 중요합니다.)

* Autowiring은 객체가 진화하면서 구성을 업데이트 할 수 있습니다. 
예를 들어 클래스에 종속성을 추가해야하는 경우 구성을 수정할 필요없이 해당 종속성을 자동으로 충족시킬 수 있습니다. 
따라서 autowiring은 코드베이스가보다 안정적 일 때 명시 적 배선으로 전환하는 옵션을 무효화하지 않고 개발 중에 특히 유용 할 수 있습니다.

XML 기반의 설정 메타 데이터 ( Dependency Injection 참조 )를 사용할 autowire때, <bean/>엘리먼트 의 속성을 사용하여 Bean 정의에 autowire 모드를 지정할 수 있다. 
autowiring 기능에는 네 가지 모드가 있습니다. 
빈마다 autowiring을 지정하면 자동 줄 바꿈을 선택할 수 있습니다. 
다음 표에서는 네 가지 autowiring 모드에 대해 설명합니다.

자동 배선 모드

* no : (기본값) autowiring 없음. 
빈 참조는 ref요소 로 정의해야합니다 . 
공동 작업자를 명시 적으로 지정하면 제어력과 명확성이 높아지기 때문에 대규모 배포에서는 기본 설정을 변경하지 않는 것이 좋습니다. 
어느 정도까지는 시스템의 구조를 문서화합니다.

* byName : 속성 이름에 의한 자동 연결. 
Spring은 autowired 할 필요가있는 프라퍼티와 같은 이름의 bean을 찾는다. 
예를 들어 bean 정의가 이름으로 autowire로 설정되고 master속성 이 포함되어있는 경우 (즉, setMaster(..)메소드 가있는 경우 ) 
Spring은 명명 된 bean 정의를 찾고 master이를 사용하여 속성을 설정합니다.

* byType : 속성 유형의 하나의 bean이 컨테이너에 존재하는 경우 속성을 자동 종료 할 수있게합니다. 
둘 이상이 존재하면 치명적인 예외가 발생합니다. 이는 byType해당 bean에 대해 자동 와이어 링을 사용할 수 없음을 나타냅니다 . 
일치하는 bean이 없으면 아무 것도 _ 생하지 않습니다 (특성이 설정되지 않음).

* constructor : byTypeconstructor 인수 와 비슷하지만 적용됩니다. 컨테이너에 생성자 인수 유형의 Bean이 정확히 하나도 없으면 심각한 오류가 발생합니다.

함께 byType또는 constructor를 autowiring 모드, 당신은 배열 및 입력 컬렉션을 연결할 수 있습니다. 
이 경우 예상되는 유형과 일치하는 컨테이너 내의 모든 autowire 후보가 종속성을 충족시키기 위해 제공됩니다. 
Map예상되는 키 유형이이면 강력한 유형의 인스턴스를 자동 배선 할 수 있습니다 String. 
autowired Map 인스턴스의 값은 예상되는 유형과 일치하는 모든 bean 인스턴스로 구성되며 Map인스턴스의 키에는 해당 bean 이름이 포함됩니다.

##### 자동 배선의 한계와 단점

자동 와이어 링은 프로젝트 전체에서 일관되게 사용될 때 가장 잘 작동합니다. 
autowiring이 일반적으로 사용되지 않는다면 개발자가 하나 또는 두 개의 bean 정의만을 연결하는 것을 혼란스럽게 할 수 있습니다.

autowiring의 한계와 단점을 고려하십시오.

* 명시 적 종속성 property및 constructor-arg설정은 항상 autowiring보다 우선합니다. 
프리미티브 Strings,, 및 Classes(및 이러한 간단한 속성의 배열)과 같은 간단한 속성을 autowire 수 없습니다. 
이 제한은 디자인에 의한 것입니다.

* 자동 배선은 명시 적 배선보다 정확하지 않습니다. 
이전 표에서 언급했듯이, Spring은 예기치 않은 결과를 초래할 수도있는 애매한 경우에 추측을 피하기 위해주의를 기울였습니다. 
Spring 관리 객체 간의 관계는 더 이상 명시 적으로 문서화되지 않습니다.

* Spring 컨테이너에서 문서를 생성 할 수있는 도구에서는 와이어 링 정보를 사용할 수 없습니다.
  
* 컨테이너 내의 여러 bean 정의는 autowired 될 setter 메소드 또는 생성자 인수에 의해 지정된 유형과 일치 할 수 있습니다. 
배열, 컬렉션 또는 Map인스턴스의 경우 반드시 문제는 아닙니다. 
그러나 단일 값을 예상하는 종속성의 경우이 모호성은 임의로 해결되지 않습니다. 
고유 한 Bean 정의가 없으면 예외가 발생합니다.

후자의 시나리오에는 몇 가지 옵션이 있습니다.

* 명백한 배선을 위해 자동 배선을 포기합니다.

* 그 설정하여 빈 정의를 autowiring에 피 autowire-candidate에 속성을 false에서 설명한대로 다음 섹션 .

* 요소 의 primary속성을 로 설정하여 단일 bean 정의를 기본 후보로 지정하십시오 .<bean/>true
 
* Annotation 기반 컨테이너 구성에 설명 된대로 주석 기반 구성에서 사용 가능한보다 세부적인 컨트롤을 구현하십시오 .

##### 자동 와이어 링에서 Bean 제외

Bean별로, 자동 와이어 링에서 Bean을 제외 할 수 있습니다. 
Spring의 XML 포맷에서, 엘리먼트 의 autowire-candidate애트리뷰트를로 설정한다. 
컨테이너는 autowiring 기반 구조 (예 :와 같은 어노테이션 스타일 설정 포함)에서 특정 bean 정의를 사용할 수 없도록 만듭니다 .<bean/>false@Autowired

```
이 autowire-candidate속성은 유형 기반 자동 와이어 링에만 영향을 주도록 설계되었습니다. 
지정된 bean이 autowire 후보로 표시되지 않아도 해결되는 이름 별 명시 적 참조에는 영향을주지 않습니다. 
결과적으로, 이름에 따른 autowiring은 이름이 일치하는 경우에도 bean을 주입합니다.

```

또한 bean 이름에 대한 패턴 일치를 기반으로 autowire 후보를 제한 할 수 있습니다. 
최상위 <beans/>요소는 default-autowire-candidates속성 내에 하나 이상의 패턴을 허용 합니다. 
예를 들어, autowire 후보 상태를 이름이로 끝나는 bean으로 제한하려면 Repository값을 제공하십시오 *Repository. 
여러 패턴을 제공하려면 쉼표로 구분 된 목록으로 정의하십시오. autowire-candidate속성의 명시 적 값 true또는 false빈 정의의에 대한 값은 항상 우선합니다. 
이러한 bean의 경우 패턴 일치 규칙이 적용되지 않습니다.

이 기술은 autowiring을 통해 다른 bean에 삽입하고 싶지 않은 bean에 유용합니다. 
autowiring을 사용하여 제외 된 bean 자체를 구성 할 수 없다는 것을 의미하지는 않습니다. 
오히려 빈 자체는 다른 빈을 autowiring하기위한 후보가 아닙니다.


#### 방법 주입

대부분의 응용 프로그램 시나리오에서 컨테이너의 대부분의 bean은 singleton 입니다. 
싱글 톤 빈이 다른 싱글 톤 빈과 협업해야하거나 비 - 싱글 톤 빈이 다른 비 싱글 톤 빈과 협업해야하는 경우 일반적으로 한 빈을 다른 빈의 프로퍼티로 정의하여 종속성을 처리합니다. 
빈 수명주기가 다른 경우 문제가 발생합니다. 
단일 톤 bean A가 비 A (프로토 타입) bean B를 A의 각 메소드 호출에서 사용할 필요가 있다고 가정하십시오. 
컨테이너는 singleton bean A를 한 번만 작성하므로 등록 정보를 설정할 수있는 기회가 한 번만 있습니다. 
컨테이너는 필요할 때마다 bean A에 bean B의 새 인스턴스를 제공 할 수 없습니다.


해결책은 통제의 반전을 막는 것입니다. 
인터페이스 를 구현하여 bean A가 컨테이너 를 인식하게 할 수 있으며 ApplicationContextAware, bean A가 필요할 때마다 컨테이너에 대한 getBean("B")호출을 (일반적으로 새로운) bean B 인스턴스에 요청 함으로써 컨테이너를 호출 할 수 있습니다. 
다음 예제에서는이 접근 방식을 보여줍니다.

```java

// a class that uses a stateful Command-style class to perform some processing
package fiona.apple;

// Spring-API imports
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class CommandManager implements ApplicationContextAware {

    private ApplicationContext applicationContext;

    public Object process(Map commandState) {
        // grab a new instance of the appropriate Command
        Command command = createCommand();
        // set the state on the (hopefully brand new) Command instance
        command.setState(commandState);
        return command.execute();
    }

    protected Command createCommand() {
        // notice the Spring API dependency!
        return this.applicationContext.getBean("command", Command.class);
    }

    public void setApplicationContext(
            ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }
}


```

비즈니스 코드가 스프링 프레임 워크를 인식하고 결합하기 때문에 앞의 내용은 바람직하지 않습니다. 
Spring IoC 컨테이너의 다소 고급 기능인 메소드 삽입 (Method Injection)을 통해이 유스 케이스를 깔끔하게 처리 할 수있다.

이 블로그 엔트리 에서 Method Injection에 대한 동기를 더 읽을 수 있습니다 .

##### 조회 방법 삽입

조회 메소드 삽입은 컨테이너가 컨테이너 관리 빈의 메소드를 대체하고 컨테이너의 다른 명명 된 빈에 대한 조회 결과를 리턴하는 기능입니다. 
룩업은 전형적으로 이전 섹션 에서 설명한 시나리오에서와 같이 프로토 타입 빈을 포함합니다. 
Spring Framework는 CGLIB 라이브러리의 바이트 코드 생성을 사용하여 메소드를 재정의하는 서브 클래스를 동적으로 생성함으로써이 메소드 삽입을 구현합니다.

```
이 동적 서브 클래 싱이 작동하기 위해서는 Spring 빈 컨테이너 서브 클래스가 될 수없는 클래스 final와 재정의 될 메소드가 될 수 없다 final.

abstract메소드가 있는 클래스를 유닛 테스트 하려면 클래스를 직접 서브 클래스 화하고 abstract메소드 의 스텁 구현을 제공해야 합니다.

구체적인 방법은 구성 요소 스캐닝에도 필요하며, 구체적인 클래스를 선택해야합니다.

또 다른 중요한 제한점은 팩토리 메소드에서는 조회 메소드가 작동하지 않으며, 
특히 @Bean구성 클래스의 메소드에서는 작동하지 않는다는 것입니다 .
이 경우 컨테이너는 인스턴스 작성을 담당하지 않으므로 런타임에서 생성 된 서브 클래스를 작성할 수 없기 때문입니다 파리.

```

CommandManager이전 코드 스 니펫 의 클래스 의 경우 Spring 컨테이너는 createCommand() 메서드 구현을 동적으로 재정의합니다. 
CommandManager재 작업의 예와 같이 클래스는 Spring에 대한 의존성을 가지고 있지 않습니다

```java

package fiona.apple;

// no more Spring imports!

public abstract class CommandManager {

    public Object process(Object commandState) {
        // grab a new instance of the appropriate Command interface
        Command command = createCommand();
        // set the state on the (hopefully brand new) Command instance
        command.setState(commandState);
        return command.execute();
    }

    // okay... but where is the implementation of this method?
    protected abstract Command createCommand();
}

```
삽입 할 메소드 ( CommandManager이 경우) 가 들어있는 클라이언트 클래스 에서 주입 할 메소드에는 다음 형식의 서명이 필요합니다.

```
<public|protected> [abstract] <return-type> theMethodName(no-arguments);
```
메소드가있는 abstract경우, 동적으로 생성 된 서브 클래스는 메소드를 구현합니다. 
그렇지 않으면 동적으로 생성 된 하위 클래스가 원래 클래스에 정의 된 구체적인 메서드를 재정의합니다. 
다음 예제를 고려하십시오.

```xml
<!-- a stateful bean deployed as a prototype (non-singleton) -->
<bean id="myCommand" class="fiona.apple.AsyncCommand" scope="prototype">
    <!-- inject dependencies here as required -->
</bean>

<!-- commandProcessor uses statefulCommandHelper -->
<bean id="commandManager" class="fiona.apple.CommandManager">
    <lookup-method name="createCommand" bean="myCommand"/>
</bean>

```

식별 된 bean은 bean 의 새 인스턴스가 필요할 때마다 commandManager자체 createCommand()메소드 를 호출합니다 myCommand. 
myCommand실제로 필요한 경우 빈을 프로토 타입으로 전개하는 데주의해야 합니다. 
그것이 싱글 톤 (singleton) 이라면 myCommand 매번 동일한 빈 인스턴스 가 반환됩니다.

또는 주석 기반 구성 요소 모델 내 @Lookup에서 다음 예제와 같이 주석을 통해 조회 방법을 선언 할 수 있습니다 .

```java

public abstract class CommandManager {

    public Object process(Object commandState) {
        Command command = createCommand();
        command.setState(commandState);
        return command.execute();
    }

    @Lookup("myCommand")
    protected abstract Command createCommand();
}

```

또는 관용적으로 보면, 조회 메소드의 선언 된 리턴 유형에 대해 해결되는 대상 bean에 의존 할 수 있습니다.

```java

public abstract class CommandManager {

    public Object process(Object commandState) {
        MyCommand command = createCommand();
        command.setState(commandState);
        return command.execute();
    }

    @Lookup
    protected abstract MyCommand createCommand();
}

```

일반적으로 추상 주석 클래스가 기본적으로 무시되는 Spring의 컴포넌트 검색 규칙과 호환되도록 이러한 주석 첨부 조회 메소드를 구체적인 스텁 구현으로 선언해야합니다. 
이 제한은 명시 적으로 등록되거나 명시 적으로 가져온 Bean 클래스에는 적용되지 않습니다.

```
다르게 범위가 지정된 대상 빈을 액세스하는 또 다른 방법은 ObjectFactory/ Provider주입 지점입니다. 
Scoped Bean을 종속성으로 참조하십시오.

또한 ServiceLocatorFactoryBean( org.springframework.beans.factory.config패키지 안에) 유용 할 수 있습니다.

```

##### 임의 방식 대체

룩업 메소드 삽입보다 덜 유용한 메소드 주입은 관리 빈의 임의의 메소드를 다른 메소드 구현으로 대체하는 기능입니다. 
실제로이 기능이 필요할 때까지이 섹션의 나머지 부분은 건너 뛰어도됩니다.

XML 기반 구성 메타 데이터를 사용하면 replaced-method요소를 사용하여 배치 된 bean에 대해 기존 메소드 구현을 다른 것으로 대체 할 수 있습니다. 
다음 클래스를 살펴 보겠습니다.
이 클래스에는 computeValue재정의 할 메소드 가 있습니다.

```java
public class MyValueCalculator {

    public String computeValue(String input) {
        // some real code...
    }

    // some other methods...
}
```
org.springframework.beans.factory.support.MethodReplacer 인터페이스 를 구현하는 클래스 는 다음 예제와 같이 새 메서드 정의를 제공합니다.


```java

/**
 * meant to be used to override the existing computeValue(String)
 * implementation in MyValueCalculator
 */
public class ReplacementComputeValue implements MethodReplacer {

    public Object reimplement(Object o, Method m, Object[] args) throws Throwable {
        // get the input value, work with it, and return a computed result
        String input = (String) args[0];
        ...
        return ...;
    }
}

```
원래 클래스를 전개하고 메소드 대체를 지정하는 bean 정의는 다음 예제와 유사합니다.

```xml

<bean id="myValueCalculator" class="x.y.z.MyValueCalculator">
    <!-- arbitrary method replacement -->
    <replaced-method name="computeValue" replacer="replacementComputeValue">
        <arg-type>String</arg-type>
    </replaced-method>
</bean>

<bean id="replacementComputeValue" class="a.b.c.ReplacementComputeValue"/>

```

<arg-type/>요소 내의 하나 이상의 요소를 사용하여 <replaced-method/> 재정의 할 메소드의 메소드 서명을 나타낼 수 있습니다. 
인수에 대한 서명은 메소드가 오버로드되어 있고 클래스 내에 여러 변형이있는 경우에만 필요합니다. 
편의상 인수의 유형 문자열은 완전한 유형의 이름의 부분 문자열 일 수 있습니다. 
예를 들어, 모두 다음과 일치합니다 java.lang.String.

```
java.lang.String
String
Str
```
인수의 수는 각 가능한 선택을 구별하기에 충분하기 때문에이 바로 가기는 인수 유형과 일치하는 가장 짧은 문자열 만 입력하게하여 많은 입력을 절약 할 수 있습니다.


# 참조
-----
* [spring-framework-reference The IoC Container](https://docs.spring.io/spring-framework/docs/current/spring-framework-reference/core.html#beans)
* [method-injection/](https://spring.io/blog/2004/08/06/method-injection/)

