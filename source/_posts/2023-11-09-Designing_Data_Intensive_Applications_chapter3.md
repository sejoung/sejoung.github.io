---
layout: post
title: "03장: 저장소와 검색"
date: 2023-11-09 10:12 +0900
comments: true
tags : ["데이터 중심 애플리케이션 설계","Designing Data Intensive Applications"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 데이터 시스템의 기초
## 03장: 저장소와 검색
데이터베이스의 두가지 작업 - 데이터를 저장하고 데이터를 조회하는 것

로그 구조 계열 저장소 엔진, 페이지 지향 계열 저장소 엔진

### 데이터베이스를 강력하게 만드는 데이터 구조

데이터베이스에서 특정 키의 값을 효율적으로 찾기 위해서 필요한 데이터 구조는 색인 이다

색인의 일반적인 개념은 부가적인 메타테이터를 유지하는 것이다.

색인은 기본데이터(primary data)에서 파생된 추가적인 구조다.

많은 데이터베이스에서는 색인의 추가 삭제만 허용

어떤 종류에 색인이라도 대개 쓰기 속도를 느리게 만든다 데이터를 쓸때 마다 색인도 갱신 해줘야 되기 때문이다. - 저장소 시스템의 중요한 트레이트 오프

* 해시 색인
    * 키값 저장소 - 해시맵(해시 테이블)
    * 키를 데이터 파일의 바이트 오프셋에 매칭 하여 저장
    * 문제
      * 파일형식
      * 레코드 삭제
      * 고장 복구
      * 부분적으로 레코드 쓰기
      * 동시성 제어

* SS테이블과 LSM 트리
  * 키로 정렬된 형식을 정렬된 문자열 테이블(sorted string table, SSTable)이라고 한다.
    * 장점
      * 새그먼트 병합은 파일이 사용가능한 메모리보다 크더라도 간단하고 효율적이다
      * 파일에서 특정 키를 찾기 위해 더는 메모리에 모든 키의 색인을 유지할 필요가 없다
      * 읽기 요청은 요청 범위 내에서 여러 키-값 쌍을 스캔해야 하기 때문에 해당 레코드들을 블록으로 그룹화하고 디스크에 쓰기 전에 압축한다
    * SS 테이블 생성과 유지
      * 쓰기가 들어오면 인메모리 균형 트리 데이터 구조(멤테이블)에 추가한다
      * 멤테이블이 일정 크기에 도달하면 디스크에 SSTable 파일로 기록한다
      * 읽기 요청이 들어오면 먼저 멤테이블에서 키를 찾고 디스크 상의 가장 최신 세그먼트를 찾는다
      * 가끔 세그먼트 파일을 합치고 덥어 쓰여지거나 삭제된 값을 버리는 병합과 컴팩션 과정을 수행한다 이과정은 백그라운드에서 수행
    * SS테이블에서 LSM 트리 만들기
      * 로그 구조화 병합 트리(Log-Structured Merge-Tree, LSM 트리) 패트릭 오닐등이 발표
    * 성능 최적화
      * 데이터베이스에 존재하지 않는 키를 찾는 경우 느려짐
        * 블룸 필터 - 키가 존재하는지 여부를 빠르게 확인
      * SSTable 압축하고 병합하는 순서와 시기를 결정
        * 크기 계층
        * 레벨 컴팩션

* B 트리
  * 가장 널리 알려진 색인 구조
  * 4kb 크기의 고정 크기 블록이나 페이지로 나누고 한 번에 하나의 페이지에 읽기 또는 쓰기를 한다
  * 한 페이지는 B 트리의 루트로 지정된다
  * 색인에서 키를 찾으려면 루트에서 시작한다
  * 신뢰할수 있는 B 트리 만들기
    * 기본적인 쓰기 동작은 새로운 데이터를 디스크 상의 페이지에 덮어 쓴다
    * 즉 페이지를 덮어쓰더라도 페이지를 가리키는 값은 변하지 않는다
    * 데이터를 복구 하기 위해 쓰기전 로그 (redo log)
  * 최적화
    * 일부 데이터베이스는 쓰기 복사 방식을 사용한다
    * 페이지에 전체 키를 저장하는 게 아니라 키를 축약해 쓰면 공간을 절약할 수 있다
    * 일반적으로 페이지는 디스크 상 어디에나 위치 할수 있다 트리가 커지면 순서를 유지하기 힘들다 - LSM 트리는 병합하는 과정에서 큰 세그먼트를 다시 한번 쓰기 때문에 순서를 유기하기 쉽다
    * 트리에 포인터를 추가한다
    * 프랙탈 트리

* B 트리와 LSM 트리 비교
  * LSM 트리는 쓰기 성능이 뛰어나다
  * B 트리는 읽기 성능이 뛰어나다
  * LSM 트리의 장점
    * 쓰기 증폭이 더 낮다
      * 데이터를 덮어 쓰는게 아니라 순차적으로 쓰기 때문이다
    * 압축률이 좋다
  * LSM 트리의 단점
    * 컴팩션 과정이 따로는 진행 중인 읽기와 쓰기의 성능에 영향을 준다
    * 높은 쓰기 처리량에서 발생

* 기타 색인 구조
    * 키-값 색인의 대표적인 예는 관계형 모델의 기본키 색인
    * 보조색인을 사용하는 방식도 매우 일반적
    * 클러스터 색인(clustered index) - 색인 안에 색인된 로우를 저장
    * 커버링 색인(covering index)
    * 포괄열이 있는 색인(index with included columns)
    * 다중 칼럼 색인
      * 결합 색인(concatenated index)
    * 전문 검색과 퍼지 색인
      * 유한 상태 오토마론(finite state automaton, FSA) 트라이(trie)
      * 레벨슈타인 오토마론(Levenshtein automaton)
    * 모든걸 메모리에 보관
      * 인메모리 데이터베이스

### 트랜잭션 처리나 분석?

커머셜 트랜잭션 - 초창기 비즈니스 데이터 처리
온라인 트랜잭션 처리 - OLTP(Online Transaction Processing)
온라인 분석 처리 - OLAP(Online Analytical Processing)

* 데이터 웨어하우징
  * ETL(Extract-Transform-Load) - 데이터를 추출하고 변환한 다음 데이터 웨어하우스에 적재

* 분석용 스키마: 별 모양 스키마와 눈꽃송이 모양 스키마
  * 별 모양 스키마 - 중앙의 큰 테이블을 기준으로 여러 개의 작은 차원 테이블이 연결된 형태
  * 눈 꽃송이 모양 스키마 - 여러 차원 테이블이 서로 연결된 형태

### 칼럼 지향 저장소

모든 값을 하나의 로우에 함께 저장하지 않는대신 각 칼럼별로 모든 값을 함께 저장한다

* 칼럼 압축
  * 압축에 용이하다
  * 비트맵 부호화
  * 메모리 대역폭과 벡터화 처리
    * 벡터화 처리 - 하나의 명령으로 여러 개의 데이터를 한꺼번에 처리하는 것

* 칼럼 저장소의 순서 정렬
  * 각 칼럼은 독립적으로 정렬할수 없다
  * 데이터는 한번에 전체 로우를 정렬해야 한다
  * 다양한 순서 정렬
    * C-store

* 칼럼 지향 저장소에 쓰기
  * B 트리와 같은 제자리 갱신이 불가능 하다
  * 집계 : 데이터 큐브와 구체화뷰
    * 데이터 큐브 - 다차원의 데이터를 집계한 것

* 집계: 데이터 큐브와 구체화 뷰

### 정리

* OLAP - 데이터 웨어하우스에 저장된 데이터를 집계하고 분석하는 일
* OLTP - 비즈니스 데이터 처리




# 참조
-----

* [데이터 중심 애플리케이션 설계](https://wikibook.co.kr/data-intensive-applications-ebook/)