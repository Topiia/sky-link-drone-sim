export type DroneStatus = "FLYING" | "RECHARGING" | "IDLE";

export interface TelemetryData {
    latitude: number;
    longitude: number;
    altitude: number; // meters
    speed: number; // km/h
    battery_level: number; // percentage 0-100
    status: DroneStatus;
}
