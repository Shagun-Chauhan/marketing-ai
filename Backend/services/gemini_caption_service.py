import google.generativeai as genai
import os
import json

# The AI behaves like: "Professional Social Media Advertisement Designer & Marketing Strategist"
# Generates: caption, CTA, hashtags, advertisement post guidance, poster design, branding suggestions
# Focus: ONLY static promotional posts — NO reels, videos, cinematic content

PLATFORM_GUIDANCE = {
    "Instagram": (
        "Instagram Post Guidelines:\n"
        "- Visually attractive square post (1:1 ratio)\n"
        "- Bold headline with large readable font\n"
        "- Minimal text — let visuals dominate\n"
        "- Aesthetic branding with consistent color scheme\n"
        "- CTA button or text at bottom of post"
    ),
    "LinkedIn": (
        "LinkedIn Post Guidelines:\n"
        "- Professional business promotional banner (1200x627 or 1:1)\n"
        "- Informative layout with clear value proposition\n"
        "- Clean typography — serif or modern sans-serif\n"
        "- Subtle branding with company logo placement\n"
        "- Data-driven or authority-building messaging"
    ),
    "Facebook": (
        "Facebook Post Guidelines:\n"
        "- Community-focused advertisement post\n"
        "- Larger readable text for mobile feeds\n"
        "- Promotional offer highlight with urgency\n"
        "- Warm, engaging color tones\n"
        "- Clear CTA with action-oriented language"
    ),
    "Twitter": (
        "Twitter/X Post Guidelines:\n"
        "- Concise punchy text with visual card\n"
        "- Hashtag-driven discoverability\n"
        "- Strong brand voice in minimal words\n"
        "- Eye-catching banner image (1200x675)\n"
        "- Direct link or CTA in the post"
    ),
}


def generate_caption_with_gemini(
    business_type: str,
    target_audience: str,
    platform: str,
    tone: str,
    campaign: str,
    location: str,
    marketing_goal: str = "Brand Awareness"
) -> dict:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

    model = genai.GenerativeModel(
        'gemini-2.5-flash',
        generation_config={"response_mime_type": "application/json"}
    )

    platform_tips = PLATFORM_GUIDANCE.get(platform, PLATFORM_GUIDANCE["Instagram"])

    system_prompt = """You are a Professional Social Media Advertisement Designer & Marketing Strategist.

Your job is to help businesses create high-converting STATIC promotional social media posts.

You must generate:
1. Social media caption (engaging, platform-optimized)
2. CTA (clear call-to-action)
3. Hashtags (relevant, trending, niche-specific)
4. Advertisement Post Guidance (static post design direction)
5. Poster Design Suggestions (visual layout and elements)
6. Brand Style Recommendations (colors, typography, branding)
7. Advertisement Layout Ideas (text hierarchy, placement)

CRITICAL RULES:
- Focus ONLY on static promotional post guidance (images, posters, banners, creatives).
- NEVER generate reel suggestions, video guidance, cinematic shots, camera movement suggestions, or video hooks.
- NEVER mention reels, videos, motion graphics, transitions, or any video-related content.
- All guidance must be for STATIC IMAGE posts only (promotional posters, advertisement banners, marketing creatives, branded designs).

Output a JSON object with an array of 'captions'. Each object must include caption, cta, hashtags, and post_guidance."""

    user_prompt = f"""Generate 3 variations of promotional social media advertisement content based on:

Business Type: {business_type}
Target Audience: {target_audience}
Platform: {platform}
Tone: {tone}
Campaign/Topic: {campaign}
Location: {location}
Marketing Goal: {marketing_goal}

{platform_tips}

Each variation must have a DIFFERENT design approach and visual style.

Ensure the output is valid JSON matching this EXACT schema:
{{
  "captions": [
    {{
      "caption": "Engaging social media caption text with emojis",
      "cta": "Clear call-to-action text",
      "hashtags": ["#Hashtag1", "#Hashtag2", "#Hashtag3", "#Hashtag4", "#Hashtag5"],
      "post_guidance": {{
        "post_type": "Specific static post type for {platform}",
        "poster_headline": "Bold headline for the poster/creative",
        "design_style": "Visual design direction and mood",
        "color_palette": ["Color1", "Color2", "Color3"],
        "visual_elements": ["Element1", "Element2", "Element3"],
        "text_placement": "Where headline, body text, and CTA should go on the poster",
        "branding_tip": "Specific branding advice for this post",
        "engagement_tip": "Strategy to maximize engagement with this static post"
      }}
    }}
  ]
}}

Remember: ALL guidance must be for STATIC promotional posts ONLY. No reels, no videos, no motion content."""

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
        raise RuntimeError(f"Gemini API error: {e}")
