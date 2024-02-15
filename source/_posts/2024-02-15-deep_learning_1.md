---
layout: post
title: "Deep Learning-1"
date: 2024-02-15 11:11 +0900
comments: true
tags: [ "Deep Learning" ]
categories: [ "Machine Learning" ]
sitemap:
changefreq: daily
priority: 1.0
---

# Deep Learning 1
## Perceptron, MLP
* 인공신경망의 기초 단위
* activation function을 통해 입력값을 출력값으로 변환
  * binary threshold function
  * sigmoid function
  * rectified linear unit (ReLU)
* loss 값을 최소화하는 방향으로 가중치를 조정(학습)
  * 경사하강법(Gradient Descent)
    * 로스를 가중치로 미분하면 0이 되는 지점을 찾아야 하는데, 이때 미분값이 0이 되는 지점을 찾는 것이 어려움. 이를 해결하기 위해 경사하강법을 사용함
  * 역전파(Backpropagation)

* momentum
  * 경사하강법의 단점을 보완하기 위해 사용
  * 로컬 미니멈에 빠지는 것을 방지하기 위해 관성을 사용
  * 관성을 사용하면 로컬 미니멈에 빠지지 않고 전역 미니멈으로 수렴할 수 있음

## CNN
* Convolutional Neural Network
* 이미지 인식에 주로 사용

## Overfitting, Network Initialization
* Overfitting
  * 학습 데이터에만 잘 맞는 모델을 만드는 것
  * 학습 데이터에만 잘 맞는 모델은 실제 데이터에 대해 잘 맞지 않을 수 있음
  * 해결 방법
    * early stopping 
      * training loss와 validation loss를 비교하여 validation loss가 증가하기 시작하면 학습을 중단
    * 드롭아웃(Dropout)
* Network Weight Initialization
  * 가중치 초기화
  * 가중치 초기화를 잘못하면 학습이 잘 되지 않을 수 있음
  * Xavier initialization
  * He initialization
* Learning Rate
  * 학습률
  * 학습률을 잘못 설정하면 학습이 잘 되지 않을 수 있음
  * 학습률을 잘 설정하면 학습이 빠르게 되고, 학습률을 잘못 설정하면 학습이 느리게 되거나 학습이 잘 되지 않을 수 있음

## AlexNet, LeNet, VGG

AlexNet -> ZFNet -> VGGNet  -> GoogLeNet -> ResNet -> DenseNet -> SENet

### LeNet-5
* 1998년에 발표된 최초의 CNN
* Conv -> polling -> Conv -> polling -> FC -> FC 

### VGG
* 하드웨어에 옵티마이저 잘되어 있다

## ResNet
* ReLu activation
* Batch Normalization
  * Optimization Landscape를 좋게 만들어 줌
* skip connection
  * gradient vanishing 문제를 해결하기 위해 사용
  * 입력값을 출력값에 더해주는 방법


# 참조
-----

* [Explainable CNNs](https://github.com/ashutosh1919/explainable-cnn)
