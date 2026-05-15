from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./sojourner.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class UserPreferences(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    budget_range = Column(String) # e.g., "Budget", "Mid-range", "Luxury"
    travel_style = Column(String) # e.g., "Relaxed", "Adventure", "Cultural"
    food_preferences = Column(Text)
    pace = Column(String) # e.g., "Slow", "Balanced", "Fast"
    interests = Column(Text) # Comma separated list
    
    # Memory Evolution fields
    preferred_activity_types = Column(Text, nullable=True)
    pacing_patterns = Column(Text, nullable=True)
    budget_behavior = Column(Text, nullable=True)
    disliked_categories = Column(Text, nullable=True)

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    origin = Column(String)
    destination = Column(String)
    start_date = Column(String)
    end_date = Column(String)
    budget = Column(Float)
    travel_type = Column(String) # e.g., "Solo", "Couple", "Family", "Friends"
    status = Column(String, default="planned") # planned, active, completed
    summary = Column(Text)
    
    itinerary_days = relationship("ItineraryDay", back_populates="trip", cascade="all, delete-orphan")
    messages = relationship("Message", back_populates="trip", cascade="all, delete-orphan")

class ItineraryDay(Base):
    __tablename__ = "itinerary_days"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"))
    day_number = Column(Integer)
    title = Column(String)
    notes = Column(Text)

    trip = relationship("Trip", back_populates="itinerary_days")
    activities = relationship("Activity", back_populates="itinerary_day", cascade="all, delete-orphan")

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    itinerary_day_id = Column(Integer, ForeignKey("itinerary_days.id"))
    name = Column(String)
    time = Column(String)
    location = Column(String)
    estimated_cost = Column(Float)
    category = Column(String) # e.g., "Sightseeing", "Dining", "Transport"

    itinerary_day = relationship("ItineraryDay", back_populates="activities")

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"))
    role = Column(String) # user or assistant
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    trip = relationship("Trip", back_populates="messages")

class DebugLog(Base):
    __tablename__ = "debug_logs"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"))
    stage = Column(String) # RAW, NORMALIZED, FILTERED, AI_CONTEXT, AI_RESPONSE
    content = Column(Text) # JSON blob
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    trip = relationship("Trip")

def init_db():
    # In a real app we might use migrations, but for this we'll recreate
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
