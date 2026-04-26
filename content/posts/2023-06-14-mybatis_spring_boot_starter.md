---
layout: post
title: "mybatis 멀티 모듈 셋팅시 Invalid bound statement (not found) 오류"
date: 2023-06-14 17:36 +0900
comments: true
tags: [ "Multi Module","mybatis","Invalid bound statement (not found)" ,"mapper-locations"]
categories: [ "java" ]
sitemap:
changefreq: daily
priority: 1.0
---

# mybatis 멀티 모듈 셋팅시 Invalid bound statement (not found) 오류

gradle 멀티 모듈을 셋팅하고 slice test로 mybatis 모듈이 정상적으로 기동이 되는데 
여러 모듈에 mybatis xml이 나눠줘있고 root 프로젝트에서 모듈을 추가 받아서 처리 하면 아래 와 같이 해당 mapper를 찾을수 없다고 나온다

```
org.apache.ibatis.binding.BindingException: Invalid bound statement (not found): persistence.rdbms.mybatis.arena.excel.repository.ArenaExcelMybatisRepository.selectKartRushArenaApplyUserList
	at org.apache.ibatis.binding.MapperMethod$SqlCommand.<init>(MapperMethod.java:229)
	at org.apache.ibatis.binding.MapperMethod.<init>(MapperMethod.java:53)
	at org.apache.ibatis.binding.MapperProxy.lambda$cachedInvoker$0(MapperProxy.java:96)
	at java.base/java.util.concurrent.ConcurrentHashMap.computeIfAbsent(ConcurrentHashMap.java:1708)
	at org.apache.ibatis.util.MapUtil.computeIfAbsent(MapUtil.java:36)
	at org.apache.ibatis.binding.MapperProxy.cachedInvoker(MapperProxy.java:94)
	at org.apache.ibatis.binding.MapperProxy.invoke(MapperProxy.java:86)

```

스프링 부트를 사용해서 mybatis 의 spring-boot-starter 를 사용해서 아래처럼 설정을 했다 

```yaml
mybatis:
  mapper-locations: classpath:mybatis/mapper/**/**/**.xml
```

아무리 해도 보이지 않아서 디버깅을 했는데 `org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration` 코드의 `this.properties.resolveMapperLocations`를 보면 되는데 아래의 코드 이다

```java
@org.springframework.context.annotation.Configuration
@ConditionalOnClass({ SqlSessionFactory.class, SqlSessionFactoryBean.class })
@ConditionalOnSingleCandidate(DataSource.class)
@EnableConfigurationProperties(MybatisProperties.class)
@AutoConfigureAfter({ DataSourceAutoConfiguration.class, MybatisLanguageDriverAutoConfiguration.class })
public class MybatisAutoConfiguration implements InitializingBean {
    ....
    @Bean
    @ConditionalOnMissingBean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        SqlSessionFactoryBean factory = new SqlSessionFactoryBean();
        factory.setDataSource(dataSource);
        factory.setVfs(SpringBootVFS.class);
        .....
        Resource[] mapperLocations = this.properties.resolveMapperLocations();
        if (!ObjectUtils.isEmpty(mapperLocations)) {
            factory.setMapperLocations(mapperLocations);
        }
        ...
        return factory.getObject();
    }
}
```

보면 리소스 패턴을 찾는데 spring의 `PathMatchingResourcePatternResolver` 를 사용해서 찾는다 그래서 `PathMatchingResourcePatternResolver` 코드를 보니

```java

public class PathMatchingResourcePatternResolver implements ResourcePatternResolver {
    @Override
    public Resource[] getResources(String locationPattern) throws IOException {
        Assert.notNull(locationPattern, "Location pattern must not be null");
        if (locationPattern.startsWith(CLASSPATH_ALL_URL_PREFIX)) {
            // a class path resource (multiple resources for same name possible)
            if (getPathMatcher().isPattern(locationPattern.substring(CLASSPATH_ALL_URL_PREFIX.length()))) {
                // a class path resource pattern
                return findPathMatchingResources(locationPattern);
            }
            else {
                // all class path resources with the given name
                return findAllClassPathResources(locationPattern.substring(CLASSPATH_ALL_URL_PREFIX.length()));
            }
        }
        else {
            // Generally only look for a pattern after a prefix here,
            // and on Tomcat only after the "*/" separator for its "war:" protocol.
            int prefixEnd = (locationPattern.startsWith("war:") ? locationPattern.indexOf("*/") + 1 :
                locationPattern.indexOf(':') + 1);
            if (getPathMatcher().isPattern(locationPattern.substring(prefixEnd))) {
                // a file pattern
                return findPathMatchingResources(locationPattern);
            }
            else {
                // a single resource with the given name
                return new Resource[] {getResourceLoader().getResource(locationPattern)};
            }
        }
    }
}
```

```java
public interface ResourcePatternResolver extends ResourceLoader {

	/**
	 * Pseudo URL prefix for all matching resources from the class path: "classpath*:"
	 * <p>This differs from ResourceLoader's classpath URL prefix in that it
	 * retrieves all matching resources for a given name (e.g. "/beans.xml"),
	 * for example in the root of all deployed JAR files.
	 * @see org.springframework.core.io.ResourceLoader#CLASSPATH_URL_PREFIX
	 */
	String CLASSPATH_ALL_URL_PREFIX = "classpath*:";

	/**
	 * Resolve the given location pattern into {@code Resource} objects.
	 * <p>Overlapping resource entries that point to the same physical
	 * resource should be avoided, as far as possible. The result should
	 * have set semantics.
	 * @param locationPattern the location pattern to resolve
	 * @return the corresponding {@code Resource} objects
	 * @throws IOException in case of I/O errors
	 */
	Resource[] getResources(String locationPattern) throws IOException;

}
```

특별한 프리픽스를 사용하는데 `classpath*:` 이다 
스프링 6.0 부터 추가 되었다고 하고 `classpath:` 이것은 제일 처음 매칭되는 값을 하나만 가지고 오고 `classpath*:` 는 전체를 모두 가지고 오게 된다 

```yaml
mybatis:
  mapper-locations: classpath*:mybatis/mapper/**/**/**.xml
```

이렇게 사용하면 전체 모듈을 스캔해서 리소스를 찾게 된다

# 참조
-----

* [PathMatchingResourcePatternResolver doc](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/core/io/support/PathMatchingResourcePatternResolver.html)
* [mybatis spring-boot-starter](https://mybatis.org/spring-boot-starter/)
