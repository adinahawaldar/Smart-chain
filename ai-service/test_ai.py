import requests
import json

url = "http://localhost:8001/reroute-recommendation"
payload = {
    "shipment": {
        "id": "S302",
        "riskScore": 85,
        "source": "Mumbai",
        "destination": "Delhi",
        "extra_field": "test"
    },
    "disruption": "storm"
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
