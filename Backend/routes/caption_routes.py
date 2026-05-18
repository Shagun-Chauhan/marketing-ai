from fastapi import APIRouter, HTTPException
from models.caption_schemas import CaptionRequest, CaptionResponse
from agents.caption_agent import process_caption_generation

router = APIRouter(prefix="/api/caption", tags=["Caption Generator"])

@router.post("/generate", response_model=CaptionResponse)
async def generate_caption_endpoint(request: CaptionRequest):
    """
    Generate social media captions, CTAs, and hashtags.
    """
    try:
        result = await process_caption_generation(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
