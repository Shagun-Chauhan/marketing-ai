from fastapi.middleware.cors import CORSMiddleware
from settings import settings

def setup_cors(app):
    """Configure CORS for the application"""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.FRONTEND_URL],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )