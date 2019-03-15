---
layout: post
title: "openjdk10 설치(window)"
date: 2018-08-06 14:12:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### openjdk10 설치(window)

오라클에서 라이센스정책을 펼치고 있어서 저도 openjdk로 개발 환경을 옴기고 싶은 욕구가 생겼습니다.

먼저 어제 jigsaw를 해볼수 있어서 회사 개발용 pc에 openjdk10을 인스톨 할려고 함


Downloads 에서 리눅스, macOS, windows 플랫폼별로 다운로드가 따로 있음 
다운을 받아보니 tar.gz으로 압축이 되어 있음 앞축을 푸니 jdk가 존재함 oracle에선 인스톨러를 제공하는데 오픈은 아님

window를 기준으로

```
C:\Program Files\Java

위에 폴더 아래에 위치 시킴

C:\Program Files\Java\jdk-10.0.2


```

위처럼 위치시키고 JAVA_HOME을 잡아주면 설치 완료


JAVA_HOME 환경변수 셋팅하기

![JAVA_HOME UI1](https://sejoung.github.io/images/2018_08_06_01.jpg)

탐색기에서 pc에서 속성 클릭

![JAVA_HOME UI2](https://sejoung.github.io/images/2018_08_06_02.jpg)

고급시스템설정 클릭

![JAVA_HOME UI3](https://sejoung.github.io/images/2018_08_06_03.jpg)

환경변수 버튼클릭

![JAVA_HOME UI4](https://sejoung.github.io/images/2018_08_06_04.jpg)

시스템 변수에서 새로만들기

```
이름 : JAVA_HOME
path : C:\Program Files\Java\jdk-10.0.2
```

![JAVA_HOME UI5](https://sejoung.github.io/images/2018_08_06_05.jpg)

시스템 변수에 보면 path가 있음 거기에 JAVA_HOME 추가 하기 

```

%JAVA_HOME%\bin

```

![JAVA_HOME UI6](https://sejoung.github.io/images/2018_08_06_06.jpg)

cmd 창에서 아래의 명령어로 확인

```
java -version 
```

# 참조 
-----
* [openjdk10](http://jdk.java.net/10/)
