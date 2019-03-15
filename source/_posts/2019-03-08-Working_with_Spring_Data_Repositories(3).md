---
layout: post
title: "spring data jpa repositorys로 작업하기(Query Methods 정의)"
date: 2019-03-08 16:52 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## spring data jpa repositorys로 작업하기(Query Methods 정의)

저장소 프록시에는 메소드 이름에서 상점 특정 조회를 파생시키는 두 가지 방법이 있습니다.

* 메서드 이름에서 직접 쿼리를 파생시킵니다.
* 수동으로 정의 된 쿼리를 사용합니다.

사용 가능한 옵션은 실제 상점에 따라 다릅니다. 
그러나 실제로 작성된 쿼리를 결정하는 전략이 있어야합니다. 
다음 섹션에서는 사용 가능한 옵션에 대해 설명합니다.

### 쿼리 조회 전략

다음 전략은 쿼리를 해결하기 위해 저장소 인프라에 사용할 수 있습니다. 
XML 구성을 사용하면 query-lookup-strategy 특성을 통해 네임 스페이스에서 전략을 구성 할 수 있습니다. 
Java 구성 의 경우 Enable${store}Repositories 어너테이션의 queryLookupStrategy 속성을 사용할 수 있습니다.
일부 전략은 특정 데이터 저장소에 지원되지 않을 수 있습니다.

* CREATE - 조회 메소드 이름에서 상점 특정 조회를 구성하려고 시도합니다. 
일반적인 접근법은 메서드 이름에서 주어진 잘 알려진 접두어 집합을 제거하고 나머지 메서드를 구문 분석하는 것입니다. 

* USE_DECLARED_QUERY - 선언 된 쿼리를 찾으려고 시도하고 찾을 수없는 경우 예외를 throw합니다. 
질의는 어노테이션으로 정의되거나 다른 방법으로 선언 될 수 있습니다. 
해당 상점의 사용 가능한 옵션을 찾으려면 특정 상점의 문서를 참조하십시오. 
저장소 인프라가 부트 스트랩시 메소드에 대해 선언 된 쿼리를 찾지 못하면 실패합니다.

* CREATE_IF_NOT_FOUND(기본값) - CREATE 와 USE_DECLARED_QUERY 를 결합 합니다. 
먼저 선언 된 쿼리를 검색하고 선언 된 쿼리가 없으면 사용자 지정 메서드 이름 기반 쿼리를 만듭니다. 
이는 기본 조회 전략이므로 명시 적으로 구성하지 않은 경우에 사용됩니다. 
메소드 이름에 의한 빠른 질의 정의를 허용 할뿐만 아니라 필요에 따라 선언 된 질의를 도입함으로써 이러한 질의의 맞춤 튜닝을 가능하게합니다.

### 쿼리 생성

Spring Data repository 인프라에 내장 된 쿼리 작성기 메커니즘은 저장소의 엔티티에 대한 제약 쿼리를 ​​작성하는 데 유용합니다. 
메커니즘은 접두사 스트립 find…By, read…By, query…By, count…By, 및 get…By 상기 방법에서 그것의 나머지 부분을 파싱 시작한다. 

첫번째 Distinct 는 작성 될때 고유 플래그를 설정하는 것과 같은 추가 표현식이 포함될 수 있습니다. 
그러나 첫 번째 By는 실제 기준의 시작을 나타내는 구분 기호로 사용됩니다.
아주 기본적인 수준에서 개체 속성에 대한 조건을 정의하고 And Or 을 사용하여 연결함.
다음 예제에서는 여러 개의 쿼리를 만드는 방법을 보여줍니다.

```java

interface PersonRepository extends Repository<User, Long> {

  List<Person> findByEmailAddressAndLastname(EmailAddress emailAddress, String lastname);

  // Enables the distinct flag for the query
  List<Person> findDistinctPeopleByLastnameOrFirstname(String lastname, String firstname);
  List<Person> findPeopleDistinctByLastnameOrFirstname(String lastname, String firstname);

  // Enabling ignoring case for an individual property
  List<Person> findByLastnameIgnoreCase(String lastname);
  // Enabling ignoring case for all suitable properties
  List<Person> findByLastnameAndFirstnameAllIgnoreCase(String lastname, String firstname);

  // Enabling static ORDER BY for a query
  List<Person> findByLastnameOrderByFirstnameAsc(String lastname);
  List<Person> findByLastnameOrderByFirstnameDesc(String lastname);
}

```

메소드를 파싱 한 실제 결과는 쿼리를 생성하는 지속성 저장소에 따라 다릅니다. 
그러나 주의해야 할 몇 가지 일반적인 사항이 있습니다.

* 표현식은 일반적으로 연결될 수있는 연산자와 결합 된 속성 순회입니다. 
AND 및 OR로 특성 표현식을 결합 할 수 있습니다. 
당신은 또한 다음과 같은 Between, LessThan, GreaterThan, 및 Like속성 표현식을 가지고 지원받을 수 있다. 
지원되는 연산자는 데이터 저장소마다 다를 수 있으므로 참조 문서의 해당 부분을 참조하십시오.

