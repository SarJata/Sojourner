from typing import Dict, Any

class WeatherService:
    @staticmethod
    def get_forecast(location: str) -> Dict[str, Any]:
        return {
            "current_temp": "28C",
            "condition": "Partly Cloudy",
            "forecast": "Clear skies for the next 48 hours. Minimal rain expected."
        }

weather_service = WeatherService()
