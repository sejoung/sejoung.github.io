---
layout: post
title: "projectlombok IDE에 설치 방법"
date: 2018-08-16 10:46 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### projectlombok IDE에 설치 방법

이번에 사용하고 있는 서비스에 LOMBOK을 적용시키기로 했습니다.

그래서 프로젝트에서 제일 많이 쓰고 있는 IDE(이클립스, 인텔리J)에 LOMBOK 적용 방법에 대해서 작성하려고 합니다.

[projectlombok download](https://projectlombok.org/download) 페이지에 가서 다운로드를 먼저 받음

![projectlombok UI1](https://sejoung.github.io/images/2018_08_16_01.jpg){: width="100%"}{: .center}

여기서 다룬 받은 lombok.jar를 실행 자바가 기본이면 클릭하면 실행 된다 안되면 cmd 창에서 아래의 명령어로 실행

```

java -jar lombok.jar

```

![projectlombok UI2](https://sejoung.github.io/images/2018_08_16_02.jpg){: width="100%"}{: .center}

위에 창에 나오면 기본적으로 이클립스를 인스톨러로 설치하시면 아래에 표시가 나오고 아니면 Specify location을 클릭해서 경로를 찾아서 선택해주면 된다

![projectlombok UI3](https://sejoung.github.io/images/2018_08_16_03.jpg){: width="100%"}{: .center}

그담엔 install/update 버튼 클릭

그러면 eclipse.ini 파일에 vmarg로 아래 처럼 등록이 된다.

```

-javaagent:D:\tools\eclipse\lombok.jar

```

수동으로 lombok.jar파일을 다운 받은 경로를 가지고  eclipse.ini 파일에 등록해주고 재기동 해도 동작함


위에는 이클립스 기준이고 인텔리J는 더욱 더 편하다.

인텔리J는 실행후에 setting 

![projectlombok UI4](https://sejoung.github.io/images/2018_08_16_04.jpg){: width="100%"}{: .center}

그담에 플러그인 검색

![projectlombok UI5](https://sejoung.github.io/images/2018_08_16_05.jpg){: width="100%"}{: .center}

안나옴 그럼 repository 검색 링크 클릭 팝업이 뜨고 lombok 플러그인 install 버튼 클릭

![projectlombok UI6](https://sejoung.github.io/images/2018_08_16_06.jpg){: width="100%"}{: .center}

재기동 하면 끝

위에 내용은 홈페이지에 이클립스([projectlombok setup](https://projectlombok.org/setup/eclipse)), 
인텔리J([projectlombok setup](https://projectlombok.org/setup/intellij)) 참조 함


# 참조 
-----
* [projectlombok](https://projectlombok.org)

