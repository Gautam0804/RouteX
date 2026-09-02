import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

// =====================================================
// LAYOUT
// =====================================================

import Layout from "./components/layout/Layout";

// =====================================================
// AUTH
// =====================================================

import Login from "./pages/Login";

// =====================================================
// PAGES
// =====================================================

import Dashboard from "./pages/Dashboard";
import Shipments from "./pages/Shipments";
import ShipmentDetails from "./pages/ShipmentDetails";

import Vehicles from "./pages/Vehicles";
import Drivers from "./pages/Drivers";
import Customers from "./pages/Customers";
import Assignments from "./pages/Assignments";
import Tracking from "./pages/Tracking";
import Analytics from "./pages/Analytics";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";

// =====================================================
// FORMS
// =====================================================

import ShipmentForm from "./pages/ShipmentForm";
import VehicleForm from "./pages/VehicleForm";
import DriverForm from "./pages/DriverForm";
import CustomerForm from "./pages/CustomerForm";
import AssignmentForm from "./pages/AssignmentForm";

// =====================================================
// AUTHENTICATION
// =====================================================

const isAuthenticated = () => {

    const token =
        localStorage.getItem("routex_token") ||
        localStorage.getItem("token");

    return Boolean(token);
};


// =====================================================
// PROTECTED ROUTE
// =====================================================

function ProtectedRoute({ children }) {

    if (!isAuthenticated()) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }

    return children;
}


// =====================================================
// PUBLIC ROUTE
// =====================================================

function PublicRoute({ children }) {

    if (isAuthenticated()) {

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );

    }

    return children;
}


// =====================================================
// APP
// =====================================================

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =================================================
                    LOGIN
                ================================================== */}

                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />


                {/* =================================================
                    ROOT
                ================================================== */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to={
                                isAuthenticated()
                                    ? "/dashboard"
                                    : "/login"
                            }
                            replace
                        />
                    }
                />


                {/* =================================================
                    PROTECTED APPLICATION
                ================================================== */}

                <Route
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >

                    {/* =================================================
                        DASHBOARD
                    ================================================= */}

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />


                    {/* =================================================
                        SHIPMENTS
                    ================================================= */}

                    <Route
                        path="/shipments"
                        element={<Shipments />}
                    />

                    <Route
                        path="/shipments/new"
                        element={<ShipmentForm />}
                    />

                    <Route
                        path="/shipments/:id"
                        element={<ShipmentDetails />}
                    />


                    {/* =================================================
                        VEHICLES
                    ================================================= */}

                    <Route
                        path="/vehicles"
                        element={<Vehicles />}
                    />

                    <Route
                        path="/vehicles/new"
                        element={<VehicleForm />}
                    />

                    <Route
                        path="/vehicles/:id/edit"
                        element={<VehicleForm />}
                    />


                    {/* =================================================
                        DRIVERS
                    ================================================= */}

                    <Route
                        path="/drivers"
                        element={<Drivers />}
                    />

                    <Route
                        path="/drivers/new"
                        element={<DriverForm />}
                    />

                    <Route
                        path="/drivers/:id/edit"
                        element={<DriverForm />}
                    />


                    {/* =================================================
                        CUSTOMERS
                    ================================================= */}

                    <Route
                        path="/customers"
                        element={<Customers />}
                    />

                    <Route
                        path="/customers/new"
                        element={<CustomerForm />}
                    />

                    <Route
                        path="/customers/:id/edit"
                        element={<CustomerForm />}
                    />


                    {/* =================================================
                        ASSIGNMENTS
                    ================================================= */}

                    <Route
                        path="/assignments"
                        element={<Assignments />}
                    />

                    <Route
                        path="/assignments/new"
                        element={<AssignmentForm />}
                    />


                    {/* =================================================
                        TRACKING
                    ================================================= */}

                    <Route
                        path="/tracking"
                        element={<Tracking />}
                    />

                    <Route
                        path="/tracking/assignment/:assignmentId"
                        element={<Tracking />}
                    />

                    <Route
                        path="/tracking/:assignmentId"
                        element={<Tracking />}
                    />


                    {/* =================================================
                        ANALYTICS
                    ================================================= */}

                    <Route
                        path="/analytics"
                        element={<Analytics />}
                    />


                    {/* =================================================
                        ALERTS
                    ================================================= */}

                    <Route
                        path="/alerts"
                        element={<Alerts />}
                    />


                    {/* =================================================
                        REPORTS
                    ================================================= */}

                    <Route
                        path="/reports"
                        element={<Reports />}
                    />


                    {/* =================================================
                        USERS
                    ================================================= */}

                    <Route
                        path="/users"
                        element={<Users />}
                    />


                    {/* =================================================
                        SETTINGS
                    ================================================= */}

                    <Route
                        path="/settings"
                        element={<Settings />}
                    />

                </Route>


                {/* =================================================
                    404
                ================================================= */}

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>

        </BrowserRouter>

    );

}


export default App;