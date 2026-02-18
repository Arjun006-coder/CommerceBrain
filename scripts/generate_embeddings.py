
import pandas as pd
from sentence_transformers import SentenceTransformer
import torch

# Load cleaned dataset
df = pd.read_csv("data/processed/master_dataset.csv")

# Initialize embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Generate embeddings for product descriptions/reviews
print("Generating embeddings...")
embeddings = model.encode(df['review_text'].fillna("").tolist(), show_progress_bar=True)

# Save embeddings
import numpy as np
np.save("data/processed/embeddings.npy", embeddings)
print("Embeddings saved to data/processed/embeddings.npy")
