import sys
import os
import json
import logging
import pandas as pd
from datetime import datetime
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

# --- CRITICAL EMERGENCY MONKEY-PATCH ---
# We MUST patch the MCP SDK before it even starts to prevent the 421 Misdirected Request errors on Render.
try:
    from mcp.server.transport_security import TransportSecurityMiddleware
    TransportSecurityMiddleware._validate_host = lambda self, host: True
    TransportSecurityMiddleware._validate_origin = lambda self, origin: True
    print("✅ MCP Security Monkey-patch applied successfully")
except Exception as e:
    print(f"⚠️  Monkey-patch failed: {e}")

from mcp.server.fastmcp import FastMCP

# Initialize FastMCP
mcp = FastMCP("tambo-pulse-medical")

def log_debug(msg):
    # Only print to stdout for Render/Cloud platforms to avoid I/O bottlenecks
    print(f"DEBUG: {msg}")

# In-memory store for cohorts
MEMORY_STORE = {}

# Load patient data at startup
DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "patients.json")

try:
    with open(DATA_PATH, "r") as f:
        data = json.load(f)
    # Ensure data is a list of native Python dicts
    PATIENTS = data if isinstance(data, list) else []
    patients_df = pd.DataFrame(PATIENTS)
    log_debug(f"✅ Loaded {len(PATIENTS):,} patient records")
except Exception as e:
    log_debug(f"⚠️  Error loading patients.json: {e}")
    PATIENTS = []
    patients_df = pd.DataFrame()

@mcp.tool(
    name="ping_medical_server",
    description="Verify connectivity to the medical data node.",
)
async def ping_medical_server():
    return {"status": "online", "source": "tambo-pulse-medical-node"}

@mcp.tool(
    name="get_patient_clinical_data",
    description="""Fetches clinical records for hospital population. 
    Supports filtering by department, risk, and vital signs.""",
)
async def get_patient_clinical_data(
    department: str | None = None,
    risk_threshold: float | None = None,
    min_spo2: int | None = None,
    max_hr: int | None = None,
):
    log_debug(f"🛠️  TOOL CALL: dept={department}, risk={risk_threshold}, spo2={min_spo2}, hr={max_hr}")
    
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
                threshold = rt / 100.0 if rt > 1.0 else rt
                filtered = filtered[filtered["risk_score"] >= threshold]
                log_debug(f"🔍 Risk Filter: {len(filtered)} left")
            except: pass

        # Advanced Medical Filters
        if min_spo2 is not None:
            filtered = filtered[filtered["vitals"].apply(lambda x: x.get("spo2", 100)) >= min_spo2]
            log_debug(f"🔍 SPO2 Filter: {len(filtered)} left")
            
        if max_hr is not None:
            filtered = filtered[filtered["vitals"].apply(lambda x: x.get("heart_rate", 0)) <= max_hr]
            log_debug(f"🔍 Heart Rate Filter: {len(filtered)} left")
            
    except Exception as e:
        log_debug(f"❌ Filtering Error: {e}")

    if len(filtered) == 0:
        log_debug("⚠️  Result is 0.")
    
    # Truncate to 10 records for the AI Engine (Ultra-Safe Mode).
    # The browser still gets the full dataset via the Memory Key.
    ai_safe_limit = 10
    truncated = filtered.head(ai_safe_limit)
    
    import uuid
    memory_key = f"patients_{datetime.now().strftime('%H%M%S')}_{uuid.uuid4().hex[:4]}"
    
    # Clean JSON for UI & AI
    json_safe_data_ui = json.loads(filtered.to_json(orient="records"))
    json_safe_data_ai = json.loads(truncated.to_json(orient="records"))
    
    MEMORY_STORE[memory_key] = json.dumps({
        "status": "success",
        "data": json_safe_data_ui,
        "total_count": int(len(filtered))
    })
    
    log_debug(f"✅ Created memory_key: {memory_key} ({len(filtered)} records)")
    
    return {
        "memory_key": memory_key,
        "total_count": int(len(filtered)),
        "data_sample": json_safe_data_ai,
        "note": f"Full dataset of {len(filtered)} patients is available in the UI via the memory_key."
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
    log_debug("🛠️  TOOL CALL: get_department_summary()")
    if patients_df.empty:
        return {"error": "No data"}
    
    summary = []
    for dept in sorted(patients_df["department"].unique()):
        dept_df = patients_df[patients_df["department"] == dept]
        count = len(dept_df)
        avg_risk = float(dept_df["risk_score"].mean()) if count > 0 else 0.0
        # Sanitize NaN
        if pd.isna(avg_risk): avg_risk = 0.0
        
        summary.append({
            "department": str(dept),
            "total_patients": int(count),
            "avg_risk": float(round(avg_risk, 3)),
            "high_risk_count": int(len(dept_df[dept_df["risk_score"] >= 0.7])) if count > 0 else 0,
        })
    
    # Sort for the AI
    summary = sorted(summary, key=lambda x: x["avg_risk"], reverse=True)
    
    memory_key = f"dept_summary_{datetime.now().strftime('%H%M%S')}"
    MEMORY_STORE[memory_key] = json.dumps({"data": summary})
    
    log_debug(f"✅ Summary generated: {len(summary)} depts")
    return {
        "memory_key": memory_key,
        "summary_data": summary,
        "description": "Risk distribution across hospital departments."
    }

# --- MCP INTEGRATION ENGINE ---

# Standard FastAPI entry point
app = FastAPI(title="Tambo Pulse MCP Server", redirect_slashes=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- PROXY STABILITY MIDDLEWARE ---
@app.middleware("http")
async def add_streaming_headers(request: Request, call_next):
    # This prevents Render/Vercel proxies from buffering the SSE stream
    response = await call_next(request)
    response.headers["X-Accel-Buffering"] = "no"
    response.headers["Cache-Control"] = "no-cache, no-transform"
    return response

@app.get("/favicon.ico")
@app.get("/favicon.svg")
async def favicon():
    return Response(status_code=204)

@app.get("/")
@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "timestamp": datetime.now().isoformat(),
        "mcp_server": "tambo-pulse-medical",
        "patch": "v2.1"
    }

# --- DIRECT ROUTE INTEGRATION (SOCIALLY CORRECT MOUNTING) ---
# We manually extract the routes from the MCP sub-app and inject them into the main FastAPI router.
# This ensures they are wrapped by our CORSMiddleware and Streaming Middleware.
try:
    mcp_app = mcp.sse_app()
    for route in mcp_app.routes:
        # Prevent duplicates and ensure correct matching
        app.router.routes.append(route)
    log_debug("🚀 MCP Routes (SSE/Messages) integrated directly into main app router")
except Exception as e:
    log_debug(f"⚠️  MCP Integration Error: {e}")

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    print(f"🚀 Starting Tambo Pulse MCP Server on port {port}")
    # proxy_headers=True is mandatory for Render/Cloudflare handshake stability
    uvicorn.run(app, host="0.0.0.0", port=port, proxy_headers=True, forwarded_allow_ips="*")
