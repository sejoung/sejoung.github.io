---
layout: post
title: "jenkins php 파일 배포 하기"
date: 2018-08-01 09:30:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### jenkins php 파일 배포 하기

전 php를 해본적이 없습니다.(java 개발자) 아래 내용은 전달 받은 기능을 설정한것 뿐입니다.

기능 요건 

1. git 에서 소스를 다운
2. 특정 서버 특정 폴더에 업로드
3. git을 polling 하는 주기를 5분 단위로 해서 업데이트가 있으면 1번 2번 프로세스 반복

사전 진행 사항

1. jenkins에 git 플러그인 설치, Publish over SSH 플러그인 설치 진행
2. git은 내부서버에 설치함 인증은 ssh 인증 방식으로 됨
3. ssh 인증을 위해 git이 설치한 서버에 계정을 만듬

위 사항이 다되면 jenkins 로그인 첫화면

![jenkins UI1](https://sejoung.github.io/images/2018_08_01_01.jpg)

젠킨스 관리 클릭 

![jenkins UI2](https://sejoung.github.io/images/2018_08_01_02.jpg)

시스템 설정 클릭 Publish over SSH 설정 화면

![jenkins UI3](https://sejoung.github.io/images/2018_08_01_03.jpg)

위에 처럼 Publish over SSH에서 사용할 서버정보를 입력한다. 

상세는 [jenkins Publish over SSH](https://wiki.jenkins.io/display/JENKINS/Publish+Over+SSH+Plugin)로 들어가면 자세히 볼수있다

``` 
위에 내용을 셋팅한 이유는 업로드할 서버에서 ssh만 지원을해서 설정함

ftp를 사용하면 Publish over FTP에서 설정을 해도 무방함

개인적인 생각은 업로드 계정은 사용자 계정으로 하는것이 아니라 CI 전용계정을 사용하는것이 어떻까라고 생각한다.

```

그럼 다시 아래의 첫화면에서 

![jenkins UI1](https://sejoung.github.io/images/2018_08_01_01.jpg)

새로운 item 클릭 프로젝트 생성

![jenkins UI4](https://sejoung.github.io/images/2018_08_01_04.jpg)

프로젝트 생성시에는 여러가지 타입이 있는데 적절한 타입으로 생성하면 도움이 된다.

여기에선 프리스타일로 생성 생성후에 대쉬보드에서 해당 프로젝트 클릭

![jenkins UI5](https://sejoung.github.io/images/2018_08_01_05.jpg)

여기에서 구성 클릭 

![jenkins UI6](https://sejoung.github.io/images/2018_08_01_06.jpg)

소스코드 관리에서 git 선택 주소 입력 Credentials 추가 전 master 브런치만 빌드할꺼니 */master 입력

아래로 내리면 빌드유발에서 Poll SCM 선택

![jenkins UI7](https://sejoung.github.io/images/2018_08_01_07.jpg)

5분마다 polling 주기를 갖길 원했으니 H/5 * * * * 입력 해당 값이 의미 하는것은 옆에 ?를 클릭하면 상세 설명이 나옴

아래로 스크롤 하면 빌드 후 조치 추가에서 Send build artifacts over SSH를 선택 

![jenkins UI8](https://sejoung.github.io/images/2018_08_01_08.jpg)

위에처럼 설정 소스파일에 모든 파일 폴더를 업로드 하기 위해서 아래처럼 프리픽스를 줌

```

**/*.*

```



# 참조 
-----
* [jenkins](https://jenkins.io/)
* [jenkins Publish over SSH](https://wiki.jenkins.io/display/JENKINS/Publish+Over+SSH+Plugin)
* [jenkins git](https://wiki.jenkins.io/display/JENKINS/Git+Plugin)
