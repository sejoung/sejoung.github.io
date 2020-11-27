---
layout: post
title: "mybatis에서 oneToMany 형태의 객체를 조회 할때 사용할수 있는 기능"
date: 2020-11-27 13:00 +0900
comments: true
tags : ["mybatis","OneToMany","collection","JPA"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## mybatis에서 oneToMany 형태의 객체를 조회 할때 사용할수 있는 기능

JPA에서 OneToMany를 사용하면 객체의 구조적으로 하위 테이블 정보를 select 할수 있다.

Mybatis에서도 가능한데 해당 기능은 아래 처럼 2가지 방법으로 설정 할수 있다.

먼저 테이블 생성을 위해 Entity를 만들면 Member 와 MemberDetail로 만들어 보면

```java
package com.github.sejoung.test.sample.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "MEMBER")
@Entity
@ToString
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "member_id")
    private Long memberId;

    private String name;

    @Column(name = "create_dt")
    private LocalDateTime createDate;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "member")
    private List<MemberDetail> details = new ArrayList<>();

    @Builder
    private Member(String name, LocalDateTime createDate) {
        this.name = name;
        this.createDate = createDate;
    }
}


```

```java

package com.github.sejoung.test.sample.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "MEMBER_DETAIL")
@Entity
@ToString
public class MemberDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "member_detail_id")
    private Long memberDetailId;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    private String type;

    private String description;

    @Builder
    private MemberDetail(Member member, String type, String description) {
        this.member = member;
        this.type = type;
        this.description = description;
    }
}


```
여기서 그럼 mybatis로 조회를 할때 XML로 설정을 하면

```xml

<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
    "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.github.sejoung.test.sample.mapper.MemberMapper">
    <resultMap id="MemberDTOResult" type="com.github.sejoung.test.sample.dto.MemberDTO">
        <id property="memberId" column="memberId"/>
        <result property="name" column="name"/>
        <result property="createDate" column="createDate"/>
        <collection property="details" column="memberId" select="selectMemberDetailListXML"/>
    </resultMap>

    <select id="selectMemberListXML" resultMap="MemberDTOResult">
        select member_id as memberId, name, create_dt as createDate from MEMBER
    </select>

    <select id="selectMemberDetailListXML"
        resultType="com.github.sejoung.test.sample.dto.MemberDetailDTO">
        select member_detail_id as memberDetailId, type, description from MEMBER_DETAIL where member_id = #{memberId}
    </select>

</mapper>
```

위 처럼 설정할수 있고 아래 처럼 DTO로 받을수 있다.

```java

package com.github.sejoung.test.sample.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@ToString
public class MemberDTO {

    private Long memberId;
    private String name;
    private LocalDateTime createDate;
    private List<MemberDetailDTO> details;
}


```

```java
package com.github.sejoung.test.sample.mapper;

import com.github.sejoung.test.sample.dto.MemberDTO;
import com.github.sejoung.test.sample.dto.MemberDetailDTO;
import java.util.List;
import org.apache.ibatis.annotations.Many;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

@Repository
@Mapper
public interface MemberMapper {

    List<MemberDTO> selectMemberListXML();

    List<MemberDetailDTO> selectMemberDetailListXML(Long memberId);

    @Select("select member_id as memberId, name, create_dt as createDate from MEMBER")
    @Results(value = {
        @Result(property = "memberId", column = "memberId"),
        @Result(property = "name", column = "name"),
        @Result(property = "createDate", column = "createDate"),
        @Result(property = "details", column = "memberId", javaType = List.class, many = @Many(select = "selectMemberDetailList"))
    })
    List<MemberDTO> selectMemberList();

    @Select("select member_detail_id as memberDetailId, type, description from MEMBER_DETAIL where member_id = #{memberId}")
    @Results(value = {
        @Result(property = "memberDetailId", column = "memberDetailId"),
        @Result(property = "type", column = "type"),
        @Result(property = "description", column = "description")
    })
    List<MemberDetailDTO> selectMemberDetailList(Long memberId);
}


```

어너테이션 기반으로 셋팅을 해서 하는 방법은 위처럼 처리가 될수 있다.

테스트 코드를 짜서 보면 

```java
package com.github.sejoung.test.sample.mapper;

import com.github.sejoung.test.sample.domain.Member;
import com.github.sejoung.test.sample.domain.MemberDetail;
import com.github.sejoung.test.sample.dto.MemberDTO;
import java.time.LocalDateTime;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mybatis.spring.boot.test.autoconfigure.AutoConfigureMybatis;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RunWith(SpringRunner.class)
@DataJpaTest
@AutoConfigureMybatis
class MemberMapperTest {

    @Autowired
    private MemberMapper memberMapper;

    @Autowired
    private TestEntityManager entityManager;

    @Transactional
    @DisplayName("XML 설정")
    @Test
    void selectMemberListXML() {

        var member = Member.builder().name("완구").createDate(LocalDateTime.now()).build();

        entityManager.persist(member);
        entityManager
            .persist(MemberDetail.builder().description("레고").type("장난감").member(member).build());
        entityManager
            .persist(
                MemberDetail.builder().description("플레이모빌").type("장난감").member(member).build());
        entityManager.flush();

        List<MemberDTO> memberList = memberMapper.selectMemberListXML();
        log.debug("memberList {}", memberList);
        Assertions.assertThat(memberList.size()).isOne();
        Assertions.assertThat(memberList.get(0).getDetails().size()).isEqualTo(2);
    }

    @Transactional
    @DisplayName("어너테이션 설정")
    @Test
    void selectMemberList() {

        var member = Member.builder().name("완구").createDate(LocalDateTime.now()).build();

        entityManager.persist(member);
        entityManager
            .persist(MemberDetail.builder().description("레고").type("장난감").member(member).build());
        entityManager
            .persist(
                MemberDetail.builder().description("플레이모빌").type("장난감").member(member).build());
        entityManager.flush();
        List<MemberDTO> memberList = memberMapper.selectMemberList();
        log.debug("memberList {}", memberList);
        Assertions.assertThat(memberList.size()).isOne();
        Assertions.assertThat(memberList.get(0).getDetails().size()).isEqualTo(2);
    }
}

```

정상적으로 데이터가 들어가서 처리되는것을 볼수가 있다.


# 참조
-----
* [위에 테스트한 코드](https://github.com/sejoung/spring_data_jpa_mybatis)

