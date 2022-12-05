---
layout: post
title: "이펙티브 c# (1)"
date: 2021-01-25 11:35 +0900
comments: true
tags : ["c#","Effective C#"]
categories : ["c#"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 c#
## 아이템1: 지역변수를 선언할 때는 var를 사용하는 것이 낫다.

코드를 읽을때 타입을 명시적으로 드러내야 하는 경우가 아니라면 var를 사용하는것이 더 좋을수도 있다.
다만 내장 숫자 타입(int,float,double 등..)을 선언할 때는 명시적으로 타입을 선언하는 편이 낫다.

## 아이템 2: const보다는 readonly가 좋다

C#은 컴파일타임 상수와 런타임 상수 두 유형의 상수를 가진다. 컴파일 타임 상수보단 런타임상수를 사용하라. 
컴파일 타임상수가 약간 더 빠르긴 하지만 런타임상수보단 유연성이 떨어진다.
컴파일 타임상수는 성능이 매우 중요하고 상수의 값이 절대로 바뀌지 않을경우에만 제한적으로 사용하는게 좋다.

컴파일타임 상수는 내장된 숫자형, enum, null에 대해서만 사용될수 있다. 이는 내장 자료형이여야지만 컴파일타임에 상수로 리터럴을 대체할수 있기 때문이다.

런타임 상수는 생성자에서 초기화될 수 있으며 그이후에는 수정될수 없다. 또 그값이 런타임에 할당된다는 면에서 컴파일 타임 상수와는 다르다.

## 아이템 3: 캐스트보다는 is, as가 좋다

C#에서 형변환을 수행하는 방법에는 as 연사자를 사용하는 방법과 컴파일러의 캐스트 연산자 구분을 사용하는 2가지 방법이 있따.

더 방어적인 코드를 작성하려는 경우에는 우선 is 연산자로 형변환이 가능한지 확인한 후에 실제 형변환을 수행하도록 코드를 작성할수 있다.

as 연산자와 캐스팅의 가장 큰 차이는 사용자 정의 형변환을 어떻게 다루는가 하는 점이다.

as와 is 연산자는 런타임에 객체의 타입을 확인하고 필요에 따라 박싱을 수행하는 것을 제외하고 어떠한 작업도 수행하지 않는다.
임의의 객체를 다른 타입으로 형변환하려면 이객체는 지정한 타입이거나 혹은 지정한 타입을 상속한 타입이여야 한다.

캐스팅을 사용하는 경우에는 객체를 지정한 타입으로 변환하기 위해서 형변환 연산자가 개입될 수 있다.

```c#

using System;

namespace EffectiveCSharp.Item2
{
	public abstract class Animal
	{
		private readonly string name;

		protected Animal(string name)
		{
			this.name = name;
		}

		private Animal()
		{
		}

		public void Saying()
		{
			Console.WriteLine(name);
		}
	}
}

```

```c#
namespace EffectiveCSharp.Item2
{
	public class Cat : Animal
	{
		public Cat(string name) : base(name)
		{
		}
	}
}

```


```c#
namespace EffectiveCSharp.Item2
{
	public class Dog : Animal
	{
		public Dog(string name) : base(name)
		{
			
		}
		
	}
}

```


```c#
using System;
using EffectiveCSharp.Item2;
using NUnit.Framework;

namespace EffectiveCSharpTest
{
	public class Tests
	{
		[Test]
		public void Test1()
		{
			Animal animal = new Dog("멍멍이");

			if (animal is Dog)
			{
				if (animal != null)
				{
					animal.Saying();
				}
			}


			Assert.Pass();
		}


		[Test]
		public void Test2()
		{
			Animal animal = new Cat("야옹");
			Dog dog = animal as Dog;

			if (dog != null)
			{
				dog.Saying();
			}

			Assert.Pass();
		}

		[Test]
		public void Test3()
		{
			Animal animal = new Dog("멍멍이");
			Dog dog = (Dog) animal;

			if (dog != null)
			{
				dog.Saying();
			}

			Assert.Pass();
		}

		[Test]
		public void Test4()
		{
			Animal animal = new Cat("야옹");

			Assert.Throws(typeof(InvalidCastException), delegate
			{
				Dog dog = (Dog) animal;
			});
		}

		[Test]
		public void Test5()
		{
			double num = 12.12;
			Assert.AreEqual(12,(int) num);
		}
	}
}

```

## 아이템 4: string.Format()을 보간 문자열로 대체하라


`String.Format` API는 문자열 변환을 잘수행하지만 생성된 문자열을 직접 출력해보고 올바른 형태인지를 눈으로 직접하기 전까지는 코드를 제대로 작성했는지 짐작하기 어려웠다.
이유는 포맷문자열에 나타난 인자 갯수와 실제로 전달되는 인자 개수가 정확히 일치하는지 확인하지 않는다.

문자열 보간기능을 사용할 때는 String.Format 구현시 사용한 라이브러리를 거의 동일하게 사용할수 있다.

# 참조
-----
* [이펙티브 C#](http://www.yes24.com/Product/Goods/55864866)
* [Local Variable Type Inference: Style Guidelines](https://openjdk.java.net/projects/amber/LVTIstyle.html)
* [String.Format 메서드](https://docs.microsoft.com/ko-kr/dotnet/api/system.string.format?view=net-5.0)