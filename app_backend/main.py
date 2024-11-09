"""Backend Entry Point"""

from datetime import timedelta

from fastapi import Depends, FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

import database
import datamodels
from config import ROOT_REDIRECT
from database import get_db
from tokendb import TokenDB

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

token_db = None
@app.on_event("startup")
async def startup_event():
    global token_db
    token_db = TokenDB(timedelta(hours=1))

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
def sign_up(data: datamodels.SignUpData, response: Response, db: Session = Depends(get_db)):
    old_user = db.query(database.User).filter(database.User.username == data.username).first()
    if old_user is not None:
        response.status_code = status.HTTP_409_CONFLICT
        return {"status": "error", "message": "User with this username already exists"}
    new_user = database.User(data.username, data.email, data.display_name)
    db.add(new_user)
    db.commit()
    token = token_db.create_token(new_user.id)
    return {
        "status": "ok",
        "user_id": new_user.id,
        "username": new_user.username,
        "display_name": new_user.display_name,
        "token": token
    }


@app.post("/login", tags=["users"])
def login(data: datamodels.LoginData, response: Response, db: Session = Depends(get_db)):
    user = db.query(database.User).filter(database.User.username == data.username).first()
    if user is None:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"status": "error", "message": "Invalid credentials"}
    user_email = user.email
    if user_email != data.email:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"status": "error", "message": "Invalid credentials"}
    token = token_db.create_token(user.id)
    return {
        "status": "ok",
        "user_id": user.id,
        "username": user.username,
        "display_name": user.display_name,
        "token": token
    }

@app.post("/logout", tags=["users"])
def logout(data: datamodels.LogoutData, response: Response):
    if not token_db.verify_token(data.token, data.user_id):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"status": "error", "message": "Invalid token"}
    token_db.delete_token(data.user_id)
    return {"status": "ok"}


@app.post("/posts", tags=["posts"], status_code=status.HTTP_201_CREATED)
def create_post(data: datamodels.CreatePostData, response: Response, db: Session = Depends(get_db)):
    user = db.query(database.User).filter(database.User.id == data.user_id).first()
    if user is None:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"status": "error", "message": "Invalid credentials"}
    if not token_db.verify_token(data.token, data.user_id):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"status": "error", "message": "Invalid token"}
    post = database.Post(data.user_id, data.content)
    db.add(post)
    db.commit()
    return {"status": "ok", "post_id": post.id}


@app.put("/posts/{post_id}", tags=["posts"])
def edit_post(post_id: int, response: Response, data: datamodels.EditPostData, db: Session = Depends(get_db)):
    post = db.query(database.Post).filter(database.Post.id == post_id).first()
    if post is None:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"status": "error", "message": "Post not found"}
    if post.user_id != data.user_id:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"status": "error", "message": "Invalid credentials"}
    if not token_db.verify_token(data.token, data.user_id):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"status": "error", "message": "Invalid token"}
    post.content = data.content
    db.commit()
    return {"status": "ok", "post_id": post_id}


@app.delete("/posts/{post_id}", tags=["posts"])
def delete_post(post_id: int, response: Response, data: datamodels.DeletePostData, db: Session = Depends(get_db)):
    post = db.query(database.Post).filter(database.Post.id == post_id).first()
    if post is None:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"status": "error", "message": "Post not found"}
    if post.user_id != data.user_id:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"status": "error", "message": "Invalid credentials"}
    if not token_db.verify_token(data.token, data.user_id):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"status": "error", "message": "Invalid token"}
    db.delete(post)
    db.commit()
    return {"status": "ok", "post_id": post_id}
