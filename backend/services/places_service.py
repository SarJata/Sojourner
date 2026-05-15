import os
import httpx
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

class PlacesService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_PLACES_API_KEY")
        self.base_url = "https://maps.googleapis.com/maps/api/place"

    def get_attractions(self, location: str) -> List[Dict[str, Any]]:
        """
        Fetches top-rated attractions in a specific location using Google Places API.
        """
        url = f"{self.base_url}/textsearch/json"
        params = {
            "query": f"top attractions in {location}",
            "key": self.api_key,
            "region": "IN"
        }

        try:
            with httpx.Client() as client:
                response = client.get(url, params=params)
                if response.status_code == 200:
                    data = response.json()
                    return self._normalize_places_response(data.get("results", []))
        except Exception as e:
            print(f"Error fetching Google Places data: {e}")

        # Fallback to mock data
        return [
            {"name": "Local Landmark", "type": "Sightseeing", "time_needed": "2h", "rating": 4.5}
        ]

    def get_food_recommendations(self, location: str) -> List[Dict[str, Any]]:
        """
        Fetches highly-rated local eateries.
        """
        url = f"{self.base_url}/textsearch/json"
        params = {
            "query": f"best local food restaurants in {location}",
            "key": self.api_key,
            "region": "IN"
        }

        try:
            with httpx.Client() as client:
                response = client.get(url, params=params)
                if response.status_code == 200:
                    data = response.json()
                    return self._normalize_places_response(data.get("results", []))
        except Exception as e:
            print(f"Error fetching food recommendations: {e}")
        return []

    def _normalize_places_response(self, results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        normalized = []
        for p in results[:8]: # Top 8 results
            normalized.append({
                "name": p.get("name"),
                "address": p.get("formatted_address"),
                "rating": p.get("rating"),
                "user_ratings_total": p.get("user_ratings_total"),
                "types": p.get("types", []),
                "location": p.get("geometry", {}).get("location"),
                "place_id": p.get("place_id")
            })
        return normalized

places_service = PlacesService()
