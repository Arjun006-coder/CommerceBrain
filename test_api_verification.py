import requests
import json
import sys

BASE_URL = "http://localhost:8002/api/v1"

def test_quick_insight():
    print("\n--- Testing Quick Insight ---")
    url = f"{BASE_URL}/quick-insight"
    payload = {"product_id": "B07XVY8M6K"} # Samsung M31 from dataset
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            data = response.json()
            print("Success!")
            print(f"Competitors found: {len(data.get('competitors', []))}")
            if data.get('competitors'):
                print("Sample Competitor:", data['competitors'][0])
            else:
                print("WARNING: No competitors found.")
        else:
            print(f"FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"EXCEPTION: {e}")

def test_deep_analysis():
    print("\n--- Testing Deep Analysis ---")
    url = f"{BASE_URL}/deep-analysis"
    payload = {"product_id": "B07XVY8M6K", "analysis_type": "comprehensive"}
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            data = response.json()
            print("Success!")
            if "report" in data:
                print("Report Summary snippet:", data["report"].get("summary")[:50] + "...")
                print("Competitors in Report:", data["report"].get("competitors"))
            else:
                print("WARNING: 'report' key missing.")
        else:
            print(f"FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"EXCEPTION: {e}")

if __name__ == "__main__":
    test_quick_insight()
    test_deep_analysis()
