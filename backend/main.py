import asyncio
import json
import math
import random
from datetime import datetime
from enum import Enum
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DroneStatus(str, Enum):
    FLYING = "FLYING"
    RECHARGING = "RECHARGING"
    IDLE = "IDLE"

# Drone Simulation State
class DroneState:
    def __init__(self):
        self.center_lat = 0.0
        self.center_lon = 0.0
        self.radius = 0.005 # Approx 500m
        self.angle = 0
        self.altitude = 0.0
        self.speed = 0.0
        self.battery = 100.0
        self.status = DroneStatus.IDLE
        self.last_update = datetime.now()
        
        # Physics Constants
        self.DRAIN_RATE = 1.0 # 1% per tick (accelerated)
        self.CHARGE_RATE = 5.0 # 5% per tick
        self.FLYING_SPEED = 60.0 # km/h
        self.FLYING_ALTITUDE = 120.0 # meters

    def start_mission(self, lat: float, lon: float):
        self.center_lat = lat
        self.center_lon = lon
        self.status = DroneStatus.FLYING
        self.battery = 100.0
        self.altitude = self.FLYING_ALTITUDE
        self.speed = self.FLYING_SPEED
        self.last_update = datetime.now()
        print(f"Mission Started at {lat}, {lon}")

    def update(self):
        if self.status == DroneStatus.IDLE:
            return

        now = datetime.now()
        delta = (now - self.last_update).total_seconds()
        # Cap delta to avoid huge jumps if thread sleeps
        if delta > 1.0: delta = 1.0 
        self.last_update = now

        if self.status == DroneStatus.FLYING:
            # 1. Move
            self.angle += 0.5 * delta
            self.latitude = self.center_lat + (self.radius * math.sin(self.angle))
            self.longitude = self.center_lon + (self.radius * math.cos(self.angle))
            
            # 2. Altitude Noise
            noise = random.uniform(-0.5, 0.5)
            self.altitude = max(10, self.altitude + noise)
            
            # 3. Drain Battery
            self.battery -= self.DRAIN_RATE * delta
            
            # 4. Check for Critical Battery
            if self.battery <= 0:
                self.battery = 0
                self.status = DroneStatus.RECHARGING
                self.speed = 0
                self.altitude = 0 # Landed
                print("Battery Empty! Initiating Recharge...")

        elif self.status == DroneStatus.RECHARGING:
            # 1. Charge
            self.battery += self.CHARGE_RATE * delta
            
            # 2. Check for Full Charge
            if self.battery >= 100:
                self.battery = 100
                self.status = DroneStatus.FLYING
                self.speed = self.FLYING_SPEED
                self.altitude = self.FLYING_ALTITUDE
                print("Recharged! Resuming Flight.")

simulate_drone = DroneState()

@app.websocket("/ws/simulation")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Check for incoming messages (non-blocking)
            try:
                # We use a very short timeout to check for messages without blocking the physics loop too much
                # Ideally, this would be a separate task, but for MVP this works.
                data = await asyncio.wait_for(websocket.receive_text(), timeout=0.01)
                msg = json.loads(data)
                if msg.get("action") == "LAUNCH":
                    simulate_drone.start_mission(msg.get("lat"), msg.get("lon"))
            except asyncio.TimeoutError:
                pass
            except Exception as e:
                print(f"Error receiving: {e}")
                break

            # Physics Loop
            simulate_drone.update()
            
            # Prepare Payload
            telemetry = {
                "latitude": getattr(simulate_drone, "latitude", 0),
                "longitude": getattr(simulate_drone, "longitude", 0),
                "altitude": round(simulate_drone.altitude, 2),
                "speed": round(simulate_drone.speed, 2),
                "battery_level": round(simulate_drone.battery, 1),
                "status": simulate_drone.status
            }
            
            await websocket.send_json(telemetry)
            await asyncio.sleep(0.1) # 10Hz Tick

    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"Connection error: {e}")
