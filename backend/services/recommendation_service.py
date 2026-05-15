from typing import List, Dict, Any
from .train_service import train_service
from .bus_service import bus_service
from .hotel_service import hotel_service
from .places_service import places_service
from .weather_service import weather_service
from .decision_engine import decision_engine
from .debug_service import debug_service
import datetime

class RecommendationService:
    @staticmethod
    def get_travel_context(trip_context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Creates a structured 'Travel Context Object' after pre-filtering 
        and ranking real API data.
        """
        destination = trip_context.get('destination', 'India')
        budget = trip_context.get('budget', 0)
        prefs = trip_context.get('preferences', {})
        style = prefs.get('travel_style', 'Balanced')
        
        # 1. Fetch raw data
        raw_trains = train_service.get_options(trip_context.get('origin', 'Current Location'), destination, trip_context.get('start_date', ''))
        raw_buses = bus_service.get_options(trip_context.get('origin', 'Current Location'), destination, trip_context.get('start_date', ''))
        raw_stays = hotel_service.get_options(destination, style)
        
        # DEBUG: Log RAW data
        debug_service.log(trip_context.get('id', 0), "RAW", {"trains": raw_trains, "buses": raw_buses, "stays": raw_stays})
        
        # 2. Pre-filter and Rank via Decision Engine
        filtered_stays = decision_engine.filter_and_rank_stays(raw_stays, budget, style)
        
        # DEBUG: Log Filtered data
        debug_service.log(trip_context.get('id', 0), "FILTERED", {"stays": filtered_stays})
        fatigue = decision_engine.calculate_fatigue(trip_context.get('itinerary', []), "12:00")
        
        # 3. Construct the "Travel Context Object"
        context_object = {
            "trip_stage": trip_context.get('stage', trip_context.get('status', 'PLANNING')),
            "current_city": destination,
            "current_time": datetime.datetime.now().strftime("%H:%M"),
            "budget_remaining": budget,
            "travel_fatigue": fatigue,
            "user_preferences": prefs,
            "weather": weather_service.get_forecast(destination),
            "transport_options": {
                "top_trains": raw_trains[:2],
                "top_buses": raw_buses[:2]
            },
            "accommodation_options": filtered_stays,
            "attractions": places_service.get_attractions(destination),
            "food_recommendations": places_service.get_food_recommendations(destination)
        }

        # 4. If ACTIVE, add Live Station Context (Real API)
        if context_object["trip_stage"] == "ACTIVE":
            # Mocking a station code like 'SBC' for Bengaluru or 'MDU' for Madurai
            station_code = "SBC" if "Bengaluru" in destination else "MDU"
            live_station = train_service.get_live_station(station_code)
            context_object["live_station_updates"] = live_station.get("data", [])[:5] # Top 5 live trains
        
        return context_object

recommendation_service = RecommendationService()
