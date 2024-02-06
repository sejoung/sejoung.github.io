---
layout: post
title: "신경망(Neural Networks)"
date: 2024-02-05 16:30 +0900
comments: true
tags: [ "Neural Networks","신경망"]
categories: [ "Machine Learning" ]
sitemap:
changefreq: daily
priority: 1.0
---

# 신경망(Neural Networks)

## 행렬곱

* one-hot encoding 통해서 행렬을 만들고 가중치 행렬과 행렬곱을 수행하여 예측값을 만들어낸다.

## 경사 하강법(Gradient Descent)

* 경사 하강법은 함수의 기울기를 구하고, 기울기가 낮은 쪽으로 이동시키면서 최소값을 찾는 방법이다. (최소 cost/loss를 찾는 방법)

## Optimizer의 종류

* SGD(Stochastic Gradient Descent)
* mini-batch SGD
* Momentum
* RMSprop
* Adam

## 역전파(Backpropagation)
* 연쇄 법칙(Chain Rule)을 신경망의 그래디언트 계산에 적용한 것

## 소프트 맥스(Softmax)
* 소프트맥스 함수는 입력받은 값을 출력으로 0~1사이의 값으로 모두 정규화하며 출력 값들의 총합은 항상 1이 되는 특성을 가진 함수이다.
* 예측값을 확률값으로 변환
* 출력노드가 2개 이상일때

## 크로스엔트로피(Cross-Entropy)
* 모델에서 예측한 확률값이 실제값과 비교했을 때 틀릴 수 있는 정보량
* cost function으로 사용

# 참조
-----

* [Lecture 4 | Introduction to Neural Networks](https://www.youtube.com/watch?v=d14TUNcbn1k)
* [CS231n Convolutional Neural Networks for Visual Recognition kor](https://aikorea.org/cs231n/optimization-2/)
* [CS231n Convolutional Neural Networks for Visual Recognition en](https://cs231n.github.io/optimization-2/)
