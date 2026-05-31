from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import date


class CalendarDay(BaseModel):
    """Single day content plan"""
    date: str = Field(..., description="Date in YYYY-MM-DD format")
    content_type: str = Field(..., description="Post, Reel, Story, Carousel, Video")
    title: str = Field(..., description="Content title")
    description: str = Field(..., description="Content description")
    purpose: str = Field(..., description="Awareness, Engagement, Lead Generation, Sales, Retention")
    recommended_time: str = Field(..., description="Recommended posting time")
    platform: str = Field(..., description="Instagram, Facebook, LinkedIn, X, YouTube")
    cta: str = Field(..., description="Call to action")
    hashtags: List[str] = Field(default_factory=list, description="Relevant hashtags")
    priority: str = Field(default="Medium", description="High, Medium, Low")
    campaign_category: str = Field(..., description="Offer, Product, Service, Educational, Testimonial, Launch, Festival, Seasonal")


class CalendarRequest(BaseModel):
    """Request to generate calendar"""
    duration: str = Field(..., description="weekly or monthly")
    business_data: Dict[str, Any] = Field(..., description="Business profile data")


class CalendarResponse(BaseModel):
    """Response with generated calendar"""
    duration: str
    calendar_days: List[CalendarDay]
    business_name: Optional[str] = None
    generated_at: str
