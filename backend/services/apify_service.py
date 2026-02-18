import requests
import logging
import time
from typing import Optional, Dict, Any

from backend.config import settings

logger = logging.getLogger(__name__)

class ApifyService:
    def __init__(self, api_token: Optional[str] = None):
        self.api_token = api_token or settings.apify_api_token
        # Ensure we have a token or handle it gracefully
        if not self.api_token:
            logger.warning("Apify API Token not found in settings. Real-time scraping will be disabled.")
            self.api_token = "PROVIDE_TOKEN_IN_ENV" 
        self.actor_id = "XVDTQc4a7MDTqSTMJ" # Amazon Product Scraper
        self.base_url = "https://api.apify.com/v2"

    def scrape_product(self, product_url: str) -> Optional[Dict[str, Any]]:
        """
        Triggers an Apify actor run to scrape the given Amazon URL.
        Waits for completion and returns the normalized product data.
        """
        logger.info(f"Triggering Apify scraper for: {product_url}")
        
        # 1. Start the Actor Run
        start_url = f"{self.base_url}/acts/{self.actor_id}/runs"
        payload = {
            "categoryUrls": [{"url": product_url}],
            "maxItems": 1,
            "scrapeReviews": True # extended info
        }
        
        try:
            # Start run and wait for finish (using waitForFinish parameter for simplicity if supported, 
            # but standard is POST to runs -> poll or use waitForFinish=120)
            response = requests.post(
                start_url, 
                json=payload, 
                params={"token": self.api_token, "waitForFinish": 120} 
            )
            
            if response.status_code != 201:
                logger.error(f"Failed to start Apify run: {response.text}")
                return None
                
            run_data = response.json().get("data", {})
            default_dataset_id = run_data.get("defaultDatasetId")
            
            if not default_dataset_id:
                logger.error("No dataset ID returned from Apify run")
                return None
                
            # 2. Fetch Results
            dataset_url = f"{self.base_url}/datasets/{default_dataset_id}/items"
            items_response = requests.get(dataset_url, params={"token": self.api_token})
            
            if items_response.status_code != 200:
                logger.error(f"Failed to fetch dataset items: {items_response.text}")
                return None
                
            items = items_response.json()
            if not items:
                logger.warning("Apify scraper returned no items.")
                return None
                
            # 3. Normalize Data
            raw_item = items[0]
            return self._normalize_item(raw_item)

        except Exception as e:
            logger.error(f"Apify Service Error: {e}")
            return None

    def _normalize_item(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """
        Maps Apify output to our internal catalog schema.
        """
        # Extract features/description for RAG text
        description = item.get("description", "")
        features = " ".join(item.get("features", []))
        about_product = f"{description} {features}".strip()
        
        # Extract Price
        price = "N/A"
        if isinstance(item.get("price"), dict):
            price = item["price"].get("value", "N/A")
        
        return {
            "product_id": item.get("asin", item.get("originalAsin", "unknown_id")),
            "name": item.get("title", "Unknown Product"),
            "category": item.get("breadCrumbs", "General"),
            "price": price,
            "discounted_price": price, # Mapping both for compatibility
            "actual_price": item.get("listPrice", price),
            "rating": item.get("stars", 0.0),
            "rating_count": item.get("reviewsCount", 0),
            "about_product": about_product,
            "rag_text": f"{item.get('title')} {item.get('breadCrumbs')} {about_product}",
            "review_content": "", # Real-time scraper might not get full reviews body in this mode without extra config
            "source": "live_scrape"
        }
