---
layout: post
title: "GivenWhenThen"
date: 2019-03-12 14:20 +0900
comments: true
tags : ["tdd"]
categories : ["java"]
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


import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.CoreMatchers.is;


import com.github.sejoung.domain.DomainTest;
import javax.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@DataJpaTest // the test slice
@Slf4j
public class TestRepositoryDomainDomainTest {

  @Resource
  private DomainTestRepository repository;

  @Resource
  private TestEntityManager testEntityManager;

  @Test
  public void 조회테스트() {

    // given
    var dt = DomainTest.builder().title("test").build();
    testEntityManager.persistAndFlush(dt);

    //when
    var saveDt = repository.findById(dt.getId()).orElseThrow();

    //then
    assertThat(saveDt.getTitle()).as("타이틀이 저장된 값과 조회된 값이 같아야 된다.").isEqualTo("test");
    assertThat(saveDt.getId()).as("id가 있어야 된다.").isNotNull();
    assertThat(saveDt.getCreateDateTime().toLocalDate()).as("저장된 생성일자와 조회된 생성일자가 같아야 된다.")
        .isEqualTo(dt.getCreateDateTime().toLocalDate());

    Assert.assertThat("타이틀이 저장된 값과 조회된 값이 같아야 된다.",saveDt.getTitle(), is("test"));
  }

}

```

위에 코드를 보면 hamcrest와 assertj를 썩어 써보았다. 

제쪽엔 더 장점을 느끼는게 assertj가 코드 어시스턴트의 도움을 받을수 있어서 더 편한것 같다. 


# 참조
-----
* [martinfowler GivenWhenThen](https://martinfowler.com/bliki/GivenWhenThen.html)
* [개인적으로 권장드리는 TDD 코드 작성 스타일](https://blog.doortts.com/169)
* [Unit Tests할 때 given-when-then pattern 사용하시나요?](https://www.slipp.net/questions/82)
* [gwt glossary](https://www.agilealliance.org/glossary/gwt/)
* [Four-Phase Test](http://xunitpatterns.com/Four%20Phase%20Test.html)
* [cucumber.io](https://cucumber.io/)
* [코드리뷰 적응기(feat. 파일럿 프로젝트)](http://woowabros.github.io/experience/2019/02/28/pilot-project-settle.html)
* [hamcrest vs AssertJ](https://dzone.com/articles/hamcrest-vs-assertj-assertion-frameworks-which-one)