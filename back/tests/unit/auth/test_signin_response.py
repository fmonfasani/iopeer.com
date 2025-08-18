import os
from importlib import reload

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient


@pytest.fixture
def client(tmp_path):
    """Create a TestClient with a temporary SQLite database."""

    os.environ["DATABASE_URL"] = f"sqlite:///{tmp_path}/test.db"

    import agenthub.database.connection as connection
    reload(connection)

    engine = connection.engine
    SessionLocal = connection.SessionLocal

    from agenthub.models.user import User

    connection.Base.metadata.create_all(bind=engine)

    import agenthub.auth.auth as auth_module
    reload(auth_module)

    pwd_context = auth_module.pwd_context
    router = auth_module.router

    # Create a user for authentication
    db = SessionLocal()
    user = User(email="user@example.com", hashed_password=pwd_context.hash("secret"))
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()

    app = FastAPI()
    app.include_router(router, prefix="/auth")

    return TestClient(app), user


def test_signin_returns_token_structure(client):
    client, user = client

    response = client.post(
        "/auth/signin", json={"email": user.email, "password": "secret"}
    )

    assert response.status_code == 200
    data = response.json()

    assert data["token_type"] == "bearer"
    assert isinstance(data["access_token"], str)
    assert data["user"] == {"id": user.id, "email": user.email}
