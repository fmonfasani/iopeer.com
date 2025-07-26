import logging

from agenthub.auth.auth import create_access_token
from agenthub.auth.schemas import SignInInput
from agenthub.auth.utils import verify_password
from agenthub.database.connection import get_db
from agenthub.models.user import User
from fastapi import APIRouter, Depends, HTTPException, status, Header
from jose import jwt, JWTError
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy.orm import Session

from .schemas import UserCreate
from .utils import create_access_token, verify_password, SECRET_KEY, ALGORITHM

logger = logging.getLogger(__name__)
router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class SigninRequest(BaseModel):
    email: str
    password: str


@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    """Crear nuevo usuario en la tabla iopeer_users"""
    logger.info(f"🔄 Creando usuario con email: {user.email}")

    # Buscar en NUESTRA tabla (iopeer_users)
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        logger.warning(f"⚠️ El usuario {user.email} ya existe en iopeer_users.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo ya está registrado",
        )

    # Crear nuevo usuario
    hashed_password = pwd_context.hash(user.password)
    new_user = User(email=user.email, hashed_password=hashed_password)
    
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        logger.info(f"✅ Usuario {new_user.email} creado exitosamente en iopeer_users.")
        
        return {
            "message": "Usuario creado exitosamente", 
            "email": new_user.email,
            "id": new_user.id
        }
    except Exception as e:
        db.rollback()
        logger.error(f"❌ Error creando usuario: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.post("/signin")
def login(user: SignInInput, db: Session = Depends(get_db)):
    """Login usando la tabla iopeer_users"""
    logger.info(f"🔄 Intentando login con email: {user.email}")
    
    # Buscar en NUESTRA tabla (iopeer_users)
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        logger.warning(f"⚠️ Usuario {user.email} no encontrado en iopeer_users.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas",
        )

    if not verify_password(user.password, db_user.hashed_password):
        logger.warning(f"⚠️ Contraseña incorrecta para {user.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas",
        )

    # Crear token
    token = create_access_token({"sub": user.email, "user_id": db_user.id})
    logger.info(f"✅ Usuario {user.email} autenticado exitosamente.")
    
    return {
        "access_token": token, 
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "is_active": db_user.is_active
        }
    }

@router.get("/me")
def get_current_user(
    db: Session = Depends(get_db),
    authorization: str | None = Header(default=None)
):
    """Return the currently authenticated user."""

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    user_id = payload.get("user_id")
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    return {"id": user.id, "email": user.email, "is_active": user.is_active}
