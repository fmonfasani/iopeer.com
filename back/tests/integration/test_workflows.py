import os
import sys
from pathlib import Path
from passlib.context import CryptContext
from fastapi.testclient import TestClient
import pytest

os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")

sys.path.append(str(Path(__file__).resolve().parents[2]))

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


@pytest.fixture
def auth_headers():
    db = SessionLocal()
    user = db.query(User).filter(User.email == "auth@example.com").first()
    if not user:
        user = create_user("auth@example.com", "secret")
    token = create_access_token({"sub": user.email, "user_id": user.id})
    db.close()
    return {"Authorization": f"Bearer {token}"}


def test_list_workflows_unauthorized():
    resp = client.get("/api/v1/workflows")
    assert resp.status_code == 403


def test_list_workflows_authorized(auth_headers):
    resp = client.get("/api/v1/workflows", headers=auth_headers)
    assert resp.status_code == 200


def test_create_workflow_requires_auth():
    payload = {
        "workflow_id": "wf_public",
        "name": "WF Public",
        "nodes": [],
        "connections": []
    }
    resp = client.post("/api/v1/workflows", json=payload)
    assert resp.status_code == 403


def test_create_workflow_authorized(auth_headers):
    payload = {
        "workflow_id": "wf_auth",
        "name": "WF Auth",
        "nodes": [],
        "connections": []
    }
    resp = client.post("/api/v1/workflows", json=payload, headers=auth_headers)
    assert resp.status_code == 201
