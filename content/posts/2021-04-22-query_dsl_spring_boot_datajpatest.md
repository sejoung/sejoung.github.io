---
layout: post
title: "QuerydslRepositorySupport 상속 받은 클래스 @DataJpaTest 로 테스트 하기"
date: 2021-04-22 20:03 +0900
comments: true
tags : ["spring boot","@DataJpaTest","QueryDsl"]
categories : ["java"]
sitemap :
changefreq : daily
priority : 1.0
--->
# QuerydslRepositorySupport 상속 받은 클래스 @DataJpaTest 로 테스트 하기

## @DataJpaTest

```
org.springframework.beans.factory.NoSuchBeanDefinitionException:
```

기본적으로 in-memory embedded database를 생성하고 @Entity 클래스를 스캔합니다. 일반적인 다른 컴포넌트들은 스캔하지 않습니다.
[spring boot 공식문서](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-testing-spring-boot-applications-testing-autoconfigured-jpa-test)

다른 설정값들을 스캔하는 방법으로는 

`@Import` 사용해서 해당 클래스를 로드하거나 `@ComponentScan` 사용해서 스캔을 하거나 `@TestConfiguration` 사용해서 bean을 다시 등록하면 된다.

# 참고자료
* [Spring Boot Data Jpa 프로젝트에 Querydsl 적용하기](https://jojoldu.tistory.com/372)
* [stackoverflow datajpatest-needing-a-class-outside-the-test](https://stackoverflow.com/questions/41081589/datajpatest-needing-a-class-outside-the-test)
* [Spring Boot Test ](https://meetup.toast.com/posts/124)
* [boot-features-testing-spring-boot-applications-testing-autoconfigured-jpa-test](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-testing-spring-boot-applications-testing-autoconfigured-jpa-test)
