---
layout: post
title: "이펙티브 c# (5)"
date: 2021-02-03 18:10 +0900
comments: true
tags : ["c#","Effective C#"]
categories : ["c#"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 c#
## 아이템 18: 반드시 필요한 제약 조건만 설정하라

제약 조건은 제네릭 타입에 대해 우리가 가정하고 있는 사실을 컴파일러와 다른 개발자에게 알려주는 용도로 사용된다.
컴파일러에게 제약조건을 알려준다는것은 System.Object에서 노출하는 수준 이상으로 사용할 수 있음을 알려주는것이다.

제네릭 사용시 컴파일러 입장에서 장점

* 제네릭 타입을 작성할때 도움이 된다.
* 제네릭 타입을 사용하는 사용자가 타입 매개변수로 올바른 타입을 지정했는지 컴파일 타임에 확인 가능

제네릭 타입을 작성할 때 필요한 제약 조건이 있다면 반드시 이를 지정하자

제약조건을 최소화 하기 위한 방법

* 제네릭 타입 내에서 반드시 필요한 기능만을 제약 조건으로 설정


## 아이템 19: 런타임에 타입을 확인하여 최적의 알고리즘을 사용하라

제네릭의 인스턴스화는 런타임의 타입을 고려하지 않으며 컴파일타임 타입만 고려한다.

특정타입에 대해 더효율적으로 동작한다고 생각된다면 그냥 그타입을 이용하도록 코드를 작성하라.


## 아이템 20: IComparable[T]와 IComparer[T]를 이용하여 객체의 선후 관계를 정의하라

최신 API는 IComparable을 사용하지만 오래된 API는 IComparer를 사용한다. 따라서 IComparable를 구현할때 IComparer까지 같이 구현해야 한다
```c#
using System;

namespace EffectiveCSharp.Item20
{
	public struct Customer : IComparable<Customer>, IComparable
	{
		private readonly string name;

		public Customer(string name)
		{
			this.name = name;
		}

		public int CompareTo(Customer other) => string.Compare(name, other.name, StringComparison.Ordinal);

		public int CompareTo(object obj)
		{
			if (!(obj is Customer))
			{
				throw new ArgumentException("argument is not Customer");
			}

			var otherCustomer = (Customer) obj;

			return CompareTo(otherCustomer);
		}

		public static bool operator <(Customer left, Customer right) => left.CompareTo(right) < 0;
		public static bool operator >(Customer left, Customer right) => left.CompareTo(right) > 0;
		public static bool operator <=(Customer left, Customer right) => left.CompareTo(right) <= 0;
		public static bool operator >=(Customer left, Customer right) => left.CompareTo(right) >= 0;
	}
}
```

제네릭 버전이 아닌 IComparable 인터페이수 구현을 왜하나?

* 하위 호환성을 위해
* 일부 Base Class Library는 하위 호환성을 요구한다.


# 참조
-----
* [이펙티브 C#](http://www.yes24.com/Product/Goods/55864866)

