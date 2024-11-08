"""Backend Entry Point"""

import database
from config import ROOT_REDIRECT
from database import get_db
from datamodels import (CreatePostData, DeletePostData, EditPostData,
                        LoginData, SignUpData)
from fastapi import Depends, FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

tags_metadata = [
    {
        "name": "users",
        "description": "Operations with users.",
    },
    {
        "name": "posts",
        "description": "Operations with posts.",
    },
]

app = FastAPI(
    title="Postboard API",
    summary="A simple postboard application.",
    version="0.1.0",
    openapi_tags=tags_metadata,
)

# TODO: CORS Allowing all for now
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

database.Base.metadata.create_all(bind=database.engine)


@app.get("/")
def read_root():
    return RedirectResponse(url=ROOT_REDIRECT)


@app.get("/posts", tags=["posts"])
def list_posts(db: Session = Depends(get_db)):
    posts = db.query(database.Post).all()
    posts_to_return = [{"post_id": post.id} for post in posts]
    return {"status": "ok", "posts": posts_to_return}


@app.get("/posts/{post_id}", tags=["posts"])
def read_post(post_id: int, response: Response, db: Session = Depends(get_db)):
    post = db.query(database.Post).filter(database.Post.id == post_id).first()
    if post is None:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"status": "error", "message": "Post not found"}
    post_user = db.query(database.User).filter(database.User.id == post.user_id).first()
    result = {
        "id": post.id,
        "content": post.content,
        "created_at": post.created_at,
        "user": {
            "id": post_user.id,
            "username": post_user.username,
            "display_name": post_user.display_name,
        },
    }
    return {"status": "ok", "post": result}


@app.post("/signup", tags=["users"], status_code=status.HTTP_201_CREATED)
def sign_up(data: SignUpData, response: Response, db: Session = Depends(get_db)):
    old_user = db.query(database.User).filter(database.User.username == data.username).first()
    if old_user is not None:
        response.status_code = status.HTTP_409_CONFLICT
        return {"status": "error", "message": "User with this username already exists"}
    new_user = database.User(data.username, data.email, data.display_name)
    db.add(new_user)
    db.commit()
    # TODO: Token
    return {
        "status": "ok",
        "user_id": new_user.id,
        "username": new_user.username,
        "display_name": new_user.display_name,
        "token": "FAKE_TOKEN"
    }


@app.post("/login", tags=["users"])
def login(data: LoginData, response: Response, db: Session = Depends(get_db)):
    user = db.query(database.User).filter(database.User.username == data.username).first()
    if user is None:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"status": "error", "message": "Invalid credentials"}
    user_email = user.email
    if user_email == data.email:
        # TODO: Token
        return {
            "status": "ok",
            "user_id": user.id,
            "username": user.username,
            "display_name": user.display_name,
            "token": "FAKE_TOKEN"
        }
    response.status_code = status.HTTP_401_UNAUTHORIZED
    return {"status": "error", "message": "Invalid credentials"}


@app.post("/posts", tags=["posts"], status_code=status.HTTP_201_CREATED)
def create_post(data: CreatePostData, response: Response, db: Session = Depends(get_db)):
    # TODO: Token
    user = db.query(database.User).filter(database.User.id == data.user_id).first()
    if user is None:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"status": "error", "message": "Invalid credentials"}
    post = database.Post(data.user_id, data.content)
    db.add(post)
    db.commit()
    return {"status": "ok", "post_id": post.id}


@app.put("/posts/{post_id}", tags=["posts"])
def edit_post(post_id: int, response: Response, data: EditPostData, db: Session = Depends(get_db)):
    post = db.query(database.Post).filter(database.Post.id == post_id).first()
    if post is None:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"status": "error", "message": "Post not found"}
    # TODO: Token
    post.content = data.content
    db.commit()
    return {"status": "ok", "post_id": post_id}


@app.delete("/posts/{post_id}", tags=["posts"])
def delete_post(post_id: int, response: Response, _data: DeletePostData, db: Session = Depends(get_db)):
    post = db.query(database.Post).filter(database.Post.id == post_id).first()
    if post is None:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"status": "error", "message": "Post not found"}
    # TODO: Token
    db.delete(post)
    db.commit()
    return {"status": "ok", "post_id": post_id}
