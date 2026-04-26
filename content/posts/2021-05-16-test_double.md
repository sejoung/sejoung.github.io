---
layout: post
title: "테스트 더블(TestDouble)"
date: 2021-05-16 12:38 +0900
comments: true
tags : ["TestDouble","테스트 더블","Dummy", "Fake", "Stubs", "Spies", "Mocks", "테스팅 용어"]
categories : ["testing"]
sitemap :
changefreq : daily
priority : 1.0
--->
# 테스트 더블(TestDouble)

테스트더블의 용어는 스턴트더블를 생각하면 된다. 영화 촬영시 위험한 액션씬을 찍을때 스턴트 더블을 사용하기도 한다.
테스트도 테스트 하기 어려운것을 테스트 하기 위해 테스트 더블을 사용한다.(Gerard Meszaros가 사용한 어휘)

* Dummy : 오브젝트는 전달되지만 실제로 사용되지는 않습니다. 일반적으로 매개 변수 목록을 채우는 데 사용됩니다.
* Fake : 실제로 작동하는 구현을 가지고 있지만 일반적으로 프로덕션에 적합하지 않은 지름길을 사용합니다 ( InMemoryTestDatabase 가 좋은 예입니다).
* Stubs : 테스트 중에 이루어진 통화에 대해 미리 준비된 답변을 제공하며, 일반적으로 테스트를 위해 프로그래밍 된 내용 이외의 항목에는 전혀 응답하지 않습니다.
* Spies : 호출 방법에 따라 일부 정보를 기록하는 스텁입니다. 한 가지 형태는 전송 된 메시지 수를 기록하는 이메일 서비스 일 수 있습니다.
* Mocks : 받을 것으로 예상되는 호출의 사양을 형성하는 기대치로 미리 프로그래밍되어 있습니다. 예상하지 못한 전화를 받으면 예외를 throw 할 수 있으며 예상했던 모든 전화를 받았는지 확인하는 동안 확인됩니다.


# 참고자료
* [martinfowler TestDouble](https://martinfowler.com/bliki/TestDouble.html)
* [wikipedia Stunt_double](https://en.wikipedia.org/wiki/Stunt_double)
