---
layout: post
title: "이펙티브 c# (3)"
date: 2021-02-01 17:55 +0900
comments: true
tags : ["c#","Effective C#"]
categories : ["c#"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 c#

## 아이템 10: 베이스 클래스가 업그레이드된 경우에만 new 한정자를 사용하라

```c#
namespace EffectiveCSharp.Item10
{
	public class BaseV
	{
		public virtual void Invoke() {
			Console.WriteLine("BaseC");
		}
	}

	public class BaseOverride : BaseV
	{
		public override void Invoke()
		{
			Console.WriteLine("BaseCOverride");
		}
	}
}


```

override 키워드는 virtual 선언된 멤버를 재정의 할때 쓸수있다.


```c#
namespace EffectiveCSharp.Item10
{
	public class BaseC
	{
		public int x;
		public void Invoke() {
			Console.WriteLine("BaseC");
		}
	}

	public class DerivedC : BaseC
	{
		new public void Invoke() {
			Console.WriteLine("derivedC");
		}
	}
	
}


```

new 한정자는 virtual로 선언되지 않은 멤버를 재정의 할때 쓸수있다.

하지만 위처럼 코드를 작성하면 혼돈스러울 수 밖에 없다 동일한 객체를 이용하여 동일한 메서드를 호출했는데 다른 작업이 실행되는것은 일관성이 없다.

new 한정자를 사용해도 좋은 경우는 베이스 클래스에서 이미 사용하고 있는 메서드를 재정의해서 새로운 베이스클래스를 만들때 정도이다.

new 한정자를 남발하면 메서드를 호출할 때 상당히 모호한 상황이 발생할수 있다.


## 아이템 11: .NET 리소스 관리에 대한 이해

닷넷 가비지 컬렉터는 응용프로그램 최상위 객체로 부터 참조 트리를 구성하여 도달 가능한 객체를 살아있는 객체로 판단하며 도달 불가능한 객체를 가비지로 간주한다.

GC가 수행되면 콤팩트 작업을 수행한다. 콤팩트 작업이란 사용중인 객체들을 한쪽으로 차곡차곡 옮겨서 조각난 가용 메모리를 단일의 큰 메모리공간으로 만드는 과정을 말한다.

.Net은 비관리 리소스의 생명주기에 대해서도 개발자가 더 손쉽게 관리할 수 있도록 finalizer 와 IDisposable 인터페이스라는 두가지 메커니즘을 제공한다.

C# 에서는 finalizer를 가능하면 사용하지 않아야 하면 finalizer 필요한 구조를 회피해야 된다. finalizer는 언젠가 호출될것을 보장하지만 그것이 지금당장은 아니다.


## 아이템 12: 할당 구문보다 멤버 초기화 구문이 좋다


```c#

using System.Collections.Generic;

namespace EffectiveCSharp.Item12
{
	public class MyClass
	{
		private List<string> labels;

		//할당구문
		public MyClass(List<string> labels)
		{
			this.labels = labels;
		}
	}
	//초기화 구문	
	public class MyClass2
	{
		private List<string> labels = new List<string>();
	}
}

```

할당 구분을 사용하면 타입에 몇개의 생성자를 추가하든 상관없이 맴버변수를 올바르게 초기화할 수 있다.

위처럼 할당 구문을 사용하면 size를 선언하는 list가 생기는 동시에 초기화 한 맴버변수는 가비지 컬렉션 대상이 된다. 하지만 아래처럼 불필요한 코드 같은 컴파일이 된다.

맴버 초기화 구분 대신 생성자 본문에 코드를 두는것이 좋은 경우

* 객체를 0이나 null로 초기화 하는경우(컴파일러가 0이나 null로 초기화 해주는데 두번 초기화 하는 꼴이다.)

* 객체를 반복해서 초기화 하는경우

```c#

	public class MyClass2
	{
		private List<string> labels = new List<string>();

		public MyClass2()
		{
		}

		public MyClass2(int size)
		{
			labels = new List<string>(size);
		}
	}


```
위같은 코드가 컴파일을 거치면 아래와 비슷한 코드로 바뀐다.
```c#

	public class MyClass2
	{
		private List<string> labels;

		public MyClass2()
		{
			labels = new List<string>();
		}

		public MyClass2(int size)
		{
			labels = new List<string>();
			labels = new List<string>(size);
		}
	}

```
* 예외처리가 반드시 필요한 경우(맴버 초기화 코드는 try로 감쌀수 없기때문이다.)


# 참조
-----
* [이펙티브 C#](http://www.yes24.com/Product/Goods/55864866)

