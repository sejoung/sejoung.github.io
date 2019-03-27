---
layout: post
title: "spring data jpa repositorys로 작업하기(Repository Interfaces 정의)"
date: 2019-03-08 14:36 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## spring data jpa repositorys로 작업하기(Repository Interfaces 정의)


먼저 도메인 클래스 별 저장소 인터페이스를 정의하십시오. 
인터페이스는 Repository도메인 클래스와 ID 유형으로 확장 되고 유형화 되어야합니다. 
해당 도메인 유형에 대해 CRUD 메소드를 노출하려면 Repository 대신에 CrudRepository 확장하십시오 .

### Repository 미세조정 정의

일반적으로 저장소 인터페이스 Repository는 CrudRepository 또는 PagingAndSortingRepository 확장됩니다. 
또는 Spring 데이터 인터페이스를 확장하지 않으려는 경우 @RepositoryDefinition 저장소 인터페이스에 주석을 달 수 있습니다. 

CrudRepository 확장은 엔티티를 조작하기위한 완전한 메소드 세트를 제공합니다. 

노출되는 메소드를 선택적으로 선호하는 경우 노출하려는 메소드를 CrudRepository 도메인 리포지토리에 복사하십시오 .

아래의 선택노출을 위한 예제 코드입니다.

```java

@NoRepositoryBean
interface MyBaseRepository<T, ID extends Serializable> extends Repository<T, ID> {

  Optional<T> findById(ID id);

  <S extends T> S save(S entity);
}

interface UserRepository extends MyBaseRepository<User, Long> {
  User findByEmailAddress(EmailAddress emailAddress);
}

```

이전의 예에서, 모든 도메인 저장소에 대한 공통 기본 인터페이스를 정의하고 노출 findById(…) 뿐만 아니라 save(…). 
그들의 메소드를 사용하면 당신이 사용하는 경우 spring-data-jpa 가 제공하는 선택의 저장소의 기본 저장소 구현에 연결됩니다(예를 들어, 구현은 SimpleJpaRepository), 
그것들은 CrudRepository 메소드의 서명과 일치하기 때문에입니다.
그래서는 UserRepository지금 사용자를 저장 ID에 의해 개별 사용자를 발견 사용자의 이메일 주소를 찾을 수있는 쿼리를 실행.

```
중간 저장소 인터페이스는로 @NoRepositoryBean 주석 처리됩니다. 
Spring 데이터가 런타임에 인스턴스를 생성해서는 안되는 모든 저장소 인터페이스에 해당 주석을 추가해야합니다.
```

#### Repository Methods에서 null 처리

Spring Data 2.0부터 개별 집계 인스턴스를 반환하는 저장소 CRUD 메소드는 잠재적 인 값 부재를 나타내는 Optional(Java 8)을 사용 합니다. 

그 외에도 Spring 데이터는 쿼리 메소드에 다음과 같은 래퍼 유형을 반환하는 것을 지원합니다.

* com.google.common.base.Optional
* scala.Option
* io.vavr.control.Option
* javaslang.control.Option (deprecated as Javaslang is deprecated)

또는 쿼리 메서드는 래퍼 유형을 전혀 사용하지 않도록 선택할 수 있습니다. 
조회 결과가없는 경우 null 반환으로 표시됩니다. 
콜렉션, 컬렉션의 대체 메소드, 래퍼 및 스트림을 돌려주는 리포지터리 (repository) 메소드는 결코 null을 반환하지 않고, 
빈 상태 (empty)의 표현에 대응합니다.

```

Optional<T> : Java 8 또는 Guava Optional.
조회 메소드가 하나의 결과 만 리턴하도록합니다. 
어떤 결과가 발견되지 않는 경우, Optional.empty() 또는 Optional.absent()반환 됩니다. 
하나 이상의 결과는 IncorrectResultSizeDataAccessException 발생한다.

```

Nullability Annotations

