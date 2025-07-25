# backend/main.py - CORREGIDO CON OAUTH
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from agenthub.auth import router as auth_router  # Incluye OAuth automáticamente
from agenthub.database.connection import engine, Base
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create tables
Base.metadata.create_all(bind=engine)

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
    return {"status": "healthy", "message": "IOPeer Agent Hub is running"}

# Include auth routes (includes OAuth automatically)
app.include_router(auth_router, prefix="/auth", tags=["authentication"])

# Placeholder for other routes
@app.get("/")
async def root():
    return {"message": "IOPeer Agent Hub API", "version": "1.0.0"}

# Add your other routers here:
# app.include_router(agents_router, prefix="/agents", tags=["agents"])
# app.include_router(marketplace_router, prefix="/marketplace", tags=["marketplace"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)