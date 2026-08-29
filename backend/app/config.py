import os
from pydantic import BaseModel
from typing import Optional

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

class Settings(BaseModel):
    PROJECT_NAME: str = "Golden Hour - Cybercrime Cash-Out Intelligence Console"
    VERSION: str = "v1.0-SIH26184"
    DATA_MODE: str = "SIMULATION"
    MHA_ORGANIZATION: str = "Ministry of Home Affairs - Indian Cyber Crime Coordination Centre (I4C)"
    DEFAULT_JURISDICTION: str = "Pune City Cyber Crime / Deccan Gymkhana"
    
    WEIGHT_AMOUNT: float = 0.25
    WEIGHT_VELOCITY: float = 0.20
    WEIGHT_NETWORK: float = 0.20
    WEIGHT_CASHOUT_URGENCY: float = 0.15
    WEIGHT_HISTORICAL_LINK: float = 0.10
    WEIGHT_DATA_CONFIDENCE: float = 0.10

    SUPABASE_URL: Optional[str] = os.environ.get("SUPABASE_URL")
    SUPABASE_KEY: Optional[str] = os.environ.get("SUPABASE_KEY")
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

settings = Settings()
