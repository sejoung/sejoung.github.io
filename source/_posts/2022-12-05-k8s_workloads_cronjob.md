---
layout: post
title: "쿠버네티스 워크로드 크론잡 테스트"
date: 2022-12-05 12:23 +0900
comments: true
tags : ["워크로드","쿠버네티스","크론잡","workloads","kubernetes","k8s","cronjob"]
categories : ["kubernetes","k8s"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 쿠버네티스 워크로드 크론잡 테스트

로컬에서 테스트 하기 위해 [마니쿠베](https://minikube.sigs.k8s.io/docs/start/)를 인스톨 한다.

```yaml

apiVersion: batch/v1
kind: CronJob
metadata:
    name: hello
spec:
    schedule: "*/1 * * * *"
    jobTemplate:
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

jobTemplate 아래는 job 과 완전 똑같은 스팩이다. 바로 직전에 테스트 해본 잡을 가지고 테스트 해보면 된다.

# 참조

-----
* [minikube](https://minikube.sigs.k8s.io/docs/start/)
* [kubernetes cron job](https://kubernetes.io/ko/docs/tasks/job/automated-tasks-with-cron-jobs/)
