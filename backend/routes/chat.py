from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.database import SessionLocal
from models.schemas import ChatRequest, ChatResponse
from services.memory_service import get_user_profile, save_message, get_recent_messages
from services.ai_service import generate_response

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest, db: Session = Depends(get_db)):
    # 1. Retrieve user profile
    profile = get_user_profile(db)
    profile_data = None
    if profile:
        profile_data = {
            "budget": profile.budget,
            "food_preferences": profile.food_preferences,
            "travel_style": profile.travel_style
        }

    # 2. Retrieve last 5 messages
    recent_msgs = get_recent_messages(db, limit=5)
    context = [{"role": m.role, "content": m.content} for m in recent_msgs]
    
    # 3. Add current message to context
    context.append({"role": "user", "content": request.message})
    
    # 4. Save user message to DB
    save_message(db, "user", request.message)

    # 5. Call AI service
    ai_response = generate_response(context, profile_data)
    
    # 6. Save assistant message to DB
    save_message(db, "assistant", ai_response["message"])

    return ai_response
