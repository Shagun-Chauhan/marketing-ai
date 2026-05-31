from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import calendar # Ensure the path matches your structure

app = FastAPI(title="MarketingAI API")

# Enable CORS for Frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register the Calendar Router
app.include_router(calendar.router)

@app.get("/")
async def root():
    return {"status": "MarketingAI Backend is Running"}