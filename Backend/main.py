from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from settings import settings
from routes import business_profile

app = FastAPI(title=settings.APP_NAME)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(business_profile.router)

@app.get("/")
async def root():
    return {"message": "Welcome to MarketingAI Backend API", "status": "running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)