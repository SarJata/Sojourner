import json
import os
from models.database import SessionLocal, DebugLog
from typing import Any

DEBUG_MODE = os.getenv("DEBUG_MODE", "true").lower() == "true"

class DebugService:
    @staticmethod
    def log(trip_id: int, stage: str, content: Any):
        if not DEBUG_MODE:
            return
            
        db = SessionLocal()
        try:
            # Ensure content is stringified
            if not isinstance(content, str):
                content_str = json.dumps(content, indent=2)
            else:
                content_str = content
                
            log_entry = DebugLog(
                trip_id=trip_id,
                stage=stage,
                content=content_str
            )
            db.add(log_entry)
            db.commit()
            print(f"[DEBUG][{stage}] logged for trip {trip_id}")
        except Exception as e:
            print(f"Failed to log debug info: {e}")
        finally:
            db.close()

debug_service = DebugService()
