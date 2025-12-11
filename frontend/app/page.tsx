"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { TelemetryData } from "@/types";
import TelemetryPanel from "@/components/TelemetryPanel";
import Lobby from "@/components/Lobby";
import { Activity, Wifi, WifiOff, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Dynamic optimized map import
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-950 animate-pulse" />,
});

const WS_URL = "ws://localhost:8000/ws/simulation";

export default function Home() {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [connected, setConnected] = useState(false);
  const [inLobby, setInLobby] = useState(true);

  const ws = useRef<WebSocket | null>(null);

  // Initialize WebSocket on Load
  useEffect(() => {
    const connect = () => {
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = () => {
        console.log("Connected to Simulation Core");
        setConnected(true);
      };

      ws.current.onmessage = (event) => {
        try {
          const data: TelemetryData = JSON.parse(event.data);
          // Only start showing Dashboard if we receive valid non-idle data OR if we explicitly launched?
          // Actually, the backend starts as IDLE.
          setTelemetry(data);
        } catch (err) {
          console.error("Telemetry Parse Error", err);
        }
      };

      ws.current.onclose = () => {
        setConnected(false);
        setTimeout(connect, 2000); // Auto-reconnect
      };
    };
    connect();
    return () => ws.current?.close();
  }, []);

  const handleLaunch = (lat: number, lon: number) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      alert("Simulation Core Offline. Cannot Launch.");
      return;
    }
    // Send Launch Command
    ws.current.send(JSON.stringify({ action: "LAUNCH", lat, lon }));

    // Transition UI
    setInLobby(false);
  };

  return (
    <main className="h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden relative font-sans selection:bg-cyan-500/30">

      {/* Lobby Overlay */}
      <AnimatePresence>
        {inLobby && <Lobby onLaunch={handleLaunch} />}
      </AnimatePresence>

      {/* Dashboard Layer (Always rendered behind, but interactive only when active) */}
      <div className={`h-full w-full flex flex-col transition-all duration-1000 ${inLobby ? "blur-sm scale-95 opacity-50 pointer-events-none" : "blur-0 scale-100 opacity-100"}`}>

        {/* Header */}
        <header className="h-14 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 z-20 shadow-xl">
          <div className="flex items-center gap-3">
            <Activity className="text-cyan-500 w-5 h-5" />
            <span className="font-bold tracking-widest text-slate-200">SKY-LINK <span className="text-cyan-500">V2</span></span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            {connected
              ? <span className="text-green-400 flex items-center gap-2"><Wifi className="w-4 h-4" /> ONLINE</span>
              : <span className="text-red-500 flex items-center gap-2"><WifiOff className="w-4 h-4" /> OFFLINE</span>
            }
          </div>
        </header>

        {/* Main Area */}
        <div className="flex-1 relative">
          {/* Map Layer */}
          <div className="absolute inset-0 z-0">
            <Map telemetry={telemetry} />
          </div>

          {/* HUD Overlay (Desktop Sidebar) */}
          <div className="absolute top-4 left-4 z-10 w-80">
            <TelemetryPanel telemetry={telemetry} />
          </div>

          {/* Emergency Overlay */}
          <AnimatePresence>
            {!connected && !inLobby && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center"
              >
                <div className="text-center">
                  <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
                  <h2 className="text-2xl font-black text-red-500 uppercase tracking-widest">Signal Lost</h2>
                  <p className="text-red-400 font-mono text-sm mt-2">Reconnecting to Core...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
