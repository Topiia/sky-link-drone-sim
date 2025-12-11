"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { DroneTelemetry } from "@/types/telemetry";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { Plane } from "lucide-react";

// Fix for default Leaflet markers in Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Component to recenter map when drone moves
function MapUpdater({ position }: { position: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(position, map.getZoom(), { animate: true });
    }, [position, map]);
    return null;
}

interface MapDisplayProps {
    telemetry: DroneTelemetry | null;
}

export default function MapDisplay({ telemetry }: MapDisplayProps) {
    const defaultPosition: [number, number] = [40.7128, -74.0060]; // NYC

    const position: [number, number] = telemetry
        ? [telemetry.latitude, telemetry.longitude]
        : defaultPosition;

    return (
        <div className="h-full w-full rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
            <MapContainer
                center={position}
                zoom={15}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <Marker position={position} icon={icon}>
                    <Popup>
                        Sky-Link Drone <br />
                        {telemetry ? `${telemetry.status}` : "Offline"}
                    </Popup>
                </Marker>

                <MapUpdater position={position} />
            </MapContainer>
        </div>
    );
}
