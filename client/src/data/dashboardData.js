// =====================================================
// RouteX Dashboard Data
// =====================================================

// -----------------------------------------------------
// STAT CARDS
// -----------------------------------------------------

export const stats = [
    {
        title: "Total Shipments",
        value: "1,248",
        trend: 12.5,
        icon: "shipments",
    },
    {
        title: "Active Vehicles",
        value: "86",
        trend: 8.2,
        icon: "vehicles",
    },
    {
        title: "Active Drivers",
        value: "74",
        trend: 5.7,
        icon: "drivers",
    },
    {
        title: "Delivered",
        value: "1,024",
        trend: 14.8,
        icon: "delivered",
    },
    {
        title: "Pending",
        value: "142",
        trend: -3.4,
        icon: "pending",
    },
    {
        title: "Alerts",
        value: "12",
        trend: -8.1,
        icon: "alerts",
    },
];


// -----------------------------------------------------
// LIVE TRACKING
// -----------------------------------------------------

export const liveTracking = [
    {
        id: "VT-1001",
        vehicle: "TRK-204",
        driver: "Rajesh Kumar",
        status: "In Transit",
        location: "Delhi",
        destination: "Jaipur",
    },
    {
        id: "VT-1002",
        vehicle: "TRK-118",
        driver: "Amit Sharma",
        status: "In Transit",
        location: "Gurugram",
        destination: "Agra",
    },
    {
        id: "VT-1003",
        vehicle: "VAN-052",
        driver: "Rahul Singh",
        status: "Out for Delivery",
        location: "Noida",
        destination: "Ghaziabad",
    },
    {
        id: "VT-1004",
        vehicle: "TRK-311",
        driver: "Vikas Yadav",
        status: "In Transit",
        location: "Faridabad",
        destination: "Delhi",
    },
];


// -----------------------------------------------------
// SHIPMENT STATUS
// -----------------------------------------------------

export const shipmentStatus = [
    {
        name: "Delivered",
        value: 1024,
        color: "text-emerald-400",
        barColor: "bg-emerald-500",
    },
    {
        name: "In Transit",
        value: 68,
        color: "text-blue-400",
        barColor: "bg-blue-500",
    },
    {
        name: "Pending",
        value: 142,
        color: "text-amber-400",
        barColor: "bg-amber-500",
    },
    {
        name: "Delayed",
        value: 14,
        color: "text-red-400",
        barColor: "bg-red-500",
    },
];


// -----------------------------------------------------
// SHIPMENT CHART
// -----------------------------------------------------

export const shipmentChart = [
    {
        day: "Mon",
        shipments: 145,
    },
    {
        day: "Tue",
        shipments: 182,
    },
    {
        day: "Wed",
        shipments: 156,
    },
    {
        day: "Thu",
        shipments: 214,
    },
    {
        day: "Fri",
        shipments: 198,
    },
    {
        day: "Sat",
        shipments: 173,
    },
    {
        day: "Sun",
        shipments: 121,
    },
];


// -----------------------------------------------------
// AI INSIGHTS
// -----------------------------------------------------

export const aiInsights = [
    {
        id: 1,
        type: "trend",
        title: "Delivery performance improved",
        description:
            "On-time delivery increased by 8.4% compared with the previous week.",
    },
    {
        id: 2,
        type: "warning",
        title: "Route congestion detected",
        description:
            "Delhi → Jaipur is currently experiencing higher than normal traffic.",
    },
    {
        id: 3,
        type: "trend",
        title: "Fleet utilization is healthy",
        description:
            "Current fleet utilization is at 82%, within the recommended operating range.",
    },
];


// -----------------------------------------------------
// VEHICLE STATUS
// -----------------------------------------------------

export const vehicleStatus = [
    {
        status: "Active",
        count: 86,
        description: "Currently operational",
        color: "text-emerald-400",
    },
    {
        status: "Maintenance",
        count: 9,
        description: "Under service",
        color: "text-amber-400",
    },
    {
        status: "Idle",
        count: 17,
        description: "Available for assignment",
        color: "text-slate-400",
    },
];


// -----------------------------------------------------
// DRIVER PERFORMANCE
// -----------------------------------------------------

