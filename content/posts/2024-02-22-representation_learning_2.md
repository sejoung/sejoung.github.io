---
layout: post
title: "Representation Learning 2"
date: 2024-02-22 15:34 +0900
comments: true
tags: [ "Representation Learning" ]
categories: [ "Machine Learning" ]
sitemap:
changefreq: daily
priority: 1.0
---

# Representation Learning 2

## place recognition(NetVLAD)
* Vector of Locally Aggregated Descriptors (VLAD)
  * VLAD는 이미지의 특징점을 클러스터링하여 각 클러스터에 대한 특징점의 차이를 계산한 후 이를 이용하여 이미지를 표현하는 방법이다.
* NetVLAD
  * VLAD를 딥러닝을 이용하여 학습하는 방법이다.
  * weakly supervised ranking loss를 이용하여 학습한다.

## Landmark recognition
* Deep Local Features (DELF)
  * DELF는 이미지의 특징점을 추출하여 이를 이용하여 이미지를 표현하는 방법이다.
  * 구글 랜드마크 데이터셋을 이용한다.
  * cross-entropy loss를 이용하여 학습한다.
* Google Landmark V2
  * 20만개의 랜드마크를 포함하고 있다.

## Mean Average Precision(mAP)
* 쿼리에 대한 응답 모움에 대한 평균으로 정확도를 측정하는 방법이다.
* listwise AP Loss 
  * 50 개의 랭킹을 본다음 맞는것은 앞으로 땡기고 틀린것은 뒤로 밀어서 학습한다.

## Image Clustering

* 이미지들을 군집 시키는 방법
* k-means
  * 이미지의 특징점을 이용하여 이미지를 군집화한다.
* mahalanobis distance
  * 이미지의 특징점을 이용하여 이미지를 군집화한다.


## Image Clustering: Unsupervised Metric Learning
* Pra-trained embedding에서 label없는 이미지 collection으로 fine-tuning한다.
* Manifold 간의 hard positives와 hard negatives 를 구해서 contrastive learning을 한다.
* STML (Self-Taught Metric Learning)

## Image Clustering: t-SNE
* t-Distributed Stochastic Neighbor Embedding
  * Feature elimination: feature 를 단순히 제거함. 정보 손실이 있음. Feature selection: 통계적 방법을 통해 feature의 중요도에 rank를 매김.
    정보 손실이 있음. 
  * 데이터셋마다 rank가 달라져야함. Feature extraction: 새로운 features를 추출해냄.
  * Linear vs. non-linear

## Data Augmentation
* 학습 데이터의 갯수를 늘리기위해 샘플에 각종 변환을 적용하는것.
* Color Transformation
  * Gaussian Blur, Motion Blur, Brightness Jitter, Contrast Jitter, Saturation Jitter, ISO Noise, JPEG Compression 등
* Spatial Transformation
  * Filp, Rotation, Crop, Affine 등.
  * Detection/Segmentation 의 경우 GT도 transform 주의.
* Rule-based data augmentation
  * PatchShuffle Regularization
    * Window 내의 픽셀을 섞어서 augmentation 하는 기법.
  * SamplePairing
      * 두 장의 이미지를 pixel-wise로 섞어서 네트워크에 통과시키는 형태의 augmentation
  * Mixup
    * 두 장의 이미지를 섞을 때, linear interpolated 된 위치로 섞는 것.
  * Mosaic Augmentation (Cropping and Patching)
    * 여러장의 이미지를 패치를 떼고 붙여서 N-label classification 문제로 푸는 방식
  * Multiple Way of Mixing
    * 두 장의 이미지를 pixel-wise로 섞어서 네트워크에 통과 시키는 형태의 augmentation
    * Pair image를 좀 더 다양하게 mixing하는 8가지 방식을 제안한다.
  * Manifold Mixup
    * Hidden representation 에서 mixup 하는 것.
    * Input mixup에 비해 보다 디시전 바운더리를 더 자연스럽게 만든다.
  * Random Erasing
    * 랜덤으로 지워서 augmentation 하는 방법. (블랙/화이트/랜덤)
    * Random erasing + random cropping 뿐 아니라, image/object-aware erasing도 한다.
    * Object detection과 person re-identification 에도 적용한다.
  * Cutout
    * 이미지의 일부를 잘라내서 수행하는 방식과 그 분석.
  * Hide-And-Seek for Weakly-Supervised Localization
    * 이미지의 여러부분의 패치를 잘라내어서 augmentation 하는 방법
  * CutMix
    * Cropping and Patching 과 같이 이미지 여러장을 잘라 붙이는 방식.
  * AugMix
    * 여러 augmentation 을 직렬과 병렬로 연결하여 적용하는 것.
  * SmoothMix
    * CutMix 처럼 붙일 때 바운더리 근처를 스무딩 하자.
