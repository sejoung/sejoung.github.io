---
layout: post
title: "이펙티브 c# (2)"
date: 2021-01-26 10:34 +0900
comments: true
tags : ["c#","Effective C#"]
categories : ["c#"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 c#

## 아이템 5: 문화권별로 다른 문자열을 생성하려면 FormattableString을 사용하라

```c#
using System;
using NUnit.Framework;

namespace EffectiveCSharpTest.item5
{
	public class Item5Tests
	{
		[Test]
		public void Test1()
		{
			// 새로운 문자열
			string first = $"It`s the {DateTime.Now.Day} of the {DateTime.Now.Month} month";

			// FormattableString
			FormattableString second = $"It`s the {DateTime.Now.Day} of the {DateTime.Now.Month} month";

			// string or FormattableString
			var third =  $"It`s the {DateTime.Now.Day} of the {DateTime.Now.Month} month";
			
			Console.WriteLine(first);
			Console.WriteLine(second);
			Console.WriteLine(third);
		}
	}
}

```


## 아이템 6: nameof() 연산자를 적극 활용하라

nameof 식은 변수, 형식 또는 멤버의 이름을 문자열 상수로 가져옵니다.

```c#

using System;
using System.Collections.Generic;
using NUnit.Framework;

namespace EffectiveCSharpTest.item6
{
	public class Item6Tests
	{		
		[Test]
		public void Test1()
		{
			Console.WriteLine(nameof(System.Collections.Generic));  // output: Generic
			Console.WriteLine(nameof(List<int>));  // output: List
			Console.WriteLine(nameof(List<int>.Count));  // output: Count
			Console.WriteLine(nameof(List<int>.Add));  // output: Add

			var numbers = new List<int> { 1, 2, 3 };
			Console.WriteLine(nameof(numbers));  // output: numbers
			Console.WriteLine(nameof(numbers.Count));  // output: Count
			Console.WriteLine(nameof(numbers.Add));  // output: Add
			
		}
	}
}


```

nameof를 활용하면 인수 검사 코드를 좀더 쉽게 유지 할수 있다.

```c#
		private string name;

		public string Name
		{
			get => name;
			set => name = value ?? throw new ArgumentNullException(nameof(value), $"{nameof(Name)} cannot be null");
		}
```

nameof 연산자를 활용하면 심볼의 이름을 바꾸거나 수정하는 경우에도 손쉽게 변경사항을 반영할수 있다.

## 아이템 7: 델리게이트를 이용하여 콜백을 표현하라

`Predicate<T>`, `Action<>`, `Func<>` 과 같은형태로 자주쓰는 델리게이트를 정의해 놓고 있다.

* `Action<>` : 매개 변수(T16까지 존재함)가 있고 값을 반환하지 않는 메서드를 캡슐화합니다.

```c#
public delegate void Action<in T>(T obj);

public delegate void Action<in T1,in T2,in T3,in T4,in T5,in T6,in T7,in T8,in T9,in T10,in T11,in T12,in T13,in T14,in T15,in T16>(T1 arg1, T2 arg2, T3 arg3, T4 arg4, T5 arg5, T6 arg6, T7 arg7, T8 arg8, T9 arg9, T10 arg10, T11 arg11, T12 arg12, T13 arg13, T14 arg14, T15 arg15, T16 arg16);
```

* `Predicate<T>` : 매개 변수가 하나이고 bool 값을 반환하는 메서드

```c#
public delegate bool Predicate<in T>(T obj);
```

* `Func<>` : 매개변수가 없거나 존재하며 TResult 타입을 반환하는 메서드

```c#
public delegate TResult Func<out TResult>();

public delegate TResult Func<in T1,in T2,in T3,in T4,in T5,in T6,in T7,in T8,in T9,in T10,in T11,in T12,in T13,in T14,in T15,in T16,out TResult>(T1 arg1, T2 arg2, T3 arg3, T4 arg4, T5 arg5, T6 arg6, T7 arg7, T8 arg8, T9 arg9, T10 arg10, T11 arg11, T12 arg12, T13 arg13, T14 arg14, T15 arg15, T16 arg16);

