"""Configuration parameters."""

import os

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set")


ROOT_REDIRECT = "https://maiyun.me"
