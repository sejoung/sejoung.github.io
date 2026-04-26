---
layout: post
title: "이펙티브 c# (4)"
date: 2021-02-02 10:47 +0900
comments: true
tags : ["c#","Effective C#"]
categories : ["c#"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 c#
## 아이템 13: 정적 클래스 멤버를 올바르게 초기화하라

정적 멤버 변수 초기화 하는 방법엔 2가지

* 정적 멤버 초기화 구분


```c#
namespace EffectiveCSharp.Item13
{
	public class MySingletonStaticMember
	{
		private static readonly MySingletonStaticMember theOneAndOnly = new MySingletonStaticMember();

		public static MySingletonStaticMember TheOneAndOnly => theOneAndOnly;

		private MySingletonStaticMember()
		{
		}
		
	}
}
```

* 정적 생성자: 타입내에 정의된 모든 메서드, 변수, 속성에 최초로 접근하기 전에 자동으로 호출되는 특이한 메서드다.

```c#
namespace EffectiveCSharp.Item13
{
	public class MyStaticConstructor
	{
		private static readonly MyStaticConstructor theOneAndOnly;

		static MyStaticConstructor()
		{
			theOneAndOnly = new MyStaticConstructor();
		}

		public static MyStaticConstructor TheOneAndOnly => theOneAndOnly;

		private MyStaticConstructor()
		{
			
		}
	}
}
```

## 아이템 14: 초기화 코드가 중복되는 것을 최소화하라


```c#
using System;
using System.Collections.Generic;

namespace EffectiveCSharp.Item14
{
	public class MyClass
	{
		private List<ImportantData> coll;

		private string name;
		

		public MyClass() : this(0,string.Empty)
		{
		}

		public MyClass(int initialCount = 0, string name = "")
		{
			coll = initialCount > 0 ? new List<ImportantData>(initialCount) : new List<ImportantData>();
			this.name = name;
		}
		
	}

	public record ImportantData
	{
		public string Name { get; }
		public DateTime RegsterDateTime { get; }
	}
}
```

위처럼 하면 여러개의 생성자를 만들지 않아도 된다. 기본값을 갖는 매개변수를 취하는 생성자를 작성할때 몇가지 트레이드 오프를 고려해야 함

* 기본값을 갖는 매개변수는 사용자에게 더 많은 옵션을 제공한다
* 클래스에 멤버 변수를 추가하고 또 이를 초기화 하기 위해 생성자를 추가하다 보면 다양한 조합의 생성자를 만들어야 하는데 이로 인해 코드량이 늘수있는 것을 최소화 할수있다.
* 기본 생성자를 `public MyClass()` 라고만 작성해도 유효한 코드가 된다 하지만 어떠한 경우에도 제한없이 사용하려면 `public MyClass() : this(0,string.Empty)` 이처럼 명시하는것이 좋다.

`public MyClass(int initialCount = 0, string name = "")` 여기서 `string.Empty`를 사용하지 않고 `""` 을 사용한것은 매개 변수의 기본값으로 컴파일 타임 상수만 사용할수 있기 때문이다.
`string.Empty`는 정적속성이다.

특정타입으로 첫 번째 인스턴스를 생성할 때 수행되는 과정

1단계 : 정적 변수의 저장 공간을 0으로 초기화 => 2단계 : 정적 변수에 대한 초기화 구문실행 => 3단계 : 베이스 클래스의 정적 생성자 수행 => 4단계 : 정적 생성자 수행 
=> 5단계 : 인스턴스 변수의 저장 공간을 0으로 초기화 => 6단계 : 인스턴스 변수에 대한 초기화 구문 수행 => 7단계 : 적절한 베이스 클래스의 인스턴스 생성자 수행 => 8단계 : 인스턴스 생성자 수행

클래스 자체의 초기화 작업은 한번만 이뤄지기 때문에 동일한 타입으로 추기 인스턴스를 생성하면 5단계부터 수행된다.
또한 컴파일러가 생성자 내에 중복된 멤버 초기화 코드를 생성하지 않도록 6단계와 7단계는 최적화 되어 있다.

## 아이템 15: 불필요한 객체를 만들지 말라

gc가 과도하게 동작하지 않도록 주의해야 된다. 지역변수의 경우 그 변수를 선언한 메서드를 벗어나는 순간 가비지가 되어 더 이상 살아있는 객체로 간주 되지 않는다.

자주 호출되는 메소드의 지역변수를 맴버 변수로 변동하는것도 불필요한 객체를 생성하지 않는 좋은 방법이다. 맴버 변수로 선언 했을때는 Dispose 패턴을 구현해야 될수도 있다.

객체 생성을 최소화 하는 방법

* 지역변수를 맴버 변수로 선언
* 종속성 삽입(DI)을 활용하여 자주 사용되는 객체를 생성했다가 이를 재활용하는 것이다.
* immutable 타입을 잘 활용 하자(예 : string 타입) - 변경불가능 타입을 제공할때는 변경가능한 타입도 같이 제공하는것을 고려

## 아이템 16: 생성자 내에서는 절대로 가상 함수를 호출하지 말라


```c#
using System;

namespace EffectiveCSharp.Item16
{
	public class B
	{
		public B()
		{
			VFunc();
		}

		protected virtual void VFunc()
		{
			Console.WriteLine("VFunc in B");
		}
	}

	public class Derived : B
	{
		private readonly string msg = "Set by initializer";

		public Derived(string msg)
		{
			this.msg = msg;
		}

		protected override void VFunc()
		{
			Console.WriteLine(msg);
		}
	}
}
```

```c#
using EffectiveCSharp.Item16;
using NUnit.Framework;

namespace EffectiveCSharpTest.Item16
{
	public class Tests
	{
		[Test]
		public void Test1()
		{

			var d = new Derived("Constructed in main");

			
		}

	
	}
}
```

위에 코드에서는 `Set by initializer` 가 print 된다.

베이스 클래스의 생성자 내에서 가상 함수를 호출하면 파생 클래스가 가상함수를 어떻게 구현했는지에 따라 민감하게 반응 한다.

```c#

using System;

namespace EffectiveCSharp
{
	
	
	abstract class B
	{
		protected B()
		{
			VFunc();
		}

		protected abstract void VFunc();
	
	}

	 class Derived : B
	{
		private readonly string msg = "Set by initializer";

		public Derived(string msg)
		{
			this.msg = msg;
		}

		protected override void VFunc()
		{
			Console.WriteLine(msg);
		}
		
		public static void Main(string[] args)
		{
			var d = new Derived("ok");
		}
	}
	
}

```

생성자에서 가상함수를 호출해도 되는 유일한 경우는 파생클래스가 기본 생성자만을 정의하고 있고 다른 어떤 생성자도 가지고 있지 않은 경우뿐이다.

## 아이템 17: 표준 Dispose 패턴을 구현하라

앞서 비관리 리소스를 포함하는 객체는 정리 작업이 매우 중요함 이런 정리작업을 도와주는 패턴이 Dispose 패턴 이다.

타입을 작성할 때 이 패턴을 이용하면 개발자들에게 IDisposable 인터페이스를 통해서 리소스를 삭제할 수 있는 기능을 안정적으로 제공할 수 있다.

상속시 최상위 베이스 클래스의 작업

* 리소스를 정리하기 위해서 IDisposable 인터페이스를 구현해야 한다.
* 멤버 필드로 비관리 리소스를 포함하는 경우에 한해 방어적으로 동작할 수 있도록 finalizer를 추가해야 한다.
* Dispose와 finalizer는 실제 리소스 정리 작업을 수행하는 다른 가상 메서드에 작업을 위임하도록 작성되야 한다. 파생 클래스가 고유의 리소스 정리 작업이 필요한 경우 이 가상 메서드를 재정의할 수 있도록 하기 위함이다.

```c#
using System;

namespace EffectiveCSharp.Item17
{
	public class MyResourceHog : IDisposable
	{
		private bool alreadyDisposed = false;

		public void Dispose()
		{
			Dispose(true);
			GC.SuppressFinalize(this);
		}

		protected virtual void Dispose(bool isDisposing)
		{
			if (alreadyDisposed)
			{
				return;
			}

			if (isDisposing)
			{
				// 관리 리소스 정리
			}
			
			// 비관리 리소스 정리

			alreadyDisposed = true;
		}

		public void ExampleMethod()
		{
			if (alreadyDisposed)
			{
				throw new ObjectDisposedException("MyResourceHog", "Called Example Method on Disposed object");
			}
		}
	}
}
```

파생 클래스의 작업

* 파생 클래스가 고유의 리소스 정리 작업을 수행해야 한다면 베이스 클래스에서 정의한 가상 메서드를 재정의 한다.
* 멤버 필드로 비관리 리소스를 포함하는 경우에만 finalizer를 추가한다.
* 베이스 클래스에서 정의하고 있는 가상함수를 반드시 재 호출해야 한다.


```c#
namespace EffectiveCSharp.Item17
{
	public class DrivedResourceHog : MyResourceHog
	{
		private bool disposed = false;

		protected override void Dispose(bool isDisposing)
		{
			if (disposed)
			{
				return;
			}

			if (isDisposing)
			{
				// 관리 리소스 정리
			}
			// 비관리 리소스 정리
			
			//베이스 클래스가 자신의 리소스를 정리하도록 호출
			base.Dispose(isDisposing);
			disposed = true;
		}
	}
}
```



```c#
  public interface IDisposable
  {
    void Dispose();
  }
```

IDisposable.Dispose 메소드는 다음에 작업을 반드시 수행해야 된다.

* 모든 비관리 리소스를 정리한다.
* 모든 관리 리소스를 정리한다.
* 객체가 이미 정리되었음을 나타내기 위한 상태 플래그 설정. 정리된 객체의 추가로 정리작업 요청될 경우 이 플래그를 확인하여 ObjectDisposed 예외를 발생시킨다.
* finalizer 호출회피 이를 위해 GC.SuppressFinalize(this)를 호출한다.



# 참조
-----
* [이펙티브 C#](http://www.yes24.com/Product/Goods/55864866)

