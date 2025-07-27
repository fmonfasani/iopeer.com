import sys
import types

if 'fastapi' not in sys.modules:
    fastapi_stub = types.ModuleType('fastapi')
    class WebSocket:  # minimal stub
        pass
    fastapi_stub.WebSocket = WebSocket
    sys.modules['fastapi'] = fastapi_stub
