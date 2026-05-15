from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.database import SessionLocal
from models.schemas import UserProfileCreate, UserProfile
from services.memory_service import save_user_profile

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/onboarding", response_model=UserProfile)
def create_onboarding(profile: UserProfileCreate, db: Session = Depends(get_db)):
    return save_user_profile(db, profile.dict())
