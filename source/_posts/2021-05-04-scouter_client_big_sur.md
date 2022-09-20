---
layout: post
title: "java 모니터링 툴 scouter 클라이언트 BigSur(macos) 오류"
date: 2021-05-04 10:22 +0900
comments: true
tags : ["scouter","BigSur","scouter client"]
categories : ["java"]
sitemap :
changefreq : daily
priority : 1.0
--->
# java 모니터링 툴 scouter 클라이언트 BigSur(macos) 오류

## 실행이 안되는 오류
실행이 안되는 오류는 java 경로 오류로 일단 brew로 자바를 인스톨 했을때는 일어나지 않았다.
해결 방법 링크는 [Big Sur 11.0.1 클라이언트 실행 불가 #764](https://github.com/scouter-project/scouter/issues/764)

scouter.client -> 패키지 내용 보기 -> Contents -> Info.plist 파일에 내용을 수정하면 된다. 아래 처럼 가이드가 존재한다.

```xml
<!-- to use a specific Java version (instead of the platform's default) uncomment one of the following options,
        or add a VM found via $/usr/libexec/java_home -V
    <string>-vm</string><string>/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Commands/java</string>
    <string>-vm</string><string>/Library/Java/JavaVirtualMachines/1.8.0.jdk/Contents/Home/bin/java</string>
-->
```

## 실행후 리사이즈 및 다른 지표 추가 안되는 이슈
2020 11월에 오픈된 이슈인데 바로 처리는 불가능 하다 라는 답변이 있다 아직까지 해결은 되지 않았고 가상머신을 사용해 다른 클라이언트를 사용하는것을 추천해 주신다.
해당 이슈 링크는 [Macos Big Sur에서 scouter client 오류 #766](https://github.com/scouter-project/scouter/issues/766)

## Big Sur 지원 버전
[scouter releases note v2.15](https://github.com/scouter-project/scouter/releases/tag/v2.15.0) 이 버전부터 공식적으로 Big Sur 지원 하기 시작함

# 참고자료
* [Big Sur 11.0.1 클라이언트 실행 불가 #764](https://github.com/scouter-project/scouter/issues/764)
* [Macos Big Sur에서 scouter client 오류 #766](https://github.com/scouter-project/scouter/issues/766)
* [scouter releases note v2.15](https://github.com/scouter-project/scouter/releases/tag/v2.15.0)
