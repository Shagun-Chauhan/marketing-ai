import os
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from services.gemini_caption_service import generate_caption_with_gemini
from models.caption_schemas import CaptionRequest

# Use a default MongoDB URI if not provided
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client.marketing_ai
captions_collection = db.captions

async def process_caption_generation(request: CaptionRequest) -> dict:
    """
    Agent to handle the flow of generating captions with advertisement
    post guidance using Gemini and saving to MongoDB.
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
    
    # 2. Save each generated caption variant to MongoDB
    captions = generated_data.get("captions", [])
    
    if not captions:
        return {"captions": []}
        
    documents = []
    for cap in captions:
        documents.append({
            "business_id": request.business_id or "default_business",
            "platform": request.platform,
            "campaign": request.campaign,
            "marketing_goal": request.marketing_goal or "Brand Awareness",
            "caption": cap.get("caption", ""),
            "cta": cap.get("cta", ""),
            "hashtags": cap.get("hashtags", []),
            "post_guidance": cap.get("post_guidance", {}),
            "created_at": datetime.utcnow()
        })
        
    try:
        await captions_collection.insert_many(documents)
    except Exception as e:
        print(f"Error saving to MongoDB: {e}")
        
    return generated_data
