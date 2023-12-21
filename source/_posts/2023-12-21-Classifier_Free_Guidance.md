---
layout: post
title: "Classifier-Free Guidance : CFG"
date: 2023-12-21 11:18 +0900
comments: true
tags: [ "Classifier-Free Guidance : CFG","Stable Diffusion","CFG Scale"]
categories: [ "Stable Diffusion" ]
sitemap:
changefreq: daily
priority: 1.0
---

# Classifier-Free Guidance : CFG

## Classifier guidance(분류자 지침)

Classifier guidance은 확산 모델에 이미지 와 라벨을 통합하는 방법입니다. 
라벨을 사용하여 확산 과정을 안내할 수 있습니다. 예를 들어, "고양이"라는 라벨은 역확산 과정을 조종하여 고양이 사진을 생성합니다.

classifier guidance scale 은 확산 프로세스가 라벨을 얼마나 밀접하게 따라야 하는지를 제어하기 위한 매개변수입니다.


높은 classifier guidance를 사용하면 확산 모델에 의해 생성된 이미지가 극단적이거나 모호하지 않은 예시 쪽으로 편향됩니다. 
모델에게 고양이를 요청하면 모델은 명백히 고양이이고 다른 것은 없는 이미지를 반환합니다.


classifier guidance scale 지침을 얼마나 밀접하게 준수하는지 제어합니다. 
위 그림에서 오른쪽 샘플링은 중간 샘플링보다 분류자 안내 척도가 더 높습니다. 
실제로 이 척도 값은 해당 레이블이 있는 데이터에 대한 드리프트 항의 승수일 뿐입니다.

## Classifier-free guidance(분류자 없는 지침)

classifier guidance은 기록적인 성능을 달성했지만 해당 지침을 제공하려면 추가 모델이 필요합니다. 
이로 인해 훈련에 약간의 어려움이 생겼습니다. Classifier-free guidance는 classifier guidance를  classifier 없이  달성하는 방법입니다. 
지침을 위해 클래스 레이블과 별도의 모델을 사용하는 대신,
텍스트-이미지에서 논의한 것과 똑같은 이미지 캡션을 사용하고 조건부 확산 모델을 학습할 것을 제안했습니다.


classifier-free guidance scale (CFG scale)는 텍스트 프롬프트가 확산 과정을 얼마나 조정하는지 제어하는 값입니다. 
CFG 스케일이 0으로 설정되면 AI 이미지 생성은 조건이 적용되지 않습니다 (즉, 프롬프트가 무시됩니다). 
CFG 스케일이 높을수록 확산이 프롬프트 쪽으로 조정됩니다. 이 값은 일반적으로 7.0에서 13.0 사이의 값을 가집니다


# 참조
-----
* [Diffusion Models Beat GANs on Image Synthesis](https://arxiv.org/abs/2105.05233)
* [Classifier-Free Diffusion Guidance](https://arxiv.org/abs/2207.12598)
