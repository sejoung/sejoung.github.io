---
layout: post
title: "hashcode () 및 equals ()를 사용한 작업"
date: 2018-11-26 10:56 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### hashcode () 및 equals ()를 사용한 작업

java.lang.Object 에서는  equals () 와 hashcode ()의 2 개의 중요한 오브젝트 비교 메소드를 제공합니다.

기본구현

* equals (Object obj) : ava.lang.Object 가 제공하는 메소드 로, 인수로서 건네진 다른 객체가 현재의 인스턴스와 동일한 지 어떤지를 나타냅니다. 
JDK가 제공하는 기본 구현은 메모리 위치를 기반으로합니다. 두 객체는 동일한 메모리 주소에 저장되는 경우에만 동일합니다.

* hashcode () : 객체 메모리 주소의 정수 표현을 반환하는 java.lang.Object 에서 제공하는 메서드 입니다. 
기본적으로이 메서드는 각 인스턴스에 대해 고유 한 임의의 정수를 반환합니다. 이 정수는 응용 프로그램의 여러 실행간에 변경 될 수 있으며 동일하게 유지되지 않습니다.

java 문서에 따르면, 개발자는 equals () 메소드를 구현하는 것만으로는 충분하지 않습니다.

```

2 개의 객체가 equals (Object) 메소드로 동일 하면, 2 개의 객체의 각각으로 hashcode () 메소드 를 호출하면, 같은 정수 결과가 생성되지 않으면 안됩니다.

```

위에 값을 확인 하기 위해서 간단한 샘플 클래스를 하나 작성하겠다.

```java

package com.github.sejoung.codetest.equals;

public class Student {
    private int id;
    private String name;
    public Student(int id, String name) {
        this.name = name;
        this.id = id;
    }
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}


```


```java

package com.github.sejoung.codetest.equals;

public class HashcodeEquals {
    public static void main(String[] args) {
        Student alex1 = new Student(1, "Alex");
        Student alex2 = new Student(1, "Alex");
        System.out.println("alex1 hashcode = " + alex1.hashCode());
        System.out.println("alex2 hashcode = " + alex2.hashCode());
        System.out.println("Checking equality between alex1 and alex2 = " + alex1.equals(alex2));
    }
}


```

실행 결과

```

alex1 hashcode = 759156157
alex2 hashcode = 1702146597
Checking equality between alex1 and alex2 = false

Process finished with exit code 0


```

java api에 설명처럼 같은 값을 가지고 있지만 동일한 메모리 주소를 가지고 있지 않지 때문에 서로 다른 객체라고 나온다.

그러면 equals 객체를 오버라이드 해서 재정의 해보겠다.


```java

package com.github.sejoung.codetest.equals;

public class Student {
    private int id;
    private String name;

    public Student(int id, String name) {
        this.name = name;
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) return false;
        if (!(obj instanceof Student))
            return false;
        if (obj == this)
            return true;
        return this.getId() == ((Student) obj).getId();
    }
}


```

학생 id가 같은면 동일한 학생이라고 간주 하도록 equals 메소드를 재정의 하였다. 위에 main 메소드를 다시 실행해보면 아래의 결과가 나온다

```

alex1 hashcode = 759156157
alex2 hashcode = 1702146597
Checking equality between alex1 and alex2 = true

Process finished with exit code 0

```

hashcode는 틀리지만 값은 같나도 나온다.

그럼 다음은 ArrayList 에 contains 메소드를 사용해서 값을 비교하면 

```java

package com.github.sejoung.codetest.equals;

import java.util.ArrayList;
import java.util.List;

public class HashcodeEquals {
    public static void main(String[] args) {

        Student alex = new Student(1, "Alex");
        List< Student > studentsLst = new ArrayList< Student >();
        studentsLst.add(alex);
        System.out.println("Arraylist size = " + studentsLst.size());
        System.out.println("Arraylist contains Alex = " + studentsLst.contains(new Student(1, "Alex")));
    }
}


```

실행결과

```

Arraylist size = 1
Arraylist contains Alex = true

Process finished with exit code 0

```

그럼 hashcode () 의 재정이 목적은 무엇일까?

그것을 알아보기 위해 HashSet사용하여 equals를 호출하는 시나리오를 만들어 보겠습니다.

```java

package com.github.sejoung.codetest.equals;

import java.util.HashSet;

public class HashcodeEquals {
    public static void main(String[] args) {

        Student alex1 = new Student(1, "Alex");
        Student alex2 = new Student(1, "Alex");
        HashSet< Student > students = new HashSet < Student > ();
        students.add(alex1);
        students.add(alex2);
        System.out.println("HashSet size = " + students.size());
        System.out.println("HashSet contains Alex = " + students.contains(new Student(1, "Alex")));

    }
}


```

위에 코드를 실행 시키면 결과가

```

HashSet size = 2
HashSet contains Alex = false

Process finished with exit code 0


```

HashSet 같은 객체를 저장하는것으로 알고 있습니다. 하지만 size가 2가 나왔으므로 서로 다른 객체라고 판단한것으로 보여집니다.

HashSet에서 값을 비교 할때 hashcode를 호출하여 비교 하기 때문에 다른 객체라고 판단하면서 2개의 값을 저장하는 것입니다.

이거를 수정하기 위해서 hashCode를 오버라이딩 하겠습니다.

```java

package com.github.sejoung.codetest.equals;

public class Student {
    private int id;
    private String name;

    public Student(int id, String name) {
        this.name = name;
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) return false;
        if (!(obj instanceof Student))
            return false;
        if (obj == this)
            return true;
        return this.getId() == ((Student) obj).getId();
    }

    @Override
    public int hashCode() {
        return id;
    }
}


```

위에 처럼 코드를 바꾸도 다시 실행해 보면 

```

HashSet size = 1
HashSet contains Alex = true

Process finished with exit code 0

```

같은 값으로 판단 되는것을 확인 할수 있습니다.

결론은 

* 두객체가 같으면, 동일한 해시코드 값을 가지고 있어야 된다
* 2개의 오브젝트가 같은 해시 코드를 가지는 경우는 그것이 동일하다는것을 의미 하지는 않는다
* equals를 단독으로 재정의 하면 HashSet, HashMap, HashTable ... 등의 데이터 구조를 해싱하여 비즈니스가 실패하게됩니다.
* hashcode ()를 재정의 해도 Java가 두 객체를 비교할 때 메모리 주소를 무시하도록 강제하지 않습니다.


# 참조
-----
* [working-with-hashcode-and-equals-in-java](https://dzone.com/articles/working-with-hashcode-and-equals-in-java)
