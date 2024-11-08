"""SQLAlchemy models and utility functions for the database."""

from datetime import datetime

from config import DATABASE_URL
from sqlalchemy import DateTime, ForeignKey, String, Text, create_engine
from sqlalchemy.orm import (Mapped, declarative_base, mapped_column,
                            relationship, sessionmaker)

Base = declarative_base()


class User(Base):
    """A user account."""
    __tablename__ = "users"

    id: Mapped[int] = mapped_column("id", primary_key=True)
    username: Mapped[str] = mapped_column("username", String(128), nullable=False, unique=True)
    display_name: Mapped[str] = mapped_column("display_name", String(128), nullable=True)
    email: Mapped[str] = mapped_column("email", String(128), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        "created_at", DateTime, nullable=False)
    posts: Mapped[list["Post"]] = relationship(back_populates="user")

    def __init__(self, username: str, email: str, display_name: str | None = None):
        self.username = username
        self.email = email
        self.display_name = display_name
        self.created_at = datetime.now()

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, email={self.email})>"


class Post(Base):
    """A post."""
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column("id", primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), nullable=False)
    content: Mapped[str] = mapped_column("content", Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        "created_at", DateTime, nullable=False)
    user: Mapped[User] = relationship("User", back_populates="posts")

    def __init__(self, user_id: int, content: str):
        self.user_id = user_id
        self.content = content
        self.created_at = datetime.now()

    def __repr__(self):
        return f"<Post(id={self.id}, user_id={self.user_id}, length={len(self.content)})>"


engine = create_engine(
    DATABASE_URL, echo=True, #connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
