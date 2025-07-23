from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from agenthub.models.user import User
from agenthub.database.connection import get_db
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import logging
logger = logging.getLogger(__name__)

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class SigninRequest(BaseModel):
    email: str
    password: str

@router.post("/signup")
async def signup():
    return {"message": "Signup exitoso"}

import logging
logger = logging.getLogger(__name__)

@router.post("/signin")
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        logger.warning(f"Usuario no encontrado: {user.email}")
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    if not bcrypt.checkpw(user.password.encode('utf-8'), db_user.password.encode('utf-8')):
        logger.warning(f"Contraseña incorrecta para: {user.email}")
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    return {"message": "Login exitoso"}

