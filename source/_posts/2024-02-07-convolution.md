---
layout: post
title: "합성곱(Convolution)"
date: 2024-02-07 13:30 +0900
comments: true
tags: [ "Convolution Neural Networks","합성곱(Convolution)","CNN" ]
categories: [ "Machine Learning" ]
sitemap:
changefreq: daily
priority: 1.0
---

# 합성곱(Convolution)

* grayscale 0~255 사이의 값을 가지는 이미지를 사용한다.
* RGB 이미지는 channel이 3개
* 필터 연산 : 이미지에 필터를 적용하는 연산 방법
* 필터 : 3x3, 5x5, 7x7 등의 크기를 가지는 행렬
* 연산 : weighted sum

이미지 정보를 나열하면 지역적 특성이 사라져서 정보를 잃어버릴 수 있다. 
Convolution을 사용하면 지역적 특성을 유지하면서 정보를 추출할 수 있다.

## Padding
그냥 합성곱 연산을 하면 이미지의 크기가 줄어들게 된다. 이를 방지하기 위해 패딩을 사용한다.(주로 0으로 채움 zero padding)

## Stride
합성곱 연산을 할 때 필터를 몇 칸씩 이동할지를 결정하는 값 최종 데이터가 줄어든다

## 필터
* feature map : 필터를 적용한 결과
* channel : 필터의 개수

## Max Pooling
* feature map에서 가장 큰수만 남기고 없애는 연산
* 파라미터수 감소 시키기 위해 사용

## Fully Connected Layer
* fully connected layer : 모든 뉴런이 연결되어 있는 층
* 노드 갯수가 class의 갯수 
 
## 기울기 소실(gradient vanishing)
* 학습이 진행될수록 gradient가 점점 작아져서 학습이 잘 되지 않는 문제
* ReLU를 사용하여 해결
* ReLU : 0보다 작은 값은 0으로, 0보다 큰 값은 그대로 출력하는 함수
* skip connection : 입력값을 출력값에 더해주는 방법

## YOLO(You Only Look Once)
* one stage object detection
* 이미지를 그리드로 나누고 각 그리드에 대해 bounding box와 class를 예측하는 방법

## YOLO + DeepSort
* YOLO로 객체를 인식하고 DeepSort로 객체를 추적하는 방법
* DeepSort : id switch, occlusion, missing detection 문제를 해결하기 위해 사용
* Deep: deep association metric learning
* SORT : Simple Online and Realtime Tracking
  * Kalman filter를 사용하여 객체를 추적하는 방법
  * hungarian algorithm을 사용하여 객체를 매칭하는 방법

## U-Net
* 이미지 분할을 위한 네트워크
* 왼쪽 부분은 이미지를 줄이는 부분(contracting path, downsampling path)
* 오른쪽 부분은 이미지를 복원하는 부분(expansive path, upsampling path)
* skip connection을 사용하여 이미지의 지역적 특성을 유지하면서 이미지를 복원한다.

## pre-processing
* resize : 이미지의 크기를 줄이거나 늘리는 작업(이미지의 크기를 통일시키기 위해 사용) resoultion이 다르면 학습이 잘 되지 않을 수 있다.
* color : 이미지의 색상을 변경하는 작업
* normalization : 이미지의 픽셀값을 0~1사이의 값으로 변경하는 작업, min-max scaling

## 클래스 불균형(class imbalance)

* 클래스 간의 데이터의 갯수가 차이가 나는 경우
* 다양성이 작을 경우

* over-sampling : 데이터의 갯수를 늘리는 방법(중복추출로 양을 늘림) 다양성이 충분하면 이것을 사용해도 된다
* data augmentation : 이미지를 회전, 반전, 확대, 축소 등의 변형을 주어서 데이터의 다양성을 늘리는 방법
  * epoch를 증가시킨다
  * random rain 같은 트랜스퍼를 진행했을때 다른데도 같이 진행해줘야 된다
* focal loss : 클래스 간의 데이터의 갯수가 차이가 나는 경우 사용하는 loss function
  * 데이터의 갯수가 적은 클래스에 가중치를 더 주는 방법
  * 데이터의 갯수가 많은 클래스에 가중치를 적게 주는 방법

## 과적합(overfitting)
* 학습 데이터에 대해서는 정확도가 높지만, 테스트 데이터에 대해서는 정확도가 낮은 경우
* 일반화 성능을 높히는것이 목적이다
* 검증 손실이 증가하기 시작하면 학습을 중단한다
* 일반화(regularization)항 추가
  * cost 계산시에 weight의 크기를 더해준다
* 앙상블(ensemble) : 여러 모델을 합쳐서 사용하는 방법
  * 소프트 보팅(soft voting) : 각 모델의 예측값을 평균내어 사용하는 방법
* dropout : 학습시에 랜덤하게 뉴런을 제거하는 방법
  * 학습시에만 사용하고 예측시에는 사용하지 않는다

## 이미지 증강(augmentation)
* transformation : 이미지를 회전, 반전, 확대, 축소 등의 변형을 주어서 데이터의 다양성을 늘리는 방법
  * flip : 이미지를 반전시키는 방법
  * rotation : 이미지를 회전시키는 방법
  * blur : 이미지를 흐리게 하는 방법
  * hueSaturation : 이미지의 채도를 변경하는 방법
  * gaussian noise : 이미지에 가우시안 노이즈를 추가하는 방법
  * CoarseDropout : 이미지의 일부분을 제거하는 방법
  * GrayScale : 이미지를 흑백으로 변경하는 방법
  * Mixup : 이미지를 섞는 방법
  * CutMix : 이미지를 잘라서 섞는 방법
  * Mosiac : 이미지를 섞는 방법
  * RandomErasing : 이미지의 일부분을 지우는 방법
  * RandomRain : 이미지에 빗방울을 추가하는 방법

# 참조
-----

* [Image Kernels](https://setosa.io/ev/image-kernels/)
* [VGG16 – Convolutional Network for Classification and Detection](https://neurohive.io/en/popular-networks/vgg16/)
* [Organize everything I know](https://oi.readthedocs.io/en/latest/)
* [DarkLabel](https://github.com/darkpgmr/DarkLabel)
