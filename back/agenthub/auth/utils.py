"""Utility functions for authentication."""

from datetime import datetime, timedelta
import os

from fastapi import HTTPException, status
from passlib.context import CryptContext
from jose import jwt, JWTError
from agenthub.config import config


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Load secret key from env or config with a sensible default
SECRET_KEY = os.getenv(
    "AGENTHUB_SECRET_KEY",
    config.get("secret_key", "dev-secret-key"),
)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def hash_password(password: str) -> str:
    """Hash a plaintext password."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against a hash."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict) -> str:
    """Create a signed JWT token with an expiration date."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_access_token(token: str) -> dict:
    """Decode a JWT and return its payload.

    Raises HTTPException if the token is invalid."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as exc:  # pragma: no cover - simple error mapping
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc
