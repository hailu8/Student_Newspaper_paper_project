from rake_nltk import Rake
import textblob
import nltk


def initialize_keywords():
    nltk.download('punkt')
    nltk.download('brown')
    nltk.download('stopwords')


def get_keywords_heurestic(text):
    return list(
        filter(
            lambda x: len(x) > 6 and len(x) < 64,
            textblob.TextBlob(text).noun_phrases))


def get_keywords(text):
    r = Rake()
    r.extract_keywords_from_text(text)
    return r.get_ranked_phrases()
