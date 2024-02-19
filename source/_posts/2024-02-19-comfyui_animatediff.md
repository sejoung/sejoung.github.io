---
layout: post
title: "AnimateDiff: Stable Diffusion for Animation Generation with ComfyUI"
date: 2024-02-19 10:38 +0900
comments: true
tags: [ "ComfyUI","Stable Diffusion", "스테이블 디퓨전","animation","AnimateDiff","애니메이트디프" ]
categories: [ "Machine Learning" ]
sitemap:
changefreq: daily
priority: 1.0
---

# AnimateDiff: Stable Diffusion for Animation Generation with ComfyUI

지금 까지 comfyui에 AnimateDiff를 사용하여 애니메이션을 생성하는 플러그인은 2개 정도 인데
[Kosinkadink/ComfyUI-AnimateDiff-Evolved](https://github.com/Kosinkadink/ComfyUI-AnimateDiff-Evolved) 플러그인은 
img2img를 사용하여 애니메이션을 생성하지 못한다 그래서 [ArtVentureX/comfyui-animatediff](https://github.com/ArtVentureX/comfyui-animatediff) 플러그인을 사용하여 애니메이션을 생성하였다.

## 설치

먼저 comfyui 플러그인을 설치한다. 설치 방법은 comfyui manager를 설치하면 쉽게 다운로드 할수 있다 

수동 설치를 원한다면 comfyui에 `custom_nodes` 폴더에 직접 다운로드 하면 된다

설치가 완료 되면 필수 모델을 다운로드 해야 된다 custom_nodes 폴더에 `comfyui-animatediff/models/` 폴더에 다운로드 하면 된다.

[guoyww/animatediff](https://huggingface.co/guoyww/animatediff)


## 사용법

[comfyui-animatediff README](https://github.com/ArtVentureX/comfyui-animatediff/blob/main/README.md) 파일에 잘 나와있다


# 참조
-----

* [ArtVentureX/comfyui-animatediff](https://github.com/ArtVentureX/comfyui-animatediff)
* [Kosinkadink/ComfyUI-AnimateDiff-Evolved](https://github.com/Kosinkadink/ComfyUI-AnimateDiff-Evolved)
* [guoyww/animatediff](https://huggingface.co/guoyww/animatediff)
