from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserPreferencesBase(BaseModel):
    budget_range: str
    travel_style: str
    food_preferences: str
    pace: str
    interests: str

class UserPreferencesCreate(UserPreferencesBase):
    pass

class UserPreferences(BaseModel):
    id: int
    budget_range: str
    travel_style: str
    food_preferences: str
    pace: str
    interests: str
    preferred_activity_types: Optional[str] = None # JSON string or comma separated
    pacing_patterns: Optional[str] = None
    budget_behavior: Optional[str] = None # e.g. "Stays under budget", "Splurges on food"
    disliked_categories: Optional[str] = None
    class Config:
        from_attributes = True

class ActivityBase(BaseModel):
    name: str
    time: str
    location: str
    estimated_cost: float
    category: str

class ActivityCreate(ActivityBase):
    pass

class Activity(ActivityBase):
    id: int
    itinerary_day_id: int
    class Config:
        from_attributes = True

class ItineraryDayBase(BaseModel):
    day_number: int
    title: str
    notes: Optional[str] = None

class ItineraryDayCreate(ItineraryDayBase):
    activities: List[ActivityCreate]

class ItineraryDay(ItineraryDayBase):
    id: int
    trip_id: int
    activities: List[Activity]
    class Config:
        from_attributes = True

class TripBase(BaseModel):
    origin: str
    destination: str
    start_date: str
    end_date: str
    budget: float
    travel_type: str
    status: str = "planned"
    summary: Optional[str] = None

class TripCreate(TripBase):
    preferences: UserPreferencesCreate

class TripUpdate(BaseModel):
    status: Optional[str] = None
    summary: Optional[str] = None

class Trip(TripBase):
    id: int
    itinerary_days: List[ItineraryDay]
    class Config:
        from_attributes = True

class MessageBase(BaseModel):
    trip_id: int
    role: str
    content: str

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: int
    timestamp: datetime
    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    trip_id: int
    message: str

class ChatResponse(BaseModel):
    message: str
    intent: Optional[str] = None
    actions: List[str] = []
    suggestions: List[str] = []
    proactive_prompts: List[str] = [] # New for ACTIVE mode
    updated_plan: Optional[dict] = None
    personalization_cue: Optional[str] = None # To show "Based on your preferences..."
