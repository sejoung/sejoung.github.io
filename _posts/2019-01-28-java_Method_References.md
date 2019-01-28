---
layout: post
title: "메소드 레퍼런스(Method References)"
date: 2019-01-28 10:24 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 메소드 레퍼런스(Method References)

당신은 사용 람다 표현식을 익명 메소드를 만들 수 있습니다. 그러나 때로는 람다식이 기존 메서드를 호출하는 것 외에는 아무것도 수행하지 않습니다. 이러한 경우 기존 방법을 이름으로 언급하는 것이 더 명확합니다. 메서드 참조를 사용하면이 작업을 수행 할 수 있습니다. 
그들은 이미 이름을 가지고있는 메소드를위한 작고 읽기 쉬운 식입니다.

아래는 샘플 코드입니다.

```java

package com.github.sejoung.codetest.lamdas.methodreferences;

import java.time.LocalDate;
import java.time.chrono.IsoChronology;
import java.util.ArrayList;
import java.util.List;

public class Person {

    public enum Sex {
        MALE, FEMALE
    }

    String name;
    LocalDate birthday;
    Sex gender;
    String emailAddress;

    Person(String nameArg, LocalDate birthdayArg,
           Sex genderArg, String emailArg) {
        name = nameArg;
        birthday = birthdayArg;
        gender = genderArg;
        emailAddress = emailArg;
    }

    public int getAge() {
        return birthday
                .until(IsoChronology.INSTANCE.dateNow())
                .getYears();
    }

    public void printPerson() {
        System.out.println(name + ", " + this.getAge());
    }

    public Sex getGender() {
        return gender;
    }

    public String getName() {
        return name;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public LocalDate getBirthday() {
        return birthday;
    }

    public static int compareByAge(Person a, Person b) {
        return a.birthday.compareTo(b.birthday);
    }

    public static List<Person> createRoster() {

        List<Person> roster = new ArrayList<>();
        roster.add(
                new Person(
                        "Fred",
                        IsoChronology.INSTANCE.date(1980, 6, 20),
                        Person.Sex.MALE,
                        "fred@example.com"));
        roster.add(
                new Person(
                        "Jane",
                        IsoChronology.INSTANCE.date(1990, 7, 15),
                        Person.Sex.FEMALE, "jane@example.com"));
        roster.add(
                new Person(
                        "George",
                        IsoChronology.INSTANCE.date(1991, 8, 13),
                        Person.Sex.MALE, "george@example.com"));
        roster.add(
                new Person(
                        "Bob",
                        IsoChronology.INSTANCE.date(2000, 9, 12),
                        Person.Sex.MALE, "bob@example.com"));

        return roster;
    }

}

```

```java
package com.github.sejoung.codetest.lamdas.methodreferences;

import java.util.*;
import java.util.function.Supplier;

public class MethodReferencesTest {

    // The method transferElements copies elements from one collection to
    // another

    public static <T, SOURCE extends Collection<T>, DEST extends Collection<T>> DEST transferElements( SOURCE sourceCollection, Supplier<DEST> collectionFactory) {
        DEST result = collectionFactory.get();
        for (T t : sourceCollection) {
            result.add(t);
        }
        return result;
    }

    public static void main(String... args) {

        List<Person> roster = Person.createRoster();

        for (Person p : roster) {
            p.printPerson();
        }


        Person[] rosterAsArray =
                roster.toArray(new Person[roster.size()]);

        class PersonAgeComparator
                implements Comparator<Person> {
            public int compare(Person a, Person b) {
                return a.getBirthday().compareTo(b.getBirthday());
            }
        }

        // Without method reference
        Arrays.sort(rosterAsArray, new PersonAgeComparator());

        // With lambda expression
        Arrays.sort(rosterAsArray,
                (Person a, Person b) -> {
                    return a.getBirthday().compareTo(b.getBirthday());
                }
        );

        // With method reference
        Arrays.sort(rosterAsArray, Person::compareByAge);

        // Reference to an instance method of a particular object
        class ComparisonProvider {
            public int compareByName(Person a,
                                     Person b) {
                return a.getName().compareTo(b.getName());
            }

            public int compareByAge(Person a,
                                    Person b) {
                return a.getBirthday().compareTo(b.getBirthday());
            }
        }
        ComparisonProvider myComparisonProvider = new ComparisonProvider();
        Arrays.sort(rosterAsArray, myComparisonProvider::compareByName);

        // Reference to an instance method
        // of an arbitrary object of a particular type

        String[] stringArray = { "Barbara", "James", "Mary", "John",
                "Patricia", "Robert", "Michael", "Linda" };
        Arrays.sort(stringArray, String::compareToIgnoreCase);

        Set<Person> rosterSetLambda =
                transferElements(roster, () -> { return new HashSet<>(); });

        Set<Person> rosterSet = transferElements(
                roster, HashSet::new);
        System.out.println("Printing rosterSet:");
        rosterSet.stream().forEach(p -> p.printPerson());
    }
}


```
실행결과
```
Fred, 38
Jane, 28
George, 27
Bob, 18
Printing rosterSet:
George, 27
Bob, 18
Jane, 28
Fred, 38

Process finished with exit code 0
```


