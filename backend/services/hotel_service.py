import os
import httpx
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

class HotelService:
    def __init__(self):
        self.api_key = os.getenv("RAPID_API_KEY")
        self.host = "airbnb19.p.rapidapi.com"
        self.base_url = "https://airbnb19.p.rapidapi.com/api/v2"
        
        # Mapping common cities to Google Place IDs for demo
        self.place_id_map = {
            "Varanasi": "ChIJrcv00DwsDogRAMDACa2m4K8", # Example placeholder
            "Madurai": "ChIJY7v00DwsDogRAMDACa2m4K8",
            "Bengaluru": "ChIJV7v00DwsDogRAMDACa2m4K8",
            "Hampi": "ChIJN7v00DwsDogRAMDACa2m4K8"
        }

    def get_options(self, location: str, budget_range: str = "Mid-range") -> List[Dict[str, Any]]:
        """
        Fetches real property listings from Airbnb.
        """
        place_id = self.place_id_map.get(location, "ChIJ7cv00DwsDogRAMDACa2m4K8")
        
        url = f"{self.base_url}/searchPropertyByPlaceId"
        headers = {
            "x-rapidapi-host": self.host,
            "x-rapidapi-key": self.api_key
        }
        params = {
            "placeId": place_id,
            "adults": "1",
            "currency": "INR"
        }

        try:
            with httpx.Client() as client:
                response = client.get(url, headers=headers, params=params)
                if response.status_code == 200:
                    data = response.json()
                    return self._normalize_airbnb_response(data.get("data", []), location)
        except Exception as e:
            print(f"Error fetching Airbnb data: {e}")
        
        # Fallback to mock data if API fails
        return [
            {
                "id": "M1",
                "name": f"Comfort Inn {location}",
                "type": "Stay",
                "location": f"{location} Central",
                "price_per_night": 2500,
                "rating": 4.0,
                "amenities": ["AC", "Wifi"]
            }
        ]

    def _normalize_airbnb_response(self, properties: List[Dict[str, Any]], location: str) -> List[Dict[str, Any]]:
        normalized = []
        for prop in properties[:10]: # Limit to top 10
            normalized.append({
                "id": prop.get("id", "N/A"),
                "name": prop.get("name", "Boutique Stay"),
                "type": "Airbnb",
                "location": location,
                "price_per_night": prop.get("price", {}).get("amount", 2500),
                "rating": prop.get("rating", 4.5),
                "amenities": prop.get("amenities", ["Essential", "Wifi"])
            })
        return normalized

hotel_service = HotelService()
