# Project Design

## Database Schema
There should be two tables in the database: for users and posts.

The `users` table should have the following columns:
- id (int, primary key)
- username (string)
- display_name (string)
- email (string)
- created_at (datetime)

The `posts` table should have the following columns:
- id (int, primary key)
- user_id (int, foreign key to user.id)
- content (string)
- created_at (datetime)

## API Design
The API is designed to make this workflow possible:

### Before login
- `GET /posts`: Get all posts
- `GET /posts/{post_id}`: Get details and content of a post

### Loggin in
- `POST /signup`: Create a new user
- `POST /login`: Login

### After login
- `POST /posts`: Create a new post
- `PUT /posts/{post_id}`: Update a post
- `DELETE /posts/{post_id}`: Delete a post
- `GET /users`: Get all users

The API should be accept and return JSON data. Specification (in Python syntax) is as follows:
- `GET /posts`:
    - Request: `None`
    - Good Response: `{ "status": "ok", "posts": [ ... ] }`
    - Error Response: `{ "status": "error", "message": str }`

- `GET /posts/{post_id}`:
    - Request: `None`
    - Good Response:
    ```
    {
        "status": "ok",
        "post": {
            "id": int,
            "user": {
                "id": int,
                "username": str,
                "display_name": str | None
            },
            "content": str,
            "created_at": str
        }
    }
    ```
    - Error Response: same as above

- `POST /signup`:
    - Request: `{ "username": str, "email": str, "display_name": str | None }`
    - Good Response: `{ "status": "ok", "user_id": int, "username": str, "display_name": str | None, "token": str }`
    - Error Response: same as above

- `POST /login`:
    - Request: `{ "username": str, "email": str }`
    - Good Response: `{ "status": "ok", "user_id": int, "username": str, "display_name": str | None, "token": str }`
    - Error Response: same as above

- `POST /posts`:
    - Request: `{ "user_id": int, "content": str, "token": str }`
    - Good Response: `{ "status": "ok", "post_id": int }`
    - Error Response: same as above

- `PUT /posts/{post_id}`:
    - Request: `{ "user_id": int, "content": str, "token": str }`
    - Good Response: `{ "status": "ok", "post_id": int }`
    - Error Response: same as above

- `DELETE /posts/{post_id}`:
    - Request: `{ "user_id": int, "token": str }`
    - Good Response: `{ "status": "ok", "post_id": int }`
    - Error Response: same as above

## Frontend Design
