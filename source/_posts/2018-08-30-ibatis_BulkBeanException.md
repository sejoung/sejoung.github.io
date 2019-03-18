---
layout: post
title: "ibatis_BulkBeanException"
date: 2018-08-30 10:15 +0900
comments: true
tags : ["java","ibatis"]
categories : ["장애"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### ibatis BulkBeanException

지금 회사에서 ibatis 버전 2.3.4.726 을 사용 하고 있습니다. 이용할때 뜨문뜨문 에러가 발생했습니다. 
에러 메시지는 아래와 같이 나왔습니다.

```
CLASS_NAME : MappedStatement.java / LINE : 211 / MESSAGE : com.ibatis.common.jdbc.exception.NestedSQLException:
--- The error occurred in com/mobon/dao/sql/mobon.xml.
--- The error occurred while applying a result map.
--- Check the mobon.selAdInfo-AutoResultMap.
--- The error happened while setting a property on the result object.
--- Cause: net.sf.cglib.beans.BulkBeanException
CLASS_NAME : MappedStatement.java / LINE : 144 / MESSAGE : com.ibatis.common.jdbc.exception.NestedSQLException:
--- The error occurred in com/mobon/dao/sql/mobon.xml.
--- The error occurred while applying a result map.
--- Check the mobon.selAdInfo-AutoResultMap.
--- The error happened while setting a property on the result object.
--- Cause: net.sf.cglib.beans.BulkBeanException

```

에러 메시지를 보고 궁금증이 들어서 ibatis code를 보았습니다. 에러가 났던 클래스는 
MappedStatement.java(com.ibatis.sqlmap.engine.mapping.statement 패키지에 있습니다.) 
에러가 난 메소드를 보면 아래와 같은 코드 입니다.

```java

protected void executeQueryWithCallback(StatementScope statementScope, Connection conn, Object parameterObject, Object resultObject, RowHandler rowHandler, int skipResults, int maxResults)
      throws SQLException {
//    conn.setReadOnly(isReadOnly()); // added by yseun

    ErrorContext errorContext = statementScope.getErrorContext();
    errorContext.setActivity("preparing the mapped statement for execution");
    errorContext.setObjectId(this.getId());
    errorContext.setResource(this.getResource());

    try {
      parameterObject = validateParameter(parameterObject);

      Sql sql = getSql();

      errorContext.setMoreInfo("Check the parameter map.");
      ParameterMap parameterMap = sql.getParameterMap(statementScope, parameterObject);

      errorContext.setMoreInfo("Check the result map.");
      ResultMap resultMap = sql.getResultMap(statementScope, parameterObject);

      statementScope.setResultMap(resultMap);
      statementScope.setParameterMap(parameterMap);

      errorContext.setMoreInfo("Check the parameter map.");
      Object[] parameters = parameterMap.getParameterObjectValues(statementScope, parameterObject);

      errorContext.setMoreInfo("Check the SQL statement.");
      String sqlString = sql.getSql(statementScope, parameterObject);

      errorContext.setActivity("executing mapped statement");
      errorContext.setMoreInfo("Check the SQL statement or the result map.");
      RowHandlerCallback callback = new RowHandlerCallback(resultMap, resultObject, rowHandler);
      sqlExecuteQuery(statementScope, conn, sqlString, parameters, skipResults, maxResults, callback);

      errorContext.setMoreInfo("Check the output parameters.");
      if (parameterObject != null) {
        postProcessParameterObject(statementScope, parameterObject, parameters);
      }

      errorContext.reset();
      sql.cleanup(statementScope);
      notifyListeners();
    } catch (SQLException e) {
      errorContext.setCause(e);
      throw new NestedSQLException(errorContext.toString(), e.getSQLState(), e.getErrorCode(), e);
    } catch (Exception e) {
      errorContext.setCause(e);
      throw new NestedSQLException(errorContext.toString(), e);
    }
  }


```

위에 코드만 보아서는 어느부분인지 감지가 되지 않습니다. 다시 코드를 쫓아 가다 보니

결국엔 196 line에 sqlExecuteQuery 메소드를 실행 시키고 해당 메소드는 SqlExecutor class에 
executeQuery를 실행(com.ibatis.sqlmap.engine.execution 패키지)

```java

 public void executeQuery(StatementScope statementScope, Connection conn, String sql, Object[] parameters, int skipResults, int maxResults, RowHandlerCallback callback) throws SQLException {
    ErrorContext errorContext = statementScope.getErrorContext();
    errorContext.setActivity("executing query");
    errorContext.setObjectId(sql);
    PreparedStatement ps = null;
    ResultSet rs = null;
    setupResultObjectFactory(statementScope);
    try {
      errorContext.setMoreInfo("Check the SQL Statement (preparation failed).");
      Integer rsType = statementScope.getStatement().getResultSetType();
      if (rsType != null) {
        ps = prepareStatement(statementScope.getSession(), conn, sql, rsType);
      } else {
        ps = prepareStatement(statementScope.getSession(), conn, sql);
      }
      setStatementTimeout(statementScope.getStatement(), ps);
      Integer fetchSize = statementScope.getStatement().getFetchSize();
      if (fetchSize != null) {
        ps.setFetchSize(fetchSize.intValue());
      }
      errorContext.setMoreInfo("Check the parameters (set parameters failed).");
      statementScope.getParameterMap().setParameters(statementScope, ps, parameters);
      errorContext.setMoreInfo("Check the statement (query failed).");
      ps.execute();
      errorContext.setMoreInfo("Check the results (failed to retrieve results).");

      // Begin ResultSet Handling
      rs = handleMultipleResults(ps, statementScope, skipResults, maxResults, callback);
      // End ResultSet Handling
    } finally {
      try {
        closeResultSet(rs);
      } finally {
        closeStatement(statementScope.getSession(), ps);
      }
    }

  }

```

위에 코드에서 다시 handleMultipleResults 메소드를 호출 하면

```java

 private ResultSet handleMultipleResults(PreparedStatement ps, StatementScope statementScope, int skipResults, int maxResults, RowHandlerCallback callback) throws SQLException {
    ResultSet rs;
    rs = getFirstResultSet(statementScope, ps);
    if (rs != null) {
      handleResults(statementScope, rs, skipResults, maxResults, callback);
    }

    // Multiple ResultSet handling
    if (callback.getRowHandler() instanceof DefaultRowHandler) {
      MappedStatement statement = statementScope.getStatement();
      DefaultRowHandler defaultRowHandler = ((DefaultRowHandler) callback.getRowHandler());
      if (statement.hasMultipleResultMaps()) {
        List multipleResults = new ArrayList();
        multipleResults.add(defaultRowHandler.getList());
        ResultMap[] resultMaps = statement.getAdditionalResultMaps();
        int i = 0;
        while (moveToNextResultsSafely(statementScope, ps)) {
          if (i >= resultMaps.length) break;
          ResultMap rm = resultMaps[i];
          statementScope.setResultMap(rm);
          rs = ps.getResultSet();
          DefaultRowHandler rh = new DefaultRowHandler();
          handleResults(statementScope, rs, skipResults, maxResults, new RowHandlerCallback(rm, null, rh));
          multipleResults.add(rh.getList());
          i++;
        }
        defaultRowHandler.setList(multipleResults);
        statementScope.setResultMap(statement.getResultMap());
      } else {
        while (moveToNextResultsSafely(statementScope, ps)) ;
      }
    }
    // End additional ResultSet handling
    return rs;
  }

```

여기서 handleResults 메소드를 다시 호출하게 됩니다.

```java

 private void handleResults(StatementScope statementScope, ResultSet rs, int skipResults, int maxResults, RowHandlerCallback callback) throws SQLException {
    try {
      statementScope.setResultSet(rs);
      ResultMap resultMap = statementScope.getResultMap();
      if (resultMap != null) {
        // Skip Results
        if (rs.getType() != ResultSet.TYPE_FORWARD_ONLY) {
          if (skipResults > 0) {
            rs.absolute(skipResults);
          }
        } else {
          for (int i = 0; i < skipResults; i++) {
            if (!rs.next()) {
              return;
            }
          }
        }

        // Get Results
        int resultsFetched = 0;
        while ((maxResults == SqlExecutor.NO_MAXIMUM_RESULTS || resultsFetched < maxResults) && rs.next()) {
          Object[] columnValues = resultMap.resolveSubMap(statementScope, rs).getResults(statementScope, rs);
          callback.handleResultObject(statementScope, columnValues, rs);
          resultsFetched++;
        }
      }
    } finally {
      statementScope.setResultSet(null);
    }
  }

```

handleResults 메소드를 보면 resultMap.resolveSubMap(statementScope, rs).getResults(statementScope, rs) 메소드를 호출하는데 
아래의 메소드는 AutoResultMap.java(com.ibatis.sqlmap.engine.mapping.result 패키지) class의 getResults 메소드를 호출 합니다.

```java

  public synchronized Object[] getResults(StatementScope statementScope, ResultSet rs)
      throws SQLException {
    if (allowRemapping || getResultMappings() == null) {
      initialize(rs);
    }
    return super.getResults(statementScope, rs);
  }

```
super class를 호출하는데 ResultMap.java(com.ibatis.sqlmap.engine.mapping.result 패키지) 여기까지 오면 위에서 보였던 에러코드들이 보이기 시작합니다.

```java

public Object[] getResults(StatementScope statementScope, ResultSet rs)
      throws SQLException {
    ErrorContext errorContext = statementScope.getErrorContext();
    errorContext.setActivity("applying a result map");
    errorContext.setObjectId(this.getId());
    errorContext.setResource(this.getResource());
    errorContext.setMoreInfo("Check the result map.");

    boolean foundData = false;
    Object[] columnValues = new Object[getResultMappings().length];
    for (int i = 0; i < getResultMappings().length; i++) {
      ResultMapping mapping = (ResultMapping) getResultMappings()[i];
      errorContext.setMoreInfo(mapping.getErrorString());
      if (mapping.getStatementName() != null) {
        if (resultClass == null) {
          throw new SqlMapException("The result class was null when trying to get results for ResultMap named " + getId() + ".");
        } else if (Map.class.isAssignableFrom(resultClass)) {
          Class javaType = mapping.getJavaType();
          if (javaType == null) {
            javaType = Object.class;
          }
          columnValues[i] = getNestedSelectMappingValue(statementScope, rs, mapping, javaType);
        } else if (DomTypeMarker.class.isAssignableFrom(resultClass)) {
          Class javaType = mapping.getJavaType();
          if (javaType == null) {
            javaType = DomTypeMarker.class;
          }
          columnValues[i] = getNestedSelectMappingValue(statementScope, rs, mapping, javaType);
        } else {
          Probe p = ProbeFactory.getProbe(resultClass);
          Class type = p.getPropertyTypeForSetter(resultClass, mapping.getPropertyName());
          columnValues[i] = getNestedSelectMappingValue(statementScope, rs, mapping, type);
        }
        foundData = foundData || columnValues[i] != null;
      } else if (mapping.getNestedResultMapName() == null) {
        columnValues[i] = getPrimitiveResultMappingValue(rs, mapping);
        if (columnValues[i] == null) {
          columnValues[i] = doNullMapping(columnValues[i], mapping);
        } else {
          foundData = true;
        }
      }
    }

    statementScope.setRowDataFound(foundData);

    return columnValues;
  }

```
찾아가 보니 여기서는 에러가 발생하지 않았다. 

```java

 private void handleResults(StatementScope statementScope, ResultSet rs, int skipResults, int maxResults, RowHandlerCallback callback) throws SQLException {
    try {
      statementScope.setResultSet(rs);
      ResultMap resultMap = statementScope.getResultMap();
      if (resultMap != null) {
        // Skip Results
        if (rs.getType() != ResultSet.TYPE_FORWARD_ONLY) {
          if (skipResults > 0) {
            rs.absolute(skipResults);
          }
        } else {
          for (int i = 0; i < skipResults; i++) {
            if (!rs.next()) {
              return;
            }
          }
        }

        // Get Results
        int resultsFetched = 0;
        while ((maxResults == SqlExecutor.NO_MAXIMUM_RESULTS || resultsFetched < maxResults) && rs.next()) {
          Object[] columnValues = resultMap.resolveSubMap(statementScope, rs).getResults(statementScope, rs);
          callback.handleResultObject(statementScope, columnValues, rs);
          resultsFetched++;
        }
      }
    } finally {
      statementScope.setResultSet(null);
    }
  }

```

다시 SqlExecutor에 handleResults 메소드를 보면 getResults 후에 callback.handleResultObject 호출 하는데 
RowHandlerCallback.java(com.ibatis.sqlmap.engine.mapping.statement 패키지) class를 보면 
 
```java

  public void handleResultObject(StatementScope statementScope, Object[] results, ResultSet rs) throws SQLException {
    Object object;

    statementScope.setCurrentNestedKey(null);
    object = resultMap.resolveSubMap(statementScope, rs).setResultObjectValues(statementScope, resultObject, results);

    if (object != ResultMap.NO_VALUE) {
      //  XML Only special processing. (converts elements to string for easy insertion).
      int stackDepth = statementScope.getSession().getRequestStackDepth();
      if (stackDepth == 1) {
        Class targetType = statementScope.getResultMap().getResultClass();
        if (XmlTypeMarker.class.isAssignableFrom(targetType)
            && object instanceof Document) {
          object = documentToString((Document) object);
        }
      }

      rowHandler.handleRow(object);
    }
  }

```

setResultObjectValues 메소드를 호출하는데 다시 찾아 보면 AutoResultMap.java(com.ibatis.sqlmap.engine.mapping.result 패키지) class의 setResultObjectValues 호출 

```java

 public Object setResultObjectValues(StatementScope statementScope, Object resultObject, Object[] values) {
    // synchronization is only needed when remapping is enabled
    if (allowRemapping) {
      synchronized (this) {
        return super.setResultObjectValues(statementScope, resultObject, values);
      }
    }
    return super.setResultObjectValues(statementScope, resultObject, values);
  }


```

super 클래스의 setResultObjectValues 메소드 호출 

```java

public Object setResultObjectValues(StatementScope statementScope, Object resultObject, Object[] values) {
    final String previousNestedKey = statementScope.getCurrentNestedKey();
    String ukey = (String)getUniqueKey(statementScope.getCurrentNestedKey(), values);
    Map uniqueKeys = statementScope.getUniqueKeys(this);
    statementScope.setCurrentNestedKey(ukey);
    if (uniqueKeys != null && uniqueKeys.containsKey(ukey)) {
      // Unique key is already known, so get the existing result object and process additional results.
      resultObject = uniqueKeys.get(ukey);
      applyNestedResultMap(statementScope, resultObject, values);
      resultObject = NO_VALUE;
    } else if (ukey == null || uniqueKeys == null || !uniqueKeys.containsKey(ukey)) {
      // Unique key is NOT known, so create a new result object and then process additional results.
      resultObject = dataExchange.setData(statementScope, this, resultObject, values);
      // Lazy init key set, only if we're grouped by something (i.e. ukey != null)
      if (ukey != null) {
        if (uniqueKeys == null) {
          uniqueKeys = new HashMap();
          statementScope.setUniqueKeys(this, uniqueKeys);
        }
        uniqueKeys.put(ukey, resultObject);
      }
      applyNestedResultMap(statementScope, resultObject, values);
    } else {
      // Otherwise, we don't care about these results.
      resultObject = NO_VALUE;
    }

    statementScope.setCurrentNestedKey(previousNestedKey);
    return resultObject;
  }

```  

여기까지 오면 거의 다옴 그럼 여기서 보면 dataExchange.setData 를 호출함  DataExchange 를 상속받은 것이 여러가지가 있는데 
우리가 볼것은 JavaBeanDataExchange.java(com.ibatis.sqlmap.engine.exchange 패키지) class에 setData 메소드

```java

 public Object setData(StatementScope statementScope, ResultMap resultMap, Object resultObject, Object[] values) {
    if (resultPlan != null) {
      Object object = resultObject;

      ErrorContext errorContext = statementScope.getErrorContext();

      if (object == null) {
        errorContext.setMoreInfo("The error occured while instantiating the result object");
        try {
          object = ResultObjectFactoryUtil.createObjectThroughFactory(resultMap.getResultClass());
        } catch (Exception e) {
          throw new RuntimeException("JavaBeansDataExchange could not instantiate result class.  Cause: " + e, e);
        }
      }
      errorContext.setMoreInfo("The error happened while setting a property on the result object.");
      resultPlan.setProperties(object, values);
      return object;
    } else {
      return null;
    }
  }

```

최종 오류는 resultPlan.setProperties 하는 시점에 나온것이다 그럼 찾아 들어가면 AccessPlan.java 도 여러가지 클래스가 구현하고 있는데
EnhancedPropertyAccessPlan.java(com.ibatis.sqlmap.engine.accessplan 패키지) 클래스를 확인 하면

```java

public void setProperties(Object object, Object[] values) {
    bulkBean.setPropertyValues(object, values);
  }

```

net.sf.cglib.beans.BulkBean 클래스에서 값을 셋팅할때 BulkBeanException을 호출 하고 있습니다. 
여기서 해주는 일은 class에 set메소드를 호출하는데 에러가 나는 케이스는 int 값에 null 을 맵핑 할려고 해서 에러가 납니다.

숫자형 float, int은 문제가 생길수가 있다 

# 참조
-----
* [ibatis 2.3.4.726](https://mvnrepository.com/artifact/org.apache.ibatis/ibatis-sqlmap/2.3.4.726)