```
 
LINQ는 위와 같은 개념을 기반으로 만들어 졌다.

모든 델리게이트는 기본적으로 멀티캐스트가 가능하다.
멀티캐스트 델리게이트는 한 번만 호출하면 델리게이트 객체에 추가된 모든 대상 함수가 호출된다.

위와 같은 구조에는 2가지 주의 사항이 있다.

* 예외에 안전하지 않다.
* 마지막으로 호출된 대상 함수의 반환값이 델리게이트의 반환값으로 간주된다.

델리게이트는 런타임에 콜백을 구성하는 최고의 방법이다.

## 아이템 8: 이벤트 호출 시에는 null 조건 연산자를 사용하라


```c#

using System;

namespace EffectiveCSharp.item8
{
	public class EventSource
	{
		private EventHandler<int> Updated;

		public void RaiseUpdates()
		{
			counter++;
			Updated(this, counter);
		}

		private int counter;
	}
}

```

위에 코드에서 `Updated` 값이 null 이면 NullReferenceException이 발생한다.

```c#
		public void RaiseUpdates()
		{
			counter++;
			if (Updated != null)
				Updated(this, counter);
		}

```

간단하게 수정해보면 null 체크를 넣어 주면 된다 위에서도 오류가 발생할수 있는데 멀티 쓰레드 환경에서 null 체크를 통과한 
동시에 다른 쓰레드에서 Updated 레퍼런스를 null 로 치환 해버리면 또 오류가 날수있다.

```c#
		public void RaiseUpdates()
		{
			counter++;
			var handler = Updated;
			if (handler != null)
				handler(this, counter);
		}

```

위에 코드가 c#에서 권장하는 코드이다.

```c#
		public void RaiseUpdates()
		{
			counter++;
			Updated?.Invoke(this, counter);
		}


```

null 조건 연산자를 통해서 간단하게 변경시킨 코드이다.

c# 컴파일러는 모든 델리게이트와 이벤트에 대해 Invoke 메서드를 타입 안정적 형태로 생성해 주므로 이 메소드를 호출하는 것은 ()를 이용하여 이벤트를 발생시키는 코드와 같은 코드이다.


## 아이템 9: 박싱과 언박싱을 최소화하라

박싱 : 값 타입의 객체를 타입이 정해져 있지 않은 임의의 참조 타입 내부에 포함시키는 방법
언박싱 : 박싱되어 있는 참조 타입의 객체로부터 값 타입 객체의 복사본을 가지고 오는 방법

박싱과 언박싱은 성능에 좋지 않은 영향을 미친다. 때로는 박싱과 언박싱이 수행되는 과정에서 임시 객체가 생성되기도 하는데, 간혹 이로 인해 예상치 못한 버그가 발생하기도 한다.

대부분의 경우 제네릭 클래스와 제네릭 메서드를 사용하면 박싱과 언박싱을 피할 수 있다.

```c#
using System;
using System.Collections.Generic;
using EffectiveCSharp.item9;
using NUnit.Framework;

namespace EffectiveCSharpTest.item9
{
	public class Item9Tests
	{
		[Test]
		public void Test1()
		{

			int i = 25;
			object o = i;//박싱

			Console.WriteLine(o.ToString());
		}
		
		[Test]
		public void Test2()
		{
			object firstParm = 5;
			object o = firstParm;
			int i = (int) o; //언박싱
			Console.WriteLine(o.ToString());
		}
		
		[Test]
		public void Test3()
		{

			var attendees = new List<Person>();

			Person p = new Person {Name = "Old Name"};
			attendees.Add(p);

			Person p2 = attendees[0];
			p2.Name = "New Name";

			Console.WriteLine(attendees[0].ToString());
			
		}

	}
	
}

```

# 참조
-----
* [이펙티브 C#](http://www.yes24.com/Product/Goods/55864866)
