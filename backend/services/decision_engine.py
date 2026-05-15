from typing import List, Dict, Any

class DecisionEngine:
    @staticmethod
    def filter_and_rank_stays(stays: List[Dict[str, Any]], budget: float, style: str) -> List[Dict[str, Any]]:
        """
        Ranks and filters hotels based on budget and travel style.
        Returns top 3-5 options.
        """
        # Simple scoring logic
        scored_stays = []
        for s in stays:
            score = s.get('rating', 0) * 10
            # Budget check
            if s['price_per_night'] > budget * 0.4: # Too expensive
                score -= 20
            # Style matching
            if style == "Backpacker" and s['price_per_night'] < 1500:
                score += 30
            elif style == "Luxury" and s['price_per_night'] > 5000:
                score += 30
            
            scored_stays.append((score, s))
        
        # Sort by score and return top 3
        scored_stays.sort(key=lambda x: x[0], reverse=True)
        return [s[1] for s in scored_stays[:3]]

    @staticmethod
    def calculate_fatigue(itinerary: List[Dict[str, Any]], current_time: str) -> str:
        """
        Heuristic for travel fatigue based on activity density.
        """
        activity_count = sum(len(day.get('activities', [])) for day in itinerary)
        if activity_count > 15: return "High"
        if activity_count > 8: return "Medium"
        return "Low"

    @staticmethod
    def optimize_itinerary(itinerary: List[Dict[str, Any]], fatigue: str) -> List[Dict[str, Any]]:
        """
        Adjusts pacing if fatigue is high.
        """
        if fatigue == "High":
            # In a real app, this would suggest removing non-essential items
            pass
        return itinerary

decision_engine = DecisionEngine()
