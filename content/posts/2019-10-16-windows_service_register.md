---
layout: post
title: "원도우에 서비스르 등록하기"
date: 2019-10-16 13:55 +0900
comments: true
tags : ["windows","service"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 원도우에 서비스르 등록하기

Java Service Wrapper 가 있지만 winsw를 사용하려고 한다.

```

이제 사람들이 묻는 첫 번째 질문은 Java Service Wrapper 프로젝트가 이미 있을 때 왜 다른 질문인지 생각합니다. 
내 자신을 작성하는 주된 이유는 라이센스였습니다. 
Java Service Wrapper 프로젝트는 GPL에 있기 때문에 (상업용 라이센스를 다른 라이센스로 판매 할 수 있기 때문에) 
Jenkins (MIT 라이센스하에있는)가 사용 하기 어렵습니다.

기능 측면에서는 주목할 가치가 거의 없습니다. 프로세스를 Windows 서비스로 래핑하는 문제는 잘 정의되어있어 실질적인 혁신의 여지가 없습니다. 
기본적으로 프로세스 시작 방법을 지정하는 구성 파일을 작성하며 서비스를 설치 / 제거 / 시작 / 중지하기위한 프로그래밍 방식을 제공합니다. 
또 다른 주목할만한 차이점은 winsw는 모든 실행 파일을 호스팅 할 수 있지만 Java Service Wrapper는 Java 앱만 호스팅 할 수 있다는 것입니다. 
당신이 이것을 좋아하든 아니든 당신의 취향에 달려 있기 때문에 나는 내 것이 더 좋다고 주장하지 않을 것입니다. 
그냥 다릅니다.

이름에서 알 수 있듯이 이것은 Windows 전용입니다. 
유닉스 시스템은 데몬에 대한 자체 규칙을 가지고 있으므로 유닉스 데몬은 launchd/upstart/SMF/etc 사용자 정의 서비스 래퍼 대신을 사용하는 것이 좋습니다 .

```

위에 내용으로 되어 있다.

사용 법은 간단하다 exe 파일을 다운받고 이름을 서비스 이름으로 바꾸고 같은 이름으로 xml을 선언하면 되는데 아래 와 같다.

```xml

<service>
    <id>test_server</id>
    <name>test_server</name>
    <description>test_server</description>
    <env name="JAVA_HOME" value="C:\test_server\jdk11"/>
    <executable>C:\test_server\jdk11\bin\java</executable>
    <arguments>-jar C:/test_server/test_server.jar -Xmx256m -Xms256m -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=C:\test_server --file.encoding=UTF-8 --spring.profiles.active=prod --spring.config.location=classpath:/,file:C:/test_server/config/</arguments>
    <logmode>rotate</logmode>
    <logpath>C:/test_server/logs/cmd</logpath>
    <delayedAutoStart />
</service>

```

위와 같이만 처리하면 된다.

위에 로그는 콘솔에 찍히는 로그에 대해 처리 하는 방식을 말하는것


# 참조
-----
* [winsw](https://github.com/kohsuke/winsw)
