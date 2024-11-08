"""Pydantic data models for the API endpoints."""
from pydantic import BaseModel


class SignUpData(BaseModel):
    username: str
    email: str
    display_name: str | None = None


class LoginData(BaseModel):
    username: str
    email: str


class CreatePostData(BaseModel):
    user_id: int
    content: str
    token: str


class EditPostData(BaseModel):
    user_id: int
    content: str
    token: str


class DeletePostData(BaseModel):
    user_id: int
    token: str
