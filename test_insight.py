import requests
import json

def test_insight(pid="INVALID_ID_TEST"): # Example ID from search results image if readable, or random
    # Let's first search to get a valid ID
    print("Searching to find valid ID...")
    try:
        r = requests.get("http://localhost:8002/api/v1/products/search?q=phone")
        if r.status_code == 200 and r.json():
            pid = r.json()[0]['product_id']
            print(f"Testing with Product ID: {pid}")
        else:
            print("Search failed or empty.")
            return
    except Exception as e:
        print(f"Search error: {e}")
        # Continue to try with default/passed pid if search fails
        pass
            
    url = "http://localhost:8002/api/v1/quick-insight"
    payload = {"product_id": pid}
    headers = {"Content-Type": "application/json"}
    
    print(f"\nRequesting Insight for {pid}...")
    try:
        r = requests.post(url, json=payload, headers=headers)
        
        print(f"Status: {r.status_code}")
        if r.status_code == 200:
            print("Success! Response keys:", r.json().keys())
            print(json.dumps(r.json(), indent=2)[:500] + "...")
        else:
            print("Error Response:", r.text)
            try:
                rj = r.json()
                if 'traceback' in rj:
                    print("\n--- TRACEBACK ---")
                    print(rj['traceback'])
                    print("-----------------")
            except: pass
            
    except Exception as e:
        print(f"Test Failed: {e}")

if __name__ == "__main__":
    test_insight()
