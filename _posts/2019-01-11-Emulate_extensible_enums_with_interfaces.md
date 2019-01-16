---
layout: post
title: "아이템 38. 확장할수있는 열거 타입이 필요하면 인터페이스를 사용하라."
date: 2019-01-11 10:26 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 38. 확장할수있는 열거 타입이 필요하면 인터페이스를 사용하라.

```java

package com.github.sejoung.codetest.enumtest.enuminterface;

// 코드 38-1 인터페이스를 이용해 확장 가능 열거 타입을 흉내 냈다. (232쪽)
public interface Operation {
    double apply(double x, double y);
}


```

```java

package com.github.sejoung.codetest.enumtest.enuminterface;

// 코드 38-1 인터페이스를 이용해 확장 가능 열거 타입을 흉내 냈다. - 기본 구현 (233쪽)
public enum BasicOperation implements Operation {
    PLUS("+") {
        @Override
        public double apply(double x, double y) {
            return x + y;
        }
    },
    MINUS("-") {
        @Override
        public double apply(double x, double y) {
            return x - y;
        }
    },
    TIMES("*") {
        @Override
        public double apply(double x, double y) {
            return x * y;
        }
    },
    DIVIDE("/") {
        @Override
        public double apply(double x, double y) {
            return x / y;
        }
    };

    private final String symbol;

    BasicOperation(String symbol) {
        this.symbol = symbol;
    }

    @Override
    public String toString() {
        return symbol;
    }
}


```

위에 처럼 인터페이스를 사용하여 Operation을 확장할수 있다. 다시 2개의 오퍼레이션을 확장 시키면

```java

package com.github.sejoung.codetest.enumtest.enuminterface;

import java.util.Arrays;
import java.util.Collection;

// 코드 38-2 확장 가능 열거 타입 (233-235쪽)
public enum ExtendedOperation implements Operation {
    EXP("^") {
        @Override
        public double apply(double x, double y) {
            return Math.pow(x, y);
        }
    },
    REMAINDER("%") {
        @Override
        public double apply(double x, double y) {
            return x % y;
        }
    };
    private final String symbol;

    ExtendedOperation(String symbol) {
        this.symbol = symbol;
    }

    @Override
    public String toString() {
        return symbol;
    }

}

```

이렇게 확장을 하면 기존 연산에 쓰던 곳에서 계속 확장된것도 사용할수 있다.

테스트 코드를 다시 작성해서 돌려보면

```java

package com.github.sejoung.codetest.enumtest.enuminterface;

public class Test {
    
    // 열거 타입의 Class 객체를 이용해 확장된 열거 타입의 모든 원소를 사용하는 예 (234쪽)
    public static void main(String[] args) {
        double x = 2;
        double y = 4;
        test(ExtendedOperation.class, x, y);
    }
    
    private static <T extends Enum<T> & Operation> void test(
            Class<T> opEnumType, double x, double y) {
        for (Operation op : opEnumType.getEnumConstants())
            System.out.printf("%f %s %f = %f%n",
                    x, op, y, op.apply(x, y));
    }

}


```
실행결과
```
2.000000 ^ 4.000000 = 16.000000
2.000000 % 4.000000 = 2.000000

Process finished with exit code 0

```

위에 코드를 작성하면 테스트를 할수있는데 Class 객체를 넘기는거 아니고
한정적 와일드 카드를 넘기는 방법이 있다. 

```java

package com.github.sejoung.codetest.enumtest.enuminterface;

import java.util.Arrays;
import java.util.Collection;

public class Test {

    // 컬렉션 인스턴스를 이용해 확장된 열거 타입의 모든 원소를 사용하는 예 (235쪽)
    public static void main(String[] args) {
        double x = 2;
        double y = 4;
        test(Arrays.asList(ExtendedOperation.values()), x, y);
    }

    private static void test(Collection<? extends Operation> opSet,
                             double x, double y) {
        for (Operation op : opSet)
            System.out.printf("%f %s %f = %f%n",
                    x, op, y, op.apply(x, y));
    }
}


```
실행결과
```
2.000000 ^ 4.000000 = 16.000000
2.000000 % 4.000000 = 2.000000

Process finished with exit code 0

```

java sdk 에도 있는데 아래의 객체들이다.

```java

/*
 * Copyright (c) 2007, 2011, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */

package java.nio.file;

/**
 * An object that configures how to open or create a file.
 *
 * <p> Objects of this type are used by methods such as {@link
 * Files#newOutputStream(Path,OpenOption[]) newOutputStream}, {@link
 * Files#newByteChannel newByteChannel}, {@link
 * java.nio.channels.FileChannel#open FileChannel.open}, and {@link
 * java.nio.channels.AsynchronousFileChannel#open AsynchronousFileChannel.open}
 * when opening or creating a file.
 *
 * <p> The {@link StandardOpenOption} enumeration type defines the
 * <i>standard</i> options.
 *
 * @since 1.7
 */

public interface OpenOption {
}


```

```java

/*
 * Copyright (c) 2007, 2011, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */

package java.nio.file;

/**
 * An object that configures how to copy or move a file.
 *
 * <p> Objects of this type may be used with the {@link
 * Files#copy(Path,Path,CopyOption[]) Files.copy(Path,Path,CopyOption...)},
 * {@link Files#copy(java.io.InputStream,Path,CopyOption[])
 * Files.copy(InputStream,Path,CopyOption...)} and {@link Files#move
 * Files.move(Path,Path,CopyOption...)} methods to configure how a file is
 * copied or moved.
 *
 * <p> The {@link StandardCopyOption} enumeration type defines the
 * <i>standard</i> options.
 *
 * @since 1.7
 */

public interface CopyOption {
}


```
```java

/*
 * Copyright (c) 2007, 2011, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */

package java.nio.file;

/**
 * Defines the options as to how symbolic links are handled.
 *
 * @since 1.7
 */

public enum LinkOption implements OpenOption, CopyOption {
    /**
     * Do not follow symbolic links.
     *
     * @see Files#getFileAttributeView(Path,Class,LinkOption[])
     * @see Files#copy
     * @see SecureDirectoryStream#newByteChannel
     */
    NOFOLLOW_LINKS;
}


```

열거타입은 확장할수 없지만 인터페이스와 그 인터페이스를 구현하는 기본열거 타입을 함께 사용해 같은 효과를 낼수있다.

# 참조
-----


