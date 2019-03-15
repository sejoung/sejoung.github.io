---
layout: post
title: "톰캣 데이터 소스 min-idle"
date: 2018-09-20 14:31 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 톰캣 데이터 소스 min-idle

작년 8월쯔음에 spring boot로 프로젝트를 하나 만들어서 진행했습니다. 
내부 임베디드 톰캣을 사용해서 서버를 기동시켰고 정상적으로 동작하는것으로 판단했습니다. 아래는 해당 프로젝트 설정 입니다.

스프링 부트 버전

```xml

	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>1.5.4.RELEASE</version>
	</parent>

```

자바 스프링 설정

```java

    @Bean(name = "poolProperties")
    @ConfigurationProperties(prefix = "slave")
    public PoolProperties getStatisticsSlavePoolProperties() {
        return new PoolProperties();
    }

    @Bean(name = "slaveJdbcDataSource")
    public DataSource statisticsSlaveJdbcDataSource(@Qualifier("slave") PoolProperties poolProperties) {
        log.debug("poolProperties "+poolProperties.getMinIdle());
        org.apache.tomcat.jdbc.pool.DataSource dataSource = new org.apache.tomcat.jdbc.pool.DataSource(poolProperties);
        return dataSource;
    }

```

프로퍼티 설정

```

slave.url=jdbc:mysql://172.20.0.106:3306/dreamsearch?autoReconnect=true&useUnicode=true&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=UTC&zeroDateTimeBehavior=convertToNull
slave.username=sjkim3
statisticsSlave.password=sjkim3!23$
slave.driver-class-name=com.mysql.cj.jdbc.Driver
slave.max-active=100
slave.max-wait=10000
slave.min-idle=30
slave.validation-query=SELECT 1
slave.time-between-eviction-runs-millis=5000
slave.min-evictable-idle-time-millis=3000
slave.test-while-idle=true
slave.test-on-borrow=true
slave.test-on-return=false

```

위에 처럼 기본 datasource 설정을 사용했는데 저기서 slave.min-idle 설정이 안됨 확인은 windows cmd 창에서 아래의 명령어 수행

```

netstat -ano | findstr 3306

```

poolProperties에서 못읽어 온줄 알고 min 값 찍어봄 잘됨 ㅡㅡ;;

앵 이상해서 tomcat jdbc pool 설정을 살펴 봄 initialSize 설정이 있음 기본이 10개군 그래서 계속 10개만 생김

```
initialSize	
(int)The initial number of connections that are created when the pool is started. Default value is 10

```

프로퍼티에 아래의 값을 추가해서 봄

```
slave.initial-size=30

```

굿 잘됨

참고로 신규로 만든 프로젝트는 히카리CP를 사용하게 함(스프링에서 기본으로 채택하고 있음) 거기선 아래의 프로퍼터로 제어함

```
spring.datasource.hikari.minimumIdle=1

```

# 참조 
-----
* [tomcat jdbc-pool](https://tomcat.apache.org/tomcat-8.5-doc/jdbc-pool.html)
* [HikariCP](https://github.com/brettwooldridge/HikariCP)
