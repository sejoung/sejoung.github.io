---
title: "AssetBox"
type: "open-source"
summary: "3D 파일을 드래그하면 미리보기, 메시 검증, 썸네일 생성, HTML 리포트까지 처리하는 데스크톱 도구입니다."
problem: "3D 에셋 하나를 확인하기 위해 Blender나 Maya를 열고, 텍스처 연결과 품질 검증, 썸네일 생성까지 수동으로 처리하는 비용이 큽니다."
solution: "Tauri, React, Three.js, Rust를 조합해 FBX/GLB/OBJ 미리보기와 자동 텍스처 매칭, 메시 검증, 리포트 생성을 하나의 도구로 묶었습니다."
impact: "3D 아티스트와 개발자가 에셋 상태를 빠르게 확인하고, 품질 문제를 공유 가능한 리포트로 남길 수 있게 합니다."
stack: ["Tauri", "React", "TypeScript", "Three.js", "Rust"]
repository: "https://github.com/sejoung/AssetBox"
links:
  - label: "Download"
    href: "https://sejoung.github.io/AssetBox/"
    external: true
featured: true
order: 13
---

AssetBox는 3D 에셋을 빠르게 확인하고 정리하기 위한 데스크톱 도구입니다. 파일을 드래그하면 모델 미리보기, 텍스처 매칭, 메시 검증, 썸네일 생성 흐름으로 이어집니다.

## What It Does

FBX, GLB, OBJ 파일을 로드하고 Solid, Wire, Normals, UV 모드로 확인할 수 있습니다. 메시 수, 삼각형 수, non-manifold edge, UV, 텍스처 누락, 파일 크기 같은 항목을 검증하고 HTML 리포트로 내보냅니다.

## Why I Built It

3D 제작 파이프라인에서는 작은 에셋 확인에도 무거운 DCC 도구를 열어야 하는 일이 많습니다. 반복되는 확인 작업을 가볍게 만들고, 품질 기준을 사람의 기억이 아니라 도구의 체크리스트로 옮기기 위해 만들었습니다.

## Design Notes

프론트엔드는 React와 Three.js로 뷰어와 검증 UI를 구성하고, Tauri/Rust는 파일 시스템 접근과 데스크톱 기능을 담당합니다. 검증 항목은 카테고리와 임계값을 분리해 이후 팀 기준에 맞게 확장할 수 있게 했습니다.
