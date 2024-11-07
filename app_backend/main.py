"""Backend Entry Point"""

from fastapi import Depends, FastAPI, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

import database
from config import ROOT_REDIRECT
from database import get_db
from datamodels import SignUpData, LoginData, CreatePostData, EditPostData, DeletePostData

app = FastAPI()
database.Base.metadata.create_all(bind=database.engine)


@app.get("/")
def read_root():
    return RedirectResponse(url=ROOT_REDIRECT)


@app.get("/posts")
def read_posts(db: Session = Depends(get_db)):
    posts = db.query(database.Post).all()
    posts_to_return = [{"post_id": post.id} for post in posts]
    return {"status": "ok", "posts": posts_to_return}


@app.get("/posts/{post_id}")
def read_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(database.Post).filter(database.Post.id == post_id).first()
    if post is None:
        return HTTPException(status_code=404, detail={"status": "error", "message": "Post not found"})
    return {"status": "ok", "post_id": post_id, "content": post.content}


@app.post("/signup")
def sign_up(data: SignUpData, db: Session = Depends(get_db)):
    old_user = db.query(database.User).filter(database.User.username == data.username).first()
    if old_user is not None:
        return HTTPException(status_code=409, detail={"status": "error", "message": "User with this username already exists"})
    new_user = database.User(data.username, data.email, data.display_name)
    db.add(new_user)
    db.commit()
    # TODO: Token
    return {"status": "ok", "user_id": new_user.id, "username": new_user.username, "token": "FAKE_TOKEN"}


@app.post("/login")
def login(data: LoginData, db: Session = Depends(get_db)):
    user = db.query(database.User).filter(database.User.username == data.username).first()
    if user is None:
        return HTTPException(status_code=404, detail={"status": "error", "message": "User not found"})
    user_email = user.email
    if user_email == data.email:
        # TODO: Token
        return {"status": "ok", "user_id": user.id, "username": user.username, "token": "FAKE_TOKEN"}
    return HTTPException(status_code=401, detail={"status": "error", "message": "Invalid email"})


@app.post("/posts")
def create_post(data: CreatePostData, db: Session = Depends(get_db)):
    # TODO: Token
    user = db.query(database.User).filter(database.User.id == data.user_id).first()
    if user is None:
        return HTTPException(status_code=404, detail={"status": "error", "message": "User not found"})
    post = database.Post(data.user_id, data.content)
    db.add(post)
    db.commit()
    return {"status": "ok", "post_id": post.id}


@app.put("/posts/{post_id}")
def edit_post(post_id: int, data: EditPostData, db: Session = Depends(get_db)):
    post = db.query(database.Post).filter(database.Post.id == post_id).first()
    if post is None:
        return {"status": "error", "message": "Post not found"}
    # TODO: Token
    post.content = data.content
    db.commit()
    return {"status": "ok", "post_id": post_id}


@app.delete("/posts/{post_id}")
def delete_post(post_id: int, data: DeletePostData, db: Session = Depends(get_db)):
    post = db.query(database.Post).filter(database.Post.id == post_id).first()
    if post is None:
        return {"status": "error", "message": "Post not found"}
    # TODO: Token
    db.delete(post)
    db.commit()
    return {"status": "ok", "post_id": post_id}
