import os
import logging
from typing import Optional, List, Dict, Any
from ..config import settings

logger = logging.getLogger("golden_hour.supabase")

try:
    from supabase import create_client, Client
except ImportError:
    create_client = None
    Client = Any

class SupabaseService:
    def __init__(self):
        self.url = settings.SUPABASE_URL or os.environ.get("SUPABASE_URL")
        self.key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_KEY or os.environ.get("SUPABASE_KEY")
        self.client: Optional[Client] = None
        self._init_client()

    def _init_client(self):
        if self.url:
            self.url = self.url.strip().rstrip('/')
            if self.url.endswith('/rest/v1'):
                self.url = self.url[:-8]
        if self.key:
            self.key = self.key.strip()

        if create_client and self.url and self.key:
            try:
                self.client = create_client(self.url, self.key)
                logger.info(f"Supabase client initialized with URL: {self.url}")
            except Exception as e:
                logger.warning(f"Failed to initialize Supabase client: {e}")
                self.client = None
        else:
            self.client = None

    def is_connected(self) -> bool:
        return self.client is not None

    def test_connection(self) -> Dict[str, Any]:
        if not self.is_connected():
            return {
                "connected": False,
                "message": "Supabase credentials not configured in environment (SUPABASE_URL / SUPABASE_KEY). Using resilient in-memory fallback.",
                "url": self.url or "Not set"
            }
        try:
            res = self.client.table("police_stations").select("count", count="exact").execute()
            return {
                "connected": True,
                "message": f"Connected to Supabase PostgreSQL. Tables active.",
                "url": self.url,
                "record_count": res.count if hasattr(res, 'count') else 'OK'
            }
        except Exception as e:
            return {
                "connected": False,
                "message": f"Supabase connection error: {str(e)}",
                "url": self.url
            }

    # Case Methods
    def fetch_cases(self) -> List[Dict[str, Any]]:
        if not self.is_connected():
            return []
        try:
            res = self.client.table("cases").select("*").order("created_at", desc=True).execute()
            return res.data or []
        except Exception as e:
            logger.error(f"Error fetching cases from Supabase: {e}")
            return []

    def insert_case(self, case_dict: Dict[str, Any]) -> bool:
        if not self.is_connected():
            return False
        try:
            self.client.table("cases").insert(case_dict).execute()
            return True
        except Exception as e:
            logger.error(f"Error inserting case into Supabase: {e}")
            return False

    def update_case_status(self, case_id: str, status: str) -> bool:
        if not self.is_connected():
            return False
        try:
            self.client.table("cases").update({"status": status}).eq("case_id", case_id).execute()
            return True
        except Exception as e:
            logger.error(f"Error updating case in Supabase: {e}")
            return False

    # Graph Nodes & Edges
    def fetch_nodes(self, case_id: str) -> List[Dict[str, Any]]:
        if not self.is_connected():
            return []
        try:
            res = self.client.table("account_nodes").select("*").eq("case_id", case_id).execute()
            return res.data or []
        except Exception as e:
            logger.error(f"Error fetching nodes from Supabase: {e}")
            return []

    def fetch_edges(self, case_id: str) -> List[Dict[str, Any]]:
        if not self.is_connected():
            return []
        try:
            res = self.client.table("transaction_edges").select("*").eq("case_id", case_id).order("hop_order").execute()
            return res.data or []
        except Exception as e:
            logger.error(f"Error fetching edges from Supabase: {e}")
            return []

    # ATMs & Police Stations
    def fetch_atms(self) -> List[Dict[str, Any]]:
        if not self.is_connected():
            return []
        try:
            res = self.client.table("atms").select("*").execute()
            return res.data or []
        except Exception as e:
            logger.error(f"Error fetching ATMs from Supabase: {e}")
            return []

    def fetch_police_stations(self) -> List[Dict[str, Any]]:
        if not self.is_connected():
            return []
        try:
            res = self.client.table("police_stations").select("*").execute()
            return res.data or []
        except Exception as e:
            logger.error(f"Error fetching police stations from Supabase: {e}")
            return []

    # Actions / Interventions
    def fetch_actions(self, case_id: Optional[str] = None) -> List[Dict[str, Any]]:
        if not self.is_connected():
            return []
        try:
            query = self.client.table("action_packets").select("*")
            if case_id:
                query = query.eq("case_id", case_id)
            res = query.order("created_at", desc=True).execute()
            return res.data or []
        except Exception as e:
            logger.error(f"Error fetching actions from Supabase: {e}")
            return []

    def insert_action(self, action_dict: Dict[str, Any]) -> bool:
        if not self.is_connected():
            return False
        try:
            self.client.table("action_packets").insert(action_dict).execute()
            return True
        except Exception as e:
            logger.error(f"Error inserting action into Supabase: {e}")
            return False

    def update_action(self, action_id: str, updates: Dict[str, Any]) -> bool:
        if not self.is_connected():
            return False
        try:
            self.client.table("action_packets").update(updates).eq("action_id", action_id).execute()
            return True
        except Exception as e:
            logger.error(f"Error updating action in Supabase: {e}")
            return False

    # Audit Events
    def log_audit_event(self, event_dict: Dict[str, Any]) -> bool:
        if not self.is_connected():
            return False
        try:
            self.client.table("audit_events").insert(event_dict).execute()
            return True
        except Exception as e:
            logger.error(f"Error logging audit event in Supabase: {e}")
            return False

supabase_service = SupabaseService()
