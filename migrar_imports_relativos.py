import os
import re
import shutil

BASE_DIR = "back/agenthub"
PACKAGE_NAME = "agenthub"

relative_import_pattern = re.compile(r"from\s+(\.+)(\w*)\s+import\s+(.*)")

def get_absolute_import(line, file_path):
    match = relative_import_pattern.match(line.strip())
    if not match:
        return None

    dots, module, symbols = match.groups()

    # Calcular nivel de profundidad del archivo actual desde BASE_DIR
    relative_path = os.path.relpath(file_path, BASE_DIR)
    current_level = len(relative_path.split(os.sep)) - 1

    # Calcular destino absoluto
    dot_level = len(dots)
    prefix_parts = BASE_DIR.replace("\\", "/").split("/")[: -(dot_level - 1)]
    path_parts = relative_path.replace("\\", "/").split("/")[: -(dot_level)]

    if dot_level == 1:
        base = f"{PACKAGE_NAME}"
    else:
        # reconstruir import base usando ruta del archivo
        base = PACKAGE_NAME + "." + ".".join(path_parts)

    if module:
        return f"from {base}.{module} import {symbols}"
    else:
        return f"from {base} import {symbols}"

def process_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    modified = False
    new_lines = []
    for line in lines:
        if line.strip().startswith("from .") or line.strip().startswith("from .."):
            replacement = get_absolute_import(line, file_path)
            if replacement:
                new_lines.append(replacement + "\n")
                modified = True
                continue
        new_lines.append(line)

    if modified:
        backup_path = file_path + ".bak"
        shutil.copy(file_path, backup_path)
        with open(file_path, "w", encoding="utf-8") as f:
            f.writelines(new_lines)
        print(f"✅ Reemplazado: {file_path} (backup creado en .bak)")

def scan_directory(base_dir):
    for root, _, files in os.walk(base_dir):
        for file in files:
            if file.endswith(".py"):
                file_path = os.path.join(root, file)
                process_file(file_path)

if __name__ == "__main__":
    print(f"🚀 Iniciando conversión de imports relativos a absolutos en '{BASE_DIR}'...\n")
    scan_directory(BASE_DIR)
    print("\n🎉 Proceso completado.")
