"""
Advanced Data Processing Pipeline
1. Creates 'training_sentiment.csv' from authentic reviews (Amazon) for DL Model Training.
2. Creates 'product_catalog.csv' from product details (Flipkart) for RAG/Knowledge Base.
Does NOT mix subjective reviews with objective product descriptions.
"""

import pandas as pd
import numpy as np
import logging
from pathlib import Path
import re

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Constants
RAW_DIR = Path("data/raw")
PROCESSED_DIR = Path("data/processed")
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

def clean_text(text):
    """Deep cleaning of text fields"""
    if pd.isna(text):
        return ""
    text = str(text)
    text = re.sub(r'http\S+|www.\S+', '', text) # Remove URLs
    text = re.sub(r'<.*?>', '', text) # Remove HTML
    # Keep punctuation for BERT context, but remove excessive whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def process_reviews_for_training():
    """
    Process ONLY authentic reviews for Sentiment Analysis and Complaint Extraction Training.
    Primary Source: Amazon Reviews (7817_1.csv)
    """
    file_path = RAW_DIR / "7817_1.csv"
    if not file_path.exists():
        logger.warning(f"{file_path} not found. Skipping training data generation.")
        return pd.DataFrame()

    logger.info(f"Processing Reviews for Training from {file_path}...")
    try:
        df = pd.read_csv(file_path, on_bad_lines='skip')
        
        # Standardize columns
        df = df.rename(columns={
            'reviews.text': 'text',
            'reviews.rating': 'label',
            'reviews.title': 'title',
            'asins': 'product_id',
            'name': 'product_name'
        })

        # Filter for valid reviews
        df = df.dropna(subset=['text', 'label'])
        df['text'] = df['text'].apply(clean_text)
        df = df[df['text'].str.len() > 20] # Remove short garbage

        # Create Sentiment Labels for Training
        # 1-2 = Negative (0), 3 = Neutral (1), 4-5 = Positive (2)
        def get_sentiment(rating):
            try:
                r = float(rating)
                if r <= 2: return 0 # Negative
                elif r == 3: return 1 # Neutral
                else: return 2 # Positive
            except:
                return 1

        df['sentiment_label'] = df['label'].apply(get_sentiment)
        
        # Save Training Data
        output_path = PROCESSED_DIR / "training_sentiment.csv"
        df[['text', 'label', 'sentiment_label', 'title']].to_csv(output_path, index=False)
        logger.info(f"✅ Saved {len(df)} reviews for DL training to {output_path}")
        return df
    except Exception as e:
        logger.error(f"Error processing reviews: {e}")
        return pd.DataFrame()

def process_catalog_for_rag():
    """
    Process Product Catalogs for RAG (Retrieval Augmented Generation).
    Primary Source: Flipkart (Product Specs/Details) + Amazon (Product Names)
    This data is FACTUAL, not for sentiment training.
    """
    file_path = RAW_DIR / "flipkart_com-ecommerce_sample.csv"
    if not file_path.exists():
        logger.warning(f"{file_path} not found. Skipping catalog generation.")
        return pd.DataFrame()

    logger.info(f"Processing Catalog for RAG...")
    
    # Try Flipkart first
    flipkart_path = RAW_DIR / "flipkart_com-ecommerce_sample.csv"
    amazon_path = RAW_DIR / "7817_1.csv"
    
    catalog_items = []
    
    # Process Filpkart
    if flipkart_path.exists():
        try:
            df = pd.read_csv(flipkart_path, on_bad_lines='skip')
            df = df.rename(columns={
                'uniq_id': 'product_id',
                'product_name': 'name',
                'description': 'description',
                'retail_price': 'price',
                'product_category_tree': 'category'
            })
            df['source'] = 'Flipkart'
            catalog_items.append(df)
        except Exception as e:
            logger.error(f"Error processing Flipkart: {e}")

    # Process Amazon (Fallback/Augment)
    if amazon_path.exists():
        try:
            df = pd.read_csv(amazon_path, on_bad_lines='skip')
            df = df.rename(columns={
                'asins': 'product_id',
                'name': 'name',
                'reviews.text': 'description', # Use review as description fallback? No, usually bad.
                'categories': 'category'
            })
            # Amazon dataset often lacks price/desc, but let's see
            df['price'] = "N/A"
            df['source'] = 'Amazon'
            # Drop duplicates by ID
            df = df.drop_duplicates(subset=['product_id'])
            catalog_items.append(df[['product_id', 'name', 'category', 'price', 'source']])
        except Exception as e:
            logger.error(f"Error processing Amazon: {e}")

    if not catalog_items:
        logger.warning("No catalog data found.")
        return pd.DataFrame()

    df = pd.concat(catalog_items, ignore_index=True)
    
    # Clean
    df['name'] = df['name'].fillna('Unknown Product')
    df['category'] = df['category'].apply(lambda x: x.split('>>')[0][2:].strip() if isinstance(x, str) and '>>' in x else str(x))
    
    # Structure for Search
    df['rag_text'] = df['name'] + " " + df['category']
    
    # Save
    output_path = PROCESSED_DIR / "knowledge_base_catalog.csv"
    df[['product_id', 'name', 'rag_text', 'price', 'category']].to_csv(output_path, index=False)
    logger.info(f"✅ Saved {len(df)} products for Knowledge Base to {output_path}")
    return df

def main():
    # 1. Create Training Dataset (Reviews only)
    process_reviews_for_training()

    # 2. Create Knowledge Base (Catalog only)
    process_catalog_for_rag()

if __name__ == "__main__":
    main()
