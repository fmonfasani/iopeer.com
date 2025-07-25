from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    is_active: bool

    class Config:
        orm_mode = True

class SignInInput(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    token: str


