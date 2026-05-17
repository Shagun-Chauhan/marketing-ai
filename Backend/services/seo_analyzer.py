from models.schemas import ScrapedData, SEOScore, SEOCheckItem

def analyze_seo(data: ScrapedData) -> SEOScore:
    """
    Performs a deterministic, rule-based SEO analysis on scraped site data.
    Provides scores out of 100 based on standard best practices.
    """
    if not data.scrape_success:
        return SEOScore(total_score=0, checks=[], passed_count=0, total_checks=0)
        
    checks = []
    
    # 1. Meta Title (Max 15 points)
    title = data.page_title
    if not title:
        checks.append(SEOCheckItem(
            check_name="Meta Title Present",
            passed=False,
            details="Missing a <title> tag on the page. Crucial for search results.",
            points=0,
            max_points=15
        ))
    else:
        title_len = len(title)
        if 40 <= title_len <= 65:
            checks.append(SEOCheckItem(
                check_name="Meta Title Length & Value",
                passed=True,
                details=f"Passed! Title is '{title}' ({title_len} characters) which is optimal (40-65 characters).",
                points=15,
                max_points=15
            ))
        else:
            checks.append(SEOCheckItem(
                check_name="Meta Title Length & Value",
                passed=True,
                details=f"Title present: '{title}' but length ({title_len} chars) is outside optimal range (40-65 chars).",
                points=8,
                max_points=15
            ))

    # 2. Meta Description (Max 15 points)
    desc = data.meta_description
    if not desc:
        checks.append(SEOCheckItem(
            check_name="Meta Description Present",
            passed=False,
            details="Missing a meta description. Search engines will auto-generate text, which looks unprofessional.",
            points=0,
            max_points=15
        ))
    else:
        desc_len = len(desc)
        if 120 <= desc_len <= 160:
            checks.append(SEOCheckItem(
                check_name="Meta Description Length & Value",
                passed=True,
                details=f"Passed! Description length ({desc_len} characters) is in the sweet spot (120-160 characters).",
                points=15,
                max_points=15
            ))
        else:
            checks.append(SEOCheckItem(
                check_name="Meta Description Length & Value",
                passed=True,
                details=f"Description present but length ({desc_len} chars) is outside optimal range (120-160 chars).",
                points=8,
                max_points=15
            ))

    # 3. Heading 1 Checklist (Max 15 points)
    h1s = data.h1_tags
    if not h1s:
        checks.append(SEOCheckItem(
            check_name="H1 Heading Presence",
            passed=False,
            details="Missing H1 tag. Every page needs exactly one H1 tag to declare its primary topic.",
            points=0,
            max_points=15
        ))
    elif len(h1s) > 1:
        checks.append(SEOCheckItem(
            check_name="H1 Heading Quantity",
            passed=False,
            details=f"Multiple H1 tags found ({len(h1s)}). Best practice is to have exactly one H1 tag per page.",
            points=5,
            max_points=15
        ))
    else:
        checks.append(SEOCheckItem(
            check_name="H1 Heading Presence & Quantity",
            passed=True,
            details=f"Passed! Exactly one H1 tag found: '{h1s[0]}'.",
            points=15,
            max_points=15
        ))

    # 4. Image Alt Tag Coverage (Max 15 points)
    img_count = data.image_count
    alt_count = data.images_with_alt
    if img_count == 0:
        checks.append(SEOCheckItem(
            check_name="Image Alt Attributes",
            passed=True,
            details="No images found on page (no alt text needed).",
            points=15,
            max_points=15
        ))
    else:
        coverage = (alt_count / img_count) * 100
        if coverage >= 85:
            checks.append(SEOCheckItem(
                check_name="Image Alt Attributes",
                passed=True,
                details=f"Passed! {alt_count} out of {img_count} images ({coverage:.1f}%) have alt text.",
                points=15,
                max_points=15
            ))
        elif coverage >= 40:
            checks.append(SEOCheckItem(
                check_name="Image Alt Attributes",
                passed=True,
                details=f"Some issues: Only {alt_count} of {img_count} images ({coverage:.1f}%) have alt text. Missing alt text hurts accessibility and SEO.",
                points=8,
                max_points=15
            ))
        else:
            checks.append(SEOCheckItem(
                check_name="Image Alt Attributes",
                passed=False,
                details=f"Failed: Only {alt_count} of {img_count} images ({coverage:.1f}%) have alt text. Fix this to boost search ranks.",
                points=2,
                max_points=15
            ))

    # 5. Canonical URL (Max 10 points)
    if data.has_canonical:
        checks.append(SEOCheckItem(
            check_name="Canonical Tag Check",
            passed=True,
            details="Passed! A canonical tag is correctly declared to prevent duplicate content issues.",
            points=10,
            max_points=10
        ))
    else:
        checks.append(SEOCheckItem(
            check_name="Canonical Tag Check",
            passed=False,
            details="Missing a canonical URL link tag. Highly recommended to prevent search index duplication issues.",
            points=0,
            max_points=10
        ))

    # 6. Viewport Metadata (Max 10 points)
    if data.has_viewport_meta:
        checks.append(SEOCheckItem(
            check_name="Viewport Configuration",
            passed=True,
            details="Passed! Mobile viewport config meta tag is present, enabling responsive styles.",
            points=10,
            max_points=10
        ))
    else:
        checks.append(SEOCheckItem(
            check_name="Viewport Configuration",
            passed=False,
            details="Missing a mobile viewport tag. Mobile engines will index this as a non-responsive desktop website.",
            points=0,
            max_points=10
        ))

    # 7. Open Graph Tags (Max 10 points)
    if data.has_og_tags:
        checks.append(SEOCheckItem(
            check_name="Open Graph Metadata",
            passed=True,
            details="Passed! Open Graph protocols detected, ensuring professional social media preview card sharing.",
            points=10,
            max_points=10
        ))
    else:
        checks.append(SEOCheckItem(
            check_name="Open Graph Metadata",
            passed=False,
            details="Missing Open Graph metadata tags. Preview cards on WhatsApp, Facebook or Slack won't show clean thumbnails.",
            points=0,
            max_points=10
        ))

    # 8. Content Depth (Max 10 points)
    w_count = data.word_count
    if w_count >= 600:
        checks.append(SEOCheckItem(
            check_name="Content Depth & Size",
            passed=True,
            details=f"Passed! Page contains {w_count} words, which provides rich context for search indexing.",
            points=10,
            max_points=10
        ))
    elif w_count >= 250:
        checks.append(SEOCheckItem(
            check_name="Content Depth & Size",
            passed=True,
            details=f"Decent length: {w_count} words. Consider expanding the landing page copy above 500 words for deeper indexing.",
            points=6,
            max_points=10
        ))
    else:
        checks.append(SEOCheckItem(
            check_name="Content Depth & Size",
            passed=False,
            details=f"Too thin: Only {w_count} words. Search bots might flag this page as thin content.",
            points=2,
            max_points=10
        ))

    # Compile Final Score
    earned_pts = sum(c.points for c in checks)
    max_pts = sum(c.max_points for c in checks)
    
    # Scale to 0-100 range
    final_score = int((earned_pts / max_pts) * 100) if max_pts > 0 else 0
    passed_cnt = sum(1 for c in checks if c.passed)

    return SEOScore(
        total_score=final_score,
        checks=checks,
        passed_count=passed_cnt,
        total_checks=len(checks)
    )
