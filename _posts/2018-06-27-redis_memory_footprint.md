---
layout: post
title: "Redis 용량산정을 위한 메모리 사용조사"
date: 2018-06-27 11:43:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### Redis 용량산정을 위한 메모리 사용조사

3년전에 테스트한 자료를 바탕으로 적었습니다.

레디스 공식 사이트 faq에 나와 있는 정보

```

What's the Redis memory footprint?
To give you a few examples (all obtained using 64-bit instances):
An empty instance uses ~ 1MB of memory.
1 Million small Keys -> String Value pairs use ~ 100MB of memory.
1 Million Keys -> Hash value, representing an object with 5 fields, use ~ 200 MB of memory.
To test your use case is trivial using the redis-benchmark utility to generate random data sets and check with the INFO memory command the space used.
64 bit systems will use considerably more memory than 32 bit systems to store the same keys, especially if the keys and values are small, this is because pointers takes 8 bytes in 64 bit systems. But of course the advantage is that you can have a lot of memory in 64 bit systems, so in order to run large Redis servers a 64 bit system is more or less required. The alternative is sharding.

```
위에 내용을 바탕으로 테스트 진행

백만개의 간단한 키와 문자열값 일때 100MB의 메모리를 사용한다고 함

백만개의 키와 해쉬값 일때 200MB의 메모리를 사용한다고 함

모니터링 툴은 [redis-stat](https://github.com/junegunn/redis-stat) 를 사용해서 모니터링 함 
테스트 redis 버전은 3.0버전으로 테스트 환경은 가상화머신으로 테스트

```
GUESTOS : osx 요세미티 
가상 OS : 우분투 14.04 램 2기가 cpu 2core
```
#### 간단한키 와 문자열값 으로 메모리 사용량을 테스트함

```
key (10byte) + value(20byte) * 1000000

최초 메모리 사용량 : 1.82MB
메모리 사용량_rss : 12.8MB

최종 메모리 : 117MB
최종 메모리_rss : 127MB
```

#### 간단한키 와 해쉬값으로 메모리 사용량을 테스트함

```
key (10byte) + hash(key(10byte)+value(10byte)) * 1000000

최초 메모리 사용량 : 1.82MB
메모리 사용량_rss : 12.8MB

최종 메모리 : 132MB
최종 메모리_rss : 142MB
```

#### 간단한키 와 해쉬값으로 가용 메모리 초과시 상태 테스트

```
메모리 초과시 스왑메모리 사용

메모리 초과시 스왑메모리 off 후에 테스트 
메모리 사용량이 초과면 자동으로 Redis서버가 정지 아래의 에러메시지 출력

마스터만 정지 슬레이브는 미정지됨 가용메모리를 초과되지 않음

[2015/04/20 15:32:58@127.0.0.1:6379] Error connecting to Redis on 127.0.0.1:6379 (ECONNREFUSED)
```

#### LRU(Least Recently Used)

메모리 사용 최대 사용시 정책을 정해서 사용을 하면 될것 같다

정책은 LRU(Least Recently Used)알고리즘을 기반으로 하고 있는데 
말 그대로 가장 오래 사용되지 않았던 것부터 찾는 알고리즘 이다.

```
maxmemory-policy volatile-lru

maxmemory 에서 설정한 메모리 를 초과해서 데이타를 쓰려고 할 경우의 정책 설정 부분으로 아래와 같은 옵션이 있다.
    volatile-lru : (기본값) 만기시각이 설정된 key 들 중에서 LRU algorithm 에 의해 key 를 골라 삭제
    allkeys-lru : LRU algorithm 에 의해 key 를 골라 삭제
    volatile-random : 만기시각이 설정된 key 들 중에서 랜덤하게 key 를 골라 삭제
    allkeys-random : 랜덤하게 key 를 골라 삭제
    volatile-ttl : 만기시각이 설정된 key 들 중에서 만기시각이 가장 가까운 key 를 골라 삭제
    noeviction : 어떤 key 도 삭제하지 않고 error on write operations 를 돌려준다.
```

#### hgetall과 hmget의 속도 차이

필드가 많이 늘어나면 늘어날수록은 차이가 있겠지만 적당한 길이에선 차이가 거의 없는것 같다
다만 hmget을 쓰면 원하는 값이 어떻게 리턴되는지도 정해지기 떄문에 더 추천하는것 같다.


# 참조 
-----
* [redis.io faq](http://redis.io/topics/faq)
* [redis-stat](https://github.com/junegunn/redis-stat)
* [redis.io lru-cache](http://redis.io/topics/lru-cache)