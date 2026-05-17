"""
Pydantic schemas for the Competitor Analysis API.
Defines all request/response models with strict typing.
"""

from pydantic import BaseModel, HttpUrl, Field
from typing import Optional


# ── Request Models ──────────────────────────────────────────────

class CompetitorInput(BaseModel):
    """Single competitor input from the user."""
    name: str = Field(..., min_length=1, description="Competitor brand name")
    website_url: str = Field(..., description="Competitor website URL")
    social_posts: Optional[list[str]] = Field(
        default=None,
        description="Optional list of pasted social media posts/captions"
    )


class AnalysisRequest(BaseModel):
    """Full analysis request — supports multiple competitors."""
    competitors: list[CompetitorInput] = Field(
        ..., min_length=1, max_length=5,
        description="List of competitors to analyze (1-5)"
    )
    user_website_url: Optional[str] = Field(
        default=None,
        description="User's own website URL for side-by-side comparison"
    )
    industry: Optional[str] = Field(
        default=None,
        description="Industry/niche for contextualizing analysis"
    )
    user_usp: Optional[str] = Field(
        default=None,
        description="User's Business Unique Selling Proposition (USP)"
    )
    user_audience: Optional[str] = Field(
        default=None,
        description="User's Target Audience description"
    )
    user_brand_tone: Optional[str] = Field(
        default=None,
        description="User's Brand copywriting tone"
    )


# ── Scraped Data Models ─────────────────────────────────────────

class ScrapedData(BaseModel):
    """Raw data extracted from a website via scraping."""
    url: str
    page_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    h1_tags: list[str] = []
    h2_tags: list[str] = []
    h3_tags: list[str] = []
    body_text: str = ""
    word_count: int = 0
    image_count: int = 0
    images_with_alt: int = 0
    internal_links: int = 0
    external_links: int = 0
    social_links: list[str] = []
    has_viewport_meta: bool = False
    has_canonical: bool = False
    has_og_tags: bool = False
    has_twitter_cards: bool = False
    detected_technologies: list[str] = []
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    favicon: Optional[str] = None
    scrape_success: bool = True
    error_message: Optional[str] = None


# ── SEO Models ──────────────────────────────────────────────────

class SEOCheckItem(BaseModel):
    """Individual SEO check result."""
    check_name: str
    passed: bool
    details: str
    points: int
    max_points: int


class SEOScore(BaseModel):
    """Complete SEO analysis with individual checks."""
    total_score: int = Field(..., ge=0, le=100)
    checks: list[SEOCheckItem] = []
    passed_count: int = 0
    total_checks: int = 0


# ── Keyword Models ──────────────────────────────────────────────

class KeywordItem(BaseModel):
    """Single keyword with its TF-IDF score and frequency."""
    keyword: str
    tfidf_score: float
    frequency: int


class KeywordData(BaseModel):
    """Keyword extraction results."""
    top_keywords: list[KeywordItem] = []
    total_unique_words: int = 0
    keyword_overlap: Optional[list[str]] = None
    user_only_keywords: Optional[list[str]] = None
    competitor_only_keywords: Optional[list[str]] = None


# ── PageSpeed Models ────────────────────────────────────────────

class WebVitals(BaseModel):
    """Core Web Vitals metrics."""
    lcp: Optional[str] = None  # Largest Contentful Paint
    cls: Optional[str] = None  # Cumulative Layout Shift
    fid: Optional[str] = None  # First Input Delay
    fcp: Optional[str] = None  # First Contentful Paint
    ttfb: Optional[str] = None  # Time to First Byte


class PageSpeedData(BaseModel):
    """PageSpeed Insights results."""
    performance_score: Optional[int] = None
    seo_score: Optional[int] = None
    accessibility_score: Optional[int] = None
    best_practices_score: Optional[int] = None
    web_vitals: Optional[WebVitals] = None
    strategy: str = "mobile"
    fetch_success: bool = True
    error_message: Optional[str] = None


# ── Evidence Anchor Models (Improvement 1 + 5) ─────────────────

class EvidenceAnchor(BaseModel):
    """Evidence backing for each AI insight — eliminates hallucination."""
    source: str = Field(..., description="Data field name (e.g., 'meta_description')")
    value: str = Field(..., description="Actual value found")
    raw_metric: Optional[str] = Field(None, description="Quantified metric")
    reason: str = Field(..., description="Why this matters")


class SWOTItem(BaseModel):
    """Single SWOT insight with evidence anchor."""
    insight: str
    evidence: EvidenceAnchor


class SWOTAnalysis(BaseModel):
    """Full SWOT analysis with citation-based evidence."""
    strengths: list[SWOTItem] = []
    weaknesses: list[SWOTItem] = []
    opportunities: list[SWOTItem] = []
    recommendations: list[SWOTItem] = []
    content_strategy_summary: str = ""


# ── Content Classification Models (Improvement 2) ──────────────

class ContentClassification(BaseModel):
    """Content intent distribution."""
    promotional: float = 0.0
    educational: float = 0.0
    emotional: float = 0.0
    community: float = 0.0
    brand_awareness: float = 0.0
    primary_intent: str = "unknown"
    insight: str = ""


# ── Content Frequency Models (Improvement 3) ───────────────────

class FrequencyAnalysis(BaseModel):
    """Post pattern analysis from multiple social posts."""
    total_posts_analyzed: int = 0
    avg_post_length: float = 0.0
    cta_frequency: float = 0.0  # percentage of posts with CTA
    emoji_density: float = 0.0  # avg emojis per post
    hashtag_density: float = 0.0  # avg hashtags per post
    dominant_hook_style: str = ""
    hook_styles: dict = {}  # e.g., {"question": 3, "emotional": 2}
    cta_examples: list[str] = []
    insight: str = ""


# ── Trend Gap Models (Improvement 6) ───────────────────────────

class TrendGapItem(BaseModel):
    """Single trend gap detected."""
    trending_topic: str
    trend_score: int = Field(..., ge=0, le=100, description="Google Trends interest score")
    competitor_coverage: bool = False
    gap_insight: str = ""


class TrendGapData(BaseModel):
    """Trend gap analysis results."""
    gaps: list[TrendGapItem] = []
    region: str = ""
    analysis_period: str = ""
    fetch_success: bool = True
    error_message: Optional[str] = None


# ── Confidence Score Model (Improvement 4) ─────────────────────

class ConfidenceScore(BaseModel):
    """Analysis confidence based on data completeness."""
    score: int = Field(..., ge=0, le=100)
    factors: dict = {}  # e.g., {"website_scraped": 25, "pagespeed_fetched": 20}
    label: str = ""  # "High", "Medium", "Low"


# ── Full Response Models ────────────────────────────────────────

class SingleCompetitorResult(BaseModel):
    """Complete analysis result for one competitor."""
    competitor_name: str
    competitor_url: str
    scraped_data: Optional[ScrapedData] = None
    seo_score: Optional[SEOScore] = None
    keywords: Optional[KeywordData] = None
    pagespeed: Optional[PageSpeedData] = None
    swot: Optional[SWOTAnalysis] = None
    content_classification: Optional[ContentClassification] = None
    frequency_analysis: Optional[FrequencyAnalysis] = None
    trend_gaps: Optional[TrendGapData] = None
    confidence: Optional[ConfidenceScore] = None


class FullAnalysisResponse(BaseModel):
    """Complete response containing results for all competitors."""
    competitors: list[SingleCompetitorResult] = []
    user_analysis: Optional[SingleCompetitorResult] = None
    comparison_summary: Optional[str] = None
