"""Common Pydantic models used across AgentHub."""

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    """Payload for creating a new user."""

    email: EmailStr
    password: str


class UserOut(BaseModel):
    """Representation of a user returned by the API."""

    id: int
    email: EmailStr
    is_active: bool

    # Pydantic v2 configuration
    model_config = {"from_attributes": True}


class SignInInput(BaseModel):
    """Credentials for user login."""

    email: EmailStr
    password: str


class UserPublic(BaseModel):
    """Minimal public user data returned in auth responses."""

    id: int
    email: EmailStr


class TokenResponse(BaseModel):
    """Response returned after successful authentication."""

    access_token: str
    token_type: str = "bearer"
    user: UserPublic


class OAuthUser(BaseModel):
    """Basic data returned by external OAuth providers."""

    id: str
    email: str
    name: str
    avatar_url: str | None = None
    provider: str


__all__ = [
    "UserCreate",
    "UserOut",
    "SignInInput",
    "UserPublic",
    "TokenResponse",
    "OAuthUser",
]
