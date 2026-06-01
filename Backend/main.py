from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth_routes import router as auth_router
from routes.caption_routes import router as caption_router
from routes.calendar_routes import router as calendar_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
  allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(caption_router)
# Include calendar router
app.include_router(calendar_router)


@app.get("/")
def root():
    return {"message": "Marketing AI Backend Running"}