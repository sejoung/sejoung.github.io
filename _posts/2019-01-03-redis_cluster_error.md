---
layout: post
title: "레디스 클러스터 에러"
date: 2019-01-03 10:49 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 레디스 클러스터 에러

현재 운영시스템에서 레디스를 클러스터로 운영하고 있는데 운영중인 클러스터에 장비 하나가 셧다운 되면서
슬래이브가 마스터로 승격이 되는 과정이 있었는데 이과정에서 운영중인 클라이언트쪽이 문제가 생겨서 서비스에
장애가 생겼다.

운영중인 환경은 자바로 만들어진 환경이며 지금 jedis를 사용하고 있다. 

jedis버전은

```xml
<!-- https://mvnrepository.com/artifact/redis.clients/jedis -->
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>2.8.1</version>
</dependency>

```

그럼 위에 버전을 기준으로 테스트를 하려고 한다.

테스트 시나리오는 레디스 클러스터를 뛰어 놓고 클러스터에 마스터 1대를 셧타운시키면서 서비스에 문제가 없는지 테스트 하려고 한다.

첫번째 위에 jedis 클라이언트 버전으로 테스트를 진행하고 최종은 12월 27일에 업데이트된 버전 3.0.1 버전을 하려고 한다.

```xml

<!-- https://mvnrepository.com/artifact/redis.clients/jedis -->
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>3.0.1</version>
</dependency>

```

위에 버전과 별도로 lettuce를 사용하여서도 테스트 예정이다.

```xml

<dependency>
  <groupId>io.lettuce</groupId>
  <artifactId>lettuce-core</artifactId>
  <version>5.1.3.RELEASE</version>
</dependency>

```

redis cluster 구성은 vagrant 할것이다. 아래의 git에서 설정파일을 받고 명령어를 실행해보겠다.

