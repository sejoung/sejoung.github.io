---
title: "Panely"
type: "open-source"
summary: "macOS용 미니멀 만화/이미지 뷰어로, 페이지 읽기와 웹툰 세로 스크롤을 모두 지원합니다."
problem: "만화와 웹툰 이미지를 볼 때 뷰어 UI가 콘텐츠를 방해하거나, 큰 이미지와 압축 파일을 부드럽게 다루지 못하는 경우가 많습니다."
solution: "AppKit 기반 스크롤/줌 코어와 SwiftUI 쉘을 조합해 단일 페이지, 양면, 세로 웹툰 모드를 지원하는 macOS 뷰어로 구현했습니다."
impact: "폴더, CBZ, ZIP 기반 이미지 묶음을 빠르게 열고, 읽기 방향과 fit mode, 최근 항목과 진행 상태를 유지하는 집중형 뷰어 경험을 제공합니다."
stack: ["macOS", "Swift", "SwiftUI", "AppKit", "ZIPFoundation"]
repository: "https://github.com/sejoung/Panely"
featured: true
order: 12
---

Panely는 macOS에서 만화와 웹툰 이미지를 방해 없이 읽기 위한 이미지 뷰어입니다. UI는 필요할 때만 나타나고, 화면의 대부분은 콘텐츠에 할당됩니다.

## What It Does

폴더, CBZ, ZIP 파일을 열고 단일 페이지, 양면 보기, 세로 스크롤 모드를 제공합니다. 웹툰처럼 긴 세로 이미지 흐름에서는 lazy windowing으로 필요한 이미지만 로드하고, 페이지 진행 상태와 최근 항목을 저장합니다.

## Why I Built It

이미지 뷰어는 많지만 웹툰과 만화를 모두 편하게 읽기 위해서는 방향, 레이아웃, 압축 파일, 큰 이미지 처리, 키보드 중심 조작이 함께 맞아야 합니다. Panely는 읽는 동안 뷰어가 뒤로 물러나는 경험을 목표로 만들었습니다.

## Design Notes

SwiftUI만으로 모든 스크롤/줌 동작을 처리하지 않고, AppKit의 `NSScrollView`와 이미지 뷰를 핵심 렌더링 경로에 사용했습니다. 큰 세로 스트립은 placeholder와 visible range 기반 로딩으로 메모리 사용을 제어합니다.
