---
layout: post
title: "FAB 에 언리얼 플러그인 배포하기"
date: 2026-01-10 15:07 +0900
comments: true
tags: [ "unreal", "언리얼 플러그인", "plugin" ]
categories: [ "unreal" ]
sitemap:
    changefreq: daily
    priority: 1.0
---

# FAB 에 언리얼 플러그인 배포하기 

## 플러그인 구조

꼭 준수 해야 되는 플러그인 구조

```
MyPlugin
|----- Content
|----- Resources
|----- Config
  ├── FilterPlugin.ini
|----- Source
| ├── MyModule
| | ├── Private
| | ├── Public
| | └── MyModule.build.cs
| └── ThirdParty
|----- MyPlugin.uplugin

```

위에 구조를 준수해야 되며 파이썬 플러그인도 가능은하지만 C 모듈이 없으면 승인처리가 되지 않는다.

## 기본 등록 방법

1. 퍼블리셔 계정 설정

Fab.com에 로그인하거나 계정을 생성한 후, 상단 툴바에서 Publish를 클릭 Epic Games
Get Started 버튼 클릭
Fab Distribution Agreement에 동의 Epic Games
Publisher Profile 설정 및 고유한 Creator Code 생성 Epic Games (이 코드가 프로필 URL에 사용됨)
결제 정보 설정 (수익 정산용)

2. 리스팅 생성 및 에셋 업로드

상단 내비게이션에서 Publish 탭 클릭 → Listings 선택 Epic Games
새 리스팅 생성
제품 상세 정보 입력 (설명, 스크린샷, 가격 등)
플러그인 파일 업로드

3. 코드 플러그인 특별 요구사항
   코드 플러그인은 엔진 버전별로 업데이트된 프로젝트를 제출해야 합니다. 엔진 버전마다 새로운 .uplugin 프로젝트를 리스팅에 업로드해야 합니다.

4. 제출 및 리뷰

페이지 우측 상단의 Publish 클릭 Epic Games
Fab 콘텐츠 및 정책 가이드라인을 검토하고 필요시 수정 후 리뷰 제출 Epic Games
Fab 팀의 승인을 기다림

5. 수익 배분
   판매 수익의 88%를 받게 되며, 매월 말 기준 30일 후에 $100 USD 이상일 때 지급됩니다


위에 방법대로 등록을 하면 요구사항중에 지정하지 않았던 정보요구를 PDF 형태로 잘 정리 해서 전달해준다
응답은 몇시간 안에 오는 편으로 빠르게 대응해준다.


# 참조
-----

* [Arranging Folders From Static Mesh](https://www.fab.com/listings/a80c3d61-3613-47f8-99a2-f6ebbf174fe4)
