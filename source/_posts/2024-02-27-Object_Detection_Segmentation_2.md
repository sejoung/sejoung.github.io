---
layout: post
title: "Object Detection & Segmentation 2"
date: 2024-02-27 13:18 +0900
comments: true
tags: [ "Object Detection & Segmentation" ]
categories: [ "Machine Learning" ]
sitemap:
changefreq: daily
priority: 1.0
---

# Object Detection & Segmentation 2

## Additional Object Detection Techniques
* Feature Pyramid Netowrk (FPN)
  * 충분히 빠르다
  * 다양한 크기의 물체를 잘 찾아낸다
  * scale robustness 는 object detection에 중요하다.
  * Image pyramid 를 만드는 것보다 feature pyramid 를 만드는 것이 효과적이다
  * post-work: PANet (Path-aggregation network) – top-down-top을 활용한다
* Path Aggregation Network (PANet)
  * top-down path의 FPN에서 bottom-up path를 추가하여 object detectio 에서의 scale robustness를 키운다
  * bottom-up connection 이 이미지의 더 좋은 features 생성에 도움이 된다.
* EfficientDet: Effcient Model Search
  * EfficientNet 과 비슷한 모델 서치
  * BiFPN 구조를 채택하여, top-down, bottom-up 정보의 propagation을 한다
  * 더 낮은 리소스로 더 좋은 결과를 낸다.
* DeTR: Detection Transformer
  * Vision Transformer for Object Detection
  * CNN이 아닌 Transformer 구조를 사용해서 object detection 을 해보자
* Deformable DETR
  * Deformable Convolution에서 아이디어를 얻 어 transformer 구조에 적용
  * 마찬가지로 conv filter의 offset을 deformable DETER에서는 encoder 내의 attention 입력인 Key의 offset으로 대체하여 사용한다.


## Semantic Segmentation

* 같은 클래스내에 있으면 동일한 영역이라고 본다
* Fully Convolutional Network (FCN)
  * 이미지의 모든 픽셀에 대해 클래스를 예측
  * 1x1 convolution을 사용하여, fully connected layer를 대체
  * add skip connection
* DeepLab
  * atrous convolution을 사용하여, receptive field를 키움
  * fully connected conditional random field (CRF)를 사용하여, segmentation 결과를 더 정확하게 만듬
  * atrous spatial pyramid pooling (ASPP)를 사용하여, 다양한 크기의 receptive field를 사용
* Deconvolution Nework (DeconvNet)
  * cpmvolutional layer를 거꾸로 쌓아서, segmentation을 수행
  * pooling layer에서의 위치 정보를 복원하기 위해, unpooling layer를 사용
  * deconvolution layer를 사용하여, segmentation 결과를 얻음
* U-Net

* Instance-Aware Semantic Segmentation
  * objectness를 캡쳐 할수 없다
  * Multi-scale features를 사용하여, objectness를 캡쳐
  * Multi-task Network Cascades
    * cascade를 사용하여, segmentation과 classification을 동시에 수행
    * single network 사용
  * Mask R-CNN
    * instance segmentation을 수행
    * Faster R-CNN을 사용하여, object detection을 수행
    * RoIAlign을 사용하여, RoI pooling을 대체
* Improving Semantic Segmentation
  * Pyramid Scene Parsing Network
  * Context Encoding Network
    * se loss를 사용하여, context 정보를 사용
  * Dual Super-Resolution Learning
    * image super-resolution과 semantic segmentation을 동시에 수행
    * sub-pixel convnet을 사용하여, segmentation 결과를 얻음
  * Segmenter
    * A fully Transformer-based encoder-decoder architecture

# 참조
-----
