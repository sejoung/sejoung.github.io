---
layout: post
title: "Stable Diffusion 이해를 위한 자료 모음"
date: 2023-10-31 10:00 +0900
comments: true
tags: [ "Diffusion","Stable Diffusion", "스테이블 디퓨전"]
categories: [ "Machine Learning" ]
sitemap:
changefreq: daily
priority: 1.0
---

# Stable Diffusion 이해를 위한 자료 모음

## Diffusion Model

https://arxiv.org/abs/1503.03585

2015년 발표

`Diffusion(확산)은 액체나 기체에 다른 물질이 섞이고, 그것이 조금씩 번져가다가 마지막에는 일률적인 농도로 바뀌는 현상이다.` 위키피디아

![확산](https://mblogthumb-phinf.pstatic.net/20131015_167/todaudrhkwkd_13817975412967wfk3_JPEG/1.jpg?type=w2)

물리의 확산 현상에 영감을 받아 모델을 설계

가우시안 노이즈

마르코프 체인(특정 상태의 확률은 오직 과거의 기인한다)


![디퓨전모델](https://velog.velcdn.com/images/fermi99/post/364897c1-5d8f-4951-ab7e-128bfe699b95/image.png)

## Denoising Diffusion Probabilistic Models (DDPM)

https://arxiv.org/abs/2006.11239

유넷을 활용 → 정답 상태를 유추

정답만 유추 하기 때문에 좀더 간단해짐 → 노이즈 성분을 예측하니깐 조금 더 품질이 좋아짐

해결 컨셉은 노이즈화 할때의 수식을 조금 다르게 수정

`문제점 : 너무 느리다 스텝이 1000 사용해야 됨(GAN 은 1번)`

## Denoising Diffusion Implicit Models (DDIM)

https://arxiv.org/abs/2010.02502

아이디어 느리니깐 스템을 10, 20, 50 ,100 1000 으로 사용해도 크게 나빠지지 않는다.

![DDIM](https://user-images.githubusercontent.com/79881119/233402047-07361544-87f3-4d51-8d6f-718fab06dcfc.png)

## VariationalAutoEncoder (VAE)

* supervised learning : 데이터와 라벨이 페어
  * classification
  * object detection
  * semantic segmentation
  * image captioning
* unsupervised learning : 데이터만 존재
  * clustering
  * dimensionality reduction
  * feature learning
  * density estimation

    
이미지를 넣어서 차원이 작은 벡터를 나오면 이것으로 이미지를 만든다 

explicit density estimation : 확률밀도함수를 직접적으로 구하는 방법

implicit density estimation :  확률밀도함수를 직접적으로 구하지 않고, 확률밀도함수를 구하는 것을 목적으로 하지 않는 방법



작은 차원에 피처만으로 이미지를 만들수 있다

최대 가능도를 써서 트레이닝을 시킨다 

문제는 계산을 할수가 없다 실제 값을 아는게 아니라 샘플링만 가능


![](https://github.com/CompVis/latent-diffusion/raw/main/assets/modelfigure.png)


# 참조
-----

* [Latent Diffusion Models](https://github.com/CompVis/latent-diffusion)
* [Stable Diffusion](https://github.com/CompVis/stable-diffusion)
* [Diffusion Model 설명 – 기초부터 응용까지](https://ffighting.net/deep-learning-paper-review/diffusion-model/diffusion-model-basic/)
* [Stable Diffusion : High-Resolution Image Synthesis with Latent Diffusion Models](https://ffighting.net/deep-learning-paper-review/diffusion-model/stable-diffusion/)
* [GAN: Generative Adversarial Networks (꼼꼼한 딥러닝 논문 리뷰와 코드 실습)](https://www.youtube.com/watch?v=AVvlDmhHgC4)
* [머신러닝/딥러닝 강의 - 004 UNet 네트워크 구현하기](https://www.youtube.com/watch?v=sSxdQq9CCx0)
* [U-Net: Convolutional Networks for Biomedical Image Segmentation (MICCAI 2015)](https://www.youtube.com/watch?reload=9&v=n_FDGMr4MxE)
* [Stable Diffusion 논문 리뷰](https://www.youtube.com/watch?v=7fBQDaJkcSU)
* [laion.ai](https://laion.ai/)
* [stability.ai](https://stability.ai/)
* [불과 1년 만의 쾌거, 생성 모델 특집 - Diffusion Model 이 이루어낸 모든 것을 AI 전문가로부터 들어봅니다!](https://www.youtube.com/watch?v=e2rFsn93o0U)
* [요즘 핫한 생성모델 stable diffusion 찍먹해보기](https://www.youtube.com/watch?v=WQuwkTKvUfg)
* [guided diffusion에서 StableDiffusion, 그리고 Plug&Play와 DiffStyle까지](https://www.youtube.com/watch?v=nthpXARTduk)
* [가우시안 노이즈(Gaussian Noise)](https://dacon.io/codeshare/4652)
* [Diffusion Model 수학이 포함된 tutorial](https://www.youtube.com/watch?v=uFoGaIVHfoE)
* [Diffusion Model 수학이 포함된 tutorial 발표자료](https://drive.google.com/file/d/1u8EWfDvaJQGKKC4akQDy50kP-qF_MT09/view?pli=1)
* [[논문리뷰] DDPM: Denoising Diffusion Probabilistic Model](https://jang-inspiration.com/ddpm-2)
* [DDPM: Denoising Diffusion Probabilistic Models 논문 리뷰](https://velog.io/@hanlyang0522/DDPM-Denoising-Diffusion-Probabilistic-Models-%EB%85%BC%EB%AC%B8-%EB%A6%AC%EB%B7%B0)
* [DDIM(Denoising Diffusion Implicit Models) 이해하기](https://junia3.github.io/blog/ddim)
* [[DLD 2022] Denoising Diffusion Implicit Models](https://www.youtube.com/watch?v=zcEe78I_4TU)
* [Denoising Diffusion Implicit Models](https://arxiv.org/abs/2010.02502)
* [Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239)
* [Deep Unsupervised Learning using Nonequilibrium Thermodynamics](https://arxiv.org/abs/1503.03585)
* [오토인코더(AutoEncoder)](https://pebpung.github.io/autoencoder/2021/09/11/Auto-Encoder-1.html)
* [[#32.Lec] AutoEncoder and Variational AutoEncoder - 딥러닝 홀로서기](https://www.youtube.com/watch?v=54hyK1J4wTc)
* [Chapter 2 확률(Probability) vs 가능도(Likelihood)](https://bookdown.org/mathemedicine/Stat_book/probability-vs-likelihood.html)

