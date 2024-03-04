---
layout: post
title: "Multiview geometry 2"
date: 2024-03-04 13:09 +0900
comments: true
tags: [ "Multiview geometry" ]
categories: [ "Machine Learning" ]
sitemap:
changefreq: daily
priority: 1.0
---

# Multiview geometry 2

## Wide-Baseline Matching

### Patch-based model

* L2-Net
* HardNet
* SOSNet
* HyNet

### Dense Imaging Model 
* GIFT
* GLU-Net

### Joint Detection and Description
* LIFT
* LF-Net
* SuperPoint
  * Self-supervised for local features
  * Loss funcVons
    * Detector loss + Descriptor loss
* D2-NET
  * Feature descriptors: 이전에 DELF 나 CNNGeometric 처럼 Dense CNN Feature를 local descriptors로 본다. 이 descripctor vector는 Euclidean distance를 계산할 준비가 된 상태이다. 실제로는 채널 방향의 L2 norm을 한다.
  * feature detectors: raw CNN feature의 각 채널의 Post-processing을 통해 구한다
* R2D2

### Local Regional Information Estimation
* OriNet
  * Learning to assign the local orientation values in the image matching pipeline
* AﬀNet
  * Learning local affine shape estimator
* Self-supervised learning of image scale and orientation estimation : SelfScaOri


### Matching Models
* Learning to find good correspondences
* SuperGlue
  * context aggregation + matching + filtering

### End-to-End Models
* LoFTR
  * Based on transformer blocks
* COTR
  *  Correspondence Transformer
* DKM


 

# 참조
-----
