---
layout: post
title: "Simple Python Version Management: pyenv"
date: 2023-12-13 14:11 +0900
comments: true
tags: [ "pyenv","Python Version Management","Python","버전관리" ]
categories: [ "python" ]
sitemap:
changefreq: daily
priority: 1.0
---

# Simple Python Version Management: pyenv

jenv와 같은 역할을 하는 pyenv를 소개한다.

## 설치

```shell
brew update

brew install pyenv
```

## 사용법

```shell
pyenv install 3.10

pyenv global 3.10
```

## 업그레이드

```shell
brew upgrade pyenv
```

# 참조
-----
* [pyenv](https://github.com/pyenv/pyenv)
