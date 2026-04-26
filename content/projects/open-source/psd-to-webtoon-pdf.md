---
title: "psd-to-webtoon-pdf"
type: "open-source"
summary: "PSD 기반 웹툰 원고를 공유 가능한 PDF로 변환하기 위한 오픈소스 도구입니다."
problem: "웹툰 제작과 검수 과정에서는 PSD 원고를 빠르게 확인하고 공유 가능한 형태로 변환해야 하는 반복 작업이 생깁니다."
solution: "PSD 입력을 웹툰 원고 흐름에 맞게 처리하고 PDF 출력물로 변환하는 도구로 정리했습니다."
impact: "개인 작업과 제작 파이프라인에서 반복 변환 비용을 줄이고, 결과물을 더 쉽게 전달할 수 있게 합니다."
stack: ["PSD", "PDF", "Webtoon", "Open Source", "Automation"]
repository: "https://github.com/sejoung/psd-to-webtoon-pdf"
links:
  - label: "Open Tool"
    href: "https://sejoung.github.io/psd-to-webtoon-pdf/"
    external: true
featured: true
order: 10
---

웹툰 제작에서는 결과물을 확인하고 공유하기 위해 이미지나 원고 파일을 다른 형식으로 바꾸는 일이 자주 발생합니다. `psd-to-webtoon-pdf`는 PSD 기반 원고를 PDF로 변환하는 반복 작업을 도구화한 오픈소스 프로젝트입니다.

## What It Does

PSD 원고를 입력으로 받아 검수와 공유에 적합한 PDF 출력물로 변환합니다. 제작 과정에서 생기는 중간 결과물을 빠르게 확인하거나 전달해야 할 때 사용하는 도구를 목표로 합니다.

## Why I Built It

웹툰 원고는 일반 문서나 이미지 묶음과 다르게 세로 흐름과 제작 맥락이 중요합니다. 매번 수동으로 변환하고 확인하는 작업은 작지만 반복 비용이 크기 때문에, 이를 명확한 도구로 분리했습니다.

## Design Notes

이 프로젝트는 거대한 제작 플랫폼이 아니라 특정 반복 작업을 작게 줄이는 도구입니다. 입력 파일 처리, 출력 형식, 실패 케이스를 분리해서 다루고, 이후 제작 파이프라인의 한 단계로 연결할 수 있는 형태를 지향합니다.
