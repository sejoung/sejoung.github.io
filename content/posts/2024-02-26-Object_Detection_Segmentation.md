---
layout: post
title: "Object Detection & Segmentation 1"
date: 2024-02-26 13:33 +0900
comments: true
tags: [ "Object Detection & Segmentation" ]
categories: [ "Machine Learning" ]
sitemap:
changefreq: daily
priority: 1.0
---

# Object Detection & Segmentation 1

* Object Detection : 이미지 내에서 특정 객체의 위치를 찾아내는 것
* Segmentation : 이미지 내에서 특정 객체의 픽셀을 찾아내는 것


Object Detection = Box localization + Box classification

## Region-based CNN* (RCNN)
* bounding box의 transformation를 학습

## Faster R-CNN with ResNet
* R-CNN의 속도를 개선

## Object Detection ‒ Basic Concepts
* Object Detection : 이미지 내에서 특정 객체의 위치를 찾아내는 것

## Object Detection ‒ Classical Object Detection
* Support Vector Machine (SVM) : 이미지 내에서 특정 객체의 위치를 찾아내는 것
  * Linear SVM : 선형 분류기
  * Non-Linear SVM : 비선형 분류기
  * Hyper-Parameters Tuning : cross-validation을 통해 최적의 파라미터를 찾는 것
  * Multi-Class SVM : 다중 클래스 분류기
    * one-versus-all
    * one-versus-one
* Histogram of Oriented Gradients (HOG)
  * 가우시안 스무딩을 하지 않는다
  * 이미지를 8x8 크기의 cell로 나눈다
  * HOG+SVM for Pedestrian Detection
* Selective Search for Object Detection
  * Capture all scales: 물체 크기 랜덤, 경계 불명확 할수 있음
  * Diversification: 색상, 재질, 크기 등의 조건을 고려해서 다중 전략을 취함
  * Fast to compute: 계산 시 너무 오래 걸리면 안됨
  * segment가 있으면 그 영역에 대해 candidate objects로 사용하여 좀 더 쉽게 object detection 을 할 수 있지 않을까?
  * Object recogntion이나 detection을 위한 후보 영역 을 알아 낼수 있는 알고리즘
  * Mean Average Best Overlap (MABO)
  * Recall
* EdgeBox for Object Detection
  * Gradient orientation 을 기반으로 edge group을 표현하고, 이를 이용해서 bounding box score를 계산함
  * Evaluation metric 제안: Intersection on Union (IoU)
* Region-based CNN* (RCNN)
  * 2 stage detection
* Fast R-CNN
  * ROI pooling
  * 9 anchor per location
* Mask R-CNN
  * instance segmentation
* One-Stage Detector
  * regional proposal 와 classification을 동시에 수행 
  * YOLO(You Only Look Once)
  * YOLO v2
    * better, faster, stronger
    * Batch normalization: 모든 conv layer에 BN추가
    * High-resolution classifier: ImageNet으로 pre-training하고, 448x448의 해상도로 10 epoch 동안 fine tuning
    * Convolutional with anchor boxes: V1에서 FC부분을 conv로 대체. Anchor box 적용
  * YOLO v3
    * 하나의 object에 하나의 anchor box할당
    * 3가지 다른 scale 사용한 feature pyramid 사용. 3개 scale에 대해 각각 3개 박스를 생성하여 9개의 anchor box가 있음.
  * YOLO v4
    * Practically, one-stage detector의 개선
    * 다양한 테크닉을 통해 성능, 속도 향상한다
    * 저자가 달라졌다


# 참조
-----

* [LIBSVM](http://www.csie.ntu.edu.tw/~cjlin/libsvm/)
