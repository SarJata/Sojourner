from datetime import datetime, timedelta

def calculate_duration(departure_time: str, arrival_time: str) -> float:
    """
    Calculates duration in hours, correctly handling overnight travel.
    Expects format "HH:MM"
    """
    fmt = "%H:%M"
    td1 = datetime.strptime(departure_time, fmt)
    td2 = datetime.strptime(arrival_time, fmt)
    
    if td2 < td1:
        # Overnight travel
        td2 += timedelta(days=1)
    
    diff = td2 - td1
    return diff.total_seconds() / 3600

def is_realistic_duration(origin: str, destination: str, duration: float) -> bool:
    """
    Rule-based sanity check for Indian travel routes.
    """
    # Simple example: Bengaluru to Udupi is roughly 400km, takes at least 7-8 hours by train/bus
    if "Bengaluru" in origin and "Udupi" in destination and duration < 6.5:
        return False
    
    # Generic rule: No train journey between major cities in India is under 1 hour 
    # (except very short shunts)
    if duration < 1.0:
        return False
        
    return True
