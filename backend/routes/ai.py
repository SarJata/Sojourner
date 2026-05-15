from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.database import get_db, Trip, Message, UserPreferences
from models import schemas
from services.ai_service import get_chat_response

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/chat", response_model=schemas.ChatResponse)
def chat_with_ai(req: schemas.ChatRequest, db: Session = Depends(get_db)):
    # 1. Fetch trip context
    trip = db.query(Trip).filter(Trip.id == req.trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    # 2. Fetch user preferences (memory)
    prefs = db.query(UserPreferences).order_by(UserPreferences.id.desc()).first()
    
    # Construct context for AI
    itinerary_summary = []
    for day in trip.itinerary_days:
        day_info = {"day": day.day_number, "title": day.title, "activities": []}
        for act in day.activities:
            day_info["activities"].append(act.name)
        itinerary_summary.append(day_info)

    trip_context = {
        "status": trip.status,
        "destination": trip.destination,
        "start_date": trip.start_date,
        "end_date": trip.end_date,
        "preferences": prefs.__dict__ if prefs else {},
        "itinerary": itinerary_summary
    }

    # 3. Fetch history
    history_objs = db.query(Message).filter(Message.trip_id == req.trip_id).order_by(Message.timestamp.asc()).all()
    history = [{"role": m.role, "content": m.content} for m in history_objs]

    # 4. Save user message
    user_msg = Message(trip_id=req.trip_id, role="user", content=req.message)
    db.add(user_msg)
    
    # 5. Get AI Response
    ai_resp_data = get_chat_response(req.message, trip_context, history)
    
    # 6. Save AI message
    ai_msg = Message(trip_id=req.trip_id, role="assistant", content=ai_resp_data["message"])
    db.add(ai_msg)
    
    # 7. Simple Memory Evolution (Mock logic)
    # If the user says they are 'tired', we might update their learned 'pacing_patterns'
    if "tired" in req.message.lower() and prefs:
        prefs.pacing_patterns = "Prefers more rest stops when tired"
        db.add(prefs)

    db.commit()
    
    return ai_resp_data
