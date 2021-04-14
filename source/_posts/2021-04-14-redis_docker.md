---
layout: post
title: "레디스(redis) 도커로 설치"
date: 2021-04-14 01:00 +0900
comments: true
tags : ["redis","레디스","nosql","docker","레디스 도커","redis docker"]
categories : ["db"]
sitemap :
changefreq : daily
priority : 1.0
---
# 레디스(redis) 도커로 설치

## docker 실행

```

docker run --name test-redis -d --restart=always -v /Users/beni/redis:/log -p 6379:6379 redis:6.2-alpine redis-server --logfile /log/redis-server.log --save "" --appendonly no --databases 1 --maxmemory 4G --maxmemory-policy allkeys-lru

docker run --name redis-stat --link test-redis:redis -p 8080:63790 -d insready/redis-stat:latest --server redis

```

## docker-compose 실행

```
docker-compose -f docker-compose-redis.yml up -d

docker-compose -f docker-compose-redis.yml down

```

* save "" : 디폴트 값을 삭제 처리(save 60 10000)
* appendonly no : AOF 파일 저장 하지 않음
* databases : 데이터 베이스 갯수
* maxmemory : 최대 메모리 용량
* maxmemory-policy : 최대 메모리 도달했을때 메모리 정책

## maxmemory-policy
maxmemory 에서 설정한 메모리 를 초과해서 데이타를 쓰려고 할 경우의 정책 설정 부분으로 아래와 같은 옵션이 있다.

* volatile-lru : (기본값) 만기시각이 설정된 key 들 중에서 LRU algorithm 에 의해 key 를 골라 삭제
* allkeys-lru : LRU algorithm(LRU 알고리즘 : 가장 오랫동안 참조되지 않은 페이지를 교체하는 기법) 에 의해 key 를 골라 삭제
* volatile-random : 만기시각이 설정된 key 들 중에서 랜덤하게 key 를 골라 삭제
* allkeys-random : 랜덤하게 key 를 골라 삭제
* volatile-ttl : 만기시각이 설정된 key 들 중에서 만기시각이 가장 가까운 key 를 골라 삭제
* noeviction : 어떤 key 도 삭제하지 않고 error on write operations 를 돌려준다.
* allkeys-lfu: 가장 적게 액세스한 키를 제거하여 공간을 확보합니다.
* volatile-lfu: 가장 적게 액세스한 키부터 시작해 만료가 설정된 키를 제거하여 공간을 확보합니다.


volatile-lru , volatile-random 및 volatile-ttl 정책 은 전제 조건과 일치하는 제거 할 키가없는 경우 noeviction 처럼 작동


```
docker logs test-redis
docker logs redis-stat
```

## redis-cli 설치

```
brew tap ringohub/redis-cli

brew update && brew doctor

brew install redis-cli
```

## 무료 tool

* [patrikx3/redis-ui](https://github.com/patrikx3/redis-ui)
* [jfcherng/RedisDesktopManager-Windows](https://github.com/jfcherng/RedisDesktopManager-Windows)
* [FuckDoctors/rdm-builder](https://github.com/FuckDoctors/rdm-builder)

### mac rdm 실행시 오류 처리 방법

```
brew install python@3.7
install_name_tool -change /usr/local/opt/python@3.7/Frameworks/Python.framework/Versions/3.7/Python /usr/local/opt/python@3.7/Frameworks/Python.framework/Versions/3.7/Python /Applications/RDM.app/Contents/MacOS/RDM

```


# 참고자료
* [redis](https://redis.io/)
* [sejoung/redis_docker](https://github.com/sejoung/redis_docker)
* [6.2 redis.conf](https://github.com/redis/redis/blob/6.2/redis.conf)
* [redis-stat docker](https://hub.docker.com/r/insready/redis-stat/)
