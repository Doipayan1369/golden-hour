# Golden Hour — Cybercrime Cash-Out Intelligence Console

> **Smart India Hackathon | SIH26184 / Problem ID 26184**  
> **Target Organization:** Ministry of Home Affairs — Indian Cyber Crime Coordination Centre (I4C), CIS Division  
> **Product Promise:** Turn an authorized fraud transaction trail into an explainable, time-sensitive geographic priority for investigators, banks, and local police — without claiming certainty or replacing human judgment.

---

## ⚡ Quick Start

### 1-Click Launch (Windows)
Double-click `start_golden_hour.bat` in the project root, or execute:

```powershell
# Terminal 1: Backend
.\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload

# Terminal 2: Frontend
cd frontend
npm run dev
```

- **Frontend Console:** [http://localhost:5173](http://localhost:5173)
- **Interactive OpenAPI Documentation:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🛡️ Core Architecture & PRD Non-Negotiables

1. **Secret Service / Military HUD Aesthetics:** Obsidian-slate palette, high contrast, clean monospaced telemetry fonts, radar scanline animations, and zero-friction officer workflow.
2. **Deterministic Multi-Hop Graph Traversal:** Analyzes transaction velocity (minutes between hops), fan-in/fan-out, and pass-through split ratios across `Confirmed`, `Pending`, and `Unavailable` states.
3. **Spatial Cash-Out Forecasting (DBSCAN + Time Decay):** Predicts top-3 ATM withdrawal clusters with $\ge 3$ factor attributions, time windows, and uncertainty radii ($r \approx 1400\text{m} - 2100\text{m}$).
4. **Human-in-the-Loop Response Dispatch:** Generates digitally-signed Action Packets for local beat units and bank nodal desks with mandatory officer authorization.
5. **SHA-256 Tamper-Evident Audit Ledger:** Cryptographically chained event log (`Genesis -> Ingestion -> Hop Reveal -> Forecast -> Dispatch -> Validation`) with real-time integrity verification.
6. **5-Minute Incident Replay Simulator:** Step-by-step playback of primary scenario `CASE-2026-041` proving a 15-minute advance warning before physical ATM cash-out.
7. **Zero-PII Privacy Compliance:** All citizen accounts, phone numbers, and victim identifiers are tokenized and masked across all views.

---

## 🧪 Automated Test Verification

Run all test suites with pytest:

```powershell
.\.venv\Scripts\python.exe -m pytest backend/tests/ -v
```

Includes tests for:
- Health check & triage endpoints
- Mule-risk graph analysis & behavioral scoring
- Spatial forecast clustering & factor presence ($\ge 3$)
- SHA-256 cryptographic chain validation
- 6-stage deterministic scenario progression
- Zero-PII masking compliance
