# ============================================
# back/recreate_database.py
# Script para recrear la base de datos con el schema correcto
# ============================================

import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

def recreate_database():
    """Recrear la base de datos completamente"""
    
    DATABASE_URL = os.getenv("DATABASE_URL")
    if not DATABASE_URL:
        print("❌ DATABASE_URL no encontrado en .env")
        return
    
    print(f"🔄 Recreando base de datos...")
    print(f"📍 URL: {DATABASE_URL}")
    
    try:
        # Crear engine
        engine = create_engine(DATABASE_URL)
        
        # Drop todas las tablas
        print("🗑️ Eliminando tablas existentes...")
        with engine.connect() as conn:
            # Obtener todas las tablas
            result = conn.execute(text("""
                SELECT tablename FROM pg_tables 
                WHERE schemaname = 'public'
            """))
            
            tables = [row[0] for row in result.fetchall()]
            
            if tables:
                print(f"📋 Tablas encontradas: {tables}")
                
                # Drop cada tabla
                for table in tables:
                    conn.execute(text(f"DROP TABLE IF EXISTS {table} CASCADE"))
                    print(f"🗑️ Tabla {table} eliminada")
                
                conn.commit()
            else:
                print("ℹ️ No se encontraron tablas para eliminar")
        
        # Importar modelos y crear tablas
        print("🏗️ Importando modelos...")
        from agenthub.database.connection import Base
        from agenthub.models.user import User  # Esto importará el modelo simplificado
        
        print("🏗️ Creando nuevas tablas...")
        Base.metadata.create_all(bind=engine)
        
        # Verificar que se crearon correctamente
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'users'
                ORDER BY ordinal_position
            """))
            
            columns = result.fetchall()
            print("✅ Tabla 'users' creada con columnas:")
            for col in columns:
                print(f"   - {col[0]} ({col[1]})")
        
        print("✅ Base de datos recreada exitosamente!")
        
    except Exception as e:
        print(f"❌ Error recreando base de datos: {e}")
        raise

if __name__ == "__main__":
    recreate_database()