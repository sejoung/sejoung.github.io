---
title: "AI Model Operations"
summary: "이미지 생성 모델 학습, LoRA 실험, GPU 환경 운영을 기록 가능한 시스템으로 정리합니다."
problem: "AI 실험은 환경, 데이터셋, 설정, 결과가 쉽게 흩어져 재현성이 낮아집니다."
solution: "학습 환경과 설정을 문서화하고 반복 가능한 실행 단위로 분리합니다."
impact: "실험 결과를 비교하고 다음 작업으로 이어지는 운영 지식을 축적합니다."
stack: ["Stable Diffusion", "LoRA", "CUDA", "GPU"]
relatedPosts: ["Stable Diffusion_3_5_Large_Fine-tuning_Tutorial", "train_lora", "train_lora_flux", "ubuntu_cuda_install", "cudnn_install"]
featured: true
order: 2
---

AI 모델 실험은 코드를 실행하는 것보다 환경과 설정을 통제하는 일이 더 중요해지는 경우가 많습니다. 이 프로젝트는 학습과 운영 과정에서 생기는 판단을 기록하고 재사용 가능한 형태로 정리합니다.

특히 이미지 생성 모델과 LoRA 실험을 중심으로, 환경 구성과 학습 설정, 결과 해석을 하나의 운영 흐름으로 다룹니다.
