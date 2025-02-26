import requests
import json
import sys

# Configuration
API_URL = "http://localhost:8000"
API_KEY = "test-key-1"  # This should match one of the keys in your API_KEYS env var


def test_health():
    """Test the health endpoint"""
    response = requests.get(f"{API_URL}/health")
    print(f"Health check status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    return response.status_code == 200


def test_inference():
    """Test the inference endpoint"""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "id": "test-request-123",
        "prompt": "This is a test prompt for inference"
    }

    response = requests.post(f"{API_URL}/infer", headers=headers, json=payload)
    print(f"Inference status: {response.status_code}")

    if response.status_code == 200:
        print(json.dumps(response.json(), indent=2))
        return True
    else:
        print(f"Error: {response.text}")
        return False


if __name__ == "__main__":
    print("Testing AI Inference API...")

    health_ok = test_health()
    if not health_ok:
        print("Health check failed!")
        sys.exit(1)

    inference_ok = test_inference()
    if not inference_ok:
        print("Inference test failed!")
        sys.exit(1)

    print("All tests passed successfully!")
