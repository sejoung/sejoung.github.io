---
layout: post
title: "닷넷(dotnet) 엔티티 프레임워크(Entity Framework)에서 enum 사용하기"
date: 2021-01-14 17:42 +0900
comments: true
tags : ["c#","Entity Framework","dotnet","enum","엔티티 프레임워크"]
categories : ["c#"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 닷넷(dotnet) 엔티티 프레임워크(Entity Framework)에서 enum 사용하기

엔티티 프레임워크를 사용해서 개발을 하다 보면 특정 컬럼에 값을 한정지어야 할 필요가 있다.
이럴때 enum을 활용 할 텐데 해당 값을 사용해서 처리 하는 방법은 


```C#

using MvcMovie.Constants;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MvcMovie.Models
{
    public class Movie
    {
        public int Id { get; set; }
        public string Title { get; set; }

        [Display(Name = "Release Date")]
        [DataType(DataType.Date)]
        public DateTime ReleaseDate { get; set; }
        public string Genre { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        public MovieRating Rating { get; set; }

    }
}


```

위에 모델은 영화를 모델링 한것이고 영화에 관람등급이 존재한다. 
해당 등급을 처리 하기위해서 `MovieRating` enum을 생성했다

```c#
using System.ComponentModel;

namespace MvcMovie.Constants
{
    public enum MovieRating
    {
        [Description("일반적인 셩인영화")]
        R,
        [Description("전체관람가")]
        G,
        [Description("부모 지도하에 전체관람가")]
        PG,
        [Description("13세 이상 부모지도하에 관람가")]
        PG13,
        [Description("19금")]
        NC17
    }
}

```
위에 등급은 미국 등급기준으로 작성을 해보았다.

위처럼 하고 마이그레이션을 실행하면

```
Add-Migration InitialCreate

```

위처럼 처리를 하면 해당 필드는 int 필드로 만들어진다.
하지만 컬럼에 string 값을 저장하고 싶을때는 아래 처럼 처리 하면된다.

```c#
using Microsoft.EntityFrameworkCore;
using MvcMovie.Models;

namespace MvcMovie.Data
{
    public class MvcMovieContext : DbContext
    {
        public MvcMovieContext(DbContextOptions<MvcMovieContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Movie>().ToTable("Movie");
            modelBuilder.Entity<Movie>().Property(c=> c.Rating).HasConversion<string>();
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<Movie> Movie { get; set; }
    }
}

```

위처럼 `DbContext`를 상속 받은 클래스에서 `OnModelCreating` 메소드를 오버라이딩해서 
`modelBuilder.Entity<Movie>().Property(c=> c.Rating).HasConversion<string>();` 처럼 `Rating` 필드를 `string`을 처리 해주면 string 필드로 변환이 된다.


# 참조
-----
* [dotnet csharp](https://medium.com/agilix/entity-framework-core-enums-ee0f8f4063f2)


