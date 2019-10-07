---
layout: post
title: "Mybatis ENUM 사용법"
date: 2019-10-07 11:55 +0900
comments: true
tags : ["Mybatis","enum","TypeHandler"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
 
## Mybatis ENUM 사용법

Mybatis에는 타입 핸들러가 있어서 기본적으로 EnumTypeHandler와 EnumOrdinalTypeHandler를 제공하고 있다.

EnumTypeHandler는 varchar 타입으로 컨버트 해주고 EnumOrdinalTypeHandler는 NUMERIC or DOUBLE으로 변경해준다.


```java

import static java.util.stream.Collectors.toMap;


import java.util.Map;
import java.util.Objects;
import java.util.stream.Stream;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public enum SyncNyType {

    SYNC_NO("N", "동기화 안됨"),
    SYNC_COMPLETE("Y", "동기화 완료"),
    SYNC_ERROR("E", "동기화 에러");

    private static final Map<String, SyncNyType> stringToEnum =
        Stream.of(values()).collect(toMap(SyncNyType::getCode, e -> e));

    @Getter
    private String code;
    private String description;

    SyncNyType(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public static SyncNyType fromString(String symbol) {
        SyncNyType syncNyType = stringToEnum.get(symbol);
        if (Objects.isNull(syncNyType)) {
            log.error("잘못된 동기화 타입입니다. SyncNy = {}", symbol);
            throw new IllegalArgumentException("잘못된 동기화 타입입니다.");
        }
        return syncNyType;
    }

}


```


위처럼 타입에 벨류 값이 DB에 코드가 아닌경우에는 TypeHandler를 통해서 처리 하면 된다 


```java

public interface CodeEnum {
    String getCode();
}

```

먼저 CodeEnum 인터페이스를 만들고

```java

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import kr.co.parkingcloud.local.commons.model.CodeEnum;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.TypeException;
import org.apache.ibatis.type.TypeHandler;

public abstract class CodeEnumTypeHandler<E extends Enum<E>> implements TypeHandler<CodeEnum> {

    private Class<E> type;

    public CodeEnumTypeHandler(Class<E> type) {
        this.type = type;
    }

    @Override
    public void setParameter(PreparedStatement ps, int i, CodeEnum parameter, JdbcType jdbcType)
        throws SQLException {
        ps.setString(i, parameter.getCode());
    }

    @Override
    public CodeEnum getResult(ResultSet rs, String columnName) throws SQLException {
        String code = rs.getString(columnName);
        return getCodeEnum(code);
    }

    @Override
    public CodeEnum getResult(ResultSet rs, int columnIndex) throws SQLException {
        String code = rs.getString(columnIndex);
        return getCodeEnum(code);
    }

    @Override
    public CodeEnum getResult(CallableStatement cs, int columnIndex) throws SQLException {
        String code = cs.getString(columnIndex);
        return getCodeEnum(code);
    }

    private CodeEnum getCodeEnum(String code) {
        try {
            CodeEnum[] enumConstants = (CodeEnum[]) type.getEnumConstants();
            for (CodeEnum codeNum : enumConstants) {
                if (codeNum.getCode().equals(code)) {
                    return codeNum;
                }
            }
            return null;
        } catch (Exception e) {
            throw new TypeException("Can't make enum object '" + type + "'", e);
        }
    }
}


```

위와 같이 타입 핸들러를 만들어 준다.


그다음에 위에 SyncNyType 을 CodeEnum을 상속 받게 하면 된다.

```java

import static java.util.stream.Collectors.toMap;


import java.util.Map;
import java.util.Objects;
import java.util.stream.Stream;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public enum SyncNyType implements CodeEnum {

    SYNC_NO("N", "동기화 안됨"),
    SYNC_COMPLETE("Y", "동기화 완료"),
    SYNC_ERROR("E", "동기화 에러");

    private static final Map<String, SyncNyType> stringToEnum =
        Stream.of(values()).collect(toMap(SyncNyType::getCode, e -> e));

    @Getter
    private String code;
    private String description;

    SyncNyType(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public static SyncNyType fromString(String symbol) {
        SyncNyType syncNyType = stringToEnum.get(symbol);
        if (Objects.isNull(syncNyType)) {
            log.error("잘못된 동기화 타입입니다. SyncNy = {}", symbol);
            throw new IllegalArgumentException("잘못된 동기화 타입입니다.");
        }
        return syncNyType;
    }

}


```

# 참조
----- 
* [typeHandlers](https://mybatis.org/mybatis-3/configuration.html#typeHandlers)
