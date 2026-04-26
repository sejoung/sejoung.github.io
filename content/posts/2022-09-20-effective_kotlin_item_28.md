---
layout: post
title: "이펙티브 코틀린 아이템 28: API 안정성을 확인하라"
date: 2022-09-20 09:50 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(추상화 설계)
## 아이템 28: API 안정성을 확인하라

시멘틱 버저닝

* MAJOR 버전: 호환되지 않는 수준의 API 변경
* MINOR 버전: 이전 변경과 호환되는 기능을 추가
* PATCH 버전: 간단한 버그 수정

어노테이션 
* @Experimental: 안정적이지 않음
* @Deprecated: 더 이상 사용되지 않음 (단, 사용자가 적용할 시간을 주자)
  * ReplaceWith: 다른 것으로 대체 되었으면 표시해주는것이 좋음

# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)
