from agenthub.database.connection import SessionLocal
from sqlalchemy import text

try:
    db = SessionLocal()
    db.execute(text("SELECT 1"))  # Este `text()` evita el error que viste antes
    print("✅ Conectado exitosamente a la base de datos")
except Exception as e:
    print("❌ Error al conectar a la base de datos:", e)
finally:
    db.close()
