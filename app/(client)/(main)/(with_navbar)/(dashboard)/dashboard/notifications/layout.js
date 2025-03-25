"use client"

import { NotificationProvider } from "@context/NotificationContext";
import React from "react";

const NotificationLayout = ({ children }) => {
    return <NotificationProvider>{children}</NotificationProvider>;
};

export default NotificationLayout;
