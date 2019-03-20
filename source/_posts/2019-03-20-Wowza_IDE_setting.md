---
layout: post
title: "OutOfMemoryError Exception 의 이해"
date: 2019-03-20 15:58 +0900
comments: true
tags : ["wowza","streaming engine","wowza ide"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## Wowza IDE를 사용하여 Wowza 스트리밍 엔진 확장

Wowza ™ IDE는 Eclipse 통합 개발 환경에 대한 추가 기능으로 Java 프로젝트 및 클래스를 빌드하여 Wowza Streaming Engine ™ 미디어 서버 소프트웨어의 기능을 확장 및 향상시킬 수 있습니다. 
Wowza IDE는 Windows, Linux 및 OS X에서 사용할 수 있습니다. 
Eclipse 4.3 (Kepler) 이상에 추가 할 수있는 소프트웨어 저장소로 패키지되어 있습니다.

### Java 개발자 용 Eclipse 설치

먼저 Eclipse IDE를 다운로드하여 설치하십시오.

1. 최신 Eclipse 설치 프로그램을 다운로드하십시오.
1. 설치 프로그램을 시작하십시오.
1. Java Developer 용 Eclipse IDE 를 설치할 패키지로 선택 하고 기본 설치 폴더를 채택한 다음 설치를 클릭하십시오.
1. 메시지가 나타나면 라이센스를 수락하고 인증서를 신뢰하십시오.
1. 설치가 완료되면 Eclipse를 시작하십시오.

### Wowza IDE 설치

이제 Eclipse에서 사용할 Wowza IDE를 추가하세요.


* Eclipse에서 Help 메뉴를 클릭하고 Install New Software를 선택한다 .

![Eclipse UI1](https://sejoung.github.io/images/2019_03_20_01.jpg)

* 설치 창에서에 작업 필드, 입력 `https://www.wowza.com/wowzaide4/`

![Eclipse UI2](https://sejoung.github.io/images/2019_03_20_02.jpg)

* 그 다음에는 설치

![Eclipse UI3](https://sejoung.github.io/images/2019_03_20_03.jpg)

* 설치 완료 되면 File > New > Other 에서 아래의 파일들을 만들수 있다.

  * Wowza Streaming Engine HTTPProvider Class
  
  * Wowza Streaming Engine Module Class
  
  * Wowza Streaming Engine Project
  
  * Wowza Streaming Engine ServerListener Class

![Eclipse UI4](https://sejoung.github.io/images/2019_03_20_04.jpg)

### Wowza Streaming Engine project 만들기

이제 Eclipse에서 Wowza Streaming Engine 프로젝트를 만들 수 있습니다. 
프로젝트는 프로젝트와 같은 이름을 가진 .jar 파일을 생성하는 전체 Wowza 스트리밍 엔진의 확장입니다. 
Eclipse에서 Wowza 스트리밍 엔진 프로젝트를 생성하는 방법은 다음과 같습니다.

* 이클립스에서 File > New > Other. 선택

![Eclipse UI5](https://sejoung.github.io/images/2019_03_20_05.jpg)

* Wowza Streaming Engine Project 선택후 Next 버튼 클릭

![Eclipse UI6](https://sejoung.github.io/images/2019_03_20_06.jpg)

* New Wowza Streaming Engine Java Project 창에 다음에 정보를 입력
 
  * Project name - 프로젝트 이름과 .jar 파일 명 이름에는 공백이 있을수 없다
  * Location - Wowza Streaming Engine 설치 위치 설치가 되어 있으면 자동으로 됨 윈도우 기준

![Eclipse UI7](https://sejoung.github.io/images/2019_03_20_07.jpg)

* 다음 버튼을 클릭하면 New Wowza Streaming Engine Module Class 페이지가 나타난다.

  * Package - 자바의 패키지랑 똑같다 자바 컨벤션으로는 도메인 역순이다.
  * Name - module class 이름이다 자바 컨벤션으로 camel case를 사용한다.
  
![Eclipse UI8](https://sejoung.github.io/images/2019_03_20_08.jpg)

# 참조
-----
* [how-to-extend-wowza-streaming-engine-using-the-wowza-ide](https://www.wowza.com/docs/how-to-extend-wowza-streaming-engine-using-the-wowza-ide)
* [eclipse downloads](https://www.eclipse.org/downloads/)


