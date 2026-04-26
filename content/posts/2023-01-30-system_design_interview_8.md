---
layout: post
title: "8장 URL 단축기 설계"
date: 2023-01-30 15:11 +0900
comments: true
tags : ["가상 면접 사례로 배우는 대규모 시스템 설계 기초"]
categories : ["book"]
sitemap :
changefreq : daily
priority : 1.0
---

# 가상면접으로 배우는 대규모 시스템 설계 기초
## 8장 URL 단축기 설계

* API 엔드포인트
  * URL 단축용 엔드포인트
  * URL 리다이렉션 엔드포인트
* URL 리다이렉션
  * 301 Moved Permanently : Location 헤더가 가르키는 주소로 영구 이동됨
  * 302 Found : Location 헤더가 가르키는 주소로 일시적으로 이동
* URL 단축
* 해시함수
  * 해시길이 : 10 + 26 + 26 = 62
  * 해시 함수
    * crc23
    * md5
    * sha-1
    * base62 : 흔히 사용하는 접근법 사용할수 있는 갯수가 62개라서 사용

# 참조

-----
* [가상 면접 사례로 배우는 대규모 시스템 설계 기초](http://www.yes24.com/Product/Goods/102819435)
