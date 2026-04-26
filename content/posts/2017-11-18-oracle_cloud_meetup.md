---
layout: post
title: "oracle_meetup"
date: 2017-11-18 12:30:00 +0900
comments: true
tags : ["oracle cloud","k8s"]
categories : ["2017 세미나"]
sitemap :
  changefreq : daily
  priority : 1.0
---
#오라클 밋업
10분에 아셈에 도착해서 15층에서 행사관련 등록후에 입장 했지만 카페에서 20분 이상 대기후에 30분이 넘은후 회의실에 도착

오라클 wifi 패스워드 관련 퀘스트에서 난관에 봉착했지만 브루트포스 공격으로 엑세스 성공 ㅡㅡ(칠판에 글씨가 알아보기 어려웠음, 하지만 빔에서 나오는건 잘보기 편했는데 내가 늦게 앎)

근데 밋업에 내용인 도커관련 내용은 안하고 이일민씨의 유튜브를 시청중('Oracle Code Seoul'에 발표)

1시에 드디어 시작

디벨로퍼관련 행사를 매달 진행할 예정(이제부터 클라우드사업을 하면서 기조를 바꾸는중)

요즘에 화두과 되고 있는 여러가지 기술중 첫번째로 도커랑 쿠버네티스를 선택함 오라클 황주필선생 발표

오라클도 올해 쿠버네티스 협회에 가입해서 돈을 내고 기여를 하는중

bare metal -> IaaS -> CaaS -> FaaS

docker

 중요기술
  -cgroups
  -namespaces(Process ID,Mount ......)
  -union-capable file system(OverlayFS....)
 docker와 vm의 비교가 1vs1로 비교가 어려운 이유
  docker는 인프라스트럭쳐가 아니라 개발에 밀접한 관계를 가지고 있어서

도커 1.13 부터 image ls 이런 형태의 명령어가 가능

#참고자료

이일민님의 'Java 9과 Spring 5로 바라보는 Java의 변화와 도전'(https://www.youtube.com/watch?v=BFjrmj4p3_Y)

https://github.com/credemol/k8s_tutorial

https://gitpitch.com/credemol/k8s_tutorial#/
