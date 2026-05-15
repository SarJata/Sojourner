from sqlalchemy.orm import Session
from models.database import UserProfile, Message, TripHistory

def get_user_profile(db: Session):
    return db.query(UserProfile).first()

def save_user_profile(db: Session, profile_data: dict):
    db_profile = db.query(UserProfile).first()
    if db_profile:
        for key, value in profile_data.items():
            setattr(db_profile, key, value)
    else:
        db_profile = UserProfile(**profile_data)
        db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

def save_message(db: Session, role: str, content: str):
    db_message = Message(role=role, content=content)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def get_recent_messages(db: Session, limit: int = 5):
    return db.query(Message).order_by(Message.id.desc()).limit(limit).all()[::-1]
