import os

# Ruta base donde buscar los archivos
base_dir = "back/agenthub"

# Recorremos todos los archivos .py dentro del directorio
for root, _, files in os.walk(base_dir):
    for file in files:
        if file.endswith(".py"):
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8") as f:
                lines = f.readlines()
                import_lines = [line.strip() for line in lines if line.strip().startswith("import ") or line.strip().startswith("from ")]
                if import_lines:
                    print(f"\n📄 {file_path}")
                    for line in import_lines:
                        print(f"  {line}")
