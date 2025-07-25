# back/main.py - ARREGLADO Y SIMPLIFICADO
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="IOPeer Agent Hub",
    description="AI Agent orchestration platform",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "message": "IOPeer Agent Hub is running",
        "version": "1.0.0"
    }

# Simple root endpoint
@app.get("/")
async def root():
    return {
        "message": "IOPeer Agent Hub API", 
        "version": "1.0.0",
        "endpoints": [
            "/health",
            "/auth/signin",
            "/auth/signup", 
            "/auth/oauth/status"
        ]
    }

# Try to include auth routes
try:
    from agenthub.database.connection import engine, Base
    logger.info("✅ Database connection established")
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Database tables created")
    
    # Include auth routes
    from agenthub.auth import router as auth_router
    app.include_router(auth_router, prefix="/auth", tags=["authentication"])
    logger.info("✅ Auth routes loaded")
    
except Exception as e:
    logger.error(f"❌ Error loading auth system: {e}")
    
    # Fallback auth endpoint
    @app.post("/auth/signin")
    async def fallback_signin():
        return {"error": "Auth system not configured", "detail": str(e)}

# Placeholder for other endpoints
@app.get("/agents")
async def get_agents():
    """Placeholder para agentes"""
    return {
        "agents": [],
        "message": "Agents endpoint - pendiente implementación"
    }

@app.post("/message/send")
async def send_message():
    """Placeholder para envío de mensajes"""
    return {
        "result": {"message": "Message endpoint - pendiente implementación"}
    }

@app.get("/marketplace/featured")
async def get_featured_agents():
    """Placeholder para marketplace"""
    return {
        "agents": [],
        "message": "Marketplace endpoint - pendiente implementación"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)