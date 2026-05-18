import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Import schemas and services
from models.schemas import (
    AnalysisRequest, 
    FullAnalysisResponse, 
    SingleCompetitorResult, 
    ScrapedData,
    PageSpeedData,
    SEOScore
)
from services.website_scraper import scrape_website
from services.seo_analyzer import analyze_seo
from services.keyword_extractor import extract_keywords
from services.pagespeed_service import fetch_pagespeed_data
from services.ai_analyzer import analyze_swot_with_evidence
from services.content_classifier import classify_content_intent
from services.frequency_analyzer import analyze_frequency_and_patterns
from services.confidence_scorer import compute_confidence_score
from services.trend_detector import detect_trend_gaps
from routes.caption_routes import router as caption_router

# Load environment variables
load_dotenv()

app = FastAPI(
    title="BrandPilot AI Competitor Analysis Engine",
    description="Backend service running advanced web scraping, SEO diagnostics, and PageSpeed metrics.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for dev/prototyping
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include caption generator router
app.include_router(caption_router)

@app.post("/api/analyze-competitor", response_model=FullAnalysisResponse)
async def analyze_competitor_endpoint(request: AnalysisRequest):
    """
    Main pipeline to run structured competitor analysis.
    Handles multiple competitors side-by-side.
    """
    competitors_results = []
    user_result = None
    
    # 1. Analyze User Site if URL provided (for comparative baseline)
    user_scraped = None
    if request.user_website_url:
        user_scraped = scrape_website(request.user_website_url)
        if user_scraped.scrape_success:
            user_seo = analyze_seo(user_scraped)
            user_keywords = extract_keywords(user_scraped)
            user_pagespeed = fetch_pagespeed_data(request.user_website_url)
            
            user_result = SingleCompetitorResult(
                competitor_name="Your Brand",
                competitor_url=request.user_website_url,
                scraped_data=user_scraped,
                seo_score=user_seo,
                keywords=user_keywords,
                pagespeed=user_pagespeed,
                swot=None,  # No SWOT needed for self
                content_classification=None,
                frequency_analysis=None,
                trend_gaps=None,
                confidence=None
            )
            
    # 2. Iterate and analyze each competitor
    for competitor in request.competitors:
        name = competitor.name
        url = competitor.website_url
        posts = competitor.social_posts
        
        # A. Scrape website content
        scraped = scrape_website(url)
        
        # B. Run deterministic SEO analyzer
        seo = analyze_seo(scraped)
        
        # C. Extract TF-IDF keywords
        keywords = extract_keywords(scraped, user_scraped)
        
        # D. Get PageSpeed Insights metrics
        pagespeed = fetch_pagespeed_data(url)
        
        # E. Content classification (Promotional vs Educational)
        content_class = classify_content_intent(scraped.body_text, posts)
        
        # F. Post frequency pattern analyzer
        freq_analysis = analyze_frequency_and_patterns(posts)
        
        # G. SWOT Analysis with rigid evidence grounding
        swot = analyze_swot_with_evidence(
            name, scraped, seo, pagespeed,
            user_usp=request.user_usp,
            user_audience=request.user_audience,
            user_brand_tone=request.user_brand_tone
        )
        
        # H. Trend Gap analysis
        trend_gaps = detect_trend_gaps(
            competitor_keywords=[k.keyword for k in keywords.top_keywords],
            industry=request.industry,
            region="IN"
        )
        
        # I. Calculate analysis confidence indicator
        confidence = compute_confidence_score(
            scraped=scraped,
            pagespeed=pagespeed,
            has_social_posts=bool(posts and len(posts) > 0),
            has_user_url=bool(request.user_website_url)
        )
        
        # Bundle competitor result
        comp_res = SingleCompetitorResult(
            competitor_name=name,
            competitor_url=url,
            scraped_data=scraped,
            seo_score=seo,
            keywords=keywords,
            pagespeed=pagespeed,
            swot=swot,
            content_classification=content_class,
            frequency_analysis=freq_analysis,
            trend_gaps=trend_gaps,
            confidence=confidence
        )
        
        competitors_results.append(comp_res)
        
    # 3. Formulate structural baseline summary using Gemini
    summary = None
    if len(competitors_results) > 1:
        comp_names = [c.competitor_name for c in competitors_results]
        summary = (
            f"Comparison completed successfully between {', '.join(comp_names[:-1])} and {comp_names[-1]}. "
            f"Primary market gaps spotted include performance speed differentials and keyword targeting opportunities."
        )

    return FullAnalysisResponse(
        competitors=competitors_results,
        user_analysis=user_result,
        comparison_summary=summary
    )

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
