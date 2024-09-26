---
title: Docker 部署的项目无损搬家
description: 如何将Docker项目无损搬家
date: '2024-08-11'
lastModified: '2024-09-26T08:49:58.667Z'
---
因为旧服务器存在一些问题，

想要重装系统，

但是有一个DOCKER项目非常重要，

需要原封不动地搬到新的服务器上，

看上去简单，但是我花了3天的时间才完成。

在此记录一下过程，供大家参考。

![file](https://scdn.begs.cn/wp-content/uploads/2024/02/1709185400-image-1709185399540.png)

## 一、导出镜像

首先，在旧服务器中的 DOCKER 管理界面，将镜像导出。

### 1. 安装或打开/DOCKER
打开宝塔的DOCKER管理界面，切换到`镜像`。
![file](https://scdn.begs.cn/wp-content/uploads/2024/02/1709182113-image-1709182112400.png)

### 2. 导出镜像
点击需要导出的镜像后面的`导出`，并选定导出的路径和文件名，再单击导出。
![file](https://scdn.begs.cn/wp-content/uploads/2024/02/1709182158-image-1709182157771.png)

### 3. 下载镜像
转到保存镜像的文件夹，保存的镜像是以`.tar`结尾的，通过宝塔面板自带的文件下载器下载该镜像。

![file](https://scdn.begs.cn/wp-content/uploads/2024/02/1709182591-image-1709182591397.png)

下载速度非常慢，我想应该是跟我的服务器的带宽（只有1M）有关。
问了GPT4，它给出的回答如下：

## 导入镜像

接下来就是将原版镜像导入到新服务器
### 1. 上传镜像文件

打开宝塔面板的文件管理，选择一个合适的文件夹将上一步导出的所有镜像上传；

![file](https://scdn.begs.cn/wp-content/uploads/2024/02/1709183220-image-1709183219422.png)

### 2. 导入镜像文件

打开新服务器的DOCKER管理界面，点击`镜像`，选择刚刚上传的镜像文件所在的文件夹，并导入所有镜像文件。

![file](https://scdn.begs.cn/wp-content/uploads/2024/02/1709183411-image-1709183410543.png)

### 3. 确认镜像文件
确认所有的镜像文件都已经导入；
![file](https://scdn.begs.cn/wp-content/uploads/2024/02/1709183361-image-1709183361223.png)

## 三、重新部署

### 1. 打包项目并上传文件到新服务器
将原项目整个文件夹压缩，下载后上传到新服务器后解压缩。

### 2. 修改配置文件

> 建议先为配置文件`docker-compose.yml`创建一个副本，以免改错了；

打开项目中的配置文件`docker-compose.yml`，修改文件中所有的镜像名称，保持与DOCKER界面的镜像名称一致；
如：` image: astit_go_v13.9:v13.9`

Ctrl+S保存修改后的配置文件。

### 3. 构建镜像

在项目文件夹中打开终端（或打开终端CD进入项目文件夹）
输入命令：
```shell
docker-compose up -d
```

### 4. 检查部署是否成功
根据服务器的配置和镜像的大小，构建的时间可能有点长，需要耐心等待。

```shell
[root]# cd /www/wwwroot/fat
[root]# docker-compose up -d
[+] Running 5/5
 ✔ min 4 layers [⣿⣿⣿⣿]      0B/0B      Pulled                                           678.8s 
[+] Building 0.0s (0/0)                                                                               
[+] Running 7/7
 ✔ Network fat_default  Created                                                               0.4s 
 
```

通过IP+端口，检查部署是否成功。


## 四、添加域名

### 1. 添加域名

![file](https://scdn.begs.cn/wp-content/uploads/2024/02/1709185042-image-1709185042023.png)

### 2. 申请证书
在宝塔面板一键申请证书。注意，要先申请证书再配置反向代理。
![file](https://scdn.begs.cn/wp-content/uploads/2024/02/1709184999-image-1709184999242.png)

### 3. 添加反向代理


![file](https://scdn.begs.cn/wp-content/uploads/2024/02/1709184902-image-1709184901464.png)


