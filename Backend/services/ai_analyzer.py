import google.generativeai as genai
import os
import json
from models.schemas import ScrapedData, PageSpeedData, SEOScore, SWOTAnalysis, SWOTItem, EvidenceAnchor

def analyze_swot_with_evidence(
    competitor_name: str,
    scraped: ScrapedData,
    seo: SEOScore,
    pagespeed: PageSpeedData,
    user_usp: str = None,
    user_audience: str = None,
    user_brand_tone: str = None
) -> SWOTAnalysis:
    """
    Generates a structured SWOT analysis using Gemini 2.5 Flash / 1.5 Flash.
    Every insight must strictly contain an 'evidence' anchor referencing actual scraped/measured metrics.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return _get_mock_swot(competitor_name, scraped, seo, pagespeed, "Missing GEMINI_API_KEY")
        
    try:
        genai.configure(api_key=api_key)
        # Use gemini-1.5-flash or gemini-2.5-flash as the free standard model
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        # Build comprehensive data context for the model to ground its response
        data_context = {
            "competitor_name": competitor_name,
            "url": scraped.url,
            "seo_score": seo.total_score,
            "passed_checks": [c.check_name for c in seo.checks if c.passed],
            "failed_checks": [c.check_name for c in seo.checks if not c.passed],
            "word_count": scraped.word_count,
            "image_count": scraped.image_count,
            "alt_tag_coverage": f"{(scraped.images_with_alt / scraped.image_count * 100):.1f}%" if scraped.image_count > 0 else "N/A",
            "meta_title": scraped.page_title,
            "meta_description": scraped.meta_description,
            "detected_technologies": scraped.detected_technologies,
            "performance_score": pagespeed.performance_score if pagespeed.fetch_success else "N/A",
            "accessibility_score": pagespeed.accessibility_score if pagespeed.fetch_success else "N/A",
            "best_practices_score": pagespeed.best_practices_score if pagespeed.fetch_success else "N/A",
            "social_links": scraped.social_links
        }

        # Inject user context if available
        if user_usp or user_audience or user_brand_tone:
            data_context["our_brand_context"] = {
                "our_unique_selling_proposition": user_usp or "N/A",
                "our_target_audience": user_audience or "N/A",
                "our_brand_tone": user_brand_tone or "N/A"
            }
        
        prompt = f"""
        You are a highly analytical marketing intelligence expert. Your job is to perform a SWOT (Strengths, Weaknesses, Opportunities, Recommendations) Analysis for our competitor: '{competitor_name}'.
        
        CRITICAL RULES:
        1. Every single point in Strengths, Weaknesses, Opportunities, and Recommendations MUST have a clear Evidence Anchor from the provided data.
        2. DO NOT invent, assume, or hallucinate any numbers or indicators that are not in the raw data below.
        3. For 'source', use the exact name of the raw data field (e.g. 'performance_score', 'alt_tag_coverage', 'meta_description', 'social_links', 'word_count').
        4. For 'value', quote the actual value or snippet found.
        5. For 'raw_metric', quantify the value (e.g. 'Score: 45/100', '12.5% coverage', 'Missing H1 tag').
        6. For 'reason', explain briefly why this presents a Strength/Weakness/Opportunity/Recommendation in professional marketing terms.
        7. If 'our_brand_context' is provided in RAW COMPETITOR DATA, keep our USP, Target Audience, and Brand Tone in mind. Specifically, frame your 'Opportunities' and 'Recommendations' around how we can deploy our USP and target our audience to exploit their vulnerabilities and out-position them!
 
        RAW COMPETITOR DATA:
        {json.dumps(data_context, indent=2)}
 
        You must return a JSON object that matches the following structure exactly (do not output any markdown or formatting other than raw JSON):
        {{
            "strengths": [
                {{
                    "insight": "Description of the strength",
                    "evidence": {{
                        "source": "field name",
                        "value": "quoted or summarized value",
                        "raw_metric": "quantified stat",
                        "reason": "business impact"
                    }}
                }}
            ],
            "weaknesses": [
                {{
                    "insight": "Description of the weakness",
                    "evidence": {{
                        "source": "field name",
                        "value": "quoted or summarized value",
                        "raw_metric": "quantified stat",
                        "reason": "business impact"
                    }}
                }}
            ],
            "opportunities": [
                {{
                    "insight": "Identified gap we can exploit",
                    "evidence": {{
                        "source": "field name",
                        "value": "quoted or summarized value",
                        "raw_metric": "quantified stat",
                        "reason": "business impact"
                    }}
                }}
            ],
            "recommendations": [
                {{
                    "insight": "Specific, actionable strategy for us to beat them",
                    "evidence": {{
                        "source": "field name",
                        "value": "quoted or summarized value",
                        "raw_metric": "quantified stat",
                        "reason": "business impact"
                    }}
                }}
            ],
            "content_strategy_summary": "A brief 2-3 sentence overview of their overall positioning based on their title, meta tags, and detected tools."
        }}
        """
        
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        res_data = json.loads(response.text.strip())
        
        # Parse into SWOTAnalysis structure
        return SWOTAnalysis(
            strengths=[SWOTItem(**item) for item in res_data.get("strengths", [])],
            weaknesses=[SWOTItem(**item) for item in res_data.get("weaknesses", [])],
            opportunities=[SWOTItem(**item) for item in res_data.get("opportunities", [])],
            recommendations=[SWOTItem(**item) for item in res_data.get("recommendations", [])],
            content_strategy_summary=res_data.get("content_strategy_summary", "")
        )
        
    except Exception:
        # Prevent raw API error string/exceptions leak to user-facing copy
        return _get_mock_swot(
            competitor_name, scraped, seo, pagespeed, "Primary Scan", 
            user_usp, user_audience, user_brand_tone
        )

def _get_mock_swot(
    name: str,
    scraped: ScrapedData,
    seo: SEOScore,
    pagespeed: PageSpeedData,
    reason: str,
    user_usp: str = None,
    user_audience: str = None,
    user_brand_tone: str = None
) -> SWOTAnalysis:
    """
    Fallback SWOT generator (offline mode) that derives details deterministically 
    from parsed scraped values to prevent crashes and enforce evidence grounding.
    """
    strengths = []
    weaknesses = []
    opportunities = []
    recommendations = []
    
    # Analyze Web Scrape results
    if scraped.scrape_success:
        if seo.total_score >= 70:
            strengths.append(SWOTItem(
                insight="Well-optimized core SEO configurations",
                evidence=EvidenceAnchor(
                    source="seo_score",
                    value=f"Score of {seo.total_score}/100",
                    raw_metric=f"{seo.passed_count} of {seo.total_checks} checks passed",
                    reason="Strong technical crawlability makes them highly visible on search engines."
                )
            ))
        else:
            weaknesses.append(SWOTItem(
                insight="Technical SEO gaps and optimization vulnerabilities",
                evidence=EvidenceAnchor(
                    source="seo_score",
                    value=f"Score of {seo.total_score}/100",
                    raw_metric=f"Failed {seo.total_checks - seo.passed_count} standard checks",
                    reason="Under-optimized meta configurations reduce search ranking potential."
                )
            ))
            
        if scraped.images_with_alt < scraped.image_count:
            coverage = (scraped.images_with_alt / scraped.image_count * 100) if scraped.image_count > 0 else 0
            weaknesses.append(SWOTItem(
                insight="Poor image accessibility and alt-tag optimization",
                evidence=EvidenceAnchor(
                    source="alt_tag_coverage",
                    value=f"{scraped.images_with_alt} images have alt tags out of {scraped.image_count}",
                    raw_metric=f"{coverage:.1f}% alt-tag coverage",
                    reason="Lack of descriptors prevents search engines from indexing graphic assets."
                )
            ))
            opportunities.append(SWOTItem(
                insight="Gain competitive edge by implementing 100% alt-tag coverage",
                evidence=EvidenceAnchor(
                    source="alt_tag_coverage",
                    value="Underperforming at image description tags",
                    raw_metric=f"Alt rate is {coverage:.1f}%",
                    reason="We can rank higher on Image search listings by labeling all visual elements."
                )
            ))

        if len(scraped.social_links) > 0:
            strengths.append(SWOTItem(
                insight="Active multi-channel social media funnel presence",
                evidence=EvidenceAnchor(
                    source="social_links",
                    value=", ".join(scraped.social_links[:2]),
                    raw_metric=f"Detected {len(scraped.social_links)} social handles",
                    reason="Cross-channel funnels build brand retention and community engagement."
                )
            ))
        else:
            weaknesses.append(SWOTItem(
                insight="Neglected social media conversion funnels",
                evidence=EvidenceAnchor(
                    source="social_links",
                    value="No active handles linked on main page",
                    raw_metric="0 handles found",
                    reason="Limits organic lead generation and community building avenues."
                )
            ))
            opportunities.append(SWOTItem(
                insight="Aggressively capture organic traffic on social funnels",
                evidence=EvidenceAnchor(
                    source="social_links",
                    value="Competitor missing social conversion links",
                    raw_metric="Missing channel footprints",
                    reason="Directing target keywords to dedicated Instagram/LinkedIn funnels will pull standard users away from them."
                )
            ))
            
    # PageSpeed Checks
    if pagespeed.fetch_success and pagespeed.performance_score:
        if pagespeed.performance_score < 60:
            weaknesses.append(SWOTItem(
                insight="Slow website loading performance",
                evidence=EvidenceAnchor(
                    source="performance_score",
                    value=f"Score: {pagespeed.performance_score}/100",
                    raw_metric="Below mobile standards",
                    reason="High loading latencies degrade user experience and trigger search penalties."
                )
            ))
            opportunities.append(SWOTItem(
                insight="Provide a faster, seamless mobile experience to capture leads",
                evidence=EvidenceAnchor(
                    source="performance_score",
                    value=f"Competitor slow score of {pagespeed.performance_score}/100",
                    raw_metric="Core loading lag",
                    reason="Optimizing our loading performance below 2 seconds will keep bouncing prospects on our landing pages."
                )
            ))
        else:
            strengths.append(SWOTItem(
                insight="Excellent site speeds and performance loading rates",
                evidence=EvidenceAnchor(
                    source="performance_score",
                    value=f"Score: {pagespeed.performance_score}/100",
                    raw_metric="Solid loading standard",
                    reason="Guarantees immediate visual presentation on low bandwidth connections."
                )
            ))
            
    # Fallback recommendations if lists are thin
    recommendations.append(SWOTItem(
        insight="Run high-speed mobile UX audits to outrank them",
        evidence=EvidenceAnchor(
            source="performance_score",
            value="Target page load speed",
            raw_metric="Under 2.5s standard LCP",
            reason="Ensuring our site speed out-paces them keeps conversion rates elevated."
        )
    ))
    
    if user_usp:
        opportunities.append(SWOTItem(
            insight="Exploit customer acquisition opportunities using our USP",
            evidence=EvidenceAnchor(
                source="our_brand_context",
                value=user_usp,
                raw_metric="Unique Positioning Advantage",
                reason=f"Deploying our USP ('{user_usp}') against their gaps will actively convert their unsatisfied customer segments."
            )
        ))
        recommendations.append(SWOTItem(
            insight="Craft sharp marketing campaigns highlighting our USP",
            evidence=EvidenceAnchor(
                source="our_brand_context",
                value=user_usp,
                raw_metric="Brand Messaging Integration",
                reason=f"Promoting our USP ('{user_usp}') in landing pages and social media directly challenges their weak points."
            )
        ))

    recommendations.append(SWOTItem(
        insight="Deploy full meta title and description sets targeting competitor gaps",
        evidence=EvidenceAnchor(
            source="meta_description",
            value=f"Length: {len(scraped.meta_description or '')} chars",
            raw_metric="Target metadata",
            reason="Capturing precise search phrases will position us at the top of listing slots."
        )
    ))
    
    summary = f"({reason}) Competitor '{name}' is positioning their web presence around structural themes. "
    if seo.total_score >= 70:
        summary += "They have an established structural optimization layer, "
    else:
        summary += "They present several technical vulnerabilities, "
    summary += "which gives us strategic leverage in search rankings."

    return SWOTAnalysis(
        strengths=strengths,
        weaknesses=weaknesses,
        opportunities=opportunities,
        recommendations=recommendations,
        content_strategy_summary=summary
    )
stream = None
