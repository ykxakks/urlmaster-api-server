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

Access http://localhost:8080/api/v1/user/activate/456?code=654321 to activate another pre-created user with id 456. You can see the change before and after the user has been activated by access http://localhost:8080/api/v1/user/456 .

To test POST requests for users: use curl to send a POST request with JSON as body like: 

```console
curl -X POST http://localhost:8080/api/v1/user/123 -H 'Content-Type: application/json' -d '{"courses":["c++"],"alias":{"cpp":"c++"}}'
```
and then access again to user with id 123 to see the difference. Note that for now the server will replace the current data of "alias" and "courses" with the data provided by the requests but not append them.

To create a new user, send a POST request such as 
```console
curl -X POST http://localhost:8080/api/v1/user/789 -H 'Content-Type: application/json' -d '{"mail":"ggg@gmail.com","code":"74751"}'
```
And a new user of id 789 has been added. You can then use GET(or just type the url them in your browser) to see the data of new user. Note that the front server must provide an activation code.

All the actions in the test will be saved to the database, so if you want to test them again, run the following commands to clear the database and create a new one:
```console
rm -r leveldb
mkdir leveldb
```
Note that the test users will be automatically added. You can check them in features/user/userFuncs.js.

## Test course server

Access http://localhost:8080/api/v1/course/123 to see a pre-added course of name "c++", on 1st period of Monday. 

To change a course, run command like
```console
curl -X POST http://localhost:8080/api/v1/course/456 -H 'Content-Type: application/json' -d '{"day":"Tue","period":"2"}'
```
This request will change another course named "java" with id 456, make it on 2nd period of Tuesday. You can check http://localhost:8080/api/v1/course/456 before and after this request to see the difference.

To add a new course, run command like
```console
curl -X POST http://localhost:8080/api/v1/course/789 -H 'Content-Type: application/json' -d '{"name":"go"}'
```
This will add a new course of name "go", with id 789. You can then check http://localhost:8080/api/v1/course/789 for the information of this newly added course.

To test a filter, access http://localhost:8080/api/v1/course/search/query?day=Mon&period=1 , and all courses on 1st period of Monday will be returned. You can also use only day filter, period filer, or no filter at all. If you editted the course with id 456, you can check there is a course on Tuesday.

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
