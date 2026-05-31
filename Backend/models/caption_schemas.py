from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class CaptionRequest(BaseModel):
    business_type: str = Field(..., example="Cafe")
    target_audience: str = Field(..., example="Students")
    platform: str = Field(..., example="Instagram")
    tone: str = Field(..., example="Casual")
    campaign: str = Field(..., example="Monsoon Coffee Combo")
    location: str = Field(..., example="Pune")
    marketing_goal: Optional[str] = Field("Brand Awareness", example="Drive Footfall")
    business_id: Optional[str] = "123"  # Mock business ID for saving to DB


class AdvertisementBlueprint(BaseModel):
    post_type: str = Field(..., example="Square image post for Instagram Feed")
    main_headline: str = Field(..., example="☕ Buy 1 Get 1 Free — Monsoon Coffee Combo!")
    main_image: str = Field(
        ...,
        example="A close-up photo of two steaming coffee cups on a cozy wooden table with rain visible through a window"
    )
    offer_text: str = Field(..., example="Available Mon–Fri, 3PM–7PM. Show this post to avail.")
    background_idea: str = Field(
        ...,
        example="Use a warm brown or cream colored background. You can also use a real photo of your cafe as the background."
    )
    logo_position: str = Field(
        ...,
        example="Place your logo in the top-right corner, small size — don't let it cover the main image"
    )
    cta_position: str = Field(
        ...,
        example="Write 'Order Now' or 'Visit Us Today' as a button at the bottom of the post"
    )
    recommended_size: str = Field("1080x1080", example="1080x1080")


class PosterLayout(BaseModel):
    top_section: str = Field(..., example="Your logo + cafe name in small text")
    center_section: str = Field(..., example="Main photo of coffee + big headline text")
    bottom_section: str = Field(
        ...,
        example="Offer details + CTA button + your address/phone"
    )
    color_suggestion: str = Field(
        ...,
        example="Use warm brown and cream — these feel cozy and match coffee branding"
    )


class CaptionItem(BaseModel):
    caption: str
    cta: str
    hashtags: List[str]
    advertisement_blueprint: AdvertisementBlueprint
    why_this_will_work: List[str]
    poster_layout: PosterLayout


class CaptionResponse(BaseModel):
    captions: List[CaptionItem]


class AdvertisementHistoryItem(BaseModel):
    id: str = Field(..., alias="_id")
    campaign: str
    platform: str
    created_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
