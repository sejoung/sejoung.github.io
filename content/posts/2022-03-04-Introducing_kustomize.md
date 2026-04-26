---
layout: post
title: "kustomize 소개"
date: 2022-03-04 14:52 +0900
comments: true
tags : ["kustomize","Kubernetes"]
categories : ["kubernetes"]
sitemap :
changefreq : daily
priority : 1.0
--->
# kustomize 소개. Kubernetes를 위한 템플릿이 필요 없는 구성 사용자 지정

Kubernetes 환경을 실행하는 경우 Kubernetes 구성을 사용자 정의했을 가능성이 있습니다. 일부 API 객체 YAML 파일을 복사하고 필요에 맞게 편집했습니다.

그러나 이 접근 방식에는 단점이 있습니다. 소스 자료로 돌아가서 개선된 사항을 통합하는 것이 어려울 수 있습니다. 
오늘 Google은 SIG -CLI 의 하위 프로젝트 로 제공되는 명령줄 도구인 kustomize 를 발표했습니다. 
이 도구는 친숙하고 신중하게 설계된 Kubernetes API를 준수하고 활용하는 구성 사용자 지정에 대한 새롭고 순수한 선언적 접근 방식을 제공합니다.

다음은 일반적인 시나리오입니다. 인터넷 어딘가에서 콘텐츠 관리 시스템에 대한 누군가의 Kubernetes 구성을 찾을 수 있습니다. 
Kubernetes API 개체의 YAML 사양을 포함하는 파일 집합입니다. 그런 다음 회사의 어느 구석에서 해당 CMS를 지원하는 데이터베이스에 대한 구성을 찾을 수 있습니다. 
데이터베이스를 잘 알고 있기 때문에 선호하는 것입니다.

어떻게든 이것들을 함께 사용하고 싶습니다. 
또한 리소스 인스턴스가 동일한 클러스터에서 동일한 작업을 수행하는 동료의 리소스와 구별되는 레이블이 있는 클러스터에 나타나도록 파일을 사용자 지정하려고 합니다. 
또한 CPU, 메모리 및 복제본 수에 대해 적절한 값을 설정하려고 합니다.

또한 전체 구성의 여러 변형 이 필요합니다. 
테스트 및 실험에 사용되는 작은 변형(사용된 컴퓨팅 리소스 측면에서)과 프로덕션 환경에서 외부 사용자에게 서비스를 제공하는 훨씬 더 큰 변형이 있습니다. 
마찬가지로, 다른 팀도 자체 변형을 원할 것입니다.

이것은 모든 종류의 질문을 제기합니다. 
구성을 여러 위치에 복사하고 개별적으로 편집합니까? 
스택의 약간 다른 변형이 필요한 수십 개의 개발 팀이 있다면 어떻게 될까요? 공통적으로 공유하는 구성 측면을 어떻게 유지 관리하고 업그레이드합니까? 
kustomize 를 사용하는 워크플로 는 이러한 질문에 대한 답변을 제공합니다.

## 사용자 정의는 재사용입니다

Kubernetes 구성은 코드가 아니지만(API 개체의 YAML 사양이므로 더 엄격하게 데이터로 간주됨) 구성 수명 주기는 코드 수명 주기와 많은 유사점이 있습니다.

버전 관리에서 구성을 유지해야 합니다. 구성 소유자가 구성 사용자와 반드시 동일한 사람은 아닙니다. 
구성은 더 큰 전체의 일부로 사용될 수 있습니다. 사용자는 다른 목적으로 구성 을 재사용 하기를 원할 것입니다.

코드 재사용과 마찬가지로 구성 재사용에 대한 한 가지 접근 방식은 단순히 모든 것을 복사하고 복사본을 사용자 지정하는 것입니다. 
코드와 마찬가지로 소스 자료에 대한 연결을 끊으면 소스 자료에 대한 지속적인 개선의 이점을 얻기 어렵습니다. 
각각 고유한 구성 변형이 있는 많은 팀 또는 환경에서 이 접근 방식을 취하면 간단한 업그레이드가 어렵습니다.

재사용에 대한 또 다른 접근 방식은 소스 자료를 매개변수화된 템플릿으로 표현하는 것입니다. 
도구는 템플릿을 처리하여 포함된 스크립팅을 실행하고 매개변수를 원하는 값으로 교체하여 구성을 생성합니다. 
재사용은 동일한 템플릿으로 다른 값 집합을 사용하는 데서 비롯됩니다. 
여기서 문제는 템플릿과 값 파일이 Kubernetes API 리소스의 사양이 아니라는 것입니다. 
그것들은 필연적으로 Kubernetes API를 래핑하는 새로운 것, 새로운 언어입니다. 
예, 강력할 수 있지만 학습 및 도구 비용이 수반됩니다. 
팀마다 다른 변경 사항이 필요하므로 YAML 파일에 포함할 수 있는 거의 모든 사양은 값이 필요한 매개변수가 됩니다. 
결과적으로 모든 매개변수(신뢰할 수 있는 기본값이 없는)가 교체를 위해 지정되어야 하므로 값 세트가 커집니다.

