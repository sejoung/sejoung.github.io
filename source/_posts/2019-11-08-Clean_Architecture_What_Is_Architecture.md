---
layout: post
title: "클린아키텍쳐-아키텍처란?"
date: 2019-11-08 11:48 +0900
comments: true
tags : ["클린아키텍쳐","Clean Architecture","아키텍처란?"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 아키텍처란?

소프트웨어 아키텍트는 프로그래머이며, 앞으로도 계속 프로그래머로 남는다.

아키텍처의 주된 목적은 시스템 생명주기를 지원하는 것이다. 시스템의 수명과 관련된 비용은 최소화하고, 프로그래머의 생산성은 최대화하는 데 있다.

### 개발

팀 구조가 다르다면 아키텍처 관련 결정에서도 차이가 난다. 

일례로 팀이 개발자 다섯 명 저옫로 작다면 잘정의된 컴포넌트나 인터페이스가 없더라도 잘 협의 해서 시스템 개발을 할수 있다.
이러한 팀은 아키텍처 없이 시작하는데 팀규모가 작은 데다 상위 구조로 인한 장애 물이 없기 때문이다.

다른 한편으로는 7명씩 구성된 총 다섯 팀이 시스템을 개발하고 있다면 신뢰할수 있고 안정된 인터페이스를 갖춘, 잘설계된 컴포넌트 단위로
분리 하지 않으면 개발이 진척되지 않는다.


### 배포

소프트웨어 시스템이 사용될 수 있으려면 반드시 배포할 수 있어야 한다. 배포 비용이 높을수록 시스템의 유용성은 떨어진다.
시스템을 단 한 번에 쉽게 배포할 수 있도록 하는데 목표를 두어야 한다.

### 운영

운영에서 겪는 대다수의 어려움은 소프트웨어 아키텍처에는 극적인 영향을 주지 않고도 단순히 하드웨어를 더 투입해서 해결할수 있다.

시스템을 쉽게 운영하게 해주는 아키텍처가 바람직하지 않다는 말이아니다. 다만 비용 공식 관점에서 운영보다는 개발, 배포, 유지보수 쪽으로 더 기운다는 말이다.

시스템을 운영할 때 아키텍처가 맡는 또 다른 역활이 있다.
좋은 소프트웨어 아키텍처는 시스템을 운영하는데 필요한 요구도 알려준다.

### 유지보수

유지보수는 모든 측면에서 봤을 때 소프트웨어 시스템에서 비용이 가장 많이 든다.

유지보수의 가장 큰 비용은 탐사와 이로 인한 위험 부담에 있다.

탐사란 기존 소프트웨어에 새로운 기능을 추가 하거나 수정할때 소프트웨어를 파헤쳐서 어디를 고치는 게 최선인지 어떤 전략을 쓰는것이 최적일지를 결정할 때 드는 비용이다.

### 선택사항 열어 두기

소프트웨어는 두 종류의 가치, 즉 행위적 가치와 구조적 가치를 지닌다.

이중 구조적 가치가 더중요한데 소프트웨어를 부드럽게 만드는 것이 바로 이 구조적 가치이기 때문이다.

열어 둬야 할 사항은 세부사항이다. 

소프트웨어는 주요한 두가지 구성요소로 분해 할 수있다. 정책과 세부사항

정책 요소는 모든 업무 규칙과 업무 절차를 구체화 한다. 정책이란 시스템의 진정한 가치가 살아 있는 곳이다.

세부사항은 데이터베이스, 웹시스템, 서버, 프레임워크 등이 있다.

세부사항에 대한 결정을 더 오래 참을수 있다면, 더많은 정보를 얻을 수 있고 이를 기초로 제대로된 결정을 내릴수 있다.

`좋은 아키텍트는 결정되지 않은 사항의 수를 최대화한다.` 


### 장치 독립성

입출력 장치를 소프트웨어 함수로 추상화 했고 해당 함수는 천공카드 같은 단위 레코드를 처리한다.

개방폐쇄원칙의 탄생


# 참조
-----


