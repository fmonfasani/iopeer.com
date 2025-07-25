# ============================================
# back/recreate_database_supabase_safe.py
# Script seguro para Supabase - No toca las tablas del sistema
# ============================================

import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

def recreate_iopeer_tables():
    """Recrear solo las tablas de IOPeer, sin tocar Supabase Auth"""
    
    DATABASE_URL = os.getenv("DATABASE_URL")
    if not DATABASE_URL:
        print("❌ DATABASE_URL no encontrado en .env")
        return
    
    print(f"🔄 Recreando tablas de IOPeer (seguro para Supabase)...")
    print(f"📍 URL: {DATABASE_URL.split('@')[1] if '@' in DATABASE_URL else 'hidden'}")
    
    try:
        # Crear engine
        engine = create_engine(DATABASE_URL)
        
        # Solo eliminar NUESTRAS tablas, no las de Supabase
        print("🗑️ Eliminando tablas de IOPeer...")
        with engine.connect() as conn:
            # Obtener solo nuestras tablas (las que empiezan con iopeer_)
            result = conn.execute(text("""
                SELECT tablename FROM pg_tables 
                WHERE schemaname = 'public' 
                AND tablename LIKE 'iopeer_%'
            """))
            
            our_tables = [row[0] for row in result.fetchall()]
            
            if our_tables:
                print(f"📋 Tablas de IOPeer encontradas: {our_tables}")
                
                # Drop cada una de nuestras tablas
                for table in our_tables:
                    conn.execute(text(f"DROP TABLE IF EXISTS {table} CASCADE"))
                    print(f"🗑️ Tabla {table} eliminada")
                
                conn.commit()
            else:
                print("ℹ️ No se encontraron tablas de IOPeer para eliminar")
        
        # Importar modelos y crear tablas
        print("🏗️ Importando modelos de IOPeer...")
        from agenthub.database.connection import Base
        from agenthub.models.user import User  # Modelo con tabla "iopeer_users"
        
        print("🏗️ Creando nuevas tablas de IOPeer...")
        Base.metadata.create_all(bind=engine)
        
        # Verificar que se crearon correctamente
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'iopeer_users'
                ORDER BY ordinal_position
            """))
            
            columns = result.fetchall()
            if columns:
                print("✅ Tabla 'iopeer_users' creada con columnas:")
                for col in columns:
                    print(f"   - {col[0]} ({col[1]})")
            else:
                print("⚠️ No se encontró la tabla iopeer_users")
        
        # Verificar qué tablas están en la BD ahora
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT tablename FROM pg_tables 
                WHERE schemaname = 'public'
                ORDER BY tablename
            """))
            
            all_tables = [row[0] for row in result.fetchall()]
            print(f"📋 Todas las tablas en la BD: {len(all_tables)} tablas")
            
            # Mostrar solo nuestras tablas y algunas importantes de Supabase
            iopeer_tables = [t for t in all_tables if t.startswith('iopeer_')]
            system_tables = [t for t in all_tables if t in ['users', 'auth', 'realtime']]
            
            print(f"🔵 Tablas IOPeer: {iopeer_tables}")
            print(f"🟡 Tablas Sistema: {system_tables[:5]}...")  # Solo mostrar las primeras 5
        
        print("✅ Tablas de IOPeer recreadas exitosamente!")
        
    except Exception as e:
        print(f"❌ Error recreando tablas: {e}")
        raise

if __name__ == "__main__":
    recreate_iopeer_tables()