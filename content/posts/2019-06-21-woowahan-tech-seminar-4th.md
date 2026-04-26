---
layout: post
title: "변경 의존성과 그에따른 설계진화"
date: 2019-06-21 09:35 +0900
comments: true
tags : ["우아한테크세미나","우아한객체지향","조영호님"]
categories : ["2019 세미나"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 변경 의존성과 그에따른 설계진화 

먼저 아래의 동영상을 기본전제 하에 설명을 진행하므로 레이어 아키텍쳐 동영상을 꼭 시청하길 권장한다.
설계를 이야기 할때 의존성에 대해서 알아야 되니 처음에는 의존성에 대한 설명을 해주심
의존성은 코드 의존성과 패키지 의존성을 분리 해서 설명해 주시고 
참조가 순환 되면 잘못된 구조라고 설명해주심 이것을 끊어 내는것이 목표
참조를 끊어 내면 변경용이성이 커짐 응집도는 높아지고 결합도는 낮아지게 되는 것

배달앱에 주문이라는 프로세스를 간단하게 하여 코드를 만들고 설명을 해주심

첫번째 설계된 결과물을 가지고 코드를 작성 주문 프로세스를 완성 완성 된 결과물을 바탕으로 의존성을 도식화 하여 확인

그것을 바탕으로 2차 리펙토링 리펙토링시에 이렇게 리펙토링한 이유를 잘 설명해주심

다시 3차 리펙토링 이렇게 리펙토링 해서 나온 의존성을 끊어 내는 방법 3가지에 대해서 다시 설명

세미나의 느낌은 좋은 콘서트 같은것을 본 느낌이랄까 진짜 좋은 세미나를 들은 느낌이다. 
 
오늘 배운것을 잘 적용해서 좋은 코드를 작성해야겠다. 
 
 


# 참조
-----
* [[KSUG Seminar] Growing Application - 2nd. 애플리케이션 아키텍처와 객체지향](https://www.youtube.com/watch?reload=9&v=26S4VFUWlJM)
* [발표슬라이드](https://www.slideshare.net/baejjae93/ss-150432699)
* [1차 설계 소스](https://github.com/eternity-oop/Woowahan-OO-01-object-reference)
* [2차 설계 소스](https://github.com/eternity-oop/Woowahan-OO-02-domain-service)
* [3차 설계 소스](https://github.com/eternity-oop/Woowahan-OO-03-domain-event)
* [변경 의존성과 그에따른 설계진화 ](https://www.youtube.com/watch?v=dJ5C4qRqAgA)
