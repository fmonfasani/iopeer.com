import logging
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)

class ExceptionMiddleware(BaseHTTPMiddleware):
    """Catch exceptions during request processing and return JSON errors."""

    async def dispatch(self, request: Request, call_next):
        try:
            return await call_next(request)
        except Exception as exc:
            logger.exception("Unhandled error: %s", exc)
            return JSONResponse(
                status_code=500,
                content={"error": "Internal server error", "detail": str(exc)},
            )
