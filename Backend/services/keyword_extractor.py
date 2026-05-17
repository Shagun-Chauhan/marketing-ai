import re
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
from models.schemas import ScrapedData, KeywordData, KeywordItem

# Basic English stop words list to avoid scikit-learn download issues or missing corpus errors
ENGLISH_STOP_WORDS = {
    'a', 'about', 'above', 'across', 'after', 'afterwards', 'again', 'against', 'all', 'almost', 'alone', 'along',
    'already', 'also', 'although', 'always', 'am', 'among', 'amongst', 'amoungst', 'amount', 'an', 'and', 'another',
    'any', 'anyhow', 'anyone', 'anything', 'anyway', 'anywhere', 'are', 'around', 'as', 'at', 'back', 'be', 'became',
    'because', 'become', 'becomes', 'becoming', 'been', 'before', 'beforehand', 'behind', 'being', 'below', 'beside',
    'besides', 'between', 'beyond', 'bill', 'both', 'bottom', 'but', 'by', 'call', 'can', 'cannot', 'cant', 'co',
    'con', 'could', 'couldnt', 'cry', 'de', 'describe', 'detail', 'do', 'done', 'down', 'due', 'during', 'each',
    'eg', 'eight', 'either', 'eleven', 'else', 'elsewhere', 'empty', 'enough', 'etc', 'even', 'ever', 'every',
    'everyone', 'everything', 'everywhere', 'except', 'few', 'fifteen', 'fifty', 'fill', 'find', 'fire', 'first',
    'five', 'for', 'former', 'formerly', 'forty', 'found', 'four', 'from', 'front', 'full', 'further', 'get', 'give',
    'go', 'had', 'has', 'hasnt', 'have', 'he', 'her', 'here', 'hereafter', 'hereby', 'herein', 'hereupon', 'hers',
    'herself', 'him', 'himself', 'his', 'how', 'however', 'hundred', 'i', 'ie', 'if', 'in', 'inc', 'indeed',
    'interest', 'into', 'is', 'it', 'its', 'itself', 'keep', 'last', 'latter', 'latterly', 'least', 'less', 'ltd',
    'made', 'many', 'may', 'me', 'meanwhile', 'might', 'mill', 'mine', 'more', 'moreover', 'most', 'mostly', 'move',
    'much', 'must', 'my', 'myself', 'name', 'namely', 'neither', 'never', 'nevertheless', 'next', 'nine', 'no',
    'nobody', 'none', 'noone', 'nor', 'not', 'nothing', 'now', 'nowhere', 'of', 'off', 'often', 'on', 'once', 'one',
    'only', 'onto', 'or', 'other', 'others', 'otherwise', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'part',
    'per', 'perhaps', 'please', 'put', 'rather', 're', 'same', 'see', 'seem', 'seemed', 'seeming', 'seems',
    'serious', 'several', 'she', 'should', 'show', 'side', 'since', 'sincere', 'six', 'sixty', 'so', 'some',
    'somehow', 'someone', 'something', 'sometime', 'sometimes', 'somewhere', 'still', 'such', 'system', 'take',
    'ten', 'than', 'thank', 'that', 'the', 'their', 'them', 'themselves', 'then', 'thence', 'there', 'thereafter',
    'thereby', 'therein', 'thereupon', 'these', 'they', 'this', 'those', 'though', 'three', 'through', 'throughout',
    'thru', 'thus', 'to', 'together', 'too', 'top', 'toward', 'towards', 'twelve', 'twenty', 'two', 'un', 'under',
    'until', 'up', 'upon', 'us', 'very', 'via', 'was', 'we', 'well', 'were', 'what', 'whatever', 'when', 'whence',
    'whenever', 'where', 'whereafter', 'whereas', 'whereby', 'wherein', 'whereupon', 'wherever', 'whether', 'which',
    'while', 'whither', 'who', 'whoever', 'whole', 'whom', 'whose', 'why', 'will', 'with', 'within', 'without',
    'would', 'yet', 'you', 'your', 'yours', 'yourself', 'yourselves'
}

def extract_keywords(competitor_data: ScrapedData, user_data: ScrapedData = None) -> KeywordData:
    """
    Extracts top keywords using frequency and TF-IDF scores from text content.
    Optionally computes keyword overlap comparison between user and competitor.
    """
    if not competitor_data.scrape_success or not competitor_data.body_text:
        return KeywordData()

    # Clean text to alphanumeric lowercase words
    def clean_text_to_words(text):
        words = re.findall(r'\b[a-zA-Z]{3,20}\b', text.lower())
        return [w for w in words if w not in ENGLISH_STOP_WORDS]

    comp_words = clean_text_to_words(competitor_data.body_text)
    if not comp_words:
        return KeywordData()

    comp_word_freq = Counter(comp_words)
    total_unique_words = len(comp_word_freq)

    # Calculate TF-IDF
    corpus = [competitor_data.body_text]
    if user_data and user_data.scrape_success and user_data.body_text:
        corpus.append(user_data.body_text)

    try:
        vectorizer = TfidfVectorizer(stop_words=list(ENGLISH_STOP_WORDS), min_df=1, lowercase=True)
        tfidf_matrix = vectorizer.fit_transform(corpus)
        feature_names = vectorizer.get_feature_names_out()
        
        # Get competitor's indices (index 0 in tfidf matrix)
        comp_tfidf_vector = tfidf_matrix[0].toarray()[0]
        
        # Combine TF-IDF scores and frequencies
        keyword_list = []
        for word, freq in comp_word_freq.items():
            if word in feature_names:
                idx = list(feature_names).index(word)
                tfidf_score = float(comp_tfidf_vector[idx])
                keyword_list.append(KeywordItem(
                    keyword=word,
                    tfidf_score=round(tfidf_score, 4),
                    frequency=freq
                ))
                
        # Sort by frequency then by tf-idf
        keyword_list.sort(key=lambda x: (x.frequency, x.tfidf_score), reverse=True)
        top_keywords = keyword_list[:20]
        
    except Exception:
        # Fallback to pure frequency if vectorizer fails
        top_keywords = [
            KeywordItem(keyword=word, tfidf_score=0.0, frequency=freq)
            for word, freq in comp_word_freq.most_common(20)
        ]

    # Handle Overlap logic if user data is provided
    overlap = None
    user_only = None
    comp_only = None

    if user_data and user_data.scrape_success and user_data.body_text:
        user_words = set(clean_text_to_words(user_data.body_text))
        comp_words_set = set(comp_words)
        
        # Calculate overlap and unique words
        overlap = list(comp_words_set.intersection(user_words))[:20]
        comp_only = list(comp_words_set.difference(user_words))[:20]
        user_only = list(user_words.difference(comp_words_set))[:20]

    return KeywordData(
        top_keywords=top_keywords,
        total_unique_words=total_unique_words,
        keyword_overlap=overlap,
        user_only_keywords=user_only,
        competitor_only_keywords=comp_only
    )