아래는 메소드 참조의 종류에 대해서 서술합니다 종류는 4가지가 있다.

종류|예
---|---
정적 메서드에 대한 참조|ContainingClass::staticMethodName
특정 객체의 인스턴스 메소드 참조|containingObject::instanceMethodName
특정 유형의 임의의 객체에 대한 인스턴스 메소드 참조|ContainingType::methodName
생성자에 대한 참조|ClassName::new

첫번째 정적 매서드에 대한 참조에 대해서 설명하겠다

위에 코드에서 정적 메서드 참조한 예는

먼저 메소드 참조 없이 처리를 하려면 

```java

        class PersonAgeComparator
                implements Comparator<Person> {
            public int compare(Person a, Person b) {
                return a.getBirthday().compareTo(b.getBirthday());
            }
        }
        
        Arrays.sort(rosterAsArray, new PersonAgeComparator());

```

위에 처럼 Comparator클래스를 만든후 Arrays.sort 메소드를 사용해서 만들었다 이것을 람다로 바꾸면

```java

        Arrays.sort(rosterAsArray,
                (Person a, Person b) -> {
                    return a.getBirthday().compareTo(b.getBirthday());
                }
        );

```

위에 처럼 익명 클래스를 이용해서 처리를 하였다.

여기서 메소드 참조를 사용하면

```java

Arrays.sort(rosterAsArray, Person::compareByAge);

```

위에 처럼 바꿀수 있는것인데 이것이 정적 메서드 참조한 예이다.

두번째 특정 객체의 인스턴스 메소드 참조는

```java

        class ComparisonProvider {
            public int compareByName(Person a,
                                     Person b) {
                return a.getName().compareTo(b.getName());
            }

            public int compareByAge(Person a,
                                    Person b) {
                return a.getBirthday().compareTo(b.getBirthday());
            }
        }
        ComparisonProvider myComparisonProvider = new ComparisonProvider();
        Arrays.sort(rosterAsArray, myComparisonProvider::compareByName);

```

위에 처럼 특정 객체를 만들어서 new 한후에 인스턴스 myComparisonProvider::compareByName 메소드 참조를 하였다.

세번째 특정 유형의 임의의 객체에 대한 인스턴스 메소드 참조는 

```java

 String[] stringArray = { "Barbara", "James", "Mary", "John",
                "Patricia", "Robert", "Michael", "Linda" };
        Arrays.sort(stringArray, String::compareToIgnoreCase);

```
위에 코드를 보면 String 유형의 compareToIgnoreCase 메소드를 참조 하였다.


마지막으로 생성자 참조는

```java

    public static <T, SOURCE extends Collection<T>, DEST extends Collection<T>> DEST transferElements( SOURCE sourceCollection, Supplier<DEST> collectionFactory) {
        DEST result = collectionFactory.get();
        for (T t : sourceCollection) {
            result.add(t);
        }
        return result;
    }

```

위에 메소드를 부르는 곳에서 보면 아래 처럼

```java

        Set<Person> rosterSetLambda =
                transferElements(roster, () -> { return new HashSet<>(); });


```

쓰는데 메소드 참조로 바꾸면

```java

 Set<Person> rosterSet = transferElements(
                roster, HashSet::new);

```


# 참조
-----
* [methodreferences](https://docs.oracle.com/javase/tutorial/java/javaOO/methodreferences.html)

