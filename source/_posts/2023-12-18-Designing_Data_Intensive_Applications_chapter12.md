---
layout: post
title: "12장: 데이터 시스템의 미래"
date: 2023-12-18 15:54 +0900
comments: true
tags : ["데이터 중심 애플리케이션 설계","Designing Data Intensive Applications"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 파생 데이터
## 12장: 데이터 시스템의 미래
### 데이터 통합

문제가 주어졌을때 모든 문제를 만족하는 하나의 해결책은 없지만 상황에 따라 적절한 서로 다른 접근법이 많이 있다

* 파생 데이터에 특화된 도구의 결합
  * 포스트그레스큐엘 같은 디비는 간단한 애플리케이션 만들기에 충분한 전문 색인 기능이 포함되어 있지만 더 복잡한 검색 기능을 지원하기 위해서는 전문적인 정보 탐색 도구가 필요하다
  * 데이터 통합은 나무가 아닌 숲을 보기 위해 줌아웃해서 조직 전체 데이터플로를 고려할때 명확해진다
    * 데이터플로에 대한 추론
      * 같은 데이터의 사본을 여러 저장소 시스템에 유지해야 할때 입력가 출력을 분명히 할 필요가 있다
    * 파생 데이터 대 분산 트랜잭션
      * 서로 다른 데이터 시스템 간 일관성을 유지하는 고전적인 방법은 원자적 커밋가 2단계 커밋에서 설명한 분산트랜잭션이다
      * 추상적인 수준으로 보면 파생 데이터와 분산 트랜잭션은 다른 방식으로 유사한 목표를 달성한다
    * 전체 순서화의 제약
      * 충분히 작은 시스템에서 이벤트 로그의 순서 전체를 보장하는 것은 가능하다 하지만 규모가 커지고 더 복잡한 작업부하가 발생함에 따라 한계가 드러나기 시작한다
      * 이벤트의 전체 순서를 결정하는것 - 전체 순서 브로드캐스트
    * 인과성 획득을 위한 이벤트 순서화
      * 이벤트 인과성이 미묘한 방식으로 발생하기도 한다
* 일괄 처리와 스트림 처리
  * 데이터 통합의 목표는 데이터를 올바른 장소에 올바른 형태로 두는 것
  * 입력을 소비 형태로 바꾸고 필터링하고 집계해 모델을 학습하고 평가한 뒤 마지막에는 적절한 출력으로 기록
  * 일괄 처리자와 스트림은 이 목표를 달성하기 위한 도구
  * 파생 상태 유지
    * 일괄 처리는 함수형 프로그래밍 언어로 코드를 작성하지 않아도 상당히 강력한 함수형 특징을 가진다
    * 일괄 처리는 결정적이고 출력이 입력에만 의존하며 명시적 출력 외에는 다른 부수 효과가 없는 순수함수를 장려하며 입력을 불변으로 간주하고 출력은 추가 전용으로만 사용된다
  * 애플리케이션 발전을 위한 데이터 재처리
    * 파생데이터를 유지할 때 일괄 처리와 스트림 처리 모두 유용한다
    * 스트림 처리를 사용하면 입력의 변화를 빠르게 파생 뷰에 반영할수 있다
    * 일괄 처리 시스템을 이용하면 누적된 상당한 양의 과거 데이터를 재처리에 기존 데이터셋에 반영할수 있다
  * 람다 아키텍처
    * 입력 데이터를 불변 이벤트로서 증가하기만 하는 데이터셋에 추가하는 방식으로 기록해야 한다는것으로 이벤트 소싱과 유사하다
    * 일괄 처리는 간단해서 버그가 생길 가능성이 적은 반면 스트림 처리자는 신뢰성이 떨어지고 내결함성을 확보하기 어렵다는 것이다
  * 일괄 처리와 스트림 처리의 통합
    * 한 시스템에서 일괄 처리와 스트림 처리를 통합하는 작업이 진행 되고 있다

### 데이터베이스 언번들링

유닉스와 관계형 데이터베이스는 정보 관리 문제를 각기 매우 다른 유사점과 차이점은 탐구할 가치가 있다.

* 데이터 저장소 기술 구성하기
  * 테이터 베이스가 제공하는 다양한 기능
    * 색인 생성 하기
      * 트랜젝션이 테이블에 쓸 때 마다 꾸준히 색인에 반영
    * 모든 것의 메타데이터베이스
      * 전체 조직의 데이터플로가 거대한 데이터베이스
      * 연합 데이터베이스 : 읽기를 통합
      * 언번들링 데이터베이스 : 쓰기를 통합
    * 언번들링이 동작하게 만들기
      * 신뢰할 수 있고 확장 가능하며 유지보수하기 쉬운 시스템을 만든다는 측면 에서 연합과 언번들링은 동전의 양면과 같다
      * 쓰기 동기화는 읽기 동기화 보다 어렵다
      * 로그기반통합은 느슨한 결합이다
    * 언번들링 대 통합 시스템
      * 언번들링은 단일 소프트웨어로 가능한것 보다 더 넓은 범위의 문제를 해결하기 위한 방법이다
    * 뭐가 빠졌지?
      * 미분 데이터플로(differential dataflow)
    
* 데이터플로 주변 애플리케이션 설계
  * 파생 함수로서의 애플리케이션 코드
      * 트리거, 스토어드 프로시저, 사용자정의함수
  * 애플리케이션 코드와 상태의 분리
      * 웹 어플리케이션이 상태 비저장 서비스로 배포된다 하지만 상태는 데이터베이스에 저장한다
      * 관찰자 패턴(observer pattern) : 상태를 관찰하는 코드와 상태를 변경하는 코드를 분리하는 방법
  * 데이터플로: 상태 변경과 애플리케이션 코드 간 상호작용
  * 스트림 처리자와 서비스
      * 스트림 연산자로 데이터플로 스스템을 구성하는 것은 마이크로서비스 접근법가 유사한 특징이 상당히 많다
* 파생 상태 관찰하기
  * 쓰기 경로(Write path) : 데이터베이스에 데이터를 쓰는 경로
  * 읽기 경로(Read path) : 데이터베이스에서 데이터를 읽는 경로
  * 구체화 뷰 와 캐싱
    * 공통 질의 캐시
  * 오프라인 대응 가능한 상태 저장 클라이언트
    * 오프라인 우선(offine-first) 애플리케이션
  * 상태 변경을 클라이언트에게 푸시 하기
    * 각 장치는 작은 이벤트 스트림을 구독하는 작은 구독자
  * 종단간 이벤트 스트림
    * 데이터 시스템을 설계한다면 현재 상태를 단지 질의하는 방식이 아니라 변경 사항을 구독하는 방식을 염두에 뒤야 한다
  * 읽기도 이벤트다
    * 지속성 있는 저장소에 읽기 이벤트를 기록하면 인과적 의존성을 추적하기가 더 용이하다
  * 다중 파티션 데이터 처리
    * 질의를 스트림으로 간주하면 기성 솔루션의 한계를 넘어서는 대규모 애플리케이션을 구현하는 방안
### 정확성을 목표로

모두가 신뢰성있고 정확한 애플리케이션을 구축하기를 원한다

전통적인 트랜잭션 접근법이 사라지고 있지는 않지만 나는 이것이 최후에 방법이라 생각하지 않는다

* 데이터베이스에 관한 종단 간 논증
  * 불변성이 유용하긴 해도 그 자체가 만능은 아니다
  * 연산자의 정확히 한 번 실행
    * 정확히 한번(또는 결과적으로 한 번)
    * 연산을 멱등으로 만드는 법
  * 중복 억제
  * 연산 식별자
  * 종단 간 논증
    * 종단 간 논증(end-to-end argument) : 시스템의 모든 부분이 신뢰성을 보장하는 것은 아니며 신뢰성을 보장하는 것은 시스템의 최종 목표이다
  * 종단 간 사고를 데이터 시스템에 적용하기
    * 트랜잭션은 오랜 기간 매우 휼륭한 추상화로 간주됐고 아직도 유용하다고 나는 믿는다
* 제약 조건 강제하기
  * 유일성 제약조건은 합의가 필요하다
  * 로그 기반 메시징의 유일성
    * 전체 순서 브로드캐스트(total order broadcast) : 모든 메시지가 동일한 순서로 전달되는 것을 보장
  * 다중 파티션 요청 처리 
* 적시성과 무결성
  * 일관성
    * 적시성 : 시스템의 상태가 얼마나 최신인지를 나타내는 척도
    * 무결성 : 시스템의 상태가 얼마나 정확한지를 나타내는 척도
  * 데이터플로 시스템의 정확성
    * ACID 트랜잭션은 대개 적시성 과 무결성을 보장한다
    * 정확히 한번이나 결과적으로 한 번 시맨틱은 무결성을 보존하는 매커니즘이다
  * 느슨하게 해석되는 제약 조건
  * 코디네이션 회피 데이터 시스템
* 믿어라. 하지만 확인하라.
  * 소프트웨어 버그가 발생해도 무결성 유지하기
  * 약속을 맹목적으로 믿지 마라
  * 검증하는 문화
  * 감사 기능 설계
  * 다시 종단 간 논증
  * 감사 데이터 시스템용 도구

### 옳은 일 하기

ACM 소프트웨어 공학 윤리 강령

* 예측 분석
  * 편견과 차별
  * 책임과 의무
  * 피드백 루프
* 사생활과 추적
  * 감시
    * 감시 중심 애플리케이션 설계
  * 동의와 선택의 자유
  * 사생활 데이터 사용
  * 자산 권력으로서의 데이터
  * 산업 혁명의 기억
  * 법률과 자기 규제

### 정리

엔지니어는 우리가 원하는 세상 즉 사람이 사람답게 존중 받는 세상을 위해 일할 책임이 있음을 기억해야 한다

# 참조
-----

* [데이터 중심 애플리케이션 설계](https://wikibook.co.kr/data-intensive-applications-ebook/)
