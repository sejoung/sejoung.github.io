---
layout: post
title: "Google Java Style Guide"
date: 2019-03-11 09:43 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## Google Java Style Guide

프로젝트를 시작할때 코딩컨벤션을 정하고 시작을 한다. 
일단 팀원이 많거나 하면 서로 이야기 하면서 스타일 가이드를 맞추겠지만 혼자서 작성할때는 작성해서 프로젝트를 하기 쉽지 않다.

이럴때 구글 코드스타일 가이드를 활용한다. 

ide 마다 설정도 공유해줘서 셋팅하기 좋다

```
C++ Style Guide, Objective-C Style Guide, Java Style Guide, Python Style Guide, R Style Guide, Shell Style Guide, HTML/CSS Style Guide, 
JavaScript Style Guide, AngularJS Style Guide, Common Lisp Style Guide, and Vimscript Style Guide

```

그리고 한가지 언어가 아니라 여러가지에 대해서 스타일 가이드를 작성해줘서 고민을 안해도 된다.

그럼 지금은 자바를 개발하니 자바 스타일 가이드를 따를 것이고 스타일 가이드에 맞는 파일을 다운 받아서 프로젝트에 적용하면 된다.

지금 프로젝트에서는 인텔리제이를 활용해서 코딩을 하기 때문에 인텔리제이에서 임포트 하는 방법에 대해서 설명하겠다.

[google/styleguide github](https://github.com/google/styleguide)

위에 사이트에 접속하여 다운로드를 받는다.

다운로드 받고 압축을 풀면 여러가지 파일들이 나오는데 여기서 *-java-google-style.xml 파일만 보면 된다.

기본적으로 많이쓰는 인텔리제이와 이클립스에 설정파일이 나온다.

![styleguide import UI1](https://sejoung.github.io/images/2019_03_11_01.jpg){: width="100%"}{: .center}

위에 파일을 활용할것이다 그럼 인텔리제이를 실행시킨후에 Code Style 페이지로 들어갈것이다.

```

File | Settings | Editor | Code Style for Windows and Linux 
IntelliJ IDEA | Preferences | Editor | Code Style for macOS 
Ctrl+Alt+S | 단축키

```

위에 단축키를 누르면 편하게 들어갈수있다. 

![styleguide import UI2](https://sejoung.github.io/images/2019_03_11_02.jpg){: width="100%"}{: .center}

위에서 톱니바퀴 모양의 버튼을 클릭 하면 설정이 나오는데 거기서 Import Scheme... 그다음엔 인텔리제이 코드스타일을 클릭한다.

![styleguide import UI3](https://sejoung.github.io/images/2019_03_11_03.jpg){: width="100%"}{: .center}

그 다음 다운로드 받은 파일을 선택하면 

![styleguide import UI4](https://sejoung.github.io/images/2019_03_11_04.jpg){: width="100%"}{: .center}

그리고 이름을 정하고 ok 버틀을 클릭

![styleguide import UI5](https://sejoung.github.io/images/2019_03_11_05.jpg){: width="100%"}{: .center}

그다음 google code로 선택후에 apply를 클릭하면 끝이 난다.

![styleguide import UI6](https://sejoung.github.io/images/2019_03_11_06.jpg){: width="100%"}{: .center}


# 참조
-----
* [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)
* [google/styleguide](https://github.com/google/styleguide)
* [copying-code-style-settings](https://www.jetbrains.com/help/idea/copying-code-style-settings.html)


