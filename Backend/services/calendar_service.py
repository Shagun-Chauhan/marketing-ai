from groq import Groq
import os
import json
from datetime import datetime, timedelta
from typing import Dict, Any, List


def generate_mock_calendar(duration: str, business_name: str, industry: str, primary_platform: str) -> Dict[str, Any]:
    """Generate mock calendar data when AI is not available"""
    if duration == "weekly":
        days_count = 7
        labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    else:
        days_count = 5
        labels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"]
    calendar_days = []
    
    content_types = ["Post", "Reel", "Story", "Carousel", "Video"]
    purposes = ["Awareness", "Engagement", "Lead Generation", "Sales", "Retention"]
    priorities = ["High", "Medium", "Low"]
    categories = ["Offer", "Product", "Service", "Educational", "Testimonial", "Launch", "Festival", "Seasonal"]
    
    for i in range(days_count):
        calendar_days.append({
            "date": labels[i],
            "content_type": content_types[i % len(content_types)],
            "title": f"{business_name} - {labels[i]} Content",
            "description": f"Engaging content for {industry} business focusing on brand awareness and customer engagement.",
            "purpose": purposes[i % len(purposes)],
            "recommended_time": "10:00 AM",
            "platform": primary_platform,
            "cta": "Visit our website for more details",
            "hashtags": ["#business", "#growth", "#marketing", "#socialmedia", "#engagement"],
            "priority": priorities[i % len(priorities)],
            "campaign_category": categories[i % len(categories)]
        })
    
    return {
        "calendar_days": calendar_days,
        "duration": duration,
        "business_name": business_name,
        "generated_at": datetime.now().isoformat()
    }


def generate_calendar_with_gemini(
    duration: str,
    business_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Generate AI-powered content calendar using Groq API.
    
    Args:
        duration: 'weekly' or 'monthly'
        business_data: Dictionary containing business profile information
    
    Returns:
        Dictionary with generated calendar data
    """
    # Check if API key is available
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or api_key == "your_groq_api_key_here":
        print("GROQ_API_KEY not configured, using fallback mock data")
        business_name = business_data.get("businessName", "Your Business")
        industry = business_data.get("industry", "General Business")
        primary_platform = business_data.get("primaryPlatform", "Instagram")
        return generate_mock_calendar(duration, business_name, industry, primary_platform)
    
    client = Groq(api_key=api_key)
    
    # Extract key business information
    business_name = business_data.get("businessName", "Your Business")
    industry = business_data.get("industry", "General Business")
    description = business_data.get("description", "")
    target_audience = business_data.get("audienceType", [])
    age_group = business_data.get("ageGroup", "")
    interests = business_data.get("interests", [])
    primary_goal = business_data.get("primaryGoal", "Brand Awareness")
    primary_platform = business_data.get("primaryPlatform", "Instagram")
    secondary_platforms = business_data.get("secondaryPlatforms", [])
    content_format = business_data.get("contentFormat", [])
    tone = business_data.get("tone", [])
    usp = business_data.get("usp", "")
    location = business_data.get("location", "")
    
    # Determine number of days
    days_count = 7 if duration == "weekly" else 5
    
    # Build platform list
    platforms = [primary_platform] + secondary_platforms if secondary_platforms else [primary_platform]
    platforms_str = ", ".join(platforms)
    
    # Build content format list
    content_formats = content_format if content_format else ["Post", "Reel", "Story", "Carousel"]
    content_formats_str = ", ".join(content_formats)
    
    # Build audience description
    audience_desc = f"{', '.join(target_audience) if target_audience else 'General audience'}, {age_group} age group"
    if interests:
        audience_desc += f", interested in {', '.join(interests)}"
    
    # Build tone description
    tone_desc = ", ".join(tone) if tone else "Professional and engaging"
    
    system_prompt = """You are an expert Social Media Content Strategist and Marketing AI.

Your task is to generate a comprehensive content calendar for businesses based on their profile.

You must create a day-by-day content plan that includes:
- Day/Week Label (e.g., Monday or Week 1)
- Content Type (Post, Reel, Story, Carousel, Video)
- Title (catchy, relevant title)
- Description (detailed content description)
- Purpose (Awareness, Engagement, Lead Generation, Sales, Retention)
- Recommended Time (best posting time for the platform)
- Platform (Instagram, Facebook, LinkedIn, X, YouTube)
- CTA (clear call-to-action)
- Hashtags (5-10 relevant hashtags)
- Priority (High, Medium, Low)
- Campaign Category (Offer, Product, Service, Educational, Testimonial, Launch, Festival, Seasonal)

GUIDELINES:
1. Tailor content to the specific business type and industry
2. Mix content types for variety (don't use the same type every day)
3. Align content with the business goals and target audience
4. Include platform-specific best practices
5. Ensure content is engaging and actionable
6. Use appropriate posting times for each platform
7. Create a logical content flow (awareness → engagement → conversion)
8. Include seasonal/festival content when relevant
9. Highlight USP (Unique Selling Proposition) in key posts
10. Vary priority levels based on importance

BUSINESS TYPE EXAMPLES:
- Cafe: Menu highlights, behind-the-scenes, coffee making, customer reviews, weekend offers
- Salon: Hair transformations, client testimonials, service promotions
- Gym: Workout routines, transformation stories, membership offers
- Restaurant: Signature dishes, chef stories, combo offers
- Retail: Product showcases, styling tips, seasonal sales
- Service: Educational content, case studies, service benefits

Output must be valid JSON with this exact schema:
{
  "calendar_days": [
    {
      "date": "Monday/Week 1",
      "content_type": "Post/Reel/Story/Carousel/Video",
      "title": "Content title",
      "description": "Detailed description",
      "purpose": "Awareness/Engagement/Lead Generation/Sales/Retention",
      "recommended_time": "HH:MM AM/PM",
      "platform": "Instagram/Facebook/LinkedIn/X/YouTube",
      "cta": "Call to action text",
      "hashtags": ["#tag1", "#tag2", "#tag3"],
      "priority": "High/Medium/Low",
      "campaign_category": "Offer/Product/Service/Educational/Testimonial/Launch/Festival/Seasonal"
    }
  ]
}"""

    user_prompt = f"""Generate a {duration} content calendar ({days_count} days) for:

BUSINESS NAME: {business_name}
INDUSTRY: {industry}
DESCRIPTION: {description}
LOCATION: {location}

TARGET AUDIENCE: {audience_desc}

BUSINESS GOALS: 
- Primary: {primary_goal}
- USP: {usp}

PLATFORMS: {platforms_str}
CONTENT FORMATS: {content_formats_str}
BRAND TONE: {tone_desc}

Generate {days_count} unique content entries.

IMPORTANT: 
1. For weekly calendar, use the day names: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.
2. For monthly calendar, use the week labels: Week 1, Week 2, Week 3, Week 4, Week 5.
3. DO NOT use actual dates (YYYY-MM-DD) or specify any year like 2024.

Ensure variety in content types, purposes, and campaign categories."""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_prompt
                }
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        raw_text = response.choices[0].message.content.strip()
        
        # Clean up JSON response
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.startswith("```"):
            raw_text = raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
        
        result = json.loads(raw_text.strip())
        
        # Add metadata
        result["duration"] = duration
        result["business_name"] = business_name
        result["generated_at"] = datetime.now().isoformat()
        
        return result
    except Exception as e:
        print(f"Error generating calendar with Groq: {e}")
        print("Using fallback mock data")
        return generate_mock_calendar(duration, business_name, industry, primary_platform)
