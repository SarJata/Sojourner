from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from models.database import get_db, Trip, ItineraryDay, Activity, UserPreferences
from models import schemas
from services.ai_service import generate_itinerary

router = APIRouter(prefix="/trips", tags=["trips"])

@router.post("/create", response_model=schemas.Trip)
def create_trip(trip_in: schemas.TripCreate, db: Session = Depends(get_db)):
    # 1. Store preferences
    prefs = UserPreferences(**trip_in.preferences.dict())
    db.add(prefs)
    db.flush()

    # 2. Create Trip
    trip_data = trip_in.dict(exclude={"preferences"})
    new_trip = Trip(**trip_data)
    db.add(new_trip)
    db.flush()

    # 3. Generate Itinerary via AI
    itinerary_data = generate_itinerary(trip_data, trip_in.preferences.dict())

    # 4. Save Itinerary
    for day_data in itinerary_data:
        day = ItineraryDay(
            trip_id=new_trip.id,
            day_number=day_data.get("day_number") or day_data.get("day"),
            title=day_data.get("title") or day_data.get("day_title"),
            notes=day_data.get("notes") or day_data.get("summary")
        )
        db.add(day)
        db.flush()

        for act_data in day_data.get("activities", []):
            activity = Activity(
                itinerary_day_id=day.id,
                name=act_data.get("name") or act_data.get("activity") or "Unknown Activity",
                time=act_data.get("time") or "TBD",
                location=act_data.get("location") or act_data.get("place") or "Various",
                estimated_cost=act_data.get("estimated_cost") or act_data.get("cost") or 0.0,
                category=act_data.get("category") or "Sightseeing"
            )
            db.add(activity)

    db.commit()
    db.refresh(new_trip)
    return new_trip

@router.get("/", response_model=List[schemas.Trip])
def list_trips(db: Session = Depends(get_db)):
    return db.query(Trip).all()

@router.get("/{trip_id}", response_model=schemas.Trip)
def get_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip

@router.post("/regenerate", response_model=schemas.Trip)
def regenerate_trip_itinerary(req: schemas.ChatRequest, db: Session = Depends(get_db)):
    # Fetch existing trip
    trip = db.query(Trip).filter(Trip.id == req.trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # In a real app, we'd use the message 'req.message' to guide the regeneration
    # For now, we'll just regenerate based on the original details but could be enhanced
    
    # 1. Clear old itinerary
    db.query(ItineraryDay).filter(ItineraryDay.trip_id == trip.id).delete()
    
    # 2. Re-generate
    # We'd need to store the preferences to re-use them properly. 
    # For this demo, let's assume standard prefs or fetch most recent.
    prefs = db.query(UserPreferences).order_by(UserPreferences.id.desc()).first()
    
    trip_data = {
        "destination": trip.destination,
        "start_date": trip.start_date,
        "end_date": trip.end_date,
        "budget": trip.budget
    }
    
    itinerary_data = generate_itinerary(trip_data, prefs.__dict__ if prefs else {})
    
    for day_data in itinerary_data:
        day = ItineraryDay(
            trip_id=trip.id,
            day_number=day_data.get("day_number"),
            title=day_data.get("title")
        )
        db.add(day)
        db.flush()
        for act_data in day_data.get("activities", []):
            activity = Activity(
                itinerary_day_id=day.id,
                name=act_data.get("name"),
                time=act_data.get("time"),
                location=act_data.get("location"),
                estimated_cost=act_data.get("estimated_cost", 0.0),
                category=act_data.get("category")
            )
            db.add(activity)
            
    db.commit()
    db.refresh(trip)
    return trip
