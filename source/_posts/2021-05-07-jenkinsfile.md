---
layout: post
title: "젠킨스 파이프라인(jenkinsfile)에서 /usr/local/bin 인식 시키기"
date: 2021-05-07 09:42 +0900
comments: true
tags : ["JENKINS-41339","pipeline","jenkins","PATH+EXTRA","/usr/local/bin","docker-compose"]
categories : ["jenkins"]
sitemap :
changefreq : daily
priority : 1.0
--->
# 젠킨스 파이프라인(jenkinsfile)에서 /usr/local/bin 인식 시키기
젠킨스 파이프 라인에서 sh 을 실행시킬려고 하는데 `docker-compose` 명령을 인식하지 못한다

```groovy

pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'echo $PATH'
            }
        }
    }
}

```
위처럼 $PATH를 찍어 보니 `/usr/local/bin`이 경로에 없었다.
withEnv 라는 함수를 사용해 아래와 같이 활용할수도 있다.
```groovy

pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                withEnv(['PATH+EXTRA=/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/bin']) {
                    sh 'docker-compose --version'
                }
            }
        }
    }
}

```

# 참고자료
* [pipeline syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
* [archiveArtifacts](https://www.jenkins.io/doc/pipeline/steps/core/)
* [jenkins-hudson-environment-variables](https://stackoverflow.com/questions/5818403/jenkins-hudson-environment-variables)
* [jenkins-does-not-recognize-command-sh](https://stackoverflow.com/questions/43987005/jenkins-does-not-recognize-command-sh)
* [pipeline slack](https://www.jenkins.io/doc/pipeline/steps/slack/)
