import { TelemetryData } from "@/types";
import { Battery, ArrowUp, Zap, Activity } from "lucide-react";

interface TelemetryPanelProps {
    telemetry: TelemetryData | null;
}

export default function TelemetryPanel({ telemetry }: TelemetryPanelProps) {
    if (!telemetry) return null;

    const getBatteryColor = (level: number) => {
        if (level > 50) return "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]";
        if (level > 20) return "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]";
        return "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]";
    };

    return (
        <div className="flex flex-col gap-4 font-mono text-slate-100 w-full">
            {/* Status Card */}
            <div className={`p-4 rounded-xl border border-opacity-50 shadow-lg backdrop-blur-md transition-all ${telemetry.status === "RECHARGING"
                    ? "bg-yellow-500/10 border-yellow-500"
                    : "bg-slate-900/80 border-cyan-500/30"
                }`}>
                <h3 className="text-[10px] uppercase font-bold tracking-widest mb-1 opacity-70">System Status</h3>
                <div className={`text-2xl font-black tracking-wider flex items-center gap-2 ${telemetry.status === "RECHARGING" ? "text-yellow-400 animate-pulse" : "text-cyan-400"
                    }`}>
                    {telemetry.status === "RECHARGING" && <Zap className="w-6 h-6" />}
                    {telemetry.status}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {/* Altitude */}
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700 relative overflow-hidden backdrop-blur-sm">
                    <h3 className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                        <ArrowUp className="w-3 h-3" /> Altitude
                    </h3>
                    <div className="text-xl font-bold">{telemetry.altitude.toFixed(0)} <span className="text-sm font-normal text-slate-600">m</span></div>
                </div>

                {/* Speed */}
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700 backdrop-blur-sm">
                    <h3 className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                        <Activity className="w-3 h-3" /> Speed
                    </h3>
                    <div className="text-xl font-bold">{telemetry.speed.toFixed(0)} <span className="text-sm font-normal text-slate-600">km/h</span></div>
                </div>
            </div>

            {/* Battery */}
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700 backdrop-blur-sm">
                <h3 className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                    <Battery className="w-3 h-3" /> Power Cell
                </h3>
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${getBatteryColor(telemetry.battery_level)} transition-all duration-300`}
                            style={{ width: `${telemetry.battery_level}%` }}
                        />
                    </div>
                    <span className="text-sm font-bold w-12 text-right">{telemetry.battery_level.toFixed(0)}%</span>
                </div>
            </div>
        </div>
    );
}
