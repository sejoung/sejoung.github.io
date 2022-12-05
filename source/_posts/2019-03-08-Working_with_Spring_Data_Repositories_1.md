---
layout: post
title: "spring data jpa repositorys로 작업하기(핵심 개념 및 Query methods)"
date: 2019-03-08 14:07 +0900
comments: true
tags : ["spring","spring data jpa"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## spring data jpa repositorys로 작업하기(핵심 개념 및 Query methods)

### 핵심개념

스프링 데이터 저장소 추상화의 중심 Repository 인터페이스는 다음과 같습니다. 

도메인 클래스의 ID 유형뿐만 아니라 관리 할 도메인 클래스도 유형 인수로 사용합니다. 
이 인터페이스는 주로 작업 할 유형을 캡처하고이 인터페이스를 확장하는 인터페이스를 찾는 데 도움이되는 마커 인터페이스로 사용됩니다. 
CrudRepository 인터페이스는 관리되는 엔티티 클래스에 대한 정교한 CRUD 기능을 제공합니다.

```java

public interface CrudRepository<T, ID extends Serializable>
  extends Repository<T, ID> {

  <S extends T> S save(S entity);      // (1)

  Optional<T> findById(ID primaryKey);  // (2)

  Iterable<T> findAll();               // (3) 

  long count();                         // (4)

  void delete(T entity);                // (5)

  boolean existsById(ID primaryKey);    // (6)

  // … more functionality omitted. 
}

```

1. 지정된 엔티티를 저장합니다.
1. 지정된 ID로 식별되는 엔티티를 리턴합니다.
1. 모든 엔터티를 반환합니다.
1. 엔티티의 수를 돌려줍니다.
1. 지정된 엔티티를 삭제합니다.
1. 주어진 ID를 가진 엔티티가 존재하는지 여부를 나타냅니다.

맨 위에 User 엔티티에 Paging 그리고 Sorting 된 액세스를 쉽게하기위한 
CrudRepository 인터페이스에 추가 메소드가 추가 된 PagingAndSortingRepository 인터페이스가 있습니다.

```java

public interface PagingAndSortingRepository<T, ID extends Serializable>
  extends CrudRepository<T, ID> {

  Iterable<T> findAll(Sort sort);

  Page<T> findAll(Pageable pageable);
}

```

User의 페이지 크기가 20 인 두 번째 페이지에 액세스하려면 다음과 같이 할 수 있습니다.

```java

PagingAndSortingRepository<User, Long> repository = // … get access to a bean
Page<User> users = repository.findAll(PageRequest.of(1, 20));

```
쿼리 메서드 외에도 개수 및 삭제 쿼리에 대한 쿼리 파생을 사용할 수 있습니다. 

다음 목록은 파생 된 개수 쿼리의 인터페이스 정의를 보여줍니다.

```java

interface UserRepository extends CrudRepository<User, Long> {

  long countByLastname(String lastname);
}

```

다음 목록은 파생 된 삭제 쿼리의 인터페이스 정의를 보여줍니다.

```java

interface UserRepository extends CrudRepository<User, Long> {

  long deleteByLastname(String lastname);

  List<User> removeByLastname(String lastname);
}

```

### Query methods

표준 CRUD 기능 저장소는 일반적으로 기본 데이터 저장소에 대한 쿼리를 가지고 있습니다. 
Spring 데이터를 사용하면 이러한 쿼리를 선언하는 것이 4 단계 프로세스가됩니다.

* 다음 예와 같이 Repository 또는 하위 인터페이스 중 하나를 확장하는 인터페이스를 선언하고 처리 할 도메인 클래스 및 ID 유형을 입력하십시오.
  
```java

interface PersonRepository extends Repository<Person, Long> { … }


```

* 인터페이스에서 쿼리 메서드를 선언하십시오.
  
```java

interface PersonRepository extends Repository<Person, Long> {
  List<Person> findByLastname(String lastname);
}

```

* JavaConfig 또는 XML 구성을 사용하여 해당 인터페이스에 대한 프록시 인스턴스를 만들려면 Spring을 설정하십시오 .

Java 구성을 사용하려면 다음과 유사한 클래스를 작성하십시오.
    
```java

import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories
class Config {}

```

XML 구성을 사용하려면 다음과 유사한 bean을 정의하십시오.

```xml

<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xmlns:jpa="http://www.springframework.org/schema/data/jpa"
   xsi:schemaLocation="http://www.springframework.org/schema/beans
     http://www.springframework.org/schema/beans/spring-beans.xsd
     http://www.springframework.org/schema/data/jpa
     http://www.springframework.org/schema/data/jpa/spring-jpa.xsd">

   <jpa:repositories base-package="com.acme.repositories"/>

</beans>

```      

이 예에서는 JPA 네임 스페이스가 사용됩니다. 
다른 저장소에 대한 저장소 추상화를 사용하는 경우 이를 저장소 모듈의 적절한 네임 스페이스 선언으로 변경해야합니다.

또한  annotated class 의 패키지가 기본적으로 사용되기 때문에 JavaConfig 변형은 패키지를 명시 적으로 구성하지 않습니다. 
검사 할 패키지를 사용자 정의하려면 basePackage…데이터 저장소 별 저장소의 @Enable${store}Repositories주석 중 하나를 사용하십시오 .

```java
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories
@EnableJpaRepositories
class Config {}

```

다음 예와 같이 저장소 인스턴스를 주입하고 사용하십시오.

```java

class SomeClient {

  private final PersonRepository repository;

  SomeClient(PersonRepository repository) {
    this.repository = repository;
  }

  void doSomething() {
    List<Person> persons = repository.findByLastname("Matthews");
  }
}

```


# 참조
-----
* [spring-data-jpa reference](https://docs.spring.io/spring-data/jpa/docs/2.1.5.RELEASE/reference/html/#repositories)



