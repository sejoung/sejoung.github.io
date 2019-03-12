---
layout: post
title: "GivenWhenThen"
date: 2019-03-12 14:20 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## Given When Then

Dan North 와 Chris Matts가 Behavior-Driven Development (BDD)의 일환으로 개발 한 접근 방식입니다 .

필수 아이디어는 세 가지 섹션으로 시나리오 (또는 테스트)를 작성하는 것입니다.

```
Given-When-Then 공식은 User Story에 대한 수락 테스트 의 작성을 안내하기위한 템플릿입니다 .

(Given) 약간의 문맥
(When) 어떤 행동이 수행된다.
(Then) 관찰 가능한 결과의 특정 세트가 얻어야한다.

예 :
(Given) 내 은행 계좌에 크레딧이 있고 최근에 인출을하지 않았다면,
(When) 카드의 한도액보다 적은 금액을 인출하려고하면,
(Then) 그런 다음 철회가 오류나 경고없이 완료되어야합니다.

```
코드로 풀어보면 아래처럼

```java


package com.github.sejoung.repositories;

import com.github.sejoung.domain.DomainTest;
import lombok.extern.slf4j.Slf4j;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;

@RunWith(SpringRunner.class)
@SpringBootTest
@Slf4j
public class TestRepositoryDomainDomainTest {

  @Resource
  private DomainTestRepository repository;

  @Test
  public void 저장테스트() {

    // given
    var dt = DomainTest.builder().title("test").build();
    var saveDt = repository.save(dt);

    //when
    var isData = repository.existsById(saveDt.getId());

    //then
    assertThat("같은 데이터를 가지고옴",isData,is(true));

    //초기화
    repository.delete(saveDt);

  }

}

```


# 참조
-----
* [martinfowler GivenWhenThen](https://martinfowler.com/bliki/GivenWhenThen.html)
* [개인적으로 권장드리는 TDD 코드 작성 스타일](https://blog.doortts.com/169)
* [Unit Tests할 때 given-when-then pattern 사용하시나요?](https://www.slipp.net/questions/82)
* [gwt glossary](https://www.agilealliance.org/glossary/gwt/)
* [Four-Phase Test](http://xunitpatterns.com/Four%20Phase%20Test.html)
* [cucumber.io](https://cucumber.io/)
* [코드리뷰 적응기(feat. 파일럿 프로젝트)](http://woowabros.github.io/experience/2019/02/28/pilot-project-settle.html)
