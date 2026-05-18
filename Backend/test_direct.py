import os
import sys
from dotenv import load_dotenv
load_dotenv()

from services.gemini_caption_service import generate_caption_with_gemini

def test_caption_service():
    print("Testing generate_caption_with_gemini...")
    result = generate_caption_with_gemini(
        business_type="Cafe",
        target_audience="Students",
        platform="Instagram",
        tone="Casual",
        campaign="Monsoon Coffee Combo",
        location="Pune"
    )
    
    import google.generativeai as genai
    print("Available Models:")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
            
    print("Result keys:", result.keys())
    if "captions" in result:
        print("Number of captions:", len(result["captions"]))
        if len(result["captions"]) > 0:
            print("Sample CTA:", result["captions"][0].get("cta"))
    else:
        print("Failed to generate captions:", result)

if __name__ == "__main__":
    test_caption_service()
