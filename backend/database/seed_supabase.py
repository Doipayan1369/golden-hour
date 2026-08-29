import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.app.config import settings
from backend.app.services.supabase_service import supabase_service
from backend.app.database import db

def seed_supabase():
    print("==================================================================")
    print("GOLDEN HOUR - SUPABASE DATABASE SEEDER (SIH26184)")
    print("==================================================================")
    
    status = supabase_service.test_connection()
    print(f"Connection Status: {status['message']}")
    
    if not supabase_service.is_connected():
        print("\n[!] To seed your live Supabase project:")
        print("    1. Set SUPABASE_URL and SUPABASE_KEY in your .env file or environment.")
        print("    2. Execute 'supabase_schema.sql' in the Supabase SQL Editor.")
        print("    3. Re-run this script: python backend/database/seed_supabase.py")
        return

    print("\n[+] Synchronizing seeded records to Supabase...")
    client = supabase_service.client

    try:
        # 1. Police Stations
        print(f" -> Seeding {len(db.police_stations)} Police Stations...")
        for st in db.police_stations:
            client.table("police_stations").upsert(st.model_dump()).execute()

        # 2. ATMs
        print(f" -> Seeding {len(db.atms)} ATMs...")
        for atm in db.atms:
            client.table("atms").upsert(atm.model_dump()).execute()

        # 3. Cases
        print(f" -> Seeding {len(db.cases)} Cases...")
        for c in db.cases.values():
            client.table("cases").upsert(c.model_dump()).execute()

        # 4. Nodes & Edges
        print(" -> Seeding Graph Nodes & Edges...")
        for cid, nodes in db.nodes.items():
            for n in nodes:
                client.table("account_nodes").upsert(n.model_dump()).execute()
        for cid, edges in db.edges.items():
            for e in edges:
                client.table("transaction_edges").upsert(e.model_dump()).execute()

        # 5. Scenarios
        print(f" -> Seeding {len(db.scenarios)} Benchmark Scenarios...")
        for s in db.scenarios:
            client.table("scenario_catalog").upsert(s.model_dump()).execute()

        print("\n[✓] Supabase database successfully seeded and synchronized!")
    except Exception as e:
        print(f"\n[!] Note: If tables do not exist yet, make sure you ran 'supabase_schema.sql' in your Supabase SQL Editor first.\nError: {e}")

if __name__ == "__main__":
    seed_supabase()
