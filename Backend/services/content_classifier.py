import google.generativeai as genai
import os
import json
import re
from models.schemas import ContentClassification

def classify_content_intent(body_text: str, social_posts: list[str] = None) -> ContentClassification:
    """
    Classifies the dominant content intent (Promotional, Educational, Emotional, Community, Brand Awareness).
    Uses Gemini to analyze the context or falls back to heuristic pattern matching.
    """
    # Merge sources for classification
    corpus = body_text[:10000]
    if social_posts:
        corpus += "\n\n" + "\n---\n".join(social_posts)
        
    if not corpus.strip():
        return ContentClassification()

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return _heuristic_classify(corpus)

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        prompt = f"""
        You are a copywriting expert. Your task is to analyze the content below and classify it into five distinct intent categories:
        1. Promotional (sales-focused, discounts, buy now, CTA calls, product highlights)
        2. Educational (how-tos, tips, industry insights, informative guides)
        3. Emotional (storytelling, personal experiences, brand legacy, narrative building)
        4. Community (questions, engagement starters, giveaways, testimonials, discussions)
        5. Brand Awareness (identity-building, value propositions, high-level mission statements)

        CONTENT TO ANALYZE:
        \"\"\"{corpus[:5000]}\"\"\"

        Return a JSON object expressing the percentage weight of each category (should sum to 100 or 1.0) and a brief marketing insight explaining why this distribution is configured this way.
        Use this exact schema (only return raw JSON, no markdown codeblocks):
        {{
            "promotional": 0.40,
            "educational": 0.25,
            "emotional": 0.15,
            "community": 0.10,
            "brand_awareness": 0.10,
            "primary_intent": "Promotional",
            "insight": "Explain the major copywriting trends or weaknesses spotted."
        }}
        """
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        res = json.loads(response.text.strip())
        
        # Ensure percentages are converted to values between 0 and 100
        def scale(val):
            if val <= 1.0:
                return round(val * 100, 1)
            return round(val, 1)
            
        promo = scale(res.get("promotional", 0))
        edu = scale(res.get("educational", 0))
        emo = scale(res.get("emotional", 0))
        comm = scale(res.get("community", 0))
        brand = scale(res.get("brand_awareness", 0))
        
        # Recalculate primary intent just to verify
        mapping = {
            "Promotional": promo,
            "Educational": edu,
            "Emotional": emo,
            "Community": comm,
            "Brand Awareness": brand
        }
        primary = max(mapping, key=mapping.get)
        
        return ContentClassification(
            promotional=promo,
            educational=edu,
            emotional=emo,
            community=comm,
            brand_awareness=brand,
            primary_intent=primary,
            insight=res.get("insight", "Balanced approach observed.")
        )
        
    except Exception:
        # Clean premium fallback prefix. Expose NO raw developer errors/API details in user COPY!
        return _heuristic_classify(corpus, "Primary Scan:")

def _heuristic_classify(text: str, prefix: str = "") -> ContentClassification:
    """
    Offline/Heuristic keyword match classification.
    """
    text_lower = text.lower()
    
    # 1. Promotional terms
    promo_words = ['buy', 'shop', 'sale', 'discount', 'coupon', 'off', 'price', 'product', 'limited', 'deal', 'get yours', 'cart']
    promo_score = sum(text_lower.count(w) for w in promo_words)
    
    # 2. Educational terms
    edu_words = ['how to', 'tips', 'learn', 'guide', 'why', 'tutorial', 'insight', 'science', 'research', 'benefit', 'facts']
    edu_score = sum(text_lower.count(w) for w in edu_words)
    
    # 3. Emotional terms
    emo_words = ['love', 'passion', 'feel', 'story', 'journey', 'inspire', 'dream', 'heart', 'family', 'believe', 'happy']
    emo_score = sum(text_lower.count(w) for w in emo_words)
    
    # 4. Community terms
    comm_words = ['join', 'comment', 'share', 'tag', 'what do you', 'giveaway', 'win', 'together', 'feedback', 'review']
    comm_score = sum(text_lower.count(w) for w in comm_words)
    
    # 5. Brand Awareness terms
    brand_words = ['we believe', 'our mission', 'our story', 'quality', 'sustainable', 'founded', 'premium', 'handcrafted']
    brand_score = sum(text_lower.count(w) for w in brand_words)
    
    # Calculate relative weights
    total = promo_score + edu_score + emo_score + comm_score + brand_score
    if total == 0:
        return ContentClassification(
            promotional=20, educational=20, emotional=20, community=20, brand_awareness=20,
            primary_intent="Balanced", insight="No clear content keywords detected."
        )
        
    promo = round((promo_score / total) * 100, 1)
    edu = round((edu_score / total) * 100, 1)
    emo = round((emo_score / total) * 100, 1)
    comm = round((comm_score / total) * 100, 1)
    brand = round((brand_score / total) * 100, 1)
    
    mapping = {
        "Promotional": promo,
        "Educational": edu,
        "Emotional": emo,
        "Community": comm,
        "Brand Awareness": brand
    }
    primary = max(mapping, key=mapping.get)
    
    insight = f"{prefix} Content shows elevated {primary.lower()} focus. "
    if primary == "Promotional":
        insight += "The competitor focuses heavily on quick transaction cues and product features. Boosting educational content could steal their traffic."
    elif primary == "Educational":
        insight += "They build trust through helpful tutorials and resources. We must deliver deeper, higher-quality knowledge bases to outperform."
    else:
        insight += "They employ an audience relationship framework. Creating sharper product comparison hooks will capture their active shoppers."

    return ContentClassification(
        promotional=promo,
        educational=edu,
        emotional=emo,
        community=comm,
        brand_awareness=brand,
        primary_intent=primary,
        insight=insight
    )
