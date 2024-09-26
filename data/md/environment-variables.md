---
title: Linux 系统中 Docker 拉取镜像慢
description: 针对Linux系统的Docker 镜像替换方案
date: '2024-08-11T13:08:05.474Z'
lastModified: '2024-09-26T08:25:02.014Z'
---
自从Docker 镜像出问题后，龚老师也很久没有折腾了。
![file](https://scdn.begs.cn/wp-content/uploads/2024/07/1721145045-image-1721145043864.png)
昨天不得不更新原有的镜像，因此网上搜索了一下，大多数都是Bullshit... 很多人都是抄袭别人的解决方案，根本就没有检验过。

只好自己动手了。

完美解决Docker使用难题，记录一下，以免别的服务器也要使用。

## 方法1：

**1. 如果有宝塔，直接打开/etc/docker目录下的daemon.json文件**

![file](https://scdn.begs.cn/wp-content/uploads/2024/07/1721144576-image-1721144574444.png)

**2. 修改镜像源地址为：**

```shell
https://hub.dftianyi.top
```

### 注意：
如果/etc/docker目录下没有daemon.json文件，可以手动创建这个空白文件，然后粘贴以下所有代码：

```shell
{
  "registry-mirrors": ["https://hub.dftianyi.top"]
}
```
![file](https://scdn.begs.cn/wp-content/uploads/2024/07/1721144824-image-1721144823205.png)


## 方法2：
如果没有可视化面板，就打开服务器的终端，分4步依次复制粘贴以下代码：

**第1步：在etc下 创建文件夹docker**
```shell
sudo mkdir -p /etc/docker
```
**第2步：在daemon.json文件中更新镜像源站**
```shell
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://hub.dftianyi.top"]
}
EOF
```
**第3步：重新加载 systemd 服务**
```shell
sudo systemctl daemon-reload
```
**第4步：重启 Docker 服务**，这一步可能要等个10来秒。
```shell
sudo systemctl restart docker
```

然后就可以去使用docker命令拉取镜像了，速度还可以！


