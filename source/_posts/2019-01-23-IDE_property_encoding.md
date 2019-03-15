---
layout: post
title: "IDE 별 프로퍼티 인코딩에 따른 설정"
date: 2019-01-23 11:40 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### IDE 별 프로퍼티 인코딩에 따른 설정

이클립스와 인텔리제이의 인코딩에 따른 주석 코드에 변화가 있다. 
아래를 보면 처음엔 이클립스에서 작성한 프로퍼티를 보면

![UI1](https://sejoung.github.io/images/2019_01_23_01.jpg)

그 다음엔 인텔리제이로 수정을 하면


![UI2](https://sejoung.github.io/images/2019_01_23_02.jpg)

위에 설정을 체크 하고 보면 수정됨 


![UI3](https://sejoung.github.io/images/2019_01_23_03.jpg)

그렇게 되면 기존 과 코드가 틀리다

\uc811에서 \uC811 이런식으로 대문자로 바꿘다 이것을 둘다 맞출수 있는데 맞추는 방법은


이클립스

![UI4](https://sejoung.github.io/images/2019_01_23_04.jpg)

위에 플러그인 기준으로 

![UI5](https://sejoung.github.io/images/2019_01_23_05.jpg)

위에 설정화면에서 바꿀수 있다.


인텔리제이

Windows
```
<IDE_HOME>\bin\idea.properties
```

macOS

```
IntelliJ IDEA.app/Contents/bin/idea.properties
```

Linux

```
<IDE_HOME>/bin/idea.properties
```

위에 프로퍼티에 

```

idea.native2ascii.lowercase=true

```

설정으로 바꿀수 있다.

위에 값을 안맞춰 주면 commit 시에 모든 주석이 다 바꿘것 처럼 보여서 통일이 되야됨 

# 참조
-----
* [encoding-issue-while-spring-message-source-using-in-idea](https://stackoverflow.com/questions/29583380/encoding-issue-while-spring-message-source-using-in-idea)
* [idea resource-bundle](https://www.jetbrains.com/help/idea/resource-bundle.html)
* [eclipse properties-editor](https://marketplace.eclipse.org/content/properties-editor)


