from fastapi import APIRouter, HTTPException
from models.calendar import CalendarRequest, CalendarResponse
from services.calendar_service import generate_calendar_with_gemini
from typing import Dict, Any

router = APIRouter(prefix="/api/calendar", tags=["calendar"])


@router.post("/generate")
async def generate_calendar(request: CalendarRequest) -> CalendarResponse:
    """
    Generate AI-powered content calendar using Gemini AI.
    
    Args:
        request: CalendarRequest with duration (weekly/monthly) and business_data
    
    Returns:
        CalendarResponse with generated calendar days
    """
    try:
        result = generate_calendar_with_gemini(
            duration=request.duration,
            business_data=request.business_data
        )
        
        return CalendarResponse(
            duration=result["duration"],
            calendar_days=result["calendar_days"],
            business_name=result.get("business_name"),
            generated_at=result["generated_at"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate calendar: {str(e)}")
