---
layout: post
title: "쿠버네티스 워크로드 잡 테스트"
date: 2022-12-02 12:41 +0900
comments: true
tags : ["워크로드","쿠버네티스","잡","workloads","kubernetes","k8s","job"]
categories : ["kubernetes","k8s"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 쿠버네티스 워크로드 잡 테스트

로컬에서 테스트 하기 위해 [마니쿠베](https://minikube.sigs.k8s.io/docs/start/)를 인스톨 한다.

```yaml

apiVersion: batch/v1
kind: Job
metadata:
  name: pi
spec:
  template:
    spec:
      containers:
      - name: pi
        image: perl:5.34.0
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
  backoffLimit: 4

```

```shell
kubectl apply -f https://kubernetes.io/examples/controllers/job.yaml
```

위 처럼 간단하게 테스트 해볼수 있다.

```yaml

apiVersion: batch/v1
kind: Job
metadata:
    name: pi-with-ttl
spec:
    ttlSecondsAfterFinished: 100
    template:
        spec:
            containers:
                - name: pi
                  image: perl:5.34.0
                  command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
            restartPolicy: Never


```

# 참조

-----
* [minikube](https://minikube.sigs.k8s.io/docs/start/)
* [kubernetes job](https://kubernetes.io/ko/docs/concepts/workloads/controllers/job/)
