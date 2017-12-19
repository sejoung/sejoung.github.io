---
layout: post
title: "NGINX_proxy_pass"
date: 2017-12-18 16:46:00 +0900
comments: false
---

# nginx proxy pass

apache 와 tomcat의 연동시에는 통상적으로 AJP(Apache JServ Protocol)를 활용 하여서 톰켓과 아파치의 연동을 설정해왔다.

익숙한 mod_jk가 해당 프로토콜을 활용해서 연동하는 방식이다.

web서버를 apache에서 nginx로 바꾸려고 하는데 nginx에서는 ajp 프로토콜을 활용하지 않고 프록시 패스 방식으로 적용이 필요하다.

그래서 설정을 해야 되는데 아래 설정은 subdomain을 가지고 프록시 패스를 나눈 설정이다.


```
#
# The default server
#

upstream tomcat1 {
    # Use IP Hash for session persistence
    #ip_hash;

    # List of Tomcat application servers
    server 192.168.1.1:8080;
    server 192.168.1.1:8081;

}

upstream tomcat2 {
    #LB method : least_conn, ip_hash
    #ip_hash;

    ## proxy server
    server 192.168.1.1:9090;
    server 192.168.1.1:9091;
}

server {
    listen       80 default_server;
    listen       [::]:80 default_server;
    server_name  _;
    #root         /usr/share/nginx/html;

    if ($host ~* (.*)\.killers\.co\.kr ) {
        set $subdomain $1;
    }

    # Load configuration files for the default server block.
    # include /etc/nginx/default.d/*.conf;

    location / {
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Server $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;


        if ($subdomain ~ test) {
                proxy_pass http://tomcat1;
        }

        if ($subdomain ~ dev) {
                proxy_pass http://tomcat2;
        }

        proxy_connect_timeout   5;
        proxy_read_timeout      300;
        proxy_intercept_errors  on;
        proxy_next_upstream     error timeout invalid_header http_500;
    }
	
}


```

위에서 if문에서  이런식으로 처리 하지 않는 이유는 

nginx에서는 지원하지 않기 때문이다


```



        if ($subdomain ~ test) {
                proxy_pass http://tomcat1;
        }

        if ($subdomain ~ dev) {
                proxy_pass http://tomcat2;
        }

```


# 참조 
-----
* [nginx proxy pass DOC](http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass)

* [The Apache Tomcat Connectors](http://tomcat.apache.org/connectors-doc/)

* [nginx if statements](http://nginx.org/en/docs/http/ngx_http_rewrite_module.html#if)

