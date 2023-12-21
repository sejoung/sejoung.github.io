---
layout: post
title: "Stable Diffusion Samplers"
date: 2023-12-21 17:18 +0900
comments: true
tags: [ "Stable Diffusion Samplers","Stable Diffusion","Samplers"]
categories: [ "Stable Diffusion" ]
sitemap:
changefreq: daily
priority: 1.0
---

# Stable Diffusion Samplers

## Old-School ODE solvers
상미분 방정식(ODE)

* Euler :  가장 간단한 해결 입니다.
* Heun : 오일러의 더 정확하지만 느린 버전입니다.
* LMS(Linear multi-step method) : 오일러와 속도는 동일하지만 (아마도) 더 정확합니다.


## Ancestral samplers

* Euler a
* DPM2 a
* DPM++ 2S a
* DPM++ 2S a Karras

Ancestral samplers는 각 샘플링 단계에서 이미지에 노이즈를 추가합니다. 샘플링 결과에 임의성이 있기 때문에 확률적 샘플러 입니다.

단점은 이미지가 수렴되지 않는다는 것입니다.


## Karras noise schedule

Karras 라는 라벨이 붙은 샘플러는 Karras 기사 에서 권장하는 소음 일정을 사용합니다. 
주의 깊게 살펴보면 노이즈 단계 크기가 끝 부분에서 더 작아지는 것을 볼 수 있습니다.
그들은 이것이 이미지의 품질을 향상시킨다는 것을 발견했습니다.



## DDIM 및 PLMS

DDIM(Denoising Diffusion Implicit Model) 및 PLMS(Pseudo Linear Multi-Step 방법)는 원래 Stable Diffusion v1 과 함께 제공되는 샘플러였습니다 . 
DDIM은 확산 모델용으로 설계된 최초의 샘플러 중 하나입니다. PLMS는 DDIM의 더 새롭고 빠른 대안입니다.

일반적으로 오래된 것으로 간주되어 더 이상 널리 사용되지 않습니다.

## DPM 및 DPM++

DPM (확산 확률 모델 솔버) 및 DPM++ 는 2022년에 출시된 확산 모델용으로 설계된 새로운 샘플러입니다. 이들은 유사한 아키텍처의 솔버 제품군을 나타냅니다.

DPM 과 DPM2는 DPM2가 2차라는 점을 제외하면 유사합니다(더 정확하지만 느림).

DPM++ 는 DPM보다 개선된 것입니다.

DPM 적응형은 단계 크기를 적응적으로 조정합니다. 샘플링 단계 수 내에서 완료를 보장하지 않으므로 속도가 느려질 수 있습니다.


## UniPC

UniPC (Unified Predictor-Corrector)는 2023년에 출시된 새로운 샘플러입니다. 
ODE 솔버의 예측-수정기 방법에서 영감을 받아 5~10단계로 고품질 이미지 생성을 달성할 수 있습니다.


## k-diffusion

마지막으로, k-확산 이라는 용어를 듣고 그것이 무엇을 의미하는지 궁금했을 것입니다. 
이는 단순히 Katherine Crowson의 k-diffusion GitHub 저장소 및 이와 관련된 샘플러를 나타냅니다 .

저장소는 Karras 2022 기사 에서 연구된 샘플러를 구현합니다 .

기본적으로 DDIM, PLMS, UniPC를 제외한 AUTOMATIC1111의 모든 샘플러는 k-diffusion에서 차용한 것입니다.


# 참조
-----
* [Stable Diffusion Samplers: A Comprehensive Guide](https://stable-diffusion-art.com/samplers/)
* [k-diffusion](https://github.com/crowsonkb/k-diffusion)
* [Elucidating the Design Space of Diffusion-Based Generative Models](https://arxiv.org/abs/2206.00364)
