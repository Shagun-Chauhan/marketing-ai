from fastapi import APIRouter, HTTPException
from models.caption_schemas import CaptionRequest, CaptionResponse
from agents.caption_agent import process_caption_generation
from services.caption_storage_service import get_saved_ad_content, get_ad_content_by_id

router = APIRouter(prefix="/api/caption", tags=["Caption Generator"])


@router.post("/generate", response_model=CaptionResponse)
async def generate_caption_endpoint(request: CaptionRequest):
    """
    Generate social media captions, CTAs, hashtags, and advertisement blueprints.
    Results are automatically saved to MongoDB Atlas.
    """
    try:
        result = await process_caption_generation(request)
        return result
    except ConnectionError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Database connection failed. Please check MongoDB Atlas configuration. {e}"
        )
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history")
async def get_caption_history():
    """
    Return a list of previously generated advertisement content from Atlas (summary view).
    """
    try:
        history = await get_saved_ad_content(limit=20)
        return history
    except ConnectionError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Could not connect to MongoDB Atlas. {e}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history/{doc_id}")
async def get_caption_history_detail(doc_id: str):
    """
    Return the full document for a single generated advertisement by its _id.
    """
    try:
        doc = await get_ad_content_by_id(doc_id)
        if doc is None:
            raise HTTPException(status_code=404, detail="Advertisement content not found or invalid ID.")
        return doc
    except HTTPException:
        raise
    except ConnectionError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Could not connect to MongoDB Atlas. {e}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{doc_id}")
async def get_caption_by_id(doc_id: str):
    """
    Return a specific advertisement document by its _id.
    Alias endpoint: GET /api/caption/{id}
    """
    try:
        doc = await get_ad_content_by_id(doc_id)
        if doc is None:
            raise HTTPException(status_code=404, detail="Advertisement content not found or invalid ID.")
        return doc
    except HTTPException:
        raise
    except ConnectionError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Could not connect to MongoDB Atlas. {e}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
