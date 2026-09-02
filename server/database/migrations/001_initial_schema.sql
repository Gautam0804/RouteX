USE routex;


-- ============================================================
-- ROLES
-- ============================================================

INSERT INTO roles
    (name, description)
VALUES
    (
        'super_admin',
        'Full access to RouteX'
    ),
    (
        'fleet_manager',
        'Manage fleet operations'
    ),
    (
        'dispatcher',
        'Manage shipments and assignments'
    ),
    (
        'driver',
        'Driver access'
    );


-- ============================================================
-- CUSTOMERS
-- ============================================================

INSERT INTO customers
(
    customer_code,
    company_name,
    contact_person,
    email,
    phone,
    address_line1,
    city,
    state,
    postal_code
)
VALUES
(
    'CUS-1001',
    'Acme Retail Pvt Ltd',
    'Rahul Sharma',
    'rahul@acmeretail.com',
    '+91-9876543210',
    'Connaught Place',
    'New Delhi',
    'Delhi',
    '110001'
),
(
    'CUS-1002',
    'TechNova Solutions',
    'Priya Singh',
    'priya@technova.com',
    '+91-9876543211',
    'Whitefield Main Road',
    'Bengaluru',
    'Karnataka',
    '560066'
),
(
    'CUS-1003',
    'GlobalMart India',
    'Amit Verma',
    'amit@globalmart.com',
    '+91-9876543212',
    'Andheri East',
    'Mumbai',
    'Maharashtra',
    '400069'
);


-- ============================================================
-- VEHICLES
-- ============================================================

INSERT INTO vehicles
(
    vehicle_number,
    registration_number,
    vehicle_type,
    manufacturer,
    model,
    manufacture_year,
    capacity_kg,
    fuel_type,
    status,
    current_latitude,
    current_longitude,
    odometer_km
)
VALUES
(
    'TRK-1001',
    'DL01AB1234',
    'Heavy Truck',
    'Tata',
    'Prima',
    2023,
    12000,
    'diesel',
    'available',
    28.6139,
    77.2090,
    45210.50
),
(
    'TRK-1002',
    'MH02CD5678',
    'Medium Truck',
    'Ashok Leyland',
    'Dost',
    2024,
    7000,
    'diesel',
    'in_transit',
    19.0760,
    72.8777,
    28340.20
),
(
    'TRK-1003',
    'KA03EF9012',
    'Delivery Van',
    'Mahindra',
    'Bolero Pikup',
    2024,
    3500,
    'diesel',
    'available',
    12.9716,
    77.5946,
    19870.40
);


-- ============================================================
-- DRIVERS
-- ============================================================

INSERT INTO drivers
(
    employee_code,
    first_name,
    last_name,
    phone,
    email,
    license_number,
    license_expiry_date,
    experience_years,
    status,
    rating,
    total_deliveries
)
VALUES
(
    'DRV-1001',
    'Raj',
    'Kumar',
    '+91-9000000001',
    'raj.kumar@routex.com',
    'DL-0123456789',
    '2028-12-31',
    6.5,
    'available',
    4.80,
    642
),
(
    'DRV-1002',
    'Vikram',
    'Singh',
    '+91-9000000002',
    'vikram.singh@routex.com',
    'MH-9876543210',
    '2027-10-31',
    8.0,
    'on_trip',
    4.70,
    821
),
(
    'DRV-1003',
    'Arjun',
    'Yadav',
    '+91-9000000003',
    'arjun.yadav@routex.com',
    'KA-4567890123',
    '2029-06-30',
    4.0,
    'available',
    4.60,
    389
);