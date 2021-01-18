---
layout: post
title: "닷넷(dotnet) 엔티티 프레임워크(Entity Framework) DbContext"
date: 2021-01-18 12:00 +0900
comments: true
tags : ["c#","Entity Framework","dotnet","DbContext","엔티티 프레임워크"]
categories : ["c#"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 닷넷(dotnet) 엔티티 프레임워크(Entity Framework) DbContext

Entity Framework를 사용 하 여 .NET 개체를 사용 하 여 데이터를 쿼리, 삽입, 업데이트 및 삭제 하려면 먼저 모델에 정의 된 엔터티와 관계를 데이터베이스의 테이블에 매핑하는 모델을 만들어야 합니다.
모델이 있으면 응용 프로그램이 상호 작용 하는 기본 클래스가 System.Data.Entity.DbContext (종종 컨텍스트 클래스 라고도 함)입니다. 모델에 연결 된 DbContext를 사용 하 여 다음을 수행할 수 있습니다.

* 쿼리 작성 및 실행
* 쿼리 결과를 엔터티 개체로 구체화
* 해당 개체에 대 한 변경 내용 추적
* 데이터베이스에 개체 변경 내용을 다시 유지
* 메모리의 개체를 UI 컨트롤에 바인딩

## DbContext 파생 클래스 정의

컨텍스트를 사용 하 여 작업 하는 권장 방법은 DbContext에서 파생 되는 클래스를 정의 하 고 컨텍스트에서 지정 된 엔터티의 컬렉션을 나타내는 DbSet 속성을 노출 하는 것입니다. 
EF Designer를 사용 하 여 작업 하는 경우 컨텍스트가 생성 됩니다. Code First 사용 하는 경우 일반적으로 컨텍스트를 직접 작성 합니다.

```c#

public class ProductContext : DbContext
{
    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }
}

```

컨텍스트가 있으면 Add Attach 이러한 속성을 통해 컨텍스트에서 또는 (또는 메서드 사용)를 쿼리하거나 제거 (Remove) 할 수 있습니다. 
DbSet컨텍스트 개체의 속성에 액세스 하는 것은 지정 된 형식의 모든 엔터티를 반환 하는 시작 쿼리를 나타냅니다. 속성에 액세스 하는 것은 쿼리를 실행 하지 않습니다. 
쿼리가 실행 되는 경우는 다음과 같습니다.

* foreach(C#) 또는 For Each(Visual Basic) 문에 의해 열거된 경우
* , 또는와 같은 컬렉션 작업에 의해 열거 ToArray 됩니다 ToDictionary ToList .
* 또는와 같은 LINQ First 연산자 Any 는 쿼리의 가장 바깥쪽 부분에 지정 됩니다.
* Load DbEntityEntry.Reload 지정 된 키를 Database.ExecuteSqlCommand DbSet<T>.Find 가진 엔터티를 컨텍스트에 이미 로드 하지 않은 경우 다음 메서드 중 하나가 호출 됩니다.


## Lifetime

컨텍스트의 수명은 인스턴스가 생성 될 때 시작 되 고 인스턴스가 삭제 되거나 가비지 수집 될 때 종료 됩니다. 
컨텍스트 컨트롤에서 제어 하는 모든 리소스가 블록의 끝에서 삭제 되도록 하려면 using을 사용 합니다. 
using 을 사용 하는경우 컴파일러는 try/finally 블록을 자동으로 만들고 finally 블록에서 dispose를 호출 합니다.

```c#
public void UseProducts()
{
    using (var context = new ProductContext())
    {     
        // Perform data access using the context
    }
}

```
* 웹 응용 프로그램을 사용할 때는 요청당 컨텍스트 인스턴스를 사용 합니다.
* Windows Presentation Foundation (WPF) 또는 Windows Forms를 사용 하 여 작업 하는 경우에는 폼 마다 컨텍스트 인스턴스를 사용 합니다. 이렇게 하면 컨텍스트에서 제공 하는 변경 내용 추적 기능을 사용할 수 있습니다.
* 컨텍스트 인스턴스가 종속성 주입 컨테이너에 의해 생성 되는 경우 일반적으로 해당 컨텍스트를 삭제 하는 것은 컨테이너의 책임입니다.
* 응용 프로그램 코드에서 컨텍스트를 만든 경우 더 이상 필요 하지 않은 컨텍스트를 삭제 해야 합니다.
* 장기 실행 컨텍스트를 사용할 때 다음 사항을 고려 합니다.
    * 더 많은 개체와 해당 참조를 메모리에 로드 하면 컨텍스트의 메모리 소비가 빠르게 증가할 수 있습니다. 이로 인해 성능 문제가 발생할 수 있습니다.
    * 컨텍스트는 스레드로부터 안전 하지 않으므로 동시에 작업을 수행 하는 여러 스레드 간에 공유 되어서는 안 됩니다.
    * 예외로 인해 컨텍스트가 복구할 수 없는 상태가 되 면 전체 응용 프로그램이 종료 될 수 있습니다.
    * 데이터가 쿼리되는 시간과 업데이트되는 시간의 간격이 커짐에 따라 동시성 관련 문제가 발생할 가능성이 높아집니다.

## Connections

기본적으로 컨텍스트는 데이터베이스에 대한 연결을 관리 합니다. 
컨텍스트는 필요에 따라 연결을 열고 닫습니다. 예를 들어 컨텍스트는 연결을 열어 쿼리를 실행 한 다음 모든 결과 집합이 처리 될 때 연결을 닫습니다.

연결이 열리고 닫히는 때를 세부적으로 제어해야 하는 경우가 있습니다.
예를 들어 SQL Server Compact를 사용 하는 경우 성능 향상을 위해 응용 프로그램의 수명 동안 데이터베이스에 대 한 별도의 열린 연결을 유지 하는 것이 좋습니다. 
Connection 속성을 사용하여 이 프로세스를 수동으로 관리할 수 있습니다.

-----
* [working-with-dbcontext](https://docs.microsoft.com/ko-kr/ef/ef6/fundamentals/working-with-dbcontext)


