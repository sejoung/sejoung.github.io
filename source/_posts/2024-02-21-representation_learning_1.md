---
layout: post
title: "Representation Learning 1"
date: 2024-02-21 14:36 +0900
comments: true
tags: [ "Representation Learning" ]
categories: [ "Machine Learning" ]
sitemap:
changefreq: daily
priority: 1.0
---

# Representation Learning 1

## Metric Learning

메트릭이란 거리를 측정하는 함수를 말한다. 메트릭 러닝은 데이터의 표현을 학습하는 것이다. 
이는 데이터의 표현을 학습하여 거리를 측정하는 함수를 학습하는 것이다. 

유사도(Similarity)-거리(Distance)의 관계를 학습하는 것이다.
* Information retrieval - 정보 검색
* Face identification/verification - 얼굴 인식/검증
* Person re-identification - 개인 사찰 이슈
* Visual object tracking - 객체 추적
* Local patch matching for stereo imaging - 스테레오 이미징을 위한 로컬 패치 매칭
* Visual representation learning


시뮬러리티(Similarity)는 두 데이터가 얼마나 비슷한지를 나타내는 척도이다.


### Classical Metric Learning
* Mahalanobis Distance - 마할라노비스 거리
  * M 을 데이터로 부터 학습한다.
  * A first approach to distance metric learning
  * Large Margin Nearest Neighbor (LMNN)

### Deep Metric Learning
* Deep Neural Networks 를 사용한다.
* siamese networks
  * siamese architecture
  * contrastive loss(클래스가 같은 것은 가깝게, 다른것은 멀게)
  * Euclidean distance - 유클리디안 거리
  * Triplet Networks
    * anchor에 positive, negative를 모두 넣는다
    * positive는 가깝게, negative는 멀게
    * weight sharing

### Sample Selection
모든 데이터를 다 볼수 없으니, 샘플을 선택해야 한다.

너무 쉬운 샘플은 학습에 도움이 되지 않는다.
너무 어려운 샘플은 stable 하지 않다.

* uniform sampling
* distance weighted margin base loss
  * DWS(distance weighted sampling)
  * Margin-based loss

### Quadruplet Networks
* Triplet Networks 의 문제점
  * 관계가 충분하지 않다
* Quadruplet rank loss
  * 2개의 트러플 랭크를 이용한다

### Neighbor Search
* lable transfer
* kNN
* Image Retrieval
  * most straightforward way  - 가장 직관적인 방법
  * working even for unseen classes - 본적 없는 클래스에도 작동한다
* Face Verification
* Person Re-identification
  * 중국에서 많이 연구중 - 중국의 사찰 이슈 때문에... 윤리적....이슈...
* Online Visual Object Tracking
  * 실시간으로 오브젝트를 추적하는 것
  * candidate box를 만들고, 그중에서 가장 가까운 것을 찾는다
* Unsupervised Representation Learning


### face recognition
[facenet](https://github.com/davidsandberg/facenet)


* beyond binary supervision


# 참조
-----

* [facenet](https://github.com/davidsandberg/facenet)
* [cars196](http://ai.stanford.edu/~jkrause/cars/car_dataset.html)
* [CUB-200](https://paperswithcode.com/dataset/cub-200-2011)
* [Deep Metric Learning via Lifted Structured Feature Embedding](https://cvgl.stanford.edu/projects/lifted_struct/)
* [DeepFashion: In-shop Clothes Retrieval](https://mmlab.ie.cuhk.edu.hk/projects/DeepFashion/InShopRetrieval.html)
