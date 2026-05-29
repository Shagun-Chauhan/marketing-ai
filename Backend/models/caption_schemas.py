from pydantic import BaseModel, Field
from typing import List, Optional

class CaptionRequest(BaseModel):
    business_type: str = Field(..., example="Cafe")
    target_audience: str = Field(..., example="Students")
    platform: str = Field(..., example="Instagram")
    tone: str = Field(..., example="Casual")
    campaign: str = Field(..., example="Monsoon Coffee Combo")
    location: str = Field(..., example="Pune")
    marketing_goal: Optional[str] = Field("Brand Awareness", example="Drive Footfall")
    business_id: Optional[str] = "123" # Mock business ID for saving to DB

class PostGuidance(BaseModel):
    post_type: str = Field(..., example="Promotional Static Instagram Post")
    poster_headline: str = Field(..., example="Monsoon Coffee Combo ☕")
    design_style: str = Field(..., example="Warm and cozy café branding")
    color_palette: List[str] = Field(..., example=["Brown", "Cream", "Orange"])
    visual_elements: List[str] = Field(..., example=["Coffee cup close-up", "Rain background", "Warm lighting"])
    text_placement: str = Field(..., example="Headline at top, offer details center, CTA button at bottom")
    branding_tip: str = Field(..., example="Use minimal clean typography with café logo watermark")
    engagement_tip: str = Field(..., example="Highlight limited-time offer for urgency")

class CaptionItem(BaseModel):
    caption: str
    cta: str
    hashtags: List[str]
    post_guidance: PostGuidance

class CaptionResponse(BaseModel):
    captions: List[CaptionItem]
