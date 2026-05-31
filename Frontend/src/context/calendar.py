import os
import json
from fastapi import APIRouter, HTTPException, Body, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import google.generativeai as genai
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/calendar", tags=["calendar"])

# Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

class BusinessData(BaseModel):
    businessName: Optional[str] = ""
    industry: Optional[str] = ""
    primaryPlatform: Optional[str] = ""
    businessType: Optional[str] = ""
    description: Optional[str] = ""
    targetAudience: Optional[str] = ""
    goals: Optional[str] = ""
    brandTone: Optional[str] = ""
    usp: Optional[str] = ""

class CalendarDay(BaseModel):
    date: str
    contentType: str
    title: str
    description: str
    purpose: str
    recommendedTime: str
    platform: str
    cta: str
    hashtags: List[str]
    priority: str
    campaignCategory: str

class GenerateRequest(BaseModel):
    duration: str # "weekly" or "monthly"
    businessData: BusinessData

def construct_calendar_prompt(data: BusinessData, days: int):
    return f"""
    Act as a World-Class Social Media Strategist. 
    Generate a {days}-day content calendar for the following business:
    
    Business Name: {data.businessName}
    Industry: {data.industry}
    Type: {data.businessType}
    Description: {data.description}
    Target Audience: {data.targetAudience}
    Goals: {data.goals}
    Tone: {data.brandTone}
    USP: {data.usp}
    Primary Platform: {data.primaryPlatform}

    Requirements for EACH day:
    - contentType: Choose from (Post, Reel, Story, Carousel, Video)
    - purpose: Choose from (Awareness, Engagement, Lead Generation, Sales, Retention)
    - campaignCategory: Choose from (Offer, Product, Service, Educational, Testimonial, Launch, Festival, Seasonal)
    - priority: (High, Medium, Low)
    - platform: Match the business's primary platforms.
    - date: Format YYYY-MM-DD starting from today.

    Return ONLY a JSON array of objects. No markdown, no intro text.
    """

@router.post("/generate", response_model=List[CalendarDay])
async def generate_calendar(request: GenerateRequest):
    days = 7 if request.duration == "weekly" else 30
    prompt = construct_calendar_prompt(request.businessData, days)
    
    try:
        response = model.generate_content(prompt)
        # Clean clean JSON from markdown blocks if present
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3]
        elif text.startswith("```"):
            text = text[3:-3]
            
        return json.loads(text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/task")
async def update_task(update: TaskUpdate):
    """Toggle task status."""
    updated = False
    for task in db["weekly_plan"]:
        if task["day"] == update.day:
            task["status"] = update.status
            updated = True
            break
    
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Updated successfully"}