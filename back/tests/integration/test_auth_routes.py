import os
from passlib.context import CryptContext
from fastapi.testclient import TestClient

os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")

from agenthub.main import app
from agenthub.database.connection import Base, engine, SessionLocal
from agenthub.models.user import User
from agenthub.auth.utils import create_access_token

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def setup_module(module):
    Base.metadata.create_all(bind=engine)

def teardown_module(module):
    Base.metadata.drop_all(bind=engine)


def create_user(email: str, password: str) -> User:
    db = SessionLocal()
    user = User(email=email, hashed_password=pwd_context.hash(password))
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()
    return user


client = TestClient(app)


def test_get_current_user_with_valid_token():
    user = create_user("valid@example.com", "secret")
    token = create_access_token({"sub": user.email, "user_id": user.id})
    resp = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == user.id
    assert data["email"] == user.email
    assert data["is_active"] == user.is_active


def test_get_current_user_invalid_token():
    resp = client.get("/auth/me", headers={"Authorization": "Bearer badtoken"})
    assert resp.status_code == 401

