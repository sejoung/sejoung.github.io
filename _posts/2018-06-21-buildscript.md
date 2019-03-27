---
layout: post
title: "빌드스크립트 정리 후기"
date: 2018-06-21 11:30:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 빌드스크립트 정리 후기

회사내 빌드 스트립트 정리작업을 진행 했었다 올해 초(2018-01)에 진행 했었는데 이제야 후기를 올린다.
기존 빌드 스크립트는 ant로 되어 있었고 프로젝트 자체는 maven으로 설정(?)은 되어 있었지만 maven을 아에 참조 하지 않고 있었다.
그런식이다 보니 개발자들 개발시에 pom에도 추가 하고 WEB-INF 폴더 아래에 lib 폴더에도 추가 하고 있었다. 
ant 빌드 스크립트가 maven을 참조 하지 않기 때문에 이렇게 중복 작업을 하고 있었다.

빌드 스크립트를 정리해야겠다고 판단된것이 위에 이유도 하나의 이유가 있지만 차후 CI(Continuous Integration)/CD(Continuous Delivery)를
적용을 하고 각종 라이브러리의 버전업 및 의존성 관리를 편하게 하기 위한 이유도 있었다.

라이브러리 버전업을 고려했던것이 지금 내부에 SPRING 프레임워크를 적용해서 일부 사용중인데 버전이 2.5버전을 적용하고 있어서 향후 spring 전면 적용시에 
라이브러리를 4.X 버전까지는 업그레이드 테스트를 빠르게 진행하려고 빌드스크립트를 정리했다.

머 정리한것은 내부적으로 Bean Validation 어너테이션을 사용하고 있는데 잘못 적용 된 부분 삭제 및 수정후 가이드 하고 lib 폴더에 있는 라이브러리를 
하나씩 maven으로 등록 하였고 그 과정에서 버전이 너무 낮은(maven repository에서 찾을수 없는)것은 바로 윗버전으로 올려서 확인했고 더이상 쓰지 않는 라이브러리들을 정리 했다.

빌드 스크립트는 maven 빌드를 통해서 해결했고 CI적용은 테스트 까지 진행하고 정책 문제등에 의해 대기된 상태이다.

빌드스크립트를 정리하면서 [Automation for the people, Remove the smell from your build scripts](https://www.ibm.com/developerworks/java/library/j-ap10106/index.html) 이 내용을 잼있게 읽었다.
