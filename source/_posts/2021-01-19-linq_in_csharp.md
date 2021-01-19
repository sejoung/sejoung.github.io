---
layout: post
title: "LINQ(Language-Integrated Query) in C#"
date: 2021-01-19 11:42 +0900
comments: true
tags : ["c#","LINQ","dotnet","Language-Integrated Query","링큐"]
categories : ["c#"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# LINQ(Language-Integrated Query) in C#

LINQ(Language-Integrated Query)는 C# 언어에 직접 쿼리 기능을 통합하는 방식을 기반으로 하는 기술 집합 이름입니다. 
LINQ를 사용할 경우 쿼리는 클래스, 메서드, 이벤트와 같은 고급 언어 구문이 됩니다

쿼리식을 사용해서 데이터소스(SQL 데이터베이스, XML 문서, 다양한 웹 서비스 등)에 대한 필터링을 할수 있습니다.

소스 데이터가 항상 `IEnumerable<T>` 또는 `IQueryable<T>` 컬렉션으로 표시

* 쿼리는 쿼리 변수를 반복할 때까지(예: foreach 문) 실행되지 않습니다.
* 대부분의 경우 컴파일러가 형식을 유추할 수 있기 때문에 명시적으로 형식을 제공할 필요는 없지만 쿼리 식의 변수는 모두 강력한 형식을 갖습니다.
* 일반적으로 LINQ 쿼리를 작성하는 경우 가능하면 쿼리 구문을 사용하고 필요한 경우 메서드 구문을 사용하는 것이 좋습니다. 두 개의 다른 폼 간에 의미 체계 또는 성능상의 차이는 없습니다. 쿼리 식이 메서드 구문으로 작성된 동급의 식보다 읽기 쉬운 경우가 많습니다.
* Count 또는 Max와 같은 일부 쿼리 작업은 해당하는 쿼리 식 절이 없으므로 메서드 호출로 표현해야 합니다. 메서드 구문을 다양한 방법으로 쿼리 구문에 조합할 수 있습니다. 자세한 내용은 쿼리 구문과 메서드 구문 비교를 참조하세요.
* 쿼리 식은 쿼리가 적용되는 형식에 따라 식 트리 또는 대리자로 컴파일될 수 있습니다. IEnumerable<T> 쿼리는 대리자로 컴파일됩니다. IQueryable 및 IQueryable<T> 쿼리는 식 트리로 컴파일됩니다. 자세한 내용은 식 트리를 참조하세요.

## 쿼리 구문(Query syntax)

```c#

using System;
using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;

namespace LinqQueryTest
{
    public class LinqQueryExpressions
    {
        [Test]
        public void 크기비교()
        {
            int[] scores = {97, 92, 81, 60};

            var scoreQuery =
                from score in scores
                where score > 80
                select score;

            foreach (var i in scoreQuery)
            {
                Assert.Greater(i, 80);
            }
        }

        [Test]
        public void 범위확인()
        {
            var numbers = new List<int>() {5, 4, 1, 3, 9, 8, 6, 7, 2, 0};

            var filteringQuery =
                from num in numbers
                where num < 3 || num > 7
                select num;


            foreach (var i in filteringQuery)
            {
                switch (i)
                {
                    case < 3:
                    case > 7:
                        Assert.Pass();
                        break;
                    default:
                        Assert.Fail();
                        break;
                }
            }
        }

        [Test]
        public void 정렬확인()
        {
            var numbers = new List<int>() { 5, 4, 1, 3, 9, 8, 6, 7, 2, 0 };
            var orderingQuery =
                from num in numbers
                where num < 3 || num > 7
                orderby num ascending
                select num;

            
            Assert.That(orderingQuery, Is.Ordered.Ascending);
        }

        [Test]
        public void 그룹핑확인()
        {
            string[] groupingQuery = { "carrots", "cabbage", "broccoli", "beans", "barley" };
            IEnumerable<IGrouping<char, string>> queryFoodGroups =
                from item in groupingQuery
                group item by item[0];
            
            foreach (var queryFoodGroup in queryFoodGroups)
            {
                var count = queryFoodGroup.Count();
                switch (queryFoodGroup.Key)
                {
                    case 'c':
                        Assert.AreEqual(2, count);
                        break;
                    case 'b':
                        Assert.AreEqual(3, count);
                        break;
                    default:
                        Assert.Fail();
                        break;
                }
            }
  

        }
    }
}

```

## 메서드 구문(Method syntax)

가장 일반적인 메서드는 singleton 숫자 값을 반환하는 Sum, Max, Min, Average 등입니다. 

```c#

using NUnit.Framework;
using System.Collections.Generic;
using System.Linq;

namespace LinqQueryTest
{
    public class LinqMethod
    {
        [Test]
        public void Average()
        {
            var numbers1 = new List<int>() { 5, 4, 1, 3, 9, 8, 6, 7, 2, 0 };

            var average = numbers1.Average();

            Assert.AreEqual(4.5, average);

        }

        [Test]
        public void Concat()
        {
            var numbers1 = new List<int>() { 5, 4, 1, 3, 9, 8, 6, 7, 2, 0 };
            var numbers2 = new List<int>() { 15, 14, 11, 13, 19, 18, 16, 17, 12, 10 };

            var concatenationQuery = numbers1.Concat(numbers2);

            Assert.AreEqual(20, concatenationQuery.Count());

        }

        [Test]
        public void Where()
        {
            var numbers1 = new List<int>() { 5, 4, 1, 3, 9, 8, 6, 7, 2, 0 };
            var numbers2 = new List<int>() { 15, 14, 11, 13, 19, 18, 16, 17, 12, 10 };

            var largeNumbersQuery = numbers2.Where(c => c > 15);

            Assert.AreEqual(4, largeNumbersQuery.Count());

        }

    }
}


```

## 혼합된 쿼리 및 메서드 구문(Mixed query and method syntax)


```c#

using NUnit.Framework;
using System.Collections.Generic;
using System.Linq;

namespace LinqQueryTest
{
    public class LinqMixMethodAndQuery
    {
        [Test]
        public void Mix1()
        {
            var numbers = new List<int>() { 5, 4, 1, 3, 9, 8, 6, 7, 2, 0 };

            var numCount = (from num in numbers
                where num < 3 || num > 7
                select num).Count();

            Assert.AreEqual(5, numCount);
        }

        [Test]
        public void Mix2()
        {
            var numbers = new List<int>() { 5, 4, 1, 3, 9, 8, 6, 7, 2, 0 };

            var numbersQuery =
                from num in numbers
                where num < 3 || num > 7
                select num;

            var numCount = numbersQuery.Count();
            Assert.AreEqual(5, numCount);


        }

    }
}

```

이 예제는 쿼리 절의 결과에서 메서드 구문을 사용하는 방법을 보여준다.

쿼리 식을 괄호로 묶은 다음 점 연산자를 적용하고 메서드를 호출하면 됩니다. 

일반적으로 두 번째 변수를 사용하여 메서드 호출의 결과를 저장하는 것이 좋습니다. 

이렇게 하면 쿼리가 쿼리의 결과와 혼동될 가능성이 줄어듭니다.

# 참조
-----
* [linq](https://docs.microsoft.com/ko-kr/dotnet/csharp/linq/)


