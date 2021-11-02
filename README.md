# API Server

## 開発環境

install dependencies

```
yarn install
```

create database folder:
```console
mkdir leveldb
```

start

```
yarn dev
```

access http://localhost:8080/api/v1/hello

## Test user server

Access http://localhost:8080/api/v1/user/123 to see a pre-created user info. Also access http://localhost:8080/api/v1/user/124 to see a response with user not existing.

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
