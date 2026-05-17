from models.schemas import ConfidenceScore, ScrapedData, PageSpeedData

def compute_confidence_score(
    scraped: ScrapedData,
    pagespeed: PageSpeedData,
    has_social_posts: bool,
    has_user_url: bool
) -> ConfidenceScore:
    """
    Computes a deterministic 0-100% confidence rating indicating analysis reliability
    based on the depth and success of gathered data inputs.
    """
    score = 0
    factors = {}
    
    # 1. Scrape success & page size (Max 25 pts)
    if scraped.scrape_success:
        score += 15
        factors["Competitor Website Crawling"] = 15
        
        if scraped.word_count >= 300:
            score += 10
            factors["Rich Content Extraction (>300 words)"] = 10
        elif scraped.word_count > 0:
            score += 5
            factors["Thin Content Extraction (<300 words)"] = 5
    else:
        factors["Competitor Website Crawling (Failed)"] = 0
        
    # 2. PageSpeed API success (Max 20 pts)
    if pagespeed.fetch_success:
        score += 20
        factors["Lighthouse Performance Diagnostics"] = 20
    else:
        factors["Lighthouse Performance Diagnostics (Failed)"] = 0
        
    # 3. Meta and SEO footprints (Max 15 pts)
    meta_score = 0
    if scraped.page_title:
        meta_score += 5
    if scraped.meta_description:
        meta_score += 5
    if scraped.image_count > 0 and scraped.images_with_alt > 0:
        meta_score += 5
        
    if meta_score > 0:
        score += meta_score
        factors["SEO Meta Data Completeness"] = meta_score

    # 4. Social postings depth (Max 20 pts)
    if has_social_posts:
        score += 20
        factors["Competitor Social Copy Integration"] = 20
    else:
        factors["Competitor Social Copy Integration (Missing)"] = 0

    # 5. Side-by-side comparative comparison (Max 20 pts)
    if has_user_url:
        score += 20
        factors["Side-by-Side Brand Comparison Context"] = 20
    else:
        factors["Side-by-Side Brand Comparison Context (Missing)"] = 0

    # Enforce bounds
    score = max(0, min(100, score))
    
    # Categorization labels
    if score >= 80:
        label = "High Confidence"
    elif score >= 50:
        label = "Medium Confidence"
    else:
        label = "Low Confidence"
        
    return ConfidenceScore(
        score=score,
        factors=factors,
        label=label
    )
stream = None
