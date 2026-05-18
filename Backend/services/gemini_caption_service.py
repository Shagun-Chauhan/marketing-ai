import google.generativeai as genai
import os
import json

# The prompt requirement:
# Use structured Gemini prompts.
# The AI should behave like: “Expert Social Media Marketing Strategist”
# Prompt must include: business type, audience, platform, tone, campaign, location, marketing goal

def generate_caption_with_gemini(business_type: str, target_audience: str, platform: str, tone: str, campaign: str, location: str) -> dict:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    
    # We use gemini-1.5-flash or gemini-1.5-pro, let's use flash for speed or pro for reasoning.
    model = genai.GenerativeModel('gemini-flash-latest', generation_config={"response_mime_type": "application/json"})
    
    system_prompt = """You are an Expert Social Media Marketing Strategist. 
Your task is to generate high-converting social media content.
Please output a JSON object containing an array of 'captions'. 
Each object in the 'captions' array should have 'caption' (string), 'cta' (string), and 'hashtags' (array of strings)."""

    user_prompt = f"""
Please generate 3 variations of social media captions based on the following context:

Business Type: {business_type}
Target Audience: {target_audience}
Platform: {platform}
Tone: {tone}
Campaign/Topic: {campaign}
Location: {location}

Ensure the output is valid JSON matching this schema:
{{
  "captions": [
    {{
      "caption": "...",
      "cta": "...",
      "hashtags": ["...", "..."]
    }}
  ]
}}
"""
    
    try:
        response = model.generate_content(
            system_prompt + "\n\n" + user_prompt
        )
        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.startswith("```"):
            raw_text = raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
        
        result = json.loads(raw_text.strip())
        return result
    except Exception as e:
        print(f"Error generating caption: {e}")
        return {"captions": []}
