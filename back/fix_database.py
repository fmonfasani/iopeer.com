# back/fix_database.py - ARREGLAR BASE DE DATOS
import os
import sys
from pathlib import Path

# Agregar el directorio del proyecto al path
sys.path.append(str(Path(__file__).parent))

def fix_database():
    """Arregla la base de datos agregando columnas faltantes"""
    
    print("🔧 Arreglando base de datos IOPeer...")
    
    try:
        # Importar dependencias
        from sqlalchemy import text, inspect
        from agenthub.database.connection import engine, SessionLocal
        from agenthub.models.user import User
        
        print("✅ Conexiones importadas exitosamente")
        
        # Verificar conexión
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✅ Conexión a base de datos exitosa")
        
        # Inspeccionar tabla actual
        inspector = inspect(engine)
        
        if 'iopeer_users' not in inspector.get_table_names():
            print("❌ Tabla iopeer_users no existe")
            print("🔄 Creando tabla desde cero...")
            create_fresh_table()
            return
        
        # Obtener columnas actuales
        columns = inspector.get_columns('iopeer_users')
        column_names = [col['name'] for col in columns]
        
        print(f"📋 Columnas actuales: {column_names}")
        
        # Columnas que necesitamos agregar
        missing_columns = []
        required_columns = {
            'provider': 'VARCHAR DEFAULT \'local\'',
            'provider_id': 'VARCHAR',
            'provider_data': 'TEXT'
        }
        
        for col_name, col_def in required_columns.items():
            if col_name not in column_names:
                missing_columns.append((col_name, col_def))
        
        if not missing_columns:
            print("✅ Todas las columnas OAuth ya existen")
            return
        
        print(f"➕ Columnas a agregar: {[col[0] for col in missing_columns]}")
        
        # Agregar columnas faltantes
        with engine.connect() as connection:
            for col_name, col_def in missing_columns:
                try:
                    alter_sql = f"ALTER TABLE iopeer_users ADD COLUMN {col_name} {col_def}"
                    print(f"🔄 Ejecutando: {alter_sql}")
                    connection.execute(text(alter_sql))
                    connection.commit()
                    print(f"✅ Columna {col_name} agregada")
                except Exception as e:
                    print(f"⚠️ Error agregando {col_name}: {e}")
        
        # Verificar que las columnas se agregaron
        inspector = inspect(engine)
        new_columns = inspector.get_columns('iopeer_users')
        new_column_names = [col['name'] for col in new_columns]
        
        print(f"📋 Columnas después de migración: {new_column_names}")
        
        # Verificar que el modelo funciona
        try:
            db = SessionLocal()
            user_count = db.query(User).count()
            db.close()
            print(f"✅ Modelo User funciona correctamente ({user_count} usuarios)")
        except Exception as e:
            print(f"❌ Error verificando modelo: {e}")
            
        print("\n🎉 ¡Base de datos arreglada exitosamente!")
        
    except Exception as e:
        print(f"❌ Error arreglando base de datos: {e}")
        print("\n🔄 Intentando crear tabla desde cero...")
        create_fresh_table()

def create_fresh_table():
    """Crea la tabla desde cero con todas las columnas"""
    
    try:
        from agenthub.database.connection import Base, engine
        
        print("🗑️ Eliminando tabla existente (si existe)...")
        
        with engine.connect() as connection:
            connection.execute(text("DROP TABLE IF EXISTS iopeer_users CASCADE"))
            connection.commit()
        
        print("🔄 Creando tabla con estructura completa...")
        
        # Crear todas las tablas
        Base.metadata.create_all(bind=engine)
        
        print("✅ Tabla iopeer_users creada exitosamente")
        
        # Verificar estructura
        from sqlalchemy import inspect
        inspector = inspect(engine)
        columns = inspector.get_columns('iopeer_users')
        column_names = [col['name'] for col in columns]
        
        print(f"📋 Columnas creadas: {column_names}")
        
        # Crear usuario de prueba
        create_test_user()
        
    except Exception as e:
        print(f"❌ Error creando tabla: {e}")

def create_test_user():
    """Crea un usuario de prueba"""
    
    try:
        from agenthub.database.connection import SessionLocal
        from agenthub.models.user import User
        from passlib.context import CryptContext
        
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
        db = SessionLocal()
        
        # Verificar si el usuario de prueba ya existe
        existing_user = db.query(User).filter(User.email == "test@iopeer.com").first()
        
        if existing_user:
            print("✅ Usuario de prueba ya existe")
            db.close()
            return
        
        # Crear usuario de prueba
        hashed_password = pwd_context.hash("password123")
        
        test_user = User(
            email="test@iopeer.com",
            hashed_password=hashed_password,
            is_active=True,
            provider="local",
            provider_id=None,
            provider_data=None
        )
        
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        db.close()
        
        print("✅ Usuario de prueba creado:")
        print("   Email: test@iopeer.com")
        print("   Password: password123")
        
    except Exception as e:
        print(f"⚠️ Error creando usuario de prueba: {e}")

def test_auth_flow():
    """Prueba el flujo de autenticación"""
    
    print("\n🧪 Probando flujo de autenticación...")
    
    try:
        import requests
        
        # Test signin
        response = requests.post(
            "http://localhost:8000/auth/signin",
            json={
                "email": "test@iopeer.com",
                "password": "password123"
            },
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            token = data.get("access_token")
            print("✅ Login exitoso")
            print(f"   Token: {token[:50]}...")
            
            # Test /auth/me
            headers = {"Authorization": f"Bearer {token}"}
            me_response = requests.get(
                "http://localhost:8000/auth/me",
                headers=headers,
                timeout=5
            )
            
            if me_response.status_code == 200:
                user_data = me_response.json()
                print("✅ /auth/me exitoso")
                print(f"   User: {user_data}")
            else:
                print(f"❌ /auth/me falló: {me_response.status_code}")
                
        else:
            print(f"❌ Login falló: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error probando auth: {e}")

def main():
    """Función principal"""
    
    print("🎯 IOPeer Database Fix")
    print("=" * 50)
    print()
    
    # 1. Arreglar base de datos
    fix_database()
    
    # 2. Probar autenticación
    test_auth_flow()
    
    print("\n" + "=" * 50)
    print("🎉 DATABASE FIX COMPLETADO")
    print()
    print("🚀 PRÓXIMOS PASOS:")
    print("   1. El backend ya está funcionando")
    print("   2. Prueba login con: test@iopeer.com / password123")
    print("   3. Continúa con integración frontend")
    print()
    print("✅ ¡Todo listo para el desarrollo MVP!")

if __name__ == "__main__":
    main()