---
layout: post
title: "선형 회귀(Linear Regression)"
date: 2024-02-05 16:30 +0900
comments: true
tags: [ "linear regression","선형 회귀"]
categories: [ "Machine Learning" ]
sitemap:
changefreq: daily
priority: 1.0
---

# 선형 회귀(Linear Regression)

Linear -> 선을 그려

Regression -> 값을 예측

회귀(Regression)는 통계학과 머신러닝에서 사용되는 용어로, 어떤 변수의 값을 다른 변수의 값으로 예측하거나 설명하는 모델

* 데이터를 일반화하는 선을 찾는다
* 그 선을 이용해 새로운 데이터를 예측한다

y = ax+b

가증합으로 새로운 특성을 만들어낸다

## Bias and Variance (편향과 분산)

예측값들과 정답이 대처로 멀리 떨어져 있으면 결과의 편향(bias)이 높다고 말하고
예측값들이 자기들끼리 대체로 멀리 흩어져 있으면 결과의 분산(variance)이 높다고 말한다.


## 독립변수와 종속변수

표에서 변수는 열

* 독립변수
  * 원인이 되는 것
  * 결과랑 상관없는 것
* 종속변수
  * 결과가 되는 것
  * 원인에 종속되어 있는것

### 상관관계

한쪽의 값이 바뀌었을 때, 다른 쪽의 값도 바뀐다면,
두 개의 특성은 ‘서로 관련이 있다’고 추측할 수 있습니다.
그리고, 이런 관계를 ‘상관관계’라고 합니다.

### 인과관계
각 열이 원인과 결과의 관계일 때
인과관계가 있다고 합니다.


## 지도 학습

* 분류 (Classification)
* 회귀 (Regression)

### 분류(Classification)
결과가 숫자가 아니라 손톱, 정상과 같은 이름이면 분류(Classification)를 사용한다

### 회귀(Regression)
예측하고 싶은 종속변수가 숫자일 때 회귀(Regression)를 사용한다


## 비지도 학습

* 군집 (Clustering)
  * 비슷한 것들끼리 모아서 적당한 그룹을 만들 것입니다 이렇게 그룹을 만드는 것이 군집
  * 좌표 평면을 사용하면 군집을 쉽게 볼 수 있습니다

* 연관 규칙 학습(Association Rule Learning)
  * 어떤 물건을 살 때 다른 물건도 같이 살 확률이 높다면, 그 물건들은 연관이 있다고 볼 수 있습니다
  * 이런 연관을 찾는 것이 연관 규칙 학습

# 참조
-----

* [머신러닝에서의 Bias와 Variance](https://gaussian37.github.io/machine-learning-concept-bias_and_variance/)
