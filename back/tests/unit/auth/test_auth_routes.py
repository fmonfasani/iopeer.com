import os

# Set test database before importing application modules
os.environ['DATABASE_URL'] = 'sqlite:///./test_auth.db'

from fastapi import FastAPI
from fastapi.testclient import TestClient

from agenthub.auth.routes import router
from agenthub.auth.utils import create_access_token
from agenthub.database.connection import Base, engine, SessionLocal
from agenthub.models.user import User


app = FastAPI()
app.include_router(router, prefix="/auth")

Base.metadata.create_all(bind=engine)


def create_user(email: str) -> User:
    db = SessionLocal()
    user = User(email=email, hashed_password="test")
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()
    return user


def get_token(user: User) -> str:
    return create_access_token({"sub": user.email, "user_id": user.id})


client = TestClient(app)


def test_get_current_user_success():
    user = create_user("user@example.com")
    token = get_token(user)
    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == user.id
    assert data["email"] == user.email


def test_get_current_user_invalid_token():
    response = client.get("/auth/me", headers={"Authorization": "Bearer invalid"})
    assert response.status_code == 401

