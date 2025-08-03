from agenthub.database.connection import engine, Base
from agenthub.models.user import User
from sqlalchemy import text

def create_tables():
    Base.metadata.create_all(bind=engine)
    with engine.connect() as conn:
        result = conn.execute(text(
            """
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'iopeer_users'
            ORDER BY ordinal_position
            """
        ))

        columns = [f"{row[0]} ({row[1]})" for row in result.fetchall()]

    print("✅ Tabla 'iopeer_users' creada con columnas:")
    for col in columns:
        print(f"   - {col}")

if __name__ == "__main__":
    create_tables()
