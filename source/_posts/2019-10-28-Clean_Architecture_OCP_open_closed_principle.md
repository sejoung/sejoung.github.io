---
layout: post
title: "클린아키텍쳐-개방 폐쇄 원칙"
date: 2019-10-28 14:46 +0900
comments: true
tags : ["클린아키텍쳐","Clean Architecture","개방 폐쇄 원칙"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 개방 폐쇄 원칙(OCP, Open-Closed Principle)

버트란트 마이어가 1988년에 만들었는데

```
소프트웨어 개체는 확장에 열려 있어야 하고 변경에 닫혀있어야 한다.
```

컴포넌트의 의존성 방향은 단방향으로 할려고 해야 되고 화살표 방향은 변경으로부터 보호하려는 컴포넌트를 향하도록 그려야 한다.

컴포넌트의 방향성을 제어하기 위해 컴포넌트를 추가 하기도 한다.

시스템을 컴포넌트 단위로 분리하고 저수준 컴포넌트에서 발생한 변경으로부터 
고수준 컴포넌트를 보호할 수 있는 형태의 의존성 계층구조가 만들어지도록 해야 한다.



# 참조
-----

