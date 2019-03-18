---
layout: post
title: "이클립스에서 java 11 사용하기"
date: 2018-10-31 13:58 +0900
comments: true
tags : ["jdk 11","eclipse"]
categories : ["IDE"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### 이클립스에서 java 11 사용하기

jdk 11이 나온지 한달이 지났네요 지금 버전은 11.0.1로 되어 있습니다.
이번에 배포하는 서비스는 처음부터 11을 염두해 두고 진행하고 있었는데 
spring boot 버전이 2.1이 릴리즈 되지 않아서 서버 셋팅을 1.8로 진행하고 있었습니다.

어제 기준으로 2.1버전이 릴리즈 되어 jdk 11으로 코드 테스트 후에 서버 jdk 버전도 업데이트 하고 작업을 진행했습니다.

그래서 이클립스에서 jdk 11을 지원하는 방법에 대해서 포스팅 할려고 합니다.

![eclipse UI1](https://sejoung.github.io/images/2018_10_31_01.jpg)

위에 이클립스 컴파일러 셋팅을 보면 10이 최고 버전으로 11을 깔아도 ide에서 지원하지 않아서 
아래 처럼 maven에 java.version을 11 올려도 인식되지 않아 1.5버전으로 maven으로 셋팅 됨니다.

```xml

<properties>
    <java.version>11</java.version>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
</properties>

```  

![eclipse UI2](https://sejoung.github.io/images/2018_10_31_02.jpg)

그래서 위에 플러그인을 설정해서 jdk11을 지원 할 수 있도록 만들고 있습니다.

![eclipse UI3](https://sejoung.github.io/images/2018_10_31_03.jpg)

그럼 설정은 위에 이미지에 보시면 마켓플레이스 메뉴로 들어갑니다.

![eclipse UI4](https://sejoung.github.io/images/2018_10_31_04.jpg)

거기서 java 11으로 검색하면 위에 플러그인이 나옵니다 install 버튼을 클릭하시면 인스톨이 되고 

![eclipse UI5](https://sejoung.github.io/images/2018_10_31_05.jpg)

재시작을 하면 위에 처럼 jdk 11을 지원하기 시작합니다.

# 참조 
-----
* [open jdk 11](http://jdk.java.net/11/)
* [jdk11 eclipse plugin](https://marketplace.eclipse.org/content/java-11-support-eclipse-2018-09-49)
* [eclipse downloads](https://www.eclipse.org/downloads/packages/)