* 메서드 파서는 IgnoreCase개별 속성 (예 findByLastnameIgnoreCase(…):) 또는 대소 문자 무시 (대개 String인스턴스 - 예 :findByLastnameAndFirstnameAllIgnoreCase(…))를 지원하는 유형의 모든 속성에 대한 플래그 설정 을 지원합니다. 
대소 문자를 무시할 수 있는지 여부는 상점별로 다를 수 있으므로 상점 별 조회 방법에 대해서는 참조 문서의 관련 절을 참조하십시오.

* OrderBy속성을 참조하는 쿼리 메서드에 절을 추가 하고 정렬 방향 (Asc또는 Desc)을 제공하여 정적 순서 지정을 적용 할 수 있습니다. 
동적 정렬을 지원하는 쿼리 메서드를 만들려면 Special parameter handling 를 참조하십시오.

### Property Expressions

Property Expressions은 앞의 예제에서와 같이 관리되는 엔터티의 직접 속성 만 참조 할 수 있습니다. 
쿼리를 만들 때 구문 분석 된 속성이 관리되는 도메인 클래스의 속성인지 확인해야합니다. 
그러나 중첩 된 속성을 탐색하여 제약 조건을 정의 할 수도 있습니다. 다음 메소드 서명을 고려하십시오.

```
List<Person> findByAddressZipCode(ZipCode zipCode);
```

위에 코드는 가정하고 있다 Person이 갖는 Address의 ZipCode가 있다고 이 경우 메서드는 순환 속성(x.address.zipCode)을 만듭니다.
해결 알고리즘은 전체 파트 (AddressZipCode)를 등록 정보로 해석하고 해당 이름을 가진 등록 정보 (도메인 화되지 않은 도메인 클래스)를 확인합니다.
알고리즘이 성공하면, 그 프로퍼티를 사용합니다. 그렇지 않은 경우 알고리즘은 오른쪽에서 머리와 꼬리까지 camel case인 경우 part를 소스로 분할하고 해당 속성 (예 : AddressZip및 Code) 을 찾습니다. 
알고리즘이 그 머리를 가진 프로퍼티를 찾으면, 그것은 꼬리를 가져다가 그곳에서부터 트리를 계속 만들고, 꼬리를 앞에서 설명한 것과 같이 위로 나눕니다. 
첫 번째 분할이 일치하지 않으면 알고리즘은 분할 점을 왼쪽 ( Address,ZipCode) 계속됩니다.

이것이 대부분의 경우에 효과가 있지만 알고리즘이 잘못된 속성을 선택할 수도 있습니다. 
Person클래스에도 addressZip속성 이 있다고 가정 해보십시오. 
알고리즘은 이미 첫 번째 분할 라운드에서 일치하고, 잘못된 속성을 선택하고, 실패 할 수 있습니다(유형에 addressZip아마도 code속성 이 없음 ).

이 모호성을 해결하기 위해 _메서드 이름 내부에서 순회 점을 수동으로 정의 할 수 있습니다. 
따라서 메소드 이름은 다음과 같습니다.

```java

List<Person> findByAddress_ZipCode(ZipCode zipCode);

```

밑줄 문자를 예약 된 문자로 처리하기 때문에 표준 Java 명명 규칙 (즉, 속성 이름에 밑줄을 사용하지 않고 대신에 낙타의 대문자 사용)을 따르는 것이 좋습니다.

### Special parameter handling

쿼리의 매개 변수를 처리하려면 앞의 예제에서 이미 설명한 메서드 매개 변수를 정의하십시오. 
그 외에도 인프라 스트럭처는 Pageable및 Sort와 같은 특정 유형을 인식 하여 동적으로 쿼리에 페이지 매김 및 정렬을 적용합니다. 
다음 예제는 이러한 기능을 보여줍니다.

```java

Page<User> findByLastname(String lastname, Pageable pageable);

Slice<User> findByLastname(String lastname, Pageable pageable);

List<User> findByLastname(String lastname, Sort sort);

List<User> findByLastname(String lastname, Pageable pageable);

```

첫 번째 방법은 org.springframework.data.domain.Pageable 인스턴스를 쿼리 메서드에 전달 하여 정적으로 정의 된 쿼리에 페이징을 동적으로 추가 할 수있게합니다. 
A Page는 사용 가능한 요소 및 페이지의 총 수를 알고 있습니다. 
전체 쿼리 수를 계산하기 위해 카운트 쿼리를 트리거하는 인프라가이를 수행합니다. 
이것은 사용 된 상점에 따라 비용이 많이들 수 있으므로 대신 a Slice를 리턴 할 수 있습니다. 
A Slice는 다음 결과 Slice를 사용할 수 있는지 여부 만 알고 있으며, 큰 결과 집합을 살펴볼 때 충분할 수 있습니다

