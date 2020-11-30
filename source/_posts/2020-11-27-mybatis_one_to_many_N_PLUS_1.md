---
layout: post
title: "mybatis에서 N+1 문제 해결"
date: 2020-11-27 13:00 +0900
comments: true
tags : ["mybatis","OneToMany","collection","JPA","N+1"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## mybatis에서 N+1 문제 해결

바로 직전처럼 Mybatis를 사용해서 oneToMany 상황에 설정해서 쓸수 있는 방법이 있습니다. 

하지만 첫번째 상황은 N+1 문제에 직면하게 됩니다. 이부분을 조인 쿼리를 통해서 해결 할수 있습니다.

먼저 mybatis xml 설정은 

```
<resultMap id="MemberDTOJoinResult" type="com.github.sejoung.test.sample.dto.MemberDTO">
    <id property="memberId" column="memberId"/>
    <result property="name" column="name"/>
    <result property="createDate" column="createDate"/>
    <collection property="details" column="memberId"
      ofType="com.github.sejoung.test.sample.dto.MemberDetailDTO">
      <id property="memberDetailId" column="memberDetailId"/>
      <result property="type" column="type"/>
      <result property="description" column="description"/>
    </collection>
  </resultMap>
  <select id="selectMemberListJoinXML" resultMap="MemberDTOJoinResult">
        select M.member_id as memberId, M.name, M.create_dt as createDate, MD.member_detail_id as memberDetailId, MD.type, MD.description from MEMBER M inner join MEMBER_DETAIL MD on M.member_id = MD.member_id
  </select>

```

위처럼 조인 쿼리를 사용하면 한번에 쿼리에 필요한 데이터를 조회 할수 있습니다.


```

  @Transactional
  @DisplayName("XML 설정 조인 쿼리")
  @Test
  void selectMemberListJoinXML() {
    saveData();
    List<MemberDTO> memberList = memberMapper.selectMemberListJoinXML();
    log.debug("memberList {}", memberList);
    Assertions.assertThat(memberList.size()).isOne();
    Assertions.assertThat(memberList.get(0).getDetails().size()).isEqualTo(2);
  }

  private void saveData() {

    var member = Member.builder().name("완구").createDate(LocalDateTime.now()).build();

    entityManager.persist(member);
    entityManager
      .persist(MemberDetail.builder().description("레고").type("장난감").member(member).build());
    entityManager
      .persist(
        MemberDetail.builder().description("플레이모빌").type("장난감").member(member).build());
    entityManager.flush();
  }

```

위처럼 테스트 코드를 통해서 확인 해볼수 있었습니다.

# 참조
-----
* [위에 테스트한 코드](https://github.com/sejoung/spring_data_jpa_mybatis)

