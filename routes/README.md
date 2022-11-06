## APIs
---

>### Signup User

- Route: `/api/signup`
- Method: `POST`
- **Body:**
```json
{
  "email": "doe@example.com",
  "password": "Password1",
  "firstName": "jon",
  "lastName": "doe",
}
```

- **Response:**

 201 Success
```json
{
    "message": "Signup successful",
    "user": {
        "email": "doe@example.com",
        "firstname": "jon",
        "lastname": "doe",
        "userType": "user",
        "blogs": [],
        "createdAt": 2022-11-04T05:22:34.933+00:00,
        "updatedAt": 2022-11-04T05:22:34.933+00:00,
    }
}
```

>### Login User

- Route: `/api/login`
- Method: `POST`
- **Body:** 

```json
{
    "username": "jon_doe",
    "password": "Password1"
}
```

- **Response:**

200 Success
```json
{
    "token": "sjlkafjkldsfjsd"
}
```


>### Create Blog

- Route: `/api/blog`
- Method: `POST`
- Header
    - Authorization: `Bearer {token}`
- **Body:**
```json
{
    "title": "A random blog",
    "description": "The random blog description",
    "tags": "horror",
    "body": "The gods are dead talks about a th belief of a certain community"
}
```

- **Response:**

201 Success
```json
{
   "_id": "6364a3f0d6f21227e234a920",
   "title": "A random blog",
    "description": "The random blog description",
    "owner": "jon doe",
    "tags": "horror",
    "author": ObjectId
    "body": "The gods are dead talks about a th belief of a certain community",
    "createdAt": 2022-11-04T05:22:34.933+00:00,
    "updatedAt": 2022-11-04T05:22:34.933+00:00,

}
```

>### Get Blog by Id for both Authenticated and Unauthenticated Users

- Route: `/api/home/blog/:id`
- Method: `GET`
- **Response:**

200 Success
```json
[
    {
        "_id": "6364a3f0d6f21227e234a921",
        "title": "A random blog1",
        "description": "The random blog description"
    }
]
```


>### Get all Orders for both Authenticated and Unauthenticated Users

- Route: `/api/home/blog`
- Method: `GET`
- Query params: 
    - page (default: 1) - `/api/home/blog?p=2`
    - per_page (default: 20) - `/api/home/blog?p=2`
    - title - `/api/home/blog?title=the title of the blog`
    - state (default: published)
    - author - `/api/home/blog?author=owner's name in blog db`
    - tags - `/api/home/blog?tag=the blog tag`
    - sort (sortBy : orderBy, default: asc) - `/api/home/blog?sortBy=field in blog db&orderBy=asc or desc`

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

>### Get Blog by Id for Authenticated  Users

- Route: `/api/blog/:id`
- Method: `GET`
- Header
    - Authorization: `Bearer {token}`
- **Response:**

200 Success
```json
[
    {
    "_id": "6364a3f0d6f21227e234a921",
   "title": "A random blog1",
    "description": "The random blog description"
    }
]
```


>### Get all Orders for Authenticated Users

- Route: `/api/home/blog`
- Method: `GET`
- Header
    - Authorization: `Bearer {token}`
- Query params: 
    - page (default: 1) - `/api/blog?p=2`
    - per_page (default: 20) - `/api/blog?p=2`
    - title - `/api/blog?title=the title of the blog`
    - state - `/api/blog?title=the title of the blog`
    - tags - `/api/blog?tag=the blog tag`
    - sort (sortBy : orderBy, default: asc) - `/api/blog?sortBy=field in blog db&orderBy=asc or desc`

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

- Route: `/api/blog/:id`
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

- Route: `/api/blog/:id`
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

- Route: `/api/blog/:id`
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


