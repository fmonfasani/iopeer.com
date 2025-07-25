from agenthub.database.connection import engine, Base
from agenthub.models.user import User

def create_tables():
    Base.metadata.create_all(bind=engine)
    print("✅ Tablas creadas exitosamente")

if __name__ == "__main__":
    create_tables()