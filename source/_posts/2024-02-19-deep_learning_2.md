---
layout: post
title: "Deep Learning-2"
date: 2024-02-19 11:32 +0900
comments: true
tags: [ "Deep Learning" ]
categories: [ "Machine Learning" ]
sitemap:
changefreq: daily
priority: 1.0
---

# Deep Learning 2
## Beyond ResNet

### DenseNet : Add Dense Connection
* ResNet의 단점을 보완하기 위해 제안된 방법
* ResNet은 입력과 출력을 더하는 방식으로 연결을 만들었지만, DenseNet은 입력과 출력을 Concatenation하는 방식으로 연결을 만듬

### SENet : Squeeze and Excitation module
* 각 채널의 중요도를 학습하여 채널의 중요도에 따라 가중치를 부여하는 방법

### EfficientNet : Network Depth, Network Width, Input Resolution search.
* baseline에 스케일업을 한다
* compound scaling을 통해 네트워크의 깊이, 너비, 입력 해상도를 조정하여 성능을 높임


## Efficient CNN
* smail model을 만들어서 성능을 높이는 방법
* best cnn 은 가장 정확한 cnn이 아니다
* mobile net
  * depthwise separable convolution
* shuffle net
  * group convolution
  * channel shuffle

## Vision Transformer
* Attention을 이용하여 CNN을 대체하는 방법
* soft-and-hard attention
  * soft attention : 0~1을 이용하여 weighted sum
  * hard attention : 0~1을 이용하여 하나의 feature를 선택
* self-attention
  * key, query, value를 이용하여 attention을 계산
* multi-head attention
  * 여러개의 attention을 이용하여 attention을 계산
* cross-attention
  * 다른 feature map을 이용하여 attention을 계산
* stand-alone self attention
  * 지역적인 정보를 이용하여 attention을 계산

## Transformer
* encoder-decoder 구조
* self-attention을 이용하여 input을 처리
* positional encoding을 이용하여 input의 위치 정보를 추가

## Vision Transformer(ViT)
* image를 patch로 나누어서 input으로 사용
* masked self-attention을 이용하여 input을 처리
* base model
* large model
* huge model

## Swin Transformer
* shift window를 이용하여 input을 처리
* local attention을 이용하여 input을 처리
* W-MSA
  * window based multi-head self-attention(local attention)


# 참조
-----

* [NEURAL MACHINE TRANSLATION BY JOINTLY LEARNING TO ALIGN AND TRANSLATE](https://arxiv.org/pdf/1409.0473.pdf)
* [Show, Attend and Tell: Neural Image Caption Generation with Visual Attention](https://arxiv.org/pdf/1502.03044.pdf)
* [Visual Guide to Transformer Neural Networks - (Episode 2) Multi-Head & Self-Attention](https://www.youtube.com/watch?v=mMa2PmYJlCo)
* [Stand-Alone Self-Attention in Vision Models](https://arxiv.org/pdf/1906.05909.pdf)
* [Master Positional Encoding: Part I](https://towardsdatascience.com/master-positional-encoding-part-i-63c05d90a0c3)
* [AN IMAGE IS WORTH 16X16 WORDS: TRANSFORMERS FOR IMAGE RECOGNITION AT SCALE](https://arxiv.org/pdf/2010.11929.pdf)
