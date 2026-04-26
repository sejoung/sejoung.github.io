---
layout: post
title: "GDG_DevFest_Seoul_2017"
date: 2017-11-19 01:00:00 +0900
comments: true
tags : ["DevFest","google"]
categories : ["2017 세미나"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# GDG_DevFest_Seoul_2017

구글은 스티커랑 이것저것 챙겨 주는것이 많다.
오라클은 스티커 안이쁨 구글스티커는 맘에 들어서 컴터에 마구닥 붙힘
후드티와 장패드가 선물로....
CSS와 BEM 듣고 싶었는데 자리가 없어서....
https://en.bem.info/
http://getbem.com/
https://en.bem.info/methodology/filestructure/

# Why Typescript with Clean Architecture
정유진 (레이니스트)

뱅크샐러드 소비자가 선택하는 금융

팀이 느꼈던 문제점
 제품관점(다양한 지식을 원홣하게 통제)
  금융의 모든 것을 다룰것 같다
  같은 주제도 여러 관점에서 다를 것이다.
  백앤드는 마이크로서비스 아키텍쳐를 구성
  클라이언트는 제품의 지식이 수렴하는곳
협업관점(올바른 관점을 통일)
 협업에서 중요한점은?
  올바른 관점을 다같이 공유하는 것
   좋은 컨퍼넌트란?
    재사용성
    성능
    복잡도를 낮추게 설계
  관점이 통일되지 않을때
   서로의 코드를 해석하기 힘들다.
   당사자가 아니면 유지보수에 공수가 크다.
   코드리뷰도 스타일 지적정도만 나온다.
 개발환경(실수를 최소화 하는 개발환경)
  API 호출 -> 모델화 -> 로직 처리 -> 출력
  자바 스크립트는 오류 검출이 어렵다.

문제해결방안
 타입 세이프 하게 개발 한다.
 DDD설계(문제해결을 위한 접근법)

클린아키텍쳐
 https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html

빠른 개발 퍼포먼스를 유지 하는것
 서비스 변화에 따른 코드변화가 최소한 인 것

후기(DDD 적용후에)
 달라진 코드리뷰
  엔티티에 인자값이 같으면 같은 이벤트인가?
  UI를 통해서 앤티티를 해석하는것이 맞냐?(서버 개발자 입장에서는 틀려도 UI개발자 입장에서는 화면만 보고 해석하기 때문에 틀릴수도 있음)

# MVC 부터 MVVM, 단방향 데이터 흐름까지
김형욱
formsandcontrols 스몰토크

데이터 바인딩
  양방향 바인딩 안쓸려고 하는이유 순환참조
  요즘엔 타임스탬프를 가지고 양방향 바인딩을 해결할려고 노력함

MVC  1978년애 MVC 모델을 만듬
 모델 뷰 컨트롤 에디터 라고 불릴때도 있었음
 초기엔 옵저버 패턴에 기대고 있었음

MVP model-view-presenter
 forms & controls와 MVP를 합치려는 IBM이 노력함
 인터페이스를 상속받는건 필수가 아니다.

FLUX 패턴
 페이스북에서 리액트를 만들면서 말했던 패턴
 단방향 아키텍처라고 한다.
 이벤트버스를 사용해서 구현
 RXjava 사용
 DB로 사용

# 1시간만에 만드는 음성인식 인공지능 챗봇
정명훈

챗봇은 한시간은 더걸린다.

챗봇
 채팅과 로봇의 결합
 챗봇은 인공지능은 아니다.
 인간의 언어를 흉내내어 인간의 질문에 답하는 형식

 대화의 범위를 제약
  장소를 알면 사과가 과일인지 아닌지 알수 있음

 대화의 분위기를 파악
  문맥을 알면 과일 사과인지 알수 있음

 언어적인 이해와 경험 향상

챗봇을 만들기위한 기술
 데이터 마이닝
 인공지능

챗봇의 대화 방법
 의도(intent)를 파악
 대화의 재료(Entity)
 대화의 분위기(Context)
위에 3가지를 어떻게 하면 잘 교육시킬수 있을까?

어떤 챗봇을 만들까?스케치
 쇼핑몰이 가지고 있는 상품 목록 (Entity-대화의 재료)
 쇼핑몰 상담 목록? 쇼핑몰 직원의 대화록? (Intent-대화의 의도)
 기존 대화에 대한 분석, 직관 상황설정 (Context-대화의 분위기 및 흐름)

데이터 가공 및 정재
 google dataPrep을 활용
 google natural language API 사용

https://github.com/javalove93/dialogflowdemo

# 리액트와 장고로 만드는 Progressive Web App: 빠르고 단단한 웹사이트 제작하기
진유림(스마트스터디)

PWA
https://developers.google.com/web/fundamentals/codelabs/your-first-pwapp/?hl=ko
http://www.bloter.net/archives/274549

커머스팀에선 재고 관리 납품, 마감 등 복잡한 계산을 해야해요(개발자 2명)

생산성으로 장고
복잡한프런트앤드 리엑트
웹앱은 PWA
 프로그레시브 하다
 반응형을 지원
 따로 네이티브 앱을 구현필요 없음
 PWA는 업데이트버튼을 누를 필요없다

boxture 진화
 모바일 접근성 향상
  캐싱을 통해 빠른 로딩
  캐싱은 Service Worker가 담당
  캐시 우선으로 확인 후 최신버전인지 확인함

https://jakearchibald.github.io/isserviceworkerready/

서비스 워크 사용은 크롬을 사용하는게 좋을것 같다 지금 상태에선....

web push
 파이어 베이스 사용해서 한다.

포어그라운드 푸쉬
백그라운드 푸쉬
서비스 워커에서 각각 구현해야 됨

pyfcm을 사용

눈물의 후기
 희망편
  생각보다 간단

 삽질 그리고 깨달음
  왜 서버 업데이트 하고 새로고침을 눌러야만되지?
   강제 새로고침이 필요함(feature)
  sw-precache
   2mb가 기본이라서 캐싱에서 제외
  왜 이 자원은 캐시가 안되지?
   서비스 워커는 url로 캐싱함

 PWA를 사용할 명확한 이유가 있나요?
 서비스워커에 라이플사이클을 이해하세요
 토이프로젝트/사내 서비스에 선 적용 해보세요

그래도 PWA는 미래다.

https://github.com/milooy


# Github와 CloudFlare를 이용한 무료 고성능 웹 어플리케이션 호스팅
박병진 (소프트웨어 아키텍트)
https://posquit0.github.io/

웹의 발전
 html 1993년에 첫 릴리즈
 css 1996년에 첫 릴리즈
 javascript 1995년에 첫 릴리즈(10일만에 만들었다고 함...) ECMA 표준 1997년 발표
 WAS 데이터베이스와 함께 3tier 웹 아키텍쳐의 일반화
 SPA 단일페이지에서 동작 클라이언트의 디바이스가 성능이 좋아짐 (분산처리 아키텍쳐)

JAMstack
 javascript + API + Markup
 https://jamstack.org/
 https://www.staticgen.com/
 성능이 좋다 왜? CDN을 통해서 배포 할수있다.

GithubPages + CloudFlare 사용 무료 개인도메인을 소유해야 됨
netlify 사용 무료 개인도메인을 소유해야 됨
AWS S3 + CloudFlare 유료

나머진 데모로 보여줌

서비스의 목적에 맞는 웹 기술 스택을 사용하자
