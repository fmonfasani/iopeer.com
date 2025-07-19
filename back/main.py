from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import logging

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🚨 Agregá esto para servir el frontend build:
app.mount("/", StaticFiles(directory="static", html=True), name="static")

# (Opcional) Logs para confirmar
logging.info("Frontend static files mounted at /")
