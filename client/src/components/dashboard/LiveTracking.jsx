import {
    MapPinned,
    Truck,
    Navigation,
    Clock3,
    RefreshCw,
} from "lucide-react";

import { useEffect, useState } from "react";

import Card from "../common/Card";

import {
    getLiveTracking,
} from "../../services/api";


function LiveTracking() {

    const [vehicles, setVehicles] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [lastUpdated, setLastUpdated] =
        useState(null);


    // -----------------------------------------------------
    // FETCH LIVE TRACKING
    // -----------------------------------------------------

    const fetchLiveTracking = async () => {

        try {

            setError("");

            const response =
                await getLiveTracking();


            if (!response?.success) {

                throw new Error(
                    response?.message ||
                    "Failed to load live tracking"
                );

            }


            const data =
                Array.isArray(response.data)
                    ? response.data
                    : [];


            setVehicles(data);

            setLastUpdated(
                new Date()
            );


        } catch (err) {

            console.error(
                "Live tracking error:",
                err
            );

            setError(
                err?.message ||
                "Unable to load live tracking"
            );


        } finally {

            setLoading(false);

        }

    };


    // -----------------------------------------------------
    // INITIAL LOAD + POLLING
    // -----------------------------------------------------

    useEffect(() => {

        fetchLiveTracking();


        const interval =
            setInterval(
                fetchLiveTracking,
                15000
            );


        return () => {
            clearInterval(interval);
        };

    }, []);


    // -----------------------------------------------------
    // MAP POSITIONS
    // -----------------------------------------------------

    const positions = [
        "left-[22%] top-[60%]",
        "left-[55%] top-[30%]",
        "left-[70%] top-[68%]",
        "left-[40%] top-[45%]",
        "left-[32%] top-[25%]",
        "left-[78%] top-[38%]",
    ];


    // -----------------------------------------------------
    // VEHICLE NAME
    // -----------------------------------------------------

    const getVehicleName = (vehicle) => {

        return (
            vehicle.vehicle_number ||
            vehicle.vehicleNumber ||
            vehicle.vehicle ||
            `Vehicle ${vehicle.vehicle_id || ""}`
        );

    };


    // -----------------------------------------------------
    // DRIVER NAME
    // -----------------------------------------------------

    const getDriverName = (vehicle) => {

        if (vehicle.driver_name) {
            return vehicle.driver_name;
        }

        if (
            vehicle.driver_first_name ||
            vehicle.driver_last_name
        ) {

            return [
                vehicle.driver_first_name,
                vehicle.driver_last_name,
            ]
                .filter(Boolean)
                .join(" ");

        }

        return (
            vehicle.driver ||
            "Unknown driver"
        );

    };


    // -----------------------------------------------------
    // LAST UPDATE TEXT
    // -----------------------------------------------------

    const getUpdateText = () => {

        if (loading) {
            return "Loading...";
        }

        if (!lastUpdated) {
            return "No update";
        }

        return lastUpdated.toLocaleTimeString();

    };


    return (

        <Card
            title="Live Tracking"
            description="Active vehicles and shipment routes"
            action={

                <button
                    type="button"
                    onClick={fetchLiveTracking}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 text-[10px] font-medium text-blue-400 hover:text-blue-300 disabled:opacity-50"
                >

                    <RefreshCw
                        size={11}
                        className={
                            loading
                                ? "animate-spin"
                                : ""
                        }
                    />

                    Refresh

                </button>

            }
        >

            <div className="relative h-[280px] overflow-hidden rounded-lg border border-slate-800 bg-slate-950">


                {/* =================================================
                    MAP GRID
                ================================================== */}

                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage:
                            "linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)",
                        backgroundSize:
                            "40px 40px",
                    }}
                />


                {/* =================================================
                    ROAD LINES
                ================================================== */}

                <div className="absolute left-[15%] top-[55%] h-px w-[70%] rotate-[-15deg] bg-slate-700" />

                <div className="absolute left-[20%] top-[35%] h-px w-[65%] rotate-[20deg] bg-slate-700" />

                <div className="absolute left-[45%] top-[10%] h-[80%] w-px rotate-[12deg] bg-slate-700" />

                <div className="absolute left-[5%] top-[75%] h-px w-[90%] rotate-[5deg] bg-slate-800" />

                <div className="absolute left-[65%] top-[5%] h-[90%] w-px rotate-[-8deg] bg-slate-800" />


                {/* =================================================
                    LOADING
                ================================================== */}

                {loading && vehicles.length === 0 && (

                    <div className="absolute inset-0 flex items-center justify-center">

                        <div className="rounded-lg border border-slate-800 bg-slate-900/95 px-4 py-3">

                            <div className="flex items-center gap-2">

                                <RefreshCw
                                    size={13}
                                    className="animate-spin text-blue-400"
                                />

                                <span className="text-[10px] text-slate-400">
                                    Loading live fleet...
                                </span>

                            </div>

                        </div>

                    </div>

                )}


                {/* =================================================
                    ERROR
                ================================================== */}

                {!loading &&
                    error &&
                    vehicles.length === 0 && (

                        <div className="absolute inset-0 flex items-center justify-center p-5">

                            <div className="rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-center">

                                <p className="text-[10px] font-medium text-red-300">
                                    Unable to load fleet tracking
                                </p>

                                <p className="mt-1 text-[9px] text-red-400/70">
                                    {error}
                                </p>

                                <button
                                    type="button"
                                    onClick={fetchLiveTracking}
                                    className="mt-2 text-[9px] font-semibold text-blue-400 hover:text-blue-300"
                                >
                                    Try again
                                </button>

                            </div>

                        </div>

                    )}


                {/* =================================================
                    NO ACTIVE VEHICLES
                ================================================== */}

                {!loading &&
                    !error &&
                    vehicles.length === 0 && (

                        <div className="absolute inset-0 flex items-center justify-center">

                            <div className="rounded-lg border border-slate-800 bg-slate-900/95 px-4 py-3 text-center">

                                <Truck
                                    size={18}
                                    className="mx-auto text-slate-600"
                                />

                                <p className="mt-2 text-[10px] text-slate-500">
                                    No active vehicles
                                </p>

                                <p className="mt-1 text-[9px] text-slate-700">
                                    Live fleet locations will appear here
                                </p>

                            </div>

                        </div>

                    )}


                {/* =================================================
                    VEHICLES
                ================================================== */}

                {vehicles.map(
                    (vehicle, index) => {

                        const vehicleName =
                            getVehicleName(
                                vehicle
                            );

                        const driverName =
                            getDriverName(
                                vehicle
                            );


                        return (

                            <div
                                key={
                                    vehicle.id ||
                                    vehicle.tracking_id ||
                                    `${vehicleName}-${index}`
                                }
                                className={`absolute ${
                                    positions[
                                        index %
                                        positions.length
                                    ]
                                }`}
                            >

                                <div className="relative">

                                    {/* VEHICLE ICON */}

                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 shadow-lg shadow-blue-600/30">

                                        <Truck
                                            size={16}
                                            className="text-white"
                                        />

                                    </div>


                                    {/* ONLINE INDICATOR */}

                                    <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-emerald-400" />

                                </div>


                                {/* VEHICLE INFO */}

                                <div className="mt-2 min-w-[90px] rounded-md border border-slate-800 bg-slate-900/95 px-2 py-1 shadow-xl">

                                    <p className="truncate text-[9px] font-semibold text-white">
                                        {vehicleName}
                                    </p>

                                    <p className="truncate text-[8px] text-slate-500">
                                        {driverName}
                                    </p>

                                </div>

                            </div>

                        );

                    }
                )}


                {/* =================================================
                    MAP LABEL
                ================================================== */}

                <div className="absolute left-3 top-3 flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2">

                    <MapPinned
                        size={14}
                        className="text-blue-400"
                    />

                    <span className="text-[9px] text-slate-400">
                        Live fleet location
                    </span>

                </div>


                {/* =================================================
                    MAP STATS
                ================================================== */}

                <div className="absolute bottom-3 left-3 right-3 flex gap-2">

                    {/* ACTIVE */}

                    <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/95 px-3 py-2">

                        <Navigation
                            size={13}
                            className="text-emerald-400"
                        />

                        <span className="text-[9px] text-slate-400">

                            {vehicles.length} active

                        </span>

                    </div>


                    {/* UPDATED */}

                    <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/95 px-3 py-2">

                        <Clock3
                            size={13}
                            className="text-blue-400"
                        />

                        <span className="text-[9px] text-slate-400">

                            {getUpdateText()}

                        </span>

                    </div>

                </div>

            </div>

        </Card>

    );

}


export default LiveTracking;