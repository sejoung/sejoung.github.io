---
layout: post
title: "도메인 주도 설계 구현-DDD를 시작하며(2)"
date: 2020-06-22 09:08 +0900
comments: true
tags : ["Implementing Domain-Driven Design"," 도메인 주도 설계 구현","DDD를 시작하며"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 도메인 주도 설계 구현

## DDD를 시작하며

### DDD가 해줄수 있는 일

* DDD는 도메인 전문가와 소프트웨어 개발자가 비즈니스 전문가의 심적 모델을 반영한 소프트웨어를 함께 개발할 수 있게 해준다.
이팀은 도메인 전문가와 소프트웨어 개발자를 모두 포함하고 절대로 우리와 그들을 나누지 않는다.

* DDD는 비즈니스의 전략적 이니셔티브(initiative)를 다룬다.

* DDD는 실행가능한 소프트웨어 상품을 분석하고 개발하는 전술적 설계 모델링 도구를 사용해 실제 소프트웨어의 기술적 요구에 응한다.

### 도메인 복잡성과 씨름하기

우선은 DDD는 가장 중요한 영역에서 부터 사용해 나가야 한다.

### 왜 무기력증이 일어나는가

절차적 프로그래밍 사고방식을 사용해서? 그것은 첫 번째 이유가 아니다.

우리의 산업은 샘플 코드를 따라 만드는 사람들이 많고 샘플에 품질이 좋으면 문제가 되지 않는다.
애플리케이션 프로그래밍 인터페이스 기능을 설명하기 위해 가능한 가장 단순한 방법으로 샘플 코드를 짜는데 
많은 수의 세터 게터가 나타나고 이런 코드를 매일같이 복사해서 사용된다.

자바빈 표준이 등장하고 무분별하게 퍼블링 인터페이스를 도출하게 되면서 온통 무기력증에 빠졌다.
오늘날 시장의 거의 모든 프레임워크는 단순한 객체에 퍼블릭 속성을 사용하길 요구하는 동시에 권장하고 있다.

### 무기력증이 당신의 모델에 한 일을 보라


```java

 @Transactional
    public void saveCustomer(String customerId, String customerFirstName, String customerLastName,
        String streetAddress1, String streetAddress2, String city, String stateOrProvince,
        String postalCode, String country, String homePhone, String mobilePhone,
        String primaryEmailAddress, String secondaryEmailAddress) {

        Customer customer = customerDao.readCustomer(customerId);

        if (Objects.isNull(customer)) {
            customer = new Customer();
            customer.setCustomerId(customerId);
        }

        customer.setCustomerFirstName(customerFirstName);

        customer.setCustomerLastName(customerLastName);

        customer.setStreetAddress1(streetAddress1);
        customer.setStreetAddress2(streetAddress2);
        customer.setCity(city);
        customer.setStateOrProvince(stateOrProvince);
        customer.setPostalCode(postalCode);
        customer.setCountry(country);
        customer.setHomePhone(homePhone);
        customer.setMobilePhone(mobilePhone);
        customer.setPrimaryEmailAddress(primaryEmailAddress);
        customer.setSecondaryEmailAddress(secondaryEmailAddress);
    }

```

위의 코드의 문제점

* 전혀 의도가 없다.
* 구현 자체가 복잡도를 높힌다.
* Customer는 객체가 아니다. 데이터 홀더일 뿐이다.

무기력증으로 인한 기억상실



# 참조
-----
* [implementing-domain-driven-design](https://www.oreilly.com/library/view/implementing-domain-driven-design/9780133039900/)

