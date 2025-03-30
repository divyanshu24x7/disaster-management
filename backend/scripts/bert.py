import sys
import json
import torch
import os
from transformers import BertTokenizer, BertForSequenceClassification
from geopy.geocoders import Nominatim
import spacy


# Load NLP model for location extraction
nlp = spacy.load("en_core_web_sm")
geolocator = Nominatim(user_agent="divyanshu_disaster", timeout=10)
# Get the absolute path to the script's directory
script_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the correct path to the model folder
save_directory = os.path.join(script_dir, "bert_disaster_model")

# Check if the directory exists
if not os.path.exists(save_directory):
    print(json.dumps({"error": f"Model directory '{save_directory}' not found!"}))
    sys.exit(1)

# Load model and tokenizer
model = BertForSequenceClassification.from_pretrained(save_directory)
tokenizer = BertTokenizer.from_pretrained(save_directory)
model.eval()  # Set to evaluation mode

# Get input tweet from command-line argument
if len(sys.argv) < 2:
    print(json.dumps({"error": "No tweet provided"}))
    sys.exit(1)

tweet = sys.argv[1]

# Tokenize and predict
inputs = tokenizer(tweet, return_tensors="pt", truncation=True, padding=True)

with torch.no_grad():
    outputs = model(**inputs)
    logits = outputs.logits

# Convert logits to class (0 = Not Disaster, 1 = Disaster)
predicted_class = torch.argmax(logits, dim=1).item()

classification = "disaster" if predicted_class == 1 else "non-disaster"

location = None
doc = nlp(tweet)
for ent in doc.ents:
    if ent.label_ == "GPE":  # Geo-political entity
        location = ent.text
        break

    # Get coordinates if location exists
coordinates = None
if location and classification == "disaster":
    loc = geolocator.geocode(location)
    if loc:
        coordinates = [loc.latitude, loc.longitude]

# Return JSON response
result = {
    "tweet": tweet,
    "classification": classification,
    "location": location,
    "coordinates": coordinates
}
print(json.dumps(result))

