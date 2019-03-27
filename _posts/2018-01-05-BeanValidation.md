---
layout: post
title: "Bean Validation"
date: 2018-01-05 12:00:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

## Bean Validation

Java EE 및 Java SE에서 JavaBean 유효성 검사를위한 Java API 명세. 
 
JSR303 2009년 -> JSR349 2013년 -> JSR380 2017년

USER 클래스 

```java

package com.github.sejoung.learning.beanvalidation;

import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;

@Data
public class User {

    @NotNull
    private String id;

    @Null
    private String name;


}



```

TEST 클래스

```java

package com.github.sejoung.learning.beanvalidation;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.Set;

public class ValidationTest {
    public static void main(String[] args) {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();

        User user  = new User();
        user.setId("123");
        user.setName("123");

        Set<ConstraintViolation<User>> validate = validator.validate(user);
        validate.forEach(error -> System.out.println(error.getMessage()));

    }
}


```

위에처럼 테스트 하면 must be null이라는 메시지를 볼수 있다.


# 참조 
-----

* [JSR303 Bean Validation](http://beanvalidation.org/1.0/spec/)
* [JSR349 Bean Validation](http://beanvalidation.org/1.1/spec/)
* [JSR380 Bean Validation](http://beanvalidation.org/2.0/spec/)
* [테스트 코드](https://github.com/sejoung/BeanValidation)
