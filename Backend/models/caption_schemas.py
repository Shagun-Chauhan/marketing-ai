from pydantic import BaseModel, Field
from typing import List, Optional

class CaptionRequest(BaseModel):
    business_type: str = Field(..., example="Cafe")
    target_audience: str = Field(..., example="Students")
    platform: str = Field(..., example="Instagram")
    tone: str = Field(..., example="Casual")
    campaign: str = Field(..., example="Monsoon Coffee Combo")
    location: str = Field(..., example="Pune")
    business_id: Optional[str] = "123" # Mock business ID for saving to DB

class CaptionItem(BaseModel):
    caption: str
    cta: str
    hashtags: List[str]

class CaptionResponse(BaseModel):
    captions: List[CaptionItem]
