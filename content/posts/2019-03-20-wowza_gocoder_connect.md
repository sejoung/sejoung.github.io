---
layout: post
title: "Wowza 스트리밍 엔진에 Wowza GoCoder 인코딩 앱 연결"
date: 2019-03-20 18:16 +0900
comments: true
tags : ["wowza","streaming engine","와우자","GoCoder"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## Wowza 스트리밍 엔진에 Wowza GoCoder 인코딩 앱 연결

Wowza GoCoder ™ 는 Apple iOS 및 Android 장치 용 RTSP 기반 모바일 실시간 스트리밍 인코딩 앱입니다. 
GoCoder 앱이있는 장치에서 Wowza Streaming Engine Manager를 실행중인 경우 Live Application 연결 설정으로 앱을 자동으로 구성하여 Wowza GoCoder에서 Wowza Streaming Engine ™ 미디어 서버 소프트웨어 의 라이브 응용 프로그램으로 스트림을 게시 할 수 있습니다. 
로컬 서버 컴퓨터 또는 원격 컴퓨터에서 Wowza Streaming Engine Manager를 실행중인 경우 실제 응용 프로그램의 연결 설정을 장치의 전자 메일 응용 프로그램으로 보내고 지정된 URL 설정을 사용하여 GoCoder를 시작할 수 있습니다.

### 라이브 소스 연결 인증

기본적으로 Wowza Streaming Engine은 RTMP 기반 및 RTSP 기반 인코더가 라이브 응용 프로그램에 연결하고 라이브 스트림을 게시하기 전에 원본 사용자 이름과 암호를 제공해야합니다. 
이 섹션에서는 Wowza Streaming Engine Manager에서 소스 계정을 만들고 Wowza GoCoder 앱의 소스 인증을 관리하는 방법에 대해 설명합니다.

#### 원본 계정 만들기

원본 계정은 Wowza Streaming Engine에서 인코더 및 카메라에서 라이브 애플리케이션으로 들어오는 연결을 인증하는 데 사용됩니다. 
Wowza Streaming Engine 인스턴스에 대한 여러 소스 계정을 작성하고 저장할 수 있습니다. 
라이브 응용 프로그램에 대한 원본 연결의 인증 설정을 관리하는 방법에 대한 자세한 내용은 원본 인증 설정 관리를 참조하십시오 .

* 원본 계정을 만들려면 Server 에 Source Authentication에  Add Source 버튼을 클릭

![wowza UI](https://sejoung.github.io/images/2019_03_20_09.jpg)


* 소스 사용자 이름 및 암호 정보를 한 다음 add 버튼 클릭

![wowza UI](https://sejoung.github.io/images/2019_03_20_10.jpg)

* 정상적으로 추가가 되었다.

![wowza UI](https://sejoung.github.io/images/2019_03_20_11.jpg)


#### 원본 인증 설정 관리

기본적으로 Wowza Streaming Engine은 RTMP 기반 및 RTSP 기반 소스가 라이브 응용 프로그램에 대한 연결을 보호하기 위해 소스 계정에 대한 소스 사용자 이름과 암호를 제공해야합니다. 
이 섹션에서는 RTSP 기반 Wowza GoCoder 인코딩 앱의 소스 보안 설정을 관리하는 방법에 대해 설명합니다.

원본 보안 설정을 관리하려면 Source Security 에서 Edit을 누르면 변경할수있다.

![wowza UI](https://sejoung.github.io/images/2019_03_20_12.jpg)


![wowza UI](https://sejoung.github.io/images/2019_03_20_13.jpg)


### Wowza GoCoder 앱 연결하기

소스 (라이브) Wowza 스트리밍 엔진 관리자에서 라이브 애플리케이션을위한 페이지 구성 및 Wowza GoCoder에 응용 프로그램에 대한 연결 설정을 제공 할 수 있습니다. 
GoCoder 응용 프로그램은 응용 프로그램에 자동으로 연결하기 위해 실제 응용 프로그램 연결 설정을로드 할 수 있습니다.

GoCoder 앱이있는 Apple iOS 또는 Android 모바일 장치에서 Wowza Streaming Engine Manager를 실행중인 경우 실제 애플리케이션 연결 설정으로 앱을 자동 구성하여 Wowza GoCoder에서 라이브 애플리케이션으로 스트림을 게시 할 수 있습니다. 
로컬 서버 컴퓨터 또는 원격 컴퓨터에서 Wowza Streaming Engine Manager를 실행중인 경우 실제 응용 프로그램의 연결 설정을 장치의 전자 메일 응용 프로그램으로 보내고 지정된 URL 설정을 사용하여 GoCoder를 시작할 수 있습니다. 

* 라이브 애플리케이션 컨텐츠 패널에서 소스 (라이브)를 클릭 후 Wowza GoCoder를 선택.

![wowza UI](https://sejoung.github.io/images/2019_03_20_14.jpg)

* 다음 아래의 정보들을 넣고 email me 버튼을 클릭하면 이메일로 셋팅된 정보를 보낼수 있다.

![wowza UI](https://sejoung.github.io/images/2019_03_20_15.jpg)

### 연결 확인 중

* 스트림이 게시되었는지 확인하려면 Wowza Streaming Engine Manager에서 라이브 응용 프로그램의 들어오는 스트림 을 클릭 한 다음 스트림 이름을 클릭합니다. 

![wowza UI](https://sejoung.github.io/images/2019_03_20_16.jpg)

* 스트림의 정보 페이지에는 가동 시간, 네트워크 처리량 및 게시 된 스트림에 대한 기타 정보가 표시됩니다.

![wowza UI](https://sejoung.github.io/images/2019_03_20_17.jpg)

### 스트림 재생하기

스트림을 재생하려면 정보 페이지의 오른쪽 위에있는 테스트 플레이어 를 클릭 하십시오. 
테스트 플레이어 열립니다 윈도우 라이브 스트림 이름을 스트리밍 할 미리 구성되어 테스트 플레이어 포함 myStream 다양한 스트리밍 형식을. 
테스트 플레이어 창 에있는 각 탭 은 라이브 스트림을 재생하는 데 사용할 수있는 테스트 플레이어를 호스팅하거나 라이브 스트림을 재생하기위한 지침을 제공합니다. 
예를 들어 Adobe HDS 프로토콜을 사용하여 myStream 을 재생 하려면 Adobe HDS 탭을 클릭 한 다음 시작 을 클릭 합니다.

![wowza UI](https://sejoung.github.io/images/2019_03_20_18.jpg)

`https://www.wowza.com/testplayers` 온라인 테스트 플레이어도 있습니다.


-----
* [how-to-connect-the-wowza-gocoder-encoding-app-to-wowza-streaming-engine](https://www.wowza.com/docs/how-to-connect-the-wowza-gocoder-encoding-app-to-wowza-streaming-engine)


