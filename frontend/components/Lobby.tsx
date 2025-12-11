"use client";

import { motion } from "framer-motion";
import { Globe, Crosshair } from "lucide-react";
import { useState } from "react";

const CITIES = [
    { name: "New York", lat: 40.7128, lon: -74.0060 },
    { name: "London", lat: 51.5074, lon: -0.1278 },
    { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
    { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
];

interface LobbyProps {
    onLaunch: (lat: number, lon: number) => void;
}

export default function Lobby({ onLaunch }: LobbyProps) {
    const [selectedCity, setSelectedCity] = useState(CITIES[0]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-8 relative overflow-hidden"
            >
                {/* Decor: glowing line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 mb-4 border border-cyan-500/30 text-cyan-400">
                        <Globe className="w-8 h-8 animate-pulse" />
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-widest text-slate-100 mb-2">Sky-Link V2</h1>
                    <p className="text-slate-400 text-sm">Virtual Drone Telemetry Simulator</p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Select Target Zone</label>
                        <div className="grid grid-cols-2 gap-3">
                            {CITIES.map((city) => (
                                <button
                                    key={city.name}
                                    onClick={() => setSelectedCity(city)}
                                    className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${selectedCity.name === city.name
                                            ? "bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                                            : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                                        }`}
                                >
                                    {city.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-xl border border-dotted border-slate-800 text-center font-mono text-xs text-slate-500">
                        COORD: {selectedCity.lat.toFixed(4)}, {selectedCity.lon.toFixed(4)}
                    </div>

                    <button
                        onClick={() => onLaunch(selectedCity.lat, selectedCity.lon)}
                        className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl uppercase tracking-widest shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 group"
                    >
                        <Crosshair className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                        Launch Mission
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
