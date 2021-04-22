---
layout: post
title: "minikube 시작하기"
date: 2021-04-22 09:49 +0900
comments: true
tags : ["Kubernetes","k8s","minikube"]
categories : ["Kubernetes"]
sitemap :
changefreq : daily
priority : 1.0
---
# minikube 시작하기
## 주요목표
minikube의 기본 목표는 일상적인 개발 워크 플로 및 학습 목적을 위해 Kubernetes를 로컬에서 간단하게 실행하는 것입니다. 
다음은 minikube의 기본 원칙입니다. 우선 순위는 다음과 같습니다.

* 포용적이고 커뮤니티 중심
* 사용자 친화적
* 모든 Kubernetes 기능 지원
* 크로스 플랫폼
* 신뢰성
* 고성능
* 개발자 중심

다음은 목표에 부합하는 몇 가지 특정 미니 쿠베 기능입니다.

* 단일 명령 설정 및 해체 UX
* 로컬 스토리지, 네트워킹, 자동 확장,로드 밸런싱 등을 지원합니다.
* 운영 체제 전반에 걸친 통합 UX
* 타사 소프트웨어에 대한 최소한의 종속성
* 최소한의 리소스 오버 헤드

## 목표한것이 아닌것
* Kubernetes 프로덕션 배포 경험 단순화
* 다양한 유형의 스토리지, 네트워킹 등과 같은 Kubernetes의 가능한 모든 배포 구성을 지원합니다.

## minikube 시작
minikube는 Kubernetes 용으로 쉽게 배우고 개발할 수 있도록하는 데 초점을 맞춘 로컬 Kubernetes입니다.

필요한 것은 Docker (또는 유사하게 호환되는) 컨테이너 또는 가상 머신 환경 뿐이며 Kubernetes는 단일 명령으로 처리됩니다.

### 클러스터 시작

```shell
minikube start
```

### mac os 에서 실행

HyperKit 으로 가상머신을 지정할 예정임

HyperKit 은 경량 가상 머신 및 컨테이너 배포에 최적화 된 macOS 하이퍼 바이저 용 오픈 소스 하이퍼 바이저입니다.

```shell
minikube start --driver=hyperkit
```

하이퍼 킷을 기본 드라이버로 설정하려면 :

```shell
minikube config set driver hyperkit
```

## 클러스터와 상호작용

kubectl 명령을 통해서 나
```shell
kubectl get po -A
```
아니면 minikube를 통해서 kubectl의 적절한 버전을 다운받을수 있다.
```shell
minikube kubectl -- get po -A
```
Kubernetes dashboard 확인은 
```shell
minikube dashboard
```

`http://127.0.0.1:62335/api/v1/namespaces/kubernetes-dashboard/services/http:kubernetes-dashboard:/proxy/#/overview?namespace=default` 접속 가능하다.

## 배포
샘플 배포를 만들고 포트 8080에 노출합니다.

```shell
kubectl create deployment hello-minikube --image=k8s.gcr.io/echoserver:1.4
kubectl expose deployment hello-minikube --type=NodePort --port=8080
```

```shell
kubectl get services hello-minikube
```

```shell
minikube service hello-minikube
```

```shell
kubectl port-forward service/hello-minikube 7080:8080
```

### LoadBalancer 배포

```shell
kubectl create deployment balanced --image=k8s.gcr.io/echoserver:1.4  
kubectl expose deployment balanced --type=LoadBalancer --port=8080
```

```shell
minikube tunnel
```

```shell
kubectl get services balanced
```

## 클러스터 관리
배포 된 애플리케이션에 영향을주지 않고 Kubernetes 일시 중지 :
```shell
minikube pause
```
클러스터를 중지
```shell
minikube stop
```
기본 메모리 제한 늘리기 (다시 시작해야 함) :

```shell
minikube config set memory 16384
```
쉽게 설치할 수있는 Kubernetes 서비스 카탈로그를 찾기
```shell
minikube addons list
```
이전 Kubernetes 릴리스를 실행하는 두 번째 클러스터를 만들기
```shell
minikube start -p aged --kubernetes-version=v1.16.1
```
모든 minikube 클러스터를 삭제합니다.

```shell
minikube delete --all
```

# 참고자료
* [minikube github](https://github.com/kubernetes/minikube)
* [minikube docs](https://minikube.sigs.k8s.io/docs/)