Spring Framework의 Nullability 어노테이션을 사용하여 저장소 메소드에 대한 Null 허용 제한 조건을 표현할 수 있다.
도구 친화적 인 접근법을 제공하며 다음과 같이 런타임 중에 선택적인 null 검사를 수행합니다.

* @NonNullApi: 매개 변수 및 반환 값의 기본 동작이 값을 수락하거나 null 생성하지 않는다고 선언하는 데 패키지 수준에서 사용 됩니다.
* @NonNull: 매개 변수 나 반환 값에 null이 사용되지 않아야합니다( @NonNullApi적용되는 경우 매개 변수와 반환 값에 필요하지 않음 ).
* @Nullable: 매개 변수 나 리턴 값에 null이 사용될 수 있습니다 .

package-info.java에서 null 허용하지 않을때 

```java

@org.springframework.lang.NonNullApi
package com.acme;

```

null을 허용하지 않음이 기본값으로 설정되면 저장소 쿼리 메서드 호출은 런타임에 null 허용 제한 조건에 대해 유효성이 검사됩니다.
쿼리 실행 결과가 정의 된 제약 조건을 위반하면 예외가 발생합니다.
이것은 메소드가 리턴 null되지만 nullable이 아닌 것으로 선언 될 때 발생 합니다(저장소가 상주하는 패키지에 정의 된 주석이있는 기본값). 
nullable 결과를 다시 허용하려면 @Nullable 어너테이션을 개별 메소드를 선택적으로 사용하십시오.
이 섹션 시작 부분에 언급 된 결과 래퍼 유형을 사용하면 예상대로 계속 작동합니다.
비어있는 결과는 부재를 나타내는 값으로 변환됩니다.

다음 예제는 방금 설명한 여러 기술을 보여줍니다.


```java

@org.springframework.lang.NonNullApi
package com.acme; //(1)

```

```java

package com.acme;                               //(2)                        

import org.springframework.lang.Nullable;

interface UserRepository extends Repository<User, Long> {

  User getByEmailAddress(EmailAddress emailAddress);                    //(3) 

  @Nullable
  User findByEmailAddress(@Nullable EmailAddress emailAdress);          //(4)

  Optional<User> findOptionalByEmailAddress(EmailAddress emailAddress); //(5)
  
}

```

1. null을 허용하지 않음을 패키지에 정의 
1. 저장소는 null을 허용하지 않음을 정의한 패키지(또는 하위 패키지)에 있다
1. 실행 된 쿼리가 결과를 생성하지 않을 때를 EmptyResultDataAccessException 을 던집니다. 메서드에 건네 준 emailAddress 가 null 일때 IllegalArgumentException 을 던집니다.
1. 실행 된 쿼리가 결과를 생성하지 않을 때를 null을 반환 합니다. 또한 emailAddress의 null값을 받아들 입니다.
1. 실행 된 쿼리가 결과를 생성하지 않을 때를 Optional.empty() 반환 합니다. 메서드에 건네 준 emailAddress 가 null 일때 IllegalArgumentException 을 던집니다.

### 다중 스프링 데이터 모듈이있는 리포지토리 사용

응용 프로그램에서 고유 한 스프링 데이터 모듈을 사용하면 정의 된 범위의 모든 저장소 인터페이스가 스프링 데이터 모듈에 바인딩되므로 작업이 간단 해집니다. 
때때로, 어플리케이션은 하나 이상의 Spring Data 모듈을 사용해야합니다. 
그러한 경우, 저장소 정의는 영속 기술을 구별해야합니다. 
클래스 경로에서 여러 저장소 팩토리를 탐지하면 Spring 데이터는 엄격한 저장소 구성 모드로 들어갑니다. 
엄격한 구성은 저장소 또는 도메인 클래스의 세부 정보를 사용하여 저장소 정의에 대한 Spring 데이터 모듈 바인딩을 결정합니다.

저장소 정의 가 모듈 특정 저장소를 확장 하면 특정 스프링 데이터 모듈에 대한 유효한 후보가됩니다.

