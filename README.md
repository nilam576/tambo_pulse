# 🚑 Tambo Pulse: Clinical Command Center

**Tambo Pulse** is a next-generation clinical operations dashboard designed for modern hospital command centers. It leverages **Generative UI** and the **Model Context Protocol (MCP)** to provide real-time patient monitoring, predictive risk analysis, and resource optimization in a high-tech, cinematic interface.

**Powered by Real Open Source Health Data:** HealthData.gov • CDC • CMS Open Data

![Version](https://img.shields.io/badge/version-4.0.2_OS-red)
![Node](https://img.shields.io/badge/Node-Active-emerald)
![Framework](https://img.shields.io/badge/Framework-Next.js%2014-blue)
![Data](https://img.shields.io/badge/Data-Real_Open_Source-blue)

---

## 📽️ Features

### 1. Cinematic Landing Experience
A futuristic entrance to the command center featuring glassmorphism, carbon-fiber textures, and staggered motion-UI animations.

### 2. High-Risk Patient Monitoring (`PatientTable`)
*   **Real Health Data**: Fetches from HealthData.gov, CDC, and CMS Open Data APIs.
*   **Virtualized Performance**: Optimized for 10,000+ records using `@tanstack/react-virtual`.
*   **Intelligent Recovery**: If the AI forgets to structure its response, the dashboard automatically scans the message for memory keys and recovers the visualizer.
*   **Risk Scoring**: Real-time visualization of patient risk levels (0-100%) based on real clinical statistics.

### 3. Department Analytics (`RiskHeatmap`)
*   **Distribution Analysis**: Visualizes average risk scores across hospital departments (ICU, ER, Neurology, etc.).
*   **Real Data Integration**: Aggregates statistics from open source health datasets.

### 4. Unit Resource Optimizer (`TreatmentSimulator`)
*   **"What-If" Analysis**: Simulate the impact of staffing levels and bed availability on patient safety.
*   **Predictive Metrics**: Real-time calculation of Risk Index and Patient Experience (PX) scores.

---

## 🛠️ The Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Recharts.
- **AI Core**: `@tambo-ai/react`, `@tambo-ai/react/mcp`.
- **Backend (MCP Server)**: Python, FastAPI mcp-server-fastmcp, Pandas.
- **Data Sources**: 
  - HealthData.gov Hospital Capacity Data
  - CDC Disease Surveillance
  - CMS Medicare Open Data
  - Real clinical statistics with ICD-10 diagnosis codes

---

## 🚀 Deployment Guide

### 1. Backend (MCP Server on Render) - Optional
The dashboard works **without** the MCP server using real open source health data.

- **Repo Root**: `mcp-server/`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python server.py`
- **Environment Variables**:
  - `PORT`: 8000

### 2. Frontend (Next.js on Vercel)
- **Framework**: Next.js
- **Environment Variables**:
  - `NEXT_PUBLIC_TAMBO_API_KEY`: Your Tambo project key.
  - `NEXT_PUBLIC_MCP_SERVER_URL`: `https://your-backend.onrender.com/mcp/sse` (optional)

---

## 👥 Team

- **MotionViz** - Creative Lead
- **Nilam** - Technical Developer

---

## 🛠️ Real Data Mode

The dashboard operates in **Real Data Mode** by default, fetching live health statistics from:

- **HealthData.gov**: Hospital capacity and utilization metrics
- **CDC**: Disease surveillance and epidemiological data  
- **CMS**: Medicare/Medicaid quality and cost data

Even when the MCP server is unavailable, the dashboard continues to display real open source health data with:
- 500+ patient records based on real hospital admission patterns
- Accurate ICD-10 diagnosis codes with proper prevalence weights
- Realistic vital signs and risk calculations
- Department distributions based on actual hospital data

---

## 📝 Authorized Access
> **Note**: Version 4.0.2_OS is intended for authorized clinical personnel only. All interactions are logged via the Tambo Protocol.

© 2026 Tambo Medical Systems
