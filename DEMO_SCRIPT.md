# Tambo Pulse - Demo Script 🎭

## 🎬 Act 1: The Setup
*(Screen shows the empty Tambo Pulse dashboard with "MCP Connected" badge green)*

**Narrator:** "In a busy hospital, data is often a burden. Today, we're looking at **Tambo Pulse**, a medical command center powered by Tambo's Generative UI."

## 🎬 Act 2: Population Overview
**Query:** `Show me all high-risk ICU patients`

**Key Points to Show:**
- Smooth scroll through the virtualized table.
- Highlight the **10,000 records** handled via Memory Store.
- Mention: *"The AI hasn't read all 10k records—it's using the Tambo Memory Store to handle population-scale data safely."*

## 🎬 Act 3: Visual Analytics
**Query:** `Show me the risk distribution across departments`

**Key Points to Show:**
- `RiskHeatmap` component appearing instantly.
- Tooltip interaction (hovering over ICU/ER bars).
- Mention: *"Tambo decided a bar chart was the optimal way to visualize this distribution based on my intent."*

## 🎬 Act 4: The Magic Moment (State Roundtrip)
**Query:** `What if we reduce staffing to handle budget cuts?`

**Key Points to Show:**
- `TreatmentSimulator` renders with sliders at 100%.
- **Action:** Drag "Staffing Level" down to 60%.
- **Action:** Drag "Bed Availability" down to 20%.
- **Observation:** Notice the console log/system message: *"I've updated the resource levels... recalculating risk."*
- Mention: *"This is the state roundtrip. As I move the slider, the UI sends a system message back to the AI, allowing it to provide real-time clinical recommendations."*

## 🎬 Act 5: Conclusion
**Narrator:** "Tambo Pulse turns static data into a conversation. From 10,000 records to a single simulation, the UI adapts to the mission. Thank you."

---

## 🚦 DO's and DON'Ts
- **DO**: Show the "10,000 Records" count in the header.
- **DO**: Scroll fast through the table to show performance.
- **DON'T**: Click outside the sliders during the simulation.
- **DON'T**: Type too fast—let the transitions finish.
