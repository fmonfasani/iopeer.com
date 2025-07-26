import os
from unittest.mock import MagicMock

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

# Ensure DATABASE_URL is defined before importing routes
os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")

from agenthub.auth.routes import router
from agenthub.auth.utils import create_access_token
from agenthub.models.user import User
from agenthub.database.connection import get_db


def build_client(user: User):
    app = FastAPI()
    app.include_router(router)

    mock_query = MagicMock()
    mock_query.filter.return_value.first.return_value = user
    db = MagicMock()
    db.query.return_value = mock_query

    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db
    return TestClient(app)


def test_get_current_user_valid_token():
    user = User(id=1, email="test@example.com", hashed_password="x", is_active=True)
    client = build_client(user)
    token = create_access_token({"sub": user.email, "user_id": user.id})
    response = client.get("/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == user.id
    assert data["email"] == user.email


def test_get_current_user_invalid_token():
    user = User(id=1, email="test@example.com", hashed_password="x", is_active=True)
    client = build_client(user)
    response = client.get("/me", headers={"Authorization": "Bearer invalid"})
    assert response.status_code == 401

