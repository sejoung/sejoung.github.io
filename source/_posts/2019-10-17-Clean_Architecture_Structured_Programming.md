---
layout: post
title: "클린아키텍쳐-구조적 프로그래밍"
date: 2019-10-17 10:12 +0900
comments: true
tags : ["클린아키텍쳐","Clean Architecture","구조적 프로그래밍"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 클린아키텍쳐

### 구조적 프로그래밍

데이크스트라가 초기에 인식한 문제는 프로그래밍은 어렵고, 프로그래머는 프로그래밍을 잘하지 못한다는 사실이였다.

데이크스트라는 증명이라는 수학적인 원리를 적용하여 이문제를 해결하고자 했다. 그의 비전은 유클리드 계층구조를 만드는것이였다.

데이크스트라는 이연구를 진행하면서 goto문이 모듈을 더작은 단위로 재귀적으로 분해하는 과정에 방해가 되는 경우가 있다는것을 발견했다.

이러한 제어구조는 순차실행과 결합했을때 특별하다는것을 깨달았다 구조적 프로그래밍은 이렇게 탄생했다

1968년 CACM에 goto문의 해로움을 기고 했다. 프로그래밍 세계는 불이 붙었다. 이전쟁은 10년이상 지속되었다.

이를 토대로 구조적 분석이나 구조적 설계기법이 1970년대 후반에서 1980년대까지 큰 인기를 끌었다.

엄밀한 증명은 없었다 수학적으로 증명하지 못했지만 과학이라는것으로 증명했다.

과학적 증명은 서술된 내용이 사실임을 증명하는 방식이 아니라 서술이 틀렸음을 증명하는 방식으로 동작한다.

데이크스트라는 `테스트는 버그가 있음을 보여줄 뿐, 버그가 없음을 보여줄수는 없다.`


# 참조
-----

