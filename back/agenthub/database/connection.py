from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.orm import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from contextlib import contextmanager
import os
from dotenv import load_dotenv
load_dotenv()



DATABASE_URL = os.getenv("DATABASE_URL")


if " " in DATABASE_URL:
    print("Hay un espacio invisible")
    print("🧪 DATABASE_URL:", DATABASE_URL)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        print("Conectando a la base de datos...")
        yield db
    finally:
        db.close()
