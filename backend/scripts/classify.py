import sys
import os
import json
import spacy
import joblib  # For loading trained models
from geopy.geocoders import Nominatim
from sklearn.feature_extraction.text import TfidfVectorizer

# Load NLP model for location extraction
nlp = spacy.load("en_core_web_sm")
geolocator = Nominatim(user_agent="divyanshu_disaster", timeout=10)

# Load trained models
model_path1 = os.path.join(os.path.dirname(__file__), "..", "models", "naive_bayes_model.pkl")
model_path2 = os.path.join(os.path.dirname(__file__), "..", "models", "disaster_model.pkl")
vectorizer_path = os.path.join(os.path.dirname(__file__), "..", "models", "vectorizer.pkl")
naive_bayes_model = joblib.load(model_path1)
logistic_regression_model = joblib.load(model_path2)
vectorizer = joblib.load(vectorizer_path)  # Ensure this matches what was used in training

def classify_tweet(tweet, model_choice=""):
    # Preprocess tweet (ensure consistency with training data)
    tweet_vector = vectorizer.transform([tweet])

    # Choose the model for prediction
    if model_choice == "naive_bayes":
        prediction = naive_bayes_model.predict(tweet_vector)[0]
    else:  # Default to logistic regression
        prediction = logistic_regression_model.predict(tweet_vector)[0]

    classification = "disaster" if prediction == 1 else "non-disaster"

    # Extract location
    location = None
    doc = nlp(tweet)
    for ent in doc.ents:
        if ent.label_ == "GPE":  # Geo-political entity
            location = ent.text
            break

    # Get coordinates if location exists
    coordinates = None
    if location:
        loc = geolocator.geocode(location)
        if loc:
            coordinates = [loc.latitude, loc.longitude]

    # Return JSON result
    result = {
        "tweet": tweet,
        "classification": classification,
        "location": location,
        "coordinates": coordinates
    }
    print(json.dumps(result))

# Run classification
if __name__ == "__main__":
    input_tweet = " ".join(sys.argv[1:])
    classify_tweet(input_tweet, model_choice="naive_bayes")  # Change to "logistic_regression" if needed
