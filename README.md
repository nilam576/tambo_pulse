# Tambo Pulse 🏥

**Generative UI Medical Command Center for High-Stakes Clinical Operations.**

Built for "The UI Strikes Back" Tambo Hackathon.

## 🚀 The Vision
In a medical crisis, every second counts. Traditional hospital dashboards are static, complex, and require manual navigation through thousands of records. **Tambo Pulse** changes the game by using **Generative UI** to dynamically render the exact components a clinical lead needs, based on natural language intent.

## 🛠️ The Problem
- **Data Overload**: Hospitals generate millions of data points; clinical leads only need actionable subsets.
- **Context Switching**: Navigating between tables, charts, and simulations slows down decision-making.
- **LLM Context Limits**: Sending 10,000 patient records to an LLM is impossible.

## 💡 The Solution
Tambo Pulse leverages the **Tambo Generative UI SDK** to solve these challenges:
1.  **Memory Store Strategy**: We handle **10,000+ patient records** by serving them via an MCP backend that stores them in Tambo's high-performance Memory Store. The LLM only sees a `memoryKey`, never the raw data.
2.  **Generative UI**: AI decides when to show a virtualized `PatientTable`, a `RiskHeatmap`, or a `TreatmentSimulator`.
3.  **State Roundtrip**: Our custom components (like the Simulator) feed user adjustments back to the AI in real-time, triggering automated risk recalculations.

## 🏗️ Architecture
```text
[ User Prompt ] <---> [ Tambo SDK (React) ] <---> [ FastMCP (Python) ]
  "Show high risk"          |                          |
                            +---> [ Memory Store ] <---+ [ 10k Records ]
                                    (patients.json)
```

## 🌟 Technical Highlights
- **MCP (Model Context Protocol)**: Python backend serving real-time medical data via SSE.
- **Virtualized Rendering**: `TanStack Virtual` handles thousands of rows with 60fps performance.
- **Zod-Powered Schemas**: Type-safe component props that the AI understands perfectly.
- **Real-time Feedback**: System-level messages allow UI components to "talk back" to the AI.

## 🚦 Quick Start

### 1. Prerequisites
- Node.js 18+
- Python 3.10+
- Tambo API Key

### 2. Backend Setup
```bash
cd mcp-server
pip install -r requirements.txt
python data/generate_patients.py  # Generates 10k records
python server.py                  # Starts backend on :8000
```

### 3. Frontend Setup
```bash
npm install
npm run dev                       # Starts dashboard on :3000
```

## 🧪 Demo Flow
1.  **"Show all high-risk ICU patients"** -> Renders `PatientTable` with 400+ rows.
2.  **"Show risk distribution by department"** -> Renders `RiskHeatmap`.
3.  **"What if we reduce staffing?"** -> Renders `TreatmentSimulator`.
4.  **Adjust Sliders** -> AI automatically responds with updated medical recommendations.

## 🛡️ Why Tambo?
Tambo allowed us to build a complex medical interface in hours instead of weeks. By decoupling the UI logic from the data handling, we created an interface that feels like a "Protocol Droid" for hospital management.

---

**Tambo Hackathon 2024** • May the components be with you.
