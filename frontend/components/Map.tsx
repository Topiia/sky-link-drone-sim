"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { TelemetryData } from "@/types";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Helper to update map view
function MapUpdater({ position }: { position: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(position, map.getZoom(), { animate: true, duration: 1 });
    }, [position, map]);
    return null;
}

// Custom Icons
const droneIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    className: "hue-rotate-180 invert filter" // Simple CSS trick for "Cyberpunk" look (red/inverse)
});

interface MapProps {
    telemetry: TelemetryData | null;
}

export default function Map({ telemetry }: MapProps) {
    // Default to 0,0 if not started (should be covered by Lobby)
    const position: [number, number] = telemetry
        ? [telemetry.latitude, telemetry.longitude]
        : [0, 0];

    if (!telemetry && position[0] === 0) return null; // Don't render if invalid

    return (
        <div className="h-full w-full bg-slate-950 isolate">
            <MapContainer
                center={position}
                zoom={15}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
            >
                {/* Dark Matter CartoDB Layer for Cyberpunk feel */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <Marker position={position} icon={droneIcon}>
                    <Popup className="font-mono text-xs">
                        STATUS: {telemetry?.status} <br />
                        ALT: {telemetry?.altitude.toFixed(1)}m
                    </Popup>
                </Marker>

                <MapUpdater position={position} />
            </MapContainer>
        </div>
    );
}