export const driverPerformance = [
    {
        id: 1,
        name: "Rajesh Kumar",
        initials: "RK",
        rating: 4.9,
        deliveries: 142,
    },
    {
        id: 2,
        name: "Amit Sharma",
        initials: "AS",
        rating: 4.8,
        deliveries: 136,
    },
    {
        id: 3,
        name: "Rahul Singh",
        initials: "RS",
        rating: 4.8,
        deliveries: 129,
    },
    {
        id: 4,
        name: "Vikas Yadav",
        initials: "VY",
        rating: 4.7,
        deliveries: 121,
    },
];


// -----------------------------------------------------
// TOP ROUTES
// -----------------------------------------------------

export const topRoutes = [
    {
        id: 1,
        from: "Delhi",
        to: "Jaipur",
        shipments: 186,
        successRate: 96,
    },
    {
        id: 2,
        from: "Mumbai",
        to: "Pune",
        shipments: 164,
        successRate: 98,
    },
    {
        id: 3,
        from: "Delhi",
        to: "Agra",
        shipments: 142,
        successRate: 95,
    },
    {
        id: 4,
        from: "Bengaluru",
        to: "Chennai",
        shipments: 128,
        successRate: 97,
    },
];


// -----------------------------------------------------
// SHIPMENTS
// -----------------------------------------------------

export const shipments = [
    {
        id: "SHP-10001",
        customer: "Amazon Logistics",
        route: "Delhi → Jaipur",
        vehicle: "TRK-204",
        driver: "Rajesh Kumar",
        priority: "High",
        status: "In Transit",
        eta: "Today, 4:30 PM",
    },

    {
        id: "SHP-10002",
        customer: "Flipkart Supply",
        route: "Mumbai → Pune",
        vehicle: "TRK-118",
        driver: "Amit Sharma",
        priority: "Normal",
        status: "Delivered",
        eta: "Delivered",
    },

    {
        id: "SHP-10003",
        customer: "Reliance Retail",
        route: "Delhi → Agra",
        vehicle: "VAN-052",
        driver: "Rahul Singh",
        priority: "High",
        status: "Out for Delivery",
        eta: "Today, 2:15 PM",
    },

    {
        id: "SHP-10004",
        customer: "DHL Express",
        route: "Bengaluru → Chennai",
        vehicle: "TRK-311",
        driver: "Vikas Yadav",
        priority: "Normal",
        status: "In Transit",
        eta: "Tomorrow, 10:00 AM",
    },

    {
        id: "SHP-10005",
        customer: "Tata Consumer",
        route: "Pune → Nashik",
        vehicle: "TRK-089",
        driver: "Suresh Verma",
        priority: "Low",
        status: "Delivered",
        eta: "Delivered",
    },

    {
        id: "SHP-10006",
        customer: "ITC Limited",
        route: "Kolkata → Ranchi",
        vehicle: "TRK-145",
        driver: "Manoj Gupta",
        priority: "Normal",
        status: "Delayed",
        eta: "Tomorrow, 6:30 PM",
    },

    {
        id: "SHP-10007",
        customer: "Walmart India",
        route: "Hyderabad → Bengaluru",
        vehicle: "TRK-267",
        driver: "Deepak Rao",
        priority: "High",
        status: "Pending",
        eta: "Not assigned",
    },

    {
        id: "SHP-10008",
        customer: "Mahindra Logistics",
        route: "Chennai → Coimbatore",
        vehicle: "VAN-091",
        driver: "Arjun Patel",
        priority: "Normal",
        status: "In Transit",
        eta: "Today, 8:45 PM",
    },
];


// -----------------------------------------------------
// ALERTS
// -----------------------------------------------------

export const alerts = [
    {
        id: 1,
        severity: "high",
        title: "Shipment delayed",
        description:
            "SHP-10006 is delayed due to unexpected traffic conditions.",
        time: "12 min ago",
    },

    {
        id: 2,
        severity: "medium",
        title: "Vehicle service due",
        description:
            "TRK-145 has reached its scheduled maintenance interval.",
        time: "34 min ago",
    },

    {
        id: 3,
        severity: "medium",
        title: "Driver document expiring",
        description:
            "A driver compliance document will expire within 7 days.",
        time: "1 hr ago",
    },

    {
        id: 4,
        severity: "low",
        title: "Route completed",
        description:
            "SHP-10002 has successfully reached its destination.",
        time: "2 hrs ago",
    },
];