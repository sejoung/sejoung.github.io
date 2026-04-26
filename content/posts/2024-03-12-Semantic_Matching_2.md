---
layout: post
title: "Semantic Matching 2"
date: 2024-03-12 11:38 +0900
comments: true
tags: [ "Semantic Matching" ]
categories: [ "Machine Learning" ]
sitemap:
changefreq: daily
priority: 1.0
---

# Semantic Matching 2
## Semantic Flow

* UCN(Universal Correspondence Networks)
  * Fully convolutional NN -> STNs -> L2 Normalization 
* Proposal Flow
  * Comparisons 
  * 매칭 알고리즘
* Semantic Correspondence
  * dense correspondence
* Hyperpixel representation
  * Pixel : (𝑥, 𝑦, 𝑅, 𝐺, 𝐵)
  * Superpixel : 𝑛 ∗ (𝑥, 𝑦, 𝑅, 𝐺, 𝐵)
  * Hypercolumn :  (𝑥, 𝑦, 𝑑1, … , 𝑑n)
  * Hyperpixel : (𝑥, 𝑦, 𝑤, ℎ, 𝑑1, … , 𝑑n)
* Hyperpixel Flow
  * Regularized Hough Matching (RHM)
    * Classic computer vision 에서 사용하던 매칭 테크닉.
    * Re-parameterization technique : parametric space 를 변환 시켜 voting을 통해 가장 적절한 매칭을 찾는 방식
    * Hough transform
  * summary
    * Hyperpixel representation 제안 : geometry (region information; width, height …) 정보를 가진 hypercolumn 구조
    * 모든 layer를 다 사용하지 않고, 특정 layer 만 사용하여 composing 하는 hypercolumn, hyperpixel 구조가 더 성능이 좋다.
    * GPU computation을 통해 기존의 matching technique인 probabilistic Hough matching 방식의 성능과 속도를 압도적으로 높일 수 있다. (regularized Hough matching) (정량적 결과 result section에 기록)
* Dynamic feed-forward network
  * Forward time : argmax  
  * Backward time : softmax
  * Local 영역을 중요하게 봐야하는 computer vision task (object detection, segmentation, tracking, matching …)에서 Multi-layer neural feature를 사용하자.
  * 그런데 문제를 풀 때에 중요한 layer output을 잘 골라서 사용하자.
  * Beam search (Greedy algorithm)으로 찾을 수도 있지만 Data domain에 맞게 training하면 더 좋다
  * Trainable model을 만들 때에 layer 를 selection 해야하는데, argmax selection 은 differentiable 하지 않아 학습 불가능 하니, Gumbel-softmax trick을 사용해서 학습하자.
* SFNet



# 참조
-----
