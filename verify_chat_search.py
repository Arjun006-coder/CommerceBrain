import requests
import json

BASE_URL = "http://localhost:8002"
PRODUCT_ID = "c2d766ca982eca8304150849735ffef9" # Alisha Solid Women's Cycling Shorts

def test_url_search():
    print("--- Testing URL Search ---")
    # Simulate a Flipkart URL
    url = f"https://www.flipkart.com/some-product/p/itm12345?pid={PRODUCT_ID}&lid=LST..."
    
    try:
        response = requests.get(f"{BASE_URL}/api/v1/products/search", params={"q": url})
        data = response.json()
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200 and len(data) > 0:
            print(f"Success! Found: {data[0]['name']} (ID: {data[0]['product_id']})")
            if data[0]['product_id'] == PRODUCT_ID:
                print("ID Match: Confirmed")
            else:
                print("ID Match: FAILED")
        else:
            print("Failed to find product by URL")
            print(data)
    except Exception as e:
        print(f"Error: {e}")

def test_chat():
    print("\n--- Testing Chat API ---")
    
    # Test 1: Price
    msg1 = "What is the price of this item?"
    print(f"User: {msg1}")
    try:
        res1 = requests.post(f"{BASE_URL}/api/v1/chat", json={"message": msg1, "product_id": PRODUCT_ID})
        print(f"AI: {res1.json()['response']}")
    except Exception as e:
        print(f"Error: {e}")

    # Test 2: Complaints (even if none, it should handle gracefully)
    msg2 = "Are there any complaints?"
    print(f"User: {msg2}")
    try:
        res2 = requests.post(f"{BASE_URL}/api/v1/chat", json={"message": msg2, "product_id": PRODUCT_ID})
        print(f"AI: {res2.json()['response']}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_url_search()
    test_chat()
