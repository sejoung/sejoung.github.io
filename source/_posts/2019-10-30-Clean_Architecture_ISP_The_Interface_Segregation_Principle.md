---
layout: post
title: "클린아키텍쳐-인터페이스 분리 원칙"
date: 2019-10-30 09:00 +0900
comments: true
tags : ["클린아키텍쳐","Clean Architecture","인터페이스 분리 원칙"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 인터페이스 분리 원칙(ISP The Interface Segregation Principle)

### 언어와 ISP

정적 타입 언어 사용자가 import, use, include을 사용하도록 강제한다. 
이렇게 소스 코드에 선언된 선언문으로 인해 소스코드 의존성이 발생한다.(자바는 약깐 틀리다.)

루비나 파이썬 같은 동적 타입언어에서는 소스코드에 선언문이 존재하지 않는다 대신 런타임 추론이 들어간다.
결국 컴파일 및 재배포가 필요없다.

### ISP 와 아키텍쳐

일반적으로 필요이상 많은걸 포함하는 모듈에 의존하는것은 해로운 일이다.

### 결론

불필요한 짐을 실은 무언가에 의존하면 생각하지도 못한 문제에 빠진다는 사실이다.

# 참조
-----


