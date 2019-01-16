---
layout: post
title: "이클립스에서 jigsaw 코딩 준비하기"
date: 2018-08-07 09:13:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 이클립스에서 jigsaw 코딩 준비하기

프로젝트 직쏘란?

Project Jigsaw 작업은 2008 년 8 월 초기 탐색 단계 에서 시작되었습니다 . Java 9의 설계 및 구현 작업 은 2014 년에 시작되었습니다 .

소스 코드 재구성 ( JEP 201 )은 2014 년 8 월 JDK 9 빌드 27에 병합되었습니다.

2014 년 12 월 에 런타임 이미지를 지원 모듈 ( JEP 220 )로 재구성 하여 JDK 9 빌드 41에 병합했습니다.

Java Platform Module System 의 JSR 376 은 2014 년 12 월 JCP 집행위원회의 승인을 받았습니다.

대부분의 내부 API ( JEP 260 ) 캡슐화 계획은 2015 년 8 월에 게시되었습니다.

모듈 시스템 상태의 초기 버전은 JEP 261 및 프로토 타입 모듈 시스템이 포함 된 최초의 초기 액세스 빌드 와 함께 2015 년 9 월에 게시되었습니다.

제안 된 사양 의 공개 문제 의 초기 목록은 2016 년 3 월에 게시되었습니다.

호환성 및 이전에 관한 새로운 자료 가있는 모듈 시스템 상태 의 업데이트 된 버전은 2016 년 3 월에도 게시되었습니다.

JSR 376으로 지정되고 JEP 261 에서 구현 된 모듈 시스템 자체 는 2016 년 3 월 JDK 9 빌드 111 에 병합되었습니다 .

2017 년 7 월에 완성 된 Project Jigsaw의 작업은 2017 년 9 월 21 일 에 JDK 9의 일부로 일반 용도로 제공되었습니다 .

위는 히스토리고 그럼 하기 위해서는 JDK9부터 직쏘가 포함이 되었으니 JDK9이상 버전에서 작업을 진행 할수있다.

저는 바로 위에 포스트에서 jdk10을 설치 했기때문에 jdk10기준으로 포스팅 하겠다.

#### 1단계

이클립스 실행 vm을 바꿔야 된다. 이부분은 전 이클립스 ini 파일에 명시하겠다.

아래는 이클립스 설치폴더를 예시로 들어서 수정한 내용이다.

 ```
 D:\tools\eclipse\eclipse.ini
 
 -vm
 C:\Program Files\Java\jdk-9\bin\javaw.exe
 
 ```
#### 2단계

Eclipse SDK는 java.base 모듈에없는 유형을 사용하므로 eclipse.ini에 다음 vmargs를 추가해야합니다.

```

--add-modules = ALL-SYSTEM

```

eclipse.ini 요약

```
-vm
C:\Program Files\Java\jdk-10.0.2\bin\javaw.exe
-vmargs
-Dosgi.requiredJavaVersion = 1.8
--add-modules=ALL-SYSTEM

```
위와같은 설정이 되어 있어야된다.

위와 같이 하면 직쏘를 코딩할수있는 준비가 완료


# 참조 
-----
* [jigsaw](http://openjdk.java.net/projects/jigsaw/)
* [Configure_Eclipse_for_Java_9](https://wiki.eclipse.org/Configure_Eclipse_for_Java_9)
* [JEP 201](http://openjdk.java.net/jeps/201)
* [JEP 220](http://openjdk.java.net/jeps/220)
* [JEP 260](http://openjdk.java.net/jeps/260)
* [JEP 261](http://openjdk.java.net/jeps/261)


