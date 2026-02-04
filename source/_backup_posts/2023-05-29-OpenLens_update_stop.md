---
layout: post
title: "오픈렌즈(OpenLens) 자동 업데이트 막기"
date: 2023-05-29 22:50 +0900
comments: true
tags : ["오픈렌즈","OpenLens","lens","렌즈"]
categories : ["k8s"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 오픈렌즈(OpenLens) 자동 업데이트 막기

오픈렌즈는 렌즈를 빌드해주는 프로젝트인데 오픈소스다 보니 업데이트가 되는데 에러가 생기는 버전이 존재한다 

그럴때 유용한 방법으로 업데이트를 막는 방법이다

## 업데이트 막기

```shell
sudo chmod -R 000 ~/Library/Application\ Support/Caches/open-lens-updater/pending
```

## 업데이트 풀기

```shell
sudo chmod -R 755 ~/Library/Application\ Support/Caches/open-lens-updater/pending
```

# 참조

-----
* [OpenLens](https://github.com/MuhammedKalkan/OpenLens)
