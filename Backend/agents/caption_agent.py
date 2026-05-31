import os
import logging
from datetime import datetime
from services.gemini_caption_service import generate_caption_with_gemini
from services.caption_storage_service import save_generated_ad_content
from models.caption_schemas import CaptionRequest

logger = logging.getLogger("caption_agent")


async def process_caption_generation(request: CaptionRequest) -> dict:
    """
    Agent to handle the flow of generating captions with advertisement
    blueprint using Gemini and saving to MongoDB Atlas.
    """
    # 1. Generate via Gemini
    generated_data = generate_caption_with_gemini(
        business_type=request.business_type,
        target_audience=request.target_audience,
        platform=request.platform,
        tone=request.tone,
        campaign=request.campaign,
        location=request.location,
        marketing_goal=request.marketing_goal or "Brand Awareness"
    )

    # 2. Build business context from user inputs
    business_context = {
        "business_type": request.business_type,
        "target_audience": request.target_audience,
        "platform": request.platform,
        "tone": request.tone,
        "location": request.location,
        "marketing_goal": request.marketing_goal or "Brand Awareness",
    }

    # 3. Save each generated caption variant to MongoDB Atlas (advertisement_content collection)
    captions = generated_data.get("captions", [])

    if not captions:
        return {"captions": []}

    for cap in captions:
        generated_content = {
            "caption": cap.get("caption", ""),
            "cta": cap.get("cta", ""),
            "hashtags": cap.get("hashtags", []),
            "advertisement_blueprint": cap.get("advertisement_blueprint", {}),
            "why_this_will_work": cap.get("why_this_will_work", []),
            "poster_layout": cap.get("poster_layout", {}),
        }

        try:
            await save_generated_ad_content(
                business_context=business_context,
                campaign=request.campaign,
                generated_content=generated_content,
            )
        except ConnectionError as e:
            logger.error("MongoDB Atlas connection failed: %s", e)
            # Propagate so the route returns a proper 503
            raise
        except Exception as e:
            logger.error("Error saving to MongoDB Atlas: %s", e)

    return generated_data

