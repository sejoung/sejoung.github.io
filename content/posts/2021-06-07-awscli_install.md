---
layout: post
title: "aws 커멘드라인 툴(cli) 설치"
date: 2021-06-07 10:30 +0900
comments: true
tags : ["aws cli","aws 커멘드라인 툴"]
categories : ["aws"]
sitemap :
changefreq : daily
priority : 1.0
--->
# aws 커멘드라인 툴(cli) 설치

```shell
brew install awscli
```

커멘드 라인툴을 설치 하면 config를 설정해야 되는데

```shell
aws configure
```
위에 명령어를 치면 아래처럼 Access key와 Secret를 
그리고 리전을 입력하는 창이 나오는데 자신의 키를 입력하면 된다.

```shell
AWS Access Key ID []:
AWS Secret Access Key []:
Default region name []:
Default output format [json]:
```
Access key와 secret은 최초 계정생성시 발급이 된다.

Access key는 확인이 가능하지만 secret은 확인 방법이 없어서 재발행 해야 된다.

![aws 커멘드라인 툴(cli) 설치 1](https://sejoung.github.io/images/2021_06_07_01.png)


![aws 커멘드라인 툴(cli) 설치 2](https://sejoung.github.io/images/2021_06_07_02.png)



# 참고자료
* [aws cli install](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/cli-chap-install.html)
* [awscli](https://formulae.brew.sh/formula/awscli)
