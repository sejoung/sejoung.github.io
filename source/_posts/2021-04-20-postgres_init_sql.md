---
layout: post
title: "포스트그레스큐엘(PostgreSQL) 도커 실행시 sql 파일 같이 실행 시키기"
date: 2021-04-20 12:57 +0900
comments: true
tags : ["postgres","PostgreSQL","포스트-그레스-큐엘","docker","포스트그레스큐엘 ","PostgreSQL docker"]
categories : ["db"]
sitemap :
changefreq : daily
priority : 1.0
---
# 포스트그레스큐엘(PostgreSQL) 도커 실행시 sql 파일 같이 실행 시키기

## Initialization scripts

이 하나에서 파생 된 이미지에서 추가 초기화 작업을 수행하려는 경우, 하나 이상의 추가 *.sql, *.sql.gz또는 *.sh아래 스크립트를 /docker-entrypoint-initdb.d(필요하면 디렉토리를 생성). 
진입 점이 initdb기본 postgres사용자 및 데이터베이스 를 생성하기 위해 호출 한 후 모든 *.sql파일을 실행하고 
실행 가능한 *.sh 스크립트를 실행 *.sh 하며 해당 디렉토리에서 발견 된 실행 불가능한 스크립트를 소싱 하여 서비스를 시작하기 전에 추가 초기화를 수행합니다.

하나의 문제점은 `비워있는 데이터 디렉토리로 컨테이너를 시작할때만 실행`이 된다는 점

```yaml
version: '3.7'
services:
  db:
    image: postgres
    container_name: local
    restart: always
    ports:
      - 5432:5432
    environment:
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
      POSTGRES_DB: test
      POSTGRES_SCHEMA: test
      LC_ALL: C.UTF-8
    volumes:
      - ./test/:/docker-entrypoint-initdb.d
```
간단하게 위 와같은 docker-compose 파일을 생성해서 사용하면 로컬 환경 구성을 할때 도움이 될수도 있다.


# 참고자료
* [docker postgres](https://hub.docker.com/_/postgres)

