"""
Script to download datasets from Kaggle
Requires Kaggle API credentials configured
"""

import os
import sys
from pathlib import Path
import argparse
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from kaggle.api.kaggle_api_extended import KaggleApi


def download_amazon_reviews(output_dir: Path):
    """Download Amazon reviews dataset"""
    logger.info("Downloading Amazon reviews dataset...")
    
    api = KaggleApi()
    api.authenticate()
    
    try:
        # Download Amazon product reviews
        api.dataset_download_files(
            'datafiniti/consumer-reviews-of-amazon-products',
            path=output_dir,
            unzip=True
        )
        logger.info(f"✓ Amazon reviews downloaded to {output_dir}")
        return True
    except Exception as e:
        logger.error(f"Failed to download Amazon reviews: {e}")
        return False


def download_flipkart_products(output_dir: Path):
    """Download Flipkart products dataset"""
    logger.info("Downloading Flipkart products dataset...")
    
    api = KaggleApi()
    api.authenticate()
    
    try:
        # Download Flipkart products
        api.dataset_download_files(
            'PromptCloudHQ/flipkart-products',
            path=output_dir,
            unzip=True
        )
        logger.info(f"✓ Flipkart products downloaded to {output_dir}")
        return True
    except Exception as e:
        logger.error(f"Failed to download Flipkart products: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description='Download datasets from Kaggle')
    parser.add_argument(
        '--output-dir',
        type=Path,
        default=Path(__file__).parent.parent / 'data' / 'raw',
        help='Output directory for datasets'
    )
    parser.add_argument(
        '--dataset',
        choices=['amazon', 'flipkart', 'all'],
        default='all',
        help='Which dataset to download'
    )
    
    args = parser.parse_args()
    
    # Create output directory
    args.output_dir.mkdir(parents=True, exist_ok=True)
    
    logger.info(f"Output directory: {args.output_dir}")
    
    # Download datasets
    success = True
    
    if args.dataset in ['amazon', 'all']:
        success &= download_amazon_reviews(args.output_dir)
    
    if args.dataset in ['flipkart', 'all']:
        success &= download_flipkart_products(args.output_dir)
    
    if success:
        logger.info("\n✅ All datasets downloaded successfully!")
        logger.info(f"📁 Location: {args.output_dir}")
        logger.info("\nNext steps:")
        logger.info("1. Run: python scripts/preprocess_data.py")
        logger.info("2. Run: python scripts/setup_qdrant.py")
        logger.info("3. Run: python scripts/generate_embeddings.py")
    else:
        logger.error("\n❌ Some datasets failed to download")
        logger.error("Please check your Kaggle API credentials")
        logger.error("Setup guide: https://www.kaggle.com/docs/api")
        sys.exit(1)


if __name__ == "__main__":
    main()
