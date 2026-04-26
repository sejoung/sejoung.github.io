---
layout: post
title: "Multiview geometry 1"
date: 2024-02-28 14:40 +0900
comments: true
tags: [ "Multiview geometry" ]
categories: [ "Machine Learning" ]
sitemap:
changefreq: daily
priority: 1.0
---

# Multiview geometry 1

## Local Features
* 이미지에 중요한 부분
* Image representation
* Object appearance modeling
* Finding matches between multiple views

## Model Fitting and RANSAC

* Finding vanishing points
* Image stitching
* 3D object recognition
* Fitting Technique: Least Square
* RANSAC
* Fitting Technique: Hough Transform

## Geometric Transformations
* Understanding camera models
* 2D transformations
  * Translations
  * Euclidean transformation
  * Similarity transformation
  * Affine transformation
  * Projective transformation
* 3D Geometric Primitives
  * points, lines, planes
  * 3D Transformations
  * 3D to 2D Projections
* Camera Models
  * Camera
    * 사람의 눈에 대응되는 컴퓨터의 눈
  * Geometric Camera Models
    * Pinhole Model
      * Aperture shrinks to zero
      * Inverted image is observed in image plane

## Camera Calibration
* Geometric camera calibra:on
* Camera Matrix Estimation
  * size and structure of the pattern are known
* Estimation of Intrinsic and Extrinsic Parameters

## Two-View Geometry
* 2장의 이미지에서 대응 되는 기하학적 관계
* Homography
  * collinearity is preserved
  * Isotropic scaling transform 
* Image Panorama Using Estimation

## Epipolar Geometry

* epipolar
  * 두개의 이미지에서 대응되는 점들의 직선
* converging image planes
* parallel image planes
* forward moving camera
* Two-View Relationship in Epipolar Geometry
  * essential matrix
  * Fundamental Matrix
    * 8-point algorithm

## Stereo Matching
* 두개의 센서로 부터 인지한 정보
* Parallel images
* Image Rectification
  * 같은 선상에 이미지를 정렬
  * Epipolar lines을 직선이 되도록 배치
* Basic Stereo Matching
  * epipolar line
  * depth vs disparity
  * 비워있으면 더 진하게 나옴
* Correspondence Search
* Correspondence Search by Correlation
* 반복적인 패턴
* small diparity error
* window size effect

## Wide-Baseline Matching
* Large baseline
* KeyNet
  * detection 에 집중함
  * Multi-Scale Index Proposal (M-SIP) Loss.
* Self-Supervised Equivariant Learning for Oriented Keypoint Detection
  * Rotation-Equivariant Feature
  * Window-based keypoint loss
  * Dense orientation alignment loss



# 참조
-----
