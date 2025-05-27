---
layout: post
title: "Windows에서 심볼릭 링크 만들기"
date: 2025-05-27 18:39 +0900
comments: true
tags: [ "심볼릭 링크", "mklink", "symlinks", "윈도우", "windows" ]
categories: [ "windows" ]
sitemap:
    changefreq: daily
    priority: 1.0
---

# Windows에서 심볼릭 링크 만들기

```
mklink /d <링크가 필요한 프로젝트>  <실제 파일이 존재하는곳>
```
위 와 같이 mklink 명령어를 사용하여 심볼릭 링크를 만들 수 있습니다.


## 간단한 심볼릭 링크 TOOL

### Symbolic11
Symbolic11은 심볼릭 링크를 쉽게 만들 수 있는 GUI 프로그램입니다. 이 프로그램을 사용하면 명령어를 입력하지 않고도 심볼릭 링크를 생성할 수 있습니다.

![그림](https://github.com/Benisgo/Symbolic11/blob/master/Assets/WindowsSandboxClient_YawPuzrYbi.png?raw=true)


# 참고

-----

* [Symbolic11](https://github.com/Benisgo/Symbolic11)
* [mklink](https://learn.microsoft.com/ko-kr/windows-server/administration/windows-commands/mklink)
* [SageLinks](https://github.com/raspopov/SageLinks)
