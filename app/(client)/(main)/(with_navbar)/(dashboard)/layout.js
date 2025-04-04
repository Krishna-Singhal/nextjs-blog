"use client";

import React, { useEffect } from "react";
import Sidebar from "@components/dashboard/Sidebar";
import { useUser } from "@context/UserContext";
import { useRouter } from "next/navigation";

const SettingsLayout = ({ children }) => {
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!user.access_token) {
            router.push("/m/signin");
        }
    }, [user, router]);
    return user.access_token && <Sidebar>{children}</Sidebar>;
};

export default SettingsLayout;
