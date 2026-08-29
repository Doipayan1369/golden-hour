import hashlib
import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from ..schemas.models import AuditEvent, AuditVerification

GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000"

class AuditService:
    def __init__(self):
        self.events: List[AuditEvent] = []
        self._initialize_genesis()

    def _initialize_genesis(self):
        if not self.events:
            ts = "2026-08-27T10:00:00+05:30"
            payload = {"system": "Golden Hour Core", "message": "Genesis Ledger Initialized"}
            p_hash = self.compute_payload_hash(payload)
            case_id = "GLOBAL"
            actor_id = "SYSTEM_ROOT"
            action = "INITIALIZE_LEDGER"
            e_hash = self.compute_event_hash(GENESIS_HASH, case_id, actor_id, action, ts, p_hash)
            genesis_event = AuditEvent(
                audit_id="AUDIT-0000",
                case_id=case_id,
                actor_id=actor_id,
                actor_role="SYSTEM",
                action=action,
                timestamp=ts,
                payload_summary=payload,
                payload_hash=p_hash,
                previous_hash=GENESIS_HASH,
                event_hash=e_hash
            )
            self.events.append(genesis_event)

    def compute_payload_hash(self, payload: Dict[str, Any]) -> str:
        serialized = json.dumps(payload, sort_keys=True, default=str)
        return hashlib.sha256(serialized.encode("utf-8")).hexdigest()

    def compute_event_hash(self, prev_hash: str, case_id: str, actor: str, action: str, ts: str, p_hash: str) -> str:
        raw = f"{prev_hash}|{case_id}|{actor}|{action}|{ts}|{p_hash}"
        return hashlib.sha256(raw.encode("utf-8")).hexdigest()

    def log_event(self, case_id: str, actor_id: str, actor_role: str, action: str, payload: Dict[str, Any], custom_ts: Optional[str] = None) -> AuditEvent:
        prev_hash = self.events[-1].event_hash if self.events else GENESIS_HASH
        timestamp = custom_ts or datetime.now().isoformat()
        p_hash = self.compute_payload_hash(payload)
        e_hash = self.compute_event_hash(prev_hash, case_id, actor_id, action, timestamp, p_hash)

        event = AuditEvent(
            audit_id=f"AUDIT-{len(self.events):04d}",
            case_id=case_id,
            actor_id=actor_id,
            actor_role=actor_role,
            action=action,
            timestamp=timestamp,
            payload_summary=payload,
            payload_hash=p_hash,
            previous_hash=prev_hash,
            event_hash=e_hash
        )
        self.events.append(event)
        return event

    def get_events(self, case_id: Optional[str] = None) -> List[AuditEvent]:
        if case_id and case_id != "ALL":
            return [e for e in self.events if e.case_id == case_id or e.case_id == "GLOBAL"]
        return self.events

    def verify_chain(self) -> AuditVerification:
        if not self.events:
            return AuditVerification(
                total_events=0,
                chain_valid=True,
                genesis_hash=GENESIS_HASH,
                latest_hash=GENESIS_HASH,
                verified_at=datetime.now().isoformat()
            )

        is_valid = True
        for i in range(len(self.events)):
            evt = self.events[i]
            expected_prev = GENESIS_HASH if i == 0 else self.events[i - 1].event_hash
            if evt.previous_hash != expected_prev:
                is_valid = False
                break
            
            p_hash = self.compute_payload_hash(evt.payload_summary)
            recalculated_hash = self.compute_event_hash(
                evt.previous_hash, evt.case_id, evt.actor_id, evt.action, evt.timestamp, p_hash
            )
            if evt.event_hash != recalculated_hash:
                is_valid = False
                break

        return AuditVerification(
            total_events=len(self.events),
            chain_valid=is_valid,
            genesis_hash=self.events[0].event_hash if self.events else GENESIS_HASH,
            latest_hash=self.events[-1].event_hash if self.events else GENESIS_HASH,
            verified_at=datetime.now().isoformat()
        )

audit_service = AuditService()
