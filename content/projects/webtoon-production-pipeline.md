---
title: "Webtoon Production Pipeline"
summary: "웹툰 제작 과정을 반복 가능한 파이프라인과 자동화 도구로 구조화합니다."
problem: "제작 단계가 파일, 툴, 수작업에 흩어져 반복 작업과 상태 추적이 병목이 됩니다."
solution: "작업 단계를 시스템으로 모델링하고 Unreal, Python, AI 도구를 연결합니다."
impact: "제작 흐름을 재현 가능하게 만들고 자동화 가능한 경계를 명확히 합니다."
stack: ["Unreal", "Python", "AI", "Pipeline"]
relatedPosts: ["unreal_python_script", "fab_publishing_plugin", "train_lora", "train_lora_flux"]
featured: true
order: 1
---

웹툰 제작은 창작 작업이지만, 반복되는 단계와 상태 전이가 많습니다. 이 프로젝트는 제작 흐름을 도구 중심이 아니라 시스템 중심으로 다시 정의하는 시도입니다.

목표는 개별 스크립트를 많이 만드는 것이 아니라, 제작 과정의 입력과 출력, 실패 지점, 자동화 가능한 경계를 명확하게 만드는 것입니다.
