from groq import Groq
import os
import json
from datetime import datetime, timedelta
from typing import Dict, Any, List
import io
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet


def generate_mock_calendar(duration: str, business_name: str, industry: str, primary_platform: str) -> Dict[str, Any]:
    """Generate mock calendar data when AI is not available"""
    if duration == "weekly":
        days_count = 7
        labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    else:
        days_count = 30
        labels = [f"Day {i+1}" for i in range(30)]
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
            "description": f"Engaging content for {industry} business.",
            "objective": "Boost brand visibility and community trust.",
            "tasks": "Create 1 High-quality graphic; Write a compelling caption; Schedule for morning peak.",
            "milestones": "Goal: Reach 500+ impressions.",
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
- Objective (specific daily objective)
- Tasks (detailed tasks and activities to perform)
- Milestones (recommendations or milestones for the day)
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
      "description": "Brief summary",
      "objective": "Specific daily goal",
      "tasks": "Step-by-step activities",
      "milestones": "Daily recommendation or target milestone",
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
2. For monthly calendar, use the day labels: Day 1, Day 2, ... Day 30.
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


def generate_calendar_pdf(calendar_data: Dict[str, Any], business_data: Dict[str, Any]) -> io.BytesIO:
    """
    Generate a well-formatted PDF for the content calendar.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, 
        pagesize=A4,
        rightMargin=40, 
        leftMargin=40, 
        topMargin=40, 
        bottomMargin=40
    )
    styles = getSampleStyleSheet()
    elements = []

    # Title
    business_name = calendar_data.get("business_name", "Your Business")
    elements.append(Paragraph(f"Content Strategy Planner: {business_name}", styles['Title']))
    elements.append(Spacer(1, 15))

    # User Inputs/Preferences Section
    elements.append(Paragraph("Planner Profile & Preferences", styles['Heading2']))
    elements.append(Paragraph(f"<b>Industry:</b> {business_data.get('industry', 'N/A')}", styles['Normal']))
    elements.append(Paragraph(f"<b>Plan Duration:</b> {calendar_data.get('duration', 'N/A').capitalize()}", styles['Normal']))
    elements.append(Paragraph(f"<b>Primary Goal:</b> {business_data.get('primaryGoal', 'N/A')}", styles['Normal']))
    
    audience = business_data.get('audienceType', 'General')
    if isinstance(audience, list):
        audience = ", ".join(audience)
    elements.append(Paragraph(f"<b>Target Audience:</b> {audience}", styles['Normal']))

    elements.append(Paragraph(f"<b>Location:</b> {business_data.get('location', 'Global')}", styles['Normal']))
    elements.append(Spacer(1, 20))

    # Calendar Table Overview
    elements.append(Paragraph("Schedule Overview", styles['Heading2']))
    elements.append(Spacer(1, 10))
    
    # Table Data
    table_data = [["Day/Week", "Type", "Title", "Platform"]]
    for day in calendar_data.get("calendar_days", []):
        table_data.append([
            day.get("date", ""),
            day.get("content_type", ""),
            Paragraph(day.get("title", ""), styles['Normal']),
            day.get("platform", "")
        ])

    # Table Styling
    t = Table(table_data, colWidths=[70, 60, 240, 90], repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#2c3e50")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 25))

    # Detailed Content Section
    elements.append(Paragraph("Detailed Content Breakdown", styles['Heading2']))
    elements.append(Spacer(1, 10))
    
    for day in calendar_data.get("calendar_days", []):
        elements.append(Paragraph(f"<b>{day.get('date')} - {day.get('title')}</b>", styles['Heading3']))
        elements.append(Paragraph(f"<i>Platform:</i> {day.get('platform')} | <i>Type:</i> {day.get('content_type')} | <i>Time:</i> {day.get('recommended_time')}", styles['Normal']))
        elements.append(Paragraph(f"<b>Daily Objective:</b> {day.get('objective', day.get('purpose'))}", styles['Normal']))
        elements.append(Paragraph(f"<b>Tasks:</b> {day.get('tasks', day.get('description'))}", styles['Normal']))
        if day.get('milestones'):
            elements.append(Paragraph(f"<b>Milestones:</b> {day.get('milestones')}", styles['Normal']))
        elements.append(Paragraph(f"<i>CTA:</i> {day.get('cta')}", styles['Normal']))
        
        hashtags = day.get('hashtags', [])
        tags_str = " ".join(hashtags) if isinstance(hashtags, list) else str(hashtags)
        elements.append(Paragraph(f"<i>Hashtags:</i> {tags_str}", styles['Normal']))
        elements.append(Spacer(1, 15))

    doc.build(elements)
    buffer.seek(0)
    return buffer
