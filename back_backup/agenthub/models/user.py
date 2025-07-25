from sqlalchemy import Column, Integer, String, Boolean
from ..database.connection import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    hashed_password = Column(String)