import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const [user, setUser] = useState({
        id: 1,
        name: "Admin Manager",
        email: "admin@routex.com",
        role: "Super Admin",
        initials: "AM",
    });

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "Shipment delayed",
            message: "Shipment SHP-1042 is running 45 minutes late.",
            type: "warning",
            read: false,
            time: "10 min ago",
        },
        {
            id: 2,
            title: "Vehicle maintenance",
            message: "Vehicle VH-204 requires scheduled maintenance.",
            type: "info",
            read: false,
            time: "25 min ago",
        },
        {
            id: 3,
            title: "Shipment delivered",
            message: "Shipment SHP-1038 has been delivered successfully.",
            type: "success",
            read: true,
            time: "1 hour ago",
        },
    ]);

    const [theme, setTheme] = useState("dark");

    const unreadNotifications = notifications.filter(
        (notification) => !notification.read
    ).length;

    const toggleSidebar = () => {
        setSidebarOpen((previous) => !previous);
    };

    const markNotificationAsRead = (id) => {
        setNotifications((previous) =>
            previous.map((notification) =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const markAllNotificationsAsRead = () => {
        setNotifications((previous) =>
            previous.map((notification) => ({
                ...notification,
                read: true,
            }))
        );
    };

    const changeTheme = (newTheme) => {
        setTheme(newTheme);
    };

    const updateUser = (updatedUser) => {
        setUser((previous) => ({
            ...previous,
            ...updatedUser,
        }));
    };

    const value = {
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,

        user,
        setUser,
        updateUser,

        notifications,
        unreadNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,

        theme,
        setTheme,
        changeTheme,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error(
            "useApp must be used inside an AppProvider"
        );
    }

    return context;
}