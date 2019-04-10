---
layout: post
title: "스프링 부트로 개발중인 코드들을 서비스 재시작없이 반영 livereload 사용"
date: 2019-04-10 18:31 +0900
comments: true
tags : ["spring boot","devtools"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 스프링 부트로 개발중인 코드들을 서비스 재시작없이 반영 livereload 사용

인텔리제이 기준으로 설명하면 

브라우저에 [livereload extensions](http://livereload.com/extensions/)을 설치

application.properties 열어 spring.devtools.livereload.enabled=true 추가
IntelliJ > Preferences > Build,Execution,Deployment > Compiler > Build project Automatically 선택
IntelliJ Registry 열기 (Mac : cmd + shift + a, Win : ctrl + shift + a) > Registry ... 선택 > compiler.automake.allow.when.app.running 선택


# 참조
-----
* [livereload extensions](http://livereload.com/extensions/)
* [using-boot-devtools-livereload](https://docs.spring.io/spring-boot/docs/2.1.2.RELEASE/reference/htmlsingle/#using-boot-devtools-livereload)

