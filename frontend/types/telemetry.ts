export type DroneStatus = "FLYING" | "RETURN_TO_HOME" | "LANDED";

export interface DroneTelemetry {
    latitude: number;
    longitude: number;
    altitude: number; // meters
    speed: number; // km/h
    battery_level: number; // percentage 0-100
    status: DroneStatus;
}
