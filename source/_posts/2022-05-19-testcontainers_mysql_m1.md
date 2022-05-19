---
layout: post
title: "testcontainers macbook m1 error"
date: 2022-05-19 09:52 +0900
comments: true
tags : ["testcontainers","mysql","macbook m1","Could not pull image"]
categories : ["java"]
sitemap :
changefreq : daily
priority : 1.0
---
# testcontainers macbook m1 error

![docker desktop](https://sejoung.github.io/images/2022_05_19_01.png)

```
Could not pull image: no matching manifest for linux/arm64/v8 in the manifest list entries
```

잘 동작하던 테스트 코드가 동작이 안되서 확인 했더니 테스트 컨테이너에서 위와같은 오류가 나고 있었다. 
그래서 도커허브에서 mysql 이미지를 찾아보니 `linux/arm64/v8` 이미지는 존재하지 않았다.

m1 맥북 이슈 인것 같아서 테스트 컨테이너 이슈를 찾아보니 `1.16.0` 이상에서 버그 픽스가 된것을 확인 할수 있었다. 
해당 버전을 올려도 정상동작을 하지 않아서 찾아보니 mysql 버전도 마이너 버전을 최신버전으로 교체 했더니 정상적으로 동작이 되었다.

`mysql:5.7.12` 버전에서 `mysql:5.7.38` 버전으로 교체해서 동작 되는것을 확인 했다.

# 참조
-----
* [docker hub mysql](https://hub.docker.com/_/mysql)
* [Issues correct mysql testContainer with macbook m1](https://github.com/testcontainers/testcontainers-java/issues/4082)
* [Fallback to x86 image if image pulling fails](https://github.com/testcontainers/testcontainers-java/pull/4290)
