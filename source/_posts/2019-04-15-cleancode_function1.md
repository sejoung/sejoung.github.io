---
layout: post
title: "클린코드(함수)1"
date: 2019-04-15 09:00 +0900
comments: true
tags : ["클린코드","cleancode"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 클린코드

### 함수

#### 작게 만들어라

다시 말해 if 문과 while 문등에 들어가는 블록은 한줄이여야 된다. 함수는 중첩구조가 생길만큼 커져서는 안된다.

#### 한 가지만 해라

함수는 한가지만 해야 된다 

#### 함수당 추상화 수준은 하나로

내려가기 규칙 코드는 위에서 아래로 이야기처럼 읽혀야 된다. 한함수 다음에는 추상화 수준이 낮은 함수가온다.

#### switch 문 

스위치문은 작게 만들기 어렵다.

```java

package com.github.sejoung.function;

public class Patroll {

	private final static int COMMISSIONED = 1;

	private final static int HOURLY = 2;

	private final static int SALARIED = 3;


	public Money calculatePay(Employee e) throws InvalidEmployeeTypeException {
		switch (e.type) {

			case COMMISSIONED:
				return calculateCommissionedPay(e);
			case HOURLY:
				return calculateHourlyPay(e);
			case SALARIED:
				return calculateSalariedPay(e);

			default:
				throw new InvalidEmployeeTypeException(e.type);
		}
	}


	private Money calculateCommissionedPay(Employee e) {
		return new Money();
	}


	private Money calculateHourlyPay(Employee e) {
		return new Money();
	}


	private Money calculateSalariedPay(Employee e) {
		return new Money();
	}

}


```


위에 calculatePay 함수는 몇가지 문제점이 있다.

* 함수가 길다. 새직원을 추가하면 더 길어진다.

* 한가지 작업만 수행하지 않는다.

* SRP 원칙을 위반한다. 코드를 변경할 이유가 여럿이다.

* OCP 원칙을 위반한다. 새직원을 추가할때마다 코드를 변경한다.


```java

package com.github.sejoung.function.switch2;

import com.github.sejoung.function.switch1.Money;

public abstract class Employee {
	public abstract boolean isPayday();
	public abstract Money calculatePay();
	public abstract void deliverPay(Money pay);
}


```

```java

package com.github.sejoung.function.switch2;

import com.github.sejoung.function.switch1.InvalidEmployeeTypeException;

public interface EmployeeFactory {
	public Employee makeEmployee(EmployeeRecord r) throws InvalidEmployeeTypeException;
}


```


```java

package com.github.sejoung.function.switch2;

import com.github.sejoung.function.switch1.InvalidEmployeeTypeException;

public class EmployeeFactoryImpl implements EmployeeFactory {

	private final static int COMMISSIONED = 1;

	private final static int HOURLY = 2;

	private final static int SALARIED = 3;


	public Employee makeEmployee(EmployeeRecord r) throws InvalidEmployeeTypeException {
		switch (r.type) {
			case COMMISSIONED:
				return new CommissionedEmployee();
			case HOURLY:
				return new HourlyEmployee();
			case SALARIED:
				return new SalariedEmployee();
			default:
				throw new InvalidEmployeeTypeException(r.type);
		}
	}

}


```

밥 아저씨가 참을수있는 스위치문 사용법


# 참조
-----

