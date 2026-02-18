"""
Initialize Qdrant vector database collections
Sets up the schema for RAG and memory systems
"""

import sys
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from backend.config import settings


def setup_qdrant_collections():
    """Initialize all Qdrant collections"""
    
    logger.info(f"Connecting to Qdrant at {settings.qdrant_host}:{settings.qdrant_port}")
    
    client = QdrantClient(
        host=settings.qdrant_host,
        port=settings.qdrant_port,
        api_key=settings.qdrant_api_key
    )
    
    # Collection configurations
    collections = {
        "reviews": {
            "description": "Product review embeddings for semantic search",
            "vector_size": 768,  # all-mpnet-base-v2 embedding size
            "distance": Distance.COSINE
        },
        "insights": {
            "description": "Generated insights and analysis embeddings",
            "vector_size": 768,
            "distance": Distance.COSINE
        },
        "user_preferences": {
            "description": "User preferences and memory for personalization",
            "vector_size": 768,
            "distance": Distance.COSINE
        },
        "products": {
            "description": "Product catalog embeddings",
            "vector_size": 768,
            "distance": Distance.COSINE
        }
    }
    
    for collection_name, config in collections.items():
        try:
            # Delete if exists (for fresh setup)
            try:
                client.delete_collection(collection_name)
                logger.info(f"Deleted existing collection: {collection_name}")
            except:
                pass
            
            # Create collection
            client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(
                    size=config["vector_size"],
                    distance=config["distance"]
                )
            )
            logger.info(f"✓ Created collection: {collection_name}")
            logger.info(f"  Description: {config['description']}")
            
        except Exception as e:
            logger.error(f"Failed to create collection {collection_name}: {e}")
            raise
    
    # Verify collections
    logger.info("\nVerifying collections...")
    collections_info = client.get_collections()
    
    for collection in collections_info.collections:
        logger.info(f"  ✓ {collection.name}")
    
    logger.info(f"\n✅ Qdrant setup complete!")
    logger.info(f"Total collections: {len(collections_info.collections)}")
    logger.info("\nNext steps:")
    logger.info("1. Ensure data is preprocessed: python scripts/preprocess_data.py")
    logger.info("2. Generate embeddings: python scripts/generate_embeddings.py")


if __name__ == "__main__":
    try:
        setup_qdrant_collections()
    except Exception as e:
        logger.error(f"\n❌ Setup failed: {e}")
        logger.error("\nTroubleshooting:")
        logger.error("1. Make sure Qdrant is running:")
        logger.error("   docker run -p 6333:6333 qdrant/qdrant")
        logger.error("2. Check .env file for correct QDRANT_HOST and QDRANT_PORT")
        sys.exit(1)
