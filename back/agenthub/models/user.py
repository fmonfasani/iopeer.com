from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from datetime import datetime
from ..database.connection import Base

class User(Base):
    __tablename__ = "iopeer_users"

    # Campos básicos que funcionan
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # OAuth fields
    provider = Column(String, default="local")  # 'local', 'github', 'google'
    provider_id = Column(String, nullable=True)  # ID del usuario en el provider
    provider_data = Column(Text, nullable=True)  # JSON con datos adicionales del provider


    #full_name = Column(String, nullable=True)
    #avatar_url = Column(String, nullable=True)
    #updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
