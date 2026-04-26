---
layout: post
title: "이펙티브 c# (6)"
date: 2021-02-10 09:30 +0900
comments: true
tags : ["c#","Effective C#"]
categories : ["c#"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 c#
## 아이템 21: 타입 매개변수가 IDisposable을 지원할 경우를 대비하여 제네릭 클래스를 작성하라

### 제네릭의 역활

* 런타임 오류가 발생할 가능성이 있는 부분을 컴파일 타임 오류로 대체 가능
* 타입 매개변수로 사용할 수있는 타입을 명확히 규정하여 사용자에게 도움을 준다.

타입 매개변수로 지정하는 타입이 IDisposable을 구현하고 있다면 특별한 추가 작업이 반드시 필요하다.

### 타입 매개변수로 인스턴스를 생성한 경우

```c#

namespace EffectiveCSharp.Item21
{
	public interface IEngine
	{
		void DoWork();
	}

	public class EnginDriverOne<T> where T : IEngine, new()
	{
		public void GetThingDone()
		{
			T driver = new T();
			driver.DoWork();
		}
	}
}

```

위에 코드에서 T 타입이 IDisposable을 구현하고 있다면 매모리 누수가 발생할수 있다

```c#

using System;

namespace EffectiveCSharp.Item21
{
	public interface IEngine
	{
		void DoWork();
	}

	public class EnginDriverOne<T> where T : IEngine, new()
	{
		public void GetThingDone()
		{
			T driver = new T();

			using (driver as IDisposable)
			{
				driver.DoWork();	
			}
			
		}
	}
}

```
위처럼 간단한 관용구로 메모리 누수를 해결할수 있다. 타입 매개변수를 사용하여 인스턴스를 생성했다면 using 구문을 반드시 사용하자

### 타입 매개변수로 멤버 변수를 선언한 경우

```c#

using System;

namespace EffectiveCSharp.Item21
{
	public class EnginDriverTwo<T> : IDisposable where T : IEngine, new()
	{
		private Lazy<T> driver = new(()=> new T());
		
		public void GetThingDone() => driver.Value.DoWork();
		
		public void Dispose()
		{
			if (driver.IsValueCreated)
			{
				var resource = driver.Value as IDisposable;
				resource?.Dispose();
			}
		}
	}
}

```

타입 매개변수로 맴버 변수를 선언하면 IDisposable을 상속 받아서 Dispose를 구현해주면 된다.


### sealed 를 활용한 제한

```c#
namespace EffectiveCSharp.Item21
{
	public sealed class EnginDriver<T> where T : IEngine
	{
		private T driver;

		public EnginDriver(T driver)
		{
			this.driver = driver;
		}

		public void GetThingDone()
		{
			driver.DoWork();
		}
	}
}
```

sealed를 사용하면 파생 클래스를 생성할수 없으므로 Dispose를 구현하지 않아도 된다.


# 참조
-----
* [이펙티브 C#](http://www.yes24.com/Product/Goods/55864866)

