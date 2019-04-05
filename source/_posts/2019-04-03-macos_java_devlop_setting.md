---
layout: post
title: "맥북에서 자바 개발 환경 셋팅"
date: 2019-04-03 14:15 +0900
comments: true
tags : ["개발환경","맥북"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 맥북에서 자바 개발 환경 셋팅

### 파인더에 숨김파일 표시

```

defaults write com.apple.finder AppleShowAllFiles -bool true

killall Finder

```

단축키(이것은 해당 폴더만 적용된다.)

```
shift +command + .
```

### brew 설치

일단 처음에 받으니 brew도 설치가 안되있었다 이것부터 설치

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

### JDK 설치

그리고 난 오픈JDK 배포판 중에 AdoptOpenJDK를 선택 해서 인스톨 할것이다.

지금 기준으로 jdk11을 설치 했는데 jdk8도 필요하게 됨

```
brew cask install adoptopenjdk
```

위에 섩치가 있고 다른 버전을 설치 하려면 아래 처럼 하면 된다.

```

brew tap AdoptOpenJDK/openjdk
brew cask install adoptopenjdk8

```

### jenv 설치


```

jenv add /Library/Java/JavaVirtualMachines/adoptopenjdk-11.0.2.jdk/Contents/Home adoptopenjdk11 added

jenv add /Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home adoptopenjdk8 added

```

```

jenv global 1.8

jenv global 11.0

```

그담엔 환경을 왔다갔다 하기 편하게하는 툴인 jenv를 셋팅 홈페이지에 잘 설명이 되어 있다.

이부분은 좀 고민해도 되는것이 요즘엔 툴에서 환경을 바꿀수 있기때문에 굳이 안깔아도 될수도 먼저 셋팅해 보았다가 안하게 됨

# 참조
-----
* [Homebrew](https://brew.sh/)
* [Homebrew AdoptOpenJDK](https://github.com/AdoptOpenJDK/homebrew-openjdk)
* [jenv](http://www.jenv.be/)
* [appcleaner](https://freemacsoft.net/appcleaner/)
