---
layout: post
title: "Creating_Your_Own_Auto-configuration"
date: 2018-07-05 15:43:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 나만의 스프링 부트 스타터 만들기

#### auto-configuration Bean에 이해

내부적으로 자동 구성은 표준 @Configuration클래스로 구현됩니다 . 
추가 @Conditional 어너테이션은 자동 구성이 적용되어야하는시기를 제한하는 데 사용됩니다. 

일반적으로 자동 구성 클래스는 @ConditionalOnClass과 @ConditionalOnMissingBean 어너테이션을 사용 합니다. 
이렇게하면 관련 클래스가 발견되고 자신의 클래스를 선언하지 않은 경우에만 자동 구성이 적용됩니다 

#### Auto-configuration 대상 찾기

spring Boot는 META-INF/spring.factories게시 된 jar 파일 내의 파일 존재 여부를 검사합니다.
파일은 EnableAutoConfiguration다음 예제와 같이 키 아래에 구성 클래스를 나열해야합니다.

```

org.springframework.boot.autoconfigure.EnableAutoConfiguration = \ 
com.mycorp.libx.autoconfigure.LibXAutoConfiguration, \ 
com.mycorp.libx.autoconfigure.LibXWebAutoConfiguration

```

구성을 특정 순서로 적용해야하는 경우 @AutoConfigureAfter또는 @AutoConfigureBefore 어너테이션을 사용할 수 있습니다. 
예를 들어 웹 특정 구성을 제공하는 경우 클래스를 나중에 적용해야 할 수 있습니다.
[WebMvcAutoConfiguration](https://github.com/spring-projects/spring-boot/blob/v2.0.3.RELEASE/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration.java)
참조

서로에 대한 직접적인 지식이 없어야하는 특정 자동 구성을 주문하려는 경우에도 사용할 수 있습니다 
@AutoConfigureOrder. 이 어너테이션은 일반 @Order 어너테이션과 동일한 의미를 갖지만 자동 구성 클래스에 대한 전용 순서를 제공합니다.
  
#### 조건 어너테이션

거의 항상  자동 구성 클래스에 하나 이상의 @Conditional 어너테이션을 포함하려고합니다.
@ConditionalOnMissingBean 어너테이션은 그들이 당신의 기본값에 만족하지 않은 경우 개발자가 자동 설정을 재정의 할 수 있도록하는 데 사용되는 하나의 일반적인 예이다.

Spring Boot는 클래스 나 개별 메소드에 @Conditional 어너테이션을 달아 자신의 코드에서 재사용 할 수 있는 많은 
@Configuration @Bean 어너테이션을 포함 합니다. 이러한 어너테이션은 아래와 같습니다.

##### Class Conditions

@ConditionalOnClass및 @ConditionalOnMissingClass 어너테이션 구성이 특정 클래스의 유무에 따라 포함 할 수 있습니다. 
주석 메타 데이터는 ASM 을 사용하여 구문 분석된다. value 속성은 실제 클래스를 참조하고 있다. 
클래스가 실행중인 응용 프로그램 클래스 경로에 실제로 나타나지 않을지라도이 속성을 사용 하여 실제 클래스를 참조 할 수 있습니다.
name 속성을 사용하여 클래스 이름을 지정하려는 경우 String으로 value 값을 선언해서 사용할수 있다.


##### Bean Conditions

@ConditionalOnBean와 @ConditionalOnMissingBean주석은 특정 빈의 유무에 따라 빈이 포함되도록합니다. 이 value 속성을 사용하여 유형별 name로 bean을 지정 하거나 이름별로 bean을 지정할 수 있습니다.
이 search 속성을 사용하면 ApplicationContextbean 검색시 고려해야 하는 계층 구조 를 제한 할 수 있습니다 .
@Bean메소드 에 배치되면 다음 예제와 같이 대상 유형의 기본값이 메소드의 리턴 유형이됩니다.

```java

@Configuration
public class MyAutoConfiguration {

	@Bean
	@ConditionalOnMissingBean
	public MyService myService() { ... }

}

```
앞의 예제에서 이미 myService bean에 type의 bean이 ApplicationContext에 없다면 MyService bean이 생성 될 것 입니다. 


##### Property Conditions

이 @ConditionalOnProperty주석은 Spring Environment 속성을 기반으로 구성이 포함되도록합니다. 
사용 prefix하고 name확인해야 속성을 지정하는 속성. 기본적으로 존재하고 같지 않은 모든 특성 false이 일치합니다. 
또한 havingValue및 matchIfMissing속성 을 사용하여 고급 검사를 만들 수도 있습니다 .


##### Resource Conditions

@ConditionalOnResource주석은 구성이 특정 자원이 존재하는 경우에만 포함 할 수 있습니다. 
리소스는 다음 예제와 같이 일반적인 Spring 규칙을 사용하여 지정할 수 있습니다 file:/home/user/test.dat.


##### Web Application Conditions

@ConditionalOnWebApplication및 @ConditionalOnNotWebApplication주석 구성은 응용 프로그램이 "웹 응용 프로그램"인지에 따라 포함 할 수 있습니다. 
웹 응용 프로그램은 Spring을 사용 하거나 범위를 WebApplicationContext정의 session하거나 StandardServletEnvironment.


##### SpEL Expression Conditions

이 @ConditionalOnExpression주석은 SpEL 표현식 의 결과를 기반으로 구성을 포함 시킵니다.

#### Testing your Auto-configuration

자동 구성은 사용자 구성 ( @Bean 정의 및 Environment사용자 정의), 조건 평가 (특정 라이브러리의 존재) 및 기타 요인의 영향을받을 수 있습니다 . 
구체적으로, 각 테스트는 ApplicationContext해당 사용자 지정 항목의 조합을 나타내는 잘 정의 된 항목 을 만들어야합니다 . ApplicationContextRunner그것을 성취 할 수있는 좋은 방법을 제공합니다.

ApplicationContext Runner일반적으로 기본 구성을 수집하기위한 테스트 클래스의 필드로 정의됩니다. 다음 예제 UserServiceAutoConfiguration는 항상 호출 되는지 확인합니다 .

```java

private final ApplicationContextRunner contextRunner = new ApplicationContextRunner().withConfiguration(AutoConfigurations.of(UserServiceAutoConfiguration.class));

```

각 테스트는 러너를 사용하여 특정 유스 케이스를 나타낼 수 있습니다. 예를 들어, 아래 샘플에서는 사용자 구성 ( UserConfiguration)을 호출 하고 자동 구성이 올바르게 작동하는지 확인합니다. 호출 run은 함께 사용할 수있는 콜백 컨텍스트를 제공합니다 Assert4J.

```java

@Test
public void defaultServiceBacksOff() {
	this.contextRunner.withUserConfiguration(UserConfiguration.class)
			.run((context) -> {
				assertThat(context).hasSingleBean(UserService.class);
				assertThat(context.getBean(UserService.class)).isSameAs(
						context.getBean(UserConfiguration.class).myUserService());
			});
}

@Configuration
static class UserConfiguration {

	@Bean
	public UserService myUserService() {
		return new UserService("mine");
	}

}

```

Environment 다음 예제와 같이을 쉽게 사용자 정의 할 수도 있습니다 .

```java

@Test
public void serviceNameCanBeConfigured() {
	this.contextRunner.withPropertyValues("user.name=test123").run((context) -> {
		assertThat(context).hasSingleBean(UserService.class);
		assertThat(context.getBean(UserService.class).getName()).isEqualTo("test123");
	});
}

```

##### Simulating a Web Context

당신은 단지 서블릿 또는 반응성 웹 애플리케이션 환경에서 동작하는 자동 구성을 가각 테스트해야하는 경우 사용 WebApplicationContextRunner또는 ReactiveWebApplicationContextRunner 

##### Overriding the Classpath

특정 클래스 및 / 또는 패키지가 런타임에 존재하지 않을 때 어떤 일이 발생하는지 테스트 할 수도 있습니다. FilteredClassLoader러너가 쉽게 사용할 수 있는 스프링 부트 선박 . 다음 예에서는 if UserService가 없으면 자동 구성이 제대로 비활성화되어 있다고 가정합니다 .

```java

@Test
public void serviceIsIgnoredIfLibraryIsNotPresent() {
	this.contextRunner.withClassLoader(new FilteredClassLoader(UserService.class))
			.run((context) -> assertThat(context).doesNotHaveBean("userService"));
}

```

#### Creating Your Own Starter

라이브러리를 위한 전체 스프링 부트 스타터는 다음과 같은 구성 요소를 포함 할 수 있습니다 :

autoconfigure자동 구성 코드가 포함 된 모듈입니다.
starter받는 종속성 제공 모듈 autoconfigure모듈뿐만 아니라 도서관과 일반적으로 유용한 추가 종속성을. 요컨대, 스타터를 추가하면 해당 라이브러리를 사용하는 데 필요한 모든 것을 제공해야합니다.


##### Naming

당신은 당신의 starter를위한 적절한 네임 스페이스를 제공해야한다. spring-boot다른 Maven을 사용하더라도 모듈 이름을 시작하지 마십시오 groupId. 앞으로 자동 구성되는 것에 대한 공식적인 지원을 제공 할 수 있습니다.

경험적으로, 시동기 후에 결합 된 모듈의 이름을 지정해야합니다. 예를 들어, "acme"에 대한 시동기를 작성 중이며 자동 구성 모듈 acme-spring-boot-autoconfigure과 시동기의 이름을 지정한다고 가정합니다 acme-spring-boot-starter. 두 모듈을 결합한 모듈이 하나 인 경우 이름을 지정하십시오 acme-spring-boot-starter.

또한 스타터가 구성 키를 제공하면 고유 한 네임 스페이스를 사용하십시오. 특히, 봄 부팅이 사용하는 네임 스페이스에 키를 (예 : 포함되지 않습니다 server, management, spring, 등). 동일한 네임 스페이스를 사용하는 경우 모듈을 손상시키는 방식으로 향후 이러한 네임 스페이스를 수정할 수 있습니다.

메타 데이터 생성 을 트리거 하여 IDE 보조 기능을 키에 사용할 수 있도록하십시오. 생성 된 메타 데이터 ( META-INF/spring-configuration-metadata.json) 를 검토 하여 키가 제대로 문서화되었는지 확인할 수 있습니다.

##### autoconfigure Module

이 autoconfigure모듈에는 라이브러리를 시작하는 데 필요한 모든 것이 들어 있습니다. 또한 구성 키 정의 (예 @ConfigurationProperties:) 및 구성 요소 초기화 방법을 사용자 정의하는 데 사용할 수있는 모든 콜백 인터페이스를 포함 할 수 있습니다.

스프링 부트는 주석 프로세서를 사용하여 메타 데이터 파일 ( META-INF/spring-autoconfigure-metadata.properties)의 자동 구성 조건을 수집합니다 . 해당 파일이 있으면 일치하지 않는 자동 구성을 열심히 필터링하여 시작 시간을 향상시킵니다. 자동 구성이 포함 된 모듈에 다음 종속성을 추가하는 것이 좋습니다.

```xml

<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-autoconfigure-processor</artifactId>
	<optional>true</optional>
</dependency>

```

Gradle 4.5 이하 compileOnly 에서는 다음 예와 같이 구성 에서 종속성을 선언해야합니다 .

```groovy

dependencies {
	compileOnly "org.springframework.boot:spring-boot-autoconfigure-processor"
}

```

Gradle 4.6 이상 annotationProcessor 에서는 다음 예와 같이 구성 에서 종속성을 선언해야합니다 .

```groovy

dependencies {
	annotationProcessor "org.springframework.boot:spring-boot-autoconfigure-processor"
}

```


##### Starter Module

시동기는 실제로 빈 병입니다. 유일한 목적은 라이브러리와 함께 작동하는 데 필요한 종속성을 제공하는 것입니다. 시작하는 데 필요한 것에 대한 견해를 가진 견해라고 생각할 수 있습니다.

시동기가 추가 된 프로젝트에 대해 가정하지 마십시오. 일반적으로 자동 구성중인 라이브러리에 다른 시작 프로그램이 필요한 경우이를 언급하십시오. 선택적 종속성의 수가 높으면 기본 종속성 의 적절한 세트를 제공하는 것이 어려울 수 있습니다. 이는 라이브러리의 일반적인 사용에 불필요한 종속성을 포함하지 않아야하기 때문입니다. 즉, 선택적 종속성을 포함해서는 안됩니다.



# 참조 
-----
* [boot-features-developing-auto-configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-developing-auto-configuration.html)