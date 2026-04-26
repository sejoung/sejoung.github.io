---
layout: post
title: "우분투 NVIDIA 드라이버 설치(ubuntu-drivers 사용)"
date: 2023-11-21 10:57 +0900
comments: true
tags: [ "우분투","ubuntu" ,"nvidia" ,"ubuntu-drivers" ]
categories: [ "tool" ]
sitemap:
changefreq: daily
priority: 1.0
---

# 우분투 NVIDIA 드라이버 설치(ubuntu-drivers 사용)

ubuntu-drivers를 사용하여 NVIDIA 드라이버를 설치하는 방법을 알아보자.


## 드라이버 버전 확인

```shell
cat /proc/driver/nvidia/version
```

## 드라이버 확인

### 데스크탑

```shell
sudo ubuntu-drivers list
```

### 서버

```shell
sudo ubuntu-drivers list --gpgpu
```

## 일반 용도(예: 데스크탑 및 게임)용 드라이버 설치

가장 적합한 드라이버를 설치한다

```shell
sudo ubuntu-drivers install
```

특정 버전설치 설치

```shell
sudo ubuntu-drivers install nvidia:525

```

## GPGPU 용도(예: 서버)용 드라이버 설치

가장 적합한 드라이버를 설치한다

```shell
sudo ubuntu-drivers install --gpgpu
```

특정 버전설치 설치

```shell
sudo ubuntu-drivers install --gpgpu nvidia:525-server

sudo apt install nvidia-utils-525-server

```


## 삭제

```shell

sudo apt --purge remove '*nvidia*${DRIVER_BRANCH}*'

sudo apt autoremove

```

# 참조
-----

* [NVIDIA 드라이버 설치](https://ubuntu.com/server/docs/nvidia-drivers-installation)
