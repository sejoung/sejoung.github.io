---
layout: post
title: "Representation Learning (Self-Supervised Learning)"
date: 2024-02-23 14:12 +0900
comments: true
tags: [ "Representation Learning" ]
categories: [ "Machine Learning" ]
sitemap:
changefreq: daily
priority: 1.0
---

# Representation Learning (Self-Supervised Learning)

* 학습 기법의 label에 따른 분류
  * 딥러닝 모델 학습을 위해서는 많은 레이블이 필요하다.
  * 하지만, 비싼 레이블링 없이도 모델을 잘 학습시키는 것은 중요하다.

* Supervised learning의 단점
  * "레이블" 데이터가 많아야 함
  * 학습되지 않은 데이터가 튀어나오면 예측하기 어려움. (transfer가 잘 안됨)
* Reinforcement learning의 단점
  * 실패해도 다시 시도하면 되는 게임에선 가능
  * 현실 세계에서는 실패 자체가 치명적일 수 있어서 적용하기 힘듬
  * Policy gradients로 학습하는 과정은 불안정함
* Self-supervised learning의 필요성
  * 주변 상황과 조건을 고려해 예측해야 함 (context prediction)
  * 실패하기 전에 사고가 난다는 것을 예측해야 함
  * 레이블 없는 많은 데이터를 안정적으로 학습해야함
  * 모델이 semantics 를 파악하는 데, 굳이 classification 이라는 task를 줄 필요가 없음

## Pretext tasks 기반 self-supervised learning
* Exemplar
  * STL-10 데이터셋 사용
  * 96x96 이미지 내에서 considerable 한 gradient 영역 근처를 32x32 로 crop
  * 32x32 seed patch를 기준으로 data augmenta/on을 적용하여 추가 영상 생성
  * Seed image를 data augmentation 하여 이 데이터를 seed image로 prediction하도록 학습.
  * surrogate training classes / training samples가 많아질 수록 성능이 향상한다
  * Surrogate labels 을 data augmenta/on을 통해 얻어서 네트워크를 학습하면 transfer했을 때 성능이 좋다.
  * Discrimina/ve 한 features로서 image matching에 적용했을 때 SIFT보다 좋은 descriptors로서의 결과도 낸다. (marginal 하지만)
  * ImageNet과 같은 large-scale datasets에는 적용하기 어려움.
* Context Prediction
  * Context predicXon 이라는 pretext task를 통해 exemplar의 단점을 해결하려 함.
  * 3x3 개의 patches를 뜯어서 가운데를 기준으로 1~8 번 할당
  * 가운데를 기준으로 선택한 patch가 몇 번째 패치인지 예측하도록 모델이 학습됨.
  * 사람도 다소 예측하기 어려움. 하지만, 이를 machine에게 학습시키면, 이미지 전반의 representation을 배울 수 있다는 게 모티베이션.
  * 이미지 패치나 위치는 일정하지 않고 약간의 위치 변화를 주어 샘플링 된다.
  * 그럼에도, context prediction tasks로 pre-training 한 feature extractor를 사용하면 성능이 좋다.
* Jigsaw Puzzles
  * 직쏘 퍼즐을 풀게하는 pretext task
  * 앞선 context prediction과 3x3 패치를 추출하지만, 임의의 permutation으로 셔플함.
  * 하지만, 직쏘 퍼즐은 9!=362,880 개(36만개)의 클래스를 배워야해서 이는 어렵다.
  * Permutation 수에 따른 결과: permutation의 수가 많아질수록/ permutation간의 차이가 클수록(구분하기 쉬워질 수록) transfer 성능이 좋아진다.
  * 직쏘 퍼즐은 좋은 pretext task이다.
  * 이와 같은 context-free network (CFN)은 인간이 해내기 어려운 task를 학습함으 로써 더 좋은 deep learning 모델을 학습 하는 데에 성공하였다.
  * 또한 label없이 학습하는 self-supervised learning task를 정의하여 human annotation의 비용을 줄였다.
* Count
  * 한 patch에 대한 object의 특징을 가장의 vector로 표현함.
  * ex.각 패치안에 코2개,눈4개, 머리 1개 등등..
  * 각 패치의 특징 벡터의 합을 prediction하는 것은 원래 이미지의 특징 벡터의 합과 같다는 이론에서 intuition을 얻음.
  * AlexNet을 사용하여 패치별 특 징벡터를 출력하게 함.
  * 원본 이미지를 downsampling 했을때 얻는 특징 벡터와,각패치 별로 넣었을때 나오는 특징 벡터의 합이 같도록 학습함
  * 하지만,같은 이미지로만 학습하면,모든 feature vector를 0으로만 예측하는 trivial solution이 생김
  * Counting task는 representation learning 으로 좋은 task이다.
  * Feature vector를 잘 학습해서 오른쪽 사진과 같이 retrieval 에서도 효과적으로 embedding space를 만든다.
  * Visual primitives의 조합을 잘 만드는 것은 중요하다.
