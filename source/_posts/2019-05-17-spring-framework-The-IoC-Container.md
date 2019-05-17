---
layout: post
title: "spring framework The IoC Container"
date: 2019-05-17 11:09 +0900
comments: true
tags : ["spring framework","core","The IoC Container"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## Spring Framework

### The IoC Container

이 장에서는 Spring의 Inversion of Control (IoC : 제어의 역전) 컨테이너에 대해 다룹니다.

#### Spring IoC 컨테이너와 Beans에 대한 소개 

이 장에서는 IoC (Inversion of Control) 원칙의 Spring Framework 구현에 대해 다룹니다. 
IoC는 종속성 주입 (DI)이라고도합니다. 
객체가 생성자 인수, 팩토리 메소드에 대한 인수 또는 팩토리 메소드에서 생성되거나 리턴 된 객체 인스턴스에 설정된 특성을 통해서만 객체가 종속성 (즉, 자신이 작업하는 다른 객체)을 정의하는 프로세스입니다. 
그런 다음 컨테이너는 bean을 작성할 때 이러한 종속성을 주입합니다.
이 프로세스는 근본적으로 클래스의 직접적인 구성이나 서비스 로케이터 패턴과 같은 메커니즘을 사용하여 종속성의 인스턴스 또는 위치를 제어하는 ​​빈 자체의 역전 (따라서 Inversion of Control)입니다.

org.springframework.beans및 org.springframework.context패키지는 Spring 프레임 워크의 IoC 컨테이너의 기초입니다. 
BeanFactory 인터페이스는 모든 유형의 개체를 관리 할 수있는 고급 구성 메커니즘을 제공합니다. 
ApplicationContext 의 하위 인터페이스입니다 BeanFactory는 아래 내용을 추가한다 :

* Spring의 AOP 기능과의보다 쉬운 통합
* 메시지 리소스 처리 (국제화에 사용)
* Event publication
* WebApplicationContext 웹 응용 프로그램에서 사용 하기 위한 것과 같은 응용 프로그램 계층 별 컨텍스트 .

즉, BeanFactory구성 프레임 워크 및 기본 기능을 제공하고 ApplicationContext 엔터프라이즈 별 기능을 추가합니다. 
The ApplicationContext는  Spring BeanFactory의 IoC 컨테이너에 대한 설명에서 이 장에서 독점적으로 사용되는 완전한 superset 입니다. 
사용에 대한 자세한 내용은 BeanFactory 대신 ApplicationContext를 봐야 한다.

Spring에서 애플리케이션의 백본을 형성하고 Spring IoC 컨테이너에 의해 관리되는 객체를 Bean이라고 부른다. 
Bean은 Spring IoC 컨테이너에 의해 인스턴스화, 어셈블 링 및 관리되는 객체이다. 
그렇지 않으면 빈은 단순히 응용 프로그램의 많은 객체 중 하나입니다. 
빈들과 그 사이의 의존성은 컨테이너가 사용하는 컨피규레이션 메타 데이터에 반영됩니다.

#### 컨테이너 개요

org.springframework.context.ApplicationContext 인터페이스는 Spring IoC 컨테이너를 나타내며, 인스턴스 구성 및 콩 조립을 담당합니다. 
컨테이너는 구성 메타 데이터를 읽어서 인스턴스화, 구성 및 어셈블 할 객체에 대한 지침을 가져옵니다. 
구성 메타 데이터는 XML, Java 주석 또는 Java 코드로 표시됩니다. 
이를 통해 응용 프로그램을 구성하는 오브젝트와 해당 오브젝트 간의 풍부한 상호 의존성을 표현할 수 있습니다.

ApplicationContext인터페이스 의 여러 구현은 Spring과 함께 제공됩니다. 
독립 실행 형 응용 프로그램에서는 ClassPathXmlApplicationContext 또는 의 인스턴스를 만드는 것이 일반적 FileSystemXmlApplicationContext 입니다. 
XML은 구성 메타 데이터를 정의하기위한 전통적인 형식 이었지만 컨테이너에 Java 주석을 사용하도록 지시하거나 소량의 XML 구성을 제공하여 메타 데이터 형식으로 코드화함으로써 이러한 추가 메타 데이터 형식에 대한 지원을 선언적으로 사용할 수 있습니다.

대부분의 애플리케이션 시나리오에서 명시 적 사용자 코드는 Spring IoC 컨테이너의 하나 이상의 인스턴스를 인스턴스화 할 필요가 없다. 
예를 들어, 웹 응용 프로그램 시나리오에서 web.xml 일반적으로 응용 프로그램 의 파일에 있는 단순한 8 개의 상용구 웹 설명자 XML 만 있으면 충분합니다 ( 웹 응용 프로그램의 편리한 ApplicationContext Instantiation 참조 ). 
당신이 사용하는 경우 봄 도구 스위트 (이클립스 구동 개발 환경), 당신은 쉽게 몇 번의 마우스 클릭이나 키 입력이 상용구 구성을 만들 수 있습니다.


다음 다이어그램은 Spring이 어떻게 작동 하는지를 보여줍니다. 
응용 프로그램 클래스는 구성 메타 데이터와 결합되어 ApplicationContext 작성되고 초기화 된 후에 완전히 구성되고 실행 가능한 시스템 또는 응용 프로그램을 갖게됩니다.

![Spring IoC 컨테이너](https://sejoung.github.io/images/2019_05_17_01.png)

##### 구성 메타 데이터

앞의 다이어그램에서 볼 수 있듯이 Spring IoC 컨테이너는 구성 메타 데이터의 형태를 사용한다. 
이 컨피규레이션 메타 데이터는 애플리케이션 개발자로서 애플리케이션에서 객체를 인스턴스화, 구성 및 어셈블하도록 Spring 컨테이너에 지시하는 방법을 나타냅니다.

컨피규레이션 메타 데이터는 전통적으로 단순하고 직관적 인 XML 형식으로 제공되며,이 장의 대부분은 Spring IoC 컨테이너의 주요 개념과 기능을 전달하는 데 사용된다.

```
XML 기반 메타 데이터는 구성 메타 데이터의 유일한 허용 형식이 아닙니다. 
Spring IoC 컨테이너 자체는이 구성 메타 데이터가 실제로 작성된 형식과 완전히 분리되어있다. 
요즈음, 많은 개발자 들은 Spring 어플리케이션을위한 자바 기반 설정 을 선택 합니다.
```

Spring 컨테이너에서 다른 형식의 메타 데이터를 사용하는 방법에 대한 정보는 다음을 참조하십시오.

* 어노테이션 기반 설정 : 스프링 2.5는 어노테이션 기반 설정 메타 데이터에 대한 지원을 도입했다.
* 자바 기반 설정 : Spring 3.0부터는 Spring JavaConfig 프로젝트에서 제공하는 많은 기능들이 핵심 Spring 프레임 워크의 일부가되었다. 
따라서 XML 파일이 아닌 Java를 사용하여 응용 프로그램 클래스 외부의 Bean을 정의 할 수 있습니다. 
이러한 새 기능을 사용하려면 @Configuration, @Bean, @Import, 및 @DependsOn 주석을 참조.

Spring 설정은 컨테이너가 관리해야하는 하나 이상의 bean 정의로 구성된다. 
XML 기반 구성 메타 데이터는 이러한 bean을 <bean/>최상위 요소 내부의 <beans/>요소로 구성합니다. 
Java 구성은 일반적으로 @Configuration 클래스 내에서 @Bean 주석이 달린 메소드를 사용합니다 

이 bean 정의는 응용 프로그램을 구성하는 실제 객체에 해당합니다. 
일반적으로 서비스 계층 개체, 데이터 액세스 개체 (DAO), Struts Action 인스턴스 와 같은 프레젠테이션 개체, Hibernate SessionFactories, JMS 등과 같은 인프라 개체 등을 정의 Queues합니다. 
일반적으로 도메인 객체를 생성하고로드하는 것은 DAO 와 비즈니스 로직의 책임이기 때문에 일반적으로 컨테이너에 Fine-grained 도메인 객체를 구성하지 않습니다. 
그러나 AspectJ와 Spring의 통합을 사용하여 IoC 컨테이너의 제어 범위 밖에서 생성 된 객체를 구성 할 수있다. 
AspectJ를 사용하여 Spring과의 의존성 주입 도메인 객체를 참조하십시오.


다음 예제는 XML 기반 구성 메타 데이터의 기본 구조를 보여줍니다.

```xml

<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="..." class="...">   
        <!-- collaborators and configuration for this bean go here -->
    </bean>

    <bean id="..." class="...">
        <!-- collaborators and configuration for this bean go here -->
    </bean>

    <!-- more bean definitions go here -->

</beans>

```
* id 속성은 개별 빈 정의를 식별하는 문자열입니다.
* class 속성은 빈의 유형을 정의하고 정규화 된 클래스 이름을 사용합니다.

id속성 의 값은 협업 오브젝트를 나타냄니다.
협업 오브젝트를 참조하기위한 XML은이 예제에 표시되지 않습니다. 
자세한 내용은 종속성 을 참조하십시오.

##### 컨테이너 인스턴스화하기

ApplicationContext 생성자에 제공되는 위치 경로 는 컨테이너가 로컬 파일 시스템, Java 등과 같은 다양한 외부 리소스의 구성 메타 데이터를 로드 할 수 있도록하는 리소스 문자열입니다.

```java

ApplicationContext context = new ClassPathXmlApplicationContext("services.xml", "daos.xml");

```

```
	
Spring의 IoC 컨테이너에 대해 배우고 나면, URI 구문에 정의 된 위치에서 InputStream을 읽는 편리한 메커니즘을 제공하는 
Spring의 Resource 추상화 에 대해 자세히 설명하고 싶을 것이다 ( 참고 자료 참조 ). 
특히 Resource경로는 응용 프로그램 컨텍스트 및 자원 경로 에서 설명한대로 응용 프로그램 컨텍스트를 구성하는 데 사용됩니다.

```

다음 예에서는 서비스 계층 개체 (services.xml)구성 파일을 보여줍니다 .

```xml

<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- services -->

    <bean id="petStore" class="org.springframework.samples.jpetstore.services.PetStoreServiceImpl">
        <property name="accountDao" ref="accountDao"/>
        <property name="itemDao" ref="itemDao"/>
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>

    <!-- more bean definitions for services go here -->

</beans>


```

다음 예제에서는 데이터 액세스 개체 daos.xml파일을 보여줍니다 .

```xml

<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="accountDao"
        class="org.springframework.samples.jpetstore.dao.jpa.JpaAccountDao">
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>

    <bean id="itemDao" class="org.springframework.samples.jpetstore.dao.jpa.JpaItemDao">
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>

    <!-- more bean definitions for data access objects go here -->

</beans>

```

앞의 예에서 서비스 계층은 PetStoreServiceImpl유형 JpaAccountDao및 JpaItemDao(JPA 객체 관계형 매핑 표준을 기반으로 한) 두 가지 데이터 액세스 객체 로 구성됩니다. 
property name요소는 자바 빈즈 속성의 이름을 참조하고, ref요소는 다른 빈 정의의 이름을 나타냅니다. 
이 요소 id와 ref요소 사이의 연결은 공동 작업 객체 간의 종속성을 나타냅니다. 
개체의 종속성을 구성하는 세부 사항을 참조 종속성.

###### XML 기반 구성 메타 데이터 작성

빈 정의가 여러 XML 파일에 걸쳐있는 것이 유용 할 수 있습니다. 
각 개별 XML 구성 파일은 아키텍처의 논리 계층 또는 모듈을 나타내는 경우가 많습니다.

응용 프로그램 컨텍스트 생성자를 사용하여 모든 XML 조각에서 bean 정의를로드 할 수 있습니다. 
이 생성자는 이전 섹션Resource 에서 설명한 것처럼 여러 위치를 사용합니다. 
또는 <import/>요소 의 하나 이상의 어커런스를 사용하여 다른 파일 또는 파일의 bean 정의를로드하십시오. 
다음 예제에서는이를 수행하는 방법을 보여줍니다.

```xml

<beans>
    <import resource="services.xml"/>
    <import resource="resources/messageSource.xml"/>
    <import resource="/resources/themeSource.xml"/>

    <bean id="bean1" class="..."/>
    <bean id="bean2" class="..."/>
</beans>

```

앞의 예에서 외부 bean 정의는 세 개의 파일에서로드 : services.xml, messageSource.xml,와 themeSource.xml. 
모든 위치 경로는 가져 오기를 수행하는 정의 파일에 상대적이기 때문에 services.xml동안, 
오기 (import)를 수행하는 파일과 같은 디렉토리 나 클래스 패스 위치에 있어야 messageSource.xml 하고 themeSource.xml에 있어야합니다 
resources가져 오기 파일의 위치 아래에 위치. 
보시다시피, 선행 슬래시는 무시됩니다. 
그러나 이러한 경로가 상대적인 경우 슬래시를 전혀 사용하지 않는 것이 좋습니다. 
최상위 <beans/>요소를 포함하여 가져올 파일의 내용은 Spring 스키마에 따라 유효한 XML bean 정의 여야합니다.


```

상대적 "../"경로를 사용하여 상위 디렉토리의 파일을 참조하는 것은 가능하지만 권장하지는 않습니다. 
이렇게하면 현재 응용 프로그램 외부에있는 파일에 대한 종속성이 만들어집니다. 
특히이 참조는 런타임 해결 프로세스가 "가장 가까운"클래스 경로 루트를 선택한 다음 상위 디렉토리를 조사 하는 classpath:URL (예 :) 에는 권장되지 않습니다 
classpath:../services.xml. 클래스 경로 구성 변경으로 인해 다른 디렉토리가 잘못 선택 될 수 있습니다.

상대 경로 대신 정규화 된 리소스 위치를 항상 사용할 수 있습니다 
(예 : file:C:/config/services.xml또는) classpath:/config/services.xml. 
그러나 응용 프로그램의 구성을 특정 절대 위치에 연결한다는 점에 유의하십시오. 
일반적으로 런타임시 JVM 시스템 속성에 대해 해결되는 "$ {...}"자리 표시자를 통해 절대 위치에 대한 간접 참조를 유지하는 것이 바람직합니다.

```

네임 스페이스 자체가 가져 오기 지시문 기능을 제공합니다. 
일반 Bean 정의를 뛰어 넘는 추가 구성 기능은 Spring에서 제공하는 XML 네임 스페이스 (예 : the context및 util네임 스페이스) 의 선택에서 사용할 수 있습니다 .

###### 그루비 빈 정의 DSL

외부화 된 설정 메타 데이터에 대한 또 다른 예로서, 
빈 정의는 Grails 프레임 워크에서 알려진 바와 같이 Spring의 Groovy Bean Definition DSL로 표현 될 수있다. 
일반적으로 이러한 구성은 다음 예제와 같은 구조의 ".groovy"파일에 있습니다.

```groovy

beans {
    dataSource(BasicDataSource) {
        driverClassName = "org.hsqldb.jdbcDriver"
        url = "jdbc:hsqldb:mem:grailsDB"
        username = "sa"
        password = ""
        settings = [mynew:"setting"]
    }
    sessionFactory(SessionFactory) {
        dataSource = dataSource
    }
    myService(MyService) {
        nestedBean = { AnotherBean bean ->
            dataSource = dataSource
        }
    }
}

```
이 설정 스타일은 XML bean 정의와 거의 동일하며 Spring의 XML 설정 네임 스페이스를 지원한다. 
또한 XML Bean 정의 파일을 importBeans 지시문을 통해 가져올 수 있습니다 .

#### 컨테이너 사용

이것은 ApplicationContext다른 bean과 그 의존성의 레지스트리를 관리 할 수있는 고급 팩토리를위한 인터페이스입니다. 
이 메소드를 사용 T getBean(String name, Class<T> requiredType)하여 bean 인스턴스를 검색 할 수 있습니다.

ApplicationContext 은 당신이 빈 정의를 읽고, 다음의 예와 같이, 그들에 액세스 할 수 있습니다 :

```java

// create and configure beans
ApplicationContext context = new ClassPathXmlApplicationContext("services.xml", "daos.xml");

// retrieve configured instance
PetStoreService service = context.getBean("petStore", PetStoreService.class);

// use configured instance
List<String> userList = service.getUsernameList();

```

Groovy 설정을 사용하면 부트 스트랩이 매우 비슷해 보입니다. 
이것은 Groovy를 인식하는 다른 컨텍스트 구현 클래스를 가지고 있지만 (또한 XML bean 정의를 이해한다.) 
다음 예제는 Groovy 설정을 보여줍니다 :

```java

ApplicationContext context = new GenericGroovyApplicationContext("services.groovy", "daos.groovy");

```

가장 유연한 변형은 다음 예제와 같이 XML 파일의 경우와 같이 GenericApplicationContext 독자 위임자와 함께 사용 XmlBeanDefinitionReader 됩니다.

```java

GenericApplicationContext context = new GenericApplicationContext();
new XmlBeanDefinitionReader(context).loadBeanDefinitions("services.xml", "daos.xml");
context.refresh();

```

GroovyBeanDefinitionReader 다음 예제와 같이 for Groovy 파일을 사용할 수도 있습니다.

```
GenericApplicationContext context = new GenericApplicationContext();
new GroovyBeanDefinitionReader(context).loadBeanDefinitions("services.groovy", "daos.groovy");
context.refresh();

```

이러한 리더 위임자 ApplicationContext를 다양한 구성 소스의 Bean 정의를 읽고 동일한 환경 에서 혼합하여 사용할 수 있습니다.

그런 다음 getBean빈의 인스턴스를 검색 하는 데 사용할 수 있습니다. 
ApplicationContext 인터페이스는 이상적으로, 응용 프로그램 코드를 사용해서는 안됨, 
콩을 검색하기위한 몇 가지 다른 방법이 있지만. 
사실, 애플리케이션 코드는 getBean()메소드에 대한 호출을 전혀 가지지 않아야 하므로 Spring API에 전혀 의존하지 않는다. 
예를 들어 Spring의 웹 프레임 워크와의 통합은 컨트롤러 및 JSF 관리 빈과 같은 다양한 웹 프레임 워크 구성 요소에 대한 종속성 주입을 제공하여 메타 데이터 (예 : 자동 와이어 링 주석)를 통해 특정 빈에 대한 종속성을 선언 할 수 있습니다.

# 참조
-----
* [spring-framework-reference The IoC Container](https://docs.spring.io/spring-framework/docs/current/spring-framework-reference/core.html#beans)


