---
layout: post
title: "멀티 모듈로 @DataJpaTest 진행할때 오류"
date: 2021-04-21 09:51 +0900
comments: true
tags : ["gradle multi modules","spring boot","@DataJpaTest"]
categories : ["java"]
sitemap :
changefreq : daily
priority : 1.0
---
# 멀티 모듈로 @DataJpaTest 진행할때 오류

## Unable to find a @SpringBootConfiguration, you need to use @ContextConfiguration or @SpringBootTest(classes=...) with your test

멀티 모듈에서 실제 @SpringBootApplication 같은 Spring Context를 로드 하는 부분이 없어서 인데 이부분은 test코드에서 아래처럼 로드 하는 부분을 만들어 주면 된다.

```java

@SpringBootApplication
public class ApplicationTests {
  public void contextLoads() {}
}

```
## 별도의 DataSourceConfiguration 불러오기
@Import 어너테이션을 사용해서 로드

```java

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(DataSourceConfiguration.class)
public class RepositoryTest {
}

```

## The dependencies of some of the beans in the application context form a cycle

위에 내용은 순환 참조 내용인데 Bean 등록시 @DependsOn 을 할용해서 Bean들 간에 의존성을 정해주면 해결된다.

```java


@Configuration
public class DataSourceConfiguration {

    @Bean
    @ConfigurationProperties(prefix = "test.datasource-read")
    public DataSource readDataSource() {
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }

    @Bean
    @ConfigurationProperties(prefix = "test.datasource-write")
    public DataSource writeDataSource() {
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }

    @DependsOn({"readDataSource","writeDataSource"})
    @Bean
    public DataSource routingDataSource(@Qualifier("writeDataSource") DataSource writeDataSource,
                                        @Qualifier("readDataSource") DataSource readDataSource) {

        ReplicationRoutingDataSource routingDataSource = new ReplicationRoutingDataSource();
        Map<Object, Object> dataSourceMap = new HashMap<>();
        dataSourceMap.put("write", writeDataSource);
        dataSourceMap.put("read", readDataSource);
        routingDataSource.setTargetDataSources(dataSourceMap);
        routingDataSource.setDefaultTargetDataSource(readDataSource);

        return routingDataSource;
    }

    @DependsOn("routingDataSource")
    @Primary
    @Bean
    public DataSource dataSource(@Qualifier("routingDataSource") DataSource routingDataSource) {
        return new LazyConnectionDataSourceProxy(routingDataSource);
    }
}

```

## 테스트시에 실제 DB로 테스트 하기

@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE) 어너테이션을 활용하면 설정정보가 임베디드디비로 맴핑되는것을 방지할수있다.


# 참고자료
* [docker postgres](https://jojoldu.tistory.com/123)

