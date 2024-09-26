---
title: 私有化知识库FastGPT升级 V4.6.8 教程
description: 私有化知识库FastGPT升级V4.6.8教程
date: '2024-08-11T13:16:44.231Z'
lastModified: '2024-09-26T08:57:53.173Z'
---
![file](https://scdn.begs.cn/wp-content/uploads/2024/02/1708073186-image-1708073186820.png)

FastGPT 是一个基于 LLM 大语言模型的知识库问答系统，提供开箱即用的数据处理、模型调用等能力。同时可以通过 Flow 可视化进行工作流编排，从而实现复杂的问答场景！

FastGPT是非常实用并且相当厉害的个人知识库AI项目，项目是非常厉害的，更新的方法也必须得厉害和复杂到配得上这个项目！

经历过多次升级失败重新部署项目再重新导入知识库后，龚老师也多了个心眼：创建快照！
——不行就回滚！

所以每次最期待却又担心的事就是FastGPT又更新啦！

这不？

github 的 Issues里，很多高手都卡在了升级4.6.8上，龚老师一开始当然也没能幸免。

不过好在，经过10几个小时的昼夜奋斗摸索，终于搞定了。

>注意：以下教程适用于从4.6.7升级到4.6.8。如果你是从低版本升级上来的，记得去官方教程上看看相应的升级教程，写了要初始化的就一定要从低版本开始逐步初始化，千万不要自作聪明直接跳过。


注意：以下教程基于linux系统。
## 第一步：修改docker-compose.yml 代码
修改docker-compose.yml 里mongo部分的代码，补上command和mongodb.key

```shell
mongo:
  image: mongo:5.0.18
  # image: registry.cn-hangzhou.aliyuncs.com/fastgpt/mongo:5.0.18 # 阿里云
  container_name: mongo
  # 端口号 可以保持默认的'27017'，如果要修改，就修改前面的'27018'
  ports:
    - 27018:27017
  networks:
    - fastgpt
  command: mongod --keyFile /data/mongodb.key --replSet rs0
  environment:
    # 下面的用户名和密码如果你之前用的username/password，就仍然用之前的。
    - MONGO_INITDB_ROOT_USERNAME=myname
    - MONGO_INITDB_ROOT_PASSWORD=mypassword
  volumes:
    - ./mongo/data:/data/db
    - ./mongodb.key:/data/mongodb.key
```


**windows下不能修改权限的问题，有网友说修改 `docker-compose.yml` 可解决，将内容替换为：**

```shell
  mongo:
    image: mongo:5.0.18
    # image: registry.cn-hangzhou.aliyuncs.com/fastgpt/mongo:5.0.18 # 阿里云
    container_name: mongo
    ports:
      - 27017:27017
    networks:
      - fastgpt
    command: mongod --keyFile /data/mongodb.key --replSet rs0
    environment:
      # 默认的用户名和密码，只有首次允许有效
      - MONGO_INITDB_ROOT_USERNAME=myname
      - MONGO_INITDB_ROOT_PASSWORD=mypassword
    volumes:
      - ./mongo/data:/data/db
      - ./mongodb.key:/data/mongodb.key
    entrypoint:
      - bash
      - -c
      - |
          chmod 400 /data/mongodb.key
          chown 999:999 /data/mongodb.key
          exec docker-entrypoint.sh $$@
```


## 第二步：修改config.json代码：

直接复制以下代码替换掉原来的：

```shell
{
  "systemEnv": {
    "openapiPrefix": "fastgpt",
    "vectorMaxProcess": 15,
    "qaMaxProcess": 15,
    "pgHNSWEfSearch": 100
  },
  "llmModels": [
    {
      "model": "gpt-3.5-turbo-1106",
      "name": "gpt-3.5-turbo",
      "maxContext": 16000,
      "maxResponse": 4000,
      "quoteMaxToken": 13000,
      "maxTemperature": 1.2,
      "inputPrice": 0,
      "outputPrice": 0,
      "censor": false,
      "vision": false,
      "datasetProcess": false,
      "toolChoice": true,
      "functionCall": false,
      "customCQPrompt": "",
      "customExtractPrompt": "",
      "defaultSystemChatPrompt": "",
      "defaultConfig": {}
    },
    {
      "model": "gpt-3.5-turbo-16k",
      "name": "gpt-3.5-turbo-16k",
      "maxContext": 16000,
      "maxResponse": 16000,
      "quoteMaxToken": 13000,
      "maxTemperature": 1.2,
      "inputPrice": 0,
      "outputPrice": 0,
      "censor": false,
      "vision": false,
      "datasetProcess": true,
      "toolChoice": true,
      "functionCall": false,
      "customCQPrompt": "",
      "customExtractPrompt": "",
      "defaultSystemChatPrompt": "",
      "defaultConfig": {}
    },
    {
      "model": "gpt-4-0125-preview",
      "name": "gpt-4-turbo",
      "maxContext": 125000,
      "maxResponse": 4000,
      "quoteMaxToken": 100000,
      "maxTemperature": 1.2,
      "inputPrice": 0,
      "outputPrice": 0,
      "censor": false,
      "vision": false,
      "datasetProcess": false,
      "toolChoice": true,
      "functionCall": false,
      "customCQPrompt": "",
      "customExtractPrompt": "",
      "defaultSystemChatPrompt": "",
      "defaultConfig": {}
    },
    {
      "model": "gpt-4-vision-preview",
      "name": "gpt-4-vision",
      "maxContext": 128000,
      "maxResponse": 4000,
      "quoteMaxToken": 100000,
      "maxTemperature": 1.2,
      "inputPrice": 0,
      "outputPrice": 0,
      "censor": false,
      "vision": false,
      "datasetProcess": false,
      "toolChoice": true,
      "functionCall": false,
      "customCQPrompt": "",
      "customExtractPrompt": "",
      "defaultSystemChatPrompt": "",
      "defaultConfig": {}
    }
  ],
  "vectorModels": [
    {
      "model": "text-embedding-ada-002",
      "name": "Embedding-2",
      "inputPrice": 0,
      "outputPrice": 0,
      "defaultToken": 700,
      "maxToken": 3000,
      "weight": 100,
      "defaultConfig": {}
    }
  ],
  "reRankModels": [],
  "audioSpeechModels": [
    {
      "model": "tts-1",
      "name": "OpenAI TTS1",
      "inputPrice": 0,
      "outputPrice": 0,
      "voices": [
        { "label": "Alloy", "value": "alloy", "bufferId": "openai-Alloy" },
        { "label": "Echo", "value": "echo", "bufferId": "openai-Echo" },
        { "label": "Fable", "value": "fable", "bufferId": "openai-Fable" },
        { "label": "Onyx", "value": "onyx", "bufferId": "openai-Onyx" },
        { "label": "Nova", "value": "nova", "bufferId": "openai-Nova" },
        { "label": "Shimmer", "value": "shimmer", "bufferId": "openai-Shimmer" }
      ]
    }
  ],
  "whisperModel": {
    "model": "whisper-1",
    "name": "Whisper1",
    "inputPrice": 0,
    "outputPrice": 0
  }
}
```


## 第三步：创建 mongo 密钥，赋予密钥文件权限: 

打开终端， CD 进项目的目录，如果安装了宝塔，直接在项目的目录界面点击`终端`。

![file](https://scdn.begs.cn/wp-content/uploads/2024/02/1708070982-image-1708070983045.png)

在终端输入代码：

`openssl rand -base64 756 > ./mongodb.key`

接着再输入：`chmod 600 ./mongodb.key`

**接着再输入：**`chown 999:root ./mongodb.key`

**(！！！这一步很关键，如果不输入这一步，就无法启动Mongo容器，后面就会出现一系列令人抓狂的错误)**

## 第四步：重启所有容器。
依次在终端输入以下代码：
```shell
# 重启 Mongo
docker-compose down
docker-compose up -d
```
此时，可以去Docker界面看看mongo是否正常启动，如果没有启动，就手动启动一下。

## 第五步：进入容器初始化部分集合
1. 先在终端输入：`docker exec -it mongo bash`

2. 再输入：`mongo -u myname -p mypassword --authenticationDatabase admin`

3. (注意这里的`myname`和`mypassword`,要和`docker-compose.yml` 里`mongo`部分的代码一致。)

4. 初始化副本集。在终端输入以下代码：
```shell
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo:27017" }
  ]
})
```

5. 检查状态。
输入：`rs.status()` 如果提示 `rs0` 状态，则代表运行成功

## 第六步：更新容器
在终端输入以下代码：
```shell
docker-compose down && docker-compose pull && docker-compose up -d
```

此时刷新一下自己的FastGPT网站,应该就能显示4.6.8了。

![file](https://scdn.begs.cn/wp-content/uploads/2024/02/1708072611-image-1708072611405.png)


## 可能会出现的问题：


1. 导入知识库时提示`null value in column "tmb_id" of relation "modeldata" violates not-null constraint`

这可能是因为没有初始化4.6.7，或初始化4.6.7出现了某首错误，比如rootkey不正确；

2. 已经显示4.6.8，但对话或导入模型时提示没有模型。
需要重新拉取最新的容器：
```shell
docker-compose down && docker-compose pull && docker-compose up -d
```
3. 初始化mongo副本集提示`This node was not started with the replSet option`

这是因为`mongodb.key`的权限不够，需要再在终端输入：`chown 999:root ./mongodb.key`








