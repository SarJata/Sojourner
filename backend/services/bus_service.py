from typing import List, Dict, Any

class BusService:
    @staticmethod
    def get_options(origin: str, destination: str, date: str) -> List[Dict[str, Any]]:
        # Mocking RedBus style integration
        return [
            {
                "id": "B1",
                "type": "bus",
                "provider": "KSRTC",
                "name": "Airavat Club Class",
                "departure": "22:00",
                "arrival": "06:30",
                "duration_hours": 8.5,
                "estimated_price": 1150,
                "class": "AC Sleeper"
            },
            {
                "id": "B2",
                "type": "bus",
                "provider": "VRL Travels",
                "name": "Multi-Axle Semi-Sleeper",
                "departure": "23:15",
                "arrival": "08:00",
                "duration_hours": 8.75,
                "estimated_price": 950,
                "class": "AC Semi-Sleeper"
            }
        ]

bus_service = BusService()
