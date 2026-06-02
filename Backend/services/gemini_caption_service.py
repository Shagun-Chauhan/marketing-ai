import google.generativeai as genai
import os
import json

# The AI behaves like: "Practical Business Ad Advisor"
# Generates: caption, CTA, hashtags, advertisement blueprint, poster layout, why-this-works
# Focus: ONLY static promotional posts — NO reels, videos, cinematic content
# Language: Simple, business-owner friendly — NO designer jargon

PLATFORM_GUIDANCE = {
    "Instagram": (
        "Instagram Post Tips:\n"
        "- Best size: 1080x1080 pixels (square)\n"
        "- Keep text short — the image should grab attention first\n"
        "- Use a bold headline people can read on a phone screen\n"
        "- Put your logo in a corner so it doesn't block the main image\n"
        "- Add a clear button-like text at the bottom (e.g., 'Order Now')"
    ),
    "LinkedIn": (
        "LinkedIn Post Tips:\n"
        "- Best size: 1200x627 pixels (landscape) or 1080x1080 (square)\n"
        "- Keep it professional — use clean backgrounds, no flashy neon colors\n"
        "- Show what your business does or the value you provide\n"
        "- Include your company logo and name\n"
        "- Use facts, numbers, or results to build trust"
    ),
    "Facebook": (
        "Facebook Post Tips:\n"
        "- Best size: 1200x630 pixels or 1080x1080 (square)\n"
        "- Use warm and friendly colors that feel inviting\n"
        "- Make text big enough to read on mobile phones\n"
        "- Highlight the deal or offer front and center\n"
        "- Include a clear call-to-action like 'Shop Now' or 'Visit Us'"
    ),
    "Twitter": (
        "Twitter/X Post Tips:\n"
        "- Best size: 1200x675 pixels\n"
        "- Keep everything short and punchy\n"
        "- Use 3-5 strong hashtags for discoverability\n"
        "- Make the image eye-catching since feeds move fast\n"
        "- Include a direct link or CTA in the post text"
    ),
}


def generate_caption_with_gemini(
    business_type: str,
    target_audience: str,
    platform: str,
    tone: str,
    campaign: str,
    location: str,
    marketing_goal: str = "Brand Awareness",
    business_name: str = "",
    offer: str = None,
    additional_notes: str = None,
) -> dict:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

    model = genai.GenerativeModel(
        'gemini-2.5-flash',
        generation_config={"response_mime_type": "application/json"}
    )

    platform_tips = PLATFORM_GUIDANCE.get(platform, PLATFORM_GUIDANCE["Instagram"])

    system_prompt = """You are a Practical Business Ad Advisor who helps small business owners create effective social media advertisements.

You speak in simple, everyday language. The business owner you are helping has ZERO design experience.

Your job is to tell them EXACTLY what to put in their advertisement post — like giving instructions to a friend.

You must generate:
1. Social media caption (engaging, ready to copy-paste)
2. CTA (a clear action you want the viewer to take)
3. Hashtags (relevant hashtags that help the post get discovered)
4. Advertisement Blueprint (step-by-step what to put in the image post)
5. Why This Ad Will Work (business reasons, not design reasons)
6. Poster Layout Guide (what goes at the top, middle, and bottom of the post)

CRITICAL RULES:
- Focus ONLY on static image posts (posters, banners, single-image ads).
- NEVER suggest reels, videos, animations, motion graphics, or transitions.
- NEVER use designer jargon like: typography hierarchy, branding consistency, cinematic visuals, visual composition, serif fonts, embossed logo, color theory, negative space, or visual weight.
- Explain everything as if talking to a business owner who will create this in Canva or give instructions to a local printer.
- Be specific — don't say "use professional imagery", say "use a photo of your actual product on a clean table".
- For colors, say the actual color name and where to use it (e.g., "Use dark blue for the background and white for the text").

Output a JSON object with an array of 'captions'."""

    # Build optional context lines
    optional_lines = []
    if business_name:
        optional_lines.append(f"Business Name: {business_name}")
    if offer:
        optional_lines.append(f"Special Offer: {offer}")
    if additional_notes:
        optional_lines.append(f"Additional Notes: {additional_notes}")
    optional_block = "\n".join(optional_lines)

    user_prompt = f"""Generate 3 different advertisement ideas for this business:

{f"Business Name: {business_name}" if business_name else ""}
Business Type: {business_type}
Target Audience: {target_audience}
Platform: {platform}
Tone: {tone}
Campaign/Topic: {campaign}
Location: {location}
Marketing Goal: {marketing_goal}
{f"Special Offer: {offer}" if offer else ""}
{f"Additional Notes: {additional_notes}" if additional_notes else ""}

{platform_tips}

Each idea should look completely different and take a different approach.

Ensure the output is valid JSON matching this EXACT schema:
{{
  "captions": [
    {{
      "caption": "Ready-to-post social media caption with emojis. Keep it engaging and natural.",
      "cta": "Clear call-to-action — what should the viewer do? (e.g., 'Visit us today!', 'DM to book', 'Link in bio')",
      "hashtags": ["#Hashtag1", "#Hashtag2", "#Hashtag3", "#Hashtag4", "#Hashtag5"],
      "advertisement_blueprint": {{
        "post_type": "What kind of post to create — e.g., 'Square image post for {platform} Feed'",
        "main_headline": "The big bold text that should be written on the image — this is the first thing people see",
        "main_image": "Describe exactly what photo or image should be used. Be very specific. E.g., 'A photo of a fresh pizza being pulled out of a wood-fired oven with cheese stretching'",
        "offer_text": "What deal or offer text should be shown on the post — e.g., 'Flat 30% OFF this weekend only'",
        "background_idea": "What the background of the post should look like — e.g., 'A solid dark red background' or 'A blurred photo of your restaurant'",
        "logo_position": "Where to place the business logo — e.g., 'Top-right corner, keep it small'",
        "cta_position": "Where to put the call-to-action text and what it should say — e.g., 'Put a yellow button at the bottom saying Order Now'",
        "recommended_size": "1080x1080"
      }},
      "why_this_will_work": [
        "Business reason 1 — why this ad will attract customers (e.g., 'Limited-time offers create urgency and drive quick decisions')",
        "Business reason 2 — why this will resonate with the target audience",
        "Business reason 3 — why this format works well on this platform"
      ],
      "poster_layout": {{
        "top_section": "What to put at the top of the post — e.g., 'Your cafe logo and name in small text'",
        "center_section": "What to put in the middle — e.g., 'The main food photo with the headline overlaid in big white text'",
        "bottom_section": "What to put at the bottom — e.g., 'The offer text, a CTA button, and your phone number/address'",
        "color_suggestion": "What colors to use and why — e.g., 'Use deep red and white — red grabs attention and white makes text easy to read'"
      }}
    }}
  ]
}}

Remember:
- ALL guidance must be for STATIC IMAGE posts ONLY.
- Use simple language a business owner can understand.
- Be specific about what image to use, what text to write, and where to put things.
- Do NOT use design jargon."""

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