```java

interface MyRepository extends JpaRepository<User, Long> { }

@NoRepositoryBean
interface MyBaseRepository<T, ID extends Serializable> extends JpaRepository<T, ID> {
  …
}

interface UserRepository extends MyBaseRepository<User, Long> {
  …
}

```

도메인 클래스 에 모듈 별 유형 주석 이 주석되어 있으면 특정 스프링 데이터 모듈에 대한 유효한 후보가됩니다. 
스프링 데이터 모듈은 제 3 자 애노테이션 (예 : JPA @Entity)을 허용하거나 자신의 애노테이션 (예 : @Document Spring Data MongoDB 및 Spring Data Elasticsearch)을 제공합니다.

```java

interface PersonRepository extends Repository<Person, Long> {
 …
}

@Entity
class Person {
  …
}

interface UserRepository extends Repository<User, Long> {
 …
}

@Document
class User {
  …
}

```

다음 예제는 제네릭 인터페이스를 사용하는 저장소를 보여줍니다.

```java

interface AmbiguousRepository extends Repository<User, Long> {
 …
}

@NoRepositoryBean
interface MyBaseRepository<T, ID extends Serializable> extends CrudRepository<T, ID> {
  …
}

interface AmbiguousUserRepository extends MyBaseRepository<User, Long> {
  …
}

```

AmbiguousRepository및 AmbiguousUserRepository 자신의 유형 계층 구조에서 Repository와 CrudRepository  단지 확장만 함. 
고유 한 스프링 데이터 모듈을 사용할 때 이것이 완벽하게 훌륭하지만, 
여러 모듈은이 리포지토리가 어느 특정 스프링 데이터에 바인드되어야 하는지를 구분할 수 없습니다.

위에 코드로는 바인딩 되지 않습니다.

또 잘못 된 예로 

```java

interface JpaPersonRepository extends Repository<Person, Long> {
 …
}

interface MongoDBPersonRepository extends Repository<Person, Long> {
 …
}

@Entity
@Document
class Person {
  …
}

```

이 예제는 JPA와 Spring Data MongoDB 어노테이션을 모두 사용하는 도메인 클래스를 보여준다.
그것은 다음에 두 개의 저장소를 정의 JpaPersonRepository 하고 MongoDBPersonRepository. 
하나는 JPA 용이고 다른 하나는 MongoDB 용입니다. 
Spring Data는 더 이상 리포지토리를 구분할 수 없으므로 정의되지 않은 동작이 발생합니다.

저장소 유형 세부 사항 과 구별되는 도메인 클래스 어노테이션 은 엄격한 저장소 구성에 사용되어 특정 스프링 데이터 모듈에 대한 저장소 후보를 식별합니다. 
동일한 도메인 유형에서 여러 지속성 기술 별 주석을 사용할 수 있으며 여러 지속성 기술에서 도메인 유형을 재사용 할 수 있습니다. 
그러나 스프링 데이터는 더 이상 저장소를 바인딩 할 고유 모듈을 결정할 수 없습니다.

저장소를 구별하는 마지막 방법은 저장소 기본 패키지를 범위 지정하는 것입니다. 
기본 패키지는 리포지토리 인터페이스 정의를 검색하기위한 시작 지점을 정의합니다. 
이는 리포지토리 정의가 적절한 패키지에 있음을 의미합니다. 
기본적으로 어너테이션 중심 구성에서는 구성 클래스의 패키지를 사용합니다. 
XML 기반 구성 의 기본 패키지 는 필수입니다.

```java

@EnableJpaRepositories(basePackages = "com.acme.repositories.jpa")
@EnableMongoRepositories(basePackages = "com.acme.repositories.mongo")
interface Configuration { }

```

# 참조
-----
* [spring-data-jpa reference](https://docs.spring.io/spring-data/jpa/docs/2.1.5.RELEASE/reference/html/#repositories)



