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
brew cask install temurin

brew install --cask temurin11

```

위에 섩치가 있고 다른 버전을 설치 하려면 아래 처럼 하면 된다.

```
brew tap homebrew/cask-versions
brew search temurin
brew cask install temurin11
```

삭제 방법

```
brew list
brew remove temurin11
```

### jenv 설치

```
brew install jenv

```

설치 버전 확인
```
jenv versions
```

삭제
```
jenv remove temurin11

```

#### Bash

```
echo 'export PATH="$HOME/.jenv/bin:$PATH"' >> ~/.bash_profile
echo 'eval "$(jenv init -)"' >> ~/.bash_profile

```

#### Zsh

```
echo 'export PATH="$HOME/.jenv/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(jenv init -)"' >> ~/.zshrc
```

```

jenv add /Library/Java/JavaVirtualMachines/temurin-18.jdk/Contents/Home temurin18 added

jenv add /Library/Java/JavaVirtualMachines/temurin-11.jdk/Contents/Home temurin11 added

```

```

jenv global 18

jenv global 11

```

그담엔 환경을 왔다갔다 하기 편하게하는 툴인 jenv를 셋팅 홈페이지에 잘 설명이 되어 있다.

이부분은 좀 고민해도 되는것이 요즘엔 툴에서 환경을 바꿀수 있기때문에 굳이 안깔아도 될수도 먼저 셋팅해 보았다가 안하게 됨

```
jenv doctor
```
위 명령어로 진단 가능

```

jenv enable-plugin export
exec $SHELL -l
echo ${JAVA_HOME}
```
위 명령어는 `JAVA_HOME`을 설정 하는 것이다. 잘안되면 `jenv disable-plugin export` 도 한번 해보고 하는게 좋다.


```
jenv versions
```
지금 사용중인 버전 확인

### zsh

이번에 맥 업데이트 하면서 zsh이 기본 쉘로 바꼈다.

```

brew cask install iterm2

sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

open ~/.zshrc

```
난 테마를 바꿈

```

ZSH_THEME="agnoster"

```

명령줄에 sanaes@dev 를 제거 

```
DEFAULT_USER="sanaes"
```


```

source ~/.zhrc

```

Solarized Dark color scheme를 사용


# 참조
-----
* [Homebrew](https://brew.sh/)
* [Homebrew AdoptOpenJDK](https://github.com/AdoptOpenJDK/homebrew-openjdk)
* [jenv](http://www.jenv.be/)
* [appcleaner](https://freemacsoft.net/appcleaner/)
* [oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh/wiki/Themes)
* [how-to-configure-your-macos-terminal-with-zsh](https://www.freecodecamp.org/news/how-to-configure-your-macos-terminal-with-zsh-like-a-pro-c0ab3f3c1156/)
* [MonitorControl](https://github.com/MonitorControl/MonitorControl)
* [keka](https://www.keka.io)
* [rectangleapp](https://rectangleapp.com/)
