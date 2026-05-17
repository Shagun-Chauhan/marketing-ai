import re
import emoji
from models.schemas import FrequencyAnalysis

def analyze_frequency_and_patterns(posts: list[str] = None) -> FrequencyAnalysis:
    """
    Analyzes posting patterns, emoji density, CTA usage, and hook styles 
    from multiple competitor social posts.
    """
    if not posts:
        return FrequencyAnalysis(
            total_posts_analyzed=0,
            avg_post_length=0,
            cta_frequency=0,
            emoji_density=0,
            hashtag_density=0,
            dominant_hook_style="N/A",
            insight="No competitor social media posts were provided for analysis."
        )

    total_posts = len(posts)
    lengths = []
    cta_count = 0
    emoji_count = 0
    hashtag_count = 0
    hook_styles = {"Question": 0, "Emotional": 0, "Statistic/Fact": 0, "Direct Pitch": 0, "Curiosity/Bold Claim": 0}
    cta_examples = []
    
    # Common CTA verbs
    cta_regex = re.compile(r'\b(buy|shop|click|visit|link|dm|order|check|register|join|sign up|get now|limited time)\b', re.I)
    
    for post in posts:
        # Length
        word_count = len(post.split())
        lengths.append(word_count)
        
        # Emojis count using emoji library
        e_list = emoji.emoji_list(post)
        emoji_count += len(e_list)
        
        # Hashtags count
        hashtags = re.findall(r'#\w+', post)
        hashtag_count += len(hashtags)
        
        # CTA Detection
        if cta_regex.search(post):
            cta_count += 1
            # Extract sentence containing CTA
            sentences = re.split(r'[.!?\n]', post)
            for s in sentences:
                if cta_regex.search(s):
                    clean_s = s.strip()
                    if clean_s and len(clean_s) < 100 and clean_s not in cta_examples:
                        cta_examples.append(clean_s)
                        break
                        
        # Naive Hook Style Classifier from first line of post
        first_line = post.strip().split('\n')[0].strip().lower()
        if not first_line:
            continue
            
        if '?' in first_line or any(w in first_line for w in ['how', 'why', 'what', 'who', 'where', 'are you']):
            hook_styles["Question"] += 1
        elif '%' in first_line or any(c.isdigit() for c in first_line):
            hook_styles["Statistic/Fact"] += 1
        elif any(w in first_line for w in ['sale', 'deal', 'shop', 'off', 'discount', 'free', 'introducing']):
            hook_styles["Direct Pitch"] += 1
        elif any(w in first_line for w in ['love', 'hate', 'fear', 'never', 'secret', 'worst', 'best', 'stop', 'shocking']):
            hook_styles["Curiosity/Bold Claim"] += 1
        else:
            hook_styles["Emotional"] += 1
            
    # Calculate Averages
    avg_len = round(sum(lengths) / total_posts, 1) if total_posts > 0 else 0
    cta_freq = round((cta_count / total_posts) * 100, 1) if total_posts > 0 else 0
    avg_emoji = round(emoji_count / total_posts, 1) if total_posts > 0 else 0
    avg_hash = round(hashtag_count / total_posts, 1) if total_posts > 0 else 0
    
    dominant_hook = "Balanced"
    if total_posts > 0:
        dominant_hook = max(hook_styles, key=hook_styles.get)
        if hook_styles[dominant_hook] == 0:
            dominant_hook = "Storytelling"

    # Strategy Insight
    insight = f"Competitor leverages an average post length of {avg_len} words with {avg_emoji} emojis per post. "
    if cta_freq >= 60:
        insight += "They are highly sales-driven, inserting promotional calls-to-action in over 60% of postings. We should focus on engaging content to stand out."
    elif cta_freq <= 25:
        insight += "They run a soft-selling funnel, prioritizing branding over direct sales. Adding direct-response hooks could win immediate conversions from their followers."
    else:
        insight += "They balance engagement and transaction cues. Crafting bold curiosity hooks will help hook users faster than their postings."

    return FrequencyAnalysis(
        total_posts_analyzed=total_posts,
        avg_post_length=avg_len,
        cta_frequency=cta_freq,
        emoji_density=avg_emoji,
        hashtag_density=avg_hash,
        dominant_hook_style=dominant_hook,
        hook_styles=hook_styles,
        cta_examples=cta_examples[:5],
        insight=insight
    )
