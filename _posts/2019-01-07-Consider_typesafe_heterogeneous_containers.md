---
layout: post
title: "아이템 33. 타입안전 이종컨테이너를 고려하라."
date: 2019-01-07 14:17 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 33. 타입안전 이종컨테이너를 고려하라.

```java

package com.github.sejoung.codetest.generics;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

// 타입 안전 이종 컨테이너 패턴 (199-202쪽)
public class Favorites {
    // 코드 33-3 타입 안전 이종 컨테이너 패턴 - 구현 (200쪽)
    private Map<Class<?>, Object> favorites = new HashMap<>();

    public <T> void putFavorite(Class<T> type, T instance) {
        favorites.put(Objects.requireNonNull(type), instance);
    }

    public <T> T getFavorite(Class<T> type) {
        return type.cast(favorites.get(type));
    }

    // 코드 33-2 타입 안전 이종 컨테이너 패턴 - 클라이언트 (199쪽)
    public static void main(String[] args) {
        Favorites f = new Favorites();

        f.putFavorite(String.class, "Java");
        f.putFavorite(Integer.class, 0xcafebabe);
        f.putFavorite(Class.class, Favorites.class);

        String favoriteString = f.getFavorite(String.class);
        int favoriteInteger = f.getFavorite(Integer.class);

        System.out.println(favoriteString);
        System.out.println(favoriteInteger);

        Class<?> favoriteClass = f.getFavorite(Class.class);

        System.out.printf("%s %x %s%n", favoriteString,
                favoriteInteger, favoriteClass.getName());
    }
}


```
실행결과
```

Java
-889275714
Java cafebabe com.github.sejoung.codetest.generics.Favorites

Process finished with exit code 0

```

위에 코드 처럼 간단하게 타입안전 이종 컨테이너를 구현할수있는데 여기서 2가지 문제 점이 있다.

* 악의적인 클라이언트가 Class객체를 제네릭이 아닌 로타입으로 넘기면 타입안정성이 깨진다.

```java

package com.github.sejoung.codetest.generics;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

// 타입 안전 이종 컨테이너 패턴 (199-202쪽)
public class Favorites {
    // 코드 33-3 타입 안전 이종 컨테이너 패턴 - 구현 (200쪽)
    private Map<Class<?>, Object> favorites = new HashMap<>();

    public <T> void putFavorite(Class<T> type, T instance) {
        favorites.put(Objects.requireNonNull(type), instance);
    }

    public <T> T getFavorite(Class<T> type) {
        return type.cast(favorites.get(type));
    }
/*

    // 코드 33-4 동적 형변환으로 런타임 타입 안전성 확보 (202쪽)
    public <T> void putFavorite(Class<T> type, T instance) {
        favorites.put(Objects.requireNonNull(type), type.cast(instance));
    }
*/

    // 코드 33-2 타입 안전 이종 컨테이너 패턴 - 클라이언트 (199쪽)
    public static void main(String[] args) {
        Favorites f = new Favorites();

        f.putFavorite(String.class, "Java");
        f.putFavorite(Integer.class, 0xcafebabe);
        f.putFavorite(Class.class, Favorites.class);
        f.putFavorite((Class)Integer.class, "나는 바보");
        String favoriteString = f.getFavorite(String.class);
        int favoriteInteger = f.getFavorite(Integer.class);

        System.out.println(favoriteString);
        System.out.println(favoriteInteger);

        Class<?> favoriteClass = f.getFavorite(Class.class);

        System.out.printf("%s %x %s%n", favoriteString,
                favoriteInteger, favoriteClass.getName());
    }
}


```
실행결과
```
Exception in thread "main" java.lang.ClassCastException: Cannot cast java.lang.String to java.lang.Integer
	at java.base/java.lang.Class.cast(Class.java:3606)
	at com.github.sejoung.codetest.generics.Favorites.getFavorite(Favorites.java:17)
	at com.github.sejoung.codetest.generics.Favorites.main(Favorites.java:36)

Process finished with exit code 1


```

위에 코드에서 f.putFavorite((Class)Integer.class, "나는 바보"); 처럼 로타입을 넘기면 
컴파일은 정상인데 실행시에 ClassCastException이 발생한다.

하지만 일반 컬랙션에도 다음같은 문제가 있기 때문에 어느정도 감수한다면 타입안정성을 얻을수 있다.

Favorites 코드가 불변식을 어기는 일이 없도록 보장하려면 putFavorite를 수정하면된다.

