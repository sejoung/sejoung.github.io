---
layout: post
title: "서비스 스텍(ServiceStack) 테스트코드 작성"
date: 2021-02-15 15:59 +0900
comments: true
tags : ["c#","ServiceStack","서비스스텍","테스트"]
categories : ["c#"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 서비스 스텍(ServiceStack) 테스트코드 작성

서비스 스텍을 사용해서 개발을 했으면 아래같은 코드를 사용해 간단하게 테스트 해볼수 있다.

```c#
namespace io.github.sejoung.servicestack.test
{
	[TestFixture]
	class ServiceStackTest
  {
    private ServiceStackHost appHost;

    [OneTimeSetUp]
    public void OneTimeSetUp()
    {
        appHost = new BasicAppHost().Init();
        var container = appHost.Container;

        container.Register<IDbConnectionFactory>(
            new OrmLiteConnectionFactory(":memory:", SqliteDialect.Provider));

        container.RegisterAutoWiredAs<RockstarRepository, IRockstarRepository>();

        container.RegisterAutoWired<SimpleService>();

        using (var db = container.Resolve<IDbConnectionFactory>().Open())
        {
            db.DropAndCreateTable<Rockstar>();
            db.InsertAll(SeedData);
        }
    }

    [OneTimeTearDown]
    public void OneTimeTearDown() => appHost.Dispose();


    [Test]
    public void Using_in_memory_database()
    {
        //Resolve the autowired service from IOC and set Resolver for the base class
        var service = appHost.Container.Resolve<SimpleService>(); 

        var rockstars = service.Get(new FindRockstars { Aged = 27 });

        rockstars.PrintDump(); //Print a dump of the results to Console

        Assert.That(rockstars.Count, Is.EqualTo(SeedData.Count(x => x.Age == 27)));

        var status = service.Get(new GetStatus { LastName = "Vedder" });
        Assert.That(status.Age, Is.EqualTo(48));
        Assert.That(status.Alive, Is.True);

        status = service.Get(new GetStatus { LastName = "Hendrix" });
        Assert.That(status.Age, Is.EqualTo(27));
        Assert.That(status.Alive, Is.False);

        Assert.Throws<HttpError>(() =>
            service.Get(new GetStatus { LastName = "Unknown" }));
    }


  }
}

```

# 참조
-----
* [servicestack testing](https://docs.servicestack.net/testing)

