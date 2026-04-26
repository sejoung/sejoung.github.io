---
layout: post
title: "spring framework The IoC Container"
date: 2019-05-17 13:40 +0900
comments: true
tags : ["spring framework","core","The IoC Container"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## Spring Framework

### Bean Overview

Spring IoC 컨테이너는 하나 이상의 빈을 관리한다. 
이러한 bean은 사용자가 컨테이너에 제공하는 구성 메타 데이터 (예 : XML <bean/>정의 형식 )로 작성됩니다.

컨테이너 자체 내에서,이 bean 정의는 BeanDefinition (다른 정보들 사이에서) 다음 메타 데이터를 포함하는 객체 로 표현됩니다.

* 패키지 수식 클래스 명 : 일반적으로, 정의되고있는 bean의 실제의 구현 클래스.
* Bean behavioral configuration 객체 - 컨테이너에서 Bean이 어떻게 작동해야하는지 (범위, 수명주기 콜백 등)를 명시합니다.
* bean이 작업을 수행하는 데 필요한 다른 bean에 대한 참조. 이러한 참조는 공동 작업자 또는 종속성이라고도합니다.
* 새로 생성 된 객체에 설정할 기타 구성 설정 (예 : 풀의 크기 제한 또는 연결 풀을 관리하는 Bean에서 사용할 연결 수).

이 메타 데이터는 각 bean 정의를 구성하는 속성 세트로 변환됩니다. 

특정 bean을 만드는 방법에 대한 정보가 들어있는 bean 정의 외에도, ApplicationContext구현은 또한 컨테이너 외부에서 (사용자에 의해) 생성 된 기존 객체의 등록을 허용합니다.
이것은 getBeanFactory() BeanFactory DefaultListableBeanFactory 구현을 리턴하는 메소드를 통해 ApplicationContext 의 BeanFactory 에 액세스함으로써 수행된다. 
registerSingleton(..) registerBeanDefinition(..) 을 통해 DefaultListableBeanFactory에 등록을 지원 합니다. 
그러나 일반적인 응용 프로그램은 일반적인 bean 정의 메타 데이터를 통해 정의 된 bean에서만 작동합니다.

```

Bean 메타 데이터와 수동으로 제공되는 싱글 톤 인스턴스는 자동 와이어 링 및 기타 인트로 스펙트 단계에서 컨테이너가 
컨테이너에 대해 적절히 추론 할 수 있도록 가능한 빨리 등록해야합니다. 
기존 메타 데이터와 기존 싱글 톤 인스턴스를 재정의하는 것은 어느 정도 지원되지만 런타임에 
새로운 빈의 등록 (팩토리에 대한 라이브 액세스와 동시에)은 공식적으로 지원되지 않으며 동시 액세스 예외, 빈 컨테이너의 일관성없는 상태 또는 둘다 모두.

```

##### Bean 이름 지정

모든 Bean 에는 하나 이상의 식별자가 있습니다. 
이러한 식별자는 Bean을 호스팅하는 컨테이너 내에서 고유해야합니다. 
bean은 대개 하나의 식별자만 가집니다. 
그러나 둘 이상이 필요한 경우 여분의 애트리뷰트는 별칭으로 간주 될 수 있습니다.

XML 기반 구성 메타 데이터에서 id특성, name특성 또는 둘 다를 사용하여 Bean 식별자를 지정합니다. 
이 id속성을 사용하면 정확히 하나의 id를 지정할 수 있습니다. 
일반적으로 이러한 이름은 영숫자 ( 'myBean', 'someService'등)이지만 특수 문자도 포함 할 수 있습니다. 
빈에 대해 다른 별명을 도입하려는 경우, name 속성에 쉼표 ( ,), 세미콜론 ( ;) 또는 공백 으로 구분 하여 지정할 수 있습니다. 
Spring 3.1 이전의 버전에서 이력은 주석으로 가능한 문자를 제한 id하는 xsd:ID유형 으로 정의되었습니다. 
3.1부터는 xsd:string유형으로 정의됩니다. 
bean id고유성은 컨테이너에 의해 여전히 시행되지만 더 이상 XML 파서는 아닙니다.

빈을 위해 a name또는 an 을 제공 할 필요는 없습니다 id. a name또는 id명시 적으로 제공하지 않으면 컨테이너는 해당 bean에 대해 고유 한 이름을 생성합니다. 
그러나 ref요소 또는 서비스로 I 이터 스타일 | 조를 사용하여 이름으로 해당 bean을 참조하려는 경우, 이름을 제공해야합니다. 
이름을 제공하지 않는 동기는 내부 빈 을 사용 하고 공동 작업자를 autowiring 하는 것과 관련됩니다.

```
빈 명명 규칙

관례는 빈을 명명 할 때 인스턴스 이름과 같은 표준 Java 규칙을 사용하는 것입니다. 
즉, 콩 이름은 소문자로 시작하여 거기에서 낙타 - 케이스입니다. 
이러한 명칭의 예는 accountManager, accountService, userDao, loginController, 등.

빈 이름을 일관되게 지정하면 구성을 읽고 이해하기가 더 쉬워집니다. 
또한, Spring AOP를 사용하면 이름으로 관련된 bean 세트에 조언을 적용 할 때 많은 도움이됩니다.

```

```
Classpath에서 컴포넌트 스캔을 사용하면, 앞서 설명한 규칙에 따라 이름없는 컴포넌트에 대한 빈 이름을 생성한다. 
기본적으로 간단한 클래스 이름을 사용하고 초기 문자를 소문자로 변환한다. 
그러나 두 개 이상의 문자가 있고 첫 번째 문자와 두 번째 문자가 대문자 인 (특이한) 특별한 경우에는 원래의 대소 문자가 보존됩니다. 
이것들은 java.beans.Introspector.decapitalize(Spring이 여기에서 사용 하는) 것과 같은 규칙 이다.

```

###### Bean 밖의 Bean 별명 지정

Bean 정의 자체에서, id속성으로 지정된 하나의 이름 과 속성의 다른 이름 의 조합을 사용하여 Bean에 둘 이상의 이름을 제공 할 수 있습니다 name. 
이 이름은 같은 bean에 대한 동등한 별명이 될 수 있으며 응용 프로그램의 각 구성 요소가 해당 구성 요소 자체에 고유 한 bean 이름을 사용하여 공통 종속성을 참조하도록하는 것과 같은 일부 상황에 유용합니다.

그러나 bean이 실제로 정의 된 모든 별명을 지정하는 것이 항상 적절한 것은 아닙니다. 
때로는 다른 곳에 정의 된 bean에 대한 별명을 소개하는 것이 바람직합니다. 
이는 대개 구성이 각 서브 시스템간에 분할되며 각 서브 시스템마다 자체 오브젝트 정의 세트가있는 대형 시스템의 경우입니다.
XML 기반 구성 메타 데이터에서 <alias/>요소를 사용하여 이를 수행 할 수 있습니다. 
다음 예제에서는이를 수행하는 방법을 보여줍니다.

```xml

<alias name="fromName" alias="toName"/>

```

이 경우, 동일한 fromName 별칭 정의를 사용 한 후에 명명 된 동일한 컨테이너에있는 bean을 toName 으로 참조 할 수도 있습니다 .

예를 들어, 서브 시스템 A의 구성 메타 데이터는의 이름으로 DataSource를 참조 할 수 있습니다 subsystemA-dataSource. 
서브 시스템 B의 구성 메타 데이터는의 이름으로 DataSource를 참조 할 수 있습니다 subsystemB-dataSource. 
이 두 서브 시스템을 모두 사용하는 주 응용 프로그램을 작성할 때 기본 응용 프로그램은 DataSource를 이름으로 참조 myApp-dataSource합니다. 
세 개의 이름 모두가 동일한 객체를 참조하도록하려면 다음 별칭 정의를 구성 메타 데이터에 추가 할 수 있습니다.


```xml

<alias name="myApp-dataSource" alias="subsystemA-dataSource"/>
<alias name="myApp-dataSource" alias="subsystemB-dataSource"/>

```

이제 각 구성 요소와 기본 응용 프로그램은 고유 한 이름을 통해 dataSource를 참조 할 수 있으며 다른 정의와 충돌하지 않도록 보장 
(사실상 네임 스페이스 만들기)하지만 동일한 빈을 참조합니다.

```
Java 구성

Javaconfiguration을 사용하는 경우 @Bean별칭을 사용하여 별칭을 제공 할 수 있습니다. 자세한 내용 은 @Bean주석 사용을 참조하십시오.

```

##### Bean을 인스턴스화하기

bean 정의는 본질적으로 하나 이상의 객체를 생성하는 방법입니다. 
컨테이너는 요청 될 때 명명 된 bean에 대한 레시피를보고 해당 bean 정의로 캡슐화 된 구성 메타 데이터를 사용하여 실제 객체를 생성 (또는 획득)합니다.

XML 기반 구성 메타 데이터를 사용하는 class경우 <bean/>요소 의 속성 에서 인스턴스화 할 객체의 유형 (또는 클래스)을 지정합니다. 
이 class속성 (내부적 Class으로 BeanDefinition 인스턴스 의 속성 )은 일반적으로 필수 속성입니다. 
(예외에 대해서는 인스턴스 팩토리 메서드 및 Bean 정의 상속 을 사용하여 인스턴스화를 참조하십시오.) Class다음 두 가지 방법 중 하나로이 속성을 사용할 수 있습니다.

* 일반적으로 컨테이너 자체가 해당 생성자를 반영하여 빈을 직접 생성하는 경우에 생성 될 빈 클래스를 지정하는 것이고 new 연산자를 사용하는 Java 코드와 다소 동일합니다.

* static은 드문 경우이지만 컨테이너가 static 클래스 의 팩토리 메소드를 호출 하여 Bean을 작성하는 경우, 오브젝트를 작성하기 위해 호출 되는 팩토리 메소드를 포함하는 실제 클래스를 지정합니다. 
static팩토리 메소드 의 호출로부터 돌려 주어진 객체 형은 , 같은 클래스 또는 다른 클래스 일 가능성이 있습니다.

```
내부 클래스 이름

static중첩 클래스에 대한 bean 정의를 구성 하려면 중첩 클래스의 2 진 이름을 사용해야합니다.

당신이라는 클래스가있는 경우 예를 들어, SomeThing에 com.example패키지를,이 SomeThing클래스가있다 
static라는 중첩 된 클래스를 OtherThing,의 값 class bean 정의에 속성이 될 것이다 com.example.SomeThing$OtherThing.

의 사용에 주목 $외부 클래스 이름에서 중첩 된 클래스 이름을 구분하기 위해 이름에 문자를.

```

###### 생성자로 인스턴스화하기

생성자 접근법으로 빈을 생성하면, 모든 일반 클래스는 Spring에 의해 사용 가능하고 호환이 가능하다. 
즉, 개발중인 클래스는 특정 인터페이스를 구현하거나 특정 방식으로 코딩 할 필요가 없습니다. 
간단히 bean 클래스를 지정하면 충분합니다. 
그러나 특정 Bean에 사용하는 IoC의 유형에 따라 기본 (비어있는) 생성자가 필요할 수 있습니다.

Spring IoC 컨테이너는 관리하고자하는 클래스를 사실상 관리 할 수있다. 
진정한 JavaBeans를 관리하는 것에 국한되지 않습니다. 
대부분의 Spring 사용자는 기본 (인수 없음) 생성자와 적절한 setter 및 getter가 컨테이너의 속성 다음에 모델링 된 실제 JavaBeans를 선호합니다. 
당신은 또한 당신의 컨테이너에 더 이국적인 비 콩 스타일의 클래스를 가질 수 있습니다. 
예를 들어, 절대적으로 JavaBean 스펙을 따르지 않는 레거시 연결 풀을 사용해야하는 경우, Spring도 이를 관리 할 수 ​​있습니다.

XML 기반 구성 메타 데이터를 사용하면 다음과 같이 Bean 클래스를 지정할 수 있습니다.

```xml

<bean id="exampleBean" class="examples.ExampleBean"/>

<bean name="anotherExample" class="examples.ExampleBeanTwo"/>

```

생성자에 인수를 제공하는 메커니즘 (필요한 경우) 및 객체를 생성 한 후 객체 인스턴스 속성을 설정하는 방법에 대한 자세한 내용은 종속성 삽입을 참조하십시오 .

###### 정적 팩토리 메서드로 인스턴스화

정적 팩토리 메소드로 작성한 bean을 정의 할 때,이 class 속성을 사용하여 static팩토리 메소드 를 포함하는 클래스를 지정하고, 
속성을 사용 factory-method하여 팩토리 메소드 자체의 이름을 지정하는 이름을 지정하십시오. 
이 메소드를 호출하고 (나중에 설명 된 선택적 인수 사용) 라이브 객체를 반환 할 수 있어야합니다. 
이 객체는 이후 생성자를 통해 만들어진 것처럼 취급됩니다. 
그러한 bean 정의를 사용하는 한가지 방법 static은 레거시 코드에서 factory 를 호출하는 것이다.

다음 bean 정의는 factory 메소드를 호출하여 bean을 생성하도록 지정합니다. 
이 정의는 반환 된 객체의 유형 (클래스)을 지정하지 않으며 factory 메소드가 포함 된 클래스 만 지정합니다. 
이 예제에서 createInstance() 메서드는 정적 메서드 여야합니다. 다음 예제에서는 팩터리 메서드를 지정하는 방법을 보여줍니다.

```xml

<bean id="clientService"
    class="examples.ClientService"
    factory-method="createInstance"/>

```

다음 예제는 위의 bean 정의로 작업 할 수있는 클래스를 보여줍니다 :

```java

public class ClientService {
    private static ClientService clientService = new ClientService();
    private ClientService() {}

    public static ClientService createInstance() {
        return clientService;
    }
}

```

팩토리 메소드에 인수 (선택 사항)를 제공하고 팩토리에서 오브젝트가 리턴 된 후 오브젝트 인스턴스 등록 정보를 설정하는 메커니즘에 대한 자세한 내용은 종속성 및 구성 상세 정보를 참조하십시오 .

###### 인스턴스 팩토리 메서드를 사용하여 인스턴스화

정적 팩토리 메소드를 통한 인스턴스화와 유사하게, 인스턴스 팩토리 메소드 를 사용한 인스턴스화는 컨테이너에서 기존 빈의 비 정적 메소드를 호출하여 새 빈을 작성합니다. 
이 메커니즘을 사용하려면 class속성을 공백으로 남겨두고 속성 factory-bean에서 오브젝트를 작성하기 위해 호출 할 인스턴스 메소드가 들어있는 현재 (또는 상위 또는 상위 컨테이너)에있는 Bean의 이름을 지정하십시오. 
factory-method속성 을 사용해 팩토리 메소드 자체의 이름을 설정 합니다. 
다음 예제는 그러한 bean을 구성하는 방법을 보여줍니다.

```xml

<!-- the factory bean, which contains a method called createInstance() -->
<bean id="serviceLocator" class="examples.DefaultServiceLocator">
    <!-- inject any dependencies required by this locator bean -->
</bean>

<!-- the bean to be created via the factory bean -->
<bean id="clientService"
    factory-bean="serviceLocator"
    factory-method="createClientServiceInstance"/>
    
```

다음 예제는 해당 Java 클래스를 보여줍니다.

```java

public class DefaultServiceLocator {

    private static ClientService clientService = new ClientServiceImpl();

    public ClientService createClientServiceInstance() {
        return clientService;
    }
}

```

다음의 예와 같이, 1 개의 팩토리 클래스는 2 개의 팩토리 메소드를 가질 수가 있습니다.

```xml

<bean id="serviceLocator" class="examples.DefaultServiceLocator">
    <!-- inject any dependencies required by this locator bean -->
</bean>

<bean id="clientService"
    factory-bean="serviceLocator"
    factory-method="createClientServiceInstance"/>

<bean id="accountService"
    factory-bean="serviceLocator"
    factory-method="createAccountServiceInstance"/>


```

다음 예제는 해당 Java 클래스를 보여줍니다.

```java

public class DefaultServiceLocator {

    private static ClientService clientService = new ClientServiceImpl();

    private static AccountService accountService = new AccountServiceImpl();

    public ClientService createClientServiceInstance() {
        return clientService;
    }

    public AccountService createAccountServiceInstance() {
        return accountService;
    }
}

```

이 접근법은 factory bean 자체가 의존성 주입 (DI)을 통해 관리되고 구성 될 수 있음을 보여줍니다. 
종속성 및 구성 세부 사항을 참조하십시오.

```
Spring 문서에서 "factory bean"은 Spring 컨테이너에서 설정되고 인스턴스 또는 정적 팩토리 메소드를 통해 객체를 생성하는 bean을 참조한다. 
대조적으로 FactoryBean(대문자 사용에주의하십시오)는 특정 Spring을 나타냅니다 FactoryBean.

```

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


# 참조
-----
* [spring-framework-reference The IoC Container](https://docs.spring.io/spring-framework/docs/current/spring-framework-reference/core.html#beans)