정렬 옵션은 Pageable인스턴스를 통해 처리됩니다. 
정렬 만하면되고, org.springframework.data.domain.Sort메서드에 매개 변수를 추가 하십시오. 
보시다시피, a를 반환하는 List것도 가능합니다. 
이 경우 실제 Page 인스턴스를 작성 하는 데 필요한 추가 메타 데이터 가 작성되지 않습니다 (차례대로 필요한 추가 조회가 발행되지 않음을 나타냄).
오히려 주어진 엔티티 범위 만 조회하도록 쿼리를 제한합니다.

```
전체 쿼리에 대해 얼마나 많은 페이지를 얻으려면 추가 카운트 쿼리를 트리거해야합니다. 
기본적으로이 쿼리는 실제로 트리거하는 쿼리에서 파생됩니다.
```

### Limiting Query Results

쿼리 메서드의 결과는 first또는 top키워드 를 사용하여 제한 할 수 있으며이 키워드는 서로 바꿔서 사용할 수 있습니다. 
선택적인 숫자 값은 리턴 될 최대 결과 크기를 지정 top 하거나 first 지정할 수 있습니다. 
숫자를 생략하면 결과 크기는 1로 간주됩니다. 
다음 예에서는 쿼리 크기를 제한하는 방법을 보여줍니다.

```java

User findFirstByOrderByLastnameAsc();

User findTopByOrderByAgeDesc();

Page<User> queryFirst10ByLastname(String lastname, Pageable pageable);

Slice<User> findTop3ByLastname(String lastname, Pageable pageable);

List<User> findFirst10ByLastname(String lastname, Sort sort);

List<User> findTop10ByLastname(String lastname, Pageable pageable);

```

제한 표현식은 또한 Distinct키워드를 지원합니다. 
또한 결과 세트를 한 인스턴스로 제한하는 조회의 경우 결과를 Optional 키워드로 랩핑 할 수 있습니다.

페이지 매김이나 조각을 제한 쿼리 매김 (그리고 사용 가능한 페이지 수 계산)에 적용하면 제한된 결과 내에서 적용됩니다.

```
Sort매개 변수를 사용 하여 동적 정렬과 함께 결과를 제한하면 'K'가장 작은 요소와 'K'가장 작은 요소에 대한 쿼리 방법을 표현할 수 있습니다.
```

### Streaming query results

조회 메소드의 결과는 Java 8 Stream<T>을 리턴 유형으로 사용하여 점차적으로 처리 할 수 ​​있습니다. 
Stream데이터 저장소 에 쿼리 결과를 래핑하는 대신 다음 예제와 같이 스트리밍을 수행하는 데 특정 메서드가 사용됩니다.

```java

@Query("select u from User u")
Stream<User> findAllByCustomQueryAndStream();

Stream<User> readAllByFirstnameNotNull();

@Query("select u from User u")
Stream<User> streamAllPaged(Pageable pageable);

```

```

A는 Stream잠재적으로 기본 데이터 저장소 별 리소스를 래핑하고, 따라서 사용 후 닫아야합니다. 
Stream이 close()방법 을 사용하여 수동으로 닫거나 try-with-resources다음 예제와 같이 Java 7 블록 을 사용 하여 닫을 수 있습니다 .

```

```java

try (Stream<User> stream = repository.findAllByCustomQueryAndStream()) {
  stream.forEach(…);
}

```

```
현재 모든 Spring Data 모듈 Stream<T>이 리턴 타입으로 지원 되는 것은 아닙니다 .
```

### Async query results

리포지토리 쿼리는 Spring의 비동기 메서드 실행 기능 을 사용하여 비동기 적으로 실행할 수 있습니다. 
즉, 메소드는 실제 질의 실행이 Spring TaskExecutor에 제출 된 태스크에서 발생하는 동안 호출 즉시 반환됩니다. 
비동기 쿼리 실행은 응답 쿼리 실행과 다르므로 혼합해서는 안됩니다. 
대응 지원에 대한 자세한 내용은 상점 특정 문서를 참조하십시오. 
다음 예제에서는 여러 비동기식 쿼리를 보여줍니다.

```java

@Async
Future<User> findByFirstname(String firstname);             //(1)  

@Async
CompletableFuture<User> findOneByFirstname(String firstname);//(2) 

@Async
ListenableFuture<User> findOneByLastname(String lastname);    //(3)

```
1. 반환타입으로 java.util.concurrent.Future를 사용
1. 반환타입으로 Java 8 java.util.concurrent.CompletableFuture를 사용
1. 반환타입으로 org.springframework.util.concurrent.ListenableFuture를 사용


# 참조
-----
* [spring-data-jpa reference](https://docs.spring.io/spring-data/jpa/docs/2.1.5.RELEASE/reference/html/#repositories.query-methods.details)



