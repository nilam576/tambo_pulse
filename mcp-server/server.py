"""
Tambo Pulse MCP Server
"""

from mcp.server.fastmcp import FastMCP
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import json
import os
from datetime import datetime

# Initialize FastMCP
mcp = FastMCP("tambo-pulse-medical")

def log_debug(msg):
    try:
        log_file = os.path.join(os.path.dirname(__file__), "mcp_debug.log")
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(f"[{datetime.now().isoformat()}] {msg}\n")
    except:
        pass
    print(msg)

# In-memory store for cohorts
MEMORY_STORE = {}

# Load patient data at startup
DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "patients.json")

try:
    with open(DATA_PATH, "r") as f:
        PATIENTS = json.load(f)
    patients_df = pd.DataFrame(PATIENTS)
    log_debug(f"✅ Loaded {len(PATIENTS):,} patient records")
    if not patients_df.empty:
        log_debug(f"📊 Data Stats: Max Risk={patients_df['risk_score'].max()}, Count >= 0.7: {len(patients_df[patients_df['risk_score'] >= 0.7])}")
except Exception as e:
    log_debug(f"⚠️  Error loading patients.json: {e}")
    PATIENTS = []
    patients_df = pd.DataFrame()

@mcp.tool(
    name="get_patient_clinical_data",
    description="""Fetches clinical records for hospital population. 
    Handles 10,000+ rows efficiently using Tambo Memory Store.""",
)
async def get_patient_clinical_data(
    department: str | None = None,
    risk_threshold: float | None = None,
):
    log_debug(f"🛠️  TOOL CALL RAW: dept={department} ({type(department)}), risk={risk_threshold} ({type(risk_threshold)})")
    
    if patients_df.empty:
        log_debug("⚠️  Dataframe is empty!")
        return {"error": "No data", "memory_key": None}
    
    log_debug(f"📊 Dataset Sample Row: {patients_df.iloc[0].to_dict()}")
    log_debug(f"🏥 Unique Depts: {patients_df['department'].unique().tolist()[:5]}...")

    filtered = patients_df.copy()
    
    # Robust Type Handling
    try:
        if department:
            dept_str = str(department).strip()
            # Handle "all" keywords
            if dept_str.lower() in ["all", "any", "everything", "none", "null"]:
                log_debug("ℹ️  Treating 'all' department as None")
                pass
            else:
                filtered = filtered[filtered["department"].str.contains(dept_str, case=False, na=False)]
                log_debug(f"🔍 Filtered by department containing '{dept_str}': {len(filtered)} records left")
        
        if risk_threshold is not None:
            try:
                rt = float(risk_threshold)
                # Handle 0-100 scale cases
                threshold = rt / 100.0 if rt > 1.0 else rt
                filtered = filtered[filtered["risk_score"] >= threshold]
                log_debug(f"🔍 Filtered by risk >= {threshold}: {len(filtered)} records left")
            except ValueError:
                log_debug(f"⚠️  Invalid risk_threshold type: {type(risk_threshold)}")
    except Exception as e:
        log_debug(f"❌ Filtering Error: {e}")

    if len(filtered) == 0:
        log_debug("⚠️  Result is 0. Sample data head:")
        log_debug(str(patients_df[["department", "risk_score"]].head()))
    
    memory_key = f"patients_{datetime.now().strftime('%H%M%S')}"
    
    data_to_store = {
        "data": filtered.to_dict(orient="records"),
        "count": len(filtered),
        "summary": {
            "avg_risk": round(filtered["risk_score"].mean(), 3) if len(filtered) > 0 else 0,
            "high_risk_count": len(filtered[filtered["risk_score"] >= 0.7]) if len(filtered) > 0 else 0,
        }
    }
    
    MEMORY_STORE[memory_key] = json.dumps(data_to_store)
    log_debug(f"✅ Created memory_key: {memory_key} with {len(filtered)} records")
    
    return {
        "memory_key": memory_key,
        "count": len(filtered)
    }

@mcp.resource("memory://{key}")
def get_memory_resource(key: str) -> str:
    print(f"📂 RESOURCE FETCH: memory://{key}")
    return MEMORY_STORE.get(key, "{}")

@mcp.tool(
    name="get_department_summary",
    description="Get aggregated statistics by department.",
)
async def get_department_summary():
    print("🛠️  TOOL CALL: get_department_summary()")
    if patients_df.empty:
        return {"error": "No data"}
    
    summary = []
    for dept in patients_df["department"].unique():
        dept_df = patients_df[patients_df["department"] == dept]
        summary.append({
            "department": dept,
            "total_patients": len(dept_df),
            "avg_risk": round(dept_df["risk_score"].mean(), 3),
            "high_risk_count": len(dept_df[dept_df["risk_score"] >= 0.7]),
        })
    
    memory_key = f"dept_summary_{datetime.now().strftime('%H%M%S')}"
    data_to_store = {
        "data": sorted(summary, key=lambda x: x["avg_risk"], reverse=True)
    }
    MEMORY_STORE[memory_key] = json.dumps(data_to_store)
    
    print(f"✅ Summary generated, memory_key: {memory_key}")
    return {
        "memory_key": memory_key
    }

from starlette.applications import Starlette
from starlette.routing import Route, Mount
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

# Health check handler
async def health_check(request):
    return JSONResponse({"status": "healthy"})

# Use manual Starlette app construction for precise routing control
app = Starlette(
    routes=[
        Route("/health", health_check),
        # Bypass mcp.sse_app() validation and route directly to the endpoint handler
        Route("/sse", mcp._sse_handler), 
    ],
    middleware=[
        Middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    ]
)

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    print(f"🚀 Starting Tambo Pulse MCP Server on port {port}")
    # proxy_headers=True is critical for Render
    uvicorn.run(app, host="0.0.0.0", port=port, proxy_headers=True, forwarded_allow_ips="*")
