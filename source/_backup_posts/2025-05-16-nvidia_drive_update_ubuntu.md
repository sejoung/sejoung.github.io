---
layout: post
title: "우분투 nvidia 드라이버 업데이트"
date: 2025-05-16 11:49 +0900
comments: true
tags: [ "nvidia driver", "엔비디아 드라이브", "nvidia-smi"]
categories: [ "ubuntu" ]
sitemap:
    changefreq: daily
    priority: 1.0
---

# 우분투 nvidia 드라이버 업데이트

## 사용 가능한 NVIDIA 드라이버 목록 보기

```
ubuntu-drivers devices
```


##  최신 권장 드라이버 자동 설치

```
sudo ubuntu-drivers autoinstall
```


## 수동으로 특정 버전 설치

```
sudo apt update
sudo apt install nvidia-driver-575
```

## 드라이버 설치 후 재부팅

```
sudo reboot
```

# 참고

-----
