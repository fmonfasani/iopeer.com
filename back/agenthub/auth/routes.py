from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from agenthub.models.user import User
from agenthub.database.connection import get_db
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from agenthub.auth.utils import verify_password
from agenthub.auth.schemas import SignInInput
import logging
from .schemas import UserCreate

logger = logging.getLogger(__name__)
router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class SigninRequest(BaseModel):
    email: str
    password: str

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    logger.info(f"Intentando crear usuario con email: {user.email}")

    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        logger.warning(f"El usuario {user.email} ya existe.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo ya está registrado"
        )

    hashed_password = pwd_context.hash(user.password)
    new_user = User(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    logger.info(f"Usuario {new_user.email} creado exitosamente.")
    return {"message": "Usuario creado exitosamente", "email": new_user.email}

@router.post("/signin")
def login(user: SignInInput, db: Session = Depends(get_db)):
    logger.info(f"Intentando iniciar sesión con email: {user.email}")
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        logger.warning(f"Usuario {user.email} no encontrado.")
        raise HTTPException(status_code=400, detail="Credenciales inválidas")

    if not verify_password(user.password, db_user.hashed_password):
        logger.warning(f"Contraseña incorrecta para {user.email}")
        raise HTTPException(status_code=400, detail="Credenciales inválidas")

    #token = create_access_token({"sub": user.email})
    #logger.info(f"Usuario {user.email} autenticado exitosamente.")
    #return {"access_token": token, "token_type": "bearer"}//
