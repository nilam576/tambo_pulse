# 🚑 Tambo Pulse: Clinical Command Center

**Tambo Pulse** is a next-generation clinical operations dashboard designed for modern hospital command centers. It leverages **Generative UI** and the **Model Context Protocol (MCP)** to provide real-time patient monitoring, predictive risk analysis, and resource optimization in a high-tech, cinematic interface.

![Version](https://img.shields.io/badge/version-4.0.2_OS-red)
![Node](https://img.shields.io/badge/Node-Active-emerald)
![Framework](https://img.shields.io/badge/Framework-Next.js%2014-blue)

---

## 📽️ Features

### 1. Cinematic Landing Experience
A futuristic entrance to the command center featuring glassmorphism, carbon-fiber textures, and staggered motion-UI animations.

### 2. High-Risk Patient Monitoring (`PatientTable`)
*   **Virtualized Performance**: Optimized for 10,000+ records using `@tanstack/react-virtual`.
*   **Intelligent recovery**: If the AI forgets to structure its response, the dashboard automatically scans the message for memory keys and recovers the visualizer.
*   **Risk Scoring**: Real-time visualization of patient risk levels (0-100%).

### 3. Department Analytics (`RiskHeatmap`)
*   **Distribution Analysis**: Visualizes average risk scores across hospital departments (ICU, ER, Neurology, etc.).
*   **Direct MCP Integration**: Fetches aggregated statistics directly from the medical MCP server.

### 4. Unit Resource Optimizer (`TreatmentSimulator`)
*   **"What-If" Analysis**: Simulate the impact of staffing levels and bed availability on patient safety.
*   **Predictive Metrics**: Real-time calculation of Risk Index and Patient Experience (PX) scores.

---

## 🛠️ The Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Recharts.
- **AI Core**: `@tambo-ai/react`, `@tambo-ai/react/mcp`.
- **Backend (MCP Server)**: Python, FastAPI mcp-server-fastmcp, Pandas.
- **Data Persistence**: Python MCP Memory Store for handling clinical cohorts.

---

## 🚀 Deployment Guide

### 1. Backend (MCP Server on Render)
- **Repo Root**: `mcp-server/`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python server.py`
- **Environment Variables**:
  - `PORT`: 8000

### 2. Frontend (Next.js on Vercel)
- **Framework**: Next.js
- **Environment Variables**:
  - `NEXT_PUBLIC_TAMBO_API_KEY`: Your Tambo project key.
  - `NEXT_PUBLIC_MCP_SERVER_URL`: `https://your-backend.onrender.com/mcp/sse`

---

## 🛠️ High-Availability Mode
The dashboard is built with a **High-Availability (HA) Strategy**. If the MCP server is unreachable, the components automatically switch to an **Intelligent Demo Mode** to ensure authorized personnel always have a functional interface for briefings.

---

## 📝 Authorized Access
> **Note**: Version 4.0.2_OS is intended for authorized clinical personnel only. All interactions are logged via the Tambo Protocol.

© 2026 Tambo Medical Systems
