# Sky-Link: Virtual Drone Telemetry Simulator

## 🚀 Overview
**Sky-Link** is a production-grade Virtual Drone Telemetry Simulator. It features a Python-based physics engine that simulates autonomous drone flight paths and streams real-time telemetry (Altitude, Speed, Battery, GPS) to a "Cyberpunk Aviation" styled Next.js dashboard via WebSockets.

## 🛠️ Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, React-Leaflet
- **Backend**: Python, FastAPI, WebSockets
- **Design**: "Cyberpunk Aviation" (Neon Cyan/Slate Dark Mode)

## ✨ Features
- **Mission Lobby**: Select global targets (New York, Tokyo, London, Mumbai).
- **Smart Simulation**: Physics-based flight paths and auto-recharging logic.
- **Real-Time HUD**: Live telemetry data visualization.
- **Resilient Connectivity**: Automatic reconnection handling.

## 🏁 Getting Started

### 1. Backend (Simulation Core)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
*Runs on Port 8000*

### 2. Frontend (Mission Control)
```bash
cd frontend
npm install
npm run dev
```
*Runs on http://localhost:3000*

## 🎮 How to Use
1. Launch both Backend and Frontend.
2. Open the dashboard.
3. Select a city in the **Mission Lobby**.
4. Click **Launch Mission**.
5. Watch the drone fly! If the battery hits 0%, it will automatically enter a `RECHARGING` state before resuming flight.
