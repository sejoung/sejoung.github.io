---
layout: post
title: "쿠버네티스 워크로드 크론잡 속성 테스트"
date: 2022-12-06 11:29 +0900
comments: true
tags : ["워크로드","쿠버네티스","크론잡","workloads","kubernetes","k8s","cronjob"]
categories : ["kubernetes","k8s"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 쿠버네티스 워크로드 크론잡 속성 테스트

로컬에서 테스트 하기 위해 [마니쿠베](https://minikube.sigs.k8s.io/docs/start/)를 인스톨 한다.

```yaml

apiVersion: batch/v1
kind: CronJob
metadata:
    name: cron-job-test
spec:
    schedule: "*/1 * * * *"
    concurrencyPolicy: Forbid
    successfulJobsHistoryLimit: 2
    failedJobsHistoryLimit: 5
    jobTemplate:
        spec:
            ## 특정 시간이 지날때 완료되거나 실패한 pod를 정리하는 속성
            ttlSecondsAfterFinished: 10000
            ## 특정 시간이 지날때까지 잡이 끝나지 않을때 종료하는 옵션
            ## type: Failed 와 reason: DeadlineExceeded 로 표시됨
            activeDeadlineSeconds: 200
            ## backoffLimit 에 도달하면 작업은 실패한것으로 간주한다.
            backoffLimit: 10
            ## 병렬실행 관련 옵션
            parallelism: 1
            ## 완료
            completions: 1
            template:
                spec:
                    containers:
                        - name: concurrency-policy-forbid-test
                          image: alpine
                          command: ["sh", "-c", "echo 'job start';sleep 140; echo 'job end'"]
                    ## 재시작 정책 Never, OnFailure
                    restartPolicy: Never

```

```shell

kubectl create -f cronjob.yaml

```

# 참조

-----
* [minikube](https://minikube.sigs.k8s.io/docs/start/)
* [kubernetes cron job](https://kubernetes.io/ko/docs/tasks/job/automated-tasks-with-cron-jobs/)
