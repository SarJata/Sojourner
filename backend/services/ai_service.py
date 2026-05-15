import os
import json
from openai import OpenAI
from typing import List, Dict, Any
from .recommendation_service import recommendation_service
from .debug_service import debug_service
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# India-First System Prompt
SYSTEM_PROMPT = """You are "Sojourner AI", a contextually aware travel strategist and decision helper.

CRITICAL RULE:
- NEVER hallucinate or fabricate travel infrastructure data (train numbers, timings, prices, or hotel names).
- You will be provided with REAL data from backend providers.
- Your job is to RANK, PERSONALIZE, EXPLAIN, and OPTIMIZE these options based on the user's style.
- If no real data is provided for a specific request, state that you need to fetch it first.

CORE PHILOSOPHY:
- Use INR (₹) for all budget and cost estimations.
- Recommend options based on Indian travel patterns (e.g., Sleeper vs AC, Overnight bus vs Morning Train).
- Adapt suggestions to user pacing (Slow/Balanced/Intense) and budget.

FACTUAL SAFETY RULES:
1. ONLY use the provided transport data from the Context (TCO).
2. NEVER invent train numbers, timings, or prices.
3. If no transport options are provided in the TCO, state: "I couldn't find verified transport for this route yet."
4. Distinguish clearly between FACT (from TCO) and REASONING (your advice).

For chat interactions, always return:
{
  "message": "Your conversational response explaining the choices",
  "intent": "The detected intent (e.g., FIND_TRAINS, FIND_STAYS, OPTIMIZE_DAY)",
  "actions": ["Suggested UI actions"],
  "suggestions": ["Follow-up questions"],
  "proactive_prompts": ["Situationally aware suggestions"],
  "updated_plan": {},
  "personalization_cue": "Visible note on why this was suggested based on memory"
}
"""

def generate_itinerary(trip_details: Dict[str, Any], preferences: Dict[str, Any]) -> List[Dict[str, Any]]:
    prompt = f"""Generate a detailed daily itinerary.
    Origin (Source): {trip_details.get('origin', 'Unknown')}
    Destination: {trip_details['destination']}
    Dates (Source-to-Source): {trip_details['start_date']} to {trip_details['end_date']}
    Budget: ₹{trip_details['budget']}
    Travel Style: {preferences.get('travel_style', 'Balanced')}
    Interests: {preferences.get('interests', 'General')}
    Pace: {preferences.get('pace', 'Balanced')}
    Food Preferences: {preferences.get('food_preferences', 'Indian')}

    Requirements:
    - Use INR (₹).
    - Include Indian transport (Trains/Buses).
    - Consider temple timings and local food.
    - Return a JSON object with a key "itinerary" which is a list of days.
    
    EACH DAY MUST FOLLOW THIS SCHEMA:
    {{
        "day_number": int,
        "title": "string",
        "notes": "string",
        "activities": [
            {{
                "name": "string",
                "time": "string",
                "location": "string",
                "estimated_cost": float,
                "category": "Sightseeing | Dining | Transport | Relaxation"
            }}
        ]
    }}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a specialized Indian travel planner. Return ONLY valid JSON."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"}
    )
    
    data = json.loads(response.choices[0].message.content)
    if "itinerary" in data: return data["itinerary"]
    if "days" in data: return data["days"]
    return data if isinstance(data, list) else []

def get_chat_response(message: str, trip_context: Dict[str, Any], history: List[Dict[str, str]]) -> Dict[str, Any]:
    # 1. Generate the structured Travel Context Object (TCO)
    # This is the intelligence layer doing the pre-filtering/ranking
    travel_context = recommendation_service.get_travel_context(trip_context)

    # 2. Construct context for AI reasoning
    context_str = f"""
    TRAVEL CONTEXT OBJECT (TCO):
    {json.dumps(travel_context, indent=2)}
    
    CURRENT ITINERARY:
    {json.dumps(trip_context.get('itinerary', []), indent=2)}
    """
    
    # DEBUG: Log AI Context
    debug_service.log(trip_context.get('id', 0), "AI_CONTEXT", context_str)

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "system", "content": f"Context: {context_str}"}
    ]
    
    for msg in history[-10:]:
        messages.append({"role": msg["role"], "content": msg["content"]})
    
    messages.append({"role": "user", "content": message})

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        response_format={"type": "json_object"}
    )
    
    ai_resp_content = response.choices[0].message.content
    # DEBUG: Log AI Response
    debug_service.log(trip_context.get('id', 0), "AI_RESPONSE", ai_resp_content)
    
    return json.loads(ai_resp_content)
