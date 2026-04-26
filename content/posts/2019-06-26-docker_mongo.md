---
layout: post
title: "도커로 몽고디비 설치"
date: 2019-06-26 10:22 +0900
comments: true
tags : ["mongo","몽고 디비 설치"]
categories : ["docker"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 도커로 몽고디비 설치

먼저 도커가 깔려있다고 하는 전제하에 설명을 하면 

가장 간단하게 설치할수 있는 방법은 아래의 명령어를 수행하는것이다.

```
docker pull mongo
```

위 명령어는 latest 테그의 몽고 디비를 설치한다 원하는 버전이 있다고 하면

```
docker pull mongo:4.1.13

```

위에 처럼 테그를 마지막에 붙혀주면 설치가 된다 

실행은 

```

docker run -d -p 27017-27019:27017-27019 --name mongodb mongo:4.1.13

```

위처럼 실행하여 27017포트 부터 27019 포트까지 맵핑을 시켜준다.


# 참조
-----
* [docker mongo](https://hub.docker.com/_/mongo)

