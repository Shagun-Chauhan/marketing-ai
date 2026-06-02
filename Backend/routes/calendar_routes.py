from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from models.calendar import CalendarRequest, CalendarResponse
from services.calendar_service import generate_calendar_with_gemini, generate_calendar_pdf
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


@router.post("/download")
async def download_calendar_pdf(request: CalendarRequest):
    """
    Generate and download the content calendar as a PDF.
    """
    try:
        # Reuse the existing generation logic to get the data context
        result = generate_calendar_with_gemini(
            duration=request.duration,
            business_data=request.business_data
        )
        
        # Generate PDF using the new service function
        pdf_buffer = generate_calendar_pdf(
            calendar_data=result,
            business_data=request.business_data
        )
        
        filename = f"content_planner_{request.duration}_{result.get('business_name', 'export')}.pdf"
        
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF download: {str(e)}")
