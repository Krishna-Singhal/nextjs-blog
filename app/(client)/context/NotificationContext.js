"use client";

import { createContext, useContext, useState } from "react";

const notificationStructure = {
    type: "",
    blog: {},
    user: { personal_info: {} },
    comment: {
        comment: "",
        parentComment: {},
    },
    seen: "true",
    createdAt: "",
    reply: {},
};

const NotificationContext = createContext({});

export const NotificationProvider = ({ children }) => {
    const [filter, setFilter] = useState("all");
    const [notifications, setNotifications] = useState([]);
    let filters = [
        { id: "all", name: "all" },
        { id: "like", name: "like" },
        { id: "comment", name: "comment" },
        { id: "reply", name: "reply" },
    ];

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                setNotifications,
                notificationStructure,
                filter,
                setFilter,
                filters,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
