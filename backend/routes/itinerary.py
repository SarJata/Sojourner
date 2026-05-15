from fastapi import APIRouter

router = APIRouter()

@router.get("/itinerary")
def get_itineraries():
    return {"message": "Feature coming soon: viewing all saved itineraries."}
