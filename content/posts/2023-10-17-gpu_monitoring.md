---
layout: post
title: "리눅스에서 gpu 사용량 모니터링 툴"
date: 2023-10-17 14:45 +0900
comments: true
tags: [ "gpu monitoring","그래픽 카드 모니터링툴","모니터링툴"]
categories: [ "tool" ]
sitemap:
changefreq: daily
priority: 1.0
---

# 리눅스에서 gpu 사용량 모니터링

## nvidia-smi

```shell
watch -n 1 nvidia-smi
```

## nvitop

```shell
pip3 install --upgrade nvitop

nvitop
```

# 참조
-----
* [nvitop](https://github.com/XuehaiPan/nvitop)
* [gpustat](https://github.com/wookayin/gpustat)
