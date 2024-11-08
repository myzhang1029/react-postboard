"""In-memory database for storing login tokens."""

import random
import functools
from datetime import datetime, timedelta

class TokenDB:
    _data = {}

    def __init__(self, token_lifetime: timedelta):
        self.token_lifetime = token_lifetime

    def create_token(self, user_id: int) -> str:
        """Create a new token for the user."""
        token = self._generate_token()
        self._data[token] = {
            "user_id": user_id,
            "created_at": datetime.now()
        }
        return token

    def _generate_token(self) -> str:
        return "".join(random.choices("abcdef0123456789", k=32))

    @functools.lru_cache(maxsize=1)
    def verify_token(self, token: str, user_id: int) -> bool:
        """Verify the token for the user."""
        if token not in self._data:
            return False
        if self._data[token]["user_id"] != user_id:
            return False
        if datetime.now() - self._data[token]["created_at"] > self.token_lifetime:
            self.delete_token(token)
            return False
        return True

    def delete_token(self, token: str):
        """Delete the token."""
        if token in self._data:
            del self._data[token]
