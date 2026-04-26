---
layout: post
title: "Neal Gafter's Super Type Tokens"
date: 2019-01-07 13:44 +0900
comments: true
tags : ["Super Type Tokens"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### Neal Gafter's Super Type Tokens

jdk 5 generics 추가 되면서 java.lang.Class를 제네릭 타입으로 바꿀수 있다 예를 들면 String.class를 지금은 Class<String>으로
Joshua Bloch 말하는 THC, or Typesafe Heterogenous Container pattern이다.

```java

package com.github.sejoung.codetest.generics.nealgafter;

import java.util.HashMap;
import java.util.Map;

public class Favorites {
    private Map<Class<?>, Object> favorites = new HashMap<Class<?>, Object>();

    public <T> void setFavorite(Class<T> klass, T thing) {
        favorites.put(klass, thing);
    }

    public <T> T getFavorite(Class<T> klass) {
        return klass.cast(favorites.get(klass));
    }

    public static void main(String[] args) {
        Favorites f = new Favorites();
        f.setFavorite(String.class, "Java");
        f.setFavorite(Integer.class, 0xcafebabe);
        String s = f.getFavorite(String.class);
        int i = f.getFavorite(Integer.class);
        System.out.println(s);
        System.out.println(i);
    }
}


```

위와 같은 코드를 타입 안전하고 컴파일시에 문제에 대해 판단할수 있다.
하지만 위에 코드는 제약이 있음니다. 

아래의 코드를 추가하면 이레이져에 의해 문제가 됩니다.

```java

package com.github.sejoung.codetest.generics.nealgafter;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Favorites {
    private Map<Class<?>, Object> favorites = new HashMap<Class<?>, Object>();

    public <T> void setFavorite(Class<T> klass, T thing) {
        favorites.put(klass, thing);
    }

    public <T> T getFavorite(Class<T> klass) {
        return klass.cast(favorites.get(klass));
    }

    public static void main(String[] args) {
        Favorites f = new Favorites();
        f.setFavorite(String.class, "Java");
        f.setFavorite(Integer.class, 0xcafebabe);
        f.setFavorite (List<String>.class, Collections.emptyList ());

        String s = f.getFavorite(String.class);
        int i = f.getFavorite(Integer.class);

        System.out.println(s);
        System.out.println(i);
    }
}


```
컴파일 메시지
```
Error:(23, 37) java: <identifier> expected
Error:(23, 42) java: <identifier> expected
Error:(28, 27) java: <identifier> expected
Error:(28, 29) java: <identifier> expected
Error:(29, 27) java: <identifier> expected
Error:(29, 29) java: <identifier> expected
Error:(31, 2) java: reached end of file while parsing
```

위에 문제를 해결하기 위해 아래와 같은 방법을 사용하였다.

```java

package com.github.sejoung.codetest.generics.nealgafter;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

/**
 * References a generic type.
 *
 * @author crazybob@google.com (Bob Lee)
 */
public abstract class TypeReference<T> {

    private final Type type;
    private volatile Constructor<?> constructor;

    protected TypeReference() {
        Type superclass = getClass().getGenericSuperclass();
        if (superclass instanceof Class) {
            throw new RuntimeException("Missing type parameter.");
        }
        this.type = ((ParameterizedType) superclass).getActualTypeArguments()[0];
    }

    /**
     * Instantiates a new instance of {@code T} using the default, no-arg
     * constructor.
     */
    @SuppressWarnings("unchecked")
    public T newInstance()
            throws NoSuchMethodException, IllegalAccessException,
            InvocationTargetException, InstantiationException {
        if (constructor == null) {
            Class<?> rawType = type instanceof Class<?>
                    ? (Class<?>) type
                    : (Class<?>) ((ParameterizedType) type).getRawType();
            constructor = rawType.getConstructor();
        }
        return (T) constructor.newInstance();
    }

    /**
     * Gets the referenced type.
     */
    public Type getType() {
        return this.type;
    }

    public static void main(String[] args) throws Exception {
        List<String> l1 = new TypeReference<ArrayList<String>>(){}.newInstance();
        List l2 = new TypeReference<ArrayList>() {}.newInstance();
    }
}

```



# 참조
-----
* [super-type-tokens](http://gafter.blogspot.com/2006/12/super-type-tokens.html)


