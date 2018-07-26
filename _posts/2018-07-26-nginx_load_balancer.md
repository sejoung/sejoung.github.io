---
layout: post
title: "nginx_load_balancer"
date: 2018-07-26 20:21:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### nginx HTTP load balancer 설정

톰캣 인스턴스를 여러개를 생성 시켜서 대용량 부하에도 견디기 위해 처리를 진행 하려고 했습니다.
하지만 서비스를 제공 받는쪽에서는 포트정보나 몇대에 서버를 사용하는것 없이 하기위해서 nginx를 셋팅했습니다

nginx의 proxy_pass 방식을 통해서 처리 했습니다. upstream 설정을 통해 여러대의 서버를 묶어주고
server의 location 설정의 proxy_pass를 통해서 해당서버로 패싱을 진행앴습니다.

설정내용은 아래에 있습니다.
```
upstream tomcat {
    # Use IP Hash for session persistence
    #ip_hash;

    # List of Tomcat application servers
    server localhost:8080;
    server localhost:8081;
}

server {
    listen       80 default_server;
    listen       [::]:80 default_server;
    server_name  _;
    root         /usr/share/nginx/html;

    # Load configuration files for the default server block.

    location / {
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Server $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://tomcat;
        proxy_cache backcache;
        proxy_connect_timeout   5;
        proxy_read_timeout      300;
        proxy_intercept_errors  on;
        proxy_next_upstream     error timeout invalid_header http_500;

    }

    location /stub_status {
        stub_status;
        # Security: Only allow access from the IP below.
        allow 127.0.0.1;
        # Deny anyone else
        deny all;
    }


}


```

# 참조 
-----
* [ngx_http_upstream_module](http://nginx.org/en/docs/http/ngx_http_upstream_module.html)