[vagrant-redis-cluster](https://github.com/sejoung/vagrant-redis-cluster)

우리랑 똑같이 클러스터 구성이 되있는 구조이다. 3 master & 3 slaves 이고 마스터 1개에 슬래이브 1개 구조로 진행

소스를 다운 받고 압축을 푼다 

![redistest UI1](https://sejoung.github.io/images/2019_01_03_01.jpg){: width="100%"}{: .center}

cmd 창을 열고 압축푼 폴더로 이동하고 아래의 명령어를 실행시킨다.

```
vagrant plugin install vagrant-vbguest

```

![redistest UI2](https://sejoung.github.io/images/2019_01_03_02.jpg){: width="100%"}{: .center}

실행이 다된후에 

```

vagrant up

```

![redistest UI3](https://sejoung.github.io/images/2019_01_03_03.jpg){: width="100%"}{: .center}

위 에러 나서 보면 버츄얼박스가 없다 다운로드후에 인스톨

다시 위에 명령어 실행

그럼 레디스 상태를 보면 

```

vagrant ssh

```

접속후

```

redis-cli -p 7000

```

레디스 cli에서 아래의 명령어 실행

```

cluster nodes

```
실행내역
```
5bea15c281e928c4d8ea3a5656ee8aab1f2f6556 127.0.0.1:7004 slave a792d30f58499d11e972a40f8e3c0502bbba8533 0 1546505474043 5 connected
a792d30f58499d11e972a40f8e3c0502bbba8533 127.0.0.1:7001 master - 0 1546505475057 2 connected 5461-10922
bbfbdb452c8ec6c53bd1c557fa08d3101a0a3a84 127.0.0.1:7002 master - 0 1546505478100 3 connected 10923-16383
65ff0ed82f10c81d61c9eb934c02ba3b73faae08 127.0.0.1:7005 slave bbfbdb452c8ec6c53bd1c557fa08d3101a0a3a84 0 1546505477086 6 connected
74d6d0ed17cdb80abac4665141121abe326fa2a5 127.0.0.1:7000 myself,master - 0 0 1 connected 0-5460
3e3c781ee38eaab7d25a904636e76a77fa1e52da 127.0.0.1:7003 slave 74d6d0ed17cdb80abac4665141121abe326fa2a5 0 1546505476073 4 connected
```

웹으로도 볼수 있습니다.

```
http://localhost:8080/
```


테스트 코드 만듬

```java

package com.github.sejoung.test;

import com.github.sejoung.util.RandomUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class TestController {
    public static Logger log = LoggerFactory.getLogger(TestController.class);

    private final StringRedisTemplate redisTemplate;

    private final RandomUtil randomUtil;

    private final String KEY = "TEST:";


    public TestController(StringRedisTemplate redisTemplate, RandomUtil randomUtil) {
        this.redisTemplate = redisTemplate;
        this.randomUtil = randomUtil;
    }

    @GetMapping("insert")
    @ResponseBody
    public String insert() {

        redisTemplate.opsForValue().set(KEY + "1", "1");
        redisTemplate.opsForValue().set(KEY + "2", "2");
        redisTemplate.opsForValue().set(KEY + "3", "3");
        redisTemplate.opsForValue().set(KEY + "4", "4");
        redisTemplate.opsForValue().set(KEY + "5", "5");
        redisTemplate.opsForValue().set(KEY + "6", "6");
        return "Hello World!";
    }

    @GetMapping("select")
    @ResponseBody
    public String select() {
        return redisTemplate.opsForValue().get(KEY + randomUtil.randomRange());
    }

}

```


```
http://localhost:9090/insert
```
위에 url로 접속 하면 스프링을 통해서 6개 데이터를 레디스에 넣는다

아래 url은 조회

```
http://localhost:9090/select

```

실행결과 안됨 ㅜㅜ

```

2019-01-03 18:06:48.360  INFO 31412 --- [ioEventLoop-4-2] i.l.core.protocol.ReconnectionHandler    : Reconnected to localhost:7000
2019-01-03 18:06:48.360  INFO 31412 --- [ioEventLoop-4-1] i.l.core.protocol.ReconnectionHandler    : Reconnected to 127.0.0.1:7000
2019-01-03 18:06:48.462  INFO 31412 --- [ioEventLoop-4-3] i.l.core.protocol.ReconnectionHandler    : Reconnected to 127.0.0.1:7000
2019-01-03 18:06:48.466  INFO 31412 --- [ioEventLoop-4-4] i.l.core.protocol.ReconnectionHandler    : Reconnected to localhost:7000
2019-01-03 18:06:48.560  INFO 31412 --- [ioEventLoop-4-2] i.l.core.protocol.ReconnectionHandler    : Reconnected to localhost:7000
2019-01-03 18:06:48.560  INFO 31412 --- [ioEventLoop-4-1] i.l.core.protocol.ReconnectionHandler    : Reconnected to 127.0.0.1:7000
2019-01-03 18:06:48.661  INFO 31412 --- [ioEventLoop-4-4] i.l.core.protocol.ReconnectionHandler    : Reconnected to localhost:7000
2019-01-03 18:06:48.661  INFO 31412 --- [ioEventLoop-4-3] i.l.core.protocol.ReconnectionHandler    : Reconnected to 127.0.0.1:7000
2019-01-03 18:06:48.761  INFO 31412 --- [ioEventLoop-4-2] i.l.core.protocol.ReconnectionHandler    : Reconnected to localhost:7000
2019-01-03 18:06:48.761  INFO 31412 --- [ioEventLoop-4-1] i.l.core.protocol.ReconnectionHandler    : Reconnected to 127.0.0.1:7000
2019-01-03 18:06:48.860  INFO 31412 --- [ioEventLoop-4-4] i.l.core.protocol.ReconnectionHandler    : Reconnected to 127.0.0.1:7000
2019-01-03 18:06:48.860  INFO 31412 --- [ioEventLoop-4-3] i.l.core.protocol.ReconnectionHandler    : Reconnected to localhost:7000
2019-01-03 18:06:48.959  INFO 31412 --- [xecutorLoop-1-4] i.l.core.protocol.ConnectionWatchdog     : Reconnecting, last destination was localhost/127.0.0.1:7000

```

master-slave set의 단인 앤드포인트는 다양한 방법으로 서비스 될수있는데  virtual IP를 통해 다시 재맵핑을 하는 방법을 사용 해야 될것같다.


그럼 클러스터 failover 되었을때 테스트 진행

```

redis-cli -p 7004 

cluster nodes

cluster failover

cluster nodes

```

# 참조
-----
* [cluster-spec](https://redis.io/topics/cluster-spec)
* [jedis](https://github.com/xetorthio/jedis)
* [테스트 코드](https://github.com/sejoung/vagrant-redis-cluster)
* [spring-boot redis doc](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-nosql.html#boot-features-redis)
* [lettuce](https://github.com/lettuce-io/lettuce-core/)
* [vagrant-redis-cluster](https://github.com/sejoung/vagrant-redis-cluster)
* [vagrant 처음 사용해 보기](https://sejoung.github.io/2018/06/vagrant_GettingStarted)
* [virtualbox Downloads](https://www.virtualbox.org/wiki/Downloads)
* [high-availability-with-redis-sentinels-connecting](https://dzone.com/articles/high-availability-with-redis-sentinels-connecting)
