"""
Data preprocessing pipeline
Cleans and prepares raw datasets for ML models
"""

import pandas as pd
import numpy as np
from pathlib import Path
import logging
import re
import sys

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))


def clean_text(text: str) -> str:
    """Clean and normalize review text"""
    if pd.isna(text):
        return ""
    
    # Convert to string
    text = str(text)
    
    # Remove URLs
    text = re.sub(r'http\S+|www.\S+', '', text)
    
    # Remove special characters but keep basic punctuation
    text = re.sub(r'[^a-zA-Z0-9\s.,!?]', '', text)
    
    # Remove extra whitespace
    text = ' '.join(text.split())
    
    # Lowercase
    text = text.lower()
    
    return text.strip()


def preprocess_reviews(input_path: Path, output_path: Path):
    """Preprocess review dataset"""
    logger.info(f"Loading reviews from: {input_path}")
    
    try:
        df = pd.read_csv(input_path)
        logger.info(f"Loaded {len(df)} reviews")
        
        initial_count = len(df)
        
        # Handle different column names from different datasets
        # Standardize column names
        column_mapping = {
            'reviews.text': 'review_text',
            'reviewText': 'review_text',
            'text': 'review_text',
            'reviews.rating': 'rating',
            'overall': 'rating',
            'reviews.title': 'review_title',
            'summary': 'review_title',
            'asin': 'product_id',
            'productId': 'product_id',
            'reviews.date': 'review_date',
            'reviewTime': 'review_date'
        }
        
        df = df.rename(columns=column_mapping)
        
        # Ensure required columns exist
        required_cols = ['review_text', 'rating']
        missing_cols = [col for col in required_cols if col not in df.columns]
        
        if missing_cols:
            logger.error(f"Missing required columns: {missing_cols}")
            logger.error(f"Available columns: {df.columns.tolist()}")
            return False
        
        # Remove rows with missing review text or rating
        df = df.dropna(subset=['review_text', 'rating'])
        logger.info(f"After removing nulls: {len(df)} reviews")
        
        # Clean review text
        logger.info("Cleaning review text...")
        df['review_text'] = df['review_text'].apply(clean_text)
        
        # Remove empty reviews
        df = df[df['review_text'].str.len() > 10]  # At least 10 characters
        logger.info(f"After removing empty/short reviews: {len(df)} reviews")
        
        # Ensure rating is numeric and in valid range
        df['rating'] = pd.to_numeric(df['rating'], errors='coerce')
        df = df[(df['rating'] >= 1) & (df['rating'] <= 5)]
        
        # Remove duplicates
        df = df.drop_duplicates(subset=['review_text'])
        logger.info(f"After removing duplicates: {len(df)} reviews")
        
        # Add sentiment label based on rating
        df['sentiment'] = df['rating'].apply(lambda x: 
            'positive' if x >= 4 else ('negative' if x <= 2 else 'neutral')
        )
        
        # Select and order columns
        output_cols = ['product_id', 'rating', 'review_text', 'sentiment']
        
        # Add optional columns if they exist
        optional_cols = ['review_title', 'review_date', 'product_name', 'category']
        for col in optional_cols:
            if col in df.columns:
                output_cols.append(col)
        
        df = df[output_cols]
        
        # Save preprocessed data
        output_path.parent.mkdir(parents=True, exist_ok=True)
        df.to_csv(output_path, index=False)
        
        logger.info(f"\n✓ Preprocessed reviews saved to: {output_path}")
        logger.info(f"  Total reviews: {len(df)}")
        logger.info(f"  Removed: {initial_count - len(df)} ({(initial_count - len(df))/initial_count*100:.1f}%)")
        logger.info(f"  Avg rating: {df['rating'].mean():.2f}")
        logger.info(f"  Sentiment distribution:")
        logger.info(f"    Positive: {(df['sentiment'] == 'positive').sum()}")
        logger.info(f"    Neutral: {(df['sentiment'] == 'neutral').sum()}")
        logger.info(f"    Negative: {(df['sentiment'] == 'negative').sum()}")
        
        return True
        
    except Exception as e:
        logger.error(f"Error preprocessing reviews: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    data_dir = Path(__file__).parent.parent / 'data'
    raw_dir = data_dir / 'raw'
    processed_dir = data_dir / 'processed'
    
    # Look for review files
    review_files = list(raw_dir.glob('*.csv'))
    
    if not review_files:
        logger.error(f"No CSV files found in {raw_dir}")
        logger.error("\nPlease run one of:")
        logger.error("  python scripts/download_datasets.py")
        logger.error("  python scripts/generate_mock_data.py")
        sys.exit(1)
    
    logger.info(f"Found {len(review_files)} CSV files")
    
    # Process each file
    success_count = 0
    for input_file in review_files:
        logger.info(f"\n{'='*60}")
        logger.info(f"Processing: {input_file.name}")
        logger.info(f"{'='*60}")
        
        output_file = processed_dir / f"processed_{input_file.name}"
        
        if preprocess_reviews(input_file, output_file):
            success_count += 1
    
    logger.info(f"\n{'='*60}")
    if success_count == len(review_files):
        logger.info(f"✅ All {success_count} files processed successfully!")
        logger.info(f"\nNext steps:")
        logger.info("1. Setup Qdrant: python scripts/setup_qdrant.py")
        logger.info("2. Generate embeddings: python scripts/generate_embeddings.py")
    else:
        logger.error(f"❌ Only {success_count}/{len(review_files)} files processed")
        sys.exit(1)


if __name__ == "__main__":
    main()