```java

package com.github.sejoung.codetest.generics;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

// 타입 안전 이종 컨테이너 패턴 (199-202쪽)
public class Favorites {
    // 코드 33-3 타입 안전 이종 컨테이너 패턴 - 구현 (200쪽)
    private Map<Class<?>, Object> favorites = new HashMap<>();

    public <T> T getFavorite(Class<T> type) {
        return type.cast(favorites.get(type));
    }

    // 코드 33-4 동적 형변환으로 런타임 타입 안전성 확보 (202쪽)
    public <T> void putFavorite(Class<T> type, T instance) {
        favorites.put(Objects.requireNonNull(type), type.cast(instance));
    }

    // 코드 33-2 타입 안전 이종 컨테이너 패턴 - 클라이언트 (199쪽)
    public static void main(String[] args) {
        Favorites f = new Favorites();

        f.putFavorite(String.class, "Java");
        f.putFavorite(Integer.class, 0xcafebabe);
        f.putFavorite(Class.class, Favorites.class);
        String favoriteString = f.getFavorite(String.class);
        int favoriteInteger = f.getFavorite(Integer.class);

        System.out.println(favoriteString);
        System.out.println(favoriteInteger);

        Class<?> favoriteClass = f.getFavorite(Class.class);

        System.out.printf("%s %x %s%n", favoriteString,
                favoriteInteger, favoriteClass.getName());
    }
}


```

위처럼 동적 형변환으로 런타임 안정성을 확보하는 일이다.

* 두번째 제약은 실체화 불가타입에는 사용 할 수 없다는것

두번째 제약은 슈퍼타입토큰으로 어느정도 해결할수있지만 완벽한 해결방법은 아니다.


그럼 위에 Favorites 코드를 슈퍼타입 토큰을 사용해서 변환시키면

```java

package com.github.sejoung.codetest.generics.supertype;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

public abstract class TypeRef<T> {

    Type type;

    public TypeRef(){
        Type stype = getClass().getGenericSuperclass();
        if(stype instanceof ParameterizedType){
            this.type = ((ParameterizedType)stype).getActualTypeArguments()[0];
        }else throw new RuntimeException();
    }
    public int hashCode(){
        return type.hashCode(); //type을 기준으로 식별(type은 Class이므로 Class레벨만 식별됨)
    }
    public boolean equals(Object o){
        if(this == o) return true;
        if(o == null || getClass().getSuperclass() != o.getClass().getSuperclass()) return false;
        TypeRef<?> that = (TypeRef<?>) o;
        return type.equals(that.type); //마찬가지로 두 객체 간의 type을 비교
    }

}



```

```java

package com.github.sejoung.codetest.generics.supertype;

import java.lang.reflect.ParameterizedType;
import java.util.*;

public class Favorites {
    // 코드 33-3 타입 안전 이종 컨테이너 패턴 - 구현 (200쪽)
    private Map<TypeRef<?>, Object> favorites = new HashMap<>();

    public <T> T getFavorite(TypeRef<T> tr) {
        if(tr.type instanceof Class<?>){ //일반클래스인 경우
            return ((Class<T>)tr.type).cast(favorites.get(tr));
        }else{ //제네릭타입인 경우
            return ((Class<T>)((ParameterizedType)tr.type).getRawType()).cast(favorites.get(tr));
        }
    }

    // 코드 33-4 동적 형변환으로 런타임 타입 안전성 확보 (202쪽)
    public <T> void putFavorite(TypeRef<T> tr, T instance) {
        favorites.put(Objects.requireNonNull(tr), instance);
    }

    // 코드 33-2 타입 안전 이종 컨테이너 패턴 - 클라이언트 (199쪽)
    public static void main(String[] args) {
        Favorites f = new Favorites();
        f.putFavorite(new TypeRef<List<String>>(){}, Arrays.asList("바보","천재"));

        List<String> listOfString = f.getFavorite(new TypeRef<List<String>>(){});

        listOfString.forEach((s -> {
            System.out.println(s);
        }));


    }
}


```
실행결과
```
바보
천재

Process finished with exit code 0
```

Favorites 코드를 위에 처럼 변환 시켜야 된다.

어렵다 토비님이 강의내용이 아주 좋았다.

비사이드 소프트에서 정리한 내용도 많은 도움이 되었습니다.

# 참조
-----
* [Variables of Reference Type](https://docs.oracle.com/javase/specs/jls/se8/html/jls-4.html#jls-4.12.2)
* [토비의 봄 TV 2회 - 수퍼 타입 토큰](https://www.youtube.com/watch?v=01sdXvZSjcI)
* [[java] 토비의 봄 TV라이브 #2](https://www.bsidesoft.com/?p=2903)
* [클래스 리터럴, 타입 토큰, 수퍼 타입 토큰](https://homoefficio.github.io/2016/11/30/%ED%81%B4%EB%9E%98%EC%8A%A4-%EB%A6%AC%ED%84%B0%EB%9F%B4-%ED%83%80%EC%9E%85-%ED%86%A0%ED%81%B0-%EC%88%98%ED%8D%BC-%ED%83%80%EC%9E%85-%ED%86%A0%ED%81%B0/)


