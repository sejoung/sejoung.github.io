---
layout: post
title: "postgresql에서 jpa 자동 키 생성 오류"
date: 2021-09-16 20:48 +0900
comments: true
tags : ["jpa","hibernate","postgresql","@Id","@GeneratedValue(strategy = GenerationType.IDENTITY)","SQL Error: 0, SQLState: 42P01","ERROR: relation","sequence name","serial"]
categories : ["java"]
sitemap :
changefreq : daily
priority : 1.0
--->
# postgresql에서 jpa 자동 키 생성 오류

jpa에서 insert를 하는데 계속 오류메시지를 내뱉었다. 일단 구현체는 hibernate를 사용했는데 내가 무슨 관계를 잘못 맺은줄 알고 무려 이틀을 소모한뒤 동료들과 논의 했을때도 오류를 찾지 못했다.
내가 잘 모르고 사용했던것 같다 여기서 자동 키 맵핑 전략을 가지고 갔는데 이것이 문제였다.

아래 처럼 아주 간단한 클래스가 있다.

```java

package io.github.sejoung.jpa.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class IronManAndCaptainAmericaAndHulkAndThor {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long ironManAndCaptainAmericaAndHulkAndThorId;

	private String name;

	public IronManAndCaptainAmericaAndHulkAndThor(String name) {
		this.name = name;
	}
}


```

아래 처럼 Repository를 만들고 

```java

package io.github.sejoung.jpa.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import io.github.sejoung.jpa.domain.IronManAndCaptainAmericaAndHulkAndThor;

public interface IronManAndCaptainAmericaAndHulkAndThorRepository extends JpaRepository<IronManAndCaptainAmericaAndHulkAndThor,Long> {

}


```

```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class IronManAndCaptainAmericaAndHulkAndThorRepositoryTest {

	@Autowired
	private IronManAndCaptainAmericaAndHulkAndThorRepository repository;

	@DisplayName("에러남")
	@Test
	void error() {
		var actual = repository.save(new IronManAndCaptainAmericaAndHulkAndThor("아이언맨"));
	}
}
```

위처럼 save를 하는 순간 에러가 나온다. 

```
insert 
        into
            iron_man_and_captain_america_and_hulk_and_thor
            (name) 
        values
            (?)
Hibernate: 
    select
        currval('iron_man_and_captain_america_and_hulk_and_thor_iron_man_and_captain_america_and_hulk_and_thor_id_seq')
2021-09-16 23:12:46.254  WARN 17962 --- [    Test worker] o.h.engine.jdbc.spi.SqlExceptionHelper   : SQL Error: 0, SQLState: 42P01
2021-09-16 23:12:46.254 ERROR 17962 --- [    Test worker] o.h.engine.jdbc.spi.SqlExceptionHelper   : ERROR: relation "iron_man_and_captain_america_and_hulk_and_thor_iron_man_and_cap" does not exist
  Position: 16

```

멘붕이 와서 구글링을 했지만 찾지를 못했다. 하이버네이트에서 자동생성키를 어떻게 생성하는지 알아야 된다. 

