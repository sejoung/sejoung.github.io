---
layout: post
title: "Spring Dynamic DataSource Routing"
date: 2021-04-22 21:08 +0900
comments: true
tags : ["spring boot","AbstractRoutingDataSource","Dynamic DataSource Routing"]
categories : ["java"]
sitemap :
changefreq : daily
priority : 1.0
--->
# Spring Dynamic DataSource Routing(AbstractRoutingDataSource)

AbstractRoutingDataSource.java 클래스에 abstract 메소드로 determineCurrentLookupKey 존재한다.

```java
public abstract class AbstractRoutingDataSource extends AbstractDataSource implements InitializingBean {

    @Override
    public Connection getConnection() throws SQLException {
        return determineTargetDataSource().getConnection();
    }

    @Override
    public Connection getConnection(String username, String password) throws SQLException {
        return determineTargetDataSource().getConnection(username, password);
    }

    protected DataSource determineTargetDataSource() {
        Assert.notNull(this.resolvedDataSources, "DataSource router not initialized");
        Object lookupKey = determineCurrentLookupKey();
        DataSource dataSource = this.resolvedDataSources.get(lookupKey);
        if (dataSource == null && (this.lenientFallback || lookupKey == null)) {
            dataSource = this.resolvedDefaultDataSource;
        }
        if (dataSource == null) {
            throw new IllegalStateException("Cannot determine target DataSource for lookup key [" + lookupKey + "]");
        }
        return dataSource;
    }
    @Nullable
    protected abstract Object determineCurrentLookupKey();
}
```
대충 코드를 보면 위와같은 내용인데 getConnection 할때 determineCurrentLookupKey를 통해 resolvedDataSources 데이터에 있는 connection을 찾아서 해당 커넥션을 넘기는 방법이다.

그럼 간단한 예제를 보면 이해하기 쉬울것이다.

```java
public enum RoutingDataSourceLookupKey{
    READ,WRITE
}

public class ReplicationRoutingDataSource extends AbstractRoutingDataSource {

    @Override
    protected Object determineCurrentLookupKey() {
        return TransactionSynchronizationManager.isCurrentTransactionReadOnly() ? RoutingDataSourceLookupKey.READ : RoutingDataSourceLookupKey.WRITE;
    }
}

@Configuration
public class DataSourceConfigration{
    @Bean
    @ConfigurationProperties(prefix = "test.datasource-read")
    public DataSource readDataSource() {
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }

    @Bean
    @ConfigurationProperties(prefix = "test.datasource-write")
    public DataSource writeDataSource() {
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }

    @DependsOn({"readDataSource","writeDataSource"})
    @Bean
    public DataSource routingDataSource(DataSource writeDataSource, DataSource readDataSource) {

        var routingDataSource = new ReplicationRoutingDataSource();
        var dataSourceMap = new HashMap<>();
        dataSourceMap.put(RoutingDataSourceLookupKey.WRITE, writeDataSource);
        dataSourceMap.put(RoutingDataSourceLookupKey.READ, readDataSource);
        routingDataSource.setTargetDataSources(dataSourceMap);
        routingDataSource.setDefaultTargetDataSource(readDataSource);

        return routingDataSource;
    }
    
    @DependsOn("routingDataSource")
    @Primary
    @Bean
    public DataSource dataSource(@Qualifier("routingDataSource") DataSource routingDataSource) {
        return new LazyConnectionDataSourceProxy(routingDataSource);
    }
}

@Configuration
public class JpaDataSourceConfigration {

    @Bean
    @ConfigurationProperties("spring.jpa")
    public JpaProperties jpaProperties() {
        return new JpaProperties();
    }

    @Bean
    @ConfigurationProperties("spring.jpa.hibernate")
    public HibernateProperties hibernateProperties() {
        return new HibernateProperties();
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource,
        JpaProperties jpaProperties, HibernateProperties hibernateProperties) {

        LocalContainerEntityManagerFactoryBean entityManagerFactory = new LocalContainerEntityManagerFactoryBean();
        entityManagerFactory.setDataSource(dataSource);
        entityManagerFactory.setPersistenceProvider(new HibernatePersistenceProvider());
        entityManagerFactory.setPersistenceUnitName("entityManagerUnit");
        entityManagerFactory.setPackagesToScan("io.lific.product.infrastructure.jpa");
        HibernateJpaVendorAdapter jpaVendorAdapter = new HibernateJpaVendorAdapter();
        jpaVendorAdapter.setGenerateDdl(jpaProperties.isGenerateDdl());
        jpaVendorAdapter.setShowSql(jpaProperties.isShowSql());
        if (jpaProperties.getDatabase() != null) {
            jpaVendorAdapter.setDatabase(jpaProperties.getDatabase());
        }
        if (jpaProperties.getDatabasePlatform() != null) {
            jpaVendorAdapter.setDatabasePlatform(jpaProperties.getDatabasePlatform());
        }
        var properties= jpaProperties.getProperties();
        properties.put("hibernate.physical_naming_strategy", hibernateProperties.getNaming().getPhysicalStrategy());
        properties.put("hibernate.implicit_naming_strategy", hibernateProperties.getNaming().getImplicitStrategy());
        properties.put("hibernate.hbm2ddl.auto",hibernateProperties.getDdlAuto());
        jpaProperties.setOpenInView(jpaProperties.getOpenInView());
        entityManagerFactory.setJpaVendorAdapter(jpaVendorAdapter);
        entityManagerFactory.setJpaPropertyMap(properties);
        entityManagerFactory.afterPropertiesSet();

        return entityManagerFactory;
    }

    @Bean
    public PlatformTransactionManager transactionManager(EntityManagerFactory entityManagerFactory) {
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(entityManagerFactory);
        return transactionManager;
    }

    @Bean
    public PersistenceExceptionTranslationPostProcessor exceptionTranslationPostProcessor() {
        return new PersistenceExceptionTranslationPostProcessor();
    }
}


```

위와같은 방법으로도 처리를 할수있다.

`LazyConnectionDataSourceProxy` 를 꼭 해줘야 `TransactionSynchronizationManager.isCurrentTransactionReadOnly()` 값을 정확하게 읽어 드릴수 있다.



# 참고자료
* [spring dynamic-datasource-routing](https://spring.io/blog/2007/01/23/dynamic-datasource-routing)
* [권남님 위키](https://kwonnam.pe.kr/wiki/springframework/abstractroutingdatasource)  
* [sollabs AbstractRoutingDataSource](https://www.sollabs.tech/AbstractRoutingDataSource)
