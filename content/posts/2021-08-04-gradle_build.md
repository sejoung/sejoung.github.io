---
layout: post
title: "gradle build 속도"
date: 2021-08-04 14:35 +0900
comments: true
tags : ["gradle","build","parallel"]
categories : ["java"]
sitemap :
changefreq : daily
priority : 1.0
--->
# gradle build 속도

멀티 모듈 프로젝트로 모듈이 많아 지고 테스트 코드가 나눠지면서 빌드 속도가 오래 걸리기 시작했다 조금 찾아 보니 병렬 실행 옵션이 존재한다.

gradle.properties
```
# use gradle build caching
org.gradle.caching=true

# use gradle daemon
org.gradle.configureondemand=true

# use gradle parllel build
org.gradle.parallel=true

# set gradle java heap
org.gradle.jvmargs=-Xmx2048m 
```
위에 욥션을 주거나 명령줄에 --parallel을 주면 속도가 빨라진다.

```
gradle clean build --parallel
```

여기서 성능 관련해서 몇가지 옵션들이 있는데 보면 좋다.

```
--build-cache, --no-build-cache
빌드 캐시 활성화 옵션. Default is off.

--configure-on-demand, --no-configure-on-demand
종속성 구성. Default is off.

--max-workers
최대 워커 갯수. Default is number of processors.

--parallel, --no-parallel
병렬빌드. Default is off.

--priority
Gradle 데몬 및 Gradle 데몬이 실행하는 모든 프로세스에 대한 일정 우선 순위를 지정. Values are normal or low. Default is normal.

--profile
$buildDir/reports/profile디렉토리 에 높은 수준의 성능 보고서를 생성. --scan is preferred.

--scan
Generate a build scan with detailed performance diagnostics.

--watch-fs, --no-watch-fs
파일 시스템 감시를 토글 합니다 . 활성화되면 Gradle은 빌드 간에 파일 시스템에 대해 수집한 정보를 재사용합니다. Gradle이 이 기능을 지원하는 운영 체제에서 기본적으로 활성화됩니다.


```


# 참고자료
-----
* [gradle performance](https://docs.gradle.org/current/userguide/performance.html)
* [multi_project_configuration_and_execution](https://docs.gradle.org/current/userguide/multi_project_configuration_and_execution.html#sec:parallel_execution)
