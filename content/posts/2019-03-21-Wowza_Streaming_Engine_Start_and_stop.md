---
layout: post
title: "Start and stop Wowza Streaming Engine"
date: 2019-03-21 17:57 +0900
comments: true
tags : ["wowza","streaming engine","wowza start and stop","와우자"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## Start and stop Wowza Streaming Engine

### Streaming Engine OSX

#### service

```

sudo launchctl load -w /Library/LaunchDaemons/com.wowza.WowzaStreamingEngine.plist

```

```

sudo launchctl unload -w /Library/LaunchDaemons/com.wowza.WowzaStreamingEngine.plist

```

#### standalone mode

```
cd /Library/WowzaStreamingEngine-4.7.7/bin

./startup.sh

```

```
cd /Library/WowzaStreamingEngine-4.7.7/bin

./shutdown.sh

```

### Streaming Engine Linux

#### service

```
sudo service WowzaStreamingEngine start
```
OR
```
/etc/init.d/WowzaStreamingEngine start
```

```
sudo service WowzaStreamingEngine stop
```
OR
```
/etc/init.d/WowzaStreamingEngine stop
```

#### standalone mode

```
cd /usr/local/WowzaStreamingEngine/bin

./startup.sh
```

```
cd /usr/local/WowzaStreamingEngine/bin

./shutdown.sh
```

확인은 `http://[wowza-ip-address]:1935` 여기로 접속 해보면 됨 

### Streaming Engine Manager OS X

#### service

```
sudo launchctl load -w /Library/LaunchDaemons/com.wowza.WowzaStreamingEngineManager.plist

```

```
sudo launchctl unload -w /Library/LaunchDaemons/com.wowza.WowzaStreamingEngineManager.plist

```

#### standalone mode

```
cd /Library/WowzaStreamingEngine-4.7.7/WowzaStreamingEngine/manager/bin

./startmgr.sh
```

```
cd /Library/WowzaStreamingEngine-4.7.7/WowzaStreamingEngine/manager/bin

./shutdownmgr.sh
```

### Streaming Engine Manager Linux

#### service

```
sudo service WowzaStreamingEngineManager start
```
OR
```
/etc/init.d/WowzaStreamingEngineManager start
```

```
sudo service WowzaStreamingEngineManager stop
```
OR
```
/etc/init.d/WowzaStreamingEngineManager stop
```

#### standalone mode

```
cd /usr/local/WowzaStreamingEngine-4.7.7/WowzaStreamingEngine/manager/bin

./startmgr.sh
```

```
cd /usr/local/WowzaStreamingEngine-4.7.7/WowzaStreamingEngine/manager/bin

./shutdownmgr.sh
```

# 참조
-----
* [how-to-start-and-stop-wowza-streaming-engine-software](https://www.wowza.com/docs/how-to-start-and-stop-wowza-streaming-engine-software)