* Multi-Task
  * 2017년 당시에 주요 쓰였던 self-supervised learning 방법들을 동시에 multi-task learning으로 학습시키는 방법 제안
  * 하나의 네트워크로, relative patch location (Context prediction) + colorization + exemplar + motion segmentation 의 pretext tasks를 동시에 수행함.
  * 각 결과를 서로 다른 GPU머신을 학습해서 gradient를 축적한 다음에 한번에 네트워크 업데이트를 한다.
  * Self-supv pre-training이 fully-supervised pre-training을 넘을 수 있는 가능성 제시.
* Rotation Prediction (RotNet)
  * 이미지의 upright 4방향 rotation을 prediction 하는 pretext task
  * 회전 이미지가 원본에서 몇도 회전했는 지를 예측하게 함.
* Rotation Prediction (Decouple-RotNet)
  * Pretext task는 RotNet과 같음.
  * Rotation 은 ambiguous 할 수 있지 않나?
  * 그러면 그 example에 대해서는 학습이 매우 어렵고 무의미함.
  * Rotation-agnostic example을 제거하자.

## Contrastive Learning
* Non-Parametric Instance Discrimination
  * Non-parametric Softmax classifier
    * 고정된 w가 아닌 feature vector v로 대체하였다. (instance 특성학습 위해)
    * L2 norm을 통해 v를 unit sphere에 고정
    * 모든 instance가 class에 상관없이 unit sphere에 골고루 퍼져서 분포하도록 학습
  * Noise-contrastive estimation (NCE)
    * NCE form의 contrative loss 추가.
  * Proximal regularization
    * 각 instance를 개별 클래스로 두고 학습하면 학습이 불안정해서, proximal regularization 추가함.
  * Weighted k-NN classifier
    * Test time 때 들어오는 sample은 k-NN features를 찾아서 classifying 한다.
  * 결론
    * instance-level discrimination 을 통해 unsupervised feature learning을 하는 것은 피처 학습에 효과적이다.
    * 이때 non-parametric soamax formulation이 오히려 학습에 도움이 된다.
    * Image classification (ImageNet, Places) 결과
    * Semi-supervised learning, object detection으로의 일반화
* MoCo: Momentum Contrast
  * Contrastive learning을 unsupervised representa/on learning 에 좀 더 효과적으로 적용시켜 보자.
  * Pretext task: Positive / negative pairing을 augmentation 을 통해 더 많이 만들기.
  * Encoder가 key representation의 consistency를 해쳐서 학습이 불안정해지는 것을 막기위해 momentum contrast 도입.
  * 결론
    * Self-supervised contrastive learning 으로 model pre-training 하면 성능이 좋다.
    * Pretext task로 instance discrimination task 는 다른 task로 바뀔 수 있다. (e.g., masked auto-encoding 등)
    * Backbone network도 CNN에서 바뀔 수 있다.
* SimCLR 
  * MoCo와 비슷한 시기에 나온 Contrastive learning 기법.
  * 성능이 좀 더 향상되었다.
  * Simple framework로도 contrastive visual representation learning 의 좋은 결과를 낸다.
* MoCo Version 2
  * SimCLR의 design improvements를 MoCo에도 적용하여 성능을 향상시키겠다.
* SimCLR Version 2
  * Semi-supervised learning 쪽 알고리즘의 장점까지 도입하여 3단계로 학습해 보자.
    * Unsupervised/Self-supervised pretraining : task-agnostic CNN model 학습
    * Supervised Fine-tuning : pretraining 이후에 fine-tuning을 한다
    * Dis5lla5on using unlabeled data : teacher model에서 얻은 pseudo-label로 student model tuning.
* MaskFeat
  * 모티베이션: Pretext task로 masked input으로 HOG를 prediction해보자.
  * 결과
    * Masked feature predictio은 visual pre-training task로서 좋은 결과를 준다.
    * 특히 비디오와 같은 프레임간의 방향성을 가진 task에서 transfer가 잘 된다.
