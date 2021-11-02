# API Server

## 開発環境

install dependencies

```
yarn install
```

start

```
yarn dev
```

access http://localhost:8080/api/v1/hello

#### 環境変数

|環境変数|説明|
|:--|:--|
|`APP_PORT`|port to listen|
|`APP_HOST`|host to listen|

## Docker

at the repository root

```
docker-compose up api-server
```

access http://localhost:8081/api/v1/hello

#### 環境変数

|環境変数|説明|
|:--|:--|
|`API_PORT`|port to listen|