* GAN 기반의 Data Augmentation
  * Generative Advarsarial Networks (GAN) 을 사 용한 data augmentation 을 수행한다.
  * Medical Image Augmentation
    * 간의 병변 추측 모델 학습을 위해 GAN으로 데이터를 생성하여 학습. 
    * 평가는 병변의 여부에 대한 classification 으로 함.
  * SinGAN: Single Image GAN
    * 단일 이미지로 unconditional GAN을 학습하는 것.
    * Fully-convolutional GANs으로, multi-scale pyramid로 부터 패치 정보들과 이미지 전체 구조를 학습한다.
    * Loss: Advarsarial loss + Reconstruction loss
  * GANGealing: GAN-Supervised alignment
    * GAN으로 생성된 이미지를 supervision으로 주어 dense visual alignment 모델을 학습하기 위한 방식
    * 별다른 supervision없이 다양한 image data augmentation을 gan을 통해 학습한다.
* AutoML 기반의 방법
  * Data Augmentation Policy 를 AutoML 을 통해 찾는 방법을 제안한다
  * AutoAugment
    * Neural Architecture Search 와 비슷하게 RNN controller 를 통해 Augmentation policy를 뽑고 
    * 이후 네트워크를 학습시켜서 validation accuracy 를 reward로 Policy gradient를 사용한 강화학습을 한다
  * Population Based AutoAugment
    * Density matching 기반의 efficient search strategy를 제안한다.
    * Bayesian Optimization기법(Tree-structuredParzenEstimator(TPE)) 를 사용하여 Augmentation policy 추출
  * Fast AutoAugment
    * Differentiable AutoAugment
    * 미분 불가능한 policy gradients를 미분 가능하게 하면, gradient descent optimization 으로 augmentation policy를 학습할 수 있지 않을까?
    * Gradient-based Neural Architecture Search(NAS)의 대표적 방법인 “DARTS: Differentiable Architecture Search (ICLR 2019)"를 따라한다.
  * RandAugment
    * 왜 AutoML 로 augmentation policy 를 찾아야 할까?
    * 아예 찾지 말고, mini-batch 샘플링 때마다 여러 augmentation 옵션 중 랜덤으로 선택해서 적용해 보자.
  * UniformAugment
    * 두 장의 이미지를 pixel-wise로 섞어서 네트워크에 통과시키는 형태의 augmentation
    * 엑세스가 되지 않은 논문이다
  * TrivialAugment
    * Effectiveness와 Efficiency 사이에서 trade-off 를 고려
    * 아예 parameter-free로 가기 보다는 몇가지 중요한 factor는 서치하자


# 참조
-----

* [pytorch-NetVlad](https://github.com/Nanne/pytorch-NetVlad/blob/master/netvlad.py)
* [Google Landmarks Dataset v2 -- A Large-Scale Benchmark for Instance-Level Recognition and Retrieval](https://arxiv.org/abs/2004.01804)
* [Breaking Down Mean Average Precision (mAP)](https://towardsdatascience.com/breaking-down-mean-average-precision-map-ae462f623a52)
* [Deep Image Retrieval](https://github.com/naver/deep-image-retrieval)
* [K-평균 군집화(K-means Clustering)](https://ratsgo.github.io/machine%20learning/2017/04/19/KC/)
* [scikit-learn](https://scikit-learn.org/stable/modules/clustering.html)
* [t-SNE](https://lvdmaaten.github.io/tsne/)
* [sklearn.manifold.TSNE](https://scikit-learn.org/stable/modules/generated/sklearn.manifold.TSNE.html)
* [Deep Metric Learning: a (Long) Survey](https://hav4ik.github.io/articles/deep-metric-learning-survey)
* [Random Erasing Data Augmentation](https://github.com/zhunzhong07/Random-Erasing)
* [GANgealing](https://www.wpeebles.com/gangealing)
* [deepaugment](https://github.com/barisozmen/deepaugment)
