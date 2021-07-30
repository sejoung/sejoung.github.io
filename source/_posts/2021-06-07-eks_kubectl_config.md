---
layout: post
title: "kubectl 다중 클러스터 접근 구성(aws eks)"
date: 2021-06-07 13:30 +0900
comments: true
tags : ["aws eks","kubectl","다중 접속",""]
categories : ["aws"]
sitemap :
changefreq : daily
priority : 1.0
--->
# kubectl 다중 클러스터 접근 구성(aws eks)

먼저 [aws cli](https://sejoung.github.io/2021/06/2021-06-07-awscli_install/)를 설치해야 된다.

```
aws configure
AWS Access Key ID [None]: 본인 Access Key
AWS Secret Access Key [None]: 본인 Secret Access Key
Default region name [None]: ap-northeast-2
Default output format [None]: json

```
설치후에 eks 접속 권한이 있는 key와 secret을 설정해야 된다.

```shell
aws eks --region $REGION update-kubeconfig --name $CLUSTER_NAME

aws eks --region ap-northeast-2 update-kubeconfig --name test-eks
```
위에 commend를 설정 하면 kubeconfig를 업데이트 하게 된다.

아래 의 명령어로 contexts가 잘등록 된지 확인할수 있다.

## 전체 context 목록 확인
```shell
kubectl config get-contexts
```

## 현제 context 목록 확인
```shell
kubectl config current-context

```

## context 바꾸기
```shell
kubectl config use-context minikube
```

```shell
kubectl get svc

kubectl get nodes -o wide

kubectl get pods --all-namespaces -o wide

```

# 참고자료
* [kubeconfig 파일을 사용하여 클러스터 접근 구성하기](https://kubernetes.io/ko/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
* [다중 클러스터 접근 구성](https://kubernetes.io/ko/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)  
* [kubectl-commands#config](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#config)
* [Amazon EKS 시작하기 —eksctl](https://docs.aws.amazon.com/ko_kr/eks/latest/userguide/getting-started-eksctl.html)
