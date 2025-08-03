# ============================================
# back/agenthub/auth/schemas.py - SIMPLIFICADO
# ============================================

from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    
    # Configuración para Pydantic V2
    model_config = {"from_attributes": True}

class SignInInput(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    token: str
