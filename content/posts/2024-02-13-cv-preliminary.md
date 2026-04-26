---
layout: post
title: "컴퓨터 비전 이것만 알고 가자"
date: 2024-02-13 13:36 +0900
comments: true
tags: [ "Computer Vision","컴퓨터 비전" ]
categories: [ "Machine Learning" ]
sitemap:
changefreq: daily
priority: 1.0
---

# Computer Vision

## 선형대수학(Linear algebra)

Image description(Vector) + Decision Making(Function) = Image Understanding


## Vector
크기와 방향을 가진 기학적 오브젝트

* 연산(Operations)
  * 내적(inner product)
  * 외적(outer product)
* 백터의 길이(Norm)
  * 
* Linear Dependency
  * 선형 종속
    * 벡터가 다른 벡터의 선형 조합으로 표현될 수 있는 경우
  * 선형 독립
    * 벡터가 다른 벡터의 선형 조합으로 표현될 수 없는 경우(직교)
* 기저(Basis)
  * unit vectors(stardard basis)
  * orthonormal(직각) basis


## 행렬(Matrix)
숫자들의 직사각형 배열

* 연산(Oprations)
  * 덧셈
    * 교환법칙
    * 결합법칙
  * 뺄셈
  * 곱셈
    * 분배법칙
    * 교환법칙
* Rank
  *  행렬의 열들로 생성될 수 있는 벡터 공간의 차원
  * non-singular matrix
    * 행렬식이 0이 아닌 행렬
  * singular matrix
    * 행렬식이 0인 행렬
* 행렬식(Determinant)
* 역행렬(Inverse Matrix)
  * non-singular matrix만 존재

## 고유값 분해(Eigen Decomposition)

## 확률(probability)
* 불확실성이 높을때 확률 모델이 제일 좋다.

* sample space
  * 모든 가능한 결과들의 집합
* event space
  * sample space의 부분집합
* 확률 변수(random variable)
  * sample space에서 실수로 매핑되는 함수
* 조건부 확률(conditional probability)
* bayes' theorem
* gaussian distribution
  * 정규분포
  * 평균과 분산으로 정의
  * 중심극한정리
    * 독립적인 확률 변수들의 평균은 정규분포를 따른다.


## 파이썬 라이브러리
* 이미지 라이브러리
  * openCV
  * PIL(python image library)
  * scikit-image
    * numpy 기반
* matplotlib
  * 시각화 라이브러리
* pytorch
  * 딥러닝 라이브러리
  * tensor
    * array와 비슷하지만 GPU에서 동작
* torchvision
  * 이미지 데이터셋, 모델 아키텍처, 이미지 변환 등을 포함한 컴퓨터 비전 라이브러리
* albumentations
  * 이미지 변환 라이브러리
  * 데이터 증강
* wandb
  * 모델 훈련과 실험 추적을 위한 라이브러리
* kornia
  * 영상 처리 라이브러리
  * pytorch 기반

# 참조
-----
* [The Matrix Cookbook](https://www.math.uwaterloo.ca/~hwolkowi/matrixcookbook.pdf)
