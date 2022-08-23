---
layout: post
title: "spring cloud wiremock m1 issues"
date: 2022-08-23 22:50 +0900
comments: true
tags : ["spring","spring cloud","No Server ALPNProcessors!","no conscrypt_openjdk_jni-osx-aarch_64"]
categories : ["spring"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# spring cloud wiremock m1 issues

spring cloud를 사용할때 아래와 같은 오류가 발생한다. 이슈는 wiremock 관련해서 나오는 에러이며 spring cloud 버전을 2021.0.2 이상으로 업그레이드 하던지

wiremock 버전을 2.32.0 버전으로 업데이트 하면 해결이 된다.

`gradle.properties` 파일에서 `wiremock.version=2.32.0` 설정하거나 `build.gradle` 에서 `ext['wiremock.version'] = '2.32.0'` 설정하면 된다.

```
Caused by: java.lang.IllegalStateException: No Server ALPNProcessors!

Suppressed: java.lang.UnsatisfiedLinkError: no conscrypt_openjdk_jni-osx-aarch_64 in java.library.path: /Users/sanaes/Library/Java/Extensions:/Library/Java/Extensions:/Network/Library/Java/Extensions:/System/Library/Java/Extensions:/usr/lib/java:.

```


# 참조

-----
* [Not working on Macbook m1 chip + jdk 17](https://github.com/spring-cloud/spring-cloud-contract/issues/1724)
* [Conscrypt not found on Aarch](https://github.com/wiremock/wiremock/issues/1671)
* [stackoverflow wiremock](https://stackoverflow.com/questions/60074168/java-lang-illegalstateexception-no-server-alpnprocessors-wiremock)
