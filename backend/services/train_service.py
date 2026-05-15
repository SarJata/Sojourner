import os
import httpx
from typing import List, Dict, Any
from dotenv import load_dotenv
from utils.travel_math import calculate_duration, is_realistic_duration

load_dotenv()

class TrainService:
    def __init__(self):
        self.api_key = os.getenv("RAPID_API_KEY")
        self.host = "irctc1.p.rapidapi.com"
        self.base_url = "https://irctc1.p.rapidapi.com/api/v3"

    def get_live_station(self, station_code: str, hours: int = 1) -> Dict[str, Any]:
        """
        Fetches live trains arriving/departing from a station in the next X hours.
        """
        url = f"{self.base_url}/getLiveStation"
        headers = {
            "x-rapidapi-host": self.host,
            "x-rapidapi-key": self.api_key
        }
        params = {"stationCode": station_code, "hours": hours}
        
        try:
            with httpx.Client() as client:
                response = client.get(url, headers=headers, params=params)
                response.raise_for_status()
                return response.json()
        except Exception as e:
            print(f"Error fetching live station data: {e}")
            return {"status": False, "message": str(e), "data": []}

    def get_options(self, origin: str, destination: str, date: str) -> List[Dict[str, Any]]:
        # Mocking a raw response for the debug trace demo
        raw_mock_response = {"trains": [{"name": "Tuticorin Express", "dep": "21:25", "arr": "07:15"}]}
        return self._normalize_response(raw_mock_response, origin, destination)

    def _normalize_response(self, raw_data: Any, origin: str, destination: str) -> List[Dict[str, Any]]:
        # In a real app, this parses the RapidAPI result
        # Adding reliability metadata
        normalized = []
        # ... logic to parse raw_data ...
        # For each train:
        train = {
            "id": "T1",
            "type": "train",
            "provider": "irctc_rapidapi",
            "confidence": "high",
            "verified": True,
            "name": "Tuticorin Express",
            "departure": "21:25",
            "arrival": "07:15",
            "duration_hours": calculate_duration("21:25", "07:15"),
            "estimated_price": 780,
            "class": "Sleeper",
            "train_number": "16236"
        }
        
        if is_realistic_duration(origin, destination, train["duration_hours"]):
            normalized.append(train)
        
        return normalized

train_service = TrainService()
