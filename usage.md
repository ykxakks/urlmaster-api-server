# How to use the API server?

## access course by course id

```
GET http://localhost:8080/api/v1/courses/{courseId}
```

To change the course content:
```
POST http://localhost:8080/api/v1/courses/{courseId} {course-content-stringified-json}
```

## access user by user id

```
GET http://localhost:8080/api/v1/users/{userId}
```

To change the course content:
```
POST http://localhost:8080/api/v1/users/{userID} {user-content-stringified-json}
```

## search courses by query

```
GET http://localhost:8080/api/v1/courses/search?{query-string}
```

The form of query string: "day=Mon&period=1&max=10".

Only the name & course id will be returned. Parameter "max" is for the maximum number of courses to be returned: if not set, all courses with given period will be returned for now, but in the future the behavior should be set with a default max number.

## try to activate user account
```
GET http://localhost:8080/api/v1/users/activate?id={userId}&code={validationCode}
```

Use GET here, so it can be achieved by sending user an email with this link.

