
import pandas as pd
from bertopic import BERTopic
from sentence_transformers import SentenceTransformer
import os

DATA_PATH = "data/processed/training_sentiment.csv"
MODEL_PATH = "backend/models/complaint_topic_model"

def train_complaint_model():
    print("Loading review data...")
    try:
        df = pd.read_csv(DATA_PATH)
    except FileNotFoundError:
        print("Data not found.")
        return

    # Filter for NEGATIVE reviews only (Rating <= 2 or sentiment_label == 0)
    # This ensures we are clustering *complaints*, not praise.
    complaints = df[df['sentiment_label'] == 0]['text'].tolist()
    
    if len(complaints) < 50:
        print(f"Not enough negative reviews ({len(complaints)}) to train a topic model.")
        return

    print(f"Training Topic Model on {len(complaints)} negative reviews...")

    # Embeddings Model (using same one as vector DB for consistency)
    embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

    # Initialize BERTopic
    # - min_topic_size: Minimum documents in a cluster
    # - n_gram_range: (1, 2) for phrases like "battery life"
    topic_model = BERTopic(
        embedding_model=embedding_model,
        min_topic_size=10,
        n_gram_range=(1, 2),
        calculate_probabilities=True,
        verbose=True
    )

    # Train
    topics, probs = topic_model.fit_transform(complaints)

    # Inspect
    info = topic_model.get_topic_info()
    print("\nTop 5 Complaint Themes Found:")
    print(info.head(5))

    # Save
    os.makedirs(MODEL_PATH, exist_ok=True)
    topic_model.save(MODEL_PATH, serialization="safetensors")
    print(f"Model saved to {MODEL_PATH}")

if __name__ == "__main__":
    train_complaint_model()