postgresql에서는 자동생성키를 [postgresql DATATYPE-SERIAL](https://www.postgresql.org/docs/12/datatype-numeric.html#DATATYPE-SERIAL) 타입을 가지고 생성을 한다.
문서에 보면 SERIAL 유형은 실제 유형이 아니라 고유 식별자 열을 생성하기 위한 편의상의 표현이라고 한다. 

```sql

CREATE TABLE tablename (
    colname SERIAL
);

CREATE SEQUENCE tablename_colname_seq AS integer;
CREATE TABLE tablename (
    colname integer NOT NULL DEFAULT nextval('tablename_colname_seq')
);
ALTER SEQUENCE tablename_colname_seq OWNED BY tablename.colname;

```
내부적으로는 위처럼 테이블을 생성할때 숫자형 타입을 만들면서 거기에 대입되는 SEQUENCE를 만들고 DEFAULT제약을 통해서 SEQUENCE를 맵핑하는 구조이다.

위처럼 자동적으로 맵핑이 되는데 여기서 문제가 생겼다.

저기위에 보면 SEQUENCE 생성규칙이 테이블명_컬럼명_seq로 생성이 되어야 된다. 그래서 위에 오류를 보면 규칙에 맞게 SEQUENCE를 호출을 한다. 근데 SEQUENCE를 찾지 못한다고 한다.

왜 찾지 못할까? 그럼 다시 만들어진 SEQUENCE명은 뭐지 찾아 보려고 했다. 

[postgresql System Catalog Information Functions](https://www.postgresql.org/docs/current/functions-info.html#FUNCTIONS-INFO-CATALOG-TABLE) 을 보면

`pg_get_serial_sequence` 라고 하는 function 이 존재한다. SERIAL 필드에 맵핑된 SEQUENCE명을 찾아 볼수있는 function 이다. 

그래서 간단한 테스트 코드를 하나 만들었다.

```java
package io.github.sejoung.jpa.repository;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.InvalidDataAccessResourceUsageException;
import org.springframework.jdbc.core.JdbcTemplate;

import io.github.sejoung.jpa.annotation.SejoungDataJpaTest;
import io.github.sejoung.jpa.domain.IronManAndCaptainAmericaAndHulkAndThor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@SejoungDataJpaTest
class IronManAndCaptainAmericaAndHulkAndThorRepositoryTest {

    @Autowired
    private IronManAndCaptainAmericaAndHulkAndThorRepository repository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @DisplayName("에러남")
    @Test
    void error() {
        var actual = assertThrows(
            InvalidDataAccessResourceUsageException.class,
            () -> repository.save(new IronManAndCaptainAmericaAndHulkAndThor("아이언맨")));
        assertThat(actual.getMessage()).isEqualTo(
            "could not extract ResultSet; SQL [n/a]; nested exception is org.hibernate.exception.SQLGrammarException: could not extract ResultSet");
    }

    @DisplayName("에러 이유 확인")
    @Test
    void seqName() {
        var actual = jdbcTemplate.queryForObject(
            "select pg_get_serial_sequence('iron_man_and_captain_america_and_hulk_and_thor','iron_man_and_captain_america_and_hulk_and_thor_id')",
            String.class);
        log.debug("{}", actual);
        assertThat(actual).isEqualTo(
            "public.iron_man_and_captain_america_and_hulk_and_thor_iron_man_and_captain_america_and_hulk_and_thor_id_seq");
    }
}

```

여기서 예상대로라면 오류가 나면 되지 않는다. 하지만 오류가 났다.

```
Expecting:
 <"public.iron_man_and_captain_america__iron_man_and_captain_america__seq">
to be equal to:
 <"public.iron_man_and_captain_america_and_hulk_and_thor_iron_man_and_captain_america_and_hulk_and_thor_id_seq">
but was not.
	at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
	at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:62)
	at java.base/jdk.internal.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
```
시퀀스 명이 완전 틀리게 변했다.

이 내용은 postgresql 문서에도 없다 이것을 찾는데 이틀정도를 날렸다. 잘 공부해 둬야겠다.

# 참고자료

-----

* [postgresql System Catalog Information Functions](https://www.postgresql.org/docs/current/functions-info.html#FUNCTIONS-INFO-CATALOG-TABLE)
* [postgresql DATATYPE-SERIAL](https://www.postgresql.org/docs/12/datatype-numeric.html#DATATYPE-SERIAL)
* [하이버네이트는 어떻게 자동 키 생성 전략을 결정하는가](https://www.popit.kr/%ED%95%98%EC%9D%B4%EB%B2%84%EB%84%A4%EC%9D%B4%ED%8A%B8%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%9E%90%EB%8F%99-%ED%82%A4-%EC%83%9D%EC%84%B1-%EC%A0%84%EB%9E%B5%EC%9D%84-%EA%B2%B0%EC%A0%95%ED%95%98/)
* [PostgreSQL10IdentityColumnSupport.java](https://github.com/hibernate/hibernate-orm/blob/e76241a3091078713dd4b57de085f5fadce5e0db/hibernate-core/src/main/java/org/hibernate/dialect/identity/PostgreSQL10IdentityColumnSupport.java)