## configuration 사용자 정의를 위한 새로운 옵션

여기서 도구의 동작은 kustomization.yaml 이라는 파일에 표현된 선언적 사양에 의해 결정됩니다

kustomize 프로그램 은 파일과 참조하는 Kubernetes API 리소스 파일을 읽은 다음 전체 리소스를 표준 출력으로 내보냅니다. 
이 텍스트 출력은 다른 도구로 추가 처리하거나 클러스터에 적용하기 위해 kubectl로 직접 스트리밍할 수 있습니다.

예를 들어 다음을 kustomization.yaml 포함 하는 파일이

```yaml
 commonLabels:
     app: hello
   resources:
   - deployment.yaml
   - configMap.yaml
   - service.yaml
```
현재 작업 디렉토리에 있고 언급한 세 개의 리소스 파일과 함께 다음을 실행 중입니다.

```shell
kustomize build
```

주어진 세 가지 리소스를 포함하는 YAML 스트림을 내보내고 app: hello각 리소스에 공통 레이블을 추가합니다.

마찬가지로 commonAnnotations 필드를 사용하여 모든 리소스에 주석을 추가하고 namePrefix 필드를 사용하여 모든 리소스 이름에 공통 접두사를 추가할 수 있습니다. 
이 사소하지만 일반적인 사용자 정의는 시작에 불과합니다.

더 일반적인 사용 사례는 개발 , 스테이징 및 프로덕션 변형과 같은 공통 리소스 집합의 여러 변형이 필요하다는 것입니다.

이를 위해 kustomize 는 오버레이 및 기본 개념을 지원합니다. 둘 다 사용자 지정 파일로 표시됩니다. 
기본은 변형이 공통적으로 공유하는 항목(리소스 및 해당 리소스의 공통 사용자 지정)을 선언하고 오버레이는 차이점을 선언합니다.

다음 은 지정된 클러스터 앱의 스테이징 및 프로덕션 변형 을 관리하기 위한 파일 시스템 레이아웃 입니다.

```
 someapp/
   ├── base/
   │   ├── kustomization.yaml
   │   ├── deployment.yaml
   │   ├── configMap.yaml
   │   └── service.yaml
   └── overlays/
      ├── production/
      │   └── kustomization.yaml
      │   ├── replica_count.yaml
      └── staging/
          ├── kustomization.yaml
          └── cpu_count.yaml
```

파일 someapp/base/kustomization.yaml은 공통 자원과 해당 자원에 대한 공통 사용자 정의를 지정합니다(예: 모두 일부 레이블, 이름 접두사 및 주석을 가짐).
 
someapp/overlays/production/kustomization.yaml의 내용

```yaml
commonLabels:
    env: production
   bases:
   - ../../base
   patches:
   - replica_count.yaml
```
이 사용자 지정은 다음과 같은 패치 파일 replica_count.yaml을 지정합니다.

```yaml
apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: the-deployment
   spec:
     replicas: 100
```

패치는 프로덕션 트래픽을 처리하기 위해 복제본 someapp/base/deployment.yaml 수만 수정 하는 의 배포 패치인 부분 리소스 선언 입니다.

부분 배포 사양인 패치는 명확한 컨텍스트와 목적을 가지고 있으며 나머지 구성과 별도로 읽어도 유효성을 검사할 수 있습니다. 컨텍스트가 없는 {매개변수 이름, 값} 튜플이 아닙니다.

프로덕션 변형에 대한 리소스를 생성하려면 다음을 실행합니다.

```shell
kustomize build someapp/overlays/production
```
결과는 클러스터에 적용할 준비가 된 완전한 리소스 세트로 stdout에 인쇄됩니다. 유사한 명령이 스테이징 환경을 정의합니다.

## 요약
kustomize 를 사용 하면 Kubernetes API 리소스 파일만 사용하여 명확하게 사용자 지정된 Kubernetes 구성을 임의의 수로 관리할 수 있습니다. 
kustomize 가 사용 하는 모든 아티팩트 는 일반 YAML이며 유효성을 검사하고 처리할 수 있습니다. kustomize는 fork/modify/rebase 워크플로 를 권장합니다 .



# 참고

------

* [Introducing kustomize; Template-free Configuration Customization for Kubernetes](https://kubernetes.io/blog/2018/05/29/introducing-kustomize-template-free-configuration-customization-for-kubernetes/)
* [kubernetes sig-cli github](https://github.com/kubernetes/community/tree/master/sig-cli)
* [kustomize](https://github.com/kubernetes-sigs/kustomize)
* [kustomize helloWorld](https://github.com/kubernetes-sigs/kustomize/tree/master/examples/helloWorld)
