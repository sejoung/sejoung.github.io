---
layout: post
title: "자체 테스트 코드(SelfTestingCode)"
date: 2021-05-16 12:30 +0900
comments: true
tags : ["SelfTestingCode","자체 테스트 코드"]
categories : ["testing"]
sitemap :
changefreq : daily
priority : 1.0
--->
# 자체 테스트 코드(SelfTestingCode)

자체 테스트 코드는 기능 소프트웨어와 함께 포괄적 인 자동화 테스트를 작성하는 관행을 참조하기 위해 리팩토링 책 에서 사용한 이름

코드베이스에 대해 일련의 자동화 된 테스트를 실행할 수있을 때 자체 테스트 코드가 있고 테스트를 통과하면 코드에 상당한 결함이 없음을 확신 할 수 있습니다.

자체 테스트 코드는 지속적 통합 의 핵심 부분 실제로 자체 테스트 코드가 없으면 실제로 지속적 통합을 수행하지 않는다고 말합니다

핵심은 개발자가 자연스럽게 코드 작성과 테스트를 함께 생각하는 테스트 문화를 구축하는 것입니다.

자체 테스트 코드를 실행하는 팀의 중요한 행동 중 하나는 프로덕션 버그에 대한 반응입니다
일반적인 반응은 먼저 버그를 노출하는 테스트를 작성한 다음 수정을 시도하는 것입니다

# 참고자료
* [martinfowler SelfTestingCode](https://martinfowler.com/bliki/SelfTestingCode.html)
