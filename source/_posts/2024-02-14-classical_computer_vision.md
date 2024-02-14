---
layout: post
title: "고전적인 컴퓨터 비전"
date: 2024-02-14 10:51 +0900
comments: true
tags: [ "Computer Vision","컴퓨터 비전" ,"Classical Computer Vision","고전적인 컴퓨터 비전" ]
categories: [ "Machine Learning" ]
sitemap:
changefreq: daily
priority: 1.0
---

# Classical Computer Vision

## Local Image Features
* Image Feature
  * 이미지를 수치적 값의 관점에서 추출한 정보

좋은 로컬 피처란?(interest point)

* saliency
  * 눈에 띄는 정도가 높을수록 좋은 피처
* Locality
  * 이미지의 작은 부분에 대한 특징을 잘 나타내는 피처
* Repeatability
  * 변환이 되어도 같은 성질이 뽑혀야된다

## 합성곱 (Convolution)

* 교환법칙 성립
* 결합법칙 성립
* 분배법칙 성립

가우시안 필터(Gaussian Filter)
* 이미지를 부드럽게 만들어주는 필터

그라디던트 필터(Gradient Filter)
* 이미지의 경계를 찾아주는 필터

padding
* zero padding
* warp padding
* clamp padding
* mirror padding

## edge and corner
* edge
  * 이미지의 경계를 찾아주는 피처
  * smoothing -> gradient -> non-maximum suppression -> hysteresis thresholding
* corner
  * 이미지의 모서리를 찾아주는 피처
  * edge detection -> corner detection
  * edge 들이 만나는 부분
  * harris corner detection
    * 이미지의 픽셀들이 변화하는 정도를 계산하여 모서리를 찾아내는 방법

## blob
* 이미지의 리전인데 주변보다 밝거나 더 어두운 영역에 대해서 Blob이라고 한다
* laplacian of gaussian
  * 이미지를 블러처리한 후 라플라시안 필터를 적용하여 Blob을 찾아내는 방법
* difference of gaussian
  * 이미지를 다양한 크기로 블러처리한 후 차이를 계산하여 Blob을 찾아내는 방법

## Scale Invariant Feature Transform (SIFT)
* 이미지의 크기에 상관없이 특징을 추출하는 알고리즘
* keypoint detection -> keypoint description -> keypoint matching
* keypoint detection
* keypoint description

## model fitting
* fitting problem
  * image stitching
  * 3d object recognition
* Least Square Method
  * weighted least square
  * least square
* RANSAC(Random Sample Consensus)
* Hough Transform

## feature matching
* global feature matching
* nearest neighbor matching 

## visual recognition
* classification
* object detection
* segmentation
* scene recognition
* pedestrian detection
  * 보행자 검출

## image representation
  * bag of words
    * independent feature(codeword)
    * histogram representation
  * spatial pyramid matching
    * 이미지를 여러개의 영역으로 나누어서 히스토그램을 만들어서 이미지를 표현하는 방법

## classification
분류 문제를 해결하는 방법

* linear classifier
* non-linear classifier

* generative model
* discriminative model
* discriminative function model
* k-nearest neighbor

# 참조
-----

* [place2](http://places2.csail.mit.edu/index.html)
* [ImageNet Large Scale Visual Recognition Challenge (ILSVRC)](https://image-net.org/challenges/LSVRC/)
