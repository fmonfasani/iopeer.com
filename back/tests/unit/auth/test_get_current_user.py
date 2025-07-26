import os
from importlib import reload

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

@pytest.fixture
def client(tmp_path):
    os.environ["DATABASE_URL"] = f"sqlite:///{tmp_path}/test.db"
    import agenthub.database.connection as connection
    reload(connection)

    engine = connection.engine
    SessionLocal = connection.SessionLocal
    connection.Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    from agenthub.models.user import User
    from agenthub.auth.utils import hash_password

    user = User(email="user@example.com", hashed_password=hash_password("secret"))
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()

    import agenthub.auth.routes as routes
    reload(routes)

    app = FastAPI()
    app.include_router(routes.router, prefix="/auth")
    return TestClient(app), user

def test_get_current_user_success(client):
    client, user = client
    from agenthub.auth.utils import create_access_token

    token = create_access_token({"sub": user.email, "user_id": user.id})
    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == user.id
    assert data["email"] == user.email


def test_get_current_user_invalid_token(client):
    client, _ = client
    response = client.get("/auth/me", headers={"Authorization": "Bearer invalid"})
    assert response.status_code == 401