* BYOL
  * Contrastive learning방법들은 negative를 잘 선택 해야한다.
  * 결과: batch size나 image augmentaXon에 대해 simclr보다 덜 민감함
* Barlow Twins
  * BYOL과 비슷하게 Siamese network 활용
  * 하지만, 최종 predicthon에서 mini-batch features 의 cross-correlation matrix를 계산하고, diagonal 을 maximize함
* DINO: Vision Transformer + SSL
  * DINO:self-distillation with no labels.
  * 모티베이션:Self-supvViT로 학습한 모델은 이미 object의 segmentation을 어느정도 잡고 있다.

## Semi-Supervised Learning 이란
* 준지도학습
* Label이 일부 샘플에만 주어진것. (Supervised + Unsupervised)
* Labeling은 비용이 많이 든다.
* Smoothness:x1,x2의 거리가 가까우면, y1,y2도 가까워야 한다
* Low-density:decisionboundary가 data의density가 높은 곳을 지나지 않는다. (잘 분리 된다.)
* Manifold:고차원의 입력이 저 차원에서 특정 manifold를 따라 놓이게 된다.
* Clustering:데이터가 같은 클러스터에 속하면, 같은 클래스이다. (유사도에 따라 분류된다.)

* Entropy Minimization
  * 가정: Decision boundary는 데이터의 밀도가 낮은곳에 형성 될 것이다.
  * Prediction을 좀 더 sharp하게 만들어서 entropy를 minimize함.
  * pseudo-label사용.(one-hot vector로 argmax하기 때문에)
* Proxy-Label Methods
  * Unlabeled data point에 label을 달아주는기법.
  * Labeled data에 벗어나는 샘플은 제대로된 pseudo-label을 주기 어렵다.
  * 그래도,labeled data에서의 interpolation 효과를 줌
  * Pseudo-label의 confidence가높은샘플만을 사용했을 때 성능이 더 높았다는 보고가 있음.
* Proxy-Label Methods: Label Propagation by Graph
  * Graph-based semi-supervised learning의 목표: unlabeled data로 예측 성능을 높이는 게 목표가 아닌, unlabeled data의 label 을 추정하는 그 자체가 목표.
* Consistency Regularization
  * Consistency regularization: unlabeleddata에 small perturbation을 주어도 예측에는 일관성이 있을 것이다.
  * 즉, unlabeled data에 data augmentation 을 주어 class가 바뀌지 않을 정도의 변화를 주고, 원래 데이터와 같아지도록 unsupervised loss를 준다.
* Consistency Regularization: Temporal Ensemble
  * Temporal Ensemble: 과거의 network evaluation을 ensemble prediction 처럼 합친다. (이유: pi model이 noisy 한 input에 의해 모델도 noisy해진다)
* Consistency Regularization: Mean Teacher
  * Meanteacher: output prediction뿐아니라,model weight에 대해서도 temporal ensembling을 하자.
* Consistency Regularization: Virtual Adversarial Training
  * Virtual Adversarial Training: unlabeled 입력 데이터에 augmentation을 줄때에 fixed augmentation이 아닌 adversarial 한 이미지 변형을 주자
* Consistency Regularization: UDA
  * 세가지 dataaugmentation 방식을 통해 unlabeled data를 augment함.
    * AutoAugmentation(이미지분류): rule-basedRL augmentation찾는 기법.
    * Backtranslation(텍스트분류): 두개의 기계 번역 모델로 원본 텍스트와 유사한 다양한 텍스트를 augmentation 하여 얻는 기법.
    * TD-IDF word replacement(텍스트분류): 설명력이 낮은(TD-IDF 벡터에서 값이 낮은) 단어를 대체하고, 키워드 단어는 보존하는 기법.
* MixMatch
  * MixMatch:여러 semi-supervised learning기법을 합쳐높은 성능을 냄
* ReMixMatch
  * ReMixMatch: MixMatch에서 strong augmentation의 장점을 살리기위해 augmentation anchoring 도입
* FixMatch
  * ReMixMatch+UDA
  * 결론:semi-supervised learning의 a few lines of code변경으로 높은 성능 향상을 달성했다.


# 참조
-----

* [Yann Lecun (On True AI) twitter ](https://twitter.com/mldcmu/status/1046869963347283973)
* [Yann LeCun Cake Analogy 2.0](https://medium.com/syncedreview/yann-lecun-cake-analogy-2-0-a361da560dae)
* [](https://iclr.cc/media/iclr-2021/Slides/3720.pdf)
