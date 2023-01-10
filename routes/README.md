## APIs
---

>### Signup User

- Route: `/api/v1/signup`
- Method: `POST`
- **Body:**
```json
{
  "email": "tuyojr@oluwaseun.com",
  "password": "agbaCoder",
  "firstName": "tuyo",
  "lastName": "jr"
}
```

- **Response:**

 201 Success
```json
{
    "message": "Signup successful",
    "user": {
        "email": "tuyojr@oluwaseun.com",
        "firstName": "tuyo",
        "lastName": "jr"
        "userType": "user",
        "blogs": [],
        "createdAt": 2022-11-04T05:22:34.933+00:00,
        "updatedAt": 2022-11-04T05:22:34.933+00:00,
    }
}
```

>### Login User

- Route: `/api/v1/login`
- Method: `POST`
- **Body:** 

```json
{
    "email": "tuyojr@oluwaseun.com",
    "password": "agbaCoder",
}
```

- **Response:**

200 Success
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjM2OGYwNDk5YzQ3ZDdiZTJiODQ4ZjU2IiwiZW1haWwiOiJ0dXlvanJAb2x1d2FzdWVuLmNvbSJ9LCJpYXQiOjE2Njc4MjE4MjUsImV4cCI6MTY2NzgyNTQyNX0.D7n0tEsCabqM6BkjkLP71cPiC2tyJ_pDc5oPIB8MXXw"
}
```


>### Create Blog

- Route: `/api/v1/blog`
- Method: `POST`
- Header
    - Authorization: `Bearer {token}`
- **Body:**
```json
{
    "title": "Amazing Work2",
    "description": "He's Called Sherlock For A Reason",
    "tags": "Appreciation",
    "body": "jhhornn did an amazing work putting together this project. Up only from here."
}
```

- **Response:**

201 Success
```json
{
    "_id": "6368f2589c47d7be2b848f5e",
    "title": "Amazing Work",
    "description": "He's Called Sherlock For A Reason",
    "owner": "tuyo jr",
    "author": "6368f0499c47d7be2b848f56",
    "state": "draft",
    "tags": [
"Appreciation"
],
    "body": "jhhornn did an amazing work putting together this project. Up only from here.",
    "createdAt": "2022-11-07T11:56:08.735Z",
    "updatedAt": "2022-11-07T15:44:41.629Z",
    "readCount": 0,
    "readingTime": 1

}
```

>### Get Blog by blog Id for both Authenticated and Unauthenticated Users

- Route: `/api/v1/home/blog/:id`
- Method: `GET`
- **Response:**

200 Success
```json
[
    {
    "_id": "6368f2589c47d7be2b848f5e",
    "title": "Amazing Work",
    "description": "He's Called Sherlock For A Reason",
    "owner": "tuyo jr",
    "author": "6368f0499c47d7be2b848f56",
    "state": "published",
    "tags": [
"Appreciation"
],
    "body": "jhhornn did an amazing work putting together this project. Up only from here.",
    "createdAt": "2022-11-07T11:56:08.735Z",
    "updatedAt": "2022-11-07T15:44:41.629Z",
    "readCount": 1,
    "readingTime": 1
    }
]
```


>### Get all Blogs for both Authenticated and Unauthenticated Users

- Route: `/api/v1/home/blog`
- Method: `GET`
- Query params: 
    - page (default: 1) - `/api/v1/home/blog?p=2`
    - per_page (default: 20) - `/api/v1/home/blog?p=2`
    - title - `/api/v1/home/blog?title=the title of the blog`
    - state (default: published)
    - author - `/api/v1/home/blog?author=owner's name in blog db`
    - tags - `/api/v1/home/blog?tag=the blog tag`
    - sort - `/api/v1/blog?sort=-any field name` the - in front signifies descending order while ascending is without the -

- **Response:**



200 Success
```json
[
    {
        "_id": "6364a3f0d6f21227e234a921",
        "title": "A random blog1",
        "description": "The random blog description"
    },
    {
        "_id": "6364a3f0d6f21227e234a922",
        "title": "A random blog2",
        "description": "The random blog description"
    },
    {
        "_id": "6364a3f0d6f21227e234a923",
        "title": "A random blog3",
        "description": "The random blog description"
    },
    {
        "_id": "6364a3f0d6f21227e234a924",
        "title": "A random blog4",
        "description": "The random blog description"
    },
    {
        "_id": "6368f2589c47d7be2b848f5e",
        "title": "Amazing Work",
        "description": "He's Called Sherlock For A Reason"
    }
]
```

>### Get Blog by Id for Authenticated  Users

- Route: `/api/v1/blog/:id`
- Method: `GET`
- Header
    - Authorization: `Bearer {token}`
- **Response:**

200 Success
```json
[
    {
    "_id": "6368f2589c47d7be2b848f5e",
    "title": "Amazing Work",
    "description": "He's Called Sherlock For A Reason",
    "owner": "tuyo jr",
    "author": "6368f0499c47d7be2b848f56",
    "state": "draft",
    "tags": [
"Appreciation"
],
    "body": "jhhornn did an amazing work putting together this project. Up only from here.",
    "createdAt": "2022-11-07T11:56:08.735Z",
    "updatedAt": "2022-11-07T15:44:41.629Z",
    "readCount": 1,
    "readingTime": 1
    }
]
```


>### Get all Blogs for Authenticated Users

- Route: `/api/v1/home/blog`
- Method: `GET`
- Header
    - Authorization: `Bearer {token}`
- Query params: 
    - page (default: 1) - `/api/v1/blog?p=2`
    - per_page (default: 20) - `/api/blog?p=2`
    - title - `/api/v1/blog?title=the title of the blog`
    - state - `/api/v1/blog?title=the title of the blog`
    - tags - `/api/v1/blog?tag=the blog tag`
    - sort - `/api/v1/blog?sort=-any field name` the - in front signifies descending order while ascending is without the -

- **Response:**



200 Success
```json
[
    {
    "_id": "6364a3f0d6f21227e234a921",
   "title": "A random blog1",
    "description": "The random blog description"
    },
    {
    "_id": "6364a3f0d6f21227e234a922",
   "title": "A random blog2",
    "description": "The random blog description"
    },
    {
    "_id": "6364a3f0d6f21227e234a923",
   "title": "A random blog3",
    "description": "The random blog description"
    },
    {
    "_id": "6364a3f0d6f21227e234a924",
   "title": "A random blog4",
    "description": "The random blog description"
    }
]
```
>### Update blog by Authenticated and Authorised User

- Route: `/api/v1/blog/:id`
- Method: `PUT`
- Header
    - Authorization: `Bearer {token}`
- **Body:**

```json
    {
        "title": "What a title",
        "description": "The gods are dead",
        "tags": "horror",
        "body": "The gods are dead talks about a th belief of a certain community"

    }
```

- **Response:**



201 Success
```json
    {
        "message": "Blog successfully updated"
    }
```

>### Update blog state by Authenticated and Authorised User

- Route: `/api/v1/blog/:id`
- Method: `PATCH`
- Header
    - Authorization: `Bearer {token}`

- **Response:**



200 Success
```json
    {
        "message": "Blog state successfully updated"
    }
```
>### Delete blog by Authenticated and Authorised User

- Route: `/api/v1/blog/:id`
- Method: `DELETE`
- Header
    - Authorization: `Bearer {token}`


- **Response:**



200 Success
```json
    {
        "message": "Blog deleted"
    }
```
---


