---
layout: post
title: "클린아키텍쳐-정책과수준"
date: 2019-11-18 16:48 +0900
comments: true
tags : ["클린아키텍쳐","Clean Architecture","정책과수준"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 정책과수준

소프트웨어 시스템이란 정책을 기술한것

동일한 이유로 동일한 시점에 변경되는 정책은 동일한 수준에 위치하며, 동일한 컴포넌트에 속해야 한다.

### 수준

수준을 엄밀하게 정의하자면 입력과 출력까지의 거리이다. 

시스템의 임력과 출력 모두로부터 멀리 위치할수록 정책의 수준은 높아진다.
입력과 출력을 다루는 정책이라면 시스템에서 최하위 수준에 위치한다.

데이터 흐름과 소스 코드 의존성이 항상 같은 방향을 가리키지 않는다.
소스 코드 의존성은 그 수준에 따라 결합되어야 하며, 데이터 흐름을 기준으로 결합되어서는 안된다.

# 참조
-----


