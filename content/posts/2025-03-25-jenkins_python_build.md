---
layout: post
title: "jenkins에서 python 빌드하기"
date: 2025-03-25 21:00 +0900
comments: true
tags: [ "젠킨스", "파이썬", "젠킨스 파이썬 빌드", "Python.h : no such file or directory", "docker in docker" , "도커인도커"]
categories: [ "jenkins" ]
sitemap:
    changefreq: daily
    priority: 1.0
---

# jenkins에서 python 빌드하기

아래 와 같은 오류가 날수 있는데 해당 오류는 apt install python-dev 로 해결할수 있다.

```
Python.h : no such file or directory
```

macOS를 host로 사용시에 docker 설정에서는 docker in docker 를 사용할때 아래와 같은 설정이 정상 동작 하지 않는다.

```
    volumes:
      - ./jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock  # Docker-in-Docker (필요한 경우)
      - /usr/bin/docker:/usr/bin/docker  # Docker 명령어 사용 가능하게 설정
```

`/usr/bin/docker:/usr/bin/docker` 여기가 문제인데 이부분을 제거하고 docker명령어를 install 하면 정상 동작한다.


# 참고

-----
