# Actualización de dependencias

Este proyecto utiliza un archivo `requirements.txt` con versiones fijadas y un archivo bloqueado `requirements.lock`.

## Pasos para actualizar

1. Ajusta las versiones deseadas en `requirements.txt`.
2. Instala [pip-tools](https://github.com/jazzband/pip-tools) si no está disponible:
   ```bash
   pip install pip-tools
   ```
3. Genera el archivo bloqueado:
   ```bash
   pip-compile requirements.txt --output-file requirements.lock
   ```
4. Verifica los cambios y ejecuta los tests del proyecto.
5. Commitea ambos archivos para asegurar instalaciones reproducibles.

## Nota

En entornos sin acceso a internet, `pip-compile` puede fallar al resolver dependencias. Ejecuta el comando en un entorno con conectividad y sincroniza el archivo `requirements.lock`.
