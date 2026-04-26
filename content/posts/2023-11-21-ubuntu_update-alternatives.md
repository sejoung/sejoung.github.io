---
layout: post
title: "update-alternatives (기본값 심볼릭 링크 관리)"
date: 2023-11-21 10:02 +0900
comments: true
tags: [ "update-alternatives","우분투","ubuntu" ,"tool", "linux", "java 버전관리", "python 버전관리", "심볼릭 링크 관리" ]
categories: [ "tool" ]
sitemap:
changefreq: daily
priority: 1.0
---

# update-alternatives (기본값 심볼릭 링크 관리)

우분투를 사용할때 여러버전의 자바와 파이썬을 사용해야 할때가 있다. 
이럴때 update-alternatives를 사용하면 편리하다.


## 조회 방법

```shell

update-alternatives --config python

```

## 등록 방법

등록 방법은 아래와 같다.

```shell

update-alternatives --install /usr/bin/python python /usr/bin/python3.6 1
update-alternatives --install /usr/bin/python python /usr/bin/python3.11 2

```

## 설정 방법

설정 방법은 아래와 같다.

```shell

update-alternatives --set python /usr/bin/python3.11

```

## 삭제 방법

삭제 방법은 아래와 같다.

```shell

update-alternatives --remove python /usr/bin/python3.11

```

# 참조
-----

* [update-alternatives man](https://manpages.ubuntu.com/manpages/trusty/man8/update-alternatives.8.html)
