import requests
import time

def test_api():
    try:
        print("Testing Health...")
        r = requests.get("http://localhost:8002/api/health", timeout=5)
        print(f"Health: {r.status_code} - {r.text}")
        
        print("\nTesting Search (Lazy Load trigger)...")
        start = time.time()
        r = requests.get("http://localhost:8002/api/v1/products/search?q=phone", timeout=30)
        print(f"Search: {r.status_code} - Found {len(r.json())} items in {time.time()-start:.2f}s")
        print(r.json()[:1])
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    test_api()
