from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.database import get_db, DebugLog
from typing import List

router = APIRouter(prefix="/debug", tags=["debug"])

@router.get("/logs/{trip_id}")
def get_trip_logs(trip_id: int, db: Session = Depends(get_db)):
    logs = db.query(DebugLog).filter(DebugLog.trip_id == trip_id).order_by(DebugLog.timestamp.desc()).all()
    return logs

@router.delete("/logs/{trip_id}")
def clear_trip_logs(trip_id: int, db: Session = Depends(get_db)):
    db.query(DebugLog).filter(DebugLog.trip_id == trip_id).delete()
    db.commit()
    return {"status": "cleared"}
