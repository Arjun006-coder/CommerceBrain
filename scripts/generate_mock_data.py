"""
Generate mock data for testing when real datasets are not available
Creates realistic e-commerce reviews and product data
"""

import pandas as pd
import numpy as np
import argparse
from pathlib import Path
import random
import logging
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Mock data templates
PRODUCTS = [
    {"name": "Wireless Earbuds Pro", "category": "Electronics", "base_price": 79.99},
    {"name": "Smart Watch Ultra", "category": "Electronics", "base_price": 299.99},
    {"name": "Laptop Stand Aluminum", "category": "Accessories", "base_price": 49.99},
    {"name": "USB-C Hub 7-in-1", "category": "Accessories", "base_price": 39.99},
    {"name": "Mechanical Keyboard RGB", "category": "Electronics", "base_price": 129.99},
    {"name": "Wireless Mouse Ergonomic", "category": "Electronics", "base_price": 59.99},
    {"name": "Phone Case Premium", "category": "Accessories", "base_price": 24.99},
    {"name": "Portable Charger 20000mAh", "category": "Electronics", "base_price": 45.99},
    {"name": "Bluetooth Speaker Waterproof", "category": "Electronics", "base_price": 89.99},
    {"name": "Tablet 10 inch", "category": "Electronics", "base_price": 249.99},
]

POSITIVE_REVIEW_TEMPLATES = [
    "Great product! {feature} works perfectly. Highly recommend.",
    "Excellent quality. The {feature} exceeded my expectations.",
    "Love it! {feature} is amazing. Worth every penny.",
    "Best purchase I've made. {feature} is fantastic.",
    "Very satisfied with {feature}. Will buy again!",
]

NEGATIVE_REVIEW_TEMPLATES = [
    "Disappointed. {complaint} is really bad.",
    "Not worth the price. {complaint} doesn't work well.",
    "Poor quality. {complaint} failed after a week.",
    "Returning this. {complaint} is unacceptable.",
    "Waste of money. {complaint} is terrible.",
]

NEUTRAL_REVIEW_TEMPLATES = [
    "It's okay. {feature} is decent but {complaint}.",
    "Average product. {feature} works but {complaint}.",
    "Mixed feelings. {feature} is good but {complaint} could be better.",
]

FEATURES = [
    "battery life", "sound quality", "build quality", "performance",
    "design", "value for money", "charging speed", "comfort",
    "durability", "connectivity", "features", "ease of use"
]

COMPLAINTS = [
    "battery drains quickly", "overheating issues", "charging is slow",
    "build quality is poor", "too expensive", "uncomfortable to use",
    "connectivity problems", "software bugs", "customer service",
    "packaging was damaged"
]


def generate_review_text(sentiment: str) -> str:
    """Generate realistic review text"""
    if sentiment == "positive":
        template = random.choice(POSITIVE_REVIEW_TEMPLATES)
        return template.format(feature=random.choice(FEATURES))
    elif sentiment == "negative":
        template = random.choice(NEGATIVE_REVIEW_TEMPLATES)
        return template.format(complaint=random.choice(COMPLAINTS))
    else:  # neutral
        template = random.choice(NEUTRAL_REVIEW_TEMPLATES)
        return template.format(
            feature=random.choice(FEATURES),
            complaint=random.choice(COMPLAINTS)
        )


def generate_mock_reviews(num_reviews: int, num_products: int) -> pd.DataFrame:
    """Generate mock review dataset"""
    logger.info(f"Generating {num_reviews} mock reviews for {num_products} products...")
    
    # Select random products
    products = random.choices(PRODUCTS, k=min(num_products, len(PRODUCTS)))
    
    reviews_data = []
    
    for _ in range(num_reviews):
        product = random.choice(products)
        
        # Generate rating (with some bias towards positive)
        rating = np.random.choice(
            [1, 2, 3, 4, 5],
            p=[0.05, 0.10, 0.15, 0.35, 0.35]  # More 4s and 5s
        )
        
        # Determine sentiment
        if rating >= 4:
            sentiment = "positive"
        elif rating <= 2:
            sentiment = "negative"
        else:
            sentiment = "neutral"
        
        # Generate review text
        review_text = generate_review_text(sentiment)
        
        # Random date in last 12 months
        days_ago = random.randint(0, 365)
        review_date = datetime.now() - timedelta(days=days_ago)
        
        reviews_data.append({
            "product_id": f"PROD{random.randint(1000, 9999)}",
            "product_name": product["name"],
            "category": product["category"],
            "rating": rating,
            "review_text": review_text,
            "review_date": review_date.strftime("%Y-%m-%d"),
            "verified_purchase": random.choice([True, False]),
            "helpful_count": random.randint(0, 50)
        })
    
    df = pd.DataFrame(reviews_data)
    logger.info(f"✓ Generated {len(df)} reviews")
    logger.info(f"  - Avg rating: {df['rating'].mean():.2f}")
    logger.info(f"  - Positive: {(df['rating'] >= 4).sum()}")
    logger.info(f"  - Negative: {(df['rating'] <= 2).sum()}")
    
    return df


def generate_mock_products(num_products: int) -> pd.DataFrame:
    """Generate mock product dataset"""
    logger.info(f"Generating {num_products} mock products...")
    
    products_data = []
    
    for i in range(num_products):
        product = random.choice(PRODUCTS)
        
        # Add price variation
        price = product["base_price"] * random.uniform(0.8, 1.2)
        
        products_data.append({
            "product_id": f"PROD{1000 + i}",
            "product_name": f"{product['name']} - Model {i+1}",
            "category": product["category"],
            "price": round(price, 2),
            "rating": round(random.uniform(3.0, 5.0), 1),
            "num_reviews": random.randint(10, 1000),
            "in_stock": random.choice([True, True, True, False]),  # 75% in stock
            "brand": random.choice(["TechBrand", "SmartCo", "ProGear", "EliteWare"])
        })
    
    df = pd.DataFrame(products_data)
    logger.info(f"✓ Generated {len(df)} products")
    
    return df


def main():
    parser = argparse.ArgumentParser(description='Generate mock data for testing')
    parser.add_argument(
        '--reviews',
        type=int,
        default=10000,
        help='Number of reviews to generate'
    )
    parser.add_argument(
        '--products',
        type=int,
        default=100,
        help='Number of products to generate'
    )
    parser.add_argument(
        '--output-dir',
        type=Path,
        default=Path(__file__).parent.parent / 'data' / 'raw',
        help='Output directory'
    )
    
    args = parser.parse_args()
    
    # Create output directory
    args.output_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate datasets
    reviews_df = generate_mock_reviews(args.reviews, args.products)
    products_df = generate_mock_products(args.products)
    
    # Save to CSV
    reviews_path = args.output_dir / "mock_reviews.csv"
    products_path = args.output_dir / "mock_products.csv"
    
    reviews_df.to_csv(reviews_path, index=False)
    products_df.to_csv(products_path, index=False)
    
    logger.info(f"\n✅ Mock data generated successfully!")
    logger.info(f"📁 Reviews: {reviews_path}")
    logger.info(f"📁 Products: {products_path}")
    logger.info("\nNext steps:")
    logger.info("1. Run: python scripts/preprocess_data.py")
    logger.info("2. Run: python scripts/setup_qdrant.py")
    logger.info("3. Run: python scripts/generate_embeddings.py")


if __name__ == "__main__":
    main()
